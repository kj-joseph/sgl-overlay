import React, {Fragment} from "react";

const Header = (props) => {

	return (
		<>

			{props.theme === "sgl" ?
				<>
					<div className={`header header0 pipes`}>
						<span className="leagueName">Supporters Gaming League</span>
						{props.streamType !== "SGL-event" && props.view !== "standings" ?
							<span className="season">Season {props.season}
								{props.streamType === "SGL-playoffs" ? " Cup" : null}
							</span>
						: null}
					</div>

					{props.streamType !== "SGL-event" ?

						<div className={`header header1 pipes`}>
							{props.view === "standings" ?
								<span className="standings">Season {props.season} Standings</span>
							: props.view === "schedule" ?
								<>
									<span className="label">Game Schedule</span>
									<span className="matchday">Matchday {props.matchday}</span>
								</>
							: (props.streamType === "SGL-regular" || props.streamType === "SGL-playoffs") && props.tier ?
								<span className="tier">{props.tier}</span>
							: null}
							{props.view ?
								null
							: props.streamType === "SGL-regular" ?
								<span className="matchday">Matchday {props.matchday}</span>
							: props.streamType === "SGL-playoffs" ?
								<span className="matchday">{props.round}</span>
							: null}
						</div>

					: null}


				</>

			: null}

			{props.streamType === "SGL-event" || props.streamType === "other" ?

				props.headers.map((header, index) =>

					<div className={`header header${index + (props.theme === "sgl" ? 1 : 0)} pipes`} key={index}>

						{header.split("|").map((headerPart, hpindex) =>
							<span key={hpindex}>{headerPart}</span>
						)}

					</div>

				)

			: null}

		</>
    )

}

export default Header;
