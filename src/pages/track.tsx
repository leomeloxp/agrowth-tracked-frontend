import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { StyledComponentProps, StyleRulesCallback, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Head from 'next/head';
import React from 'react';
import { Query } from 'react-apollo';
import { addLocaleData, FormattedMessage, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import pt from 'react-intl/locale-data/pt';
import Drawer from '../components/Drawer';
// import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import { ISupplier, LIST_SUPPLIER } from '../graphql/supplier';
import enGb from '../translations/enGb';
import ptBr from '../translations/ptBr';

addLocaleData([...en, ...pt]);
const messages = {
  'en-gb': enGb,
  'pt-br': ptBr
};
export interface ITrackPageState {
  id: string;
  idSubmitted: boolean;
  loaded: boolean;
  supplier?: ISupplier;
}

/**
 * Page responsible for rendering tracking queries.
 *
 * @class TrackPage
 * @extends {React.Component<StyledComponentProps, ITrackPageState>}
 */
class TrackPage extends React.Component<StyledComponentProps, ITrackPageState> {
  public state: ITrackPageState = {
    id: '',
    idSubmitted: false,
    loaded: false
  };

  /**
   * Creates an instance of TrackPage.
   *
   * @param {*} StyledComponentProps
   * @memberof TrackPage
   */
  public constructor(props: StyledComponentProps) {
    super(props);
  }

  /**
   * Look for query params in the URL and act on them
   *
   * @fires setState
   * @inheritdoc
   * @memberof TrackPage
   */
  public componentDidMount = () => {
    if (typeof document !== 'undefined') {
      // tslint:disable-next-line:no-console
      const params = new URLSearchParams(document.location.search.substring(1));
      const id = params.get('id');
      if (id) {
        this.setState({ id, idSubmitted: true });
      }
      this.setState({ loaded: true });
    }
  };

  /**
   * Generic function to handle form field change events
   *
   * @fires setState
   * @memberof TrackPage
   */
  public handleChange = (fieldName: string) => ({ target }): void => {
    this.setState({
      id: target.value
    });
  };

  /**
   * Handles the tracking query form submission.
   *
   * @fires document#location (refreshes the page)
   * @todo investigate using NextJS `withRouter` and programmatic navigation
   * @returns void
   * @memberof TrackPage
   */
  public handleTrackSubmission = (): void => {
    const params = new URLSearchParams(document.location.search.substring(1));
    params.set('id', this.state.id);
    document.location.search = `&${params.toString()}`;
  };

  /**
   * When no tracking query info is provided on page load, we will call this method to
   * render the "form" (so far it's not an actual form) so that queries can be made after
   * the page has loaded.
   *
   * @todo Make this a proper form to improve accessibility
   * @returns JSX.Element
   * @memberof TrackPage
   */
  public renderTrackingForm = () => (
    <div>
      <Typography variant="h2">
        <FormattedMessage
          id="track.description"
          defaultMessage="Track a harvest:"
          description="Description before the button for tracking"
          // values={{ what: 'Tracked' }}
        />
      </Typography>
      <div>
        <TextField
          label="Tracking Code"
          placeholder="12345abcde"
          value={this.state.id}
          onChange={this.handleChange('id')}
          margin="normal"
        />
        <Button color="primary" variant="contained" onClick={this.handleTrackSubmission}>
          <FormattedMessage
            id="button.tracking1"
            defaultMessage="Track"
            description="Label for the button to track a harvest"
            // values={{ what: 'Tracked' }}
          />
        </Button>
      </div>
    </div>
  );

  /**
   * When a query for tracking info has been made (either on page load or using the query form)
   * This method will be called to handle the query and render the resulting logic
   *
   * @returns JSX.Element
   * @memberof TrackPage
   */
  public renderTrackingInfo = () => (
    <Query query={LIST_SUPPLIER}>
      {({ loading, error, data }) => {
        if (loading) {
          return <LoadingSpinner />;
        }
        if (error) {
          return <Typography data-testid="manage-supplier--error">{error.message}</Typography>;
        }

        if (data && data.supplierList) {
          const supplier = data.supplierList.filter(sup => sup.id === this.state.id)[0];
          if (supplier) {
            return (
              <div>
                <Typography variant="subtitle2">
                  <FormattedMessage id="label.name" defaultMessage="Name" description="Label of field: name" />
                </Typography>
                <Typography gutterBottom>{supplier.name}</Typography>
                <Typography variant="subtitle2">
                  <FormattedMessage
                    id="label.phoneNumber"
                    defaultMessage="Phone Number"
                    description="Label of field: phone number"
                  />
                </Typography>
                <Typography gutterBottom>{supplier.phoneNumber}</Typography>
                <Typography variant="subtitle2">
                  <FormattedMessage id="label.email" defaultMessage="Email" description="Label of field: email" />
                </Typography>
                <Typography gutterBottom>{supplier.email}</Typography>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    this.setState({ idSubmitted: false, id: '' });
                  }}
                >
                  <FormattedMessage
                    id="button.newTracking"
                    defaultMessage="New tracking"
                    description="Label of button: new tracking"
                  />
                </Button>
              </div>
            );
          }

          return (
            <div>
              <Typography>
                <FormattedMessage
                  id="label.noTrackingId"
                  defaultMessage="No tracking info for id: "
                  description="Label of button: new tracking"
                />
                <strong>{this.state.id}</strong>
              </Typography>
              <Typography variant="caption">Maybe try:</Typography>
              <List>
                {data.supplierList.map(sup => (
                  <ListItem key={sup.id}>
                    <ListItemText primary={`ID: ${sup.id}`} secondary={`for: ${sup.name}`} />
                  </ListItem>
                ))}
              </List>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  this.setState({ idSubmitted: false, id: '' });
                }}
              >
                <FormattedMessage
                  id="button.newTracking"
                  defaultMessage="New tracking"
                  description="Label of button: new tracking"
                />
              </Button>
            </div>
          );
        }
        return (
          <div>
            <Typography>No supplier data found on server</Typography>
          </div>
        );
      }}
    </Query>
  );

  /**
   * React render method
   *
   * @returns JSX.Element
   * @memberof TrackPage
   */
  public render() {
    return (
      <IntlProvider locale="pt-br" messages={messages['pt-br']}>
        <React.Fragment>
          {/* <Head>
            <title>Track | Agrowth</title>
            {this.state.idSubmitted ? (
              // Ensure Google won't index pages with the query params for a given harvest in it
              <meta name="robots" content="noindex, nofollow" />
            ) : null}
          </Head> */}
          {/* <Header pageTitle="Track" /> */}
          <Drawer pageTitle={'Track'}>
            {this.state.idSubmitted ? (
              // Ensure Google won't index pages with the query params for a given harvest in it
              <meta name="robots" content="noindex, nofollow" />
            ) : null}
            <div className={this.props.classes.root}>
              {this.state.loaded ? (
                !this.state.id || !this.state.idSubmitted ? (
                  this.renderTrackingForm()
                ) : (
                  this.renderTrackingInfo()
                )
              ) : (
                <CircularProgress size={50} />
              )}
            </div>
          </Drawer>
        </React.Fragment>
      </IntlProvider>
    );
  }
}

/**
 * Defines the styling options for the {@link TrackPage}. Used as a property
 * for the {@link withStyles} HOC.
 *
 * @param theme {Theme}
 * @returns Record<ClassKey, CSSProperties>
 */
const styles: StyleRulesCallback = theme => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    height: '70vh',
    justifyContent: 'center',
    paddingTop: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(TrackPage);
