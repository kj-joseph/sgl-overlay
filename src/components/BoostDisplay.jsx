import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const BoostDisplay = (props) => {

    return (

        <div className="boostDisplay">

			{props.theme === "sgl" ?
				<>
					<div className="boostText">{props.boost}</div>

					<CircularProgressbar
						value={props.boost}
						className="boost"
						circleRatio={2/3}
						strokeWidth={50}

						styles={buildStyles({
							rotation: 2/3,
							strokeLinecap: "butt",
							pathTransitionDuration: .2,
						})}
					/>
				</>

			:

				<CircularProgressbar
					value={props.boost}
					text={props.boost.toString()}
					className="boost"
					circleRatio={.75}
					strokeWidth={12}

					styles={buildStyles({
						rotation: 0.625,
						strokeLinecap: "round",
						pathTransitionDuration: .2,
					})}
				/>

			}
        </div>
    )

}

export default BoostDisplay;
