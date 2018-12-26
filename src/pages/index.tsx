import Button from '@material-ui/core/Button';
import { StyledComponentProps, StyleRulesCallback, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
// import Head from 'next/head';
// import detectBrowserLanguage from 'detect-browser-language';
import Link from 'next/link';
import React from 'react';
import { addLocaleData, FormattedMessage, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import pt from 'react-intl/locale-data/pt';
import AgrowthLogo from '../components/AgrowthLogo';
import Drawer from '../components/Drawer';
// import Header from '../components/Header';
import enGb from '../translations/enGb';
import ptBr from '../translations/ptBr';
import { gradients } from '../utils/colours';

addLocaleData([...en, ...pt]);
const messages = {
  'en-gb': enGb,
  'pt-br': ptBr
};
// tslint:disable-next-line:no-console
// console.log();
// const language = navigator.language.split(/[-_]/)[0];  // language without region code
// const language = navigator.language;  // language without region code

/**
 * Home page of our app Agrowth Tracked
 *
 * @class Index
 * @extends {React.Component<StyledComponentProps>}
 */
class Index extends React.Component<StyledComponentProps> {
  // public detectBrowserLanguage();

  public render() {
    const pageTitle = (
      <FormattedMessage
        id="app.title"
        defaultMessage="Agrowth {what}"
        description="Page title showed on Drawer's head"
        values={{ what: 'Tracked' }}
      />
    );
    return (
      <IntlProvider locale="pt-br" messages={messages['pt-br']}>
        <React.Fragment>
          {/* <Head>
            <title>Agrowth</title>
          </Head>
          <Header pageTitle="Agrowth Tracked" /> */}
          {/* "Agrowth Tracked"   */}
          <Drawer pageTitle={pageTitle}>
            <div className={this.props.classes.root}>
              <Typography variant="h2" gutterBottom>
                <AgrowthLogo logoSize={'big'} />
                <span className={this.props.classes.agrowthSub}>
                  {' '}
                  <FormattedMessage
                    id="app.subfeature"
                    defaultMessage="Rastreamento"
                    description="Agrowth Subfeature: Tracked"
                    // values={{ what: 'Tracked' }}
                  />
                </span>
                {/* <div> {detectBrowserLanguage()}</div> */}
              </Typography>
              <Link href="/track" prefetch>
                <Button className={this.props.classes.mainAction} color="primary" variant="contained">
                  {/* Track a harvest */}
                  <FormattedMessage
                    id="button.tracking"
                    defaultMessage="Track a {what}"
                    description="Welcome header on app main page"
                    values={{ what: 'colheita' }}
                  />
                </Button>
              </Link>
            </div>
          </Drawer>
        </React.Fragment>
      </IntlProvider>
    );
  }
}

const styles: StyleRulesCallback = theme => ({
  agrowthSub: {
    bottom: '1.3rem',
    fontSize: '2.5rem',
    position: 'relative'
  },
  mainAction: {
    background: `${gradients.blueOcean}`
  },
  root: {
    paddingTop: theme.spacing.unit * 20,
    textAlign: 'center'
  }
});

export default withStyles(styles)(Index);
