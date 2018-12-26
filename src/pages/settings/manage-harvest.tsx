import { Button, Typography } from '@material-ui/core';
import { createStyles, StyledComponentProps, withStyles } from '@material-ui/core/styles';
// import Add from '@material-ui/icons/Add';
import { DocumentNode } from 'graphql';
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
// import en from 'react-intl/locale-data/en';
// import pt from 'react-intl/locale-data/pt';
import CreateHarvestDialog from '../../components/CreateHarvestDialog';
import Drawer from '../../components/Drawer';
import HarvestCard from '../../components/HarvestCard';
// import Header from '../../components/Header';
import LoadingSpinner from '../../components/LoadingSpinner';
import PleaseSignIn from '../../components/PleaseSignIn';
import { IHarvest, LIST_HARVEST } from '../../graphql/harvest';
// import enGb from '../../translations/enGb';
// import ptBr from '../../translations/ptBr';

export interface IManageProducePageState {
  // produce: unknown | IProduce;
  // supplier: unknown | ISupplier;
  renderCreateDialog: boolean;
}

class ManageProducePage extends Component<StyledComponentProps, IManageProducePageState> {
  public state = {
    // produce: {},
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
    const pageTitle = (
      <FormattedMessage
        id="manageHarvest.title"
        defaultMessage="Manage Harvest | Agrowth"
        description="Manage harvest page title"
      />
    );
    const { classes } = this.props;
    return (
      // <IntlProvider locale="pt-br" messages={messages['pt-br']}>
      <React.Fragment>
        {/* <Head>
            <title>Manage Harvest | Agrowth</title>
          </Head> */}
        <Drawer pageTitle={pageTitle}>
          {/* <Header pageTitle="Manage Harvest" /> */}
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
                    id="button.newHarvest"
                    defaultMessage="ADD NEW HARVEST"
                    description="Page title showed on Drawer's head"
                    // values={{ what: 'Tracked' }}
                  />
                </Button>
                {/* } */}
              </div>
              <Query query={LIST_HARVEST as DocumentNode}>
                {({ loading, error, data }) => {
                  if (loading) {
                    return <LoadingSpinner data-testid="manage-supplier--loading" />;
                  }
                  if (error) {
                    return <Typography data-testid="manage-supplier--error">{error.message}</Typography>;
                  }
                  if (data && data.harvestList.length > 0) {
                    const { harvestList } = data;
                    return (
                      <div className={classes.harvestCardWrapper}>
                        {harvestList.map((harvest: IHarvest) => (
                          <HarvestCard key={harvest.id} harvest={harvest} />
                        ))}
                      </div>
                    );
                  }
                  return <Typography data-testid="manage-supplier--impossible-case">No data to load</Typography>;
                }}
              </Query>

              {this.state.renderCreateDialog && (
                <CreateHarvestDialog open={this.state.renderCreateDialog} onClose={this.closeModal} />
              )}
            </main>
          </PleaseSignIn>
        </Drawer>
      </React.Fragment>
      // </IntlProvider>
    );
  }
}

const styles = theme =>
  createStyles({
    actionBar: {
      maxWidth: 800,
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
    harvestCardWrapper: {
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
