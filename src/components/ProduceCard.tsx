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
import { IProduce, UPDATE_PRODUCE } from '../graphql/produce';
import { gradients } from '../utils/colours';
import ArchiveDialog from './ArchiveDialog';
import LoadingSpinner from './LoadingSpinner';

export interface IProduceCardProps extends StyledComponentProps, IProduce {}

export interface IProduceCardState {
  isEditing: boolean;
  hotProduce?: {
    active: boolean;
    name?: string;
    unit?: string;
  };
  renderArchiveDialog: boolean;
}

class ProduceItem extends Component<IProduceCardProps, IProduceCardState> {
  public state = {
    hotProduce: {
      active: this.props.active,
      name: this.props.name,
      unit: this.props.unit
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
        hotProduce: {
          ...oldState.hotProduce,
          [fieldName]: target.value
        }
      };
    });
  };

  public render() {
    const { classes } = this.props;
    const labelEdit = <FormattedMessage id="button.edit" defaultMessage="Edit" description="Button label to edit" />;

    const labelCancel = (
      <FormattedMessage id="button.cancel" defaultMessage="Cancel" description="Button label to cancel" />
    );

    const labelDelete = (
      <FormattedMessage id="button.delete" defaultMessage="Delete" description="Button label to delete" />
    );

    const labelSave = <FormattedMessage id="button.save" defaultMessage="Save" description="Button label to save" />;

    const labelName = <FormattedMessage id="label.name" defaultMessage="Name" description="Label to field name" />;

    const labelVariety = (
      <FormattedMessage id="label.variety" defaultMessage="Variety" description="Label to field varity" />
    );

    const labelUnit = <FormattedMessage id="label.unit" defaultMessage="Unit" description="Label to field unit" />;

    const labelWeightUnit = (
      <FormattedMessage id="label.weightUnit" defaultMessage="Weight unit" description="Label to field weight unit" />
    );

    const labelClassification = (
      <FormattedMessage
        id="label.classification"
        defaultMessage="Classification"
        description="Label to field classification"
      />
    );

    const labelCategory = (
      <FormattedMessage id="label.category" defaultMessage="Category" description="Label to field category" />
    );
    // Pass active to filter in BE
    if (this.props.active) {
      return (
        <Card className={classes.produceCard}>
          {this.state.renderArchiveDialog && (
            <ArchiveDialog open={this.state.renderArchiveDialog} onClose={this.closeDialog} id={this.props.id} />
          )}
          <CardHeader
            avatar={
              <Avatar aria-label="produce-batch" className={classes.avatar}>
                {this.props.name[0]}
              </Avatar>
            }
            title={this.props.name}
            subheader={this.props.unit}
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
                <Button color="primary" onClick={this.handleArchive} aria-label={'Archive produce'}>
                  {labelDelete}
                </Button>
              </Fragment>
            }
          />
          <Collapse in={this.state.isEditing} timeout="auto" unmountOnExit>
            <div className={classes.nested}>
              <CardContent>
                <Mutation mutation={UPDATE_PRODUCE}>
                  {(editProduce, { loading, error }) => {
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
                        id="editProduce"
                        className={classes.form}
                        onSubmit={e => {
                          e.preventDefault();
                          editProduce({
                            variables: {
                              data: {
                                ...this.state.hotProduce
                              },
                              id: this.props.id
                            }
                          });
                        }}
                      >
                        {/* <Spa/> */}
                        <TextField
                          label={labelName}
                          id="produce-name"
                          value={this.state.hotProduce.name}
                          onChange={this.handleChange('name')}
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
                          value={this.state.hotProduce.unit}
                          onChange={this.handleChange('unit')}
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
                  form="editProduce"
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
    return null;
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
    },
    produceCard: {
      marginBottom: 10
      // maxWidth: 400
    }
  });

export default withStyles(styles)(ProduceItem);
