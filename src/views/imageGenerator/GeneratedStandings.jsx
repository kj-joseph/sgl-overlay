import React, { Fragment } from "react";

import Standings from "@/views/pregame/Standings";

const GeneratedStandings = (props) => {

	return (
		<div id={props.imageData.id} className="generatedStandings">

			<div>PANTS</div>

			<Standings
				config={props.genData.config}
				schedule={props.genData.schedule}
				teamList={props.genData.teamList}
				tierList={props.genData.tierList}
				viewOptions={props.genData.viewOptions}
			/>

		</div>

	)

}

export default GeneratedStandings;
