import React, { useState, useLayoutEffect, useEffect } from "react";
import { AddLocation, ArrowBack } from '@material-ui/icons';
import { Box } from "@material-ui/core";
import axios from 'axios';
import GridCell from "../../components/GridCell";
import Maker from '../../components/Maker';
import Drawer from '../../components/Drawer';
import Layout from "../../components/Layout";
import Menu from '../../components/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import MakerIcon from "../../assets/maker.png";
import MakerAdd from "../../assets/maker1.png";
import Edit from './Edit';
import Form from './Form';
export default function AddNew({ classes, data, columnCount, rowCount, onBackToHome }) {

    const [tab, setTab] = React.useState(1);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [positionDrawer, setPositionDrawer] = useState('right');
    const [isAdding, setIsAdding] = useState(false);

    const [columnWidth, setColumnWidth] = useState(0);
    const [rowHeight, setRowHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [widthZoom, setWidthZoom] = useState(0);
    const [heightZoom, setHeightZoom] = useState(0);

    const [addData, setAddData] = useState(data);
    const [errors, setError] = useState({});
    const [makerSelected, setMakerSelected] = useState({});
    const [newMaker, setNewMaker] = useState({
        name: 'New Maker',
        camera_id: '',
        axisX: 0,
        axisY: 0
    });

    const [addActions, setAddActions] = useState([
        { icon: <AddLocation />, name: 'Add Camera' },
        { icon: <ArrowBack />, name: 'Back To Home' }
    ])

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

    const addCamera = (response) => {
        const { layout_id } = response
        const data = addData.map(array => {
            return array.map(obj => {
                if (obj.id === layout_id)
                    obj.cameras.push(response)
                obj.cameraTemp = []
                return obj
            })
        })
        setAddData(data)
        setNewMaker({
            name: 'New Maker',
            camera_id: '',
            axisX: 0,
            axisY: 0,
        })
        setOpenDrawer(false)
        setError({})
    }

    const onCloseDrawer = () => setOpenDrawer(false)

    const onClickMenuItem = (name) => {
        
        if(name === "Back To Home") onBackToHome()
        if(name === "Add Camera") onClickAddItem()
        
        const { layout_id } = newMaker
        updateCameraTemp(layout_id, [])
    }

    const onClickAddItem = () => {
        const [add, ...actions] = addActions
        setAddActions([ {...add, isHighlight: !isAdding},...actions])
        setIsAdding(!isAdding)
        setTab(1)
    }

    const onClickMaker = e => {
        setError({})
        setOpenDrawer(true)
    }

    const onDoubleClickMaker = (obj) => e => {
        if(e.pageX < window.screen.availWidth / 2) {
            setPositionDrawer('right')
        } else {
            setPositionDrawer('left')
        }
        setMakerSelected({
            ...obj,
            axisX: Math.floor(obj.axisX * columnWidth),
            axisY: Math.floor(obj.axisY * rowHeight)
        })
        setTab(2)
    }

    const onClickAddMaker = (cellData) => e => {
        if (e.nativeEvent.offsetY > 30 && e.nativeEvent.offsetX > 9.26 && cellData) {
            const { id } = cellData
            const cameraTemp = [{
                ...newMaker,
                axisX: e.nativeEvent.offsetX / columnWidth,
                axisY: e.nativeEvent.offsetY / rowHeight
            }]
            updateCameraTemp(id, cameraTemp)
            setNewMaker({
                ...newMaker,
                axisX: e.nativeEvent.offsetX,
                axisY: e.nativeEvent.offsetY,
                layout_id: id,
                status_id: 1
            })
            if(e.pageX < window.screen.availWidth / 2) {
                setPositionDrawer('right')
            } else {
                setPositionDrawer('left')
            }
            setError({})
            setOpenDrawer(true)
        }   
    }
    
    const updateCameraTemp = (layout_id, cameraTemp) => {
        const data = addData.map(array => {
            return array.map(obj => {
                if (obj.id === layout_id) {
                    obj.cameraTemp = cameraTemp
                } else obj.cameraTemp = []
                return obj
            })
        })
        setAddData(data)
    }

    const formValidate = () => {
        let err = {}
        let value = newMaker

        const required = [
            'name',
            'camera_id',
            'axisX',
            'axisY',
        ]

        const numeric = [
            'axisX',
            'axisY'
        ]

        required.forEach( key => {
            if( !value[key] )  {
                err[key] = 'This field is required.'
            }
        })

        numeric.forEach( key => {
            if( value[key] && isNaN( value[key]) ) {
                err[key] = 'Numeric values only.'
            } else if(key === 'x') {
                if ( value[key] && (value[key] > columnWidth || value[key] < 0) ) {
                    err[key] = `Numeric value should be below ${columnWidth} and above 0.`
                }
            } else if(key === 'y') {
                if ( value[key] && (value[key] > rowHeight || value[key] < 0) ) {
                    err[key] = `Numeric value should be below ${rowHeight} and above 0.`
                }
            } 
        })
        
        setError(err)
        return err
    }

    const handleSubmit = e => {
        e.preventDefault();
        let errors = formValidate();
        if (Object.keys(errors).length === 0)
        {
            const obj = {
                ...newMaker,
                axisX: parseInt(newMaker.axisX) / columnWidth,
                axisY: parseInt(newMaker.axisY) / rowHeight
            }

            axios.post(`${process.env.REACT_APP_NX_API}/device/create`, obj).then(res => {
                const { data, message } = res.data
                addCamera(data)
                alert(message)
            }).catch(e => {
                setError({ ...errors, camera_id: e.response.data.message })
            })
        }
    }

    const handleChange = e => {
        const target = e.target
        const value = target.value
        const name = target.name
        let newMakerValues = { ...newMaker }
        newMakerValues[name] = value
        const { layout_id } = newMakerValues
        const cameraTemp = [{
            ...newMakerValues,
            axisX: parseInt(newMakerValues['axisX']) / columnWidth,
            axisY: parseInt(newMakerValues['axisY']) / rowHeight
        }]

        updateCameraTemp(layout_id, cameraTemp)
        setNewMaker(newMakerValues)
    }

    const handleCancel = () => {
        setError({})
        setOpenDrawer(false)
    }

    const cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
        const cellData = addData[rowIndex][columnIndex]
        const image = cellData && cellData.image ? cellData.image : ''
        return (
            <GridCell cellKey={key} style={style} image={image} cellData={cellData} renderMaker={() => renderMaker(cellData)} onClickLayout={isAdding ? onClickAddMaker(cellData) : () => {}}/>
        )
    }

    const renderMaker = (cellData) => {
        return (
            <>
                {
                    cellData && cellData.cameras && cellData.cameras.map(obj =>
                        <Maker makerData={obj} makerIcon={MakerIcon} columnWidth={columnWidth} rowHeight={rowHeight} onDoubleClickMaker={!isAdding ? onDoubleClickMaker(obj) : () => {}} />
                    )
                }
                {
                    cellData && cellData.cameraTemp && cellData.cameraTemp.map(obj =>
                        <Maker makerData={obj} makerIcon={MakerAdd} columnWidth={columnWidth} rowHeight={rowHeight} onClickMaker={isAdding ? onClickMaker : () => {}} />
                    )
                }
            </>
        )
    }

    const renderComponent = () => {
        switch (tab) {
            case 2:
            return (
                <Edit classes={classes} data={addData} addActions={addActions} onClickAddItem={onClickAddItem} dataSelected={makerSelected} position={positionDrawer} columnCount={columnCount} rowCount={rowCount} onBackToHome={onBackToHome} />
            )
            default:
                return (
                    <>
                        <Layout width={width} height={height} columnCount={columnCount} columnWidth={columnWidth} rowCount={rowCount} rowHeight={rowHeight} widthZoom={widthZoom} heightZoom={heightZoom} cellRenderer={cellRenderer} />
                        <Drawer height={height} openDrawer={openDrawer} onCloseDrawer={onCloseDrawer} positionDrawer={positionDrawer} renderDrawerComponent={renderDrawerComponent} />
                        <Menu classes={classes} actions={addActions} open onClickMenuItem={onClickMenuItem} icon={<MenuIcon />} />
                    </>
                )
        }
    }

    const renderDrawerComponent = () => {
        return (
            <Box style={{ width: window.screen.availWidth / 3.5 }}>
                <Form name="Add Camera" type="add" classes={classes} data={newMaker} errors={errors} handleSubmit={handleSubmit} handleChange={handleChange} handleCancel={handleCancel} />
            </Box>
        )
    }

    return (
        <>
            {renderComponent()}
        </>
    )
}