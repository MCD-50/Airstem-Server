import didYouMean from 'didyoumean';

export const get_closest_image_match = (value, _array, key) => {
	const result = get_closest_match(value, _array, key);
	if(result && typeof(result) != 'obj'){
		return _array.filter(x => x[key] === result)[0].images || [];
	}else if(result){
		return result;
	}
	return []
}

const get_closest_match = (value, _array, key) => {
	didYouMean.caseSensitive = false;
	didYouMean.threshold = null;
	return didYouMean(value, _array, key);
};