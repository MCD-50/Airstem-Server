const parallel = require('run-parallel');
import { make_request } from '../../helpers/internet';
import {
	YOUTUBE_API, YOUTUBE_DEFAULT_API_KEY, YOUTUBE_DEFAULTS, YOUTUBE_EVENT_TYPE,
	YOUTUBE_RELATED, YOUTUBE_MAX_RESULT, YOUTUBE_ORDER, YOUTUBE_PART,
	YOUTUBE_VIDEO_INFO, YOUTUBE_SEARCH, YOUTUBE_NEXT_PAGE, YOUTUBE_CHART
} from '../../helpers/constant';
import { Type } from '../../helpers/type';
import {
	parse_youtube_tracks
} from '../../helpers/collection';
import { get_closest_image_match, get_response } from '../../helpers/util';

export const search = (opts, callback) => {
	const youtube_api_key = opts.youtube_api_key || YOUTUBE_DEFAULT_API_KEY || null;
	const query = opts.query || null;
	if (query && youtube_api_key) {
		const limit = opts.limit || 20;
		const order = opts.order || Type.YOUTUBE_ORDER_TYPE.RELEVENCE;
		const part = opts.part || Type.YOUTUBE_PART_TYPE.SNIPPET;
		const page = opts.youtube_page || null;

		let common = query + YOUTUBE_PART + part + YOUTUBE_API + youtube_api_key + YOUTUBE_MAX_RESULT + limit +
			YOUTUBE_ORDER + order + YOUTUBE_DEFAULTS;

		common = page ? common + YOUTUBE_NEXT_PAGE + page : common;

		const url_track = YOUTUBE_SEARCH + common;
		parallel({
			_search_track: x => make_request(url_track, x),
		},
			(error, response) => {
				if (response) {
					const search = response._search_track;
					if (search) {
						const data = get_response({ opts, next_page: search.nextPageToken }, {
							type: Type.YOUTUBE_SEARCH,
							tracks: {
								meta: { next_page: search.nextPageToken },
								result: parse_youtube_tracks(search.items)
							},
							artists: {
								meta: { next_page: search.nextPageToken },
								result: []
							},
							albums: {
								meta: { next_page: search.nextPageToken },
								result: []
							}
						})
						callback(true, data);
					}else{
						const data = get_response({ opts, next_page: null }, {
							type: Type.YOUTUBE_SEARCH,
							tracks: {
								meta: { next_page: null },
								result: []
							},
							artists: {
								meta: { next_page: null },
								result: []
							},
							albums: {
								meta: { next_page: null },
								result: []
							}
						})
						callback(true, data);
					}
				} else {
					callback(true, get_response(opts));
				}
			});
	} else {
		callback(true, get_response(opts));
	}
}



