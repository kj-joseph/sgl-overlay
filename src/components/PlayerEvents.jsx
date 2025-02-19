import React, { Fragment } from "react";
import { ReactSVG } from "react-svg";

const PlayerEvents = (props) => {

    return (
        <div className="events">
            {props.events.sort((a, b) => a > b ? -1 : a < b ? 1 : 0)
                .filter((e, i) => i < props.limit)
                .map((event, eventIndex) => (

                    <Fragment key={eventIndex}>
                        {
                            event.name === "Assist" ? (
								<ReactSVG className="eventIcon" src="/images/eventIcons/assist.svg" />
                            )
                            : event.name === "Dead" ? (
								<ReactSVG className="eventIcon" src="/images/eventIcons/dead.svg" />
                            )
                            : event.name === "Demolish" ? (
								<ReactSVG className="eventIcon" src="/images/eventIcons/demo.svg" />
                            )
                            : event.name === "Goal" ? (
								<ReactSVG className="eventIcon" src="/images/eventIcons/goal.svg" />
                            )
                            : event.name === "Save" || event.name === "EpicSave" ? (
								<ReactSVG className="eventIcon" src="/images/eventIcons/save.svg" />
                            )
                            : event.name === "Shot" ? (
								<ReactSVG className="eventIcon" src="/images/eventIcons/shot.svg" />
                            )
						: null}

                    </Fragment>

				))}
        </div>
    )

}

export default PlayerEvents;
