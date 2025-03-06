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
					league: team.league,
					logo: team.logo1 + team.logo2 + team.logo3 + team.logo4,
				})))
			)

			.catch((error) =>
				reject(error));

	});
