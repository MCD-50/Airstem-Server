import express from 'express';
import body_parser from 'body-parser';

const app = express();
const path = require('path');
const port = process.env.PORT || 2003;
import { manual_match } from './src/engine/match';

//app use
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use(express.static(path.join(__dirname, 'src')));

app.listen(port, () => {
	manual_match({
		q: 'Ik Vari Aa', query: 'music remix live',
		radio: 'world', manual_match: true,
		video_ids:['o7p03LdvT9c'],
		name: 'maps', album_name: 'V', artist_name: 'maroon 5',
		artist_id: '6695979', album_id: '8670885',
		video_id: 'fyaI4-5849w', related_video_id: 'o7p03LdvT9c',
		artistName: 'Marron 5', track_name: 'Maps',
		bit_rate: '196', size: '3',
		download_url: '11276652PAAn',
		api_key: 'fb498db02133619b5d0e22199a878998', limit: 10,
	}, (res) => {
		console.log(res);
	});
});

app.get('/', (req, res) => {
	res.json({
		match: '/match => return url of track => {input:{track_name, artist_name, album_name, id}}',
		lyrics: '/lyrics => return lyrics of track => {input:{track_name, artist_name}}',

		radios: '/radios => return list of radios',
		moods: '/moods => return list of moods',
		mood_tracks: 'mood_tracks => return list of track to match mood => {input:mood_name}',



		new_tracks: '/new_tracks => return new tracks',
		new_albums: '/new_albums => return new albums list',


		search: '/search => return search results [track|album|artist] => {input:query}',
		album: '/album => return album details from album[tracks] => {input:{album_id, source_name}}',
		artist: '/artist => return artist details[tracks|albums] from artist => {input:{artist_id, source_name}}',
		trending_artists: '/trending_artists => returns trending artist',
		trending_tracks: '/trending_tracks => return trending tracks',
		similar_tracks: '/similar_tracks => return similar tracks => {input:{track_name, artist_name}}',
		similar_artists: '/similar_artists => return similar tracks => {input:{track_name, artist_name}}'

	});
});

app.post('/search', (req, res) => {
	const body = req.body;
})

app.post('/match', (req, res) => {
	const body = req.body;
})

app.post('/lyrics', (req, res) => {
	const body = req.body;
})

app.post('/album', (req, res) => {
	const body = req.body;
})

app.post('/artist', (req, res) => {
	const body = req.body;
})

app.post('/radios', (req, res) => {

})

app.post('/moods', (req, res) => {

})

app.post('/mood_tracks', (req, res) => {
	const body = req.body;
})

app.post('/trending_artists', (req, res) => {

})

app.post('/trending_tracks', (req, res) => {

})

app.post('/new_tracks', (req, res) => {

})

app.post('/new_albums', (req, res) => {

})

app.post('/similar_tracks', (req, res) => {
	const body = req.body;
})

app.post('/similar_artists', (req, res) => {
	const body = req.body;
})