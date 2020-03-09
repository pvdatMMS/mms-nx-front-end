import maker from "../assets/maker.png";
import React, {useState} from "react";
import Tooltip from "@material-ui/core/Tooltip";
import img1 from "../assets/room1.jpg";
import img2 from "../assets/room2.jpg";
import img3 from "../assets/room3.jpg";
import base64 from "./base64";
import Maker from "./maker";

const Area = ({
                  indexFloor,
                  index,
                  area,
                  onClickDoubleCamera,
                  onPushCamera
              }, callBack) => {
    const image = area.image;
    return (
        <div
            style={{
                backgroundImage: `url(${image})`,
                margin: 5,
                height: 500,
                width: 500,
                backgroundRepeat: 'no-repeat',
                float: 'left',
                backgroundSize: '100% 100%'
            }}
        >
            {
                area.cameras.map(camera => {
                        onPushCamera({
                            id: camera.id,
                            name: camera.name,
                            x: camera.x + 5 + (index * 10) + (index * 500),
                            y: camera.y + 5 + (indexFloor * 10) + (indexFloor * 500),
                        });

                        // return (
                        //     <Maker
                        //         name={camera.name}
                        //         // top={camera.y + 5}
                        //         top={camera.y + 5 + (indexFloor * 10) + (indexFloor * 500)}
                        //         left={camera.x + 5 + (index * 10) + (index * 500)}
                        //         onDoubleClickCamera={(e) => onClickDoubleCamera(e)}
                        //     />
                        // )
                    }
                )
            }
        </div>

    )

};
export default Area
