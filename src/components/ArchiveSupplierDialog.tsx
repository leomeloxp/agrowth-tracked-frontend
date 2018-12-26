import { Button, StyledComponentProps, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DocumentNode } from 'graphql';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { ARCHIVE_SUPPLIER, LIST_SUPPLIER } from '../graphql/supplier';
import LoadingSpinner from './LoadingSpinner';

export interface IArchiveDialogProps extends StyledComponentProps {
  id: string;
  onClose: () => void;
  open: boolean;
  // ARCHIVE_OBJ: any;
  // LIST_OBJ: any
}

class ArchiveSupplierDialog extends Component<IArchiveDialogProps> {
  public render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="archive-element"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <FormattedMessage
            id="archiveDialog.title"
            defaultMessage="Do you really want to archive?"
            description="Archive dialog title description"
          />
        </DialogTitle>
        <DialogActions>
          <Mutation mutation={ARCHIVE_SUPPLIER} refetchQueries={[{ query: LIST_SUPPLIER as DocumentNode }]}>
            {(produceID, { loading, error }) => {
              if (loading) {
                return <LoadingSpinner data-testid="manage-produce--loading" />;
              }
              if (error) {
                return <Typography data-testid="manage-produce--error">Error occurred: {error.message}</Typography>;
              }
              return (
                <div>
                  <Button
                    onClick={async e => {
                      e.preventDefault();
                      await produceID({
                        variables: {
                          id: this.props.id
                        }
                      });
                      // this.props.onClose();
                    }}
                    color="primary"
                  >
                    Archive
                  </Button>
                  <Button onClick={this.props.onClose} color="primary" autoFocus>
                    Cancel
                  </Button>
                </div>
              );
            }}
          </Mutation>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ArchiveSupplierDialog;
