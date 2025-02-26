import { callGoogleSheets } from "@/services/googleSheetsService";

export const getTeamList = async () =>

	new Promise((resolve, reject) => {

		callGoogleSheets("teams", {})
			.then((response) =>
				resolve(response.map(team => ({
					name: team.name,
					soccerTeamAbbreviation: team.soccerTeamAbbreviation,
					soccerTeamCity: team.soccerTeamCity,
					soccerTeamName: team.soccerTeamName,
					bgColor: team.bgColor,
					league: team.league,
					logo: `${team.logo1}${team.logo2}`,
				})))
			)

			.catch((error) =>
				reject(error));

	});
