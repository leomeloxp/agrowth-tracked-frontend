import { Avatar, Button, Collapse, StyledComponentProps, TextField, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { createStyles, withStyles } from '@material-ui/core/styles';
// import Publish from '@material-ui/icons/Publish';
// import Spa from '@material-ui/icons/Spa';
import React, { Component, Fragment } from 'react';
import { Mutation } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { IDistributor, UPDATE_DISTRIBUTOR } from '../graphql/distributor';
import { gradients } from '../utils/colours';
import ArchiveDialog from './ArchiveDialog';
import {
  labelCancel,
  labelDelete,
  labelDocumentId,
  labelEmail,
  labelName,
  labelNickname,
  labelPhoneNumber,
  labelSave,
  labelSurname
} from './FormattedMessages/CommomFormattedMessages';
import LoadingSpinner from './LoadingSpinner';

export interface IDistributorCardProps extends StyledComponentProps, IDistributor {}

export interface IDistributorCardState {
  isEditing: boolean;
  hotDistributor?: {
    name?: string;
    surname?: string;
    nickname?: string;
    idNumber?: string;
    phoneNumber?: string;
    email?: string;
  };
  renderArchiveDialog: boolean;
}
class DistributorItem extends Component<IDistributorCardProps, IDistributorCardState> {
  public state = {
    hotDistributor: {
      email: this.props.email,
      idNumber: this.props.idNumber,
      name: this.props.name,
      nickname: this.props.nickname,
      phoneNumber: this.props.phoneNumber,
      surname: this.props.surname
    },
    isEditing: false,
    renderArchiveDialog: false
  };

  public handleArchive = () => {
    this.setState({ renderArchiveDialog: true });
  };

  public closeDialog = () => {
    this.setState({ renderArchiveDialog: false });
  };

  public handleEditClick = () => {
    this.setState({ isEditing: !this.state.isEditing });
  };

  public handleChange = fieldName => ({ target }) => {
    this.setState(oldState => {
      return {
        hotDistributor: {
          ...oldState.hotDistributor,
          [fieldName]: target.value
        }
      };
    });
  };

  public render() {
    const { classes } = this.props;
    const labelEdit = <FormattedMessage id="button.edit" defaultMessage="Edit" description="Button label to edit" />;
    return (
      <Card className={classes.distributorCard}>
        {this.state.renderArchiveDialog && (
          <ArchiveDialog open={this.state.renderArchiveDialog} onClose={this.closeDialog} id={this.props.id} />
        )}
        <CardHeader
          avatar={
            <Avatar aria-label="distributor-batch" className={classes.avatar}>
              {this.props.name[0]}
            </Avatar>
          }
          title={this.props.nickname || this.props.name}
          subheader={this.props.phoneNumber}
          action={
            <Fragment>
              <Button
                className={classes.expand}
                onClick={this.handleEditClick}
                aria-expanded={this.state.isEditing}
                aria-label={this.state.isEditing ? 'Show less' : 'Show more'}
                color="primary"
              >
                {this.state.isEditing ? labelCancel : labelEdit}
              </Button>
              <Button color="primary" onClick={this.handleArchive} aria-label={'Archive distributor'}>
                {labelDelete}
              </Button>
            </Fragment>
          }
        />
        <Collapse in={this.state.isEditing} timeout="auto" unmountOnExit>
          <div className={classes.nested}>
            <CardContent>
              <Mutation mutation={UPDATE_DISTRIBUTOR}>
                {(editDistributor, { loading, error }) => {
                  if (loading) {
                    return <LoadingSpinner data-testid="manage-distributor--loading" />;
                  }
                  if (error) {
                    return (
                      <Typography data-testid="manage-distributor--error">Error occurred: {error.message}</Typography>
                    );
                  }
                  return (
                    <form
                      id="editDistributor"
                      className={classes.form}
                      onSubmit={e => {
                        e.preventDefault();
                        editDistributor({
                          variables: {
                            data: {
                              ...this.state.hotDistributor
                            },
                            id: this.props.id
                          }
                        });
                      }}
                    >
                      {/* <Spa/> */}
                      <TextField
                        label={labelName}
                        placeholder="Desmond"
                        value={this.state.hotDistributor.name}
                        onChange={this.handleChange('name')}
                        margin="normal"
                        fullWidth
                      />
                      <TextField
                        label={labelSurname}
                        placeholder="Hume"
                        value={this.state.hotDistributor.surname}
                        onChange={this.handleChange('surname')}
                        margin="normal"
                        fullWidth
                      />
                      <TextField
                        label={labelNickname}
                        placeholder="Des"
                        value={this.state.hotDistributor.nickname}
                        onChange={this.handleChange('nickname')}
                        margin="normal"
                        fullWidth
                      />
                      <TextField
                        label={labelDocumentId}
                        placeholder="CPF or CNPJ"
                        value={this.state.hotDistributor.idNumber}
                        onChange={this.handleChange('idNumber')}
                        margin="normal"
                        fullWidth
                      />
                      <TextField
                        label={labelPhoneNumber}
                        placeholder="005535 91234 5678"
                        value={this.state.hotDistributor.phoneNumber}
                        onChange={this.handleChange('phoneNumber')}
                        margin="normal"
                        fullWidth
                      />
                      <TextField
                        label={labelEmail}
                        placeholder="desmond@example.com"
                        value={this.state.hotDistributor.email}
                        onChange={this.handleChange('email')}
                        margin="normal"
                        fullWidth
                      />
                    </form>
                  );
                }}
              </Mutation>
            </CardContent>
            <CardActions className={classes.actions} disableActionSpacing>
              <Button
                // variant='contained'
                color="secondary"
                aria-label="Cancel changes"
                onClick={this.handleEditClick}
              >
                {labelCancel}
              </Button>
              <Button
                // variant="contained"
                color="primary"
                aria-label="Save"
                type="submit"
                form="editDistributor"
                onClick={this.handleEditClick}
                autoFocus
              >
                {labelSave}
              </Button>
            </CardActions>
          </div>
        </Collapse>
      </Card>
    );
  }
}

// When using the theme callback format
const styles = theme =>
  createStyles({
    actions: {
      display: 'flex'
    },
    avatar: {
      background: `${gradients.blueOcean}`
    },
    distributorCard: {
      marginBottom: 10
      // maxWidth: 400
    },
    expand: {
      marginLeft: 'auto',
      [theme.breakpoints.up('sm')]: {
        marginRight: 0
      },
      transform: 'rotate(0deg)',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest
      })
    },
    expandOpen: {
      transform: 'rotate(180deg)'
    },
    media: {
      height: 0,
      paddingTop: '56.25%' // 16:9
    }
  });

export default withStyles(styles)(DistributorItem);
