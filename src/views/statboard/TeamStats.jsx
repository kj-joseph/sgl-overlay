import React, { Fragment, useEffect, useState } from "react";

import TeamStatsTable from "@/components/TeamStatsTable";

import "@/style/statboard.scss";

const statList = [
    {
        name: "%%SERIES%%",
        label: "Series Record",
    },
    {
        name: "%%GAMES%%",
        label: "Game Record",
    },
    {
        name: "goalsPerGame",
        label: "Goals For",
		round: 2,
		best: "higher",
    },
    {
        name: "shotsPerGame",
        label: "Shots",
		round: 2,
		best: "higher",
    },
    {
        name: "shotPct",
        label: "Shot Pct",
		round: 2,
		best: "higher",
    },
    {
        name: "assistsPerGame",
        label: "Assists",
		round: 2,
		best: "higher",
    },
    {
        name: "oppGoalsPerGame",
        label: "Goals Vs",
		round: 2,
		best: "lower",
    },
    {
        name: "savesPerGame",
        label: "Saves",
		round: 2,
		best: "higher",
	},
];

const TeamStats = (props) => {

	return (
		<div className="statboardTeamStats">

			<TeamStatsTable
				config={props.config}
				pregameStats={props.pregameStats}
				statList={statList}
				showLogos={false}
				teamColors={props.teamColors}
			></TeamStatsTable>

		</div>
	)

}

export default TeamStats;
