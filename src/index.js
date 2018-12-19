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

  const follower = await instagram.followers(target);
  let followers = await follower.get();

  while (follower.moreAvailable) {
    for (const follow of followers) {
      if (follow.params.isPrivate || follow.params.isVerified) {
        continue;
      }

      const relationship = await instagram.getRelationship(follow.id);

      if (relationship.params.following) {
        continue;
      }

      const media = await instagram.feed(follow.id);

      if (media.length > 0) {
        const like = await instagram.like(media[0].id);

        console.log(like);
      }

      await sleep(delay);
    }

    followers = await follower.get();
  }
}

mkdir(__dirname + '/lib/local/cookie/', bootstrap);
