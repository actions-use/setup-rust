import path from "path";
import os from "os";

import * as core from "@actions/core";

import { installRustup, installToolchain } from "./install";
import { getToolchain } from "./input";
import { getCacheKey } from "./cache";

export const CARGO_HOME =
  process.env.CARGO_HOME ?? path.join(os.homedir(), ".cargo");

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  core.info("Setting cargo environment variables");

  core.exportVariable("CARGO_INCREMENTAL", "0");
  core.exportVariable("CARGO_TERM_COLOR", "always");

  try {
    await installRustup();
    await installToolchain();
    const cacheKey = await getCacheKey(getToolchain());

    core.setOutput("cacheKey", cacheKey);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) {
      core.setFailed(error.message);
    }

    throw error;
  }
}
