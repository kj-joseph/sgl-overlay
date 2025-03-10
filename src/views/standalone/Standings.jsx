import React, { useEffect, useState } from "react";

import Standings from "@/views/pregame/Standings";

import { getSchedule } from "@/services/scheduleService";
import { getTeamList } from "@/services/teamService";
import { getTierList } from "@/services/tierService";

const currentSeason = 9; // TODO: set on new season

const StandaloneStandings = () => {

	const [loaded, setLoaded] = useState(false);
	const [scheduleList, setScheduleList] = useState([]);
	const [teamList, setTeamList] = useState([]);
	const [tierList, setTierList] = useState([]);

	const currentSeason = 9; // TODO: set on new season


	const config = {
		general: {
			headers: [],
			theme: "sgl",
			streamType: "SGL-regular",
			season: currentSeason,
			brandLogo: "sgl-logo.png",
		}
	};


	useEffect(() => {
		document.title = "SGL Standings | Supporters Gaming League";

		Promise.all([
			loadTeamList(),
			loadTierList(),
			loadSchedule(),
		])
			.then(() => {
				setLoaded(true);
			})
			.catch((error) => {
			});
		;
	}, []);

	const loadTierList = async () => {

		if (!Array.isArray(tierList) || tierList.length < 1 ) {
			getTierList()
				.then((loadedTierList) => {
					setTierList(loadedTierList);
				})
				.catch((error) => {
					closeDialog();
					console.error(error);
					openSnackbar("Error getting tier list from sheets");
				});

		}
	}

	const loadSchedule = async () => {

		getSchedule()
			.then((loadedSchedule) => {
				setScheduleList(loadedSchedule);
			})
			.catch((error) => {
				console.error(error);
				openSnackbar("Error getting schedule from sheets");
			});

	}

	const loadTeamList = async () => {

		if (!Array.isArray(teamList) || teamList.length < 1 ) {

			getTeamList()
				.then((loadedTeamList) => {
					setTeamList(loadedTeamList);
				})
				.catch((error) => {
					console.error(error);
					openSnackbar("Error getting team list from sheets");
				});
		}

	}

	return (

		<div id="Standalone" className="sgl">

			{loaded ?

				<Standings
					config={config}
					schedule={scheduleList}
					teamList={teamList}
					tierList={tierList}
				/>

			: null}

		</div>

	);

}

export default StandaloneStandings;
