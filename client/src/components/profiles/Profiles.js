import React, { useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getProfiles } from '../../actions/profile'
import ProfileItem from './ProfileItem';
import Spinner from '../layout/Spinner';


function Profiles({ getProfiles, profile: { profiles, loading } }) {

    useEffect(() => {
        getProfiles();
    }, [getProfiles]);

    return (<Fragment>
        {loading ? <Spinner /> : <Fragment>
            <h1 className='large text-primary'>Developers</h1>
            <p className='lead'>Browse and Connect with developers</p>
            <div classNme='profile'>{profiles.length > 0 ? (
                profiles.map(profile => (
                    <ProfileItem key={profile._id} profile={profile} />
                ))
            ) : <h4>No Records Found...</h4>}</div>
        </Fragment>}
    </Fragment>
    )
}

Profiles.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile
})

export default connect(mapStateToProps, { getProfiles })(Profiles)

