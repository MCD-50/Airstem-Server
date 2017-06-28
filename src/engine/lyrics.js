const parallel = require('run-parallel');
import { make_request } from '../helpers/internet';
import {
	METRO_LYRICS_BASE, METRO_LYRICS_API, METRO_LYRICS_ARTIST,
	METRO_LYRICS_JSON_FORMAT, METRO_LYRICS_DEFAULT_API
} from '../helpers/constant';
import { Type } from '../helpers/type';
import { parse_metro_lyrics } from '../helpers/collection';
import { get_response } from '../helpers/util';


export const lyrics = (opts, callback) => {
	const metro_api_key = opts.metro_api_key || METRO_LYRICS_DEFAULT_API || null;
	const artist_name = opts.artist_name || null;
	const track_name = opts.track_name || null

	if (metro_api_key && artist_name && track_name) {
		const common = track_name + METRO_LYRICS_ARTIST + artist_name
			+ METRO_LYRICS_API + metro_api_key + METRO_LYRICS_JSON_FORMAT;

		const url_lyrics = METRO_LYRICS_BASE + common;

		parallel({
			_lyrics: x => make_request(url_lyrics, x),
		}, (error, response) => {
			if (response) {
				const data = - get_response({ opts }, {
					type: Type.METRO_LYRICS,
					lyrics: parse_metro_lyrics(response._lyrics)
				});

				callback(false, data);
			} else {
				callback(true, get_response());
			}
		});
	} else {
		callback(true, get_response());
	}
}