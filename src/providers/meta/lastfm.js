const parallel = require('run-parallel');
import { make_request } from '../../helpers/internet';
import {
	LASTFM_ALBUM_INFO, LASTFM_ARTIST_INFO, LASTFM_TRACK_INFO,
	LASTFM_SEARCH_TRACK, LASTFM_SEARCH_ALBUM, LASTFM_SEARCH_ARTIST,
	LASTFM_SIMILAR_TRACK, LASTFM_SIMILAR_ARTIST,
	LASTFM_TOP_ARTIST_TRACK, LASTFM_TOP_ARTIST_ALBUM,
	LASTFM_TOP_ARTISTS, LASTFM_TOP_TRACKS,
	LASTFM_AUTOCORRECT, LASTFM_JSON_FORMAT,
	LASTFM_API, LASTFM_LIMIT, LASTFM_PAGE, LASTFM_DEFAULT_API
} from '../../helpers/constant';
import { Type } from '../../helpers/type';
import {
	parse_lastfm_artists, parse_lastfm_tracks, parse_lastfm_album_info,
	parse_lastfm_artist_info, parse_lastfm_albums, parse_lastfm_track_info
} from '../../helpers/collection';

import { get_response } from '../../helpers/util'


export const search = (opts, callback) => {
	const last_fm_api_key = opts.last_fm_api_key || LASTFM_DEFAULT_API || null;
	const query = opts.query || null;
	if (query && last_fm_api_key) {
		const page = opts.last_fm_page || 1;
		const limit = opts.limit || 10;
		const auto_correct = opts.auto_correct || 0;

		const common = query + LASTFM_AUTOCORRECT + auto_correct + LASTFM_JSON_FORMAT +
			LASTFM_LIMIT + limit + LASTFM_PAGE + page + LASTFM_API + last_fm_api_key;

		const url_track = LASTFM_SEARCH_TRACK + common;
		const url_artist = LASTFM_SEARCH_ARTIST + common;
		const url_album = LASTFM_SEARCH_ALBUM + common;

		parallel({
			_artists: x => make_request(url_artist, x),
			_tracks: x => make_request(url_track, x),
			_albums: x => make_request(url_album, x)
		},
			(error, response) => {

				if (response) {
					
					const artist_total = response._artists.results['opensearch:totalResults'] || 0;
					const artist_next_page = (page + 1) * limit < artist_total ? page + 1 : null;

					const album_total = response._albums.results['opensearch:totalResults'] || 0;
					const album_next_page = (page + 1) * limit < album_total ? page + 1 : null;

					const track_total = response._tracks.results['opensearch:totalResults'] || 0;
					const track_next_page = (page + 1) * limit < track_total ? page + 1 : null;

					const data = get_response({ opts }, {
						type: Type.LASTFM_SEARCH,
						artists: {
							meta: { artist_total, artist_next_page },
							result: parse_lastfm_artists(response._artists.results.artistmatches.artist)
								.sort((a, b) => (b.listeners) - (a.listeners))
						},
						tracks: {
							meta: { track_total, track_next_page },
							result: parse_lastfm_tracks(response._tracks.results.trackmatches.track)
								.sort((a, b) => (b.listeners) - (a.listeners))
						},
						albums: {
							meta: { album_total, album_next_page },
							result: parse_lastfm_albums(response._albums.results.albummatches.album)
						}
					})

					callback(false, data);
				} else {
					callback(false, get_response(opts));
				}
			});
	} else {
		callback(false, get_response(opts));
	}
}

export const artist_info = (opts, callback) => {
	const last_fm_api_key = opts.last_fm_api_key || LASTFM_DEFAULT_API || null;
	const artist_name = opts.artist_name || null;
	if (last_fm_api_key && artist_name) {
		const auto_correct = opts.auto_correct || 0;
		const common = artist_name + LASTFM_AUTOCORRECT + auto_correct + LASTFM_JSON_FORMAT +
			LASTFM_API + last_fm_api_key;

		const url_artist_info = LASTFM_ARTIST_INFO + common;

		parallel({
			_artist_info: x => make_request(url_artist_info, x),
		}, (error, response) => {
			if (response) {
				const artist = response._artist_info.artist;
				const data = get_response({ opts }, parse_lastfm_artist_info(artist))


				callback(false, data);
			} else {
				callback(false, get_response(opts));
			}
		});
	} else {
		callback(false, get_response(opts));
	}
}

export const album_info = (opts, callback) => {
	const last_fm_api_key = opts.last_fm_api_key || LASTFM_DEFAULT_API || null;
	const artist_name = opts.artist_name || null;
	const album_name = opts.album_name || null
	if (last_fm_api_key && artist_name && album_name) {
		const auto_correct = opts.auto_correct || 0;
		const common = album_name + '&artist=' + artist_name + LASTFM_AUTOCORRECT + auto_correct + LASTFM_JSON_FORMAT +
			LASTFM_API + last_fm_api_key;

		const url_album_info = LASTFM_ALBUM_INFO + common;

		parallel({
			_album_info: x => make_request(url_album_info, x)
		}, (error, response) => {
			if (response) {
				const album = response._album_info.album;
				const data = get_response({ opts }, parse_lastfm_album_info(album))
				callback(false, data);
			} else {
				callback(false, get_response(opts));
			}
		});
	} else {
		callback(false, get_response(opts));
	}
}

