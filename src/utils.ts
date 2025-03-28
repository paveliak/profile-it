import * as core from "@actions/core";
import * as fs from "fs";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function waitOutput(pattern: string, file: string) {
    core.info(`Awaiting "${pattern}" in "${file}"`);
    while (true) {
        const log = fs.readFileSync(file, "utf8");
        if (log.indexOf(pattern) != -1) {
            break;
        }
        sleep(1000);
    }
}
