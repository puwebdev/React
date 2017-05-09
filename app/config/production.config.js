"use strict";

module.exports = function (ROOT_PATH) {
  var config = {
    server: {
      port: process.env.PORT,
      hostname: process.env.HOSTNAME,
    },
    database: {
      url: process.env.MONGOLAB_URI
    },
    BaseApiURL : 'http://'+ (process.env.HOSTNAME) + (process.env.PORT!="80" ?  ":" + process.env.PORT : "") + '/api/',
    root     : ROOT_PATH,
    app      : {
      name : 'Opxl-3dViewer'
    },
    mailgun: {
      user: process.env.MAILGUN_USER || 'postmaster@mg.xpertuniversity.com',
      password: process.env.MAILGUN_PASSWORD || '41843650e24da538ae858ac9c0be1d24'
    },
    phamtom : {
      retries: 3,
      width       : 1280,
      height      : 800,
      maxRenders: 50
    },
    scte : {
      API: {
        urlToken: 'https://devapi.scte.org/SCTEApi/token',
        urlData: 'https://devapi.scte.org/SCTEApi/api/product/XXXX?systemid=OpXL',
        credentials: {
          userName: 'dedmunds@scte.org',
          password: 'testrecord',
          grant_type: 'password'
        }
      }
    }
  }
  return config;
}
