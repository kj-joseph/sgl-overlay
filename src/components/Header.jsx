import React, {Fragment} from "react";

const Header = (props) => {

	return (
		<>

			{props.headers.map((header, index) =>

				header === "%%SGLHEADER%%" ?

					<Fragment key={index}>
						<div className={`header header${index} pipes`}>
							Supporters Gaming League
						</div>

						<div className={`header header${index + 1} pipes`}>
							{/* TODO: Include league/division name if multiple divs? */}
							<span className="season">Season {props.season}</span>
							<span className="matchday">Matchday {props.matchday}</span>
						</div>
					</Fragment>

				:

					<div className={`header header${index} pipes`} key={index}>

						{header.split("|").map((headerPart, hpindex) =>
							<span key={hpindex}>{headerPart}</span>
						)}

					</div>

			)}

		</>
    )

}

export default Header;
