import { Type } from '../../helpers/type';
import { get_response } from '../../helpers/util';

const radio_stations = [
	{
		full_name: 'Radio Dance Mix USA',
		title: 'Radio Dance Mix',
		country: 'USA',
		url: ['http://naxos.cdnstream.com/1366_128'],
		max_user: 0,
		genre: ['Dance', 'Mix']
	}, {
		full_name: 'Radio Danz',
		title: 'Radio Danz',
		country: 'USA',
		url: ['http://server1.radiodanz.com:8000/'],
		max_user: 1000,
		genre: ['Dance', 'House', 'Trance']
	}, {
		full_name: 'Mix Dance FM',
		title: 'Mix Dance',
		country: 'Russia',
		url: ['http://radio.promodj.com:8000/mixadancefm-192'],
		max_user: 0,
		genre: ['EDM', 'Dance']
	}, {
		full_name: 'Dance N Pop',
		title: 'Dance N Pop',
		country: 'USA',
		url: ['http://184.107.185.106:8006/stream'],
		max_user: 5000,
		genre: ['Pop', 'Mix', 'Dance']
	}, {
		full_name: 'Energy',
		title: 'Energy',
		country: 'USA',
		url: ['http://relay3.181.fm:8044/', 'http://listen.181fm.com:8044/',
			'http://www.181.fm/winamp.pls?station=181-energy93&bitrate=hi',
			'http://listen.181fm.com/181-energy93_128k.mp3', 'http://icyrelay.181.fm/181-energy93_128k.mp3'],
		max_user: 0,
		genre: ['EDM', 'Mix', 'Dance']
	}, {
		full_name: 'Fusion EDM',
		title: 'Fusion',
		country: 'USA',
		url: ['http://149.56.185.83:8138/stream'],
		max_user: 0,
		genre: ['EDM', 'Mix', 'Dance']
	}, {
		full_name: 'EDM Spain',
		title: 'EDM Spain',
		country: 'Spain',
		url: ['http://37.187.90.121:3540/stream'],
		max_user: 0,
		genre: ['EDM', 'Mix', 'Dance']
	}, {
		full_name: 'EDM Spain',
		title: 'EDM Spain',
		country: 'Spain',
		url: ['http://radio.dj-gaurav.com:8035/'],
		max_user: 1000,
		genre: ['Hindi', 'Mix']
	}
];

export const get_radio_stations = (opts) => {

	return get_response({ opts }, {
			type: Type.AISTEM_RADIO,
			radio: radio_stations
		});
}