// useMatchFetcher.js
import { useState } from 'react';
import axios from 'axios';

const useMatchFetcher = (playerId, apiKey) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMore, setIsMore] = useState(true);
  const [nextRating, setNextRating] = useState(null);
  const [nextNormal, setNextNormal] = useState(null);

  const fetchMatches = async (gameTypeId, nextToken = null, limit = 30) => {
    let url = `/cy/players/${playerId}/matches?gameTypeId=${gameTypeId}&limit=${limit}&apikey=${apiKey}`;

    if (nextToken) {
      url += `&next=${nextToken}`;
    } else {
      const currentDate = new Date();
      const startDate = new Date(currentDate.getTime() - (90 * 24 * 60 * 60 * 1000));
      const formattedStartDate = `${startDate.getFullYear()}${(startDate.getMonth() + 1).toString().padStart(2, '0')}${startDate.getDate().toString().padStart(2, '0')}T${startDate.getHours().toString().padStart(2, '0')}${startDate.getMinutes().toString().padStart(2, '0')}`;
      const formattedEndDate = `${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}T${currentDate.getHours().toString().padStart(2, '0')}${currentDate.getMinutes().toString().padStart(2, '0')}`;        
      url += `&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    }

    try {
      const response = await axios.get(url);
      const newMatches = response.data.matches.rows.map(match => ({
        ...match,
        gameTypeId
      }));
      setMatches(prevMatches => [...prevMatches, ...newMatches]);

      if (gameTypeId === 'rating') {
        setNextRating(response.data.matches.next);
      } else {
        setNextNormal(response.data.matches.next);
      }

      if (!response.data.matches.next) {
        if (gameTypeId === 'rating') {
          fetchMatches('normal');
        } else {
          setIsMore(false);
        }
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    } finally {
      if (gameTypeId === 'normal') {
        setLoading(false);
      }
    }
  };

  const loadMore = () => {
    if (nextRating) {
      fetchMatches('rating', nextRating);
    } else if (nextNormal) {
      fetchMatches('normal', nextNormal);
    }
  };

  return { matches, loading, isMore, loadMore, fetchMatches };
};

export default useMatchFetcher;
