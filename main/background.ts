import path from "path";
import { Menu, app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import os from 'os';
import { promises as fs } from 'fs';

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});

// Função para deletar arquivos temporários com verificação de caminho
ipcMain.handle('delete-temp-files', async () => {
  try {
    const tempDir = os.tmpdir();

    // Listar todos os arquivos no diretório temporário
    const files = await fs.readdir(tempDir);

    // Apagar arquivos e pastas
    let filesDeleted = 0;
    let filesFailed = 0;
    let foldersDeleted = 0;
    let foldersFailed = 0;

    for (const file of files) {
      const filePath = path.join(tempDir, file);
      let fileStat;
      try {
        fileStat = await fs.stat(filePath);

        if (fileStat.isFile()) {
          await fs.unlink(filePath);
          filesDeleted++;
        } else if (fileStat.isDirectory()) {
          await fs.rm(filePath, { recursive: true, force: true });
          foldersDeleted++;
        }
      } catch (error) {
        if (fileStat && fileStat.isFile()) {
          console.error(`Erro ao deletar arquivo: ${filePath}`, error);
          filesFailed++;
        } else if (fileStat && fileStat.isDirectory()) {
          console.error(`Erro ao deletar pasta: ${filePath}`, error);
          foldersFailed++;
        } else {
          console.error(`Erro ao acessar: ${filePath}`, error);
        }
      }
    }

    const message = `Arquivos temporários deletados com sucesso: ${filesDeleted}, <br>pastas deletadas: ${foldersDeleted}. <br>Falha ao deletar arquivos: ${filesFailed}, <br>falha ao deletar pastas: ${foldersFailed}.`;
    return { success: true, message: message };
  } catch (error) {
    return { success: false, message: `Erro ao deletar arquivos temporários: ${error.message}` };
  }
});

const template = [];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on("message", async (event, arg) => {
  event.reply("message", `${arg} World!`);
});
