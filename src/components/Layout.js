import React from 'react';
import { Box } from '@material-ui/core';
import Grid from './Grid';
import Base from './Base';
const Layout = ({ width, height, columnCount, rowCount, widthZoom, heightZoom, columnWidth, rowHeight, cellRenderer }) => {
    return (
        <>
            <Base>
                <Box display="flex" alignContent="center" justifyContent="center" alignItems="center" style={{ height: height, width: width - 50 }}>
                    <Box style={{ height: height }}>
                        <Grid
                            cellRenderer={cellRenderer}
                            columnCount={columnCount}
                            rowCount={rowCount}
                            width={widthZoom}
                            height={heightZoom}
                            columnWidth={columnWidth}
                            rowHeight={rowHeight}
                        />
                    </Box>
                </Box>
            </Base>
        </>
    )
}
export default Layout;