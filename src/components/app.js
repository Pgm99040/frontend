import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Main from './main';

function mapStateToPros(state) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
    	Object.assign({}, ), dispatch);
}

const App = connect(mapStateToPros, mapDispatchToProps)(Main);

export default App;