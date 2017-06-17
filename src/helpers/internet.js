import request from 'request';

export const make_request = (url, callback) => {
	resolve_request(url)
		.then((res) => callback(null, res))
		.catch((rej) => callback(rej, null));
}

export const resolve_request = (url) => {
	return new Promise((resolve, reject) => {
		if (url) {
			request(url, (error, response) => {
				if (!error && response.statusCode == 200) {
					resolve(JSON.parse(response.body));
				} else {
					resolve(true);
				}
			})
		} else {
			resolve(true);
		}
	});
}