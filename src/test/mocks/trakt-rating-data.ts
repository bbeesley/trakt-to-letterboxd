const ratingData = [
  {
    movie: {
      title: 'Star Wars',
      ids: {
        trakt: 7,
        tmdb: 11,
        slug: 'star-wars-1977',
        imdb: 'tt0076759',
      },
      year: 1977,
    },
    rating: 8,
  },
  {
    movie: {
      title: 'Acts of Vengeance',
      ids: {
        trakt: 320_624,
        imdb: 'tt6288694',
        slug: 'acts-of-vengeance-2017',
        tmdb: 445_954,
      },
      year: 2017,
    },
    rating: 5,
  },
  {
    rating: 9,
    movie: {
      title: 'The Vanishing',
      ids: {
        trakt: 1089,
        slug: 'the-vanishing-1993',
        imdb: 'tt0108473',
        tmdb: 1644,
      },
      year: 1993,
    },
  },
  {
    movie: {
      year: 2017,
      ids: {
        tmdb: 419_192,
        imdb: 'tt5031332',
        slug: 'mclaren-2017',
        trakt: 288_682,
      },
      title: 'McLaren',
    },
  },
];

export default ratingData;
