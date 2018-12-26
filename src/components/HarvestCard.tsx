import {
  Avatar,
  Button,
  CardActions,
  Collapse,
  createStyles,
  IconButton,
  StyledComponentProps,
  // TextField,
  // Typography,
  withStyles
} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
// import CardMedia from '@material-ui/core/CardMedia';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Print from '@material-ui/icons/Print';
import classnames from 'classnames';
import React, { Component } from 'react';
// import { Mutation } from 'react-apollo';
// import { FormattedMessage } from 'react-intl';
import CardContentFieldsHolder from '../components/CardContentFieldsHolder';
import GoogleMaps from '../components/GoogleMaps';
import { IDistributor } from '../graphql/distributor';
import { IHarvest } from '../graphql/harvest';
import { ILocation } from '../graphql/location';
import { IProduce } from '../graphql/produce';
import { ISupplier } from '../graphql/supplier';
import { gradients } from '../utils/colours';
import {
  labelBatch,
  labelDistributedBy,
  labelDocumentId,
  labelEdit,
  labelEmissionDate,
  labelLocation,
  labelPrintTag,
  labelProduce,
  labelSupplier
} from './FormattedMessages/CommomFormattedMessages';

export interface IHarvestCardProps extends StyledComponentProps {
  harvest: IHarvest;
}

export interface IHarvestCardState {
  expanded: boolean;
  isEditing: boolean;
  hotHarvest?: {
    emissionDate?: string;
    distributor?: IDistributor;
    location?: ILocation;
    quantity?: number;
    produce?: IProduce;
    supplier?: ISupplier;
    uuid?: string;
  };
  // renderArchiveDialog: boolean
}

class HarvestCard extends Component<IHarvestCardProps, IHarvestCardState> {
  public state = {
    expanded: false,
    hotHarvest: {
      distributor: this.props.harvest.distributor[0],
      emissionDate: this.props.harvest.emissionDate,
      location: this.props.harvest.location,
      produce: this.props.harvest.produce,
      quantity: this.props.harvest.quantity,
      supplier: this.props.harvest.supplier,
      uuid: this.props.harvest.uuid
    },
    isEditing: false
    // renderArchiveDialog: false
  };
  public handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  public componentDidMount = () => {
    if (window) {
      (window as any).agrowth = {
        harvest: this.props.harvest
      };
    }
  };

  public render() {
    const { classes } = this.props;
    const harvest = this.state.hotHarvest;
    const supplierName = [harvest.supplier.name, harvest.supplier.surname].join(' ');
    const harvestLocation = harvest.location || { name: 'Not registered', coordinates: [-22.4676, -46.1502] };
    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="harvest-batch" className={classes.avatar}>
              {harvest.produce.name[0]}
            </Avatar>
          }
          action={
            <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: this.state.expanded
              })}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="Show more"
            >
              <ExpandMore />
            </IconButton>
          }
          title={harvest.produce.name}
          subheader={harvest.emissionDate}
        />
        {/* for mvp1 we can include a farm as a embeded doc to suppliers   
        {this.props.farm.image 
        ? <CardMedia
            className={classes.media}
            image= {this.props.farm.image}
            title={this.props.farm.name}
          />
        : null}
        */}

        {/* MVP1: include descrition to produce 
        <CardContent>
          { this.props.produce.description && 
            <Typography component="p">{this.props.produce.description}</Typography>
          }
        </CardContent>
        */}

        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent className={classes.mainContent}>
            <div className={classes.mapWrapper}>
              {/* <Typography variant="subtitle2">Locations</Typography> */}
              <GoogleMaps.Map lat={harvestLocation.coordinates[0]} lng={harvestLocation.coordinates[1]}>
                <GoogleMaps.Marker
                  lat={harvestLocation.coordinates[0]}
                  lng={harvestLocation.coordinates[1]}
                  title={harvestLocation.name}
                />
              </GoogleMaps.Map>
            </div>
            <div className={classes.details}>
              <CardContentFieldsHolder fieldName={labelProduce} fieldDescription={harvest.produce.name} title={true} />
              <CardContentFieldsHolder fieldName={labelSupplier} fieldDescription={supplierName} />
              <CardContentFieldsHolder fieldName={labelDocumentId} fieldDescription={harvest.supplier.idNumber} />
              <CardContentFieldsHolder fieldName={labelDistributedBy} fieldDescription={harvest.distributor.name} />
              <CardContentFieldsHolder fieldName={labelLocation} fieldDescription={harvestLocation.name} />
              <CardContentFieldsHolder fieldName={labelEmissionDate} fieldDescription={harvest.emissionDate} />
              <CardContentFieldsHolder fieldName={labelBatch} fieldDescription={harvest.uuid} />
            </div>
          </CardContent>

          <CardActions className={classes.actions} disableActionSpacing>
            <Button
              color="primary"
              aria-label="edit-harvest"
              // onClick={this.handleExpandClick}
            >
              {labelEdit}
            </Button>
            <Button
              variant="contained"
              color="primary"
              aria-label="print-harvest-tag"
              href="/tag-print"
              target="_blank"
              // onClick={this.handleExpandClick}
            >
              <Print className={classes.leftIcon} />
              {labelPrintTag}
            </Button>
          </CardActions>
        </Collapse>
      </Card>
    );
  }
}

const styles = theme =>
  createStyles({
    actions: {
      display: 'flex',
      float: 'right'
    },
    avatar: {
      background: `${gradients.blueOcean}`
    },
    card: {
      marginBottom: '0.5rem'
    },
    details: {
      padding: '0 1rem'
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
    leftIcon: {
      marginRight: theme.spacing.unit
    },
    mainContent: {
      [theme.breakpoints.up('sm')]: {
        display: 'grid',
        gridAutoColumns: '2fr 1fr',
        gridAutoFlow: 'column',
        gridTemplateRows: '1fr'
      }
    },
    // mapWrapper:{
    //   maxWidth:
    // },
    media: {
      // background: `${gradients.orange}`,
      height: 0,
      paddingTop: '56.25%' // 16:9
    }
  });

export default withStyles(styles)(HarvestCard);
