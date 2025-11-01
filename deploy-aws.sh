#!/bin/bash

# ============================================
# AWS Deployment Script for Casino Offers
# Simplifies the deployment process
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REGION="us-east-1"
CLUSTER_NAME="casino-offers-cluster"
SERVICE_BACKEND="casino-backend-service"
SERVICE_FRONTEND="casino-frontend-service"
VPC_CIDR="10.0.0.0/16"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    log_info "Checking requirements..."
    
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    log_info "Requirements check passed ✓"
}

setup_aws_credentials() {
    log_info "Setting up AWS credentials..."
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null || echo "")
    
    if [ -z "$AWS_ACCOUNT_ID" ]; then
        log_error "AWS credentials not configured. Please run 'aws configure'"
        exit 1
    fi
    
    log_info "AWS Account ID: $AWS_ACCOUNT_ID"
}

login_to_ecr() {
    log_info "Logging into Amazon ECR..."
    aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com
    log_info "Logged into ECR ✓"
}

create_ecr_repositories() {
    log_info "Creating ECR repositories..."
    
    # Create backend repository if it doesn't exist
    if ! aws ecr describe-repositories --repository-names casino-backend --region $REGION &>/dev/null; then
        aws ecr create-repository --repository-name casino-backend --region $REGION
        log_info "Created casino-backend repository ✓"
    else
        log_warn "Repository casino-backend already exists"
    fi
    
    # Create frontend repository if it doesn't exist
    if ! aws ecr describe-repositories --repository-names casino-frontend --region $REGION &>/dev/null; then
        aws ecr create-repository --repository-name casino-frontend --region $REGION
        log_info "Created casino-frontend repository ✓"
    else
        log_warn "Repository casino-frontend already exists"
    fi
}

build_and_push_backend() {
    log_info "Building and pushing backend image..."
    
    cd server
    
    # Build image
    docker build -t casino-backend:latest .
    
    # Tag and push
    docker tag casino-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/casino-backend:latest
    docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/casino-backend:latest
    
    cd ..
    
    log_info "Backend image pushed ✓"
}

build_and_push_frontend() {
    log_info "Building and pushing frontend image..."
    
    # Check if ALB exists to get backend URL
    ALB_DNS=$(aws elbv2 describe-load-balancers --query "LoadBalancers[?LoadBalancerName=='casino-offers-alb'].DNSName" --output text 2>/dev/null || echo "")
    
    if [ -z "$ALB_DNS" ]; then
        log_warn "ALB not found. Using placeholder URL. You'll need to rebuild after ALB is created."
        BACKEND_URL="http://placeholder-backend-url"
    else
        BACKEND_URL="http://$ALB_DNS"
        log_info "Found ALB DNS: $ALB_DNS"
    fi
    
    # Build image with build arg
    docker build --build-arg NEXT_PUBLIC_API_URL=$BACKEND_URL/api/v1 -t casino-frontend:latest .
    
    # Tag and push
    docker tag casino-frontend:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/casino-frontend:latest
    docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/casino-frontend:latest
    
    log_info "Frontend image pushed ✓"
}

create_infrastructure() {
    log_info "Creating infrastructure..."
    log_warn "This will create VPC, subnets, security groups, ALB, and ECS cluster"
    read -p "Do you want to continue? (y/n) " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Infrastructure creation skipped"
        return
    fi
    
    # Call infrastructure creation script
    if [ -f "create-infrastructure.sh" ]; then
        bash create-infrastructure.sh
    else
        log_warn "Infrastructure script not found. Please create infrastructure manually."
        log_info "See AWS_DEPLOYMENT.md for manual setup instructions"
    fi
}

deploy_services() {
    log_info "Deploying ECS services..."
    
    # Check if cluster exists
    if ! aws ecs describe-clusters --clusters $CLUSTER_NAME --region $REGION --query 'clusters[0].status' --output text 2>/dev/null | grep -q "ACTIVE"; then
        log_error "ECS cluster '$CLUSTER_NAME' not found"
        log_info "Please create infrastructure first"
        exit 1
    fi
    
    # Update backend service
    if aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_BACKEND --region $REGION --query 'services[0].status' --output text | grep -q "ACTIVE"; then
        log_info "Updating backend service..."
        aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_BACKEND --force-new-deployment --region $REGION
        log_info "Backend service updating..."
    else
        log_warn "Backend service not found. Please create it manually."
    fi
    
    # Update frontend service
    if aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_FRONTEND --region $REGION --query 'services[0].status' --output text | grep -q "ACTIVE"; then
        log_info "Updating frontend service..."
        aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_FRONTEND --force-new-deployment --region $REGION
        log_info "Frontend service updating..."
    else
        log_warn "Frontend service not found. Please create it manually."
    fi
}

show_urls() {
    log_info "Fetching service URLs..."
    
    ALB_DNS=$(aws elbv2 describe-load-balancers --query "LoadBalancers[?LoadBalancerName=='casino-offers-alb'].DNSName" --output text 2>/dev/null || echo "")
    
    if [ -z "$ALB_DNS" ]; then
        log_warn "ALB not found"
    else
        echo ""
        echo -e "${GREEN}=========================================="
        echo "Deployment URLs:"
        echo "==========================================${NC}"
        echo -e "Frontend: ${GREEN}http://$ALB_DNS${NC}"
        echo -e "Backend API: ${GREEN}http://$ALB_DNS/api/v1${NC}"
        echo -e "Swagger Docs: ${GREEN}http://$ALB_DNS/api/v1/swagger${NC}"
        echo -e "${GREEN}==========================================${NC}"
        echo ""
    fi
}

show_usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Options:
    --build-only        Only build and push images (no deployment)
    --deploy-only       Only deploy services (assumes images are already pushed)
    --infra-only        Only create infrastructure
    --help              Show this help message

Examples:
    # Full deployment
    $0

    # Build images only
    $0 --build-only

    # Deploy only (assumes infrastructure exists)
    $0 --deploy-only

EOF
}

# Main
main() {
    echo ""
    echo -e "${GREEN}"
    echo "=========================================="
    echo "  Casino Offers - AWS Deployment Tool"
    echo "=========================================="
    echo -e "${NC}"
    echo ""
    
    # Parse arguments
    BUILD_ONLY=false
    DEPLOY_ONLY=false
    INFRA_ONLY=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --build-only)
                BUILD_ONLY=true
                shift
                ;;
            --deploy-only)
                DEPLOY_ONLY=true
                shift
                ;;
            --infra-only)
                INFRA_ONLY=true
                shift
                ;;
            --help)
                show_usage
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Run checks
    check_requirements
    setup_aws_credentials
    
    # Run based on flags
    if [ "$INFRA_ONLY" = true ]; then
        create_infrastructure
    elif [ "$BUILD_ONLY" = true ]; then
        login_to_ecr
        create_ecr_repositories
        build_and_push_backend
        build_and_push_frontend
    elif [ "$DEPLOY_ONLY" = true ]; then
        deploy_services
        show_urls
    else
        # Full deployment
        login_to_ecr
        create_ecr_repositories
        build_and_push_backend
        build_and_push_frontend
        create_infrastructure
        deploy_services
        show_urls
    fi
    
    log_info "Deployment script completed!"
}

# Run main function
main "$@"


