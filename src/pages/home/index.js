import React, {useEffect, useState} from 'react';
import './styles.css'
import dummyData from './data'
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import SpeedDial from "@material-ui/lab/SpeedDial";
import AddIcon from "@material-ui/icons/AddPhotoAlternate";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/RestoreFromTrash";
import {makeStyles} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Maker from "../../components/maker";
import Area from "../../components/area";

const actions = [
    {icon: <AddIcon color="action"/>, name: 'Add'},
    {icon: <EditIcon/>, name: 'Edit'},
    {icon: <DeleteIcon/>, name: 'Delete'},
];
export default function App({history}) {
    const classes = useStyles();
    const [openDrawer, setOpenDrawer] = React.useState(false);
    let cameraList = [];
    const [camera, setCamera] = React.useState([]);
    const [open, setOpen] = React.useState(false);


    const handleClick = (action) => {
        action === 'Add' ?
            history.push('/add') :
            action === 'Edit' ?
                setOpenDrawer(true) : history.push('/test')
    };
    const handleClose = (action) => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };


    const onClickCamera = (e) => {
        setOpenDrawer(true)
    };

    async function pushCamera(e) {
        cameraList.push(e);
    }

    useEffect(() => {
        setCamera(cameraList)
        let canvas = document.getElementById('DrawLine');
        if (canvas && canvas.getContext) {
            let context = canvas.getContext('2d');
            context.beginPath();
            context.lineJoin = "round";
            cameraList.forEach((obj, index) => {
                if (index === 0)
                    context.moveTo(obj.x, obj.y);
                else
                    context.lineTo(obj.x, obj.y);
            });
            context.lineWidth = 3;
            context.strokeStyle = "#2b30ff";
            context.stroke();

        }
    }, [])

    return (
        <div
            style={{
                backgroundColor: '#61dafb',
                width: 1530,
            }}
        >
            {
                dummyData.area.map((area, indexFloor) => (
                        <div
                            className='row'
                        >
                            {
                                area.map((floor, index) =>
                                    <Area
                                        indexFloor={indexFloor}
                                        index={index}
                                        area={floor}
                                        onClickDoubleCamera={(e) => onClickCamera(e)}
                                        onPushCamera={pushCamera}
                                    />)
                            }
                        </div>
                    )
                )
            }

            {
                <canvas
                    style={{position: "absolute", left: 0, top: 0,}}
                    id="DrawLine"
                    width="2000"
                    height="2000"
                />
            }

            {
                camera.map((obj, index) =>
                    <Maker
                        name={obj.name}
                        left={obj.x}
                        top={obj.y}
                        onDoubleClickCamera={(e) => onClickCamera(e)}
                    />
                )
            }

            <SpeedDial
                ariaLabel="Option"
                className={classes.speedDial}
                icon={<SpeedDialIcon/>}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
                direction='right'
            >
                {actions.map(action => (
                        <SpeedDialAction
                            className={classes.speedDialIcon}
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            tooltipPlacement='bottom'
                            onClick={() => handleClick(action.name)}
                        />
                    )
                )}
            </SpeedDial>
            <Drawer
                anchor="right"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
            >
                <div
                    className={classes.drawer}
                    role="presentation"
                />
            </Drawer>

        </div>
    )

}

const useStyles = makeStyles(theme => ({
        root: {
            transform: 'translateZ(0px)',
            flexGrow: 1,
        },
        exampleWrapper: {
            position: 'relative',
            marginTop: theme.spacing(3),
            height: 380,
        },
        radioGroup: {
            margin: theme.spacing(1, 0),
        },
        speedDial: {
            position: 'absolute',
            top: theme.spacing(0.5),
            left: theme.spacing(0.5),
            '& .MuiFab-primary': {
                backgroundColor: '#ff532e',
            }
        },
        speedDialIcon: {
            color: "#475bff",
            '& .MuiSvgIcon-colorAction': {
                color: '#475bff',
            }
        },
        drawer: {
            width: 650,
        },
    }))
;
