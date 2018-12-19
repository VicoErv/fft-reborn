import '@babel/polyfill';

import {Ask} from './lib/Util';
import Instagram from './lib/Instagram';
import {mkdirp as mkdir} from 'mkdirp';

let instagram;
let username;
let password;
let target;
let delay = 0;

/**
 * Bring delay to nodejs
 * @param {number} timeout - Timeout in miliseconds
 * @return {Promise}
 */
function sleep(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

/** Boot Fft Application */
async function bootstrap() {
  const ask = new Ask();

  await ask.question('username: ')
      .then(ask.question.bind(ask, 'password: ', true))
      .then(ask.question.bind(ask, 'target: ', false))
      .then(ask.question.bind(ask, 'delay (ms): ', false))
      .then(async function(ask) {
        return ask;
      });

  const history = ask.rl.history;

  delay = history[0];
  target = history[1];
  password = history[2];
  username = history[3];

  instagram = new Instagram(username, password);
  await instagram.login();

  const following = await instagram.following(target);
  let followings = await following.get();

  while (following.moreAvailable) {
    for (const follow of followings) {
      console.log(follow.params.fullName);
      await sleep(delay);
    }

    followings = await following.get();
  }
}

mkdir(__dirname + '/lib/local/cookie/', bootstrap);
