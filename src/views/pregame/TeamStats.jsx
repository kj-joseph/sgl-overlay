import React, { Fragment } from "react";

import Header from "@/components/Header";
import SeriesInfo from "@/components/SeriesInfo";
import TeamStatsTable from "@/components/TeamStatsTable";

import imageLocation from "@/utils/imageLocation";

const longTeamName = 16;
const longFranchiseName = 25;

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

	const teamName = (teamnum) => team.name ? team.name : props.gameData.teams[teamnum].name;

	return (
		<div className={`teamStats ${(props.config.series.show && props.config.series.type !== "unlimited") || props.config.series.override ? "hasSeriesInfo" : ""}`}>

			<div className="teamStatsHeader">

				<div className="leagueLogo">
					{props.config.general.brandLogo ?
						<img src={imageLocation(props.config.general.brandLogo, "images/logos")} />
					: null}
				</div>
				<div className="teamStatsTitle">Team Comparison</div>

				<Header
					theme={props.config.general.theme}
					headers={props.config.general.headers}
					streamType={props.config.general.streamType}
					season={props.config.general.season}
					matchday={props.config.general.matchday}
					round={props.config.general.round}
					tier={props.config.general.tier}
				/>

			</div>

			<TeamStatsTable
				bgColors={props.config.teams.map((team, teamnum) =>
					props.config.general.theme === "sgl" ?
						team.bgColor ? team.bgColor
							: team.color ? team.color
								: props.gameData.hasOwnProperty("teams")
									&& Array.isArray(props.gameData.teams)
									&& props.gameData.teams[teamnum].hasOwnProperty("color_primary")
									? props.gameData.teams[teamnum].color_primary
										: props.teamColorsDefault[teamnum]
					: ""
				)}
				config={props.config}
				pregameStats={props.pregameStats}
				statList={statList}
				showLogos={true}
				teamColorsDefault={props.teamColorsDefault}
			></TeamStatsTable>

		</div>
	)

}

export default TeamStats;
