import {
  // Avatar,
  Button,
  // Collapse,
  Grid,
  Hidden,
  StyledComponentProps,
  // Tabs,
  // TextField,
  Typography
} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import LocalFlorist from '@material-ui/icons/LocalFlorist';
import LocalShipping from '@material-ui/icons/LocalShipping';
import Menu from '@material-ui/icons/Menu';
import People from '@material-ui/icons/People';
// import classnames from 'classnames';
import Link from 'next/link';
import Router, { withRouter, WithRouterProps } from 'next/router';
import NProgress from 'nprogress';
import React, { Component, ComponentType, Fragment } from 'react';
import { Mutation, Query } from 'react-apollo';
import { addLocaleData, FormattedMessage, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import pt from 'react-intl/locale-data/pt';
import AgrowthLogo from '../components/AgrowthLogo';
import LoadingSpinner from '../components/LoadingSpinner';
import PleaseSignIn from '../components/PleaseSignIn';
import { CURRENT_USER, SIGN_IN, SIGN_OUT } from '../graphql/user';
import { WORKSPACE_META_INFO } from '../graphql/workspace';
import enGb from '../translations/enGb';
import ptBr from '../translations/ptBr';
import { colours, gradients } from '../utils/colours';
import '../utils/nprogress-styling.css';
import {
  labelProduce,
  labelProduces,
  labelSupplier,
  labelSuppliers,
  labelUser,
  labelUsers
} from './FormattedMessages/CommomFormattedMessages';

addLocaleData([...en, ...pt]);
const messages = {
  'en-gb': enGb,
  'pt-br': ptBr
};
/**
 * These three event listeners are responsible for the loading bar seen at the top of the app when changing between pages
 */
Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};
Router.onRouteChangeError = () => {
  NProgress.done();
};

/**
 * Pair of objects used to scaffold our navigation, first array is needed to ensure the order of the links is respected when looping.
 * {@see https://stackoverflow.com/a/5525820} for more details.
 *
 * Please ensure you update both lists whenever you make changes.
 */

const manageProduce = (
  <FormattedMessage
    id="drawerMenu.produce"
    defaultMessage="Manage Produce"
    description="Drawer menu item: manage produce"
  />
);

const manageHarvest = (
  <FormattedMessage
    id="drawerMenu.generateTags"
    defaultMessage="Generate Tags"
    description="Drawer menu item: generate tags"
  />
);

const manageSupplier = (
  <FormattedMessage
    id="drawerMenu.supplier"
    defaultMessage="Manage Supplier"
    description="Drawer menu item: manage supplier"
  />
);

const manageDistributor = (
  <FormattedMessage
    id="drawerMenu.distributor"
    defaultMessage="Manage Distributor"
    description="Drawer menu item: manage distributor"
  />
);

const ajustes = (
  <FormattedMessage id="drawerMenu.settings" defaultMessage="Settings" description="Drawer menu item: settings" />
);
const navLinkKeys = ['/', '/settings'];
// const navLinkIcons = [<Home/>, ]
const navLinks = {
  '/': { href: '/', label: 'Home' },
  '/settings': { href: '/settings', label: ajustes }
};
/**
 * Two new lists to identify a submenu
 */
const subNavLinkKeys = [
  '/settings/manage-harvest',
  '/settings/manage-supplier',
  '/settings/manage-produce',
  '/settings/manage-distributor'
];
// const navLinkIcons = [<Home/>, ]
const subNavLinks = {
  '/settings/manage-harvest': { href: '/settings/manage-harvest', label: manageHarvest },
  '/settings/manage-supplier': { href: '/settings/manage-supplier', label: manageSupplier },
  // tslint:disable-next-line:object-literal-sort-keys
  '/settings/manage-produce': { href: '/settings/manage-produce', label: manageProduce },
  '/settings/manage-distributor': { href: '/settings/manage-distributor', label: manageDistributor }
};

export interface IResponsiveDrawerProps extends StyledComponentProps {
  container?: any;
  pageTitle: string | JSX.Element;
  theme?: any;
}

export interface IResponsiveDrawerState {
  mobileOpen: boolean;
}
/**
 * Renders the header of all application, used in every page of the app so far.
 *
 * @class Header
 * @extends {(Component<IHeaderProps & WithRouterProps<Record<string, string | string[]>> & StyledComponentProps, IHeaderState>)}
 */

class ResponsiveDrawer extends Component<
  IResponsiveDrawerProps & WithRouterProps<Record<string, string | string[]>> & StyledComponentProps,
  IResponsiveDrawerState