export const track_info = (opts, callback) => {
	const last_fm_api_key = opts.last_fm_api_key || LASTFM_DEFAULT_API || null;
	const artist_name = opts.artist_name || null;
	const track_name = opts.track_name || null
	if (last_fm_api_key && artist_name && track_name) {

		const auto_correct = opts.auto_correct || 0;
		const common = track_name + '&artist=' + artist_name + LASTFM_AUTOCORRECT + auto_correct + LASTFM_JSON_FORMAT +
			LASTFM_API + last_fm_api_key;

		const url_track_info = LASTFM_TRACK_INFO + common;

		parallel({
			_track_info: x => make_request(url_track_info, x)
		}, (error, response) => {
			if (response) {
				const track = response._track_info.track;
				const data = get_response({ opts }, parse_lastfm_track_info(track))
				callback(false, data);
			} else {
				callback(false, get_response(opts));
			}
		});
	} else {
		callback(false, get_response(opts));
	}
}


export const artist_top_albums = (opts, callback) => {
	const last_fm_api_key = opts.last_fm_api_key || LASTFM_DEFAULT_API || null;
	const artist_name = opts.artist_name || null;
	if (last_fm_api_key && artist_name) {

		const auto_correct = opts.auto_correct || 0;
		const limit = opts.limit || 10;

		const common = artist_name + LASTFM_AUTOCORRECT + auto_correct + LASTFM_JSON_FORMAT +
			LASTFM_API + last_fm_api_key + LASTFM_LIMIT + limit;

		const url_artist_album = LASTFM_TOP_ARTIST_ALBUM + common;

		parallel({
			_artist_albums: x => make_request(url_artist_album, x)
		}, (error, response) => {
			if (response) {
				const data = get_response({ opts }, {
					type: Type.LASTFM_SEARCH,
					albums: parse_lastfm_albums(response._artist_albums.topalbums.album)
				})


				callback(false, data);
			} else {
				callback(false, get_response(opts));
			}
		});
	} else {
		callback(false, get_response(opts));
	}
}



export const artist_top_tracks = (opts, callback) => {
	const last_fm_api_key = opts.last_fm_api_key || LASTFM_DEFAULT_API || null;
	const artist_name = opts.artist_name || null;
	if (last_fm_api_key && artist_name) {

		const auto_correct = opts.auto_correct || 0;
		const limit = opts.limit || 10;

		const common = artist_name + LASTFM_AUTOCORRECT + auto_correct + LASTFM_JSON_FORMAT +
			LASTFM_API + last_fm_api_key + LASTFM_LIMIT + limit;

		const url_artist_track = LASTFM_TOP_ARTIST_TRACK + common;

		parallel({
			_artist_tracks: x => make_request(url_artist_track, x)
		}, (error, response) => {
			if (response) {
				const data = get_response({ opts }, {
					type: Type.LASTFM_SEARCH,
					tracks: parse_lastfm_tracks(response._artist_tracks.toptracks.track)
				})

				callback(false, data);
			} else {
				callback(false, get_response(opts));
			}
		});
	} else {
		callback(false, get_response(opts));
	}
}


export const trending_artist = (opts, callback) => {
	const last_fm_api_key = opts.last_fm_api_key || LASTFM_DEFAULT_API || null;
	if (last_fm_api_key) {

		const auto_correct = opts.auto_correct || 0;
		const limit = opts.limit || 10;

		const common = LASTFM_AUTOCORRECT + auto_correct + LASTFM_JSON_FORMAT +
			LASTFM_API + last_fm_api_key + LASTFM_LIMIT + limit;

		const url_trending_artist = LASTFM_TOP_ARTISTS + common;

		parallel({
			_trending_artists: x => make_request(url_trending_artist, x)
		}, (error, response) => {
			if (response) {
				const data = get_response({ opts }, {
					type: Type.LASTFM_SEARCH,
					artists: parse_lastfm_artists(response._trending_artists.artists.artist)
				})


				callback(false, data);
			} else {
				callback(false, get_response(opts));
			}
		});
	} else {
		callback(false, get_response(opts));
	}
}

export const trending_tracks = (opts, callback) => {
	const last_fm_api_key = opts.last_fm_api_key || LASTFM_DEFAULT_API || null;
	if (last_fm_api_key) {

		const auto_correct = opts.auto_correct || 0;
		const limit = opts.limit || 10;

		const common = LASTFM_AUTOCORRECT + auto_correct + LASTFM_JSON_FORMAT +
			LASTFM_API + last_fm_api_key + LASTFM_LIMIT + limit;

		const url_trending_track = LASTFM_TOP_TRACKS + common;

		parallel({
			_trending_tracks: x => make_request(url_trending_track, x)
		}, (error, response) => {
			if (response) {
				const data = get_response({ opts }, {
					type: Type.LASTFM_SEARCH,
					tracks: parse_lastfm_tracks(response._trending_tracks.tracks.track)
				})


				callback(false, data);
			} else {
				callback(false, get_response(opts));
			}
		});
	} else {
		callback(false, get_response(opts));
	}
}


export const artist_artwork = (opts, callback) => {
	artist_info(opts, (e, s) => {
		if (s) {
			const data = get_response(s.meta, {
				type: Type.LASTFM_IMAGE,
				images: s.result.images
			})


			callback(false, data);
		} else {
			callback(false, get_response(opts));
		}
	})
}



export const album_artwork = (opts, callback) => {
	album_info(opts, (e, s) => {
		if (s) {
			const data = get_response(s.meta, {
				type: Type.LASTFM_IMAGE,
				images: s.result.images
			})

			callback(false, data);
		} else {
			callback(false, get_response(opts));
		}
	})
}