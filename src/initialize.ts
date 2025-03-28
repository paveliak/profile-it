import * as core from "@actions/core";
import * as child from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waitOutput(pattern: string) {
    const logFile = core.getState('xtraceLog')
    core.info(`Awaiting "${pattern}" in "${logFile}"`);
    while (true) {
        const log = fs.readFileSync(logFile, 'utf8')
        if (log.indexOf(pattern) != -1) {
            break;
        }
        sleep(1000);
    }
}

const run = (): void => {
    if (process.platform !== "darwin") {
        throw new Error(
            `This task is intended only for macOS platform. It can't be run on '${process.platform}' platform`,
        );
    }

    const profileTemplate = core.getInput("template", { required: true });
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "profile-it"));
    const logFile = path.join(tmpDir, "trace.log");

    core.info(
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

    waitOutput("Ctrl-C to stop the recording");
};

run();
