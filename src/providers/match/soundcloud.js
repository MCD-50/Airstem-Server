const request = require('request');
import { make_request, is_online } from '../../helpers/internet';

import {
	SOUNDCLOUD_API, SOUNDCLOUD_DEFAULT_KEY,
	SOUNDCLOUD_LIMIT, SOUNDCLOUD_QUERY
} from '../../helpers/constant';
import { Type } from '../../helpers/type';
import { parse_soundcloud_tracks } from '../../helpers/collection';
import { get_closest_track_match, get_match_response } from '../../helpers/util';


export const match = (opts, callback) => {
	const name = opts.name || null;
	const artist_name = opts.artist_name || null;
	const soundcloud_api_key = opts.soundcloud_api_key || SOUNDCLOUD_DEFAULT_KEY;
	if ((name || artist_name) && soundcloud_api_key) {
		const limit = opts.limit || 10;
		const common = (name && artist_name) ? `${artist_name} ${name}`
			: name ? name : artist_name;

		const url_match = SOUNDCLOUD_API + soundcloud_api_key + SOUNDCLOUD_QUERY + common + SOUNDCLOUD_LIMIT + limit;

		request(url_match, (error, response) => {
			if (response && response.body) {
				const body = JSON.parse(response.body);
				const items = parse_soundcloud_tracks(body, soundcloud_api_key);

				is_online(items, res => {
					let match = [];
					if (opts.manual_match) {
						match = res;
					} else {
						match.push(get_closest_track_match(common, res, 'title', false, 50));
					}


					const data = get_match_response({ opts }, {
						type: Type.SOUNDCLOUD_MATCH,
						match: match
					})


					callback(false, data);
				});

			} else {
				callback(false, get_match_response(opts,
					{
						type: Type.SOUNDCLOUD_MATCH,
						match: []
					}));
			}
		});
	} else {
		callback(false, get_match_response(opts,
			{
				type: Type.SOUNDCLOUD_MATCH,
				match: []
			}));
	}
}
