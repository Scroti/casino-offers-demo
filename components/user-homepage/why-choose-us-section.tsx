'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Award,
  FileText,
  Smartphone,
  Star,
  ChevronRight,
  Globe,
  Users,
  DollarSign,
  Star as StarIcon
} from 'lucide-react';
import { feAppConfig } from '@/public/configs/app.config';

export function WhyChooseUsSection() {
  const appName = feAppConfig.branding.AppName;

  const features = [
    {
      icon: Award,
      title: 'Helping players for 30 years',
      description: 'With three decades of experience, we\'ve perfected our processes and built a reputation as the most trusted source on online gambling.',
    },
    {
      icon: FileText,
      title: 'Real expert writers',
      description: 'The Casino.org team boasts experienced content editors, published authors, data analysts, historians, and game strategists.',
    },
    {
      icon: Smartphone,
      title: 'Rigorous 25-step review process',
      description: 'Don\'t just take our word for it. Our methodical, data-driven approach reviews your whole casino experience, from sign-up to withdrawal.',
    },
  ];

  const stats = [
    {
      value: '1m+',
      label: 'players per week',
    },
    {
      value: '100+',
      label: 'countries served top-quality content',
    },
    {
      value: '$37m+',
      label: 'winnings claimed by our readers',
    },
    {
      value: '4.4',
      label: 'star user rating on Trustpilot',
    },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Why Choose Us Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-8">
            Why use <span className="text-primary">{appName}</span>?
          </h2>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="bg-background border border-border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trusted by Players Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-12">
            Trusted by players worldwide
          </h2>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-primary/5 border border-primary/20 shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recognition Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            You might recognize us <span className="text-primary">from...</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            We're proud to have featured in many trusted publications around the world.
          </p>
          
          {/* Placeholder for logos */}
          <div className="flex items-center justify-center space-x-8 opacity-50">
            <div className="text-muted-foreground text-sm">Featured in trusted publications</div>
          </div>
        </div>
      </div>
    </section>
  );
}

