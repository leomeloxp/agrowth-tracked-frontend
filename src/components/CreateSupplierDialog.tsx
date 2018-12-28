import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  StyledComponentProps,
  withMobileDialog
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { DocumentNode } from 'graphql';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { ADD_SUPPLIER, LIST_SUPPLIER } from '../graphql/supplier';
import { labelCancel, labelDelete, labelName, labelSave } from './FormattedMessages/CommomFormattedMessages';
import LoadingSpinner from './LoadingSpinner';

export interface ISupplierDialogProps extends StyledComponentProps {
  fullScreen?: boolean;
  open: boolean;
  onClose: () => void;
}
export interface ISupplierDialogState {
  hotSupplier?: {
    name: string;
    surname: string;
    nickname?: string;
    idNumber: string;
    // cpf/cnpj
    idType: string;
    phoneNumber?: string;
    email?: string;
  };
}

class CreateSupplierDialog extends Component<ISupplierDialogProps, ISupplierDialogState> {
  public state = {
    hotSupplier: {
      email: '',
      idNumber: '',
      idType: '',
      name: '',
      nickname: '',
      phoneNumber: '',
      surname: ''
    }
  };

  public handleInputChange = fieldName => ({ target }) => {
    this.setState(({ hotSupplier: prevSupplierState }) => ({
      hotSupplier: {
        ...prevSupplierState,
        [fieldName]: target.value
      }
    }));
  };
  public handleMaps = () => {
    alert('Select your locations...');
  };

  public render() {
    const { fullScreen } = this.props;

    return (
      <div>
        <Mutation mutation={ADD_SUPPLIER} refetchQueries={[{ query: LIST_SUPPLIER as DocumentNode }]}>
          {(createSupplier, { data, loading, error }) => {
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
                <DialogTitle id="form-dialog-title">
                  <FormattedMessage
                    id="supplierDialog.title"
                    defaultMessage="New Supplier"
                    description="Supplier dialog title"
                  />
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    <FormattedMessage
                      id="supplierDialog.description"
                      defaultMessage="To add a new supplier, complete the details bellow"
                      description="Supplier dialog description"
                    />
                  </DialogContentText>
                  <form
                    id="createSupplier"
                    onSubmit={e => {
                      e.preventDefault();
                      createSupplier({
                        variables: { data: { ...this.state.hotSupplier } }
                      });
                      this.props.onClose();
                    }}
                  >
                    <TextField
                      label={labelName}
                      id="name"
                      value={this.state.hotSupplier.name}
                      onChange={this.handleInputChange('name')}
                      margin="normal"
                      fullWidth
                    />
                    <TextField
                      label="Surname"
                      id="surname"
                      value={this.state.hotSupplier.surname}
                      onChange={this.handleInputChange('surname')}
                      margin="normal"
                      fullWidth
                    />
                    <TextField
                      label="Nickname"
                      id="nickname"
                      value={this.state.hotSupplier.nickname || this.state.hotSupplier.name}
                      onFocus={e => {
                        e.target.select();
                      }}
                      onChange={this.handleInputChange('nickname')}
                      margin="normal"
                      fullWidth
                    />
                    <TextField
                      label="Document ID number"
                      id="id"
                      value={this.state.hotSupplier.idNumber}
                      onChange={this.handleInputChange('idNumber')}
                      margin="normal"
                      fullWidth
                    />
                    <TextField
                      label="Document ID type"
                      id="id-type"
                      value={this.state.hotSupplier.idType}
                      onChange={this.handleInputChange('idType')}
                      margin="normal"
                      fullWidth
                    />
                    <TextField
                      label="Phone Number"
                      id="phone"
                      value={this.state.hotSupplier.phoneNumber}
                      onChange={this.handleInputChange('phoneNumber')}
                      margin="normal"
                      fullWidth
                    />
                    <TextField
                      label="Email"
                      id="email"
                      value={this.state.hotSupplier.email}
                      onChange={this.handleInputChange('email')}
                      margin="normal"
                      fullWidth
                    />
                  </form>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.props.onClose} color="primary">
                    {labelCancel}
                  </Button>
                  <Button aria-label="Save" type="submit" form="createSupplier" color="primary">
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

export default withMobileDialog<ISupplierDialogProps>()(CreateSupplierDialog);
