import * as core from "@actions/core";
import * as artifact from "@actions/artifact";
import { waitOutput } from "./utils";
import { findFilesToUpload } from "./search";

const run = async (): Promise<void> => {
    const xtracePid = core.getState("xtracePid");
    if (!xtracePid) {
        return;
    }

    core.debug(`kill -INT ${xtracePid}`);
    process.kill(Number(xtracePid), "SIGINT");

    core.info(`Waiting for the profiler to shutdown...`);
    const logFile = core.getState("xtraceLog");
    await waitOutput("Output file saved as:", logFile);

    const traceName = core.getInput("name", { required: true });
    const rootDir = core.getState("xtraceDir");
    const result = await findFilesToUpload(rootDir);
    const client = new artifact.DefaultArtifactClient();
    await client.uploadArtifact(traceName, result.filesToUpload, result.rootDirectory);
};

run();
