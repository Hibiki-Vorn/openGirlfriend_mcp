import { execFile } from "child_process";

const DISALLOWED_COMMANDS = new Set([
  "rm",
  "shutdown",
  "reboot",
  "init",
  "telinit",
  "mkfs",
  "dd",
  "chmod",
  "chown",
  "passwd",
  "kill",
  "pkill",
  "killall",
]);

const FORBIDDEN_CHARS = /[;&|><`$()]/;

export default (
  shell_command,
  timeout = 5000,
  maxBuffer = 1024 * 1024
) => {
  return new Promise((resolve) => {
    if (FORBIDDEN_CHARS.test(shell_command)) {
      resolve("[ERROR] Forbidden characters detected.");
      return;
    }

    const parts = shell_command.trim().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    if (DISALLOWED_COMMANDS.has(cmd)) {
      resolve(`[ERROR] Command "${cmd}" is not allowed.`);
      return;
    }

    execFile(
      cmd,
      args,
      { timeout, maxBuffer },
      (error, stdout, stderr) => {
        let result = "";
        if (stdout) result += `[stdout]:\n${stdout}`;
        if (stderr) result += `\n[stderr]:\n${stderr}`;
        if (error) result += `\n[error]:\n${error.message}`;
        resolve(result || "[INFO] Command executed, no output.");
      }
    );
  });
};
