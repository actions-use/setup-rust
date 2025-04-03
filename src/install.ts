import fs from "fs/promises";
import os from "os";
import path from "path";

import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as tc from "@actions/tool-cache";

import { CARGO_HOME } from "./constant.ts";

export async function installRustup() {
  const rustupPath = await io.which("rustup", false);

  if (rustupPath) {
    core.info("Rustup is already installed. Skipping installation.");
    return;
  }

  core.info("Rustup is not installed. Proceeding with installation...");

  const url =
    os.platform() === "win32"
      ? "https://win.rustup.rs"
      : "https://sh.rustup.rs";

  const dest = path.join(os.tmpdir(), "rustup-init");

  core.info(`Removing any existing rustup-init script at ${dest}`);
  await io.rmRF(dest);

  core.info(`Downloading rustup installation script from ${url}`);
  const instalScript = await tc.downloadTool(url, dest);

  core.info(`Downloaded installation script to ${instalScript}`);
  core.info("Setting execute permissions on the installation script...");
  await fs.chmod(instalScript, 0o755);

  core.info("Running rustup installation script...");
  await exec.exec(instalScript, ["--default-toolchain", "none", "-y"]);

  core.info("Adding rustup to PATH...");
  core.addPath(path.join(CARGO_HOME, "bin"));

  core.info("Rustup installation completed successfully.");
}

export async function installToolchain(
  toolchain: string,
  targets: string[],
  components: string[]
) {
  core.info(`Starting installation of toolchain: ${toolchain}`);

  const args = ["toolchain", "install", toolchain, "--profile", "minimal"];

  core.info("Adding specified targets to the installation arguments...");
  targets.forEach((target) => {
    core.info(`Adding target: ${target}`);
    args.push("--target", target);
  });

  core.info("Adding specified components to the installation arguments...");
  components.forEach((component) => {
    core.info(`Adding component: ${component}`);
    args.push("--component", component);
  });

  if (toolchain === "nightly" && components.length > 0) {
    core.info("Toolchain is nightly. Allowing downgrade for components...");
    args.push("--allow-downgrade");
  }

  args.push("--no-self-update");

  core.info("Executing rustup toolchain installation...");
  await exec.exec("rustup", args);

  core.info(`Setting default toolchain to: ${toolchain}`);
  await exec.exec("rustup", ["default", toolchain]);

  core.info("Toolchain installation completed successfully.");
}
