import request from 'request';

export const make_request = (url, callback, is_url_encode = false) => {
	resolve_request(url, is_url_encode)
		.then((res) => callback(null, res))
		.catch((rej) => callback(rej, null));
}

export const is_online = (items, callback) => {
	const _items = items;
	let requests = _items.map((x, index) => {
		const options = {
			url: x.download_url,
			method: 'HEAD',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}

		let count = 0;

		return new Promise((resolve, reject) => {
			request(options, (error, response) => {
				if (!error && response.statusCode == 200 && response.headers &&
					response.headers['content-type'] && response.headers['content-type'].includes('audio')) {
					items[index]['is_online'] = true
				} else {
					items[index]['is_online'] = false
				}
				resolve();
			})
		});
	});

	Promise.all(requests)
		.then(() => callback(items));
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