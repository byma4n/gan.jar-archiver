const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const archiveService = require('../service/ArchiveService');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true // Security best practice
        }
    });

    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('dialog:openFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Archives', extensions: ['gjar', 'zip'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    });
    if (canceled) return null;
    return filePaths[0];
});

ipcMain.handle('dialog:openDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });
    if (canceled) return null;
    return filePaths[0];
});

ipcMain.handle('dialog:saveFile', async (event, defaultName) => {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
        defaultPath: defaultName,
        filters: [
            { name: 'GanJar Archive', extensions: ['gjar'] },
            { name: 'Zip Archive', extensions: ['zip'] }
        ]
    });
    if (canceled) return null;
    return filePath;
});

ipcMain.handle('archive:compress', async (event, sourcePath, outputPath) => {
    return await archiveService.compress(sourcePath, outputPath);
});

ipcMain.handle('archive:extract', async (event, sourcePath, targetPath) => {
    return await archiveService.extract(sourcePath, targetPath);
});
