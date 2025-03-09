import React, { Fragment } from "react";

import Header from "@/components/Header";
import TeamLogo from "@/components/TeamLogo";

import hexToRgba from "@/utils/hexToRgba";
import imageLocation from "@/utils/imageLocation";

const longTeamName = 16;
const longFranchiseName = 25;

const MatchdaySchedule = (props) => {

	const teamData = (code) => props.teamList.filter(team => team.code === code)[0];

	return (
		<div className="matchdaySchedule">

			<div className="matchdayScheduleHeader">

				<div className="leagueLogo">
					{props.config.general.brandLogo ?
						<img src={imageLocation(props.config.general.brandLogo, "images/logos")} />
					: null}
				</div>

				<Header
					theme={props.config.general.theme}
					headers={props.config.general.headers}
					streamType={props.config.general.streamType}
					season={props.config.general.season}
					matchday={`${props.config.general.matchday} Schedule`}
					round={props.config.general.round}
				/>

			</div>

			<div className="tierBlocks">

				{props.tierList.map((tier, tierIndex) =>
					<div className="tier" key={tierIndex}>
						<div className="tierName" data-tier-name={tier.name}>{tier.name}</div>

						<div className="tierMatches">

							{props.schedule
								.filter(m => m.matchday === Number(props.config.general.matchday) && m.tier === tier.id)
								.length > 0 ?

								props.schedule
									.filter(m => m.matchday === Number(props.config.general.matchday) && m.tier === tier.id)
									.sort((a, b) =>
										a.scheduled < b.scheduled ? -1 :
											a.scheduled > b.scheduled ? 1 : 0
									)
									.map((match, matchIndex) =>
										<div className="match" key={matchIndex}>

											{match.teams.map((teamCode, teamIndex) =>
												<div
													key={teamIndex}
													className={`matchTeam team${teamIndex}`}
													style={{
														"--bgColor": hexToRgba(teamData(teamCode).bgColor, 90),
													}}
												>
													<TeamLogo
														team={teamIndex}
														logo={teamData(teamCode).logo}
														bgColor={teamData(teamCode).bgColor}
													/>

													<div className="teamName">{teamData(teamCode).shortName}</div>

													{props.viewOptions.indexOf("scores") > -1 && match.played && match.score.indexOf("") === -1 ?
														<div className={`teamScore ${(teamIndex === 0 && match.score[0] > match.score[1]) || (teamIndex === 1 && match.score[1] > match.score[0]) ? "winner" : ""}`}>
															{match.score[teamIndex]}
														</div>

													: null}

												</div>
											)}

											{props.viewOptions.indexOf("times") > -1 ?
												<div className={`matchTime ${
													props.viewOptions.indexOf("today") > -1 &&
														new Date(match.scheduled).toLocaleDateString("en-us", { month: "long", day: "numeric" }) === new Date().toLocaleDateString("en-us", { month: "long", day: "numeric" }) ? "today"
												: ""} ${match.onStream ?
													"stream"
												: ""}`}>
													{match.scheduled !== "TBD" ?
														`${new Date(match.scheduled).toLocaleDateString("en-us", { weekday: "long", month: "long", day: "numeric" })} - ${new Date(match.scheduled).toLocaleTimeString("en-us", { hour12: true, hour: "numeric", minute: "numeric" })}`
													: "TBD"}
													{match.onStream ?
														<img class="streamIcon" src="/images/social/twitch.png" />
													: null}
												</div>
											: null}

										</div>
									)

							:

								<div class="noGames">No games scheduled</div>


							}

						</div>

					</div>

				)}

			</div>

			<div className="matchdayScheduleCaption">(All times Eastern)</div>

		</div>
	)

}

export default MatchdaySchedule;
