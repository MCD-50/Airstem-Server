const request = require('request');
const cheerio = require('cheerio');
import { make_request, is_online } from '../../helpers/internet';
import {
	MIMP3_BASE, MIMP3_LAST
} from '../../helpers/constant';
import { Type } from '../../helpers/type';
import { get_closest_track_match } from '../../helpers/util';


export const match = (opts, callback) => {
	const name = opts.name || null;
	const artist_name = opts.artist_name || null;
	if (name || artist_name) {
		const common = (name && artist_name) ? `${artist_name.split(' ').join('-')}-${name.split(' ').join('-')}`
			: name ? name.split(' ').join('-') : artist_name.split(' ').join('-');

		const only_streamable = opts.only_streamable || true;
		const url_match = MIMP3_BASE + common + MIMP3_LAST;

		request(url_match, (error, response, html) => {
			if (!error && response.statusCode == 200) {
				// Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
				let items = [];
				const $html = cheerio.load(response.body);
				$html('ul.mp3-list').children().each(function (i, e) {
					if (e.tagName === 'li') {
						const detail_div = $html(this).children().children();
						items.push({
							type: Type.MIMP3_TRACK,
							download_url: detail_div.last().prev().children().next().children().attr('url'),
							stream_url: detail_div.last().prev().children().children().attr('url') || null,
							song_length: detail_div.next().text().split(' ')[1] || null,
							title: detail_div.first().text().split('.')[1] || null,
							bit_rate: null,
							size: null
						})
					}
				});

				items = items.filter(x => (x.title && x.title.trim())
					&& (x.download_url !== null && x.download_url !== undefined &&
						x.stream_url !== null && x.stream_url !== undefined));

				items = items.map(x => {
					return Object.assign(x, {
						download_url: 'http://www.mimp3s.live/' + x.download_url,
						stream_url: 'http://www.mimp3s.live/' + x.stream_url
					})
				})

				const data = {
					meta: { opts },
					result: {
						type: Type.MIMP3_MATCH,
						match: opts.manual_match ? items : get_closest_track_match(common, items, 'title', 50)
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
		const url_match = download_url;
		request(url_match, (error, response, html) => {
			if (response) {
				const $html = cheerio.load(response.body);
				const download_url = $html('a.dlink').attr('href')
				const data = {
					meta: { opts },
					result: {
						type: Type.MIMP3_MATCH,
						match: {
							type: Type.MIMP3_TRACK,
							download_url: download_url,
							stream_url: download_url,
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