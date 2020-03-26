import React, { useState, useLayoutEffect, useEffect } from "react";
import { AddLocation, ArrowBack } from '@material-ui/icons';
import Tooltip from "@material-ui/core/Tooltip";
import maker from "../../assets/maker.png";
import makerAdd from "../../assets/maker1.png";
import makerEdit from "../../assets/maker2.png";
import Menu from '../../components/Menu';
import GridList from '../../components/Grid';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from "@material-ui/core/Drawer";
import { Box, Button, Typography, Grid } from "@material-ui/core";
import LoadingOverlay from 'react-loading-overlay';
import Input from '../../components/Input';
import axios from 'axios';
export default function Add({ classes, data, columnCount, rowCount, onBackToHome }) {
    const [isAdding, setIsAdding] = useState(false)
    const [isEditting, setIsEditting] = useState(false)
    const [isMoving, setMoving] = useState(false)
    const [columnWidth, setColumnWidth] = useState(0);
    const [rowHeight, setRowHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [widthZoom, setWidthZoom] = useState(0);
    const [heightZoom, setHeightZoom] = useState(0);
    const [openDrawer, setOpenDrawer] = useState(false)
    const [makerSelected, setMakerSelected] = useState({});
    const [newMaker, setNewMaker] = useState({
        name: 'New Maker',
        cameraId: '',
        x: 0,
        y: 0,
        // url: ''
    });
    const [errors, setError] = useState({});
    const [isActive, setIsActive] = useState(false);
    const [positionDrawer, setPositionDrawer] = useState('right');
    const [dataAdd, setDataAdd] = useState(data);
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
    
    const cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
        return (
            <div key={key}
                style={{
                    ...style,
                    backgroundImage: `url(${dataAdd[rowIndex][columnIndex] && dataAdd[rowIndex][columnIndex].image ? data[rowIndex][columnIndex].image: ''})`,
                    backgroundRepeat: 'no-repeat',
                    float: 'left',
                    backgroundSize: '100% 100%'
                }}
                onMouseMove={isMoving ? onMouseMoveMaker(rowIndex, columnIndex) : () => {}}
                onClick={isAdding || isMoving ? onClickAddMaker(rowIndex, columnIndex) : () => {}}
            >
                {
                    dataAdd[rowIndex][columnIndex] && dataAdd[rowIndex][columnIndex].cameras.map((obj, index) =>
                        <Tooltip title={obj.name}>
                            <img
                                style={{
                                    position: "absolute",
                                    left: obj.x * columnWidth - 9.26,
                                    top: obj.y * rowHeight - 30,
                                    height: 30
                                }}
                                onDoubleClick={!isMoving && !isAdding ? onDoubleClickMaker(rowIndex, columnIndex, obj) : () => {}}
                                src={maker}
                                alt="maker"
                            />
                        </Tooltip>
                    )
                }
                {
                    dataAdd[rowIndex][columnIndex] && dataAdd[rowIndex][columnIndex].cameraTemp.map((obj, index) =>
                        <Tooltip title={obj.name}>
                            <img
                                style={{
                                    position: "absolute",
                                    left: obj.x * columnWidth - 9.26,
                                    top: obj.y * rowHeight - 30,
                                    height: 30
                                }}
                                onClick={!isMoving && isAdding ? onClickMaker(rowIndex, columnIndex, obj) : () => {}}
                                src={makerAdd}
                                alt="maker"
                            />
                        </Tooltip>
                    )
                }
            </div>
        );
    }
    const onClickAddMaker = (rowIndex, columnIndex) => e => {
        if(e.nativeEvent.offsetY > 30 && e.nativeEvent.offsetX > 9.26 && dataAdd[rowIndex][columnIndex]) {
            if(isAdding) {
                const dataTemp = dataAdd.map((obj, objIndex) => {
                    obj.map((element, elementIndex) => {
                        if(objIndex === rowIndex && elementIndex === columnIndex) {
                            element.cameraTemp = [{
                                ...newMaker,
                                x: e.nativeEvent.offsetX / columnWidth,
                                y: e.nativeEvent.offsetY / rowHeight
                            }]
                            setNewMaker({...
                                newMaker,
                                x: e.nativeEvent.offsetX,
                                y: e.nativeEvent.offsetY,
                                rowIndex, columnIndex
                            })
                        } else {
                            element.cameraTemp = []
                        }
                    })
                    return obj
                })
                setDataAdd(dataTemp)   
            } else if(isMoving) {
                const dataTemp = dataAdd.map((obj, objIndex) => {
                    obj.map((element, elementIndex) => {
                        if (objIndex === makerSelected.rowIndex && elementIndex === makerSelected.columnIndex) {
                            for (let i = 0; i < element.cameras.length; i++) {
                                if (element.cameras[i].id === makerSelected.id) {
                                    element.cameras.splice(i, 1)
                                }
                            }
                            
                        }
                        if(objIndex === rowIndex && elementIndex === columnIndex) {
                            element.cameraTemp = [{
                                ...makerSelected,
                                x: e.nativeEvent.offsetX / columnWidth,
                                y: e.nativeEvent.offsetY / rowHeight
                            }]
                            setMakerSelected({...{
                                ...makerSelected,
                                x: e.nativeEvent.offsetX,
                                y: e.nativeEvent.offsetY
                            }, rowIndex, columnIndex})
                        } else {
                            element.cameraTemp = []
                        }
                        
                    })
                    return obj
                })
                setDataAdd(dataTemp)
                setIsEditting(true)
                setMoving(false)
            }
            if(e.pageX < window.screen.availWidth / 2) {
                setPositionDrawer('right')
            } else {
                setPositionDrawer('left')
            }
            setError({})
            setOpenDrawer(true)
        }

    }

    const onDoubleClickMaker = (rowIndex, columnIndex, obj) => e => {
        if(e.pageX < window.screen.availWidth / 2) {
            setPositionDrawer('right')
        } else {
            setPositionDrawer('left')
        }
        setMakerSelected({...obj,
            x: Math.floor(obj.x * columnWidth),
            y: Math.floor(obj.y * rowHeight),
            rowIndex, columnIndex})
        if(!isAdding) {
            setIsEditting(true)
        }
        setError({})
        setOpenDrawer(true)
    }

    const onMouseMoveMaker = (rowIndex, columnIndex) => e => {
        if(e.nativeEvent.offsetY > 30 && e.nativeEvent.offsetX > 9.26 && dataAdd[rowIndex][columnIndex]) {
            const dataTemp = dataAdd.map((obj, objIndex) => {
                obj.map((element, elementIndex) => {
                    if (objIndex === makerSelected.rowIndex && elementIndex === makerSelected.columnIndex) {
                        for (let i = 0; i < element.cameras.length; i++) {
                            if (element.cameras[i].id === makerSelected.id) {
                                element.cameras.splice(i, 1)
                            }
                        }
                    }
                    if(objIndex === rowIndex && elementIndex === columnIndex) {
                        element.cameraTemp = [{
                            ...makerSelected,
                            x: e.nativeEvent.offsetX / columnWidth,
                            y: (e.nativeEvent.offsetY - 5) / rowHeight
                        }]
                    } else {
                        element.cameraTemp = []
                    }
                    
                })
                return obj
            })
            setDataAdd(dataTemp)
        }
    }

    const onClickMaker = (rowIndex, columnIndex, obj) => e => {
        if(e.pageX < window.screen.availWidth / 2) {
            setPositionDrawer('right')
        } else {
            setPositionDrawer('left')
        }
        // setMakerSelected({...obj, rowIndex, columnIndex})
        setError({})
        setOpenDrawer(true)
    }

    const onClickMenuItem = (name) => {
        if(name === "Back To Home") onBackToHome()
        if(name === "Add Camera") {
            const [add, ...actions] = addActions
            setAddActions([ {...add, isHighlight: !isAdding},...actions])
            if(isAdding || isMoving) {
                axios.get('http://192.168.1.131:8080/layouts').then(res => {
                    const { data } = res.data
                    setDataAdd(data)
                })
                setNewMaker({
                    name: 'New Maker',
                    cameraId: '',
                    x: 0,
                    y: 0,
                    // url: ''
                })
            }
            setIsAdding(!isAdding)
            setMoving(false)
        }
    }
    const onClose = () => {
        if(isAdding) {
            setError({})
            setOpenDrawer(false)
        }
        
        // setIsEditting(false)
    }
    const onMoveMaker = (e) => {
        const [add, ...actions] = addActions
        setAddActions([ {...add, isHighlight: false},...actions])
        setIsAdding(false)
        setOpenDrawer(false)
        setIsEditting(false)
        setMoving(true)
    }
    
    const formValidate = () => {
        let err = {}
        let value = {}
        if(isAdding) {
            value = newMaker
        } else {
            value = makerSelected
        }
        setIsActive(true)
        const required = [
            'name',
            'cameraId',
            'x',
            'y',
            // 'url'
        ]

        const numeric = [
            'x',
            'y'
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

    const handleSubmit = (event) => {
        event.preventDefault()
        let errors = formValidate();
        if (Object.keys(errors).length === 0)
        {
            setIsActive(true);
            if(isAdding) {
                const obj = {
                    ...newMaker,
                    axisX: parseInt(newMaker.x) / columnWidth,
                    axisY: parseInt(newMaker.y) / rowHeight,
                    camera_id: newMaker.cameraId,
                    layout_id: dataAdd[newMaker.rowIndex][newMaker.columnIndex].id
                }
    
                axios.post('http://192.168.1.131:8080/device/add', obj).then(res => {
                    const { data } = res.data
                    setDataAdd(data)
                    setNewMaker({
                        name: 'New Maker',
                        cameraId: '',
                        x: 0,
                        y: 0,
                        // url: ''
                    })
                    alert(res.data.message)
                    setOpenDrawer(false)
                    setError({})
                }).catch(e => {
                    setError({...errors, cameraId: 'This value can not found!'})
                    // setOpenDrawer(true)
                    // alert(e.response.data.message)
                })
                
            } else {
                const obj = {
                    ...makerSelected,
                    axisX: parseInt(makerSelected.x) / columnWidth,
                    axisY: parseInt(makerSelected.y) / rowHeight,
                    camera_id: makerSelected.cameraId,
                    layout_id: dataAdd[makerSelected.rowIndex][makerSelected.columnIndex].id
                }
                axios.post(`http://192.168.1.131:8080/device/${makerSelected.id}/update`, obj).then(res => {
                    const { data } = res.data
                    setDataAdd(data)
                    
                    alert(res.data.message)
                    setIsEditting(false)
                    setOpenDrawer(false)
                    setError({})
                }).catch(e => {
                    setError({...errors, cameraId: 'This value can not found!'})
                    // setOpenDrawer(true)
                    alert(e.response.data.message)
                })
            }
            setIsActive(false);
            // setError({})
            // setIsEditting(false)
            // setOpenDrawer(false)
        } else {
            setIsActive(false);
        }
    }
    const handleChange = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name
        let newMakerValues = {}
        if(isAdding) {
            newMakerValues = {...newMaker}
        } else {
            newMakerValues = {...makerSelected}
        }
        const { rowIndex, columnIndex } = newMakerValues

        newMakerValues[name] = value
        
        const dataTemp = dataAdd.map((obj, objIndex) => {
            obj.map((element, elementIndex) => {
                if (isEditting && objIndex === makerSelected.rowIndex && elementIndex === makerSelected.columnIndex) {
                    for (let i = 0; i < element.cameras.length; i++) {
                        if (element.cameras[i].id === makerSelected.id) {
                            element.cameras.splice(i, 1)
                        }
                    }
                }
                if(objIndex === rowIndex && elementIndex === columnIndex) {
                        element.cameraTemp = [{
                            ...newMakerValues,
                            x: parseInt(newMakerValues['x']) / columnWidth,
                            y: parseInt(newMakerValues['y']) / rowHeight
                        }]
                }
            })
            return obj
        })

        setDataAdd(dataTemp)

        if(isAdding) {
            setNewMaker(newMakerValues)
        } else {
            setMakerSelected(newMakerValues)
        }
        
        
    
    }
    const handleCancel = () => {
        if(isEditting) {
            axios.get('http://192.168.1.131:8080/layouts').then(res => {
                const { data } = res.data
                setDataAdd(data)
            })
            setIsEditting(false)
        }
        setError({})
        setOpenDrawer(false)
    }
    
    const handleDelete = () => {
        axios.delete(`http://192.168.1.131:8080/device/${makerSelected.id}`).then(res => {
            const dataTemp = dataAdd.map((obj, objIndex) => {
                obj.map((element, elementIndex) => {
                    if (objIndex === makerSelected.rowIndex && elementIndex === makerSelected.columnIndex) {
                        for (let i = 0; i < element.cameras.length; i++) {
                            if (element.cameras[i].id === makerSelected.id) {
                                element.cameras.splice(i, 1)
                            }
                        }
                        element.cameraTemp = []
                    }
                })
                return obj
            })
            setDataAdd(dataTemp)
            alert(res.data.message)
        })
        setIsEditting(false)
        setOpenDrawer(false)
    }
    return (
        <>
            <Box style={{ height: 50, backgroundColor: 'red'}}></Box>
            <Box display="flex" alignContent="center" justifyContent="center" alignItems="center" style={{ height: height, width: width - 50 }}>
                        <Box style={{ height: height}}>
                            <GridList
                                cellRenderer={cellRenderer}
                                columnCount={columnCount}
                                rowCount={rowCount}
                                width={widthZoom}
                                height={heightZoom}
                                columnWidth={columnWidth}
                                rowHeight={rowHeight}
                            />
                        </Box>
                        <Menu classes={classes} actions={addActions} open onClickMenuItem={onClickMenuItem} icon={<MenuIcon />} onClick={onBackToHome} />
                    </Box>
            <Box style={{ height: 50, backgroundColor: 'red'}}></Box>
            
            <Drawer
                anchor={positionDrawer}
                open={openDrawer}
                onClose={onClose}
            >
                <Box
                    style={{height: height, width: window.screen.availWidth / 4}}
                    // className={classes.drawer}
                    role="presentation"
                    display="flex" alignContent="center" justifyContent="center" alignItems="center"
                    flexDirection="column"
                >
                    <Box style={{width: window.screen.availWidth / 4.5}}>
                    <LoadingOverlay
            active={isActive}
            spinner
            text='Please wait...'
            >
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2} style={{padding: 5}}>
                                <Grid item xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography>{isAdding ? "Add" : "Edit"}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Input
                                                label="NAME"
                                                name="name"
                                                value={isAdding ? newMaker.name : makerSelected.name}
                                                onChange={handleChange}
                                                // disabled={readOnly}
                                                error={errors.name ? true : false}
                                            />
                                            <span className={classes.error}>{ errors.name }</span>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Input
                                                label="CAMERA ID"
                                                name="cameraId"
                                                value={isAdding ? newMaker.cameraId : makerSelected.cameraId}
                                                onChange={handleChange}
                                                // disabled={readOnly}
                                                error={errors.cameraId ? true : false}
                                            />
                                            <span className={classes.error}>{ errors.cameraId }</span>
                                        </Grid>
                                        <Grid container spacing={2} style={{padding: 8}}>
                                        <Grid item xs={6}>
                                            <Input
                                                label="X"
                                                name="x"
                                                value={isAdding ? newMaker.x : makerSelected.x}
                                                onChange={handleChange}
                                                // disabled={readOnly}
                                                error={errors.x ? true : false}
                                            />
                                            <span className={classes.error}>{ errors.x }</span>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Input
                                                label="Y"
                                                name="y"
                                                value={isAdding ? newMaker.y : makerSelected.y}
                                                onChange={handleChange}
                                                // disabled={readOnly}
                                                error={errors.y ? true : false}
                                            />
                                            <span className={classes.error}>{ errors.y }</span>
                                        </Grid>
                                        </Grid>
                                        {/* <Grid item xs={12}>
                                            <Input
                                                label="URL"
                                                name="url"
                                                value={isAdding ? newMaker.url : makerSelected.url}
                                                onChange={handleChange}
                                                // disabled={readOnly}
                                                error={errors.url ? true : false}
                                            />
                                            <span className={classes.error}>{ errors.url }</span>
                                        </Grid> */}
                                        
                                        <Grid item xs={12}>
                                            <Grid container justify="center" direction="row" className={classes.groupButton}>
                                                <Button variant="contained" color="primary" type="submit">
                                                Submit
                                                </Button>
                                                {
                                                    isEditting ? (
                                                        <>
                                                            <Button variant="contained" color="primary" onClick={onMoveMaker}>
                                                                Move
                                                            </Button>
                                                            <Button variant="contained" color="secondary" onClick={handleDelete}>
                                                                Delete
                                                            </Button>
                                                        </>
                                                    ) : ''
                                                }
                                                <Button variant="contained" color="secondary" onClick={handleCancel}>
                                                    Cancel
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                        </LoadingOverlay>
                    </Box>
                </Box>
            </Drawer>
        </>
    )
}