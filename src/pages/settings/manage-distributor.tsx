import { Button, Typography } from '@material-ui/core';
import { createStyles, StyledComponentProps, withStyles } from '@material-ui/core/styles';
import Add from '@material-ui/icons/Add';
import { DocumentNode } from 'graphql';
// import Head from 'next/head';
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import CreateDistributorDialog from '../../components/CreateDistributorDialog';
import DistributorCard from '../../components/DistributorCard';
import Drawer from '../../components/Drawer';
// import Header from '../../components/Header';
import LoadingSpinner from '../../components/LoadingSpinner';
import PleaseSignIn from '../../components/PleaseSignIn';
import { IDistributor, LIST_DISTRIBUTOR } from '../../graphql/distributor';

export interface IManageDistributorPageState {
  distributor: unknown | IDistributor;
  renderCreateDialog: boolean;
}

class ManageDistributorPage extends Component<StyledComponentProps, IManageDistributorPageState> {
  public state = {
    distributor: {},
    renderCreateDialog: false
  };

  public handleCreateButtonClick = () => {
    this.setState({ renderCreateDialog: true });
  };

  public closeModal = () => {
    this.setState({
      renderCreateDialog: false
    });
  };

  public render() {
    const { classes } = this.props;
    const pageTitle = (
      <FormattedMessage
        id="manageDistributor.title"
        defaultMessage="Manage Distributor | Agrowth"
        description="Manage distributor page title"
      />
    );
    return (
      <React.Fragment>
        <Drawer pageTitle={pageTitle}>
          <PleaseSignIn>
            <main className={classes.root}>
              <div className={classes.actionBar}>
                {/* Set a different add buttom for diferent screens */}
                {/* { !isMobile && */}
                <Button
                  variant="contained"
                  // mini
                  color="primary"
                  aria-label="Add"
                  className={classes.deskTopButton}
                  size="medium"
                  onClick={this.handleCreateButtonClick}
                >
                  <FormattedMessage
                    id="button.newDistributor"
                    defaultMessage="New Distributor"
                    description="Button label to add a new distributor"
                  />
                </Button>
                {/* } */}
              </div>
              <Query query={LIST_DISTRIBUTOR as DocumentNode}>
                {({ loading, error, data }) => {
                  if (loading) {
                    return <LoadingSpinner data-testid="manage-distributor--loading" />;
                  }
                  if (error) {
                    return (
                      <Typography data-testid="manage-distributor--error">Error occurred: {error.message}</Typography>
                    );
                  }

                  if (data && data.distributorList) {
                    const { distributorList } = data;
                    return (
                      <div className={classes.distributorCardWrapper}>
                        {distributorList.map((distributor: IDistributor) => (
                          // <div>Encontrado</div>
                          <DistributorCard key={distributor.id} {...distributor} />
                        ))}
                        {this.state.renderCreateDialog && (
                          <CreateDistributorDialog open={this.state.renderCreateDialog} onClose={this.closeModal} />
                        )}
                      </div>
                    );
                  }
                  return <Typography data-testid="manage-distributor--impossible-case">No data to load.</Typography>;
                }}
              </Query>
            </main>
          </PleaseSignIn>
        </Drawer>
      </React.Fragment>
    );
  }
}

const styles = theme =>
  createStyles({
    actionBar: {
      overflow: 'auto',
      width: '100%'
    },
    deskTopButton: {
      float: 'right',
      margin: 8
    },
    distributorCardWrapper: {
      alignItems: 'center',
      margin: '0 auto',
      maxWidth: 800,
      padding: 10,
      paddingTop: 0
    },
    faButton: {
      bottom: '1rem',
      position: 'absolute',
      right: '1rem'
    },
    root: {
      margin: '0 auto',
      maxWidth: 800
    }
  });

export default withStyles(styles)(ManageDistributorPage);
