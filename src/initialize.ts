import * as core from "@actions/core";
import * as child from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { waitOutput } from "./utils";

const run = (): void => {
    if (process.platform !== "darwin") {
        throw new Error(
            `This task is intended only for macOS platform. It can't be run on '${process.platform}' platform`,
        );
    }

    const profileTemplate = core.getInput("template", { required: true });
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "profile-it"));
    const logFile = path.join(tmpDir, "trace.log");

    core.debug(
        `xcrun xctrace record --template "${profileTemplate}" --all-processes --output '${tmpDir}' >> '${logFile}' & 2>&1`,
    );

    const out = fs.openSync(logFile, "a");
    const err = fs.openSync(logFile, "a");

    const xctrace = child.spawn(
        "xcrun",
        ["xctrace", "record", "--template", profileTemplate, "--all-processes", "--output", tmpDir],
        {
            detached: true,
            stdio: ["ignore", out, err],
        },
    );

    xctrace.unref();

    core.info(`Spawned xctrace with pid ${xctrace.pid}`);

    core.saveState("xtracePid", xctrace.pid);
    core.saveState("xtraceLog", logFile);
    core.saveState("xtraceDir", tmpDir);

    waitOutput("Ctrl-C to stop the recording", logFile);
};

run();
