import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { StyledComponentProps, StyleRules, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { CURRENT_USER, SIGN_IN } from '../graphql/user';

/**
 * Component that renders a form which allows users to sign in to our application.
 *
 * @class SignIn
 * @extends {Component<StyledComponentProps, ISignInState>}
 */
class SignIn extends Component<StyledComponentProps, ISignInState> {
  public state: ISignInState = {
    email: '',
    password: ''
  };

  public handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>): void => {
    const key = target.name as keyof ISignInState;
    this.setState({
      // Temporary hack to avoid type expansion... key should be either `email` or `password` (but never something else)
      [key as 'email']: target.value
    });
  };
  public render() {
    return (
      <Card className={this.props.classes.card}>
        <CardContent>
          <Typography variant="h6">Sign in</Typography>
          <Mutation variables={this.state} mutation={SIGN_IN} refetchQueries={[{ query: CURRENT_USER }]}>
            {(signIn, { loading, error }) => {
              return (
                <form
                  method="POST"
                  onSubmit={async e => {
                    e.preventDefault();
                    await signIn();
                    this.setState({ email: '', password: '' });
                  }}
                  className={this.props.classes.form}
                >
                  {error ? (
                    <div>
                      <Typography variant="caption" color="error">
                        {error.message}
                      </Typography>
                    </div>
                  ) : null}
                  <div>
                    <TextField
                      label="Email"
                      name="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                      inputProps={{ autoComplete: 'username' }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Password"
                      type="password"
                      name="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                      inputProps={{ autoComplete: 'current-password' }}
                    />
                  </div>
                  <Button
                    className={this.props.classes.submitButton}
                    disabled={loading}
                    type="submit"
                    color="primary"
                    variant="contained"
                  >
                    Sign in
                  </Button>
                </form>
              );
            }}
          </Mutation>
        </CardContent>
      </Card>
    );
  }
}

const styles: StyleRules<string> = {
  card: {
    margin: '16px auto',
    width: '400px'
  },
  form: {
    marginBottom: 16,
    marginTop: 16
  },
  submitButton: {
    marginTop: 16
  }
};

export default withStyles(styles)(SignIn);

export interface ISignInState {
  email: string;
  name?: string;
  password: string;
}
