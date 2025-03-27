import * as core from "@actions/core";

const run = (): void => {
    core.info(`kill -INT ${process.env.XTRACE_PID}`);
};

run();
