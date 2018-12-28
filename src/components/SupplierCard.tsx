import {
  Avatar,
  Button,
  CardActions,
  Collapse,
  IconButton,
  StyledComponentProps,
  TextField,
  Typography,
  withStyles
} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import ExpandMore from '@material-ui/icons/ExpandMore';
import classnames from 'classnames';
import React, { Component, Fragment } from 'react';
import { Mutation } from 'react-apollo';
import CardContentFieldsHolder from '../components/CardContentFieldsHolder';
import GoogleMaps from '../components/GoogleMaps';
import { ISupplier, UPDATE_SUPPLIER } from '../graphql/supplier';
import { gradients } from '../utils/colours';

import ArchiveSupplierDialog from './ArchiveSupplierDialog';
import CardActionButtonHolder from './CardActionButtonHolder';
import CreateLocationDialog from './CreateLocationDialog';
import {
  labelCancel,
  labelDelete,
  labelDocumentId,
  labelDocumentIdType,
  labelEmail,
  labelName,
  labelNickname,
  labelPhoneNumber,
  labelSave,
  labelSurname
} from './FormattedMessages/CommomFormattedMessages';
import LoadingSpinner from './LoadingSpinner';
export interface ISupplierCardProps extends StyledComponentProps, ISupplier {}

export interface ISupplierCardState {
  expanded: boolean;
  isEditing: boolean;
  isEditingLocation: boolean;
  hotSupplier?: {
    name?: string;
    surname?: string;
    nickname?: string;
    idNumber?: string;
    idType?: string;
    phoneNumber?: string;
    email?: string;
  };
  renderArchiveDialog: boolean;
}

class SupplierCard extends Component<ISupplierCardProps, ISupplierCardState> {
  public state = {
    expanded: false,
    hotSupplier: {
      email: this.props.email,
      idNumber: this.props.idNumber,
      idType: this.props.idType,
      name: this.props.name,
      nickname: this.props.nickname,
      phoneNumber: this.props.phoneNumber,
      surname: this.props.surname
    },
    isEditing: false,
    isEditingLocation: false,
    renderArchiveDialog: false
  };

  public handleArchive = () => {
    this.setState({ renderArchiveDialog: true });
  };

  public closeDialog = () => {
    this.setState({ renderArchiveDialog: false });
  };

  public handleChange = fieldName => ({ target }) => {
    this.setState(oldState => {
      return {
        hotSupplier: {
          ...oldState.hotSupplier,
          [fieldName]: target.value
        }
      };
    });
  };

  public handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  public handleExpandEdit = () => {
    this.setState(state => ({ isEditing: !state.isEditing }));
  };

  public handleExpandEditLocation = () => {
    this.setState(state => ({ isEditingLocation: !state.isEditingLocation }));
  };

