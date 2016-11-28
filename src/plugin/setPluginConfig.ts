import _configFiledConstant from '../config-filed-constant';
import * as _ from 'lodash';

export default function(config, pluginConfig){
  config[_configFiledConstant.pluginConfigField] = _.extend( config[_configFiledConstant.pluginConfigField], pluginConfig)
  return config
}