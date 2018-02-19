'use strict';

const path = require('path');
const fse = require('fs-extra');

module.exports = class SaveUser {

  addUser(userName, socketId) {
    let pathToConfig = path.join(__dirname, '..', 'resources', 'users.json');
    return fse.readJson(pathToConfig).then((userData) => {
      let user = {socketId: socketId, userName: userName};
      let isExist = false;
      userData.forEach((user) => {
        if(user.socketId == socketId) {
          return isExist;
        }
      });
      if(!isExist) {
        userData.push(user);
      }
      return fse.writeJson(pathToConfig, userData);
    });
  }
}
