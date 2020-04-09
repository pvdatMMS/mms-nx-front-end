import React from 'react';
import { Box } from '@material-ui/core';
import Thumbnail from './Thumbnail';
const Bookmark = ({ data, selected, width, height, onClickThumbnail }) => {
    const { name, thumbnail_url } = data
    return (
            <Box style={selected ? {height: height, width: width, marginTop: 1, backgroundColor: 'LightGray'} : {height: height, width: width, marginTop: 1} } display="flex" alignContent="center" justifyContent="center" alignItems="center">
                <Thumbnail height={height} url={thumbnail_url} onClick={onClickThumbnail} />
                <Box style={{width: width - height}}>{name}</Box>
            </Box>
    )
}
export default Bookmark;