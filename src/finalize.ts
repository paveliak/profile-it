import * as core from "@actions/core";

const run = (): void => {
    const xtrace = JSON.parse(core.getState("xtraceProcess"))
    core.info(`kill -INT ${xtrace.pid}`);
    process.kill(xtrace.pid, 'SIGINT');
};

run();
