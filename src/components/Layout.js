import React from 'react';
import { Box } from '@material-ui/core';
import Grid from './Grid';
import Header from './Header';
import Footer from './Footer';
const Layout = ({ width, height, columnCount, rowCount, widthZoom, heightZoom, columnWidth, rowHeight, cellRenderer }) => {
    return (
        <>
            <Header />
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
            <Footer />
        </>
    )
}
export default Layout;