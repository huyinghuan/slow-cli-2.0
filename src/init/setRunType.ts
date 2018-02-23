import _configFiledConstant from '../config-filed-constant';
export default function(value){
  value = value || 'tool';
  _configFiledConstant.setGlobal({
    runType: value
  })
}