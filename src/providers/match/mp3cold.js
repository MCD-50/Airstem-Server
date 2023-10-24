const request = require('request');
const cheerio = require('cheerio');
import { make_request, is_online } from '../../helpers/internet';
import {
	MP3COLD_BASE, MP3COLD_LAST
} from '../../helpers/constant';
import { Type } from '../../helpers/type';
import { get_closest_track_match, get_match_response } from '../../helpers/util';


export const match = (opts, callback) => {
	const name = opts.name || null;
	const artist_name = opts.artist_name || null;
	if (name || artist_name) {
		const common = (name && artist_name) ? `${artist_name.split(' ').join('-')}-${name.split(' ').join('-')}`
			: name ? name.split(' ').join('-') : artist_name.split(' ').join('-');

		const url_match = MP3COLD_BASE + common + MP3COLD_LAST;

		request(url_match, (error, response, html) => {
			if (!error && response.statusCode == 200) {
				// Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
				let items = [];
				const $html = cheerio.load(response.body);

				$html('div.news_list').children().each(function (i, e) {
					const attr = e.attribs.class || null;
					if (attr && attr.includes('show')) {
						const detail_div = $html(this).children();
						const download_div = detail_div.last().prev().children();
						items.push({
							type: Type.MP3COLD_TRACK,
							download_url: download_div.first().attr('href') || null,
							stream_url: download_div.first().attr('href') || null,
							song_length: null,
							id: download_div.first().attr('download') || null,
							title: detail_div.first().children().text() || null,
							bit_rate: detail_div.first().next().text().split('|')[0].trim().split(' ')[1] || null,
							size: detail_div.first().next().text().split('|')[2].trim().split(' ')[2] || null
						})
					}
				});


				items = items.filter(x => (x.title && x.title.trim())
					&& (x.download_url !== null && x.download_url !== undefined &&
						x.stream_url !== null && x.stream_url !== undefined
						&& x.id !== null && x.id !== undefined));

				items = items.map(x => {
					return {
						type: Type.MP3COLD_TRACK,
						download_url: x.download_url + x.id,
						stream_url: x.stream_url + x.id,
						song_length: null,
						title: x.title,
						bit_rate: x.bit_rate,
						size: x.size,
					}
				});

				is_online(items, (res) => {
					let match = [];
					if (opts.manual_match) {
						match = res;
					} else {
						match.push(get_closest_track_match(common, res, 'title', true, 50));
					}
					const data = get_match_response({ opts }, {
						type: Type.MP3COLD_MATCH,
						match: match
					})

					callback(false, data);
				});

			} else {
				callback(false, get_match_response(opts,
					{
						type: Type.MP3COLD_MATCH,
						match: []
					}));
			}
		});
	} else {
		callback(false, get_match_response(opts,
			{
				type: Type.MP3COLD_MATCH,
				match: []
			}));
	}
}
