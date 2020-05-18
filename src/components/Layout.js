import React from 'react';
import { Box } from '@material-ui/core';
import Grid from './Grid';
import Base from './Base';
const Layout = ({ width, height, data, trackPaths, offsetLeft, columnCount, rowCount, widthZoom, heightZoom, columnWidth, rowHeight, cellRenderer, renderCanvas }) => {
    React.useEffect(() => {
        let canvas = document.getElementById('DrawLine');
        if (canvas && canvas.getContext) {
            data.map((arr, arrIndex) =>
                arr.map((obj, objIndex) =>
                    obj.cameras.map(camera => {
                        trackPaths.map(trackPath => {

                            const w = columnWidth * objIndex + columnWidth
                            const h = rowHeight * arrIndex + rowHeight

                            const { axisX, axisY } = camera
                            if (columnWidth && rowHeight) {
                                if (trackPath.from === camera.id) {
                                    trackPath.axisXFrom = (axisX * columnWidth + columnWidth * objIndex) / w
                                    trackPath.axisYFrom = (axisY * rowHeight + rowHeight * arrIndex) / h
                                    trackPath.wFrom = w
                                    trackPath.hFrom = h
                                }
                                if (trackPath.to === camera.id) {
                                    trackPath.axisXTo = (axisX * columnWidth + columnWidth * objIndex) / w
                                    trackPath.axisYTo = (axisY * rowHeight + rowHeight * arrIndex) / h
                                    trackPath.wTo = w
                                    trackPath.hTo = h
                                }
                            }

                        })
                    })
                ))

            let context = canvas.getContext('2d');
            context.clearRect(0,0, canvas.width, canvas.height)
            trackPaths.forEach((obj, index) => {
                let context = canvas.getContext('2d');
                context.beginPath();
                context.lineJoin = "round";
                context.moveTo(obj.axisXFrom * obj.wFrom, obj.axisYFrom * obj.hFrom);
                context.lineTo(obj.axisXTo * obj.wTo, obj.axisYTo * obj.hTo);
                context.lineWidth = 3;
                context.strokeStyle = colorLine(obj.color);
                context.stroke();
            });
        }
    })
    const colorLine = (color) => {
        switch (color) {
            case 1:
                return "#2946FF"
            case 2:
                return "#6AB115"
            case 3:
                return "#F4BB00"
            case 4:
                return "#4100A9"
            case 5:
                return "#8500B5"
            case 6:
                return "#A3174C"
            case 7:
                return "#F65300"
            case 8:
                return "#D1EA00"
            case 9:
                return "#FDFE00"
            case 10:
                return "#2C91D0"
        }
    }
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
                    {
                        renderCanvas ? renderCanvas() : <></>
                    }
                </Box>
            </Base>
        </>
    )
}
export default Layout;