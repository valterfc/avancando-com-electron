const path = require('path');
const Mousetrap = require('mousetrap');
const { remote } = require('electron');
const mainWindow = remote.BrowserWindow.getFocusedWindow();

let minimizar = document.getElementById('minimizar');
minimizar.addEventListener('click', function(e) {
    e.preventDefault();
    mainWindow.minimize(); //se ler o "mainWindow" como nulo, reiniciar a aplicação
});

let maximizar = document.getElementById('maximizar');
maximizar.addEventListener('click', function(e) {
    e.preventDefault();
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
        maximizar.textContent = 'maximizar';
    } else {
        mainWindow.maximize(); //se ler o "mainWindow" como nulo, reiniciar a aplicação
        maximizar.textContent = 'restaurar';
    }
});

let fechar = document.getElementById('fechar');
fechar.addEventListener('click', function(e) {
    e.preventDefault();
    mainWindow.close(); //se ler o "mainWindow" como nulo, reiniciar a aplicação
});

let fullscreen = document.getElementById('fullscreen');
fullscreen.addEventListener('click', function(e) {
    e.preventDefault();
    //mainWindow.isFullScreen() retorna se está em fullscreen;
    //o método setFullScreen esperado um boolean como parâmetro
    mainWindow.setFullScreen(!mainWindow.isFullScreen()); //se ler o "mainWindow" como nulo, reiniciar a aplicação
});

let getgif = document.getElementById('getgif');
getgif.addEventListener('click', function(e) {
    e.preventDefault();

    //conexão com API
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.status == 200) {
            let response = JSON.parse(httpRequest.response);
            let imgUrl = response.data.image_url;
            document.getElementById('showgif').innerHTML = `<img src="${imgUrl}">`;
        }
    };
    httpRequest.open('GET', 'http://api.giphy.com/v1/gifs/random?api_key=rJ02Rgy7z2hwcSUi11t07m5tryRJPsTB');
    httpRequest.send();
});

//notificações do windows
let notification = document.getElementById('notification');

notification.addEventListener('click', function(e){
    e.preventDefault();
    let notification = new Notification('Minha notificação', {
        body: 'esta é uma notificação bem bacana do meu app',
        icon: path.join(__dirname, 'tray.png') //também tenho acesso às bibliotecas do node
    }); //a notification não é a mesma de fora, por causa do "let"

    notification.onclick = function(){
        alert('clicado com sucesso');
    }
});

//este meio de atalho dá mais liberdade do que o globalShortcut do main.js
Mousetrap.bind('up up down down left right t', function(){
    alert('Erik\s Win');
});