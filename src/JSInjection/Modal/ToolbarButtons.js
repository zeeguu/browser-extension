import * as s from "../../zeeguu-react/src/reader/ArticleReader.sc"
import strings from "../../zeeguu-react/src/i18n/definitions"
import {toggle} from "../../zeeguu-react/src/reader/ArticleReader"
import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import FormHelperText from '@mui/material/FormHelperText';
import colors from "../colors";

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  }
}));


export default function ToolbarButtons({translating, setTranslating, pronouncing, setPronouncing}) {
  return (
    <s.Toolbar style={{"float": "right", "width": "auto", "height": "auto"}}>
       <FormGroup>
          <FormHelperText>{<small>{"Click word(s) to:"}</small>}</FormHelperText>
          <FormControlLabel control={<Android12Switch defaultChecked />} className={translating ? "selected" : ""}
        onClick={(e) => toggle(translating, setTranslating)} 
        label={<small >{"See translation"}</small>}/> 
          <FormControlLabel control={<Android12Switch defaultChecked />} className={pronouncing ? "selected" : ""}
        onClick={(e) => toggle(pronouncing, setPronouncing)}
        label={<small>{"Hear pronunciation"}</small>} /> 
      </FormGroup>
    </s.Toolbar>
  );
}
