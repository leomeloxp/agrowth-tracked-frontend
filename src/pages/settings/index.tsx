import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { StyledComponentProps, StyleRules, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import format from 'date-fns/format';
import Head from 'next/head';
import Link from 'next/link';
import React, { Component, Fragment } from 'react';
import { Mutation, Query } from 'react-apollo';
import Drawer from '../../components/Drawer';
// import Header from '../../components/Header';
import LoadingSpinner from '../../components/LoadingSpinner';
import PleaseSignIn from '../../components/PleaseSignIn';
import { CURRENT_USER, SIGN_OUT } from '../../graphql/user';
import { WORKSPACE_META_INFO } from '../../graphql/workspace';
/**
 * Page dedicated to displaying user settings and allowing users to access other app settings related pages
 *
 * @class SettingsPage
 * @extends {Component<StyledComponentProps>}
 */
class SettingsPage extends Component<StyledComponentProps> {
  public render() {
    return (
      // <IntlProvider locale="pt-br" messages={messages['pt-br']}>
      <React.Fragment>
        {/* <Head>
            <title>Settings | Agrowth</title>
          </Head> */}
        {/* <Header pageTitle="Settings" /> */}
        <Drawer pageTitle="Settings | Agrowth">
          <PleaseSignIn>
            <Grid className={this.props.classes.grid} container alignItems="stretch" spacing={16}>
              <Grid item xs={12} md={4}>
                <Card className={this.props.classes.card}>
                  <Query query={CURRENT_USER}>
                    {({ data, loading, error }) => {
                      if (loading) {
                        return <LoadingSpinner />;
                      }
                      if (error) {
                        return <Typography color="error">{error.message}</Typography>;
                      }
                      if (data && data.getCurrentUser) {
                        const { created, name, email, sessions } = data.getCurrentUser;
                        return (
                          <Fragment>
                            <CardContent>
                              <Typography variant="h5" component="h2">
                                User Information
                              </Typography>
                              <Fragment>
                                <Typography>
                                  <strong>Name:</strong> {name}
                                </Typography>
                                <Typography>
                                  <strong>Email:</strong> {email}
                                </Typography>
                                <Typography>
                                  <strong>Registered on:</strong> {format(created, 'dddd, DD MMMM YYYY')}
                                </Typography>
                                {sessions.length > 0 ? (
                                  <Fragment>
                                    <Typography>
                                      <strong>Sessions:</strong>
                                    </Typography>
                                    <List>
                                      {sessions.map(session => (
                                        <ListItem key={session.id}>
                                          <ListItemText primary={session.name} />
                                        </ListItem>
                                      ))}
                                    </List>
                                  </Fragment>
                                ) : null}
                              </Fragment>
                            </CardContent>
                            <CardActions>
                              <Mutation mutation={SIGN_OUT}>
                                {signOut => {
                                  return (
                                    <Grid container direction="row" justify="flex-end">
                                      <Grid item>
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          onClick={async () => {
                                            await signOut();
                                            document.location = document.location;
                                          }}
                                        >
                                          Sign out
                                        </Button>
                                      </Grid>
                                    </Grid>
                                  );
                                }}
                              </Mutation>
                            </CardActions>
                          </Fragment>
                        );
                      }
                      return <Typography color="error">Something went wrong</Typography>;
                    }}
                  </Query>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card className={this.props.classes.card}>
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      Workspace Information
                    </Typography>
                    <Query query={WORKSPACE_META_INFO}>
                      {({ data, loading, error }) => {
                        if (loading) {
                          return <LoadingSpinner />;
                        }
                        if (error) {
                          return <Typography color="error">{error.message}</Typography>;
                        }
                        if (data && data.getWorkspaceMetaInfo) {
                          const { users, produce, suppliers } = data.getWorkspaceMetaInfo.counts;
                          return (
                            <Fragment>
                              <Typography>
                                <strong>Produce:</strong> {produce}
                              </Typography>
                              <Typography>
                                <strong>Suppliers:</strong> {suppliers}
                              </Typography>
                              <Typography>
                                <strong>Users:</strong> {users}
                              </Typography>
                            </Fragment>
                          );
                        }
                        return <Typography color="error">Something went wrong</Typography>;
                      }}
                    </Query>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card className={this.props.classes.card}>
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      Manage Entries
                    </Typography>
                    <div>
                      <Link href="/settings/manage-produce">
                        <Button data-testid="link-to-manage-produce">Manage Produce</Button>
                      </Link>
                    </div>
                    <div>
                      <Link href="/settings/manage-supplier">
                        <Button data-testid="link-to-manage-supplier">Manage Suppliers</Button>
                      </Link>
                    </div>
                    <div>
                      <Link href="/settings/manage-harvest">
                        <Button data-testid="link-to-manage-harvest">Manage Harvests</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </PleaseSignIn>
        </Drawer>
      </React.Fragment>
      // </IntlProvider>
    );
  }
}

const styles: StyleRules<string> = {
  card: {
    height: '100%',
    minHeight: 100,
    minWidth: 275
    // paddingTop: 32
  },
  grid: {
    marginTop: '2rem',
    padding: '0 1rem'
  }
};

export default withStyles(styles)(SettingsPage);