  public render() {
    const { classes } = this.props;
    if (this.props.active) {
      return (
        <Card className={this.props.classes.supplierCard}>
          {this.state.isEditingLocation && (
            <CreateLocationDialog
              open={this.state.isEditingLocation}
              onClose={this.handleExpandEditLocation}
              supplierId={this.props.id}
              supplierLocations={this.props.locations}
            />
          )}
          {this.state.renderArchiveDialog && (
            <ArchiveSupplierDialog
              open={this.state.renderArchiveDialog}
              onClose={this.closeDialog}
              id={this.props.id}
            />
          )}
          <CardHeader
            avatar={
              <Avatar aria-label="supplier-details" className={classes.avatar}>
                {this.props.nickname ? this.props.nickname[0] : this.props.name[0]}
              </Avatar>
            }
            title={this.props.nickname || [this.props.name, this.props.surname].join(' ')}
            subheader={this.props.phoneNumber}
            action={
              <Fragment>
                <IconButton
                  className={classnames(this.props.classes.expand, {
                    [this.props.classes.expandOpen]: this.state.expanded
                  })}
                  onClick={this.handleExpandClick}
                  aria-expanded={this.state.expanded}
                  aria-label="Show more"
                >
                  <ExpandMore />
                </IconButton>
              </Fragment>
            }
          />
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>
              {this.state.isEditing ? (
                <Mutation mutation={UPDATE_SUPPLIER}>
                  {(editSupplier, { loading, error }) => {
                    // tslint:disable-next-line:no-console
                    // console.log({ data, loading, error });
                    if (loading) {
                      return <LoadingSpinner data-testid="manage-produce--loading" />;
                    }
                    if (error) {
                      return (
                        <Typography data-testid="manage-produce--error">Error occurred: {error.message}</Typography>
                      );
                    }
                    return (
                      <form
                        id="editSupplier"
                        // className={classes.form}
                        onSubmit={e => {
                          e.preventDefault();
                          editSupplier({
                            variables: {
                              data: {
                                ...this.state.hotSupplier
                              },
                              id: this.props.id
                            }
                          });
                        }}
                      >
                        <TextField
                          label={labelName}
                          placeholder="Desmond"
                          value={this.state.hotSupplier.name}
                          onChange={this.handleChange('name')}
                          margin="normal"
                          fullWidth
                        />
                        <TextField
                          label={labelSurname}
                          placeholder="Hume"
                          value={this.state.hotSupplier.surname}
                          onChange={this.handleChange('surname')}
                          margin="normal"
                          fullWidth
                        />
                        <TextField
                          label={labelNickname}
                          placeholder="Des"
                          value={this.state.hotSupplier.nickname}
                          onChange={this.handleChange('nickname')}
                          margin="normal"
                          fullWidth
                        />
                        <TextField
                          label={labelDocumentId}
                          placeholder="CPF or CNPJ"
                          value={this.state.hotSupplier.idNumber}
                          onChange={this.handleChange('idNumber')}
                          margin="normal"
                          fullWidth
                        />
                        <TextField
                          label={labelDocumentIdType}
                          placeholder="CPF or CNPJ"
                          value={this.state.hotSupplier.idType}
                          onChange={this.handleChange('idType')}
                          margin="normal"
                          fullWidth
                        />
                        <TextField
                          label={labelPhoneNumber}
                          placeholder="005535 91234 5678"
                          value={this.state.hotSupplier.phoneNumber}
                          onChange={this.handleChange('phoneNumber')}
                          margin="normal"
                          fullWidth
                        />
                        <TextField
                          label={labelEmail}
                          placeholder="desmond@example.com"
                          value={this.state.hotSupplier.email}
                          onChange={this.handleChange('email')}
                          margin="normal"
                          fullWidth
                        />
                      </form>
                    );
                  }}
                </Mutation>
              ) : (
                <div className={classes.mainContent}>
                  {this.props.locations.length > 0 && (
                    <div className={classes.mapWrapper}>
                      {/* <Typography variant="subtitle2">Locations</Typography> */}
                      <GoogleMaps.Map
                        lat={this.props.locations[0].coordinates[0]}
                        lng={this.props.locations[0].coordinates[1]}
                      >
                        {this.props.locations.map(({ coordinates, name }) => (
                          <GoogleMaps.Marker
                            key={`Marker_${name}_loc_${coordinates}`}
                            lat={coordinates[0]}
                            lng={coordinates[1]}
                            title={name}
                          />
                        ))}
                      </GoogleMaps.Map>
                    </div>
                  )}
                  <div className={classes.details}>
                    <CardContentFieldsHolder
                      fieldName={'Name'}
                      fieldDescription={this.state.hotSupplier.name}
                      title={true}
                    />
                    <CardContentFieldsHolder fieldName={'Surname'} fieldDescription={this.state.hotSupplier.surname} />
                    <CardContentFieldsHolder
                      fieldName={this.state.hotSupplier.idType}
                      fieldDescription={this.state.hotSupplier.idNumber}
                    />
                    <CardContentFieldsHolder
                      fieldName={'Phone number'}
                      fieldDescription={this.state.hotSupplier.phoneNumber}
                    />
                    <CardContentFieldsHolder fieldName={'Email'} fieldDescription={this.state.hotSupplier.email} />
                  </div>
                </div>
              )}
            </CardContent>
            <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {this.state.isEditing ? (
                <CardActionButtonHolder>
                  <Button color="secondary" onClick={this.handleArchive}>
                    {labelDelete}
                  </Button>
                  <Button color="primary" onClick={this.handleExpandEdit} autoFocus>
                    {labelCancel}
                  </Button>
                  <Button
                    // variant="contained"
                    color="primary"
                    aria-label="Save"
                    type="submit"
                    form="editSupplier"
                    onClick={this.handleExpandClick}
                  >
                    {labelSave}
                  </Button>
                </CardActionButtonHolder>
              ) : (
                <CardActionButtonHolder>
                  <Button onClick={this.handleExpandEditLocation} color={'primary'}>
                    {1 > 0 ? 'Edit Locations' : 'Add Locations'}
                  </Button>
                  <Button onClick={this.handleExpandEdit} color={'primary'}>
                    Edit Profile
                  </Button>
                </CardActionButtonHolder>
              )}
            </CardActions>
          </Collapse>
        </Card>
      );
    }
    return null;
  }
}
const styles = theme => ({
  actions: {
    display: 'flex'
  },
  avatar: {
    background: `${gradients.blueOcean}`
  },
  details: {
    padding: '0 1rem'
  },
  expand: {
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8
    },
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  mainContent: {
    [theme.breakpoints.up('sm')]: {
      display: 'grid',
      gridAutoColumns: '2fr 1fr',
      gridAutoFlow: 'column',
      gridTemplateRows: '1fr'
    }
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  supplierCard: {
    marginBottom: 10
  }
});

export default withStyles(styles)(SupplierCard);
