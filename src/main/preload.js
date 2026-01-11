const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
    saveFile: (defaultName) => ipcRenderer.invoke('dialog:saveFile', defaultName),
    compress: (sourcePath, outputPath) => ipcRenderer.invoke('archive:compress', sourcePath, outputPath),
    extract: (sourcePath, targetPath) => ipcRenderer.invoke('archive:extract', sourcePath, targetPath)
});
