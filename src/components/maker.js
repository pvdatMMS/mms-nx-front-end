import maker from "../assets/maker.png";
import React, {useState} from "react";
import Tooltip from "@material-ui/core/Tooltip";
import dummyData from "../pages/home/data";

const Maker = (props) => {
    const {name, left, top, onDoubleClickCamera,} = props;
    return (
        <Tooltip title={name}>
            <img
                style={{
                    position: "absolute",
                    left: left - 9.26,
                    top: top - 30,
                    height: 30
                }}
                onDoubleClick={() => onDoubleClickCamera(props)}
                src={maker}
                alt="maker"
            />
        </Tooltip>
    )

};
export default Maker
