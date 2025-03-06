import { callGoogleSheets } from "@/services/googleSheetsService";

export const getTierList = async () =>

	new Promise((resolve, reject) => {

		callGoogleSheets("tiers", {})
			.then((response) =>
				resolve(response.map(tier => ({
					id: tier.id,
					name: tier.name,
				})))
			)

			.catch((error) =>
				reject(error));

	});
