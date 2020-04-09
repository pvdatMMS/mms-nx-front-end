import React, { useState, useLayoutEffect, useEffect } from "react";
import { EditLocation } from '@material-ui/icons';
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
import MakerWarningIcon from "../../assets/maker3.png";
import MakerIcon from "../../assets/maker.png";
import AddNew from './AddNew';

export default function HomeNew({ classes, data, columnCount, rowCount }) {

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

    const [homeData, setHomeData] = useState(data);
    const [makerSelected, setMakerSelected] = useState({});
    const [layoutSelected, setLayoutSelected] = useState([]);
    const [bookmarkSelected, setBookmarkSelected] = useState(0);

    const [isTimeout, setIsTimeout] = useState();

    const homeActions = [
        { icon: <EditLocation />, name: 'Edit Camera' },
    ];

    useEffect(() => {
        const socket = socketIOClient('http://172.20.10.6:8080')
        socket.on("UpdateCameraStatus", response => {
            updateCameraStatus(response)
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
        axios.get(`http://172.20.10.6:8080/device/${id}/bookmarks`).then(res => {
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
        axios.get(`http://172.20.10.6:8080/layout/${id}/devices`).then(res => {
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
    }

    const onOpenMenu = () => setOpenMenu(true)

    const onCloseMenu = () => setOpenMenu(false)

    const cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
        const cellData = homeData[rowIndex][columnIndex]
        const image = cellData && cellData.image ? cellData.image : ''
        return (
            <GridCell cellKey={key} style={style} image={image} cellData={cellData} renderMaker={() => renderMaker(cellData)} onDoubleClickLayout={() => onDoubleClickLayout(cellData)} />
        )
    }

    const renderMaker = (cellData) => {
        return (
            cellData && cellData.cameras && cellData.cameras.map(obj =>
                <Maker makerData={obj} makerIcon={obj.status_id === 1 ? MakerIcon : MakerWarningIcon} columnWidth={columnWidth} rowHeight={rowHeight} onClickMaker={() => onClickMaker(obj)} />
            )
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
            default:
                return (
                    <>
                        <Layout width={width} height={height} columnCount={columnCount} columnWidth={columnWidth} rowCount={rowCount} rowHeight={rowHeight} widthZoom={widthZoom} heightZoom={heightZoom} cellRenderer={cellRenderer} />
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