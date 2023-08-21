import axios from '../api/axios';
import React, { useState, useEffect } from 'react';
import requests from '../api/request';
import './Banner.css';

const Banner = () => {
  const [movie, setMovie] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(requests.fetchNowPlaying);

    const movieId =
      res.data.results[Math.floor(Math.random() * res.data.results.length)].id;

    const { data: movieDetail } = await axios.get(`movie/${movieId}`, {
      params: { append_to_response: 'videos' },
    });

    setMovie(movieDetail);
  };

  const truncate = (str, n) => {
    console.log(str);
    if (str == null || str.length === 0) return '';
    return str?.length > n ? str.substring(0, n) + '...' : str;
  };

  return (
    <header
      className="banner"
      style={{
        backgroundImage: `url('https://image.tmdb.org/t/p/original/${movie.backdrop_path}')`,
        backgroundPosition: 'top center',
        backgroundSize: 'cover',
      }}
    >
      <div className="banner__contents">
        <h1 className="banner__title">
          {movie.title || movie.name || movie.original_name}
        </h1>

        <div className="banner__buttons">
          {movie?.videos?.results[0]?.key && (
            <button className="banner__button play">Play</button>
          )}
        </div>

        <p className="banner__description">{truncate(movie.overview, 100)}</p>
      </div>
      <div className="banner-- fadeBottom"></div>
    </header>
  );
};

export default Banner;
