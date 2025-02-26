import { callSheets } from "@/services/sheetsService";

export const getTeamList = async () =>

	new Promise((resolve, reject) => {

		callSheets("teams", {})
			.then((response) =>
				resolve(response))

			.catch((error) =>
				reject(error));

	});
