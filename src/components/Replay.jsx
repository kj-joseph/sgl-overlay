import React from "react";

import displayDecimal from "@/utils/displayDecimal";

const Replay = (props) => {

    const kmToMph = 1.6;
    const longPlayerName = 24;
    const speedDecimalPlaces = 0;

    const goalSpeed = {
        kph: props.lastGoal.goalspeed,
        mph: props.lastGoal.goalspeed / kmToMph,
    }

    const team =
        props.hasOwnProperty("lastGoal") && props.lastGoal.hasOwnProperty("scorer")
            ? props.lastGoal.scorer.teamnum : null;

    return (
        <div className={`replay team${team} ${props.show ? "showReplay" : ""}`}>

			<div className="replayLabel replayLabelLeft">REPLAY</div>

			{team != null ?

				<div className="statLine">
					<div className="stat">
						<span className="label">Goal</span>
						<span className={`value ${props.lastGoal.scorer.name >= longPlayerName ? "long" : ""}`}>{props.lastGoal.scorer.name}</span>
					</div>
					{props.lastGoal.assister.name ? (
						<div className="stat">
							<span className="label">Assist</span>
							<span className="value">{props.lastGoal.assister.name}</span>
						</div>
					) : null}
					<div className="stat speed">
						<span className="value">{displayDecimal(goalSpeed.mph, speedDecimalPlaces)}</span>
						<span className="label">MPH</span>
						<span className="value">{displayDecimal(goalSpeed.kph, speedDecimalPlaces)}</span>
						<span className="label">KM/H</span>
					</div>
				</div>

			: null}

			<div className="replayLabel replayLabelRight">REPLAY</div>

        </div>
    )

}

export default Replay;
