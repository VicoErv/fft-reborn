import readline from 'readline';

class Ask {
    constructor() {
        this.rl = readline.createInterface(process.stdin, process.stdout);

        this.rl._writeToOutput = (message) => {
            if (this.rl.stdoutMuted) {
                rl.output.write("\x1B[2K\x1B[200D" + this.rl.query + "[" + ((rl.line.length % 2 == 1) ? "=-" : "-=") + "]");
            } else {
                this.rl.output.write(message);
            }
        }
    }

    ask(message, invisible = false) {
        if (invisible) {
            this.rl.stdoutMuted = true;
            rl.query = message;
        }

        return new Promise((resolve) => {
            //
        });
    }
}