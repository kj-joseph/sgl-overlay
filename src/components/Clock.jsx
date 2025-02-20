import React from "react";

const Clock = (props) => {

    const minutes = Math.floor(props.time / 60);
    const seconds = props.time - minutes * 60;
    const semiLongTimeMinutes = 10;
    const longTimeMinutes = 100;

    return (
        <div className={`clock ${props.overtime ? "overtime" : ""} ${props.goalTeam != null ? `goal${props.goalTeam}` : ""}`}>
            <div className={`time ${minutes >= longTimeMinutes ? "long" : minutes >= semiLongTimeMinutes ? "semilong" : ""}`}>
                {props.overtime? (
                    <span className="plus">+</span>
                ) : null}
                {minutes}<span className="colon">:</span>{seconds < 10 ? "0" : ""}{seconds}</div>
            {props.overtime ? (
                <div className="overtimeText">OVERTIME</div>
            ) : null}
        </div>
    )

}

export default Clock;
