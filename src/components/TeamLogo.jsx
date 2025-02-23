import React from "react";

import imageLocation from "@/utils/imageLocation";

const TeamLogo = (props) => {

    return (
        <div
			className={`teamLogo team${props.team}`}
			style={props.bgColor ?
				{
					backgroundColor: `#${props.bgColor}`,
				} : {}
			}
		>
            <img src={imageLocation(props.logo, "images/logos/teams")} />
        </div>
    )

}

export default TeamLogo;
