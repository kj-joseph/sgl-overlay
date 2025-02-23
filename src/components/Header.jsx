import React, {Fragment} from "react";

const Header = (props) => {

	return (
		<>

			{props.theme === "sgl" ?
				<>
					<div className={`header header0`}>
						Supporters Gaming League{props.streamType === "SGL-playoffs" ? " Playoffs" : null}
					</div>

					{props.streamType !== "SGL-event" ?

						<div className={`header header1 pipes`}>
							{/* TODO: Include league/division name if multiple divs? */}
							<span className="season">Season {props.season}</span>
							{props.streamType === "SGL-regular" ?
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
