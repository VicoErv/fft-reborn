import '@babel/polyfill';

import {sample} from 'lodash';
import Ask from './lib/Ask';
import {COMMENT as com} from './lib/Comment';
import format from 'string-format';
import Instagram from './lib/Instagram';
import {mkdirp as mkdir} from 'mkdirp';

let instagram;
let username;
let password;
let target;
let delay = 0;

/**
 * generate random comment
 * @param {object} params - object contains target information
 * @return {string}
 */
function generateComment(params) {
  return format(sample(com), params);
}

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
        console.log('user is private/verified, skipped');
        continue;
      }

      const relationship = await instagram.getRelationship(follow.id);

      if (relationship.params.following) {
        console.log('user was followed');
        continue;
      }

      const media = await instagram.feed(follow.id);

      if (media.length > 0) {
        if (!media[0].params.hasLiked) {
          await instagram.like(media[0].id);
          await instagram.comment(media[0].id,
              generateComment(follow.params));
          await instagram.follow(follow.id);
          console.log(`[${follow.params.username}] has been followed`);
        }
      }

      await sleep(delay);
    }

    followers = await follower.get();
  }
}

mkdir(__dirname + '/lib/local/cookie/', bootstrap);

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
