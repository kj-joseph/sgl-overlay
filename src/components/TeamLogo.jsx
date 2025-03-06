import React from "react";

import imageLocation from "@/utils/imageLocation";

const TeamLogo = (props) => {

    return (
        <div
			className={`teamLogo team${props.team}`}
		>
			{props.logo ?
				<img
					src={imageLocation(props.logo, "images/logos/teams")}
					style={props.bgColor ?
						{
							backgroundColor: `#${props.bgColor}`,
						} : {}
					}
				/>
			: null}
        </div>
    )

}

export default TeamLogo;
