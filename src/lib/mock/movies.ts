import type { CastMember } from '@/types/media';
import type { ProviderId } from '@/types/provider';

export interface MockEntry {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  overview: string;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  genreIds: number[];
  tagline?: string;
  runtime?: number;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  flatrate?: ProviderId[];
  free?: ProviderId[];
  ads?: ProviderId[];
  rent?: ProviderId[];
  buy?: ProviderId[];
  cast?: CastMember[];
}

/**
 * Mock posters/backdrops are intentionally `null`: the app renders a styled
 * gradient placeholder instead of risking a broken image. Provider availability
 * is always populated so badge rendering is exercised with zero API keys.
 */
export const MOCK_MOVIES: MockEntry[] = [
  {
    id: 550,
    mediaType: 'movie',
    title: 'Fight Club',
    overview:
      'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground fight clubs forming in every town.',
    releaseDate: '1999-10-15',
    voteAverage: 8.433,
    voteCount: 28500,
    popularity: 62.4,
    genreIds: [18, 53],
    tagline: 'Mischief. Mayhem. Soap.',
    runtime: 139,
    flatrate: ['hulu', 'disney-plus'],
    rent: ['apple-tv-plus', 'prime-video'],
    buy: ['apple-tv-plus', 'prime-video', 'youtube'],
    cast: [
      { id: 287, name: 'Brad Pitt', character: 'Tyler Durden', profilePath: null },
      { id: 819, name: 'Edward Norton', character: 'The Narrator', profilePath: null },
      { id: 1283, name: 'Helena Bonham Carter', character: 'Marla Singer', profilePath: null },
      { id: 7470, name: 'Meat Loaf', character: 'Robert Paulson', profilePath: null },
      { id: 7499, name: 'Jared Leto', character: 'Angel Face', profilePath: null },
    ],
  },
  {
    id: 27205,
    mediaType: 'movie',
    title: 'Inception',
    overview:
      'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets, is offered a chance at redemption. The final job: plant an idea rather than steal one.',
    releaseDate: '2010-07-16',
    voteAverage: 8.44,
    voteCount: 35100,
    popularity: 88.1,
    genreIds: [28, 878, 12],
    tagline: 'Your mind is the scene of the crime.',
    runtime: 148,
    flatrate: ['netflix', 'prime-video'],
    rent: ['apple-tv-plus', 'youtube'],
    buy: ['apple-tv-plus', 'youtube', 'prime-video'],
    cast: [
      { id: 6193, name: 'Leonardo DiCaprio', character: 'Cobb', profilePath: null },
      { id: 24045, name: 'Joseph Gordon-Levitt', character: 'Arthur', profilePath: null },
      { id: 3895, name: 'Elliot Page', character: 'Ariadne', profilePath: null },
      { id: 2524, name: 'Tom Hardy', character: 'Eames', profilePath: null },
      { id: 27578, name: 'Marion Cotillard', character: 'Mal', profilePath: null },
    ],
  },
  {
    id: 157336,
    mediaType: 'movie',
    title: 'Interstellar',
    overview:
      "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    releaseDate: '2014-11-07',
    voteAverage: 8.44,
    voteCount: 33200,
    popularity: 79.7,
    genreIds: [12, 18, 878],
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    runtime: 169,
    flatrate: ['paramount-plus', 'prime-video'],
    rent: ['apple-tv-plus', 'youtube'],
    buy: ['apple-tv-plus', 'youtube'],
    cast: [
      { id: 10297, name: 'Matthew McConaughey', character: 'Cooper', profilePath: null },
      { id: 1813, name: 'Anne Hathaway', character: 'Brand', profilePath: null },
      { id: 1892, name: 'Jessica Chastain', character: 'Murph', profilePath: null },
      { id: 83002, name: 'Mackenzie Foy', character: 'Young Murph', profilePath: null },
      { id: 3896, name: 'Michael Caine', character: 'Professor Brand', profilePath: null },
    ],
  },
  {
    id: 603,
    mediaType: 'movie',
    title: 'The Matrix',
    overview:
      'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    releaseDate: '1999-03-31',
    voteAverage: 8.2,
    voteCount: 24600,
    popularity: 55.2,
    genreIds: [28, 878],
    tagline: 'Welcome to the Real World.',
    runtime: 136,
    flatrate: ['max'],
    rent: ['apple-tv-plus', 'prime-video'],
    buy: ['apple-tv-plus', 'prime-video', 'youtube'],
    cast: [
      { id: 6384, name: 'Keanu Reeves', character: 'Neo', profilePath: null },
      { id: 2975, name: 'Laurence Fishburne', character: 'Morpheus', profilePath: null },
      { id: 2955, name: 'Carrie-Anne Moss', character: 'Trinity', profilePath: null },
      { id: 530, name: 'Hugo Weaving', character: 'Agent Smith', profilePath: null },
      { id: 532, name: 'Joe Pantoliano', character: 'Cypher', profilePath: null },
    ],
  },
  {
    id: 680,
    mediaType: 'movie',
    title: 'Pulp Fiction',
    overview:
      'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
    releaseDate: '1994-09-10',
    voteAverage: 8.49,
    voteCount: 27300,
    popularity: 61.8,
    genreIds: [80, 18, 53],
    tagline: 'Just because you are a character doesn\u2019t mean you have character.',
    runtime: 154,
    flatrate: ['netflix'],
    rent: ['apple-tv-plus', 'prime-video'],
    buy: ['apple-tv-plus', 'prime-video', 'youtube'],
    cast: [
      { id: 8891, name: 'John Travolta', character: 'Vincent Vega', profilePath: null },
      { id: 2231, name: 'Samuel L. Jackson', character: 'Jules Winnfield', profilePath: null },
      { id: 139, name: 'Uma Thurman', character: 'Mia Wallace', profilePath: null },
      { id: 62, name: 'Bruce Willis', character: 'Butch Coolidge', profilePath: null },
      { id: 3129, name: 'Ving Rhames', character: 'Marsellus Wallace', profilePath: null },
    ],
  },
  {
    id: 13,
    mediaType: 'movie',
    title: 'Forrest Gump',
    overview:
      'A man with a low IQ has accomplished great things in his life and been present during significant historic events — in each case, far exceeding what anyone imagined he could do.',
    releaseDate: '1994-07-06',
    voteAverage: 8.47,
    voteCount: 26600,
    popularity: 58.9,
    genreIds: [35, 18, 10749],
    tagline: 'The world will never be the same once you\u2019ve seen it through the eyes of Forrest Gump.',
    runtime: 142,
    flatrate: ['paramount-plus'],
    rent: ['apple-tv-plus', 'youtube'],
    buy: ['apple-tv-plus', 'youtube'],
    cast: [
      { id: 31, name: 'Tom Hanks', character: 'Forrest Gump', profilePath: null },
      { id: 32, name: 'Robin Wright', character: 'Jenny Curran', profilePath: null },
      { id: 33, name: 'Gary Sinise', character: 'Lieutenant Dan Taylor', profilePath: null },
      { id: 34, name: 'Sally Field', character: 'Mrs. Gump', profilePath: null },
      { id: 35, name: 'Mykelti Williamson', character: 'Bubba Blue', profilePath: null },
    ],
  },
  {
    id: 278,
    mediaType: 'movie',
    title: 'The Shawshank Redemption',
    overview:
      'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.',
    releaseDate: '1994-09-23',
    voteAverage: 8.71,
    voteCount: 25400,
    popularity: 64.1,
    genreIds: [18, 80],
    tagline: 'Fear can hold you prisoner. Hope can set you free.',
    runtime: 142,
    flatrate: ['paramount-plus', 'peacock'],
    rent: ['apple-tv-plus', 'prime-video', 'youtube'],
    buy: ['apple-tv-plus', 'prime-video', 'youtube'],
    cast: [
      { id: 504, name: 'Tim Robbins', character: 'Andy Dufresne', profilePath: null },
      { id: 192, name: 'Morgan Freeman', character: 'Ellis Boyd "Red" Redding', profilePath: null },
      { id: 4029, name: 'Bob Gunton', character: 'Warden Norton', profilePath: null },
      { id: 6573, name: 'William Sadler', character: 'Heywood', profilePath: null },
      { id: 6574, name: 'Clancy Brown', character: 'Captain Hadley', profilePath: null },
    ],
  },
  {
    id: 238,
    mediaType: 'movie',
    title: 'The Godfather',
    overview:
      'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.',
    releaseDate: '1972-03-14',
    voteAverage: 8.71,
    voteCount: 19900,
    popularity: 57.3,
    genreIds: [18, 80],
    tagline: 'An offer you can\u2019t refuse.',
    runtime: 175,
    flatrate: ['paramount-plus'],
    rent: ['apple-tv-plus', 'youtube'],
    buy: ['apple-tv-plus', 'youtube'],
    cast: [
      { id: 3084, name: 'Marlon Brando', character: 'Don Vito Corleone', profilePath: null },
      { id: 1158, name: 'Al Pacino', character: 'Michael Corleone', profilePath: null },
      { id: 3092, name: 'James Caan', character: 'Sonny Corleone', profilePath: null },
      { id: 3095, name: 'Robert Duvall', character: 'Tom Hagen', profilePath: null },
      { id: 3096, name: 'Diane Keaton', character: 'Kay Adams', profilePath: null },
    ],
  },
  {
    id: 155,
    mediaType: 'movie',
    title: 'The Dark Knight',
    overview:
      'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, he sets out to dismantle the remaining criminal organizations.',
    releaseDate: '2008-07-18',
    voteAverage: 8.51,
    voteCount: 32300,
    popularity: 74.6,
    genreIds: [18, 28, 80, 53],
    tagline: 'Why So Serious?',
    runtime: 152,
    flatrate: ['max'],
    rent: ['apple-tv-plus', 'prime-video'],
    buy: ['apple-tv-plus', 'prime-video', 'youtube'],
    cast: [
      { id: 3894, name: 'Christian Bale', character: 'Bruce Wayne', profilePath: null },
      { id: 1810, name: 'Heath Ledger', character: 'Joker', profilePath: null },
      { id: 3895, name: 'Aaron Eckhart', character: 'Harvey Dent', profilePath: null },
      { id: 3896, name: 'Michael Caine', character: 'Alfred', profilePath: null },
      { id: 64, name: 'Gary Oldman', character: 'James Gordon', profilePath: null },
    ],
  },
  {
    id: 496243,
    mediaType: 'movie',
    title: 'Parasite',
    overview:
      'All unemployed, Ki-taek\u2019s family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.',
    releaseDate: '2019-05-30',
    voteAverage: 8.5,
    voteCount: 17800,
    popularity: 66.2,
    genreIds: [35, 18, 53],
    tagline: 'Act like you own the place.',
    runtime: 133,
    flatrate: ['max', 'hulu'],
    rent: ['apple-tv-plus', 'prime-video'],
    buy: ['apple-tv-plus', 'prime-video', 'youtube'],
    cast: [
      { id: 1245, name: 'Song Kang-ho', character: 'Ki-taek', profilePath: null },
      { id: 1246, name: 'Lee Sun-kyun', character: 'Dong-ik', profilePath: null },
      { id: 1247, name: 'Cho Yeo-jeong', character: 'Yeon-gyo', profilePath: null },
      { id: 1248, name: 'Choi Woo-shik', character: 'Ki-woo', profilePath: null },
      { id: 1249, name: 'Park So-dam', character: 'Ki-jung', profilePath: null },
    ],
  },
  {
    id: 545611,
    mediaType: 'movie',
    title: 'Everything Everywhere All at Once',
    overview:
      'An aging Chinese immigrant is swept up in an insane adventure, in which she alone can save existence by exploring other universes and connecting with the lives she could have led.',
    releaseDate: '2022-03-24',
    voteAverage: 7.79,
    voteCount: 6200,
    popularity: 41.5,
    genreIds: [28, 12, 878],
    tagline: 'The universe is so much bigger than you realize.',
    runtime: 139,
    flatrate: ['max'],
    rent: ['apple-tv-plus', 'prime-video', 'youtube'],
    buy: ['apple-tv-plus', 'prime-video', 'youtube'],
    cast: [
      { id: 1620, name: 'Michelle Yeoh', character: 'Evelyn Wang', profilePath: null },
      { id: 1621, name: 'Ke Huy Quan', character: 'Waymond Wang', profilePath: null },
      { id: 1622, name: 'Stephanie Hsu', character: 'Joy Wang', profilePath: null },
      { id: 1623, name: 'Jamie Lee Curtis', character: 'Deirdre Beaubeirdre', profilePath: null },
      { id: 1624, name: 'James Hong', character: 'Gong Gong', profilePath: null },
    ],
  },
  {
    id: 76600,
    mediaType: 'movie',
    title: 'Avatar: The Way of Water',
    overview:
      'Set more than a decade after the events of the first film, learn the story of the Sully family, the trouble that follows them, and the lengths they go to keep each other safe.',
    releaseDate: '2022-12-16',
    voteAverage: 7.6,
    voteCount: 11200,
    popularity: 68.3,
    genreIds: [878, 12, 28],
    tagline: 'Return to Pandora.',
    runtime: 192,
    flatrate: ['disney-plus'],
    rent: ['apple-tv-plus', 'prime-video', 'youtube'],
    buy: ['apple-tv-plus', 'prime-video', 'youtube'],
    cast: [
      { id: 1700, name: 'Sam Worthington', character: 'Jake Sully', profilePath: null },
      { id: 1701, name: 'Zoe Saldaña', character: 'Neytiri', profilePath: null },
      { id: 1702, name: 'Sigourney Weaver', character: 'Kiri', profilePath: null },
      { id: 1703, name: 'Stephen Lang', character: 'Colonel Quaritch', profilePath: null },
      { id: 1704, name: 'Kate Winslet', character: 'Ronal', profilePath: null },
    ],
  },
];
