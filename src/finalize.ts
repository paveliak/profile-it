import * as core from "@actions/core";
//import * as child from "child_process";
import * as fs from "fs";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const run = async (): Promise<void> => {
    const xtrace = JSON.parse(core.getState('xtraceProcess'))
    core.info(`kill -INT ${xtrace.pid}`);
    process.kill(xtrace.pid, 'SIGINT');

    await sleep(10000)
    //child.spawnSync('wait', [xtrace.pid])

    const logFile = core.getState('xtraceLog')
    core.info(fs.readFileSync(logFile, 'utf8'))
};

run();
