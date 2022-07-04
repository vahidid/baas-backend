import { exec } from 'child_process';
import * as fs from 'fs';
/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
export function execShellCommand(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      console.log('EXEC: ', cmd);
      if (error) {
        console.warn(error);
        reject(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

// -- updated in 2020/04/19 covering the issues in the comments to this point
// -- remember you also have things like `ensureDirSync` from https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureDir-sync.md
export function writeFileSyncRecursive(
  filename: string,
  content: string,
  charset: fs.WriteFileOptions = 'utf8',
) {
  // -- normalize path separator to '/' instead of path.sep,
  // -- as / works in node for Windows as well, and mixed \\ and / can appear in the path
  let filepath = filename.replace(/\\/g, '/');

  // -- preparation to allow absolute paths as well
  let root = '';
  if (filepath[0] === '/') {
    root = '/';
    filepath = filepath.slice(1);
  } else if (filepath[1] === ':') {
    root = filepath.slice(0, 3); // c:\
    filepath = filepath.slice(3);
  }

  // -- create folders all the way down
  const folders = filepath.split('/').slice(0, -1); // remove last item, file
  folders.reduce(
    (acc, folder) => {
      const folderPath = acc + folder + '/';
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      return folderPath;
    },
    root, // first 'acc', important
  );

  // -- write file
  fs.writeFileSync(root + filepath, content, charset);
}
