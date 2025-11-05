'use client';

import { memo } from 'react';
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
import { appConfig } from '@/components/configs/appConfig';

export const WhyChooseUsSection = memo(function WhyChooseUsSection() {
  const appName = appConfig.branding.AppName;

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
    <section className="py-8 sm:py-12 lg:py-20 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Why Choose Us Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 sm:mb-8">
            Why use <span className="text-primary">{appName}</span>?
          </h2>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12 lg:mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="bg-background border border-border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trusted by Players Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8 lg:mb-12">
            Trusted by players worldwide
          </h2>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-primary/5 border border-primary/20 shadow-sm">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recognition Section */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            You might recognize us <span className="text-primary">from...</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
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
});

