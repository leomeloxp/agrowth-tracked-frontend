import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Link from 'next/link';
import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import { CURRENT_USER } from '../graphql/user';
import LoadingSpinner from './LoadingSpinner';
import SignIn from './SignIn';

/**
 * Helper class used to ensure that the user is logged in before rendering content that should be restricted to logged in users of our application.
 *
 * If the user is logged in, it will render the children of this component, otherwise it will render the sign in form and a link to create account.
 *
 * {@see} this class nullifies SSR for its children components
 *
 * @export
 * @class PleaseSignIn
 * @extends {Component}
 */
export default class PleaseSignIn extends Component {
  public render() {
    // We can only check for the user's logged in state at the client side so let's ensure we're running
    // this code from the browser and not from the frontend server
    return typeof window !== 'undefined' ? (
      <Query query={CURRENT_USER}>
        {({ data, loading, error }) => {
          if (error) {
            return (
              <p>
                <strong>An error ocurred: </strong>
                {error.message}
              </p>
            );
          }

          if (loading) {
            return <LoadingSpinner />;
          }

          if (!data.getCurrentUser) {
            return (
              <Fragment>
                <SignIn />
                <Card style={{ marginTop: 16 }}>
                  <CardContent>
                    <Link href={'/signup'} passHref>
                      <Button variant="contained" color="primary">
                        Create Account
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </Fragment>
            );
          }

          return this.props.children;
        }}
      </Query>
    ) : (
      <LoadingSpinner />
    );
  }
}
