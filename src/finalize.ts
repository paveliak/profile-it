import * as core from "@actions/core";
import * as fs from "fs";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waitOutput(pattern: string, file: string) {
    core.info(`Awaiting "${pattern}" in "${file}"`);
    while (true) {
        const log = fs.readFileSync(file, 'utf8')
        if (log.indexOf(pattern) != -1) {
            break;
        }
        sleep(1000);
    }
}

const run = (): void => {
    const xtracePid = core.getState('xtracePid')
    core.info(`kill -INT ${xtracePid}`);
    process.kill(Number(xtracePid), 'SIGINT');

    const logFile = core.getState('xtraceLog')
    waitOutput("Output file saved as:", logFile);
    core.info(fs.readFileSync(logFile, 'utf8'))
};

run();
