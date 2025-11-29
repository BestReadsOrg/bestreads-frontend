'use client';

import React, { useState } from 'react';
import { Section } from '@/packages/shared/components/layout';
import { Input } from '@/packages/shared/components/input';
import { Button } from '@/packages/shared/components/button';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // In production, call your newsletter API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Thank you for subscribing! Check your email for confirmation.');
      setEmail('');
    } catch {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section
      id="newsletter"
      background="dark"
      padding="xl"
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Join Our Reading Community
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Get weekly reading recommendations, tips, and exclusive features delivered to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={setEmail}
            required
            className="flex-1"
          />
          <Button
            label="Subscribe"
            action="submit-newsletter"
            variant="primary"
            size="lg"
            loading={loading}
            type="submit"
          />
        </form>

        {message && (
          <p className={`mt-4 ${message.includes('Thank') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}

        <p className="mt-6 text-sm text-gray-400">
          No spam. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </Section>
  );
};
