import * as core from "@actions/core";

import { installRustup, installToolchain } from "./install.ts";
import { getToolchain, getComponents, getTargets } from "./input.ts";
import { generateCacheKey } from "./cache.ts";

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    core.info("Initializing setup-rust action...");

    core.info("Setting cargo environment variables");
    core.exportVariable("CARGO_INCREMENTAL", "0");
    core.exportVariable("CARGO_TERM_COLOR", "always");

    const toolchain = getToolchain();
    const targets = getTargets();
    const components = getComponents();

    core.info("Installing rustup...");
    await installRustup();
    core.info("Rustup installation completed.");

    core.info("Installing toolchain...");
    await installToolchain(toolchain, targets, components);
    core.info("Toolchain installation completed.");

    core.info("Generating cache key...");
    const cacheKey = await generateCacheKey(toolchain);
    core.info(`Cache key generated: ${cacheKey}`);

    core.setOutput("cacheKey", cacheKey);
    core.info("Action completed successfully.");
  } catch (error) {
    core.error("An error occurred during the setup-rust action.");
    // Fail the workflow run if an error occurs
    if (error instanceof Error) {
      core.setFailed(error.message);
    }

    throw error;
  }
}
