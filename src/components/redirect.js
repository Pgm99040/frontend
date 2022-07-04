import React from 'react';
import { Link } from 'react-router-dom';

class Redirect extends React.Component{
    constructor(props) {
        super(props)
    }
    render() {
        return(
            <div className='redirect'>
                <div className='container'>
                    <p className='redirect-text'>You need to <Link to='/home'>Login</Link> to access this page</p>
                </div>
            </div>
        )
    }
}

export default Redirect;