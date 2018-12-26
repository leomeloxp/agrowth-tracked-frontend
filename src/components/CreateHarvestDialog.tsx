import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Typography,
  withMobileDialog
} from '@material-ui/core';
import { createStyles, StyledComponentProps, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { DocumentNode } from 'graphql';
// It makes us able to edit date format. Useful? Best solution?
// import DateTimePicker from 'material-ui-datetimepicker';
import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import LoadingSpinner from '../components/LoadingSpinner';
import { IDistributor, LIST_DISTRIBUTOR } from '../graphql/distributor';
import { ADD_HARVEST, LIST_HARVEST } from '../graphql/harvest';
import { ILocation } from '../graphql/location';
import { IProduce, LIST_PRODUCE } from '../graphql/produce';
import { GET_SUPPLIER, ISupplier, LIST_SUPPLIER } from '../graphql/supplier';
import CreateProduceDialog from './CreateProduceDialog';
import CreateSupplierDialog from './CreateSupplierDialog';
import {
  labelAddNewOne,
  labelCancel,
  labelDistributor,
  labelEmissionDate,
  labelLocation,
  labelProduce,
  labelQuantity,
  labelSave,
  labelSupplier
} from './FormattedMessages/CommomFormattedMessages';

const buttonsValues = [1, 10, 50, 100, 500, 1000];
const today = new Date();
let day = String(today.getDate());
// In case day has only one character
if (day.length === 1) {
  const zero = '0';
  day = zero + day;
}
const dateList = [today.getFullYear(), today.getMonth() + 1, day];
const todayString = dateList.join('-');

class CreateHarvestDialog extends Component<IHarvestDialogProps, IHarvestDialogState> {
  public state: IHarvestDialogState = {
    distributorId: '',
    hotHarvest: {
      emissionDate: todayString,
      quantity: 0
    },
    locationId: '',
    locationName: '',
    produceId: '',
    renderCreateProduceModal: false,
    renderCreateSupplierModal: false,
    supplierId: ''
  };

  public handleInputChange = fieldName => ({ target }) => {
    this.setState(({ hotHarvest: prevHarvestState }) => {
      let value;
      // Because target.value is always a string and quantity must be a number, we handle it in a special way here
      if (fieldName === 'quantity') {
        // Ensure only integers can be part of the value of the quantity field
        target.value.replace(/[^0-9]*/, '');
        // Set the value variable to the integer value coming from the event
        value = parseInt(target.value, 10);
      } else {
        // For all other fields we assign the value field directly here
        value = target.value;
      }
      return {
        hotHarvest: {
          ...prevHarvestState,
          [fieldName]: value
        }
      };
    });
  };

  // passes fieldId to state or opens the create new field dialog (field: supplier, produce)
  public handleSpecialFieldsChange = fieldName => ({ target }) => {
    this.setState(({ hotHarvest: prevHarvestState }) => {
      return target.value
        ? {
            ...prevHarvestState,
            [fieldName]: target.value
          }
        : fieldName === 'supplierId'
          ? { renderCreateSupplierModal: true }
          : fieldName === 'produceId' && { renderCreateProduceModal: true }
            ? { renderCreateProduceModal: true }
            : fieldName === 'distributorId' && { renderCreateProduceModal: true };
    });
  };
  // Add up a new value to the previous one, then set it to state
  public handleIncrement = value => () => {
    this.setState(({ hotHarvest: prevHarvestState }) => {
      const prevValue = prevHarvestState.quantity || 0;
      return {
        hotHarvest: {
          ...prevHarvestState,
          quantity: prevValue + value
        }
      };
    });
  };

  public closeModal = () => {
    this.setState({
      renderCreateProduceModal: false,
      renderCreateSupplierModal: false
    });
  };

  public render() {
    const { fullScreen } = this.props;
    const { classes } = this.props;

    return (
      <div>
        {/* Create new supplier dialog is rendered if the users wants to select a new one */}
        {this.state.renderCreateSupplierModal && (
          <CreateSupplierDialog open={this.state.renderCreateSupplierModal} onClose={this.closeModal} />
        )}
        {/* Create new produce dialog is rendered if the users wants to select a new one */}
        {this.state.renderCreateProduceModal && (
          <CreateProduceDialog open={this.state.renderCreateProduceModal} onClose={this.closeModal} />
        )}
        <Mutation mutation={ADD_HARVEST} refetchQueries={[{ query: LIST_HARVEST as DocumentNode }]}>
          {(createHarvest, { data, loading, error }) => {
            // tslint:disable-next-line:no-console
            console.log({ data, loading, error });
            if (error) {
              return (
                <p>
                  <strong>An error ocurred: ${error}</strong>
                </p>
              );
            }
            if (loading) {
              return <LoadingSpinner />;
            }
            return (
              <Dialog
                // className={this.props.classes.harvestDialog}
                fullScreen={fullScreen}
                open={this.props.open}
                onClose={this.props.onClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">
                  <FormattedMessage
                    id="harvestDialog.title"
                    defaultMessage="New Harvest"
                    description="New Harvest dialog title"
                  />
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    <FormattedMessage
                      id="harvestDialog.description"
                      defaultMessage="To generate a new tag, complete the information on the harvest as follows."
                      description="New Harvest dialog description"
                    />
                  </DialogContentText>
                  <form
                    id="createHarvest"
                    onSubmit={e => {
                      e.preventDefault();
                      createHarvest({
                        variables: {
                          data: { ...this.state.hotHarvest },
                          distributorId: this.state.distributorId,
                          locationId: this.state.locationId,
                          produceId: this.state.produceId,
                          supplierId: this.state.supplierId
                        }
                      });
                      this.props.onClose();
                    }}
                  >
                    <Query query={LIST_SUPPLIER as DocumentNode}>
                      {({ loading: queryLoading, error: queryError, data: queryData }) => {
                        if (queryLoading) {
                          return <LoadingSpinner data-testid="manage-supplier--loading" />;
                        }
                        if (queryError) {
                          return <Typography data-testid="manage-supplier--error">{queryError.message}</Typography>;
                        }
                        if (queryData && queryData.supplierList.length > 0) {
                          const { supplierList } = queryData;
                          return (
                            <TextField
                              id="filled-select-supplier"
                              select
                              label={labelSupplier}
                              className={classes.textField}
                              value={this.state.supplierId}
                              onChange={this.handleSpecialFieldsChange('supplierId')}
                              SelectProps={{
                                MenuProps: {
                                  className: classes.menu
                                }
                              }}
                              helperText={
                                <FormattedMessage
                                  id="harvestDialog.supplier-helperText"
                                  defaultMessage="Please select supplier or create a new one"
                                  description="Helper Text to select a supplier for a new harvest"
                                />
                              }
                              margin="normal"
                              fullWidth
                              // variant="filled"
                            >
                              <MenuItem key={'create-new-supplier'} value={''}>
                                <em>{labelAddNewOne}</em>
                              </MenuItem>
                              {supplierList.map((supplier: ISupplier) => (
                                <MenuItem key={supplier.id} value={supplier.id}>
                                  {supplier.nickname} ({supplier.name})
                                </MenuItem>
                              ))}
                            </TextField>
                          );
                        }
                      }}
                    </Query>

                    {this.state.supplierId && (
                      // Need to pass ID to list locations
                      <Query query={GET_SUPPLIER as DocumentNode} variables={{ id: this.state.supplierId }}>
                        {({ loading: queryLoading, error: queryError, data: queryData }) => {
                          if (queryLoading) {
                            return <LoadingSpinner data-testid="manage-harvest-location-loading" />;
                          }
                          if (queryError) {
                            return (
                              <Typography data-testid="manage-harvest-location--error">{queryError.message}</Typography>
                            );
                          }
                          // && queryData.getSupplier.length > 0)
                          if (queryData && queryData.getSupplier) {
                            const { getSupplier } = queryData;
                            return (
                              <TextField
                                id="filled-select-location"
                                select
                                label={labelLocation}
                                className={classes.textField}
                                value={this.state.locationId}
                                onChange={this.handleSpecialFieldsChange('locationId')}
                                SelectProps={{
                                  MenuProps: {
                                    className: classes.menu
                                  }
                                }}
                                helperText={
                                  <FormattedMessage
                                    id="harvestDialog.location-helperText"
                                    defaultMessage="Please select a locaiton"
                                    description="Helper Text to select a location for a new harvest"
                                  />
                                }
                                margin="normal"
                                fullWidth
                                // variant="filled"
                              >
                                {getSupplier.locations.map((location: ILocation) => (
                                  <MenuItem key={location.id} value={location.id}>
                                    {location.name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            );
                          }
                        }}
                      </Query>
                    )}

                    <Query query={LIST_PRODUCE as DocumentNode}>
                      {({ loading: queryLoading, error: queryError, data: queryData }) => {
                        if (queryLoading) {
                          return <LoadingSpinner data-testid="manage-produce--loading" />;
                        }
                        if (queryError) {
                          return <Typography data-testid="manage-produce--error">{queryError.message}</Typography>;
                        }
                        if (queryData && queryData.produceList.length > 0) {
                          const { produceList } = queryData;
                          return (
                            <TextField
                              id="filled-select-produce"
                              select
                              label={labelProduce}
                              className={classes.textField}
                              value={this.state.produceId}
                              onChange={this.handleSpecialFieldsChange('produceId')}
                              SelectProps={{
                                MenuProps: {
                                  className: classes.menu
                                }
                              }}
                              helperText={
                                <FormattedMessage
                                  id="harvestDialog.produce-helperText"
                                  defaultMessage="Please select a produce or create a new one"
                                  description="Helper Text to select a produce for a new harvest"
                                />
                              }
                              margin="normal"
                              fullWidth
                              // variant="filled"
                            >
                              <MenuItem key={'create-new-produce'} value={''}>
                                <em>{labelAddNewOne}</em>
                              </MenuItem>
                              {produceList.map((produce: IProduce) => (
                                <MenuItem key={produce.id} value={produce.id}>
                                  {produce.name}
                                </MenuItem>
                              ))}
                            </TextField>
                          );
                        }
                      }}
                    </Query>
                    <TextField
                      id="filled-select-quantity"
                      label={labelQuantity}
                      className={classes.textField}
                      SelectProps={{
                        MenuProps: {
                          className: classes.menu
                        }
                      }}
                      helperText={
                        <FormattedMessage
                          id="harvestDialog.quantity-helperText"
                          defaultMessage="How many units? (This is the number of tags that will be printed out)"
                          description="Helper text to enter the total number of tags to be generated"
                        />
                      }
                      type="number"
                      value={this.state.hotHarvest.quantity}
                      onChange={this.handleInputChange('quantity')}
                      margin="normal"
                      fullWidth
                    />
                    <div>
                      {buttonsValues.map(option => (
                        <Button className={classes.addValueButton} key={option} onClick={this.handleIncrement(option)}>
                          {option}
                        </Button>
                      ))}
                    </div>
                    <TextField
                      id="filled-select-emission-date"
                      label={labelEmissionDate}
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true
                      }}
                      // defaultValue="2017-05-24"
                      helperText={
                        <FormattedMessage
                          id="harvestDialog.emissionDate-helperText"
                          defaultMessage="Insert a date or select from calendar"
                          description="Helper text to enter the emission date of the tags"
                        />
                      }
                      type="date"
                      value={this.state.hotHarvest.emissionDate}
                      onChange={this.handleInputChange('emissionDate')}
                      margin="normal"
                      fullWidth
                    />
                    <Query query={LIST_DISTRIBUTOR as DocumentNode}>
                      {({ loading: queryLoading, error: queryError, data: queryData }) => {
                        if (queryLoading) {
                          return <LoadingSpinner data-testid="list-distributor--loading" />;
                        }
                        if (queryError) {
                          return <Typography data-testid="list-distributor--error">{queryError.message}</Typography>;
                        }
                        if (queryData /* && queryData.distributorList.length > 0 */) {
                          // Commented out as it breaks the code if no Distributor exists, TODO fix this
                          const { distributorList } = queryData;
                          return (
                            <TextField
                              id="filled-select-distributor"
                              select
                              label={labelDistributor}
                              className={classes.textField}
                              helperText={
                                <FormattedMessage
                                  id="harvestDialog.distributor-helperText"
                                  defaultMessage="Who's the person distribuing the product?"
                                  description="Helper text to select the distributor of the produce"
                                />
                              }
                              // type="string"
                              value={this.state.distributorId}
                              onChange={this.handleSpecialFieldsChange('distributorId')}
                              margin="normal"
                              fullWidth
                            >
                              <MenuItem key={'create-new-distributor'} value={''}>
                                <em>{labelAddNewOne}</em>
                              </MenuItem>
                              {distributorList.map((distributor: IDistributor) => (
                                <MenuItem key={distributor.id} value={distributor.id}>
                                  {distributor.name}
                                </MenuItem>
                              ))}
                            </TextField>
                          );
                        }
                      }}
                    </Query>
                  </form>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.props.onClose} color="primary">
                    {labelCancel}
                  </Button>
                  <Button aria-label="Save" type="submit" form="createHarvest" color="primary">
                    {labelSave}
                  </Button>
                </DialogActions>
              </Dialog>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

const styles = theme =>
  createStyles({
    addValueButton: {
      minWidth: 35,
      padding: '8px 10px'
    },
    produceCardWrapper: {
      margin: '0 auto',
      maxWidth: 800
    }
  });

const dialogWithStyles = withStyles(styles)(CreateHarvestDialog);
export default withMobileDialog<IHarvestDialogProps>()(dialogWithStyles);

export interface IHarvestDialogProps extends StyledComponentProps {
  fullScreen?: boolean;
  open: boolean;
  onClose: () => void;
}
export interface IHarvestDialogState {
  hotHarvest?: {
    emissionDate?: string;
    quantity?: number;
  };
  distributorId?: string;
  locationName?: string;
  locationId?: string;
  produceId?: string;
  renderCreateSupplierModal?: boolean;
  renderCreateProduceModal?: boolean;
  supplierId?: string;
}
