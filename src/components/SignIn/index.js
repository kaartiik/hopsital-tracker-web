import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { useDispatch } from 'react-redux';
import * as ROUTES from '../../constants/routes';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import { TrainRounded } from '@material-ui/icons';
import { login } from '../../providers/actions/User';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  formSpacing: {
    margin: 15,
  },
  errorText: {
    color: 'red',
  },
}));

function SignInPage() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    if (password === '' || email === '') {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
  }, [email, password]);

  const handleLogin = (e) => {
    e.preventDefault();

    dispatch(login(email, password));
  };

  return (
    <div className={classes.root}>
      <form onSubmit={handleLogin}>
        <div className={classes.root}>
          <img
            src={require('../../assets/login_logo.png')}
            alt="Login Illustration"
            height={300}
            width={300}
          />
          <div className={classes.formSpacing}>
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
            />
          </div>

          <div className={classes.formSpacing}>
            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </div>

          <div className={classes.formSpacing}>
            <Button
              className={classes.button}
              disabled={isInvalid}
              variant="contained"
              color="secondary"
              type="submit"
            >
              Sign In
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export const SignInLink = () => (
  <p>
    Have an account? <Link to={ROUTES.SIGN_IN}>Sign In</Link>
  </p>
);

export default compose(withRouter)(SignInPage);
