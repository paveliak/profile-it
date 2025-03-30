import * as core from "@actions/core";
import * as fs from "fs/promises";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function waitOutput(pattern: string, file: string) {
    core.debug(`Awaiting "${pattern}" in "${file}"`);
    while (true) {
        const log = await fs.readFile(file, { encoding: "utf8" });
        if (log.indexOf(pattern) != -1) {
            break;
        }
        await sleep(1000);
    }
}
