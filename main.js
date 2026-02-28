import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "url"; // Import to handle file URLs
import { dirname } from "path"; // Import to handle directory paths
import path from "path";
import { spawn } from "child_process";

// Get the __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let backendProcess;

function startBackend() {
  const isDev = process.env.ELECTRON_DEV;

  const backendPath = isDev
    ? path.join(__dirname, "backend", "index.js") // during development
    : path.join(process.resourcesPath, "backend", "index.js"); // after packaging

  backendProcess = spawn("node", [backendPath], {
    stdio: "inherit",
    shell: true,
    windowsHide: true
  });

  console.log("🚀 Backend server started: " + backendPath);

  backendProcess.on("error", (err) => {
    console.error("❌ Failed to start backend process:", err);
  });

  backendProcess.on("exit", (code, signal) => {
    console.log(`⚠️ Backend exited with code ${code}, signal ${signal}`);
  });
}

function stopBackend() {
  if (backendProcess) {
    backendProcess.kill();
    console.log("🛑 Backend server stopped");
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const startURL = process.env.ELECTRON_DEV
    ? "http://localhost:5173"
    : `file://${path.join(__dirname, "dist", "index.html")}`;

  win
    .loadURL(startURL)
    .then(() => {
      console.log(`🧩 Frontend loaded from: ${startURL}`);
    })
    .catch((err) => {
      console.error("❌ Error loading frontend:", err);
    });
}

app.whenReady().then(() => {
  startBackend();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Handle cleanup when all windows are closed
app.on("window-all-closed", () => {
  stopBackend();
  if (process.platform !== "darwin") app.quit();
});
