import * as core from "@actions/core";

const run = (): void => {
    core.info(`kill -INT 123`);
};

run();
