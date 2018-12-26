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
import { ADD_PRODUCE, LIST_PRODUCE } from '../graphql/produce';
import {
  labelCancel,
  labelCategory,
  labelClassification,
  labelDelete,
  labelName,
  labelSave,
  labelUnit,
  labelVariety,
  labelWeightUnit
} from './FormattedMessages/CommomFormattedMessages';
import LoadingSpinner from './LoadingSpinner';
// import { createStyles, withStyles } from '@material-ui/core/styles';

export interface IProduceDialogProps extends StyledComponentProps {
  fullScreen?: boolean;
  open: boolean;
  onClose: () => void;
}
export interface IProduceDialogState {
  hotProduce?: {
    name: string;
    unit?: string;
  };
}

class CreateProduceDialog extends Component<IProduceDialogProps, IProduceDialogState> {
  public state = {
    hotProduce: {
      name: '',
      unit: ''
    }
  };

  public handleInputChange = fieldName => ({ target }) => {
    this.setState(({ hotProduce: prevProduceState }) => ({
      hotProduce: {
        ...prevProduceState,
        [fieldName]: target.value
      }
    }));
  };

  public render() {
    const { fullScreen } = this.props;

    return (
      <div>
        <Mutation mutation={ADD_PRODUCE} refetchQueries={[{ query: LIST_PRODUCE as DocumentNode }]}>
          {(createProduce, { data, loading, error }) => {
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
                    id="produceDialog.title"
                    defaultMessage="New Produce"
                    description="Produce dialog title"
                  />
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    <FormattedMessage
                      id="produceDialog.description"
                      defaultMessage="To add a new produce, complete the details bellow"
                      description="Produce dialog description"
                    />
                  </DialogContentText>
                  <form
                    id="createProduce"
                    onSubmit={e => {
                      e.preventDefault();
                      createProduce({
                        variables: { data: { ...this.state.hotProduce } }
                      });
                      this.props.onClose();
                    }}
                  >
                    <TextField
                      label={labelName}
                      id="produce-name"
                      value={this.state.hotProduce.name}
                      placeholder="Ex.: Morango"
                      onChange={this.handleInputChange('name')}
                      margin="normal"
                      fullWidth
                    />
                    <TextField
                      label={labelVariety}
                      id="produce-variety"
                      // value={this.state.hotProduce.variety}
                      // onChange={this.handleChange('variety')}
                      margin="normal"
                      fullWidth
                    />
                    <TextField
                      label={labelClassification}
                      id="produce-classification"
                      // value={this.state.hotProduce.classification}
                      // onChange={this.handleChange('classification')}
                      margin="normal"
                      fullWidth
                    />
                    <TextField
                      label={labelCategory}
                      id="produce-category"
                      // value={this.state.hotProduce.category}
                      // onChange={this.handleChange('category')}
                      margin="normal"
                      fullWidth
                    />
                    {/* <Publish/> */}
                    <TextField
                      label={labelUnit}
                      id="produce-unit"
                      placeholder="Box"
                      value={this.state.hotProduce.unit}
                      onChange={this.handleInputChange('unit')}
                      margin="normal"
                      fullWidth
                    />
                    <TextField
                      label={labelWeightUnit}
                      id="produce-weightUnit"
                      // value={this.state.hotProduce.weightUnit}
                      // onChange={this.handleChange('weightUnit')}
                      margin="normal"
                      fullWidth
                    />
                  </form>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.props.onClose} color="primary">
                    {labelCancel}
                  </Button>
                  <Button aria-label="Save" type="submit" form="createProduce" color="primary">
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

export default withMobileDialog<IProduceDialogProps>()(CreateProduceDialog);
