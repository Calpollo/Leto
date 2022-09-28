# leto

- [leto](#leto)

## Developer notes

### Inter-process communication

1. `windows.ipc` allows invocation of functions anywhere in the site code.
2. *src/preload.js* loads all functions available through `ipcRenderer.invoke`. All parameters have to passed through.
3. *src/db/localDbEndpoints.js* handles the function calls using `ipcMain.handle`. The parameters for these functions are *event* and the passed *data*.