import React, { useState, useLayoutEffect, useEffect } from "react";
import { EditLocation, Person } from '@material-ui/icons';
import { Box } from "@material-ui/core";
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import CircularProgress from '../../components/CircularProgress';
import GridCell from "../../components/GridCell";
import Maker from '../../components/Maker';
import Drawer from '../../components/Drawer';
import Screen from '../../components/Screen';
import Bookmark from '../../components/Bookmark';
import Layout from "../../components/Layout";
import Menu from '../../components/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import Maker10Icon from "../../assets/maker10.png";
import Maker9Icon from "../../assets/maker9.png";
import Maker8Icon from "../../assets/maker8.png";
import Maker7Icon from "../../assets/maker7.png";
import Maker6Icon from "../../assets/maker6.png";
import Maker5Icon from "../../assets/maker5.png";
import Maker4Icon from "../../assets/maker4.png";
import Maker3Icon from "../../assets/maker3.png";
import Maker2Icon from "../../assets/maker2.png";
import Maker1Icon from "../../assets/maker1.png";
import MakerIcon from "../../assets/maker.png";
import AddNew from './AddNew';
import PersonPage from '../person/index';

export default function HomeNew({ classes, data, trackPaths, setTrackPaths, columnCount, rowCount }) {

    const [tab, setTab] = React.useState(1);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openMenu, setOpenMenu] = React.useState(false);
    const [eventClick, setEventClick] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const [columnWidth, setColumnWidth] = useState(0);
    const [rowHeight, setRowHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [widthZoom, setWidthZoom] = useState(0);
    const [heightZoom, setHeightZoom] = useState(0);
    const [offsetLeft, setOffsetLeft] = useState();

    const [homeData, setHomeData] = useState(data);
    const [makerSelected, setMakerSelected] = useState({});
    const [layoutSelected, setLayoutSelected] = useState([]);
    const [bookmarkSelected, setBookmarkSelected] = useState(0);

    const [isTimeout, setIsTimeout] = useState();

    const homeActions = [
        { icon: <EditLocation />, name: 'Edit Camera' },
        { icon: <Person />, name: 'Blacklist' },
    ];

    useEffect(() => {
        const socket = socketIOClient(`${process.env.REACT_APP_NX_API}`)
        socket.on("UpdateCameraStatus", response => {
            updateCameraStatus(response)
        })
        socket.on("UpdateTrackPath", response => {
            setTrackPaths(response)
        })
    }, []);
    
    useLayoutEffect(() => {
        const updateSize = () => {
            if (window.innerWidth < window.outerWidth) {
                setWidth(window.innerWidth)
                setHeight(window.innerHeight)

                setColumnWidth((window.innerWidth / columnCount + ((window.outerWidth - window.innerWidth) / window.devicePixelRatio)))
                setRowHeight((window.innerHeight / rowCount + ((window.outerHeight - window.innerHeight) / window.devicePixelRatio)))

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

    const updateCameraStatus = (response) => {
        const { id, layout_id } = response
        const data = homeData.map(array => {
            return array.map(obj => {
                if (obj.id === layout_id) {
                    const cameras = obj.cameras.map(camera => {
                        if (camera.id === id)
                            return response
                        return camera
                    })
                    obj.cameras = cameras
                }
                return obj
            })
        })
        setHomeData(data)
    }
    
    const onCloseDrawer = () => setOpenDrawer(false)

    const onClickMaker = (obj) => {
        const { id } = obj
        setIsLoadingData(true)
        axios.get(`${process.env.REACT_APP_NX_API}/device/${id}/bookmarks`).then(res => {
            const { data } = res.data
            const { status_id, bookmarks } = data
            if (isTimeout)
                clearTimeout(isTimeout)
            if (status_id === 3) {
                setBookmarkSelected(1)
                setIsLoading(true)
                const bookmark = bookmarks[1]
                const bookmark_start_date = new Date(Number(bookmark.startTimeMs))
                const timeFromNow = Date.now().valueOf() - bookmark_start_date.valueOf()
                if (timeFromNow >= 45000) setIsTimeout(setTimeout(() => setIsLoading(false), 700))
                else setIsTimeout(setTimeout(() => setIsLoading(false), 45000 - timeFromNow))
            } else setBookmarkSelected(0)
            setEventClick(1)
            setMakerSelected(data)
            setIsLoadingData(false)
        })
        setOpenDrawer(true)
    }

    const onDoubleClickLayout = (obj) => {
        const { id } = obj
        setIsLoadingData(true)
        axios.get(`${process.env.REACT_APP_NX_API}/layout/${id}/devices`).then(res => {
            const { data } = res.data
            setEventClick(2)
            setLayoutSelected(data)
            setTimeout(() => setIsLoadingData(false), 1000)
        })
        setOpenDrawer(true)
    }

    const onClickThumbnail = (index, obj) => {
        setBookmarkSelected(index)
        if (isTimeout)
            clearTimeout(isTimeout)
        setIsLoading(true)
        setMakerSelected({
            ...makerSelected,
            url: obj.url
        })
        if (index !== 0) {
            const bookmark_start_date = new Date(Number(obj.startTimeMs))
            const timeFromNow = Date.now().valueOf() - bookmark_start_date.valueOf()
            if (timeFromNow >= 45000) setIsTimeout(setTimeout(() => setIsLoading(false), 1000))
            else setIsTimeout(setTimeout(() => setIsLoading(false), 45000 - timeFromNow))
        } else setIsTimeout(setTimeout(() => setIsLoading(false), 1000))
    }

    const onBackToHome = () => {
        setTab(1)
        setOpenMenu(false)
    }

    const onClickMenuItem = (name) => {
        if (name === 'Edit Camera') setTab(2)
        else if (name === "Blacklist") setTab(3)
    }

    const onOpenMenu = () => setOpenMenu(true)

    const onCloseMenu = () => setOpenMenu(false)

    const cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
        const cellData = homeData[rowIndex][columnIndex]
        const image = cellData && cellData.image ? cellData.image : ''
        return (
            <GridCell cellKey={key} style={style} image={image} cellData={cellData} onDoubleClickLayout={cellData ? () => onDoubleClickLayout(cellData) : () => { }} />
        )
    }
     console.log(homeData)
     console.log(trackPaths)
    const colorMaker = (color) => {
        switch (color) {
            case 1:
                return Maker1Icon
            case 2:
                return Maker2Icon
            case 3:
                return Maker3Icon
            case 4:
                return Maker4Icon
            case 5:
                return Maker5Icon
            case 6:
                return Maker6Icon
            case 7:
                return Maker7Icon
            case 8:
                return Maker8Icon
            case 9:
                return Maker9Icon
            case 10:
                return Maker10Icon
            default:
                return MakerIcon
        }
    }

    const renderCanvas = () => {
        return (
            <>
            <canvas
                style={{ position: "absolute" }}
                id="DrawLine"
                width={widthZoom}
                height={heightZoom}
                ref={e => e && e.offsetLeft && setOffsetLeft(e.offsetLeft)}
            />
            {
                    homeData.map((arr, arrIndex) =>
                        arr.map((obj, objIndex) => 
                            obj.cameras.map(camera => {
                                if (offsetLeft) {
                                    const w = columnWidth * objIndex + columnWidth + offsetLeft
                                    const h = rowHeight * arrIndex + 50 + rowHeight

                                    const { axisX, axisY } = camera
                                    let temp = { ...camera }
                                    if (columnWidth && rowHeight) {
                                        temp.axisX = (axisX * columnWidth + columnWidth * objIndex + offsetLeft) / w
                                        temp.axisY = (axisY * rowHeight + rowHeight * arrIndex + 50) / h
                                    }
                                    return <Maker makerData={temp} makerIcon={temp.status_id === 1 ? colorMaker(temp.color) : colorMaker(temp.color)} columnWidth={w} rowHeight={h} onClickMaker={() => onClickMaker(temp)} />
                                }
                            })
                        ))
                }
            </>
        )
    }
    const renderDrawerOneClickComponent = () => {
        return (
            <>
                {isLoading ? <CircularProgress height={height / 3} /> : <Screen width={window.screen.availWidth / 3.5} height={height / 3} url={makerSelected.url} />}
                <Box style={{ height: height * 2 / 3, width: window.screen.availWidth / 3.5, overflowY: 'auto' }}>
                    {
                        makerSelected && makerSelected.bookmarks && makerSelected.bookmarks.map((obj, index) =>
                            index < 100 ? (<Bookmark data={obj} selected={bookmarkSelected === index ? true : false} height={100} width={window.screen.availWidth / 3.7} onClickThumbnail={() => onClickThumbnail(index, obj)} />) : <></>
                        )
                    }
                </Box>
            </>
        )
    }

    const renderDrawerDoubleClickComponent = () => {
        return (
            <Box style={{ height: height, width: window.screen.availWidth / 3.5, overflowY: 'auto' }}>
                {
                    layoutSelected.map(obj =>
                        <Box style={{ height: height / 3, width: window.screen.availWidth / 3.7, marginBottom: 30, marginTop: 40 }} display="flex" alignContent="center" justifyContent="center" alignItems="center" flexDirection="column">
                            <Screen width={window.screen.availWidth / 3.7} height={height / 3} url={obj.url} />
                        </Box>)
                }
            </Box>
        )
    }

    const renderComponent = () => {
        switch (tab) {
            case 2:
                return (
                    <AddNew classes={classes} data={homeData} columnCount={columnCount} rowCount={rowCount} onBackToHome={onBackToHome} />
                )
            case 3:
                return (
                    <PersonPage classes={classes} onBackToHome={onBackToHome}></PersonPage>
                )
            default:
                return (
                    <>
                        <Layout width={width} height={height} data={homeData} trackPaths={trackPaths} columnCount={columnCount} columnWidth={columnWidth} rowCount={rowCount} rowHeight={rowHeight} widthZoom={widthZoom} heightZoom={heightZoom} cellRenderer={cellRenderer} renderCanvas={renderCanvas} />
                        <Menu classes={classes} actions={homeActions} open={openMenu} onOpen={onOpenMenu} onClose={onCloseMenu} onClickMenuItem={onClickMenuItem} icon={<MenuIcon />} />
                        <Drawer height={height} openDrawer={openDrawer} onCloseDrawer={onCloseDrawer} positionDrawer="right" renderDrawerComponent={renderDrawerComponent} />
                    </>
                )
        }
    }

    const renderScreenComponent = () => {
        switch (eventClick) {
            case 1:
                return (renderDrawerOneClickComponent())
            case 2:
                return (renderDrawerDoubleClickComponent())
            default:
                return (<></>)
        }
    }

    const renderDrawerComponent = () => {
        return (
            <Box style={{ width: window.screen.availWidth / 3.5 }}>
                {isLoadingData ? <CircularProgress height={height / 3} /> : renderScreenComponent()}
            </Box>
        )
    }

    return (
        <>
            {renderComponent()}
        </>
    )
}