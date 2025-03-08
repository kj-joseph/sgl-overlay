import { callGoogleSheets } from "@/services/googleSheetsService";

export const getSchedule = async () =>

	new Promise((resolve, reject) => {

		callGoogleSheets("schedule", {})
			.then((response) =>
				resolve(response.map(series => ({
					matchday: Number(series.matchday),
					played: series.played === "TRUE",
					teams: [series.team1, series.team2],
					score: [
						series.score1 ? Number(series.score1) : "",
						series.score2 ? Number(series.score2) : "",
					],
					tier: series.tier,
					scheduled: series.scheduled || "TBD",
				})))
			)

			.catch((error) =>
				reject(error));

	});
