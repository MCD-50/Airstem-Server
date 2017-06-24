const request = require('request');
import { make_request, is_online } from '../../helpers/internet';

import {
	SOUNDCLOUD_API, SOUNDCLOUD_DEFAULT_KEY,
	SOUNDCLOUD_LIMIT, SOUNDCLOUD_QUERY
} from '../../helpers/constant';
import { Type } from '../../helpers/type';
import { parse_soundcloud_tracks } from '../../helpers/collection';
import { get_closest_track_match } from '../../helpers/util';


export const match = (opts, callback) => {
	const name = opts.name || null;
	const artist_name = opts.artist_name || null;
	const api_key = opts.api_key || SOUNDCLOUD_DEFAULT_KEY;
	if ((name || artist_name) && api_key) {
		const limit = opts.limit || 10;
		const common = (name && artist_name) ? `${artist_name} ${name}`
			: name ? name : artist_name;

		const url_match = SOUNDCLOUD_API + api_key + SOUNDCLOUD_QUERY + common + SOUNDCLOUD_LIMIT + limit;

		request(url_match, (error, response) => {
			if (response && response.body) {
				const body = JSON.parse(response.body);
				const items = parse_soundcloud_tracks(body.collection, api_key);
				
				is_online(items, res => {
					const data = {
						meta: { opts },
						result: {
							type: Type.SOUNDCLOUD_MATCH,
							match: opts.manual_match ? res : get_closest_track_match(common, res, 'title', false, 50)
						}
					}
					callback(false, data);
				});

			} else {
				callback(true, null);
			}
		});
	} else {
		callback(true, null);
	}
}
