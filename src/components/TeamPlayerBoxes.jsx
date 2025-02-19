import React from "react";

import PlayerBox from "@/components/PlayerBox";

const TeamPlayerBoxes = (props) => {

    return (
        <div className={`teamPlayerBoxes team${props.team}`}>
            {Object.values(props.players).map((player, playerIndex) => (
                <PlayerBox
					key={playerIndex}
					player={player}
                    teamIndex={props.team}
                    playerIndex={playerIndex}
					showStats={props.showStats}
                    playerEvents={props.playerEvents.filter(p => p.playerId === player.id)}
                    watching={props.watching === player.id}
					gameMode={props.gameMode}
				/>
            ))}

        </div>
    )

}

export default TeamPlayerBoxes;
