import {V1 as Client} from 'instagram-private-api';
import {existsSync as isFile} from 'fs';

/** Instagram instance, all action related to instagram api will placed here */
export default class Instagram {
  /**
   * Instagram constructor
   * @param {string} username - Username of user
   * @param {string} password  - Password of user
   */
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.target = '';
    this.delay = '';

    this.sessionPath = __dirname + '/local/cookie/' + username + '.cookie';

    this.login = this.login.bind(this);
  }

  /**
   * push login to user
   * @return {Promise}
   */
  async login() {
    if (isFile(this.sessionPath)) {
      return new Promise(function(resolve) {
        this.session = new Client.Session(
            new Client.Device(this.username),
            new Client.CookieFileStorage(this.sessionPath)
        );

        resolve(this.session);
      }.bind(this));
    } else {
      return new Promise(() => {
        return Client.Session.create(
            new Client.Device(this.username),
            new Client.CookieFileStorage(this.sessionPath),
            this.username,
            this.password
        ).then((session) => {
          this.session = session;
        }).catch(function(err) {
          console.log(err.message);
        });
      });
    }
  }

  /**
   * get list of following target
   * @param {string} username - Username of target
   * @return {AccountFollowers}
   */
  async following(username) {
    const user = await Client.Account.searchForUser(this.session, username);
    return new Client.Feed.AccountFollowers(this.session, user.id);
  }
}
