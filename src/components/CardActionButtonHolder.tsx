import { StyledComponentProps, withStyles } from '@material-ui/core/styles';
import React, { SFC } from 'react';

const CardActionButtonHolderTemplate: SFC<StyledComponentProps> = ({ classes, children }) => (
  <div className={classes.root}>{children}</div>
);

const CardActionButtonHolder = withStyles({
  root: {
    display: 'grid',
    gap: '1rem',
    gridAutoColumns: '1fr',
    gridAutoFlow: 'column',
    gridTemplateRows: '1fr'
  }
})(CardActionButtonHolderTemplate);

export default CardActionButtonHolder;
