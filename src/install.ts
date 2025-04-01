import fs from "fs/promises";
import os from "os";
import path from "path";

import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as tc from "@actions/tool-cache";

import { CARGO_HOME } from "./main";
import { getComponents, getTargets, getToolchain } from "./input";

export async function installRustup() {
  const rustupPath = await io.which("rustup", false);

  if (rustupPath) {
    core.info("rustup already install");

    return;
  }

  core.info("rustup does not exist");

  const url =
    os.platform() === "win32"
      ? "https://win.rustup.rs"
      : "https://sh.rustup.rs";

  const instalScript = await tc.downloadTool(
    url,
    path.join(os.tmpdir(), "rustup-init")
  );

  core.info(`Downloaded installation script to ${instalScript}`);

  await fs.chmod(instalScript, 0o755);

  await exec.exec(instalScript, ["--default-toolchain", "none", "-y"]);

  core.addPath(path.join(CARGO_HOME, "bin"));

  core.info("Installed rustup");
}

export async function installToolchain() {
  const toolchain = getToolchain();
  const targets = getTargets();
  const components = getComponents();

  core.info("Installing toolchain with rustup");

  const args = ["toolchain", "install", toolchain, "--profile", "minimal"];

  targets.forEach((target) => {
    args.push("--target", target);
  });

  components.forEach((component) => {
    args.push("--component", component);
  });

  if (toolchain === "nightly" && components.length > 0) {
    args.push("--allow-downgrade");
  }

  args.push("--no-self-update");

  await exec.exec("rustup", args);
  await exec.exec("rustup", ["default", toolchain]);

  core.info("Logging installed toolchain");
}
