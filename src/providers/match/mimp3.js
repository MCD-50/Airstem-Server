const request = require('request');
const cheerio = require('cheerio');
import { make_request, is_online } from '../../helpers/internet';
import {
	MIMP3_BASE, MIMP3_LAST
} from '../../helpers/constant';
import { Type } from '../../helpers/type';
import { get_closest_track_match, get_response } from '../../helpers/util';


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
				});

				download_link(items, (res) => {
					is_online(res, (res1) => {

						const data = get_response({ opts }, {
							type: Type.MIMP3_MATCH,
							match: opts.manual_match ? res1 : get_closest_track_match(common, res1, 'title', 50)
						})


						callback(false, data);
					});
				});

			} else {
				callback(false, get_response());
			}
		});
	} else {
		callback(false, get_response());
	}
}

const download_link = (items, callback) => {
	const _items = items;

	let requests = _items.map((x, index) => {
		const url_match = x.download_url;

		return new Promise((resolve, reject) => {
			request(url_match, (error, response, html) => {
				if (response) {
					const $html = cheerio.load(response.body);
					const download_url = $html('a.dlink').attr('href')
					if (download_url) {
						items[index]['download_url'] = download_url;
						items[index]['stream_url'] = download_url;
					} else {
						items[index]['download_url'] = null;
						items[index]['stream_url'] = null;
					}
				} else {
					items[index]['download_url'] = null;
					items[index]['stream_url'] = null;

				}
				resolve();
			})
		});
	});

	Promise.all(requests)
		.then(() => callback(items.filter(x => x.download_url !== null && x.download_url !== undefined)));
}