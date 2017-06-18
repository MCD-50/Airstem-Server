const parallel = require('run-parallel');
const request = require('request');
const cheerio = require('cheerio');

import { make_request } from '../../helpers/internet';
import {
	PLEER_BASE, PLEER_DEFAULTS, PLEER_PAGE, PLEER_TRACK_LINK
} from '../../helpers/constant';
import { Type } from '../../helpers/type';
import { get_closest_track_match } from '../../helpers/util';


export const match = (opts, callback) => {
	const name = opts.name || null;
	const artist_name = opts.artist_name.toLowerCase() || null;
	if (name && artist_name) {
		const page = opts.page || 1;

		const common = artist_name.includes('unknown') ? name : `${artist_name} ${name}`;
		const url_match = PLEER_BASE + common + PLEER_PAGE + page + PLEER_DEFAULTS;

		request(url_match, (error, response, html) => {
			if (!error && response.statusCode == 200) {
				// Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
				let items = [];
				const $html = cheerio.load(response.body);

				$html('ol.scrolledPagination').children().each(function (i, e) {
					if (e.tagName === 'li') {
						items.push({
							type: Type.PLEER_TRACK,
							download_url: $html(this).attr('link') || null,
							stream_url: $html(this).attr('link') || null,
							song_length: $html(this).attr('duration') || null,
							title: `${$html(this).attr('singer')} ${$html(this).attr('song')}`
							|| null,
							bit_rate: $html(this).attr('rate') || null,
							size: $html(this).attr('size') || null
						})
					}
				});

				items = items.filter(x => (x.title && x.title.trim())
					&& (x.download_url !== null && x.download_url !== undefined &&
						x.stream_url !== null && x.stream_url !== undefined));

				if (opts.size) {
					items = items.filter(x => x.size.split('.')[0] >= opts.size)
				}

				if (opts.bit_rate) {
					items = items.filter(x => x.bit_rate.split(' ')[0] >= opts.bit_rate)
				}

				const data = {
					meta: { opts },
					result: {
						type: Type.PLEER_MATCH,
						match: opts.manual_match ? items : get_closest_track_match(common, items, 'title', false, 40)
					}
				}
				callback(false, data);
			} else {
				callback(true, null);
			}
		});
	} else {
		callback(true, null);
	}
}

export const download_link = (opts, callback) => {
	const download_url = opts.download_url || null;
	if (download_url) {
		const track_url = PLEER_TRACK_LINK + download_url;
		parallel({
			_match: x => make_request(track_url, x, true),
		}, (error, response) => {
			if (response) {
				const res = response._match;

				const data = {
					meta: { opts },
					result: {
						type: Type.PLEER_MATCH,
						match: {
							type: Type.PLEER_TRACK,
							download_url: res.track_link,
							stream_url: res.track_link,
							song_length: opts.song_length || null,
							title: opts.title || null,
							bit_rate: opts.bit_rate || null,
							size: opts.size || null
						}
					}
				}
				callback(false, data);
			} else {
				callback(true, null);
			}
		})
	} else {
		callback(true, null);
	}
}