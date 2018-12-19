import readline from 'readline';

/** This is Ask class, literally for asking :) */
export class Ask {
  /**
   * Initialize Ask instance
   * @constructor
   */
  constructor() {
    this.rl = readline.createInterface(process.stdin, process.stdout);

    this.rl._writeToOutput = function(message) {
      if (this.rl.stdoutMuted) {
        this.rl.output.write('\x1B[2K\x1B[200D' +
          this.rl.query + '[' + ((this.rl.line.length % 2 == 1) ?
          '=-' : '-=') + ']');
      } else {
        this.rl.output.write(message);
      }
    }.bind(this);

    this.response = '';
  }

  /**
   * Asking question
   * @param {string} message - Any message you want to ask about
   * @param {boolean} invisible - If you don't want to show input to terminal
   * @return {Promise}
   */
  question(message, invisible = false) {
    this.rl.stdoutMuted = invisible;

    if (invisible) {
      this.rl.query = message;
    }

    return new Promise((resolve) => {
      this.rl.question(message, function(res) {
        if (this.rl.stdoutMuted) {
          this.rl.output.write('\n');
        }

        this.response = res;
        this.rl.stdoutMuted = false;

        resolve(this);
      }.bind(this));
    });
  }
}
