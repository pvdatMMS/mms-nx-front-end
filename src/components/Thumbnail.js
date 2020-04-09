import React from 'react';

const Thumbnail = ({ height, url, onClick }) => {
    return (
        <img onClick={onClick}
            style={{
                height: height
            }}
            src={url}
            alt="maker"
        />
    )
}
export default Thumbnail;