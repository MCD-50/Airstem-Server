const parallel = require('run-parallel');
import { make_request } from '../../helpers/internet';
import {
	DEEZER_SEARCH_TRACK, DEEZER_SEARCH_ALBUM, DEEZER_SEARCH_ARTIST,
	DEEZER_SEARCH_INDEX, DEEZER_ARTIST_TOP_TRACKS_INDEX, DEEZER_LIMIT,
	DEEZER_CHART, DEEZER_ALBUM_INFO, DEEZER_ARTIST_INFO
} from '../../helpers/constant';
import { Type } from '../../helpers/type';
import {
	parse_deezer_artists, parse_deezer_tracks, parse_deezer_albums,
	parse_deezer_album_info, parse_deezer_artist_info
} from '../../helpers/collection';
import { get_closest_image_match, get_response } from '../../helpers/util';

export const search = (opts, callback) => {
	const query = opts.query || null;
	if (query) {
		const page = opts.deezer_page || 0;
		const limit = opts.limit || 10;

		let common = query + DEEZER_LIMIT + limit;

		if(page != 0){
			common = common + DEEZER_SEARCH_INDEX + page;
		}

		const url_track = DEEZER_SEARCH_TRACK + common;
		const url_artist = DEEZER_SEARCH_ARTIST + common;
		const url_album = DEEZER_SEARCH_ALBUM + common;

		parallel({
			_artists: x => make_request(url_artist, x),
			_tracks: x => make_request(url_track, x),
			_albums: x => make_request(url_album, x)
		},
			(error, response) => {
				if (response) {
					const artist_total = response._artists.total || 0;
					const artist_next_page = (page + 1) * limit < artist_total ? page + limit : -1;

					const album_total = response._albums.total || 0;
					const album_next_page = (page + 1) * limit < album_total ? page + limit : -1;

					const track_total = response._tracks.total || 0;
					const track_next_page = (page + 1) * limit < track_total ? page + limit : -1;

					const data = get_response({ opts }, {
						type: Type.DEEZER_SEARCH,
						artists: { meta: { artist_total, artist_next_page }, result: parse_deezer_artists(response._artists.data) },
						tracks: { meta: { track_total, track_next_page }, result: parse_deezer_tracks(response._tracks.data) },
						albums: { meta: { album_total, album_next_page }, result: parse_deezer_albums(response._albums.data) }
					})

					callback(true, data);
				} else {
					callback(true, get_response(opts));
				}
			});
	} else {
		callback(true, get_response(opts));
	}
}


export const artists = (opts, callback) => {
	const artist_name = opts.artist_name || null;
	if (artist_name) {
		const page = opts.page || 0;
		const limit = opts.limit || 10;

		const common = artist_name + DEEZER_LIMIT + limit + DEEZER_SEARCH_INDEX + page;

		const url_artist = DEEZER_SEARCH_ARTIST + common;

		parallel({
			_artists: x => make_request(url_artist, x),
		}, (error, response) => {
			if (response) {
				const artist = response._artists.data;
				const total = response._artists.total;
				let next_page = page;
				if (total && (page + 1) * limit < total) {
					next_page += limit;
				} else {
					next_page = -1;
				}

				const data = get_response({ opts, total, next_page }, parse_deezer_artists(artist));
				callback(true, data);
			} else {
				callback(true, get_response(opts));
			}
		});
	} else {
		callback(true, get_response(opts));
	}
}

export const albums = (opts, callback) => {
	const artist_name = opts.artist_name || null;
	if (artist_name) {
		const page = opts.page || 0;
		const limit = opts.limit || 10;

		const common = artist_name + DEEZER_LIMIT + limit + DEEZER_SEARCH_INDEX + page;
		const url_album = DEEZER_SEARCH_ALBUM + common;

		parallel({
			_albums: x => make_request(url_album, x)
		}, (error, response) => {
			if (response) {
				const album = response._albums.data;
				const total = response._albums.total;
				let next_page = page;
				if (total && (page + 1) * limit < total) {
					next_page += limit;
				} else {
					next_page = -1;
				}
				const data = get_response({ opts, total, next_page }, parse_deezer_albums(album))
				callback(true, data);
			} else {
				callback(true, get_response(opts));
			}
		});
	} else {
		callback(true, get_response(opts));
	}
}

export const artist_info = (opts, callback) => {
	const artist_id = opts.artist_id || null;
	if (artist_id) {
		const url_artist_info = DEEZER_ARTIST_INFO + artist_id;

		parallel({
			_artist_info: x => make_request(url_artist_info, x),
		}, (error, response) => {
			if (response) {
				const artist_info = response._artist_info;
				get_artist_tracks(artist_info.tracklist, (tracks) => {
					const data = get_response({ opts }, parse_deezer_artist_info(artist_info, tracks));
					callback(true, data);
				})
			} else {
				callback(true, get_response(opts));
			}
		});
	} else {
		callback(true, get_response(opts));
	}
}

const get_artist_tracks = (url, callback) => {
	parallel({
		_tracks: x => make_request(url, x),
	}, (error, response) => {
		if (response) {
			const tracks = parse_deezer_tracks(response._tracks.data || []);
			callback(tracks);
		} else {
			callback([]);
		}
	});
}


export const album_info = (opts, callback) => {
	const album_id = opts.album_id || null;
	if (album_id) {
		const url_album_info = DEEZER_ALBUM_INFO + album_id;
		parallel({
			_album_info: x => make_request(url_album_info, x),
		}, (error, response) => {
			if (response) {
				const album_info = response._album_info;
				const data = get_response({ opts }, parse_deezer_album_info(album_info));
				callback(true, data);
			} else {
				callback(true, get_response(opts));
			}
		});
	} else {
		callback(true, get_response(opts));
	}
}

export const top_data = (opts, callback) => {
	const limit = opts.limit || 10;
	const page = opts.page || 0;
	const common = DEEZER_ARTIST_TOP_TRACKS_INDEX + page + DEEZER_LIMIT + limit;

	const url_top_data = DEEZER_CHART + common;

	parallel({
		_top_data: x => make_request(url_top_data, x)
	}, (error, response) => {
		if (response) {
			const data = get_response({ opts }, {
				type: Type.DEEZER_SEARCH,
				tracks: parse_deezer_tracks(response._top_data.tracks.data),
				albums: parse_deezer_albums(response._top_data.albums.data),
				artists: parse_deezer_artists(response._top_data.artists.data)
			});


			callback(true, data);
		} else {
			callback(true, get_response(opts));
		}
	});
}


export const artist_artwork = (opts, callback) => {
	artists(opts, (e, s) => {
		if (s) {
			const data = get_response(s.meta, {
				type: Type.DEEZER_IMAGE,
				images: get_closest_image_match(opts.artist_name, s.result, 'name')
			});
			
			callback(true, data);
		} else {
			callback(true, get_response(opts));
		}
	})
}

export const album_artwork = (opts, callback) => {
	albums(opts, (e, s) => {
		if (s) {
			const data = get_response(s.meta, {
				type: Type.DEEZER_IMAGE,
				images: get_closest_image_match(opts.album_name, s.result, 'name')
			});

			callback(true, data);
		} else {
			callback(true, get_response(opts));
		}
	})
}



