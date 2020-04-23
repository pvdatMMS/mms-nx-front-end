import React, { useState, useLayoutEffect, useEffect } from "react";
import { Box } from "@material-ui/core";
import axios from 'axios';
import GridCell from "../../components/GridCell";
import Maker from '../../components/Maker';
import Drawer from '../../components/Drawer';
import Layout from "../../components/Layout";
import Menu from '../../components/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import MakerIcon from "../../assets/maker.png";
import MakerEdit from "../../assets/maker2.png";
import Form from './Form';

export default function Edit({ classes, data, addActions, onClickAddItem, dataSelected, position, columnCount, rowCount, onBackToHome }) {

    const [openDrawer, setOpenDrawer] = useState(true);
    const [isMoving, setMoving] = useState(false);

    const [columnWidth, setColumnWidth] = useState(0);
    const [rowHeight, setRowHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [widthZoom, setWidthZoom] = useState(0);
    const [heightZoom, setHeightZoom] = useState(0);

    const [editData, setEditData] = useState(data);
    const [errors, setError] = useState({});
    const [makerSelected, setMakerSelected] = useState(dataSelected);
    const [previousMakerSelected, setPreviousMakerSeleted] = useState(dataSelected);
    const [positionDrawer, setPositionDrawer] = useState(position);

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

    const updateCamera = (response) => {
        const { layout_id } = response
        const data = editData.map(array => {
            return array.map(obj => {
                if (obj.id === layout_id)
                    obj.cameras.push(response)
                obj.cameraTemp = []
                return obj
            })
        })
        setEditData(data)
        setOpenDrawer(false)
        setError({})
    }

    const deleteCamera = (response) => {
        const { id, layout_id } = response
        const data = editData.map(array => {
            return array.map(obj => {
                if (obj.id === layout_id) {
                    for (let i = 0; i < obj.cameras.length; i++) {
                        if (obj.cameras[i].id === id) {
                            obj.cameras.splice(i, 1)
                        }
                    }
                    obj.cameraTemp = []
                }
                return obj
            })
        })
        setEditData(data)
        setOpenDrawer(false)
        setError({})
    }

    const updateCameraRemoved = (response) => {
        const { layout_id, axisX, axisY } = response
        const data = editData.map(array => {
            return array.map(obj => {
                if (obj.id === layout_id)
                    obj.cameras.push({...response, axisX: axisX / columnWidth, axisY: axisY / rowHeight})
                obj.cameraTemp = []
                return obj
            })
        })
        setEditData(data)
    }

    const onCloseDrawer = () => setOpenDrawer(true)

    const onClickMenuItem = (name) => {
        if(name === "Back To Home") onBackToHome()
        if(name === "Add Camera") {
            onClickAddItem()
        }

        if(isMoving) {
            updateCameraRemoved(previousMakerSelected)
        }
    }

    const onDoubleClickMaker = (obj) => e => {
        setPreviousMakerSeleted({...obj,
            axisX: Math.floor(obj.axisX * columnWidth),
            axisY: Math.floor(obj.axisY * rowHeight)
        })
        if(e.pageX < window.screen.availWidth / 2) {
            setPositionDrawer('right')
        } else {
            setPositionDrawer('left')
        }
        setMakerSelected({...obj,
            axisX: Math.floor(obj.axisX * columnWidth),
            axisY: Math.floor(obj.axisY * rowHeight)
        })
        setOpenDrawer(true)
    }

    const onMouseMoveMaker = cellData => e => {
        if(e.nativeEvent.offsetY > 30 && e.nativeEvent.offsetX > 9.26 && cellData) {
            const { id } = cellData
            const cameraTemp = [{
                ...makerSelected,
                axisX: e.nativeEvent.offsetX / columnWidth,
                axisY: (e.nativeEvent.offsetY - 5) / rowHeight
            }]
            updateCameraTemp(id, cameraTemp)
        }
    }

    const onClickAddMaker = cellData => e => {
        if(e.nativeEvent.offsetY > 30 && e.nativeEvent.offsetX > 9.26 && cellData) {
            const { id } = cellData
            const cameraTemp = [{
                ...makerSelected,
                axisX: e.nativeEvent.offsetX / columnWidth,
                axisY: e.nativeEvent.offsetY / rowHeight
            }]
            updateCameraTemp(id, cameraTemp)
            setMakerSelected({...makerSelected,
                axisX: e.nativeEvent.offsetX,
                axisY: e.nativeEvent.offsetY,
                layout_id: id
            })
            if(e.pageX < window.screen.availWidth / 2) {
                setPositionDrawer('right')
            } else {
                setPositionDrawer('left')
            }
            setMoving(false)
            setOpenDrawer(true)
        }
    }

    const updateCameraTemp = (layout_id, cameraTemp) => {
        const data = editData.map(array => {
            return array.map(obj => {
                if (obj.id === layout_id) {
                    for (let i = 0; i < obj.cameras.length; i++) {
                        if (obj.cameras[i].id === makerSelected.id) {
                            obj.cameras.splice(i, 1)
                        }
                    }
                    obj.cameraTemp = cameraTemp
                } else obj.cameraTemp = []
                return obj
            })
        })
        setEditData(data)
    }

    const formValidate = () => {
        let err = {}
        let value = makerSelected

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
                ...makerSelected,
                axisX: parseInt(makerSelected.axisX) / columnWidth,
                axisY: parseInt(makerSelected.axisY) / rowHeight
            }

            axios.post(`${process.env.REACT_APP_NX_API}/device/${obj.id}/update`, obj).then(res => {
                const { data, message } = res.data
                updateCamera(data)
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
        let newMakerValues = { ...makerSelected }
        newMakerValues[name] = value
        const { layout_id } = newMakerValues
        const cameraTemp = [{
            ...newMakerValues,
            axisX: parseInt(newMakerValues['axisX']) / columnWidth,
            axisY: parseInt(newMakerValues['axisY']) / rowHeight
        }]

        updateCameraTemp(layout_id, cameraTemp)
        setMakerSelected(newMakerValues)
    }

    const handleCancel = () => {
        updateCameraRemoved(previousMakerSelected)
        setError({})
        setOpenDrawer(false)
    }

    const handleMove = e => {
        const { layout_id } = makerSelected
        updateCameraTemp(layout_id, [])
        setMoving(true)
        setOpenDrawer(false)
        
    }

    const handleDelete = () => {
        axios.delete(`${process.env.REACT_APP_NX_API}/device/${makerSelected.id}`).then(res => {
            const { data, message } = res.data
            deleteCamera(data)
            alert(message)
        })
    }

    const cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
        const cellData = editData[rowIndex][columnIndex]
        const image = cellData && cellData.image ? cellData.image : ''
        return (
            <GridCell cellKey={key} style={style} image={image} cellData={cellData} renderMaker={() => renderMaker(cellData)} onMouseMove={isMoving ? onMouseMoveMaker(cellData) : () => {}} onClickLayout={isMoving ? onClickAddMaker(cellData) : () => {}}/>
        )
    }

    const renderMaker = (cellData) => {
        return (
            <>
                {
                    cellData && cellData.cameras && cellData.cameras.map(obj =>
                        <Maker makerData={obj} makerIcon={MakerIcon} columnWidth={columnWidth} rowHeight={rowHeight} onDoubleClickMaker={!isMoving ? onDoubleClickMaker(obj) : () => {}} />
                    )
                }
                {
                    cellData && cellData.cameraTemp && cellData.cameraTemp.map(obj =>
                        <Maker makerData={obj} makerIcon={MakerEdit} columnWidth={columnWidth} rowHeight={rowHeight} />
                    )
                }
            </>
        )
    }

    const renderDrawerComponent = () => {
        return (
            <Box style={{width: window.screen.availWidth / 3.5}}>
                <Form name="Edit Camera" type="edit" classes={classes} data={makerSelected} errors={errors} handleSubmit={handleSubmit} handleChange={handleChange} handleCancel={handleCancel} handleMove={handleMove} handleDelete={handleDelete} />
            </Box>
        )
    }

    return (
        <>
            <Layout width={width} height={height} columnCount={columnCount} columnWidth={columnWidth} rowCount={rowCount} rowHeight={rowHeight} widthZoom={widthZoom} heightZoom={heightZoom} cellRenderer={cellRenderer} />
            <Drawer height={height} openDrawer={openDrawer} onCloseDrawer={onCloseDrawer} positionDrawer={positionDrawer} renderDrawerComponent={renderDrawerComponent} />
            <Menu classes={classes} actions={addActions} open onClickMenuItem={onClickMenuItem} icon={<MenuIcon />} />
        </>
    )
}