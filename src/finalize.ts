import * as core from "@actions/core";
import * as artifact from "@actions/artifact";
import * as fs from "fs";
import { waitOutput } from "./utils";
import { findFilesToUpload } from "./search";

const run = async (): Promise<void> => {
    const xtracePid = core.getState("xtracePid");
    if (!xtracePid) {
        return;
    }

    core.debug(`kill -INT ${xtracePid}`);
    process.kill(Number(xtracePid), "SIGINT");

    const logFile = core.getState("xtraceLog");
    waitOutput("Output file saved as:", logFile);
    core.info(fs.readFileSync(logFile, "utf8"));

    const traceName = core.getInput("name", { required: true });
    const rootDir = core.getState("xtraceDir");
    const result = await findFilesToUpload(rootDir);
    const client = new artifact.DefaultArtifactClient();
    await client.uploadArtifact(traceName, result.filesToUpload, result.rootDirectory);
};

run();
