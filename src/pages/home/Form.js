import React from 'react';
import { Box, Button, Typography, Grid } from "@material-ui/core";
import Input from '../../components/Input';

const Form = ({ classes, name, type, data, errors, handleSubmit, handleChange, handleMove, handleDelete, handleCancel }) => {
    const renderButton = () => {
        return (
            <Grid item xs={12}>
                <Grid container justify="center" direction="row" className={classes.groupButton}>
                    <Button variant="contained" color="primary" type="submit">Submit</Button>
                    {
                        type === "edit" ? (
                            <>
                                <Button variant="contained" color="primary" onClick={handleMove}>Move</Button>
                                <Button variant="contained" color="secondary" onClick={handleDelete}>Delete</Button>
                            </>
                        ) : <></>
                    }
                    <Button variant="contained" color="secondary" onClick={handleCancel}>Cancel</Button>
                </Grid>
            </Grid>
        )
    }
    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2} style={{ padding: 5 }}>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography>{name}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Input
                                label="NAME"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                error={errors.name ? true : false}
                            />
                            <span className={classes.error}>{errors.name}</span>
                        </Grid>
                        <Grid item xs={12}>
                            <Input
                                label="CAMERA ID"
                                name="camera_id"
                                value={data.camera_id}
                                onChange={handleChange}
                                error={errors.camera_id ? true : false}
                            />
                            <span className={classes.error}>{errors.camera_id}</span>
                        </Grid>
                        <Grid container spacing={2} style={{ padding: 8 }}>
                            <Grid item xs={6}>
                                <Input
                                    label="Axis X"
                                    name="axisX"
                                    value={data.axisX}
                                    onChange={handleChange}
                                    error={errors.axisX ? true : false}
                                />
                                <span className={classes.error}>{errors.axisX}</span>
                            </Grid>
                            <Grid item xs={6}>
                                <Input
                                    label="Axis Y"
                                    name="axisY"
                                    value={data.axisY}
                                    onChange={handleChange}
                                    error={errors.axisY ? true : false}
                                />
                                <span className={classes.error}>{errors.axisY}</span>
                            </Grid>
                        </Grid>
                        {renderButton()}
                    </Grid>
                </Grid>
            </Grid>
        </form>
    )
}

export default Form;