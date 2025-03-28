import * as core from "@actions/core";
import * as fs from "fs";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waitOutput(pattern: string) {
    const logFile = core.getState('xtraceLog')
    while (true) {
        const log = fs.readFileSync(logFile, 'utf8')
        if (log.indexOf(pattern) != -1) {
            break;
        }
        sleep(1000);
    }
}

const run = async (): Promise<void> => {
    const xtracePid = core.getState('xtracePid')
    core.info(`kill -INT ${xtracePid}`);
    process.kill(Number(xtracePid), 'SIGINT');

    waitOutput("Output file saved as:");

    const logFile = core.getState('xtraceLog')
    core.info(fs.readFileSync(logFile, 'utf8'))
};

run();
