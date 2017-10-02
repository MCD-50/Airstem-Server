import didYouMean from 'didyoumean';

export const get_response = (meta = {}, result = []) => {
	return {
		meta: meta,
		result: result
	}
}


export const get_match_response = (meta = {}, result = {}) => {
	return {
		meta: meta,
		result: result
	}
}

export const get_closest_image_match = (value, _array, key, r_first_match = false) => {
	const result = get_closest_match(value, _array, key, r_first_match);
	if (result && typeof (result) != 'obj') {
		return _array.filter(x => x[key] === result)[0].images || [];
	} else if (result) {
		return result;
	}
	return []
}

export const get_closest_track_match = (value, _array, key, r_first_match = false, threshold = 40) => {
	const result = get_closest_match(value, _array, key, r_first_match, threshold);
	_array = _array.filter(x => {
		if(x && x.song_length){
			const songLength = x.song_length.toString().split(':')[0];
			if(songLength && parseInt(songLength) > 2){
				return x;
			}
		}else{
			return x;
		}
	})
	
	if (result && typeof (result) != 'obj') {
		return _array.filter(x => x[key] === result)[0] || {};
	} else if (result) {
		return result;
	}
	return {}
}

const get_closest_match = (value, _array, key, r_first_match, threshold = 30) => {
	didYouMean.caseSensitive = false;
	didYouMean.threshold = null;
	didYouMean.returnFirstMatch = r_first_match
	didYouMean.thresholdAbsolute = threshold;
	return didYouMean(value, _array, key);
};

