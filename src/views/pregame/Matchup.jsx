import React, { Fragment } from "react";

import Header from "@/components/Header";
import SeriesInfo from "@/components/SeriesInfo";

import imageLocation from "@/utils/imageLocation";

const longTeamName = 16;
const longFranchiseName = 25;

const Matchup = (props) => {

	const teamName = (teamnum) => props.config.teams[teamnum].name ? props.config.teams[teamnum].name : props.gameData.teams[teamnum].name;

	return (
		<div className={`matchup ${(props.config.series.show && props.config.series.type !== "unlimited") || props.config.series.override ? "hasSeriesInfo" : ""}`}>

			<div className="matchupHeader">

				{props.config.general.streamType === "SGL-regular" || props.config.general.streamType === "SGL-playoffs" || props.config.general.streamType === "SGL-event" ?
					<>
						<div className="leagueLogo">
							{props.config.general.brandLogo ?
								<img src={imageLocation(props.config.general.brandLogo, "images/logos")}></img>
							: null}
						</div>
						<div className="leagueName">Supporters<br />Gaming League</div>
					</>
				: null}

				<Header
					theme={props.config.general.theme}
					headers={props.config.general.headers}
					streamType={props.config.general.streamType}
					season={props.config.general.season}
					matchday={props.config.general.matchday}
					league={props.config.general.league}
					round={props.config.general.round}
				/>

			</div>

			<div className="matchupTeams">

				{props.gameData.teams.map((team, teamnum) => (
					<Fragment key={`matchupTeam${teamnum}`}>
						<div
							className={`team team${teamnum} ${props.config.teams[teamnum].hasOwnProperty("logo") && props.config.teams[teamnum].logo ? "hasLogo" : ""}`}
						>
							{props.config.teams[teamnum].logo ? (
								<div className="logo"
									style={props.config.teams[teamnum].bgColor ?
										{
											backgroundColor: `#${props.config.teams[teamnum].bgColor}`,
										} : {}
									}
								>
									<img src={imageLocation(props.config.teams[teamnum].logo, "images/logos/teams")}></img>
								</div>
							) :
								<div className="logo"></div>
							}

							<div className="teamText">
								<div className={`name ${teamName(teamnum).length >= longTeamName ? "long" : ""}`}>{teamName(teamnum)}</div>

								{props.config.teams[teamnum].franchise ?
									<div className={`franchise ${props.config.teams[teamnum].franchise.length >= longFranchiseName ? "long" : ""}`}>{props.config.teams[teamnum].franchise}</div>
								: null}
							</div>

						</div>

						{teamnum === 0 ?

							props.config.general.streamType === "SGL-regular" || props.config.general.streamType === "SGL-playoffs" || props.config.general.streamType === "SGL-event" ?
								<div className="vs">VS</div>
							:
								<div className="matchupCenter">
									{props.config.general.brandLogo ?
										<img src={imageLocation(props.config.general.brandLogo, "images/logos")}></img>
									:
										<div className="vs">VS</div>
									}
								</div>

						: null}

					</Fragment>
				))}

			</div>

		</div>
	)

}

export default Matchup;
