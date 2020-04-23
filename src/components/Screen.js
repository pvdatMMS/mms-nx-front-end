import React from "react";

const Screen = ({ width, height, url }) => {
    return (
        <video width={width} height={height} autoPlay="autoplay" controls="controls" muted="muted">
            <source src={url} type="video/mp4" />
        </video>
    )
}
export default Screen;