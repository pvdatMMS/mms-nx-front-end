import React from "react";
import { Drawer, Box } from "@material-ui/core";
export default function Index({ width, height, openDrawer, onCloseDrawer, positionDrawer, renderDrawerComponent }) {
    return (
        <Drawer
            anchor={positionDrawer}
            open={openDrawer}
            onClose={onCloseDrawer}
        >
            <Box
                style={{ height: height, width: window.screen.availWidth / 3 }}
                role="presentation"
                display="flex" alignContent="center" justifyContent="center" alignItems="center"
                flexDirection="column"
            >
                {renderDrawerComponent()}
            </Box>
        </Drawer>
    )
}