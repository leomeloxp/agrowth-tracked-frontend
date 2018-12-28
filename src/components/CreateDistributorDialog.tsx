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
import { ADD_DISTRIBUTOR, LIST_DISTRIBUTOR } from '../graphql/distributor';
import {
  labelCancel,
  labelDocumentId,
  labelDocumentIdType,
  labelEmail,
  labelName,
  labelNickname,
  labelPhoneNumber,
  labelSave,
  labelSurname,
} from './FormattedMessages/CommomFormattedMessages';
import LoadingSpinner from './LoadingSpinner';

export interface IDistributorDialogProps extends StyledComponentProps {
  fullScreen?: boolean;
  open: boolean;
  onClose: () => void;
}
export interface IDistributorDialogState {
  hotDistributor?: {
    name: string;
    surname: string;
    nickname: string;
    idNumber: string;
    // cpf/cnpj
    idType: string;
    phoneNumber: string;
    email: string;
  };
}

class CreateDistributorDialog extends Component<IDistributorDialogProps, IDistributorDialogState> {
  public state = {
    hotDistributor: {
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
    this.setState(({ hotDistributor: prevDistributorState }) => {
      return fieldName === 'name' && this.state.hotDistributor[fieldName] === this.state.hotDistributor.nickname
        ? {
            hotDistributor: {
              ...prevDistributorState,
              [fieldName]: target.value,
              nickname: target.value
            }
          }
        : {
            hotDistributor: {
              ...prevDistributorState,
              [fieldName]: target.value
            }
          };
    });
  };

  public render() {
    const { fullScreen } = this.props;

    return (
      <div>
        <Mutation mutation={ADD_DISTRIBUTOR} refetchQueries={[{ query: LIST_DISTRIBUTOR as DocumentNode }]}>
          {(createDistributor, { data, loading, error }) => {
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
                    id="distributorDialog.title"
                    defaultMessage="New Distributor"
                    description="Distributor dialog title"
                  />
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    <FormattedMessage
                      id="distributorDialog.description"
                      defaultMessage="To add a new distributor, complete the details bellow"
                      description="Distributor dialog description"
                    />
                  </DialogContentText>
                  <form
                    id="createDistributor"
                    onSubmit={e => {
                      e.preventDefault();
                      createDistributor({
                        variables: { data: { ...this.state.hotDistributor } }
                      });
                      this.props.onClose();
                    }}
                  >
                    <TextField
                      label={labelName}
                      id="name"
                      value={this.state.hotDistributor.name}
                      onChange={this.handleInputChange('name')}
                      margin="normal"
                      fullWidth
                    />
                    <TextField
                      label={labelSurname}
                      id="surname"
                      value={this.state.hotDistributor.surname}
                      onChange={this.handleInputChange('surname')}
                      margin="normal"
                      fullWidth
                    />
                    <TextField
                      label={labelNickname}
                      id="nickname"
                      value={this.state.hotDistributor.nickname || this.state.hotDistributor.name}
                      onFocus={e => {
                        e.target.select();
                      }}
                      onChange={this.handleInputChange('nickname')}
                      margin="normal"
                      fullWidth
                    />
                    <TextField
                      label={labelDocumentId}
                      id="id"
                      value={this.state.hotDistributor.idNumber}
                      onChange={this.handleInputChange('idNumber')}
                      margin="normal"
                      fullWidth
                    />
                    <TextField
                      label={labelDocumentIdType}
                      id="id-type"
                      value={this.state.hotDistributor.idType}
                      onChange={this.handleInputChange('idType')}
                      margin="normal"
                      fullWidth
                    />
                    <TextField
                      label={labelPhoneNumber}
                      id="phone"
                      value={this.state.hotDistributor.phoneNumber}
                      onChange={this.handleInputChange('phoneNumber')}
                      margin="normal"
                      fullWidth
                    />
                    <TextField
                      label={labelEmail}
                      id="email"
                      value={this.state.hotDistributor.email}
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
                  <Button aria-label="Save" type="submit" form="createDistributor" color="primary">
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

export default withMobileDialog<IDistributorDialogProps>()(CreateDistributorDialog);
