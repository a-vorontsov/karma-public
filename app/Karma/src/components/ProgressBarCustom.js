import * as React from 'react';
import { ProgressBar } from 'react-native-paper';
import Colours from "../styles/Colours";

const ProgressBarCustom = () => (
  <ProgressBar progress={0.5} color={Colours.blue} />
);

export default ProgressBarCustom;