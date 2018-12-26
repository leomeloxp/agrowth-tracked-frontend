import { Button, Typography } from '@material-ui/core';
import { createStyles, StyledComponentProps, withStyles } from '@material-ui/core/styles';
// import Add from '@material-ui/icons/Add';
import { DocumentNode } from 'graphql';
import Head from 'next/head';
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import CreateSupplierDialog from '../../components/CreateSupplierDialog';
import Drawer from '../../components/Drawer';
// import Header from '../../components/Header';
import LoadingSpinner from '../../components/LoadingSpinner';
import PleaseSignIn from '../../components/PleaseSignIn';
import SupplierCard from '../../components/SupplierCard';
import { ISupplier, LIST_SUPPLIER } from '../../graphql/supplier';

export interface IManageSupplierPageState {
  supplier: unknown | ISupplier;
  renderCreateModal: boolean;
  renderEditModal: boolean;
  // width: number
}

class ManageSupplierPage extends Component<StyledComponentProps, IManageSupplierPageState> {
  public state = {
    renderCreateModal: false,
    renderEditModal: false,
    supplier: {}
    // width: window.innerWidth
  };

  // public componentWillMount():void {
  //   window.addEventListener('resize', this.handleWindowSizeChange);
  // }

  // // remove listener when the component is not mounted anymore
  // public componentWillUnmount() {
  //   window.removeEventListener('resize', this.handleWindowSizeChange);
  // }

  // public handleWindowSizeChange = () => {
  //   this.setState({ width: window.innerWidth });
  // };

  public handleEditButtonClick = (supplier: ISupplier) => {
    this.setState({ supplier, renderEditModal: true });
  };

  public handleCreateButtonClick = () => {
    this.setState({ renderCreateModal: true });
  };

  public closeModal = () => {
    this.setState({
      renderCreateModal: false,
      renderEditModal: false
    });
  };

  public render() {
    // const { width } = this.state;
    // const isMobile = width <= 500;
    const { classes } = this.props;
    const pageTitle = (
      <FormattedMessage
        id="manageSupplier.title"
        defaultMessage="Manage Suppliers | Agrowth"
        description="Manage supplier page title"
      />
    );
    return (
      <React.Fragment>
        {/* <Head>
          <title>Manage Suppliers | Agrowth</title>
        </Head> */}
        {/* <Header pageTitle="Manage Suppliers" /> */}
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
                    id="button.newSupplier"
                    defaultMessage="New Supplier"
                    description="Label of button: new supplier"
                  />
                </Button>
                {/* } */}
              </div>
              <Query query={LIST_SUPPLIER as DocumentNode}>
                {({ loading, error, data }) => {
                  if (loading) {
                    return <LoadingSpinner data-testid="manage-supplier--loading" />;
                  }
                  if (error) {
                    return <Typography data-testid="manage-supplier--error">{error.message}</Typography>;
                  }

                  if (data && data.supplierList.length > 0) {
                    const { supplierList } = data;
                    return (
                      <div className={classes.supplierCardWrapper}>
                        {supplierList.map((supplier: ISupplier) => (
                          <SupplierCard key={supplier.id} {...supplier} />
                        ))}
                      </div>
                    );
                  }
                  return <Typography data-testid="manage-supplier--impossible-case">No data to load</Typography>;
                }}
              </Query>
              {/* Set a different add buttom for diferent screens */}
              {/* { isMobile && */}
              {/* <Button
                  variant="fab"
                  mini
                  color="primary"
                  aria-label="Add"
                  className={classes.faButton}
                  size="medium"
                  onClick={this.handleCreateButtonClick}
                >
                  <Add />
                </Button> */}
              {/* } */}
              {this.state.renderCreateModal && (
                <CreateSupplierDialog open={this.state.renderCreateModal} onClose={this.closeModal} />
              )}
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
    root: {
      margin: '0 auto',
      maxWidth: 800
    },
    supplierCardWrapper: {
      margin: '0 auto',
      maxWidth: 800,
      padding: 10,
      paddingTop: 0
    }
  });

export default withStyles(styles)(ManageSupplierPage);
