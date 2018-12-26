import { createStyles, StyledComponentProps, withStyles } from '@material-ui/core/styles';
import React, { SFC } from 'react';
import { colours } from '../utils/colours';

export interface ICardActionButtonHolderProps extends StyledComponentProps {
  fieldName: string | JSX.Element;
  fieldDescription: string;
  title?: boolean;
}

const CardActionButtonHolder: SFC<ICardActionButtonHolderProps> = ({
  classes,
  fieldName,
  fieldDescription,
  title = false
}) => (
  <div className={classes.root}>
    <span className={classes.fieldName}>{fieldName}</span>
    <br />
    <span className={title ? classes.withEmphasis : classes.fieldDescription}>{fieldDescription}</span>
  </div>
);

const fieldValue = {
  color: `${colours.grayDark}`,
  fontSize: '1rem',
  fontWeight: 400,
  lineHeight: 1.5
};

const styles = theme =>
  createStyles({
    fieldName: {
      color: `${colours.grayLight}`,
      fontSize: '0.7rem',
      fontWeight: 400
    },
    fieldValue: { ...fieldValue },
    root: {
      // display: 'grid',
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
      gap: '1rem',
      gridAutoColumns: '1fr',
      gridAutoFlow: 'column',
      gridTemplateRows: '1fr',
      letterSpacing: '0.01071em',
      paddingTop: '0.2rem'
    },
    withEmphasis: {
      ...fieldValue,
      fontWeight: 500
    }
  });

export default withStyles(styles)(CardActionButtonHolder);
