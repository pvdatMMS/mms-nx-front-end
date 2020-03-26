import React, { useState, useLayoutEffect, useEffect } from "react";
import Grid from '../../components/Grid';
import {EditLocation } from '@material-ui/icons';
import Tooltip from "@material-ui/core/Tooltip";
import makerWarning from "../../assets/maker3.png";
import maker from "../../assets/maker.png";
import Menu from '../../components/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import Add from './Add';
import Drawer from "@material-ui/core/Drawer";
import { Box } from "@material-ui/core";
import axios from 'axios'
// import ReactPlayer from 'react-player';
import 'video.js/dist/video-js.css'
import VideoPlayer from '../../components/VideoPlayer';
import CircularProgress from '@material-ui/core/CircularProgress';
import socketIOClient from 'socket.io-client'
export default function Home({ classes, data, columnCount, rowCount }) {
    const [columnWidth, setColumnWidth] = useState(0);
    const [rowHeight, setRowHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [widthZoom, setWidthZoom] = useState(0);
    const [heightZoom, setHeightZoom] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [openDrawerClick, setOpenDrawerClick] = useState(false);
    const [openDrawerDoubleClick, setOpenDrawerDoubleClick] = useState(false);
    const [tab, setTab] = React.useState(1);
    const [makerSelected, setMakerSelected] = useState({})
    const [layoutSelected, setLayoutSelected] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isTimeout, setIsTimeout] = useState()
    const [bookmarkSelected, setBookmarkSelected] = useState(-1)
    const homeActions = [
        { icon: <EditLocation />, name: 'Edit Camera' },
    ];
    
    const [dataHome, setDataHome] = useState(data)
    useEffect(() => {
        const socket = socketIOClient('http://192.168.1.131:8080')
        socket.on("UpdateStatus", response => {
            setDataHome(response)
            // setMakerSelected({})
        })
    }, [])

    useLayoutEffect(() => {
        const updateSize = () => {
            if (window.innerWidth < window.outerWidth) {

                setWidth(window.innerWidth)
                setHeight(window.innerHeight)
                
                setColumnWidth((window.innerWidth  / columnCount + ((window.outerWidth - window.innerWidth) / window.devicePixelRatio) ))
                setRowHeight((window.innerHeight  / rowCount + ((window.outerHeight - window.innerHeight) / window.devicePixelRatio) ))
                
                setWidthZoom(window.innerWidth)
                setHeightZoom(window.innerHeight)

            } else if (window.innerWidth > window.outerWidth) {

                setWidth(window.innerWidth)
                setHeight(window.innerHeight)

                setColumnWidth((window.innerWidth - (window.innerWidth - window.outerWidth)) / columnCount)
                setRowHeight(window.innerHeight / rowCount)

                setWidthZoom(window.innerWidth - (window.innerWidth - window.outerWidth))
                setHeightZoom(window.innerHeight)

            } else {

                setWidth(window.innerWidth)
                setHeight(window.innerHeight)

                setColumnWidth(window.innerWidth / columnCount)
                setRowHeight(window.innerHeight / rowCount)
                
                setWidthZoom(window.innerWidth)
                setHeightZoom(window.innerHeight)

            }

        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    function cellRenderer({ columnIndex, key, rowIndex, style }) {
        return (
            <div key={key}
                style={{
                    ...style,
                    backgroundImage: `url(${dataHome[rowIndex][columnIndex] && dataHome[rowIndex][columnIndex].image ? data[rowIndex][columnIndex].image : ''})`,
                    backgroundRepeat: 'no-repeat',
                    float: 'left',
                    backgroundSize: '100% 100%'
                }}
                onDoubleClick={() => onDoubleClickLayout(dataHome[rowIndex][columnIndex])}
            >
                {
                    dataHome[rowIndex][columnIndex] && dataHome[rowIndex][columnIndex].cameras.map((obj, index) =>
                        <Tooltip title={obj.name}>
                            <img
                                style={{
                                    position: "absolute",
                                    left: obj.x * columnWidth - 9.26,
                                    top: obj.y * rowHeight - 30,
                                    height: 30
                                }}
                                onClick={() => onClickMaker(obj)}
                                src={obj.statusId === 1 ? maker : makerWarning}
                                alt="maker"
                            />
                        </Tooltip>
                    )
                }
            </div>
        );
    }

    const onOpen = () => {
        setOpen(true)
    }
    const onClose = () => {
        setOpen(false)
    }

    const onClickMaker = (obj) => {
        setMakerSelected(obj)
        if(isTimeout) {
            clearTimeout(isTimeout)
        }
        if(obj.statusId === 3) {
            setBookmarkSelected(0)
            axios.post(`http://192.168.1.131:8080/device/${obj.id}/changeStatus`, {statusId: 1})
            setIsLoading(true)
            const bookmark_start_date = new Date(obj.start_time)
            const timeFromNow = Date.now().valueOf() - bookmark_start_date.valueOf()
            if(timeFromNow >= 45000) {
                setInterval(() => setIsLoading(false), 700)
            } else {
                setIsTimeout(setTimeout(function(){ setIsLoading(false); }, 45000 - timeFromNow))
            }
        } else {
            setBookmarkSelected(-1)
        }
        setOpenDrawerClick(true)
    }

    const onDoubleClickLayout = (arrayData) => {
        if(arrayData && arrayData.cameras && arrayData.cameras.length) {
            arrayData.cameras.map(obj => obj.url = `http://210.245.35.97:7001/media/${obj.cameraId}.mp4`)
            setLayoutSelected(arrayData.cameras)
            setOpenDrawerDoubleClick(true)
        }
        
    }
    console.log(layoutSelected)
    const onClickMenuItem = (name) => {
        if (name === 'Edit Camera') {
            setTab(2)
        }
    }
    const onBackToHome = () => {
        axios.get('http://192.168.1.131:8080/layouts').then(res => {
            const { data } = res.data
            setDataHome(data)
            setTab(1)
            setOpen(false)
        })
    }
    const onClickThumnail = (obj, index) => {
        setBookmarkSelected(index)
        if(isTimeout) {
            clearTimeout(isTimeout)
        }
        setIsLoading(true)
        setMakerSelected({
            ...makerSelected,
            url: `http://210.245.35.97:7001/media/${obj.cameraId}.mp4?pos=${obj.startTimeMs}&endPos=${Number(obj.startTimeMs) + Number(obj.durationMs)}`
        })
        const bookmark_start_date = new Date(obj.startTimeMs)
        const timeFromNow = Date.now().valueOf() - bookmark_start_date.valueOf()
        if (timeFromNow >= 45000) {
            setInterval(() => setIsLoading(false), 700)
        } else {
            setIsTimeout(setTimeout(function () { setIsLoading(false); }, 45000 - timeFromNow))
        }
    }
    const onClickLive = () => {
        setBookmarkSelected(-1)
        if(isTimeout) {
            clearTimeout(isTimeout)
        }
        setIsLoading(true)
        setMakerSelected({
            ...makerSelected,
            url: `http://210.245.35.97:7001/media/${makerSelected.cameraId}.mp4`
        })
        setInterval(() => setIsLoading(false), 700)
    }
    
    const renderComponent = () => {

        switch (tab) {
            case 2:
                return (
                    <Add classes={classes} data={dataHome} columnCount={columnCount} rowCount={rowCount} onBackToHome={onBackToHome} />
                )
            default:
                return (
                    <>
                    <Box style={{ height: 50, backgroundColor: 'red'}}></Box>
                    <Box display="flex" alignContent="center" justifyContent="center" alignItems="center" style={{ height: height, width: width - 50}}>
                        <Box style={{ height: height}}>
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
                        <Menu classes={classes} actions={homeActions} open={open} onOpen={onOpen} onClose={onClose} onClickMenuItem={onClickMenuItem} icon={<MenuIcon />} />
                    </Box>
                    <Box style={{ height: 50, backgroundColor: 'red'}}></Box>
                    </>
                )
        }
    }

    return (
        <div>
            {renderComponent()}
            <Drawer
                anchor="right"
                open={openDrawerClick}
                onClose={() => setOpenDrawerClick(false)}
            >
                <Box
                    style={{height: height, width: window.screen.availWidth / 3}}
                    // className={classes.drawer}
                    role="presentation"
                    display="flex" alignContent="center" justifyContent="center" alignItems="center"
                    flexDirection="column"
                >
                    <Box style={{width: window.screen.availWidth / 3.5}}>
                        {
                            isLoading ? (<Box style={{ height: height / 3}} display="flex" alignContent="center" justifyContent="center" alignItems="center">
                                <CircularProgress />
                            </Box>) : (<VideoPlayer {...{
                                autoplay: true,
                                controls: true,
                                height: height / 3,
                                width: window.screen.availWidth / 3.5,
                                sources: [{
                                    src: makerSelected.url,
                                    type: 'video/mp4'
                                }]
                            }} />)
                        }
                        <div style={{ height: height * 2 / 3, width: window.screen.availWidth / 3.5, overflowY: 'auto'}}>
                                        <Box style={bookmarkSelected === -1 ? {height: 100, width: window.screen.availWidth / 3.5, marginTop: 1, backgroundColor: 'LightGray'} : {height: 100, width: window.screen.availWidth / 3.5, marginTop: 1}} display="flex" alignContent="center" justifyContent="center" alignItems="center">
                                <img onClick={onClickLive}
                                    style={{
                                        height: 100
                                    }}
                                    // onClick={() => onClickMaker(obj)}
                                    src="http://210.245.35.97:7001/ec2/cameraThumbnail?cameraId=8c80a79e-7285-a051-b785-2ef7661db57a&height=100"
                                    alt="maker"
                                />
                                <div style={{width: window.screen.availWidth / 3.5 - 100}}>LIVE</div>
                                        </Box>
                                {
                                    makerSelected && makerSelected.bookmarks && makerSelected.bookmarks.map((obj, index) => 
                                        index < 100 ? <Box style={index === bookmarkSelected ? {height: 100, width: window.screen.availWidth / 3.5, marginTop: 1, backgroundColor: 'LightGray'} : {height: 100, width: window.screen.availWidth / 3.5, marginTop: 1}} display="flex" alignContent="center" justifyContent="center" alignItems="center">
                                            <img  onClick={() => onClickThumnail(obj, index)}
                                    style={{
                                        height: 100
                                    }}
                                    // onClick={() => onClickMaker(obj)}
                                    src={`http://210.245.35.97:7001/ec2/cameraThumbnail?cameraId=${obj.cameraId}&time=${obj.startTimeMs}&height=100`}
                                    alt="maker"
                                />
                                <div style={{width: window.screen.availWidth / 3.5 - 100}}>{`${obj.description} ${new Date(Number(obj.startTimeMs))}`}</div>
                                        </Box> : '')
                                }
                        </div>                   
                    </Box>
                </Box>
            </Drawer>
            <Drawer
                anchor="right"
                open={openDrawerDoubleClick}
                onClose={() => setOpenDrawerDoubleClick(false)}
            >
                <div
                    // className={classes.drawer}
                    style={{width: width / 3}}
                    role="presentation"
                >
                    <Box
                    style={{height: height, width: window.screen.availWidth / 3}}
                    // className={classes.drawer}
                    role="presentation"
                    display="flex" alignContent="center" justifyContent="center" alignItems="center"
                    flexDirection="column"
                >
                <div style={{width: window.screen.availWidth / 3.5, overflowY: 'auto'}}>
                    {
                        layoutSelected.map(obj => <Box style={{height: height / 3, width: window.screen.availWidth / 3.5 - 20, marginBottom: 30, marginTop: 40}} display="flex" alignContent="center" justifyContent="center" alignItems="center" flexDirection="column">
                            <Box style={{height: 20, width: (window.screen.availWidth / 3.5) * 2 / 3}} display="flex" alignContent="center" justifyContent="center" alignItems="center"> {obj.name} <Box style={{height: 20, width: (window.screen.availWidth / 3.5) / 3}}><EditLocation /></Box></Box>
                            <VideoPlayer {...{
                            autoplay: true,
                            controls: true,
                            height: height / 3,
                            width: window.screen.availWidth / 3.5 - 20,
                            sources: [{
                                src: obj.url,
                                type: 'video/mp4'
                            }]
                        }} /></Box>)
                    }
                    </div>
                    </Box>
                </div>
            </Drawer>
        </div>
    )

}