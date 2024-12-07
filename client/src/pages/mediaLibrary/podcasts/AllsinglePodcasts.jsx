import React, { useState, useEffect } from 'react';
import customFetch from '@/utils/customFetch';
import PodcastsGrid from '@/components/mediaLibrary/podcasts/PodcastsGrid';

const AllsinglePodcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await customFetch.get('/podcasts/singles');
        console.log({response});
        setPodcasts(response.data.podcasts || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Single Podcasts</h1>
      <PodcastsGrid 
        podcasts={podcasts}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default AllsinglePodcasts;