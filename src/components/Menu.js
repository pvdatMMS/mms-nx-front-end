
import React from "react";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import SpeedDial from "@material-ui/lab/SpeedDial";

export default function Menu({classes, icon, actions, open, onOpen, onClose, onClickMenuItem}) {
    return (
        <SpeedDial
                ariaLabel="Option"
                className={classes.speedDial}
                icon={icon}
                onClose={onClose}
                onOpen={onOpen}
                open={open}
                direction='right'
            >
                {actions.map(action => (
                    <SpeedDialAction
                        className={action.isHighlight ? classes.speedDialHighlightIcon : classes.speedDialIcon}
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        tooltipPlacement='bottom'
                        onClick={() => onClickMenuItem(action.name)}
                    />
                )
                )}
            </SpeedDial>
    )
}