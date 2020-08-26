import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';


const Alert = ({ alerts }) => alerts !== null
    && alerts.length > 0
    && alerts.map(alert => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            {alert.msg}
        </div>
    ))

const mapStatetoProps = state => ({
    alerts: state.alert
});//toget the state inside reducer alert from rootReducer we need state.alert


Alert.propTypes = {
    alerts: propTypes.array.isRequired
}

export default connect(mapStatetoProps)(Alert);