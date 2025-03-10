import React, { Fragment } from "react";

import Header from "@/components/Header";
import TeamLogo from "@/components/TeamLogo";

import displayDecimal from "@/utils/displayDecimal";
import hexToRgba from "@/utils/hexToRgba";
import imageLocation from "@/utils/imageLocation";

const Standings = (props) => {

	const teamData = (code) => props.teamList.filter(team => team.code === code)[0];

	return (
		<div className="leagueStandings">

			<div className="leagueStandingsHeader">

				<div className="leagueLogo">
					{props.config.general.brandLogo ?
						<img src={imageLocation(props.config.general.brandLogo, "images/logos")} />
					: null}
				</div>

				<Header
					headers={props.config.general.headers}
					round={props.config.general.round}
					season={props.config.general.season}
					streamType={props.config.general.streamType}
					theme={props.config.general.theme}
					view="standings"
				/>

			</div>

			<div className="tierBlocks">

				{props.tierList.map((tier, tierIndex) =>
					<div className="tier" key={tierIndex}>

						<table className="tierStandingsTable">

							<thead>
								<tr>
									<th className="team"><span>{tier.name}</span></th>
									<th className="w">W</th>
									<th className="l">L</th>
									<th className="pct">Gm%</th>
									<th className="pts">PTS</th>
								</tr>
							</thead>

							<tbody>
								{props.teamList
									.filter(team => team.tier === tier.id)
									.map(team => ({
										shortName: team.shortName,
										code: team.code,
										logo: team.logo,
										bgColor: team.bgColor,
										seriesWins: props.schedule.filter(game => game.played &&
											((game.teams[0] === team.code && game.score[0] > game.score[1])
											|| (game.teams[1] === team.code && game.score[1] > game.score[0]))
										).length,
										seriesLosses: props.schedule.filter(game => game.played &&
											((game.teams[0] === team.code && game.score[0] < game.score[1])
											|| (game.teams[1] === team.code && game.score[1] < game.score[0]))
										).length,
										gameWins: props.schedule.filter(game => game.played && game.teams.indexOf(team.code) > -1)
											.reduce((total, game) =>
												total + (
													game.teams[0] === team.code ? game.score[0]
													: game.teams[1] === team.code ? game.score[1]
													: 0
												) , 0),
										gameLosses: props.schedule.filter(game => game.played && game.teams.indexOf(team.code) > -1)
											.reduce((total, game) =>
												total + (
													game.teams[0] === team.code ? game.score[1]
													: game.teams[1] === team.code ? game.score[0]
													: 0
												) , 0),
									}))
									.map(team => ({
										...team,
										points: team.gameWins + team.seriesWins,
									}))
									.sort((a, b) =>
										a.points < b.points ? 1 : a.points > b.points ? -1
										: a.seriesWins < b.seriesWins ? 1 : a.seriesWins > b.seriesWins ? -1
										: a.seriesLosses > b.seriesLosses ? 1 : a.seriesLosses < b.seriesLosses ? -1
										: a.gameWins / (a.gameWins + a.gameLosses) < b.gameWins / (b.gameWins + b.gameLosses) ? 1 : a.gameWins / (a.gameWins + a.gameLosses) > b.gameWins / (b.gameWins + b.gameLosses)? -1
										: a.name < b.name ? 1 : a.name > b.name ? -1
										: 0
									)
									.map(team =>
										<tr key={team.code}
											style={{
												"--bgColor": hexToRgba(team.bgColor, 90),
											}}
										>
											<th className="team">
												<TeamLogo
													team={0}
													logo={team.logo}
													bgColor={team.bgColor}
												/>
												<div className="teamName">{team.shortName}</div>
												<div className="teamCode">{team.code}</div>

												</th>
											<td className="w">{team.seriesWins}</td>
											<td className="l">{team.seriesLosses}</td>
											<td className="pct">{team.gameWins + team.gameLosses > 0 ?
												<>
													{displayDecimal(team.gameWins / (team.gameWins + team.gameLosses), 3)
														.substring(team.gameLosses === 0 ? 0 : 1)}
												</>
											:
												<>&mdash;</>
											}</td>
											<td className="pts">{team.points}</td>


										</tr>

									)


								}
							</tbody>

						</table>

					</div>

				)}

			</div>

		</div>
	)

}

export default Standings;
