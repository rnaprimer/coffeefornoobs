import React from 'react';
import { ThumbsUp, Award, Tag, MessageCircle } from 'lucide-react';
import Container from '../layout/Container';

const features = [
  {
    icon: ThumbsUp,
    title: 'Beginner First',
    description: 'Simple guides and gear picked for noobs.',
  },
  {
    icon: Award,
    title: 'Honest Reviews',
    description: 'No fluff. Real pros, real cons.',
  },
  {
    icon: Tag,
    title: 'Best Value',
    description: 'Get the best coffee without overpaying.',
  },
  {
    icon: MessageCircle,
    title: 'Always Here',
    description: "We're here to help you brew better.",
  },
];

export default function FeaturesStrip() {
  return (
    <section className="bg-brand-white py-8 border-b border-brand-dark">
      <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div key={idx} className="flex flex-col md:flex-row items-start gap-4">
              <Icon size={24} className="text-brand-dark shrink-0 mt-1" />
              <div>
                <h3 className="font-black uppercase tracking-tight text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </Container>
    </section>
  );
}
