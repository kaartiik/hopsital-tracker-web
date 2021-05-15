import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/core/styles';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';
import { history } from '../../history';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

function HomePage() {
  const classes = useStyles();

  const { uuid, isLoading } = useSelector((state) => ({
    uuid: state.userReducer.uuid,
    isLoading: state.userReducer.isLoading,
  }));

  useEffect(() => {
    if (uuid === null) {
      history.push(ROUTES.SIGN_IN);
    }
  }, [uuid]);

  return (
    <div className={classes.container}>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <h3>Welcome to Hospital Tracker System</h3>
      <img
        src={require('../../assets/home_background.jpg')}
        alt="Home Illustration"
      />
    </div>
  );
}

export default HomePage;
