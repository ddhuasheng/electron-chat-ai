const { app, BrowserWindow, ipcMain, nativeTheme } = require("electron");
const { join, resolve } = require("node:path");
const zlib = require("zlib");

// 获取env必须要用cross-env插件， 区分打包环境和开发环境
const isDev = process.env.NODE_ENV === "development";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      devTools: isDev,
    },
  });

  win.setMenu(null);

  win.webContents.openDevTools();

  if (isDev) {
    win.loadURL("http://localhost:8899");
  } else {
    win.loadFile(resolve(__dirname, "../../dist/index.html"));
  }
};

// 主进程监听渲染进程发送的消息， 切换主题
ipcMain.handle("dark-mode:toggle", () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = "light";
  } else {
    nativeTheme.themeSource = "dark";
  }
  return nativeTheme.shouldUseDarkColors;
});

// 主进程监听渲染进程发送的消息， 使用系统主题
ipcMain.handle("dark-mode:system", () => {
  nativeTheme.themeSource = "system";
});

ipcMain.on("compress", (event, inputText) => {
  const compressResult = zlib.deflateSync(inputText).toString("base64");
  event.sender.send("compress", compressResult);
});

ipcMain.on("uncompress", (event, compressedString) => {
  const text = zlib
    .inflateSync(Buffer.from(atob(compressedString), "base64"))
    .toString();
  event.sender.send("uncompress", text);
});

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
