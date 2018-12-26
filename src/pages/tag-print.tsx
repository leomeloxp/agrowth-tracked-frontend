import { createStyles, StyledComponentProps, withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import pt from 'react-intl/locale-data/pt';
import LoadingSpinner from '../components/LoadingSpinner';
import PleaseSignIn from '../components/PleaseSignIn';
import Tag60x105 from '../components/Tags/Tag60x105';
import { IHarvest } from '../graphql/harvest';
import enGb from '../translations/enGb';
import ptBr from '../translations/ptBr';

addLocaleData([...en, ...pt]);
const messages = {
  'en-GB': enGb,
  'pt-BR': ptBr
};

export interface ITagPrintState {
  harvest: IHarvest;
}

class TagPrint extends Component<StyledComponentProps, ITagPrintState> {
  public state = {
    harvest: null
  };

  public componentDidMount = () => {
    if (window && window.opener && window.opener.agrowth) {
      const { harvest } = window.opener.agrowth;
      this.setState({ harvest });
    }
  };

  public render() {
    const { classes } = this.props;

    return !this.state.harvest ? (
      <LoadingSpinner />
    ) : (
      <React.Fragment>
        <PleaseSignIn>
          <IntlProvider locale="pt-BR" messages={messages['pt-BR']}>
            <Tag60x105 harvest={this.state.harvest} />
            {/* <main className={classes.root}>
              <div className={classes.rowStandard}>
                <Tag60x105 produce={this.state.harvest}/>
                <Tag60x105 produce={this.state.harvest}/>
                <Tag60x105 produce={this.state.harvest}/>
              </div>
              <div className={classes.rowStandard}>
                <Tag60x105 produce={this.state.harvest}/>
                <Tag60x105 produce={this.state.harvest}/>
                <Tag60x105 produce={this.state.harvest}/>
              </div>
              <div className={classes.rowRotated}>
                <Tag60x105 produce={this.state.harvest} rotated={true}/> */}
            {/* <Tag60x105 produce={this.state.harvest}/> */}
            {/* <Tag60x105 produce={this.state.harvest}/> */}
            {/* </div>
            </main> */}
          </IntlProvider>
        </PleaseSignIn>
      </React.Fragment>
    );
  }
}

const styles = theme =>
  createStyles({
    root: {
      // background: `${colours.grayDark}`,
      display: 'grid',
      gridGap: '3mm',
      gridTemplateRows: '1fr 1fr 1fr',
      height: '297mm',
      position: 'absolute',
      width: '210mm'
    },
    // rowRotated:{
    // display: 'grid',
    // gridTemplateColumns: '1fr 1fr 1fr',
    // transform: 'rotate(90deg)'
    // },
    rowStandard: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr'
    }
  });

export default withStyles(styles)(TagPrint);
