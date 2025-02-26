import axios from "axios";

export const makeServerCall = (method, url, params) =>

	new Promise((resolve, reject) => {

		const callParams = {};

		if (Object.keys(params).length) {

			// remove empty parameters
			Object.keys(params)
				.forEach((key) => {
					if (params[key] !== undefined) {
						callParams[key] = params[key];
					}
				});

		}

		const axiosRequest = {
			method,
			url,
		};

		if (method === "get") {

			axiosRequest.params = callParams;

		} else {

			axiosRequest.data = callParams;

		}

		axios(axiosRequest)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});

	});
