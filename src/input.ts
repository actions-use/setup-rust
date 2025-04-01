import * as core from "@actions/core";

export function getToolchain() {
  const toolchain = core.getInput("toolchain", {
    required: true,
  });

  return toolchain;
}

export function getTargets() {
  const targets =
    core.getInput("targets", {
      required: false,
    }) || "";

  return targets
    .split(",")
    .map((target) => target.trim())
    .filter(Boolean);
}

export function getComponents() {
  const components =
    core.getInput("components", {
      required: false,
    }) || "";

  return components
    .split(",")
    .map((target) => target.trim())
    .filter(Boolean);
}
