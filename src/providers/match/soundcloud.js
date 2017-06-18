const parallel = require('run-parallel');
import { make_request } from '../../helpers/internet';
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

		parallel({
			_tracks: x => make_request(url_match, x),
		}, (error, response) => {
			if (response) {
				const tracks = parse_soundcloud_tracks(response._tracks.collection, api_key);
				const data = {
					meta: { opts },
					result: {
						type: Type.SOUNDCLOUD_MATCH,
						match: opts.manual_match ? items : get_closest_track_match(common, tracks, 'title', false, 50)
					}
				}
				callback(true, data);
			} else {
				callback(true, null);
			}
		});
	} else {
		callback(true, null);
	}
}
