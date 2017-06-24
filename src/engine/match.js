import parallel from 'run-parallel';

import { match as mimp3_match } from '../providers/match/mimp3';
import { match as mp3cold_match } from '../providers/match/mp3cold';
import { match as mp3pm_match } from '../providers/match/mp3pm';
import { match as pleer_match } from '../providers/match/pleer';
import { match as soundcloud_match } from '../providers/match/soundcloud';
import { match as youtube_match, match_fast } from '../providers/match/youtube';


export const match = (opts, callback) => {
	parallel({
		mimp3_parallel: x => mimp3_match(opts, x),
		mp3cold_parallel: y => mp3cold_match(opts, y),
		mp3pm_parallel: z => mp3pm_match(opts, z),
		pleer_parallel: x1 => pleer_match(opts, x1),
		youtube_parallel: y1 => youtube_match(opts, y1),
		soundcloud_parallel: z1 => soundcloud_match(opts, z1),
		youtube_fast: x2 => match_fast(opts, x2),
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



