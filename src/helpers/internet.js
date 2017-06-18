import request from 'request';

export const make_request = (url, callback, is_url_encode = false) => {
	resolve_request(url, is_url_encode)
		.then((res) => callback(null, res))
		.catch((rej) => callback(rej, null));
}

export const is_online = (url, callback) => {
	const options = {
		url: url,
		method: 'HEAD',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	}
	request(options, (error, response) => {
		if (!error && response.statusCode == 200) {
			callback(null, response.headers);
		} else {
			callback(true, null);
		}
	})
}

export const resolve_request = (url, is_url_encode) => {
	return new Promise((resolve, reject) => {
		if (url) {
			if (is_url_encode) {
				const options = {
					url: url,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}
				request(options, (error, response) => {
					if (!error && response.statusCode == 200) {
						resolve(JSON.parse(response.body));
					} else {
						reject(true);
					}
				})
			} else {
				request(url, (error, response) => {
					if (!error && response.statusCode == 200) {
						resolve(JSON.parse(response.body));
					} else {
						reject(true);
					}
				})
			}
		} else {
			reject(true);
		}
	});
}