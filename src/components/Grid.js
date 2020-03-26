import React from "react";
import { Grid } from 'react-virtualized';

export default function Index({columnCount, rowCount, columnWidth, width, rowHeight, height, cellRenderer}) {
    return (
        <Grid
                cellRenderer={cellRenderer}
                columnCount={columnCount}
                columnWidth={columnWidth}
                height={height}
                rowCount={rowCount}
                rowHeight={rowHeight}
                width={width}
            />
    )
}