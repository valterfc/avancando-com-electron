const { app, BrowserWindow, Tray, Menu, globalShortcut, dialog } = require('electron');
const { autoUpdater } = require('electron-updater'); //fazer a checagem de atualização
const url = require('url');
const path = require('path');
const http = require('http');

if (process.env.NODE_ENV == 'development') { //apenas executa se estiver em desenvolvimento
    require('electron-reload')(__dirname); //faz o autoreload da aplicação
}

//tem de ser declarado para funcionar as notificações do windows
app.setAppUserModelId('com.valterfc.testeelectron01');

let mainWindow; // Keep a global reference of the window object, if you don't, the window will be closed automatically when the JavaScript object is garbage collected.

function createWindow () {
    mainWindow = new BrowserWindow({ width: 800, height: 600 })

    let file = url.format({
        pathname: path.join(__dirname, 'index.htm'),
        protocol: 'file',
        slashes: true
    });

    //retornar o url do arquivo
    //file:///D:\xampp\htdocs\teste\electron01\index.htm
    //console.log(file);

    mainWindow.loadURL(file);

    if (process.env.NODE_ENV == 'development') { //apenas executa se estiver em desenvolvimento
        mainWindow.webContents.openDevTools();
    }

    //escutar os eventos
    //mainWindow.on('maximize', () => console.log('maximizado'));
    //mainWindow.on('unmaximize', () => console.log('restaurado do maximizado'));
    //mainWindow.on('minimize', () => console.log('minimizado'));
    //mainWindow.on('restore', () => console.log('restaurado'));
    //mainWindow.on('close', () => console.log('fechando'));
    //mainWindow.on('resize', () => console.log('redimensionado'));

/*
    //o XMLHttpRequest somente pode ser acessado pelo navegador
    //então usamos aqui o "http" para acessar
    //o mesmo exemplo utilizado no renderer.js para "http://api.giphy.com/v1/gifs/random?api_key=rJ02Rgy7z2hwcSUi11t07m5tryRJPsTB"
    http.get({
        hostname: 'api.giphy.com',
        port: '',
        path: '/v1/gifs/random?api_key=rJ02Rgy7z2hwcSUi11t07m5tryRJPsTB'
    }, function(res){
        //console.log(res);
        
        let output;
        res.on('data', function(chunk){
            output += chunk; //chunk = pedaço
        })
        res.on('end', function(){
            //let data = output;
            //console.log(output)
            let response = output.replace(/^undefined/, ''); //tirar o "undefined"
            response = JSON.parse(response);
            console.log(response.data.image_url);
        })
    });
*/

    //aqui, o icone do tray não funcionou
    //let tray = new Tray(path.join(__dirname, 'tray.png'));
    //tray.setContextMenu(contextMenu);

    mainWindow.on('minimize', function(e){
        e.preventDefault();
        mainWindow.hide();
    });

    mainWindow.on('close', function(e){
        app.isQuiting = true; //deixei default para sair, para debug mais rápido

        if (!app.isQuiting){
            e.preventDefault();
            mainWindow.hide();
        }
    });

    //atalhos do sistema - globalShortcut são atalhos globais, que afetam todas as janelas
    //CTRL+x (por causa do Mac, fica dessa forma)
    globalShortcut.register('CommandOrControl+x', function(){
        console.log('Quem disse que você pode recortar isso?');
    });
    globalShortcut.register('Alt+a', function(){
        console.log('Alt+a foi pressionado');
    });
}

function createContextMenu(){
    //criar menu
    contextMenu = Menu.buildFromTemplate([
        {
            label: 'Mostrar aplicativo', click: function(){
                mainWindow.show();
            }
        },
        {
            label: 'Sair', click: function(){
                app.isQuiting = true; //essa variável é criada apenas aqui
                app.quit(); //força fechar
            }
        }
    ]);
}

function createTrayIcon(){
    createContextMenu();

    tray = new Tray(path.join(__dirname, 'tray.png'));
    tray.setToolTip('Este é o meu app.')
    tray.setContextMenu(contextMenu);

    tray.on('click', function(){
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    });

    //dá destaque no app
    mainWindow.on('show', function(){
        tray.setHighlightMode('always');
    })
}

function sendStatusToWindow(text){
    const dialogOpts = {
        type: 'info',
        buttons: ['Ok'],
        title: 'Atualização do aplicativo',
        message: 'Detalhes:',
        detail: text
    }

    dialog.showMessageBox(dialogOpts);
}

function checkForUpdate(){
    //eventos do updater
    autoUpdater.on('checking-for-update', () => {
        sendStatusToWindow('Checking for update...');
    });

    autoUpdater.on('update-available', (info) => {
        sendStatusToWindow('Update available.');
    });

    //autoUpdater.on('update-not-available', (info) => {
    //    sendStatusToWindow('Update not available.');
    //});

    autoUpdater.on('error', (err) => {
        sendStatusToWindow('Error in auto-updater. ' + err);
    });

    //autoUpdater.on('download-progress', (progressObj) => {
    //    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    //    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    //    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ' )';
    //    sendStatusToWindow(log_message);
    //});

    //autoUpdater.on('update-downloaded', (info) => {
    //    sendStatusToWindow('Update downloaded');
    //});

    autoUpdater.checkForUpdatesAndNotify(); //verifica as atualizações
}

//app.on('ready', createWindow);

app.on('ready', () => {
    checkForUpdate();
    createWindow();
    createTrayIcon();
});
