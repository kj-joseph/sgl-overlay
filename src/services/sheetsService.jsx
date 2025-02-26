import { makeServerCall } from "@/services/serverCallService";

import apiData from "@/data/apiData";

const sheetsUrl = "https://sheets.googleapis.com/v4/spreadsheets/";

export const callSheets = (sheetName, params) =>

	new Promise((resolve, reject) => {

		if (!apiData.hasOwnProperty("sheets") || !apiData.sheets.sheetData.hasOwnProperty(sheetName)) {
			throw(`Sheet ID not found: ${sheetName}`)
		}

		makeServerCall(
			"get",
			`${apiData.sheets.url}/${apiData.sheets.sheetData[sheetName].id}/values/${apiData.sheets.sheetData[sheetName].table}`,
			{...params,
				key: apiData.sheets.apiKey,
			}
		)
			.then((response) =>	{
				const responseData = [];

				if (response.data.values.length > 1) {
					const keys = response.data.values[0];

					for (let row = 1; row < response.data.values.length; row++) {
						const rowObject = {};
						for (let key = 0; key < keys.length; key++) {
							rowObject[keys[key]] = response.data.values[row][key];
						}
						responseData.push(rowObject);
					}
				}
				resolve(responseData);

			})
			.catch((error) =>
				reject(error));

	});
