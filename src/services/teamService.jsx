import { callApi, callStats } from "@/services/apiService";
import sglTeams from "@/data/sglTeams";

// TODO: pulling locally for now; maybe API endpoint?
export const getTeamList = async (league, tier, season) =>

	new Promise((resolve, reject) => {

		resolve(sglTeams)
			.then((response) =>
				resolve(response.data))

			.catch((error) =>
				reject(error));

	});
