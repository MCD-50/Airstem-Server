import parallel from 'run-parallel';

import {
	search as deezer_search_all,
	artists as deezer_search_artists,
	albums as deezer_search_albums,
	album_info as deezer_album_info,
	artist_info as deezer_artist_info,
	top_data as deezer_chart_data
} from '../providers/meta/deezer';

import {
	search as lastfm_search_all,
	trending_artist as lastfm_trending_artists,
	trending_tracks as lastfm_trending_tracks,
	album_info as lastfm_album_info,
	artist_info as lastfm_artist_info,
	artist_top_albums as lastfm_artist_albums,
	artist_top_tracks as lastfm_artist_tracks,
} from '../providers/meta/lastfm';

import {
	search as youtube_search_tracks,
	search_related as youtube_related_videos,
	new_tracks as youtube_new_tracks
} from '../providers/meta/youtube';

import {
	radio_stations
} from '../providers/radio/station';

export const search = (opts, callback) => {
	parallel({
		search_deezer_parallel: x => deezer_search_all(opts, x),
		search_lastfm_parallel: x => lastfm_search_all(opts, x),
		search_youtube_parallel: x => youtube_search_tracks(opts, x)
	}, (err, res) => {
		let messages = [];
		if (!err && res) {
			Object.keys(res).forEach(x => {
				messages.push(res[x]);
			})
		}
		callback({ messages: messages, error: err });
	});
}

export const search_albums = (opts, callback) => {
	parallel({
		album_deezer_parallel: x => deezer_search_albums(opts, x),
	}, (err, res) => {
		let messages = [];
		if (!err && res) {
			Object.keys(res).forEach(x => {
				messages.push(res[x]);
			})
		}
		callback({ messages: messages, error: err });
	});
}

export const search_artists = (opts, callback) => {
	parallel({
		artist_deezer_parallel: x => deezer_search_artists(opts, x),
	}, (err, res) => {
		let messages = [];
		if (!err && res) {
			Object.keys(res).forEach(x => {
				messages.push(res[x]);
			})
		}
		callback({ messages: messages, error: err });
	});
}

export const artist_info = (opts, callback) => {
	parallel({
		artist_info_deezer_parallel: x => deezer_artist_info(opts, x),
		artist_info_lastfm_parallel: x => lastfm_artist_info(opts, x)
	}, (err, res) => {
		let messages = [];
		if (!err && res) {
			Object.keys(res).forEach(x => {
				messages.push(res[x]);
			})
		}
		callback({ messages: messages, error: err });
	});
}

export const album_info = (opts, callback) => {
	parallel({
		album_info_deezer_parallel: x => deezer_album_info(opts, x),
		album_info_lastfm_parallel: x => lastfm_album_info(opts, x)
	}, (err, res) => {
		let messages = [];
		if (!err && res) {
			Object.keys(res).forEach(x => {
				messages.push(res[x]);
			})
		}
		callback({ messages: messages, error: err });
	});
}

export const artist_albums = (opts, callback) => {
	parallel({
		artist_albums_lastfm_parallel: x => lastfm_artist_albums(opts, x),
	}, (err, res) => {
		let messages = [];
		if (!err && res) {
			Object.keys(res).forEach(x => {
				messages.push(res[x]);
			})
		}
		callback({ messages: messages, error: err });
	});
}

export const artist_tracks = (opts, callback) => {
	parallel({
		artist_tracks_lastfm_parallel: x => lastfm_artist_tracks(opts, x),
	}, (err, res) => {
		let messages = [];
		if (!err && res) {
			Object.keys(res).forEach(x => {
				messages.push(res[x]);
			})
		}
		callback({ messages: messages, error: err });
	});
}

export const top_data = (opts, callback) => {
	parallel({
		top_data_deezer_parallel: x => deezer_chart_data(opts, x),
	}, (err, res) => {
		let messages = [];
		if (!err && res) {
			Object.keys(res).forEach(x => {
				messages.push(res[x]);
			})
		}
		callback({ messages: messages, error: err });
	});
}

export const trending_data = (opts, callback) => {
	parallel({
		trending_artists_lastfm_parallel: x => lastfm_trending_artists(opts, x),
		trending_tracks_lastfm_parallel: x => lastfm_trending_tracks(opts, x),
	}, (err, res) => {
		let messages = [];
		if (!err && res) {
			Object.keys(res).forEach(x => {
				messages.push(res[x]);
			})
		}
		callback({ messages: messages, error: err });
	});
}

export const similar_data = (opts, callback) => {
	parallel({
		similar_videos_youtube_parallel: x => youtube_related_videos(opts, x),
	}, (err, res) => {
		let messages = [];
		if (!err && res) {
			Object.keys(res).forEach(x => {
				messages.push(res[x]);
			})
		}
		callback({ messages: messages, error: err });
	});
}

export const new_data = (opts, callback) => {
	parallel({
		new_tracks_youtube_parallel: x => youtube_new_tracks(opts, x),
	}, (err, res) => {
		let messages = [];
		if (!err && res) {
			Object.keys(res).forEach(x => {
				messages.push(res[x]);
			})
		}
		callback({ messages: messages, error: err });
	});
}

export const radio = (callback) => {
	callback({ messages: radio_stations, error: false });
}