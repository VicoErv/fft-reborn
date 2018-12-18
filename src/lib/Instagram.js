import { V1 as Client } from 'instagram-private-api';
import { existsSync as isFile } from 'fs';

export default class Instagram {
    constructor(username, password) {
        this.username = username;
        this.password = password;

        this.sessionPath = __dirname + '/local/cookie/' + username + '.cookie';

        this.login = this.login.bind(this);
    }

    async login() {
        if (isFile(this.sessionPath)) {
            this.session = new Client.Session(
                new Client.Device(this.username),
                new Client.CookieFileStorage(this.sessionPath)
            );
        } else {
            await new Promise(() => {
                Client.Session.create(
                    new Client.Device(this.username),
                    new Client.CookieFileStorage(this.sessionPath),
                    this.username,
                    this.password
                ).then((session) => {
                    this.session = session;
                }).catch(function (err) {
                    console.log(err.message);
                })

            })
        }
    }
}