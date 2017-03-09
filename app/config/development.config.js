"use strict";

module.exports = function (ROOT_PATH) {
  var config = {
    server: {
      port: 3000,
      hostname: 'localhost',
    },
    database: {
      url: 'mongodb://localhost:27017/opxl3dviewer'
      //url: 'mongodb://appadmin:7ni6GfJuxbkCCN@ds133428.mlab.com:33428/xpert_world_users_staging'
	  },
    BaseApiURL : 'http://localhost:3000/api/',
    root     : ROOT_PATH,
    app      : {
      name : 'Opxl-3dViewer-Srv'
    },
    mailgun: {
      user: process.env.MAILGUN_USER || 'postmaster@mg.xpertuniversity.com',
      password: process.env.MAILGUN_PASSWORD || '41843650e24da538ae858ac9c0be1d24'
    },
    phamtom : {
      retries: 2,
      width       : 1280,
      height      : 800,
      maxRenders: 50
    }
  }
  return config;
}
