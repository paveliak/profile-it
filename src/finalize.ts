import * as core from "@actions/core";
import * as fs from "fs";

const run = async (): Promise<void> => {
    const xtrace = JSON.parse(core.getState('xtraceProcess'))
    core.info(`kill -INT ${xtrace.pid}`);
    process.kill(xtrace.pid, 'SIGINT');

    await new Promise((resolve, _) => {
        xtrace.on('exit', resolve);
    });

    const logFile = core.getState('xtraceLog')
    core.info(fs.readFileSync(logFile, 'utf8'))
};

run();
