const config = require('../config/permission.json');

exports.getPermission = (url) => {
  const permission = Object.keys(config).find(key=> config[key] === url);
  if(!!permission) return permission;
  throw Error(`Permission: ${url} unregistered permission`);
}