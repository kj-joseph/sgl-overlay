import React from "react";

const HexGrow = (props) => {

	return (
		<>
			<div className="bg"></div>
			{props.transition.logo ?
				<>
					<div className="logo">
						<img src={props.transition.logo}></img>
					</div>
				</>
			: null}

		</>
	)

}

export default HexGrow;
