import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from '../pages/home'
import Add from '../pages/add-room'
import Test from '../pages/test'

const Routes = () => (
    <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/add" component={Add} />
        <Route exact path="/test" component={Test} />
        {/*<Route exact path={`/details/:id`} component={Detail} />*/}
    </Switch>
)

export default Routes
