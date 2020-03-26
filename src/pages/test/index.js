import React, { useEffect, useState } from "react";
import { Grid } from 'react-virtualized';

import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import SpeedDial from "@material-ui/lab/SpeedDial";
import { AddPhotoAlternate, Edit, Close, Menu, EditLocation, AddLocation } from '@material-ui/icons'
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import base64 from "../../components/base64";
import maker from "../../assets/maker.png";
export default function Index() {
    const classes = useStyles();
    const [previousXY, setPreviousXY] = useState({
        previousX: null,
        previousY: null
    })
    const [camera, setCamera] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [isEditting, setIsEditting] = React.useState(false);
    const [isAdding, setIsAdding] = React.useState(false);
    const list = [
        [base64.area1, 'Software Engineer', 'San Jose', 'CA', 95125 /* ... */],
        [base64.area2, 'Software Engineer', 'San Jose', 'CA', 95125 /* ... */],
        [base64.area3, 'Software Engineer', 'San Jose', 'CA', 95125 /* ... */]
    ];

    const actions = [
        { icon: <AddLocation />, name: 'Add' },
        { icon: <EditLocation />, name: 'Edit' },
    ];

    function cellRenderer({ columnIndex, key, rowIndex, style }) {
        return (
            <div key={key}
                style={{
                    ...style,
                    border: '1px solid red',
                    backgroundImage: `url(${list[rowIndex][columnIndex]})`,
                    backgroundRepeat: 'no-repeat',
                    float: 'left',
                    backgroundSize: '100% 100%'
                }}
            >
                <Tooltip title="Maker">
                    <img
                        style={{
                            position: "absolute",
                            left: (60.94488188976378 * (window.screen.availWidth - 15) / 100) - 9.26,
                            top: (33.98148148148148 * (window.screen.availHeight) / 100) - 30,
                            height: 30
                        }}
                        // onDoubleClick={() => onDoubleClickCamera(props)}
                        src={maker}
                        alt="maker"
                    />
                </Tooltip>
            </div>
        );
    }

    const onMouseDownToScroll = (event) => {
        // console.log({x: event.pageX, y: event.pageY})
        setPreviousXY({ previousX: event.pageX, previousY: event.pageY })
    }

    const onMouseMoveToScroll = (event) => {
        if (event.buttons) {
            let { previousX, previousY } = previousXY
            let dragX = 0
            let dragY = 0
            // skip the drag when the x position was not changed
            if (event.pageX - previousX !== 0) {
                dragX = previousX - event.pageX
                previousX = event.pageX
            }
            // skip the drag when the y position was not changed
            if (event.pageY - previousY !== 0) {
                dragY = previousY - event.pageY
                previousY = event.pageY
            }

            // scrollBy x and y
            if (dragX !== 0 || dragY !== 0) {
                window.scrollBy(dragX, dragY)
            }
        }
    }

    const handleClick = (name) => {
        setIsEditting(true)
    }
    return (
        <div>
            <div style={{ width: window.screen.availWidth, height: 50, backgroundColor: "red"}}></div>
                {renderComponent()}
            <div style={{width: window.screen.availWidth, height: 50, backgroundColor: "red"}}></div>
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
        position: 'fixed',
        top: theme.spacing(7),
        left: theme.spacing(0.5),
        '& .MuiFab-primary': {
            backgroundColor: '#475bff',
        }
    },
    speedDialEdit: {
        position: 'fixed',
        top: theme.spacing(0.5),
        left: theme.spacing(0.5),
        '& .MuiFab-primary': {
            backgroundColor: '#FF0000',
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