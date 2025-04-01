import * as exec from "@actions/exec";

export async function getCacheKey(toolchain: string) {
  const output = await exec.getExecOutput("rustc", [
    `+${toolchain}`,
    "--version",
    "--verbose",
  ]);

  const { date, hash } = output.stdout.split("\n").reduce(
    (data, line) => {
      if (line.startsWith("commit-hash")) {
        data.hash = line.split(":")[1].trim();
      } else if (line.startsWith("commit-date")) {
        data.date = line.split(":")[1].trim();
      }

      return data;
    },
    {
      hash: "",
      date: "",
    }
  );

  return (date + hash).replaceAll("-", "").slice(0, 20);
}
