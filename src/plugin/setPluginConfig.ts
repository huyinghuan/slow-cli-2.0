import _configFiledConstant from '../config-filed-constant';
import * as _ from 'lodash';

export default function(config, pluginConfig){
  let configFiledConstant = _configFiledConstant.get();
  config[configFiledConstant.pluginConfigField] = _.extend( config[configFiledConstant.pluginConfigField], pluginConfig)
  return config
}