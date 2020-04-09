import React from "react";
import Tooltip from "@material-ui/core/Tooltip";

const Maker = ({ columnWidth, rowHeight, makerIcon, makerData, onClickMaker, onDoubleClickMaker }) => {
    const { name, axisX, axisY } = makerData;
    return (
        <Tooltip title={name}>
            <img
                style={{
                    position: "absolute",
                    left: axisX * columnWidth - 9.26,
                    top: axisY * rowHeight - 30,
                    height: 30
                }}
                onDoubleClick={onDoubleClickMaker ? onDoubleClickMaker : () => {}}
                onClick={onClickMaker ? onClickMaker : () => {}}
                src={makerIcon}
                alt="maker"
            />
        </Tooltip>
    )
};

export default Maker;
