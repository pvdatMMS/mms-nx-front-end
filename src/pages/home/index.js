import React, { useEffect, useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import HomeNew from './HomeNew';
import axios from 'axios';

export default function Index() {

    const classes = useStyles();
    const [data, setData] = useState([]);
    const [columnCount, setcolumnCount] = useState(0);
    const [rowCount, setRowCount] = useState(0);

    useEffect(() => {
        axios.get('http://172.20.10.6:8080/layouts').then(res => {
            const { data } = res.data
            setcolumnCount(data && data[0] ? data[0].length : 0)
            setRowCount(data && data.length)
            setData(data)
        })
    }, [])

    const loadingSpinner = () => (
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
            <CircularProgress />
        </div>
    )

    if(data && data.length) {
        return (
            <HomeNew classes={classes} data={data} setData={setData} columnCount={columnCount} rowCount={rowCount} />
        )
    } else return loadingSpinner()
    
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    speedDial: {
        position: 'fixed',
        top: theme.spacing(7),
        left: theme.spacing(0.5),
        '& .MuiFab-primary': {
            backgroundColor: '#475bff',
        }
    },
    speedDialIcon: {
        color: "#475bff",

        '& .MuiSvgIcon-colorAction': {
            color: '#475bff',
        }
    },
    speedDialHighlightIcon: {
        color: "#475bff",
        backgroundColor: '#D3D3D3',
        '& .MuiSvgIcon-colorAction': {
            color: '#475bff',
        }
    },
    drawer: {
        width: 650,
    },
    groupButton: {
        '& > *': {
          margin: theme.spacing(0.5),
        },
      },
      error: {
        fontSize: '12px',
        color: 'red',
        display: 'block'
    }
}))