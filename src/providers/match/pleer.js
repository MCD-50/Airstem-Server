const request = require('request');
const cheerio = require('cheerio');

import { make_request, is_online } from '../../helpers/internet';
import {
	PLEER_BASE, PLEER_DEFAULTS, PLEER_PAGE, PLEER_TRACK_LINK
} from '../../helpers/constant';
import { Type } from '../../helpers/type';
import { get_closest_track_match, get_match_response } from '../../helpers/util';


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

				download_link(items, (res) => {
					is_online(res, res1 => {
						let match = [];
						if (opts.manual_match) {
							match = res1;
						} else {
							match.push(get_closest_track_match(common, res1, 'title', false, 50));
						}
						const data = get_match_response({ opts }, {
							type: Type.PLEER_MATCH,
							match: match
						})


						callback(false, data);
					})
				});

			} else {
				callback(false, get_match_response(opts,
					{
						type: Type.PLEER_MATCH,
						match: []
					}));
			}
		});
	} else {
		callback(false, get_match_response(opts,
			{
				type: Type.PLEER_MATCH,
				match: []
			}));
	}
}

const download_link = (items, callback) => {

	const _items = items;

	let requests = _items.map((x, index) => {
		const track_url = PLEER_TRACK_LINK + x.download_url;

		return new Promise((resolve, reject) => {
			make_request(track_url, (err, res) => {
				if (res) {
					items[index]['download_url'] = res.track_link;
					items[index]['stream_url'] = res.track_link;
				} else {
					items[index]['download_url'] = null;
					items[index]['stream_url'] = null;
				}
				resolve();
			}, true)
		});
	});

	Promise.all(requests)
		.then(() => callback(items.filter(x => x.download_url !== null && x.download_url !== undefined)));
}