import express from 'express';
import body_parser from 'body-parser';

const app = express();
const path = require('path');
const port = process.env.PORT || 2000;
const cors = require('cors');


//app use
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());

app.use(express.static(path.join(__dirname, 'src')));
app.use(cors());

//import all engines
import { album_artwork, artist_artwork, track_artwork } from './src/engine/artwork';
import { lyrics } from './src/engine/lyrics';
import { match } from './src/engine/match';

import {
	search, search_albums, search_artists,
	artist_info_deezer, album_info_deezer,
	artist_info_last, album_info_last,
	artist_albums, artist_tracks, radio,
	top_data, trending_data, similar_data, new_data,
} from './src/engine/search'


app.listen(port, () => {
	console.log(`Listening on ${port}`);
});

app.get('/', (req, res) => {
	res.json({
		message: 'Documentation coming soon.'
	});
});

app.post('/search', (req, res) => {
	const opts = req.body;
	if (opts) {
		search(opts, (data) => {
			res.json(data);
		})
	} else {
		res.json({ messages: [], error: true });
	}
})

app.post('/searchAlbums', (req, res) => {
	const opts = req.body;
	if (opts) {
		search_albums(opts, (data) => {
			res.json(data);
		})
	} else {
		res.json({ messages: [], error: true });
	}
})

app.post('/searchArtists', (req, res) => {
	const opts = req.body;
	if (opts) {
		search_artists(opts, (data) => {
			res.json(data);
		})
	} else {
		res.json({ messages: [], error: true });
	}
})

app.post('/albumInfoDeezer', (req, res) => {
	const opts = req.body;
	if (opts) {
		album_info_deezer(opts, (data) => {
			res.json(data);
		})
	} else {
		res.json({ messages: [], error: true });
	}
})

app.post('/artistInfoDeezer', (req, res) => {
	const opts = req.body;
	if (opts) {
		artist_info_deezer(opts, (data) => {
			res.json(data);
		})
	} else {
		res.json({ messages: [], error: true });
	}
})

app.post('/albumInfoLastFm', (req, res) => {
	const opts = req.body;
	if (opts) {
		album_info_last(opts, (data) => {
			res.json(data);
		})
	} else {
		res.json({ messages: [], error: true });
	}
})

app.post('/artistInfoLastFm', (req, res) => {
	const opts = req.body;
	if (opts) {
		artist_info_last(opts, (data) => {
			res.json(data);
		})
	} else {
		res.json({ messages: [], error: true });
	}
})

app.post('/searchArtistAlbums', (req, res) => {
	const opts = req.body;
	if (opts) {
		artist_albums(opts, (data) => {
			res.json(data);
		})
	} else {
		res.json({ messages: [], error: true });
	}
})

app.post('/searchArtistTracks', (req, res) => {
	const opts = req.body;
	if (opts) {
		artist_tracks(opts, (data) => {
			res.json(data);
		})
	} else {
		res.json({ messages: [], error: true });
	}
})

app.post('/searchTopData', (req, res) => {
	const opts = req.body;
	if (opts) {
		top_data(opts, (data) => {
			res.json(data);
		})
	} else {
		res.json({ messages: [], error: true });
	}
})

app.post('/searchTrendingData', (req, res) => {
	const opts = req.body;
	if (opts) {
		trending_data(opts, (data) => {
			res.json(data);
		})
	} else {
		res.json({ messages: [], error: true });
	}
})

app.post('/searchSimilarData', (req, res) => {
	const opts = req.body;
	if (opts) {
		similar_data(opts, (data) => {
			res.json(data);
		})
	} else {
		res.json({ messages: [], error: true });
	}
})

app.post('/searchNewData', (req, res) => {
	const opts = req.body;
	if (opts) {
		new_data(opts, (data) => {
			res.json(data);
		})
	} else {
		res.json({ messages: [], error: true });
	}
})

app.post('/albumArtwork', (req, res) => {
	const opts = req.body;
	if (opts) {
		album_artwork(opts, (data) => {
			res.json(data);
		});
	} else {
		res.json({ messages: [], error: true });
	}
})

app.post('/artistArtwork', (req, res) => {
	const opts = req.body;
	if (opts) {
		artist_artwork(opts, (data) => {
			res.json(data);
		});
	} else {
		res.json({ messages: [], error: true });
	}
})

app.post('/trackArtwork', (req, res) => {
	const opts = req.body;
	if (opts) {
		track_artwork(opts, (data) => {
			res.json(data);
		});
	} else {
		res.json({ messages: [], error: true });
	}
})

app.post('/searchLyrics', (req, res) => {
	const opts = req.body;
	if (opts) {
		lyrics(opts, (data) => {
			res.json(data);
		});
	} else {
		res.json({ messages: [], error: true });
	}
})

app.post('/match', (req, res) => {
	const opts = req.body;
	if (opts) {
		match(opts, (data) => {
			res.json(data);
		})
	} else {
		res.json({ messages: [], error: true });
	}
})