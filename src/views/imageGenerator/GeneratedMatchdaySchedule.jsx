import React, { Fragment } from "react";

import MatchdaySchedule from "../pregame/MatchdaySchedule";

const GeneratedMatchdaySchedule = (props) => {

	return (
		<div id={props.imageData.id} className="generatedMatchdaySchedule">

			<MatchdaySchedule
				config={props.config}
				schedule={props.schedule}
				teamList={props.teamList}
				tierList={props.tierList}
				viewOptions={props.viewOptions}
			/>

		</div>

	)

}

export default GeneratedMatchdaySchedule;