export const track_info = (opts, callback) => {
	const youtube_api_key = opts.youtube_api_key || YOUTUBE_DEFAULT_API_KEY || null;
	const video_id = opts.video_id || null;
	if (video_id && youtube_api_key) {
		const limit = opts.limit || 20;
		const order = opts.order || Type.YOUTUBE_ORDER_TYPE.RELEVENCE;
		const part = opts.part || Type.YOUTUBE_PART_TYPE.SNIPPET;

		let common = video_id + YOUTUBE_PART + part + YOUTUBE_API + youtube_api_key + YOUTUBE_MAX_RESULT + limit +
			YOUTUBE_ORDER + order + YOUTUBE_DEFAULTS;

		const url_track_info = YOUTUBE_VIDEO_INFO + common;
		parallel({
			_track_info: x => make_request(url_track_info, x),
		},
			(error, response) => {
				if (response) {
					const track_info = response._track_info;
					const data = get_response({ opts }, {
						type: Type.YOUTUBE_SEARCH,
						track: parse_youtube_tracks(track_info.items)[0]
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


export const search_related = (opts, callback) => {
	const youtube_api_key = opts.youtube_api_key || YOUTUBE_DEFAULT_API_KEY || null;
	const related_video_id = opts.related_video_id || null;
	const track_name = opts.track_name || null;
	const artist_name = opts.artist_name || null;

	if (related_video_id == null && track_name != null && artist_name != null && youtube_api_key) {
		search({
			query: track_name + " " + artist_name,
			youtube_api_key: youtube_api_key
		}, (error, data) => {
			if (data && data.result
				&& data.result.tracks
				&& data.result.tracks.result
				&& data.result.tracks.result.length > 0) {

				const result = data.result.tracks.result[0];
				const _opts = {
					youtube_api_key: youtube_api_key,
					related_video_id: result.id
				};
				search_related(_opts, callback);
			} else {
				callback(true, get_response(opts));
			}
		})
	} else if (related_video_id && youtube_api_key) {
		const limit = opts.limit || 20;
		const order = opts.order || Type.YOUTUBE_ORDER_TYPE.RELEVENCE;
		const part = opts.part || Type.YOUTUBE_PART_TYPE.SNIPPET;
		const page = opts.next_page || null;


		let common = related_video_id + YOUTUBE_PART + part + YOUTUBE_API + youtube_api_key + YOUTUBE_MAX_RESULT + limit +
			YOUTUBE_ORDER + order + YOUTUBE_DEFAULTS;

		common = page ? common + YOUTUBE_NEXT_PAGE + page : common;

		const url_track = YOUTUBE_RELATED + common;
		parallel({
			_related_tracks: x => make_request(url_track, x),
		},
			(error, response) => {
				if (response) {
					const search = response._related_tracks;
					const data = get_response({ opts, next_page: search.nextPageToken || null }, {
						type: Type.YOUTUBE_SEARCH,
						tracks: parse_youtube_tracks(search.items)
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

export const new_tracks = (opts, callback) => {
	const youtube_api_key = opts.youtube_api_key || YOUTUBE_DEFAULT_API_KEY || null;
	if (youtube_api_key) {
		const limit = opts.limit || 20;
		const order = opts.order || Type.YOUTUBE_ORDER_TYPE.DATE;
		const part = opts.part || Type.YOUTUBE_PART_TYPE.SNIPPET;
		const chart = opts.chart || 'mostPopular'

		const common = chart + YOUTUBE_PART + part + YOUTUBE_API + youtube_api_key + YOUTUBE_MAX_RESULT + limit +
			YOUTUBE_ORDER + order + YOUTUBE_DEFAULTS;

		const url_track = YOUTUBE_CHART + common;

		parallel({
			_new_tracks: x => make_request(url_track, x),
		},
			(error, response) => {
				if (response) {
					const search = response._new_tracks;
					const data = get_response({ opts, next_page: search.nextPageToken }, {
						type: Type.YOUTUBE_SEARCH,
						tracks: parse_youtube_tracks(search.items)
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

export const track_artwork = (opts, callback) => {
	const youtube_api_key = opts.youtube_api_key || YOUTUBE_DEFAULT_API_KEY || null;
	const query = opts.query || null;
	if (query && youtube_api_key) {
		const limit = opts.limit || 20;
		const order = opts.order || Type.YOUTUBE_ORDER_TYPE.RELEVENCE;
		const part = opts.part || Type.YOUTUBE_PART_TYPE.SNIPPET;

		const common = query + YOUTUBE_PART + part + YOUTUBE_API + youtube_api_key + YOUTUBE_MAX_RESULT + limit +
			YOUTUBE_ORDER + order + YOUTUBE_DEFAULTS;

		const url_track = YOUTUBER_SEARCH + common;
		parallel({
			_search_track: x => make_request(url_track, x),
		},
			(error, response) => {
				if (response) {
					const search = response._search_track;
					const tracks = parse_youtube_tracks(search.items);
					const data = get_response({ opts, next_page: search.nextPageToken }, {
						type: Type.YOUTUBE_SEARCH,
						images: get_closest_image_match(query, tracks, 'name')
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
