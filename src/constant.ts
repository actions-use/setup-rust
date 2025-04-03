import path from "path";
import os from "os";

export const CARGO_HOME =
  process.env.CARGO_HOME ?? path.join(os.homedir(), ".cargo");
