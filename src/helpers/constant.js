import {
    LASTFM_KEY, METRO_LYRICS_KEY, YOUTUBE_KEY_ONE, YOUTUBE_KEY_TWO
} from './key';


//last fm constants
export const LASTFM_BASE = 'http://ws.audioscrobbler.com/2.0/?method=';
export const LASTFM_TRACK_INFO = LASTFM_BASE + 'track.getInfo&track='
export const LASTFM_ALBUM_INFO = LASTFM_BASE + 'album.getInfo&album='
export const LASTFM_ARTIST_INFO = LASTFM_BASE + 'artist.getInfo&artist=';
export const LASTFM_SEARCH_TRACK = LASTFM_BASE + 'track.search&track=';
export const LASTFM_SEARCH_ALBUM = LASTFM_BASE + 'album.search&album=';
export const LASTFM_SEARCH_ARTIST = LASTFM_BASE + 'artist.search&artist=';
export const LASTFM_SIMILAR_TRACK = LASTFM_BASE + 'track.getSimilar&track=';
export const LASTFM_SIMILAR_ARTIST = LASTFM_BASE + 'artist.getSimilar&artist=';
export const LASTFM_TOP_ARTIST_TRACK = LASTFM_BASE + 'artist.getTopTracks&artist=';
export const LASTFM_TOP_ARTIST_ALBUM = LASTFM_BASE + 'artist.getTopAlbums&artist=';
export const LASTFM_TOP_ARTISTS = LASTFM_BASE + 'chart.getTopArtists';
export const LASTFM_TOP_TRACKS = LASTFM_BASE + 'chart.getTopTracks';
export const LASTFM_AUTOCORRECT = '&autocorrect=';
export const LASTFM_JSON_FORMAT = '&format=json';
export const LASTFM_API = '&api_key=';
export const LASTFM_LIMIT = '&limit=';
export const LASTFM_PAGE = '&page=';
export const LASTFM_DEFAULT_API = LASTFM_KEY;


//deezer constants
export const DEEZER_BASE = 'http://api.deezer.com/';
export const SEARCH_BASE = DEEZER_BASE + 'search';
export const DEEZER_SEARCH_TRACK = SEARCH_BASE + '?q=';
export const DEEZER_SEARCH_ARTIST = SEARCH_BASE + '/artist' + '?q=';
export const DEEZER_SEARCH_ALBUM = SEARCH_BASE + '/album' + '?q=';
export const DEEZER_CHART = DEEZER_BASE + 'chart/'
export const DEEZER_SEARCH_INDEX = '&index=';
export const DEEZER_ALBUM_INFO = DEEZER_BASE + '/album/';
export const DEEZER_ARTIST_INFO = DEEZER_BASE + '/artist/';
export const DEEZER_ARTIST_TOP_TRACKS_INDEX = '?index=';
export const DEEZER_LIMIT = '&limit=';


//metrolyrics constants
export const METRO_LYRICS_BASE = 'http://api.metrolyrics.com/v1/get/fullbody/?title='
export const METRO_LYRICS_ARTIST = '&artist=';
export const METRO_LYRICS_API= '&X-API-KEY=';
export const METRO_LYRICS_JSON_FORMAT = '&format=json';
export const METRO_LYRICS_DEFAULT_API = METRO_LYRICS_KEY;


//youtube constants
export const YOUTUBE_BASE = 'https://www.googleapis.com/youtube/v3/';
export const YOUTUBER_SEARCH = YOUTUBE_BASE + 'search?q=';
export const YOUTUBE_VIDEO_INFO = YOUTUBE_BASE + 'videos?id=';
export const YOUTUBE_RELATED = YOUTUBE_BASE + 'search?relatedToVideoId=';
export const YOUTUBE_CHART = YOUTUBE_BASE + 'videos?chart=';
export const YOUTUBE_RESULT_TYPE = '&type=video';
export const YOUTUBE_EVENT_TYPE = '&eventType=live';
export const YOUTUBE_MAX_RESULT = '&maxResults=';
export const YOUTUBE_ORDER = '&order=';
export const YOUTUBE_API = '&key=';
export const YOUTUBE_DEFAULT_API_KEY = YOUTUBE_KEY_ONE;
export const YOUTUBE_SAFE_SEARCH = '&safeSearch=none'
export const YOUTUBE_VIDEO_CATEGORY_ID = '&videoCategoryId=10';
export const YOUTUBE_PART = '&part=';
export const YOUTUBE_NEXT_PAGE = '&pageToken=';
export const YOUTUBE_DEFAULTS = YOUTUBE_RESULT_TYPE + YOUTUBE_SAFE_SEARCH + YOUTUBE_VIDEO_CATEGORY_ID;

