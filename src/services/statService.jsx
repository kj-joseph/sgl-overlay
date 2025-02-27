import { callGoogleSheets } from "@/services/googleSheetsService";

export const getPlayerStatsByTeams = async (teamCodes) =>

	new Promise((resolve, reject) => {

		callGoogleSheets("stats", {})
			.then((response) => {
				console.log(response);
				resolve(
					teamCodes.map(team =>
						response.filter(p => p.Team === team)
							.map(player => ({
								playerName: player.Player,
								gp: player.GamesPlayed,
								goals: player.TotalGoals,
								shots: player.TotalShots,
								shotPct: player.ShootingPercentage,
								assists: player.TotalAssists,
								saves: player.TotalSaves,
								demos: player.TotalDemosInflicted,
							}))
					)
				)
			})

			.catch((error) =>
				reject(error));

	});
