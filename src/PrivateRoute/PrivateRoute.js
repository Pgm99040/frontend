import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({component: Component, ...rest}) => {
    const isLogin = localStorage.getItem("isLoggedIn");
    const token = localStorage.getItem('authToken');
    console.log("isLogin:---", isLogin);
    return (
        <Route {...rest} render={props => (
            (isLogin === 'true' || isLogin === true)  ?
                <Component {...props} />
                : <Redirect to="/" />
        )} />
    );
};

export default PrivateRoute;