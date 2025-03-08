import React from "react";

import displayDecimal from "@/utils/displayDecimal";
import imageLocation from "@/utils/imageLocation";

const longTeamName = 16;
const longFranchiseName = 25;

const TeamStatsTable = (props) => {

	const teamName = (teamnum) =>
		props.config.teams[teamnum].shortName ? props.config.teams[teamnum].shortName :
		props.config.teams[teamnum].name ? props.config.teams[teamnum].name : props.gameData.teams[teamnum].name;

	return (
		<table className="teamStatsTable">
			<thead>
				<tr>
					<th className="teamName team0" style={props.teamColors ? {backgroundColor: `#${props.teamColors[0]}`} : null}>
						<div className="logo">
							{props.showLogos && props.config.teams[0].logo ?
								<img
									src={imageLocation(props.config.teams[0].logo, "images/logos/teams")}
									style={props.config.teams[0].bgColor ?
										{
											backgroundColor: `#${props.config.teams[0].bgColor}`,
										} : {}
									}
								/>
							: null}
						</div>
						<div className="teamText">
							<div className={`name ${teamName(0).length >= longTeamName ? "long" : ""}`}>{teamName(0)}</div>

							{props.config.teams[0].franchise ?
								<div className={`franchise ${props.config.teams[0].franchise.length >= longFranchiseName ? "long" : ""}`}>{props.config.teams[0].franchise}</div>
							: null}
						</div>
					</th>

					<td className="centerColumn"></td>

					<th className="teamName team1" style={props.teamColors ? {backgroundColor: `#${props.teamColors[1]}`} : null}>
						<div className="logo">
							{props.showLogos && props.config.teams[1].logo ?
								<img
									src={imageLocation(props.config.teams[1].logo, "images/logos/teams")}
									style={props.config.teams[1].bgColor ?
										{
											backgroundColor: `#${props.config.teams[1].bgColor}`,
										} : {}
									}
								/>
							: null}
						</div>
						<div className="teamText">
							<div className={`name ${teamName(1).length >= longTeamName ? "long" : ""}`}>{teamName(1)}</div>

							{props.config.teams[1].franchise ?
								<div className={`franchise ${props.config.teams[1].franchise.length >= longFranchiseName ? "long" : ""}`}>{props.config.teams[1].franchise}</div>
							: null}
						</div>
					</th>
				</tr>
			</thead>

			<tbody>
				{props.statList.map((stat, statIndex) => (
					<tr key={`stat${statIndex}`}>
						{stat.name == "%%SERIES%%" ?
							props.pregameStats.teamStats[0] && props.pregameStats.teamStats[0].hasOwnProperty("seriesWins") && props.pregameStats.teamStats[0].hasOwnProperty("seriesLosses") ?
								<td
									key={`team0${statIndex}`}
									className={`team0 ${props.pregameStats.teamStats[1] && props.pregameStats.teamStats[1].hasOwnProperty("seriesWins") && props.pregameStats.teamStats[1].hasOwnProperty("seriesLosses") && (props.pregameStats.teamStats[0].seriesWins / props.pregameStats.teamStats[0].seriesLosses) >= (props.pregameStats.teamStats[1].seriesWins / props.pregameStats.teamStats[1].seriesLosses) ? "better" : ""}`}>
									{props.pregameStats.teamStats[0].seriesWins}<span className="hyphen">-</span>{props.pregameStats.teamStats[0].seriesLosses}
								</td>
							:
								<td key={`team0${statIndex}`} className={`team0`}>
									n/a
								</td>
						: stat.name == "%%GAMES%%" ?
							props.pregameStats.teamStats[0] && props.pregameStats.teamStats[0].hasOwnProperty("gameWins") && props.pregameStats.teamStats[0].hasOwnProperty("gameLosses") ?
								<td
									key={`team0${statIndex}`}
									className={`team0 ${props.pregameStats.teamStats[1] && props.pregameStats.teamStats[1].hasOwnProperty("gameWins") && props.pregameStats.teamStats[1].hasOwnProperty("gameLosses") && (props.pregameStats.teamStats[0].gameWins / props.pregameStats.teamStats[0].gameLosses) >= (props.pregameStats.teamStats[1].gameWins / props.pregameStats.teamStats[1].gameLosses) ? "better" : ""}`}>
									{props.pregameStats.teamStats[0].gameWins}<span className="hyphen">-</span>{props.pregameStats.teamStats[0].gameLosses}
								</td>
							:
								<td key={`team0${statIndex}`} className={`team0`}>
									n/a
								</td>


						:
							props.pregameStats.teamStats[0] && props.pregameStats.teamStats[0].hasOwnProperty(stat.name) ?
								<td key={`team0${statIndex}`}
									className={`team0
										${props.pregameStats.teamStats[1] && props.pregameStats.teamStats[1].hasOwnProperty(stat.name) ?
											stat.best === "higher" && props.pregameStats.teamStats[0][stat.name] >= props.pregameStats.teamStats[1][stat.name]
											? "better"
											: stat.best === "lower" && props.pregameStats.teamStats[0][stat.name] <= props.pregameStats.teamStats[1][stat.name]
												? "better"
											: ""
										: ""}`}
								>
									{displayDecimal(props.pregameStats.teamStats[0][stat.name], stat.round)}
									{stat.name==="shotPct" ?
										<span className="pctSymbol">%</span>
									: null}
								</td>
							:
								<td key={`team0${statIndex}na`} className={`team0`}>
									n/a
								</td>
						}
						<th scope="row" className="centerColumn"><span>{stat.label}</span></th>
						{stat.name == "%%SERIES%%" ?
							props.pregameStats.teamStats[1] && props.pregameStats.teamStats[1].hasOwnProperty("seriesWins") && props.pregameStats.teamStats[1].hasOwnProperty("seriesLosses") ?
								<td
									key={`team1${statIndex}`}
									className={`team1 ${props.pregameStats.teamStats[0] && props.pregameStats.teamStats[0].hasOwnProperty("seriesWins") && props.pregameStats.teamStats[0].hasOwnProperty("seriesLosses") && (props.pregameStats.teamStats[1].seriesWins / props.pregameStats.teamStats[1].seriesLosses) >= (props.pregameStats.teamStats[0].seriesWins / props.pregameStats.teamStats[0].seriesLosses) ? "better" : ""}`}>
									{props.pregameStats.teamStats[1].seriesWins}<span className="hyphen">-</span>{props.pregameStats.teamStats[1].seriesLosses}
								</td>
							:
								<td key={`team1${statIndex}`} className={`team1`}>
									n/a
								</td>
						: stat.name == "%%GAMES%%" ?
							props.pregameStats.teamStats[1] && props.pregameStats.teamStats[1].hasOwnProperty("gameWins") && props.pregameStats.teamStats[1].hasOwnProperty("gameLosses") ?
								<td
									key={`team1${statIndex}`}
									className={`team1 ${props.pregameStats.teamStats[0] && props.pregameStats.teamStats[0].hasOwnProperty("gameWins") && props.pregameStats.teamStats[0].hasOwnProperty("gameLosses") && (props.pregameStats.teamStats[1].gameWins / props.pregameStats.teamStats[1].gameLosses) >= (props.pregameStats.teamStats[0].gameWins / props.pregameStats.teamStats[0].gameLosses) ? "better" : ""}`}>
									{props.pregameStats.teamStats[1].gameWins}<span className="hyphen">-</span>{props.pregameStats.teamStats[1].gameLosses}
								</td>
							:
								<td key={`team1${statIndex}`} className={`team1`}>
									n/a
								</td>
						:
							props.pregameStats.teamStats[1] && props.pregameStats.teamStats[1].hasOwnProperty(stat.name) ?
								<td key={`team1${statIndex}na`}
									className={`team1
										${props.pregameStats.teamStats[0] && props.pregameStats.teamStats[0].hasOwnProperty(stat.name) ?
											stat.best === "higher" && props.pregameStats.teamStats[1][stat.name] >= props.pregameStats.teamStats[0][stat.name]
											? "better"
											: stat.best === "lower" && props.pregameStats.teamStats[1][stat.name] <= props.pregameStats.teamStats[0][stat.name]
												? "better"
											: ""
										: ""}`}
								>
									{displayDecimal(props.pregameStats.teamStats[1][stat.name], stat.round)}
									{stat.name==="shotPct" ?
										<span className="pctSymbol">%</span>
									: null}
								</td>
							:
								<td key={`team1${statIndex}na`} className={`team1`}>
									n/a
								</td>
						}
					</tr>
				))}
			</tbody>

		</table>

	)

}

export default TeamStatsTable;
