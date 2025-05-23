import React, { Fragment } from "react";

import MatchdaySchedule from "@/views/pregame/MatchdaySchedule";

const GeneratedMatchdaySchedule = (props) => {

	return (
		<div id={props.imageData.id} className="generatedMatchdaySchedule">

			<MatchdaySchedule
				config={props.genData.config}
				schedule={props.genData.schedule}
				teamList={props.genData.teamList}
				tierList={props.genData.tierList}
				viewOptions={props.genData.viewOptions}
			/>

		</div>

	)

}

export default GeneratedMatchdaySchedule;
