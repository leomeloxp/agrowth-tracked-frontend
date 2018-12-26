import CircularProgress from '@material-ui/core/CircularProgress';
import { StyledComponentProps, StyleRules, withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';

class LoadingSpinner extends Component<StyledComponentProps> {
  public render() {
    return (
      <div className={this.props.classes.wrapper}>
        <CircularProgress size={50} />
      </div>
    );
  }
}

const styles: StyleRules<string> = {
  wrapper: {
    alignItems: 'center',
    display: 'grid',
    height: '500px',
    justifyContent: 'center',
    maxHeight: '95vh',
    maxWidth: '95vw',
    width: '100%'
  }
};

export default withStyles(styles)(LoadingSpinner);
