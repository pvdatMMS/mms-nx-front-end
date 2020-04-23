import React, { useState, useEffect } from 'react';
import { Person, ArrowBack } from '@material-ui/icons';
import {
    Switch,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from '@material-ui/core';
import Base from '../../components/Base';
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
import axios from 'axios';

export default function Index({ classes, onBackToHome }) {
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const columns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'color', label: 'Maker Color', minWidth: 170 },
        { id: 'status', label: 'Status', minWidth: 170 },
    
    ];
    
    const personActions = [
        { icon: <Person />, isHighlight: true, name: 'Blacklist' },
        { icon: <ArrowBack />, name: 'Back To Home' },
    ];

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_NX_API}/persons`).then(res => {
            const { data } = res.data
            setRows(data)
        })
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const onClickMenuItem = (name) => {
        if (name === "Back To Home") onBackToHome()
    }

    const handleChange = row => event => {
        const { id } = row
        const checked = event.target.checked
        axios.post(`${process.env.REACT_APP_NX_API}/person/${id}/update`, { status: checked }).then(res => {
            const { data, message } = res.data
            setRows(data)
            alert(message)
        })
    }

    const colorMaker = (color) => {
        switch(color) {
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
                 return ''
        }
    }

    const renderData = (id, row) => {
        const value = row[id];
        switch(id) {
            case 'color':
                return (<img style={{ height: 30 }} src={colorMaker(value)}></img>)
            case 'status':
                return (<Switch
                    checked={value ? true : false}
                    onChange={handleChange(row)}
                    color="primary"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />)
            default:
                return value
        }
    }

    return (
        <Base>
            <Paper className={classes.paper}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align="center"
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map((column) => {
                                            return (
                                                <TableCell key={column.id} align="center">
                                                    {renderData(column.id, row)}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            <Menu classes={classes} actions={personActions} open onClickMenuItem={onClickMenuItem} icon={<MenuIcon />} />
        </Base>
    );
}