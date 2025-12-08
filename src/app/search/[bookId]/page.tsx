'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { HeaderV2 } from '@/packages/shared/components/headerv2';
import { Container } from '@/packages/shared/components/layout';
import { LoadingSkeleton } from '@/packages/shared/components/loading/loading.component';
import useAuth from '@/hooks/useAuth';
import searchService from '@/services/searchService';

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;
  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookId) return;

    const fetchAndRedirect = async () => {
      setLoading(true);
      setError('');

      try {
        // Fetch default edition and redirect
        const defaultEdition = await searchService.getDefaultEdition(bookId);

        if (defaultEdition) {
          const editionKey = defaultEdition.key.replace('/books/', '');
          router.replace(`/search/${bookId}/edition/${editionKey}`);
        } else {
          setError('No editions available for this book');
          setLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load book details');
        setLoading(false);
      }
    };

    fetchAndRedirect();
  }, [bookId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <HeaderV2
          title="BestReads"
          userData={isAuthenticated ? {
            userId: user?.id || null,
            username: user?.username || null,
            email: user?.email || null,
            role: 'user',
            avatar: null,
          } : undefined}
        />
        <Container className="py-8">
          <LoadingSkeleton variant="section" message="Loading book details..." />
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <HeaderV2
          title="BestReads"
          userData={isAuthenticated ? {
            userId: user?.id || null,
            username: user?.username || null,
            email: user?.email || null,
            role: 'user',
            avatar: null,
          } : undefined}
        />
        <Container className="py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error}
            </h2>
            <button
              onClick={() => router.push('/search')}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ← Back to search
            </button>
          </div>
        </Container>
      </div>
    );
  }

  return null;
}
