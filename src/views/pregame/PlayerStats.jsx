import React, { Fragment } from "react";

import Header from "@/components/Header";
import SeriesInfo from "@/components/SeriesInfo";

import PlayerStatsTable from "@/components/PlayerStatsTable";

import imageLocation from "@/utils/imageLocation";

const longTeamName = 16;
const longFranchiseName = 25;

const statList = [
    {
        name: "gp",
        label: "Games",
		round: 0,
    },
    {
        name: "goals",
        label: "Goals",
		round: 0,
    },
    {
        name: "shots",
        label: "Shots",
		round: 0,
    },
    {
        name: "shotPct",
        label: "Shot %",
		round: 2,
    },
    {
        name: "assists",
        label: "Assists",
		round: 0,
    },
    {
        name: "saves",
        label: "Saves",
		round: 0,
	},
    {
        name: "demos",
        label: "Demos",
		round: 0,
	},
];

const PlayerStats = (props) => {

	const teamName = (teamnum) => props.config.teams[teamnum].name ? props.config.teams[teamnum].name : props.gameData.teams[teamnum].name;

	return (
		<div className={`playerStats team${props.team}`}>

			<div className="playerStatsHeader">

				<div className="leagueLogo">
					{props.config.general.brandLogo ?
						<img src={imageLocation(props.config.general.brandLogo, "images/logos")} />
					: null}
				</div>
				<div className="playerStatsTitle">Player Stats</div>

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

			<PlayerStatsTable
				bgColor={props.config.general.theme === "sgl" ?
					props.config.teams[props.team].bgColor
					? props.config.teams[props.team].bgColor
						: props.config.teams[props.team].color ?
								props.config.teams[props.team].color
								: props.gameData.hasOwnProperty("teams")
									&& Array.isArray(props.gameData.teams)
									&& props.gameData.teams[props.team].hasOwnProperty("color_primary")
									? props.gameData.teams[props.team].color_primary
										: props.teamColorsDefault[props.team]
					: null}
				config={props.config}
				pregameStats={props.pregameStats}
				statList={statList}
				showLogos={true}
				team={props.team}

			></PlayerStatsTable>

		</div>
	)

}

export default PlayerStats;
