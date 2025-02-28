import { callGoogleSheets } from "@/services/googleSheetsService";

export const getPlayerStatsByTeams = async (teamCodes) =>

	new Promise((resolve, reject) => {

		callGoogleSheets("playerStats", {})
			.then((response) => {
				resolve(
					teamCodes.map(team =>
						response.filter(p => p.Team === team)
							.map(player => ({
								playerName: player.Player,
								gp: Number(player.GamesPlayed),
								goals: Number(player.TotalGoals),
								shots: Number(player.TotalShots),
								shotPct: Number(player.ShootingPercentage),
								assists: Number(player.TotalAssists),
								saves: Number(player.TotalSaves),
								demos: Number(player.TotalDemosInflicted),
							}))
					)
				);
			})

			.catch((error) =>
				reject(error));

	});

	export const getTeamStatsByTeams = async (teamCodes) =>

		new Promise((resolve, reject) => {

			callGoogleSheets("teamStats", {})
				.then((response) => {
					const teamStats = [];

					teamCodes.map(t => {
						const teamStatRecord = response.filter(tm => tm.Code === t);

						if (teamStatRecord.length === 1) {
							console.log()
							teamStats.push({
								teamName: teamStatRecord[0].Team,
								seriesWins: Number(teamStatRecord[0].SeriesWins),
								seriesLosses: Number(teamStatRecord[0].SeriesLosses),
								gameWins: Number(teamStatRecord[0].GameWins),
								gameLosses: Number(teamStatRecord[0].GameLosses),
								gp: Number(teamStatRecord[0].GamesPlayed),
								goals: Number(teamStatRecord[0].TotalGoals),
								goalsPerGame: Number(teamStatRecord[0].GoalsperGame),
								assists: Number(teamStatRecord[0].TotalAssists),
								assistsPerGame: Number(teamStatRecord[0].AssistsperGame),
								saves: Number(teamStatRecord[0].TotalSaves),
								savesPerGame: Number(teamStatRecord[0].SavesperGame),
								shots: Number(teamStatRecord[0].TotalShots),
								shotsPerGame: Number(teamStatRecord[0].ShotsperGame),
								shotPct: Number(teamStatRecord[0].ShootingPercentage),
								oppGoals: Number(teamStatRecord[0].TotalGoalsAgainst),
								oppGoalsPerGame: Number(teamStatRecord[0].GoalsAgainstperGame),
								oppShots: Number(teamStatRecord[0].TotalShotsAgainst),
								oppShotsPerGame: Number(teamStatRecord[0].ShotsAgainstperGame),
								demos: Number(teamStatRecord[0].TotalDemosInflicted),
								demosPerGame: Number(teamStatRecord[0].DemosInflictedperGame),
								oppDemos: Number(teamStatRecord[0].TotalDemosTaken),
								oppDemosPerGame: Number(teamStatRecord[0].DemosTakenperGame),
							})
						} else {
							teamStats.push({});
						}
					});

					resolve(teamStats);
				})

				.catch((error) =>
					reject(error));

		});
