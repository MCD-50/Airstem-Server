const parallel = require('run-parallel');
import { make_request } from '../helpers/internet';
import {
	AZ_LYRICS_BASE, AZ_LYRICS_API, AZ_LYRICS_ARTIST,
	AZ_LYRICS_JSON_FORMAT, AZ_LYRICS_DEFAULT_API
} from '../helpers/constant';
import { Type } from '../helpers/type';
import { parse_az_lyrics } from '../helpers/collection';
import { get_response } from '../helpers/util';


export const lyrics = (opts, callback) => {
	const az_api_key = opts.az_api_key || AZ_LYRICS_DEFAULT_API || null;
	const artist_name = opts.artist_name || null;
	const track_name = opts.track_name || null

	let messages = [];
	if (az_api_key && artist_name && track_name) {
		const common = track_name + AZ_LYRICS_ARTIST + artist_name
			+ AZ_LYRICS_API + AZ_api_key + AZ_LYRICS_JSON_FORMAT;

		const url_lyrics = AZ_LYRICS_BASE + common;

		parallel({
			_lyrics: x => make_request(url_lyrics, x),
		}, (error, response) => {
			if (response) {
				const data = get_response({ opts }, {
					type: Type.AZ_LYRICS,
					lyrics: parse_az_lyrics(response._lyrics)
				});
				
				if (data) {
					messages.push(data);
				}
				callback({ messages: messages, error: false });
			} else {
				callback({ messages: [], error: true });
			}
		});
	} else {
		callback({ messages: [], error: true });
	}
}
