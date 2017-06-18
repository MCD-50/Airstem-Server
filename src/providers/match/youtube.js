const youtubedl = require('youtube-dl');
import {
	YOUTUBE_MATCH_BASE
} from '../../helpers/constant';
import { Type } from '../../helpers/type';
import {
	parse_youtube_match
} from '../../helpers/collection';
import { get_closest_track_match } from '../../helpers/util';

export const match = (opts, callback) => {
	const video_id = opts.video_id;
	if (video_id) {
		const video_url = YOUTUBE_MATCH_BASE + video_id;
		youtubedl.getInfo(video_url, ['--format=18'], { cwd: __dirname, maxBuffer: 1000 * 1024 }, (error, response) => {
			if (error) {
				callback(false, null);
			}
			else {
				const formats = response.formats.filter(x => x.format !== undefined)
				const data = {
					meta: { opts },
					result: {
						type: Type.YOUTUBE_MATCH,
						match: parse_youtube_match(formats)
					}
				}
				callback(false, data);
			}
		});
	} else {
		callback(true, null);
	}
}

export const match_fast = (opts, callback) => {
	const video_id = opts.video_id;
	if (video_id) {
		const data = {
			meta: { opts },
			result: {
				type: Type.YOUTUBE_MATCH,
				match: 'http://youtubeinmp3.com/fetch/?video=' + YOUTUBE_MATCH_BASE + video_id
			}
		}
		callback(false, data);
	} else {
		callback(true, null);
	}
}