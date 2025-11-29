'use client';

import React from 'react';
import { Section } from '@/packages/shared/components/layout';
import { TestimonialCardData } from '@/packages/shared/components/card';

interface TestimonialsProps {
  testimonials: TestimonialCardData[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  return (
    <Section
      id="testimonials"
      subtitle="Testimonials"
      title="Loved by Readers Worldwide"
      description="Join thousands of happy readers who have transformed their reading habits."
      background="gradient"
    >
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Rating */}
            <div className="flex gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">★</span>
              ))}
            </div>

            {/* Comment */}
            <p className="text-gray-700 mb-6 leading-relaxed">
              &quot;{testimonial.comment}&quot;
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {testimonial.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                {testimonial.role && (
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};
