import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  StyledComponentProps,
  Typography,
  withMobileDialog
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { DocumentNode } from 'graphql';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import GoogleMaps from '../components/GoogleMaps';
import { ILocation } from '../graphql/location';
import { ADD_LOCATION_ON_SUPPLIER, LIST_SUPPLIER } from '../graphql/supplier';
import LoadingSpinner from './LoadingSpinner';

export interface ICreateLocationDialogProps extends StyledComponentProps {
  fullScreen?: boolean;
  open: boolean;
  onClose: () => void;
  supplierId: string;
  supplierLocations: [ILocation];
}
export interface ICreateLocationDialogState {
  hotLocation?: {
    name?: string;
    address?: string;
    coordinates?: [number, number];
  };
}

class CreateLocationDialog extends Component<ICreateLocationDialogProps, ICreateLocationDialogState> {
  public state: ICreateLocationDialogState = {
    hotLocation: {
      address: '',
      coordinates: [0, 0],
      name: ''
    }
  };

  public handleInputChange = fieldName => ({ target }) => {
    this.setState(({ hotLocation: prevLocationState }) => ({
      hotLocation: {
        ...prevLocationState,
        [fieldName]: target.value
      }
    }));
  };
  public handlePickLocation = fieldName => target => {
    this.setState(({ hotLocation: prevLocationState }) => ({
      hotLocation: {
        ...prevLocationState,
        [fieldName]: target
      }
    }));
  };

  public render() {
    const { fullScreen } = this.props;
    // change it to pass mapCentre as the user's own location
    const mapCentre =
      this.props.supplierLocations.length > 0 ? this.props.supplierLocations[0].coordinates : [52.8965, 8.4756];

    return (
      <div>
        <Mutation mutation={ADD_LOCATION_ON_SUPPLIER} refetchQueries={[{ query: LIST_SUPPLIER as DocumentNode }]}>
          {(createLocationOnSupplier, { data, loading, error }) => {
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
                fullScreen={fullScreen}
                open={this.props.open}
                onClose={this.props.onClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">New Location</DialogTitle>
                <DialogContent>
                  <DialogContentText>To add a new location complete the details bellow</DialogContentText>
                  <form
                    id="createLocationForSupplier"
                    onSubmit={e => {
                      e.preventDefault();
                      createLocationOnSupplier({
                        variables: {
                          data: { ...this.state.hotLocation },
                          id: this.props.supplierId
                        }
                      });
                      this.props.onClose();
                    }}
                  >
                    <TextField
                      label="Name"
                      id="name"
                      value={this.state.hotLocation.name}
                      onChange={this.handleInputChange('name')}
                      margin="normal"
                      fullWidth
                    />
                    {/* <TextField
                      label="Address"
                      id="address"
                      value={this.state.hotLocation.address}
                      onChange={this.handleInputChange('address')}
                      margin="normal"
                      fullWidth
                    />*/}
                  </form>
                  <div
                  // className ={this.props.classes.mapWrapper}
                  >
                    <Typography variant="subtitle2">Locations</Typography>

                    <GoogleMaps.Map
                      lat={mapCentre[0]}
                      lng={mapCentre[1]}
                      onPickLocation={this.handlePickLocation('coordinates')}
                    >
                      {this.props.supplierLocations.length > 0 &&
                        this.props.supplierLocations.map(({ coordinates, name }) => (
                          <GoogleMaps.Marker
                            key={`Marker_${name}_${coordinates}`}
                            lat={coordinates[0]}
                            lng={coordinates[1]}
                            title={name}
                          />
                        ))}
                    </GoogleMaps.Map>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.props.onClose} color="primary">
                    Cancel
                  </Button>
                  <Button aria-label="Save" type="submit" form="createLocationForSupplier" color="primary">
                    Save
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

export default withMobileDialog<ICreateLocationDialogProps>()(CreateLocationDialog);
