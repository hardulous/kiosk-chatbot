const { app, BrowserWindow, screen, ipcMain, Menu } = require("electron");
const path = require("path");
const windowStateKeeper = require("electron-window-state");
const isDev = require("electron-is-dev");
const url = require("url");
const { spawn, exec } = require("child_process");
const fs = require("fs");
const os = require("os");

function createWindow(width, height) {
  let mainWindowState = windowStateKeeper({
    defaultWidth: width,
    defaultHeight: height,
  });

  // const menu = Menu.buildFromTemplate([]);
  // Menu.setApplicationMenu(menu);

  const win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    // frame: false,
    icon: path.join(`${__dirname}`, "../public/favicon.ico"),
    title: "Kiosk",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(`${__dirname}`, "./preload.js"),
      sandbox: false,
    },
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindowState.manage(win);
  return win;
}

app.commandLine.appendSwitch("no-sandbox");

// app.on("web-contents-created", (e1, c) => {
//   c.on("context-menu", (e2) => e2.preventDefault());
// });

app.on("ready", () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  let ipcWin = createWindow(width, height);

  // Event for main jar file
  ipcMain.on("start-jar", () => {
    let output = "";
    let JavaProcess;
    const javaFile = path.join(
      app.getAppPath(),
      "build",
      "EKoiskdash31CSV.jar"
    );
    const tempJarPath = path.join(os.homedir(), "backend.jar");
    fs.copyFileSync(javaFile, tempJarPath);

    // JavaProcess = isDev
    //   ? spawn("java", ["-jar", javaFile])
    //   : spawn("java", ["-jar", tempJarPath]);

    JavaProcess = spawn("java", ["-jar", tempJarPath]);

    JavaProcess.stdout.on("data", (data) => {
      // output += data.toString();
      output = data.toString();
      console.log(data.toString());
      ipcWin.webContents.send("to-kiosk-front", output);
    });

    JavaProcess.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    JavaProcess.on("exit", (code) => {
      console.log(`Java program exited with code ${code}`);
    });

    ipcMain.on("kill-jar", () => {
      JavaProcess.kill("SIGKILL");
    });

    ipcMain.on("to-kiosk-back", (event, n1) => {
      JavaProcess.stdin.write(String(n1) + "\n");
    });

    ipcMain.on("disconnect", () => {
      JavaProcess.kill("SIGKILL");
    });

    // Connecttion has been made so now allow frontend to interact
    javaFile && ipcWin.webContents.send("connection", javaFile);
  });

  // Event for sh file of backup
  ipcMain.on(
    "start-backup-sh",
    (event, cin, userId, password, ship, sysDetail, mmd) => {
      const shellFile1 = path.join(
        app.getAppPath(),
        "build",
        "sh",
        "bKoiskDD.sh"
      );
      const tempJarPath1 = path.join(os.homedir(), "bKoiskDD.sh");
      fs.copyFileSync(shellFile1, tempJarPath1);

      const isWindows = process.platform === "win32";
      const shell = isWindows ? "cmd.exe" : "/bin/sh";

      console.log(cin, userId, password, ship, sysDetail, mmd);

      const args = `"${cin}" "${userId}" "${password}" "${ship}" "${sysDetail}" "${mmd}"`;

      // check whether output directory exist or not
      if (!fs.existsSync(`${os.homedir}/output`)) {
        fs.mkdirSync(`${os.homedir}/output`);
      }

      const outputFileStream = fs.createWriteStream(
        `${os.homedir}/output/${userId}-backup.txt`,
        { flags: "a" }
      );

      exec(`${tempJarPath1} ${args}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Failed to execute command: ${error.message}`);
          return;
        }
        console.log(`stdout: ${stdout}`);

        outputFileStream.write(`40\n`);
        ipcWin.webContents.send("backup-progress", 40);

        const shellFile2 = path.join(
          app.getAppPath(),
          "build",
          "sh",
          "bKoisk2.sh"
        );
        const tempJarPath2 = path.join(os.homedir(), "bKoisk2.sh");
        fs.copyFileSync(shellFile2, tempJarPath2);

        exec(`${tempJarPath2} ${args}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Failed to execute command: ${error.message}`);
            return;
          }

          console.log(`stdout: ${stdout}`);

          outputFileStream.write(`20\n`);
          ipcWin.webContents.send("backup-progress", 20);

          const shellFile3 = path.join(
            app.getAppPath(),
            "build",
            "sh",
            "bKoisk3.sh"
          );
          const tempJarPath3 = path.join(os.homedir(), "bKoisk3.sh");
          fs.copyFileSync(shellFile3, tempJarPath3);

          exec(`${tempJarPath3} ${args}`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Failed to execute command: ${error.message}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            outputFileStream.write(`40\n`);
            outputFileStream.end();
            ipcWin.webContents.send("backup-progress", 40);
            console.error(`stderr: ${stderr}`);
          });

          console.error(`stderr: ${stderr}`);
        });

        console.error(`stderr: ${stderr}`);
      });
      ipcWin.webContents.send("connection-backup-sh", true);
    }
  );

  // Event for sh file of extract
  ipcMain.on(
    "start-extract-sh",
    (event, cin, userId, password, ship, sysDetail, mmd) => {
      let output = "";
      let shellProcess;
      const shellFile1 = path.join(
        app.getAppPath(),
        "build",
        "sh",
        "extKoiskDD.sh"
      );
      const tempJarPath1 = path.join(os.homedir(), "extKoiskDD.sh");
      fs.copyFileSync(shellFile1, tempJarPath1);

      const isWindows = process.platform === "win32";
      const shell = isWindows ? "cmd.exe" : "/bin/sh";

      console.log(cin, userId, password, ship, sysDetail, mmd);

      const args = `"${cin}" "${userId}" "${password}" "${ship}" "${sysDetail}" "${mmd}"`;

      // check whether output directory exist or not
      if (!fs.existsSync(`${os.homedir}/output`)) {
        fs.mkdirSync(`${os.homedir}/output`);
      }

      const outputFileStream = fs.createWriteStream(
        `${os.homedir}/output/${userId}-output.txt`,
        { flags: "a" }
      );

      exec(`${tempJarPath1} ${args}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Failed to execute command: ${error.message}`);
          return;
        }
        console.log(`stdout: restore-1`);

        outputFileStream.write(`40\n`);
        ipcWin.webContents.send("extract-progress", 40);

        const shellFile2 = path.join(
          app.getAppPath(),
          "build",
          "sh",
          "extKoisk2.sh"
        );
        const tempJarPath2 = path.join(os.homedir(), "extKoisk2.sh");
        fs.copyFileSync(shellFile2, tempJarPath2);

        exec(`${tempJarPath2} ${args}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Failed to execute command: ${error.message}`);
            return;
          }

          console.log(`stdout: stdout: restore-2`);

          outputFileStream.write(`20\n`);
          ipcWin.webContents.send("extract-progress", 20);

          const shellFile3 = path.join(
            app.getAppPath(),
            "build",
            "sh",
            "extKoisk3.sh"
          );
          const tempJarPath3 = path.join(os.homedir(), "extKoisk3.sh");
          fs.copyFileSync(shellFile3, tempJarPath3);

          exec(`${tempJarPath3} ${args}`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Failed to execute command: ${error.message}`);
              return;
            }
            console.log(`stdout: stdout: restore-3`);

            outputFileStream.write(`40\n`);
            outputFileStream.end();
            ipcWin.webContents.send("extract-progress", 40);

            console.error(`stderr: ${stderr}`);
          });

          console.error(`stderr: ${stderr}`);
        });

        console.error(`stderr: ${stderr}`);
      });
      ipcWin.webContents.send("connection-extract-sh", true);
    }
  );
});
