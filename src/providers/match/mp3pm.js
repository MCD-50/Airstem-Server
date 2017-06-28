const request = require('request');
const cheerio = require('cheerio');
import { make_request, is_online } from '../../helpers/internet';
import {
	MP3PM_BASE, MP3PM_SEARCH, MP3PM_LAST
} from '../../helpers/constant';
import { Type } from '../../helpers/type';
import { get_closest_track_match, get_response } from '../../helpers/util';


export const match = (opts, callback) => {
	const name = opts.name || null;
	const artist_name = opts.artist_name || null;
	const album_name = opts.album_name || null;

	if ((name && artist_name) || (name && album_name) || name) {
		const common = (name && artist_name) ? `${artist_name} ${name}`
			: (name && album_name) ? `${album_name} ${name}` : name;

		const url_match = MP3PM_SEARCH + common + MP3PM_LAST;

		request(url_match, (error, response, html) => {
			if (!error && response.statusCode == 200) {
				// Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
				const items = [];
				const $html = cheerio.load(response.body);
				$html('ul.mp3list').children().each(function (i, e) {
					if (e.tagName === 'li') {
						const detail_div = $html(this).children().next().children();
						items.push({
							type: Type.MP3PM_TRACK,
							download_url: $html(this).attr('data-download-url') || null,
							stream_url: $html(this).attr('data-sound-url') || null,
							song_length: $html(this).children('em.cplayer-data-sound-time').text() || null,
							title: `${detail_div.children('i.cplayer-data-sound-author').text()} ${detail_div.next().children('b.cplayer-data-sound-title').text()}`
							|| null,
							bit_rate: null,
							size: null
						})
					}
				});

				is_online(items, (res) => {
					const data = get_response({ opts }, {
						type: Type.MP3PM_MATCH,
						match: opts.manual_match ? res : get_closest_track_match(common, res, 'title', 50)
					})


					callback(false, data);
				});
			} else {
				callback(true, get_response());
			}
		});
	} else {
		callback(true, get_response());
	}
}

export const radio = (opts, callback) => {
	const radio = opts.radio || Type.MP3PM_RADIO_TYPE.WORLD;
	const url_radio = MP3PM_BASE + 'radio/' + radio + MP3PM_LAST;

	request(url_radio, (error, response, html) => {
		if (!error && response.statusCode == 200) {
			// Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
			let items = [];
			const $html = cheerio.load(response.body);
			$html('ul.mp3list').children().each(function (i, e) {
				if (e.tagName === 'li') {
					const detail_div = $html(this).children().next().children();
					items.push({
						type: Type.MP3PM_RADIO,
						stream_url: $html(this).attr('data-sound-url') || null,
						song_length: $html(this).children('em.cplayer-data-sound-time').children().text() || null,
						title: `${detail_div.children('i.cplayer-data-sound-author').text()} ${detail_div.children('b.cplayer-data-sound-title').text()}`
						|| null,
						bit_rate: null,
						size: null
					})
				}
			});

			items = items.filter(x => (x.title && x.title.trim())
				&& (x.download_url !== null && x.download_url !== undefined &&
					x.stream_url !== null && x.stream_url !== undefined));

			is_online(items, (res) => {
				const data = {
					meta: { opts },
					result: {
						type: Type.MP3PM_MATCH,
						radio: res
					}
				}
				callback(false, data);
			});
		} else {
			callback(true, get_response());
		}
	});
}



