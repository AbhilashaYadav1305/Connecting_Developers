import React from 'react'
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Landing = ({ isAuthenticated }) => {

    if (isAuthenticated) {
        return <Redirect to='/dashboard' />;
    }
    return (
        <div>
            <section class="landing">
                <div class="dark-overlay">
                    <div class="landing-inner">
                        <h1 class="x-large">Developer Connector</h1>
                        <p class="lead">
                            Create Developer Profile/Portfolio, share posts and connect with
                            other Developers like you
                        </p>
                        <div class="buttons">
                            <Link to="/register" class="btn btn-primary">SignUp</Link>
                            <Link to="/login" class="btn btn">Login</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

Landing.propTypes = {
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Landing);