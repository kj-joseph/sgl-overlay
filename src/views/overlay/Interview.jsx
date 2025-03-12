import React, { Fragment } from "react";

import Header from "@/components/Header";
import TeamLogo from "@/components/TeamLogo";

import hexToRgba from "@/utils/hexToRgba";
import imageLocation from "@/utils/imageLocation";

const longTeamName = 16;
const longFranchiseName = 25;

const Interview = ({ config, name, team}) => {

	const teamName = (teamnum) => team.name ? team.name : gameData.teams[teamnum].name;

	return (
		<div className="interview">

			<div className="interviewHeader">

				<div className="leagueLogo">
					{config.general.brandLogo ?
						<img src={imageLocation(config.general.brandLogo, "images/logos")} />
					: null}
				</div>

				<Header
					theme={config.general.theme}
					headers={config.general.headers}
					streamType={config.general.streamType}
					season={config.general.season}
					matchday={config.general.matchday}
					round={config.general.round}
					tier={config.general.tier}
					view="interview"
				/>

			</div>

			<div className="team">

				<div className="teamLogo">
					<TeamLogo
						team={0}
						logo={team.hasOwnProperty("logo") && team.logo ? team.logo : null}
						bgColor={team.bgColor}
					/>
				</div>

				{team.code !== "SGL" ?

					<div className="teamText">
						<div className={`name ${team.name.length >= longTeamName ? "long" : ""}`}>{team.name}</div>

						{team.soccerTeamName ?
							<div className={`franchise ${team.soccerTeamName.length >= longFranchiseName ? "long" : ""}`}>{team.soccerTeamName}</div>
						: null}
					</div>

				: null }


			</div>

			<div className="interviewing">
				<div className="title">Interviewing:</div>
				<div className="name">{name}</div>
			</div>

		</div>




	)

}

export default Interview;
