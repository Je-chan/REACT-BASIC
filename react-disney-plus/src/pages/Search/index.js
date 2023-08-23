import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../../api/axios';

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  let query = useQuery();
  const searchTerm = query.get('q');

  const fetchSearchMovie = async (searchTerm) => {
    try {
      const response = await axios.get(
        `/search/multi?include_adult=false&query=${searchTerm}`
      );
      setSearchResults(response.data.results);
      console.log('response', response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchSearchMovie(searchTerm);
    }
  }, [searchTerm]);

  return <div></div>;
};

export default Search;