> {
  public state = {
    mobileOpen: false
  };

  public handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  public render() {
    const { classes, theme } = this.props;
    const pathname = typeof window !== 'undefined' ? window.location.pathname : navLinkKeys[0];

    /**
     * Renders a tab component compatible with Next's Link component (for SEO friendly navigation links)
     *
     * @returns
     * @memberof Header
     */
    const LinkItem = ({ href, label, ...props }) => {
      // console.log(href, pathname);
      return (
        <Link passHref href={href}>
          <ListItem button component="a" selected={pathname === href}>
            <ListItemText primary={label} />
          </ListItem>
        </Link>
      );
    };

    const drawer = (
      <div>
        <PleaseSignIn>
          <div className={classes.avatarMugShot}>
            <Query query={CURRENT_USER}>
              {({ data, loading, error }) => {
                if (loading) {
                  return <LoadingSpinner />;
                }
                if (error) {
                  return <Typography color="error">{error.message}</Typography>;
                }
                if (data && data.getCurrentUser) {
                  // const { created, name, email, sessions } = data.getCurrentUser;
                  const { name } = data.getCurrentUser;
                  return (
                    <div className={classes.avatarTitleWrapper}>
                      <Typography className={classes.avatarTitle} variant="h6" component="h3">
                        {name}
                      </Typography>
                    </div>
                  );
                }
                return <Typography color="error">Something went wrong</Typography>;
              }}
            </Query>
            <Query query={WORKSPACE_META_INFO}>
              {({ data, loading, error }) => {
                if (loading) {
                  return <LoadingSpinner />;
                }
                if (error) {
                  return <Typography color="error">{error.message}</Typography>;
                }
                if (data && data.getWorkspaceMetaInfo) {
                  const { users, produce, suppliers } = data.getWorkspaceMetaInfo.counts;
                  return (
                    <Fragment>
                      <div className={classes.accountDetails}>
                        <div className={classes.accountDetailsCell}>
                          <div className={classes.accountDetailsIcon}>
                            <LocalFlorist />
                          </div>
                          <div className={classes.accountDetailsDetail}>
                            <Typography className={classes.avatarNumber}>{produce}</Typography>
                            <Typography className={classes.avatarText}>
                              {produce > 1 ? labelProduces : labelProduce}
                            </Typography>
                          </div>
                        </div>
                        <div className={classes.accountDetailsCell}>
                          <div className={classes.accountDetailsIcon}>
                            <LocalShipping />
                          </div>
                          <div className={classes.accountDetailsDetail}>
                            <Typography className={classes.avatarNumber}>{suppliers}</Typography>
                            <Typography className={classes.avatarText}>
                              {suppliers > 1 ? labelSuppliers : labelSupplier}
                            </Typography>
                          </div>
                        </div>
                        <div className={classes.accountDetailsCell}>
                          <div className={classes.accountDetailsIcon}>
                            <People />
                          </div>
                          <div className={classes.accountDetailsDetail}>
                            <Typography className={classes.avatarNumber}>{users}</Typography>
                            <Typography className={classes.avatarText}>{users > 1 ? labelUsers : labelUser}</Typography>
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  );
                }
                return <Typography color="error">Something went wrong</Typography>;
              }}
            </Query>
          </div>
        </PleaseSignIn>
        <Divider />
        {/* Main menu */}
        <List>
          {navLinkKeys.map((key, i) => (
            <LinkItem key={key} href={navLinks[key].href} label={navLinks[key].label} value={i} />
          ))}
          <ListItem button component="a" disabled>
            <ListItemText primary={'Caderno de Campo'} />
          </ListItem>
        </List>
        <Divider />
        {/* Sub-menu */}
        <List>
          {subNavLinkKeys.map((key, i) => (
            <LinkItem key={key} href={subNavLinks[key].href} label={subNavLinks[key].label} value={i} />
          ))}
        </List>
        <Divider />
        {/* Drawer Footer */}
        <div className={classes.drawerFooter}>
          <Divider />
          <AgrowthLogo logoSize={'small'} />
        </div>
      </div>
    );

    return (
      <IntlProvider locale="pt-br" messages={messages['pt-br']}>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerToggle}
                className={classes.menuButton}
              >
                <Menu />
              </IconButton>
              <Typography className={classes.grow} noWrap variant="h6">
                {this.props.pageTitle}
              </Typography>
              <div>
                <Mutation mutation={SIGN_OUT}>
                  {signOut => {
                    return (
                      <Grid container direction="row" justify="flex-end">
                        <Grid item>
                          <Button
                            // variant=""
                            // className={classes.signOutButton}
                            mini
                            // color="primary"
                            onClick={async () => {
                              await signOut();
                              document.location = document.location;
                            }}
                          >
                            <FormattedMessage
                              id="button.signOut"
                              defaultMessage="Sign out"
                              description="Label of button: sign out"
                            />
                          </Button>
                        </Grid>
                      </Grid>
                    );
                  }}
                </Mutation>
              </div>
            </Toolbar>
          </AppBar>
          <nav className={classes.drawer}>
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden smUp implementation="css">
              <Drawer
                container={this.props.container}
                variant="temporary"
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={this.state.mobileOpen}
                onClose={this.handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper
                }}
                ModalProps={{
                  keepMounted: true // Better open performance on mobile.
                }}
              >
                {drawer}
              </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
              <Drawer
                classes={{
                  paper: classes.drawerPaper
                }}
                variant="permanent"
                open
              >
                {drawer}
              </Drawer>
            </Hidden>
          </nav>
          <div className={classes.content}>
            <div className={classes.toolbar} />
            {this.props.children}
          </div>
        </div>
      </IntlProvider>
    );
  }
}

