import * as core from "@actions/core";
import * as fs from "fs";
import { waitOutput } from "./utils";

const run = (): void => {
    const xtracePid = core.getState("xtracePid");
    core.info(`kill -INT ${xtracePid}`);
    process.kill(Number(xtracePid), "SIGINT");

    const logFile = core.getState("xtraceLog");
    waitOutput("Output file saved as:", logFile);
    core.info(fs.readFileSync(logFile, "utf8"));
};

run();
