import os from "node:os";
import path from "node:path";

export const CARGO_HOME =
  process.env.CARGO_HOME ?? path.join(os.homedir(), ".cargo");
