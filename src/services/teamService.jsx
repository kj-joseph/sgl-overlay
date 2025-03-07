import { callGoogleSheets } from "@/services/googleSheetsService";

export const getTeamList = async () =>

	new Promise((resolve, reject) => {

		callGoogleSheets("teams", {})
			.then((response) =>
				resolve(response.map(team => ({
					name: team.name,
					shortName: team.shortName,
					code: team.code,
					soccerTeamAbbreviation: team.soccerTeamAbbreviation,
					soccerTeamLocation: team.soccerTeamLocation,
					soccerTeamName: team.soccerTeamName,
					bgColor: team.bgColor,
					tier: team.tier,
					logo: team.logo,
				})))
			)

			.catch((error) =>
				reject(error));

	});
