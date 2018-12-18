import '@babel/polyfill';

import Instagram from './lib/Instagram';
import { mkdirp as mkdir } from 'mkdirp';

async function bootstrap() {
    await (new Instagram('', '')).login();
}

mkdir(__dirname + '/lib/local/cookie/', bootstrap);
