import React from 'react';
import { Box, CircularProgress } from "@material-ui/core";

export default function Index({ height }) {
    return (
        <Box style={{ height: height }} display="flex" alignContent="center" justifyContent="center" alignItems="center">
            <CircularProgress />
        </Box>
    )
}