const drawerWidth = 240;
const mugShotHeight = 200;

const styles = theme =>
  createStyles({
    accountDetails: {
      bottom: '-58%',
      display: 'grid',
      gridAutoColumns: '1fr',
      gridAutoFlow: 'column',
      gridTemplateRows: '1fr',
      margin: 'auto',
      position: 'relative',
      textAlign: 'center'
    },
    accountDetailsCell: {
      display: 'grid',
      gridAutoColumns: '0.3fr 1fr',
      gridAutoFlow: 'column',
      gridTemplateRows: '1fr',
      margin: 'auto',
      textAlign: 'center'
    },
    accountDetailsDetails: {
      display: 'grid',
      gridAutoRows: '2.5fr 1fr',
      margin: 'auto',
      textAlign: 'center'
    },
    accountDetailsIcon: {
      color: 'white',
      margin: 'auto'
    },
    appBar: {
      background: `${gradients.blueOcean}`,
      // color: 'white',
      marginLeft: drawerWidth,
      [theme.breakpoints.up('sm')]: {
        background: 'white',
        // color: `${colours.black}`,
        width: `calc(100% - ${drawerWidth}px)`
      }
    },
    avatarMugShot: {
      background: `${gradients.blueOcean}`,
      height: mugShotHeight
    },
    avatarNumber: {
      color: 'white',
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: '1.5rem',
      margin: 'auto'
    },
    avatarText: {
      color: 'white',
      fontSize: '.7rem',
      margin: 'auto'
    },
    avatarTitle: {
      background: '#25252591',
      color: 'white',
      margin: 'auto',
      textTransform: 'uppercase'
    },
    avatarTitleWrapper: {
      margin: 'auto',
      position: 'relative',
      textAlign: 'center',
      // right: '50%',
      top: '40%'
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing.unit * 0
      // width: '95%',
      // position: 'relative',
      // top: '3rem',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        flexShrink: 0,
        width: drawerWidth
      }
    },
    drawerFooter: {
      alignItems: 'center',
      bottom: 0,
      margin: '0 auto',
      padding: '.1rem',
      position: 'fixed',
      textAlign: 'center',
      width: drawerWidth
    },
    drawerPaper: {
      color: 'white',
      width: drawerWidth
    },
    grow: {
      color: 'white',
      flexGrow: 1,
      [theme.breakpoints.up('sm')]: {
        color: `${colours.black}`,
        width: `calc(100% - ${drawerWidth}px)`
      }
    },
    menuButton: {
      marginRight: 20,
      [theme.breakpoints.up('sm')]: {
        display: 'none'
      }
    },
    root: {
      display: 'flex'
    },
    // signOutButton:{
    //   color: `${colours.black}`,
    //   [theme.breakpoints.up('sm')]: {
    //     color: 'black'
    //   }
    // },
    toolbar: theme.mixins.toolbar,
    userInfo: {
      bottom: '-62%',
      display: 'grid',
      gridAutoColumns: '1fr',
      gridAutoFlow: 'column',
      gridTemplateRows: '1fr',
      margin: 'auto',
      position: 'relative',
      textAlign: 'center'
    },
    userInfoDescription: {
      bottom: '-62%',
      display: 'grid',
      gridAutoColumns: '1fr',
      gridAutoFlow: 'column',
      gridTemplateRows: '1fr',
      margin: 'auto',
      position: 'relative',
      textAlign: 'center'
    }
  });

const DrawerWithStyles = withStyles(styles, { withTheme: true })(ResponsiveDrawer);

const HeaderWithRouter: ComponentType<IResponsiveDrawerProps> = withRouter(DrawerWithStyles);

export default HeaderWithRouter;
