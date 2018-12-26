import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { StyledComponentProps, StyleRules, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import React, { Component, Fragment } from 'react';
import { Mutation, Query } from 'react-apollo';
import { addLocaleData, FormattedMessage, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import pt from 'react-intl/locale-data/pt';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import SignIn from '../components/SignIn';
import { CURRENT_USER, SIGN_UP } from '../graphql/user';
import enGb from '../translations/enGb';
import ptBr from '../translations/ptBr';

addLocaleData([...en, ...pt]);
const messages = {
  'en-gb': enGb,
  'pt-br': ptBr
};

// Initial state object for our SignUpPage class, used to reset the state once the user has submitted the form.
const initialState = {
  email: '',
  error: undefined,
  name: '',
  password: '',
  passwordConfirm: '',
  termsAgreed: false
};

/**
 * Page that allows users to sign up for our application, currently it only captures the basic information and contains a checkbox for a
 * non-existent set of terms and conditions the user must agree to before using our application.
 *
 * @class SignUpPage
 * @extends {Component<StyledComponentProps, ISignUpPageState>}
 */
class SignUpPage extends Component<StyledComponentProps, ISignUpPageState> {
  public state = initialState;

  /**
   * Handle change events for the TextField form inputs
   *
   * @memberof SignUpPage
   */
  public handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>): void => {
    const key = target.name;
    this.setState({
      // Hack to avoid type expansion errors... key should only be `email`, `name`, `password` or `passwordConfirm` (never something else)
      [key as 'name']: target.value
    });
  };

  /**
   * Validates the user's inputted password
   *
   * @memberof SignUpPage
   */
  public validatePassword = (type = '') => {
    const { password, passwordConfirm } = this.state;
    if (type === 'soft') {
      if (passwordConfirm.length > 0) {
        return password === passwordConfirm;
      }
      return true;
    }
    return password === passwordConfirm;
  };

  /**
   * Renders the actual sign up form
   *
   * @memberof SignUpPage
   */
  public renderSignUpForm = () => {
    const termsCheckbox = (
      <Checkbox
        color="primary"
        checked={this.state.termsAgreed}
        value="termsAgreed"
        required={true}
        onChange={() => {
          this.setState(oldState => ({
            termsAgreed: !oldState.termsAgreed
          }));
        }}
      />
    );
    const termsLabel = (
      <Typography>
        <FormattedMessage
          id="signup.agreement"
          defaultMessage="I agree to the"
          description="First part of the agreement statement"
          // values={{ what: 'Tracked' }}
        />{' '}
        <Link href="/terms">
          <a>
            <FormattedMessage
              id="signup.terms"
              defaultMessage="terms and conditions"
              description="Second part of sentence showed to the user agree the terms and conditions"
              // values={{ what: 'Tracked' }}
            />
          </a>
        </Link>
        .
      </Typography>
    );

    return (
      <IntlProvider locale="pt-br" messages={messages['pt-br']}>
        <Card className={this.props.classes.card}>
          <CardContent>
            <Typography variant="h6">Create Account</Typography>
            <Mutation variables={{ data: this.state }} mutation={SIGN_UP} refetchQueries={[{ query: CURRENT_USER }]}>
              {(signUp, { loading, error }) => {
                return (
                  <form
                    className={this.props.classes.form}
                    method="POST"
                    onSubmit={async e => {
                      e.preventDefault();
                      if (!this.validatePassword()) {
                        this.setState({ error: 'Passwords do not match' });
                      } else if (!this.state.termsAgreed) {
                        this.setState({ error: 'You must agree to the terms and conditions' });
                      } else {
                        await signUp();
                        // User has been created, let's take them to the settings page (soon to be a dashboard page instead)
                        Router.push('/settings');
                      }
                    }}
                  >
                    {this.state.error ? (
                      <div>
                        <Typography variant="caption" color="error">
                          {this.state.error}
                        </Typography>
                      </div>
                    ) : null}
                    {error ? (
                      <div>
                        <Typography variant="caption" color="error">
                          {error.message}
                        </Typography>
                      </div>
                    ) : null}
                    <div>
                      <TextField
                        required={true}
                        label="Name"
                        name="name"
                        value={this.state.name}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div>
                      <TextField
                        required={true}
                        label="Email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div>
                      <TextField
                        required={true}
                        label="Password"
                        type="password"
                        name="password"
                        error={!this.validatePassword('soft')}
                        value={this.state.password}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div>
                      <TextField
                        required={true}
                        label="Confirm password"
                        type="password"
                        name="passwordConfirm"
                        error={!this.validatePassword('soft')}
                        helperText={!this.validatePassword('soft') ? 'passwords must match' : null}
                        value={this.state.passwordConfirm}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div>
                      <FormControl>
                        <FormControlLabel label={termsLabel} control={termsCheckbox} />
                      </FormControl>
                    </div>
                    <Button
                      className={this.props.classes.submitButton}
                      disabled={loading}
                      type="submit"
                      color="primary"
                      variant="contained"
                    >
                      <FormattedMessage
                        id="button.createAccount"
                        defaultMessage="Create account"
                        description="Button to create account"
                        // values={{ what: 'Tracked' }}
                      />
                    </Button>
                  </form>
                );
              }}
            </Mutation>
          </CardContent>
        </Card>
      </IntlProvider>
    );
  };

  /**
   * Main render method for the class
   *
   * @returns
   * @memberof SignUpPage
   */
  public render() {
    return (
      <Fragment>
        <Head>
          <title>
            <FormattedMessage
              id="button.signUp"
              defaultMessage="Sign Up | {what}"
              description="Button to sign up"
              values={{ what: 'Agrowth' }}
            />
          </title>
        </Head>
        <Header pageTitle="Sign Up" />
        <Query query={CURRENT_USER}>
          {({ data, error, loading }) => {
            // console.log({ data, error, loading });
            if (loading) {
              return <LoadingSpinner />;
            }
            if (data.getCurrentUser) {
              const isClient = typeof document !== 'undefined';
              if (isClient) {
                Router.push('/settings');
              }
              return <LoadingSpinner />;
            }
            return (
              <div className={this.props.classes.wrapper}>
                {this.renderSignUpForm()}
                <SignIn />
              </div>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

const styles: StyleRules<string> = {
  card: {
    margin: '16px auto 0',
    width: '400px'
  },
  form: {
    marginBottom: 16,
    marginTop: 16
  },
  submitButton: {
    marginTop: 16
  },
  wrapper: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyItems: 'center',
    margin: '16px auto',
    maxWidth: '100%',
    minHeight: '400px',
    width: '400px'
  }
};

export default withStyles(styles)(SignUpPage);

export interface ISignUpPageState {
  email: string;
  error?: string;
  name: string;
  password: string;
  passwordConfirm: string;
  termsAgreed: boolean;
}
