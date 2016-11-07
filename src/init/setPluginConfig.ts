import _fileConfig from '../file-config';
import * as _ from 'lodash';
import config from '../file-config';

export default function(config, pluginConfig){
  config[_fileConfig.pluginConfigField] = _.extend( config[_fileConfig.pluginConfigField], pluginConfig)
  return config
}