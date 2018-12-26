import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { StyledComponentProps, withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Close as CloseIcon, Menu as MenuIcon } from '@material-ui/icons';
import Link from 'next/link';
import Router, { withRouter, WithRouterProps } from 'next/router';
import NProgress from 'nprogress';
import { Component, ComponentType } from 'react';
import { gradients } from '../utils/colours';
import '../utils/nprogress-styling.css';
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
const navLinkKeys = ['/', '/settings'];
const navLinks = {
  '/': { href: '/', label: 'Home' },
  '/settings': { href: '/settings', label: 'Settings' }
};

/**
 * Renders the header of all application, used in every page of the app so far.
 *
 * @class Header
 * @extends {(Component<IHeaderProps & WithRouterProps<Record<string, string | string[]>> & StyledComponentProps, IHeaderState>)}
 */
class Header extends Component<
  IHeaderProps & WithRouterProps<Record<string, string | string[]>> & StyledComponentProps,
  IHeaderState
> {
  public state = {
    drawerOpen: false
  };

  /**
   * Closes the mobile navigation drawer
   *
   * @memberof Header
   */
  public setDrawerClosed = () => {
    this.setState({ drawerOpen: false });
  };

  /**
   * Opens the mobile navigation drawer
   *
   * @memberof Header
   */
  public setDrawerOpen = () => {
    this.setState({ drawerOpen: true });
  };

  /**
   * Renders the mobile navigation drawer component
   *
   * @memberof Header
   */
  public renderDrawer = () =>
    navLinkKeys.map(key => (
      <Link passHref href={navLinks[key].href} key={key}>
        <ListItem button component="a" key={key}>
          <ListItemText primary={navLinks[key].label} />
        </ListItem>
      </Link>
    ));

  /**
   * Main render method of the class
   *
   * @returns
   * @memberof Header
   */
  public render() {
    const { pageTitle, classes } = this.props;

    /**
     * Renders a tab component compatible with Next's Link component (for SEO friendly navigation links)
     *
     * @returns
     * @memberof Header
     */
    const LinkTab = ({ href, label, ...props }) => {
      return (
        <Link passHref href={href}>
          <Tab value={href.replace('/', '')} label={label} />
        </Link>
      );
    };

    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Typography className={classes.grow} variant="h6" color="inherit">
              {pageTitle}
            </Typography>
            <Hidden smUp>
              <IconButton onClick={this.setDrawerOpen}>
                <MenuIcon color="action" />
              </IconButton>
              <Drawer
                ModalProps={{
                  onBackdropClick: this.setDrawerClosed,
                  onEscapeKeyDown: this.setDrawerClosed
                }}
                onClose={this.setDrawerClosed}
                open={this.state.drawerOpen}
                anchor="right"
              >
                <List>
                  <IconButton onClick={this.setDrawerClosed}>
                    <CloseIcon />
                  </IconButton>
                  {this.renderDrawer()}
                </List>
              </Drawer>
            </Hidden>
          </Toolbar>
          <Hidden xsDown>
            <Tabs value={typeof window !== 'undefined' ? navLinkKeys.indexOf(window.location.pathname) : 0}>
              {navLinkKeys.map((key, i) => (
                <LinkTab key={key} href={navLinks[key].href} label={navLinks[key].label} value={i} />
              ))}
            </Tabs>
          </Hidden>
        </AppBar>
      </div>
    );
  }
}

const styles = {
  appBar: {
    background: `${gradients.blueOcean}`
  },
  grow: {
    flexGrow: 1
  },
  root: {
    flexGrow: 1
  }
};

// Add Style props to our header component
const HeaderWithStyles = withStyles(styles)(Header);

// Add Next Router props to our header component and override its type so that it removes the errors we have
const HeaderWithRouter: ComponentType<IHeaderProps> = withRouter(HeaderWithStyles);

export default HeaderWithRouter;

export interface IHeaderProps {
  pageTitle: string;
}

export interface IHeaderState {
  drawerOpen: boolean;
}
