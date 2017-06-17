import { artist_artwork as d_artist_artwork, album_artwork as d_album_artwork } from '../providers/meta/deezer';
import { artist_artwork as l_artist_artwork, album_artwork as l_album_artwork } from '../providers/meta/lastfm';

//now first search info deezer then into lastfm

export const artist_artwork = (opts, callback) => {
	//while getting from deezer artist_name is required
	d_artist_artwork(opts, (error, response) => {
		if (error || (response && response.result && response.result.images.length < 1)) {
			//while getting from lastfm artist_name & api_key is required
			l_artist_artwork(opts, callback);
		} else {
			callback(error, response)
		}
	});
}

export const album_artwork = (opts, callback) => {
	//while getting from deezer album_name is required
	d_album_artwork(opts, (error, response) => {
		if (error || (response && response.result && response.result.images.length < 1)) {
			//while getting from lastfm artist_name, album_name & api_key is required
			l_album_artwork(opts, callback);
		} else {
			callback(error, response)
		}
	});
}