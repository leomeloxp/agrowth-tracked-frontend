import { Typography } from '@material-ui/core';
import { createStyles, StyledComponentProps, withStyles } from '@material-ui/core/styles';
import QRcode from 'qrcode.react';
import React, { Component } from 'react';
import { IHarvest } from '../../graphql/harvest';
import { colours } from '../../utils/colours';
import AgrowthLogo from '../AgrowthLogo';
import {
  labelDistributedBy,
  labelDocumentId,
  labelEmissionDate,
  labelExpires,
  labelNetWeight,
  labelTrackingCode
} from '../FormattedMessages/CommomFormattedMessages';

export interface ITagOneState {
  title: string;
}
export interface ITagOneProps extends StyledComponentProps {
  harvest: IHarvest;
  rotated?: boolean;
}

class TagOne extends Component<ITagOneProps, ITagOneState> {
  public render() {
    const { classes, harvest } = this.props;

    return (
      <React.Fragment>
        {/* <PleaseSignIn> */}
        {/* <IntlProvider locale="pt-BR" messages={messages['pt-BR']}> */}
        {/* <main className={classes.root}> */}
        <div className={this.props.rotated ? classes.tagRotated : classes.tag}>
          <div className={classes.details}>
            <Typography className={classes.title} variant="h6">
              {harvest.produce.name.toUpperCase()}
            </Typography>
            <div className={classes.batchDetails}>
              <div>
                <Typography className={classes.caption} variant="caption">
                  {labelNetWeight}
                </Typography>
                <Typography className={classes.nmText} variant="h6">
                  900G
                </Typography>
              </div>
              <div>
                <Typography className={classes.caption} variant="caption">
                  {labelEmissionDate}
                </Typography>
                <Typography className={classes.nmText} variant="subtitle1">
                  {harvest.emissionDate}
                </Typography>
              </div>
              <div>
                <Typography className={classes.caption} variant="caption">
                  {labelExpires}
                </Typography>
                <Typography className={classes.nmText} variant="subtitle1">
                  {harvest.emissionDate}
                </Typography>
              </div>
            </div>
            <Typography className={classes.subtitle} variant="subtitle1">
              {harvest.supplier.name.toUpperCase()} {harvest.supplier.surname.toUpperCase()}
            </Typography>
            <div className={classes.contactDetails}>
              {/* <div>
                <Typography className={classes.caption} variant="caption">
                  {labelSupplier}
                </Typography>
                <Typography className={classes.smText} variant="subtitle2">
                  David Melo
                </Typography>
              </div> */}
              <div>
                <Typography className={classes.caption} variant="caption">
                  {labelDocumentId}{' '}
                </Typography>
                <Typography className={classes.smText}>{harvest.supplier.idNumber}</Typography>
              </div>
            </div>
            <div className={classes.address}>
              <Typography className={classes.smText} variant="caption">
                {harvest.location.name}
              </Typography>
              <Typography className={classes.smText} variant="caption">
                {harvest.location.address}
              </Typography>
            </div>
          </div>
          <div className={classes.qrCode}>
            <Typography className={classes.caption} variant="caption">
              {labelTrackingCode}: {harvest.uuid}
            </Typography>
            <QRcode value={`https://agrowth.app/tracked?qr=${harvest.uuid}`} size={190} />
          </div>
          <div className={classes.footer}>
            <div className={classes.distributor}>
              <Typography className={classes.caption} variant="caption">
                {labelDistributedBy}
              </Typography>
              <Typography className={classes.smText} variant="caption">
                {harvest.distributor.name} {harvest.distributor.surname}
              </Typography>
            </div>
            <div className={classes.brandWrapper}>
              <div className={classes.brand}>
                <Typography className={classes.poweredBy} variant="caption">
                  Powered by
                </Typography>
                <AgrowthLogo logoSize={'tiny'} />
              </div>
              <Typography className={classes.caption} variant="caption">
                www.agrowth.app
              </Typography>
            </div>
          </div>
        </div>
        {/* </main> */}
        {/* </IntlProvider> */}
        {/* // </PleaseSignIn> */}
      </React.Fragment>
    );
  }
}

const styles = theme =>
  createStyles({
    batchDetails: {
      display: 'grid',
      gridTemplateColumns: '.7fr 1fr 1fr'
    },
    brand: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr'
    },
    brandWrapper: {
      // bottom: '1%',
      // position: 'absolute',
      // right: '2%',
      // width: 150
    },
    caption: {
      fontSize: '0.55rem',
      lineHeight: '0.6rem'
    },
    contactDetails: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      padding: '0.2rem 0'
    },
    details: {
      padding: 5
    },
    distributor: {
      padding: '11px 0 0 5px'
    },
    footer: {
      // bottom: '1%',
      display: 'grid',
      gridTemplateColumns: '1.05fr 1fr',
      // position: 'absolute',
      width: '100%'
    },
    nmText: {
      fontSize: '0.8rem',
      lineHeight: '1rem'
    },
    poweredBy: {
      fontSize: '0.55rem',
      marginTop: '7px',
      padding: 1
    },
    qrCode: {
      border: 'black',
      borderRadius: 2,
      // borderStyle: 'solid',
      borderWidth: 1,
      margin: 'auto',
      padding: 5
    },
    smText: {
      fontSize: '0.6rem',
      lineHeight: '0.75rem'
    },
    subtitle: {
      fontSize: '0.9rem',
      lineHeight: '1rem',
      padding: '0.2rem 0'
    },
    tag: {
      background: `${colours.white}`,
      border: 'black',
      borderRadius: 2,
      borderStyle: 'solid',
      borderWidth: 1,
      display: 'grid',
      gridAutoRows: '0.8fr 1.5fr 0.2fr',
      height: '105mm',
      // margin: 'auto',
      padding: 5,
      // position: 'relative',
      // top: '10%',
      width: '60mm'
    },
    tagRotated: {
      background: `${colours.white}`,
      border: 'black',
      borderRadius: 2,
      borderStyle: 'solid',
      borderWidth: 1,
      display: 'grid',
      gridAutoRows: '0.8fr 1.5fr 0.2fr',
      height: '105mm',
      left: '12%',
      margin: 'auto',
      padding: 5,
      position: 'absolute',
      top: '-5%',
      transform: 'rotate(90deg)',
      width: '60mm'
    },
    title: {
      fontSize: '0.95rem',
      // lineHeight: '1.2rem',
      padding: '0.1rem',
      textAlign: 'center'
    }
  });

export default withStyles(styles)(TagOne);
