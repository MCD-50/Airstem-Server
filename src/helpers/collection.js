import { Type } from './type';

export const parse_lastfm_artists = (artists) => {
	return artists
		.map(artist => {
			return {
				type: Type.LASTFM_ARTIST,
				name: artist.name,
				listeners: Number(artist.listeners) || 0,
				mbid: artist.mbid || null,
				images: parse_lastfm_images(artist.image)
			}
		}).filter(artist => artist.images.length > 0);

}

export const parse_lastfm_albums = (albums) => {
	return albums
		.map(album => {
			return {
				type: Type.LASTFM_ALBUM,
				name: album.name,
				artist_name: album.artist.name || album.artist,
				mbid: album.mbid || null,
				listeners: 0,
				images: parse_lastfm_images(album.image) || []
			}
		})
}

export const parse_lastfm_tracks = (tracks) => {
	return tracks
		.map(track => {
			const listeners = track.playcount || track.listeners || 0;
			return {
				type: Type.LASTFM_TRACK,
				name: track.name,
				artist_name: track.artist.name || track.artist,
				listeners: Number(listeners), // optional
				mbid: track.mbid || null,
				images: track.image && parse_lastfm_images(track.image) || [] // optional
			}
		})
}

export const parse_lastfm_images = (images) => {
	return images
		.filter(image => image.size !== '' || image.size != null)
		.map(image => {
			return {
				url: image['#text'] || '',
				size: image['size']
			}
		}).filter(image => image.url !== '');
}

export const parse_lastfm_meta = (data, current_page, limit) => {
	const total = data['opensearch:totalResults'] && Number(data['opensearch:totalResults']) ||
		data['@attr'] && data['@attr'].total && Number(data['@attr'].total) || null;
	let next_page = current_page;
	if (total && (current_page * limit) < total) {
		next_page += 1;
	} else {
		next_page = null;
	}
	return { query, total, next_page }
}

export const parse_lastfm_artist_info = (artist) => {
	return {
		type: Type.LASTFM_ARTIST,
		bio: Object.assign({}, {
			published: artist.bio.published || null,
			summary: parse_lastfm_summary(artist.bio.summary) || null
		}) || null,
		url: artist.url,
		mbid: artist.mbid || null,
		images: parse_lastfm_images(artist.image),
		similar: parse_lastfm_similar_artists(artist.similar.artist || [])
	}
}

export const parse_lastfm_album_info = (album) => {
	return {
		type: Type.LASTFM_ALBUM,
		url: album.url,
		mbid: album.mbid || null,
		tracks: parse_lastfm_tracks(album.tracks.track || []),
		images: parse_lastfm_images(album.image)
	}
}

export const parse_lastfm_track_info = (track) => {
	return {
		type: Type.LASTFM_TRACK,
		url: track.url,
		mbid: track.mbid || null,
		artist_name: track.artist.name || track.album.artist || null,
		album_name: track.album.title || null,
		images: parse_lastfm_images(track.album.image) || []
	}
}

export const parse_lastfm_summary = (summary) => {
	return summary.replace(/\s+?<a .*?>Read more on Last\.fm<\/a>.*$/, '')
}

export const parse_lastfm_similar_artists = (artists) => {
	return artists.map(artist => {
		return {
			type: Type.LASTFM_SIMILAR_ARTIST,
			name: artist.name,
			images: parse_lastfm_images(artist.image)
		}
	})
}

export const parse_deezer_artists = (artists) => {
	return artists
		.map(artist => {
			return {
				type: Type.DEEZER_ARTIST,
				name: artist.name,
				id: artist.id || null,
				tracklist_url: artist.tracklist,
				images: parse_deezer_images(artist, 'picture') // optional
			}
		}).filter(artist => artist.images.length > 0);

}

export const parse_deezer_albums = (albums) => {
	return albums
		.map(album => {
			return {
				type: Type.DEEZER_ALBUM,
				name: album.title,
				artist_name: album.artist.name || null,
				id: album.id || null,
				images: parse_deezer_images(album, 'cover')
			}
		})
}

export const parse_deezer_tracks = (tracks, album_name = null) => {
	return tracks
		.map(track => {
			return {
				type: Type.DEEZER_TRACK,
				name: track.title,
				artist_name: track.artist.name || null,
				album_name: track.album && track.album.name || track.album && track.album.title || album_name,
				id: track.id,
				images: track.album ? parse_deezer_images(track.album, 'cover')
					: parse_deezer_images(track.artist, 'picture') || [] // optional
			}
		})
}

export const parse_deezer_artist_info = (artist, tracks = []) => {
	return {
		type: Type.DEEZER_ARTIST,
		name: artist.name,
		id: artist.id || null,
		tracks: tracks,
		images: parse_deezer_images(artist, 'picture') // optional
	}
}

export const parse_deezer_album_info = (album) => {
	return {
		type: Type.DEEZER_ALBUM,
		name: album.title,
		artist_name: album.artist.name || null,
		id: album.id || null,
		images: parse_deezer_images(album, 'cover'),
		tracks: parse_deezer_tracks(album.tracks.data, album.title) || []
	}
}

export const parse_deezer_images = (image, key) => {
	return Object.keys(image)
		.filter(x => x.includes(key))
		.map(y => {
			return {
				url: image[y] || '',
				size: y.split('_')[1] || 'og'
			}
		}).filter(image => image.url !== '');
}

export const parse_youtube_tracks = (search) => {
	return search
		.map(x => {
			return {
				type: Type.YOUTUBE_TRACK,
				name: x.snippet.title,
				description: x.snippet.description,
				channel_title: x.snippet.channelTitle || null,
				published_at: x.snippet.publishedAt,
				id: x.id.videoId || x.id,
				tags: x.snippet.tags || [],
				images: parse_youtube_images(x.snippet.thumbnails) || []
			}
		});
}


export const parse_youtube_match = (formats, id) => {
	return formats
		.map(x => {
			return {
				type: x.format.includes('audio') ? Type.YOUTUBE_TRACK : Type.YOUTUBE_VIDEO,
				width: x.width || null,
				height: x.height || null,
				download_url: x.url,
				song_length: null,
				id: id,
				extension: x.ext
			}
		});
}

export const parse_soundcloud_tracks = (tracks, soundcloud_api_key) => {
	return tracks
		.map(x => {
			return {
				type: Type.SOUNDCLOUD_TRACK,
				download_url: x.stream_url + '?client_id=' + soundcloud_api_key || null,
				stream_url: x.stream_url + '?client_id=' + soundcloud_api_key || null,
				song_length: x.duration || null,
				title: x.title || null,
				bit_rate: null,
				size: null
			}
		}).filter(x => x.stream_url);
}

export const parse_youtube_images = (image) => {
	return Object.keys(image)
		.map(x => {
			return {
				url: image[x].url || '',
				size: x
			}
		}).filter(y => y.url !== '');
}

export const parse_metro_lyrics = (json_data) => {
	return {
		text: json_data.song,
		url: json_data.url,
		line_count: json_data.line_count,
		songmeaning_lines: json_data.songmeaning_lines,
		songmeanings: json_data.songmeanings,
		songlinetimestamps: json_data.songLinetimestamps
	}
}