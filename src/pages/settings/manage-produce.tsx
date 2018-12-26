import { Button, Typography } from '@material-ui/core';
import { createStyles, StyledComponentProps, withStyles } from '@material-ui/core/styles';
import Add from '@material-ui/icons/Add';
import { DocumentNode } from 'graphql';
import Head from 'next/head';
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import CreateProduceDialog from '../../components/CreateProduceDialog';
import Drawer from '../../components/Drawer';
// import Header from '../../components/Header';
import LoadingSpinner from '../../components/LoadingSpinner';
import PleaseSignIn from '../../components/PleaseSignIn';
import ProduceCard from '../../components/ProduceCard';
import { IProduce, LIST_PRODUCE } from '../../graphql/produce';

export interface IManageProducePageState {
  produce: unknown | IProduce;
  renderCreateDialog: boolean;
}

class ManageProducePage extends Component<StyledComponentProps, IManageProducePageState> {
  public state = {
    produce: {},
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
        id="manageProduce.title"
        defaultMessage="Manage Produce | Agrowth"
        description="Manage produce page title"
      />
    );
    return (
      <React.Fragment>
        {/* <Head>
          <title>Manage Produce | Agrowth</title>
        </Head>
        <Header pageTitle="Manage Produce" /> */}
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
                    id="button.newProduce"
                    defaultMessage="New Produce"
                    description="Button label to add a new produce"
                  />
                </Button>
                {/* } */}
              </div>
              <Query query={LIST_PRODUCE as DocumentNode}>
                {({ loading, error, data }) => {
                  if (loading) {
                    return <LoadingSpinner data-testid="manage-produce--loading" />;
                  }
                  if (error) {
                    return <Typography data-testid="manage-produce--error">Error occurred: {error.message}</Typography>;
                  }

                  if (data && data.produceList) {
                    const { produceList } = data;
                    return (
                      <div className={classes.produceCardWrapper}>
                        {produceList.map((produce: IProduce) => (
                          <ProduceCard key={produce.id} {...produce} />
                        ))}
                        {this.state.renderCreateDialog && (
                          <CreateProduceDialog open={this.state.renderCreateDialog} onClose={this.closeModal} />
                        )}
                      </div>
                    );
                  }
                  return <Typography data-testid="manage-produce--impossible-case">No data to load.</Typography>;
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
    faButton: {
      bottom: '1rem',
      position: 'absolute',
      right: '1rem'
    },
    produceCardWrapper: {
      alignItems: 'center',
      margin: '0 auto',
      maxWidth: 800,
      padding: 10,
      paddingTop: 0
    },
    root: {
      margin: '0 auto',
      maxWidth: 800
    }
  });

export default withStyles(styles)(ManageProducePage);
