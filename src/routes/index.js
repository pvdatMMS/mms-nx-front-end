import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Index from '../pages/home/index'

const Routes = () => (
    <Switch>
        <Route exact path="/" component={Index} />
    </Switch>
)

export default Routes
