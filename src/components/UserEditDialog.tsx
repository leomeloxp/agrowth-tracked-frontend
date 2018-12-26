import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import withMobileDialog, { InjectedProps } from '@material-ui/core/withMobileDialog';
import { WithWidth } from '@material-ui/core/withWidth';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import LoadingSpinner from '../components/LoadingSpinner';
import { EDIT_CURRENT_USER, IUser } from '../graphql/user';

class UserEditDialog extends Component<IUserEditDialogProps, IUserEditDialogState> {
  public state = {
    data: {
      email: this.props.user.email,
      name: this.props.user.name,
      password: '',
      passwordConfirm: '',
      passwordCurrent: ''
    },
    showPasswordFields: false
  };

  public togglePasswordChangeFields = () => {
    this.setState(prevState => ({
      showPasswordFields: !prevState.showPasswordFields
    }));
  };

  public render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.handleClose}
        fullScreen={this.props.fullScreen}
        fullWidth={true}
        aria-labelledby="UserEditDialog_Title"
      >
        <DialogTitle id="UserEditDialog_Title">Edit Profile</DialogTitle>
        <DialogContent>
          <div>
            <TextField
              autoComplete="name"
              value={this.state.data.name}
              name="name"
              fullWidth={true}
              id="UserEditDialog_Name"
              label="Name"
              margin="normal"
              required
              type="text"
            />
          </div>
          <div>
            <TextField
              autoComplete="email"
              value={this.state.data.email}
              name="email"
              fullWidth={true}
              id="UserEditDialog_Email"
              label="Email"
              margin="normal"
              required
              type="email"
            />
          </div>
          <div>
            <Button onClick={this.togglePasswordChangeFields}>Change Password</Button>
            {this.state.showPasswordFields && (
              <div>
                <div>
                  <TextField
                    autoComplete="current-password"
                    value={this.state.data.passwordCurrent}
                    name="passwordCurrent"
                    fullWidth={true}
                    id="UserEditDialog_CurrentPassword"
                    label="Current Password"
                    margin="normal"
                    required
                    type="password"
                  />
                </div>
                <div>
                  <TextField
                    autoComplete="new-password"
                    value={this.state.data.password}
                    name="password"
                    fullWidth={true}
                    id="UserEditDialog_NewPassword"
                    label="New Password"
                    margin="normal"
                    required
                    type="password"
                  />
                </div>
                <div>
                  <TextField
                    autoComplete="new-password"
                    value={this.state.data.passwordConfirm}
                    name="passwordConfirm"
                    fullWidth={true}
                    id="UserEditDialog_NewPassword2"
                    label="Confirm New Password"
                    margin="normal"
                    required
                    type="password"
                  />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose}>Cancel</Button>
          <Mutation mutation={EDIT_CURRENT_USER} variables={{ data: this.state }}>
            {(fireMutation, { error, loading }) => {
              if (error) {
                return (
                  <Typography variant="body1" color="error">
                    {error.message}
                  </Typography>
                );
              }
              if (loading) {
                return <LoadingSpinner />;
              }
              return (
                <Button
                  color="primary"
                  onClick={async () => {
                    await fireMutation();
                    this.props.handleClose();
                  }}
                >
                  Submit
                </Button>
              );
            }}
          </Mutation>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withMobileDialog()(UserEditDialog);

export interface IUserEditDialogProps extends InjectedProps, Partial<WithWidth> {
  handleClose: () => void;
  open: boolean;
  user: IUser;
}

export interface IUserEditDialogState {
  showPasswordFields: boolean;
}
