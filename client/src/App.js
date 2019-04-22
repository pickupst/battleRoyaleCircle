import React, { Component } from 'react';
import logo from './logo.svg';
import io from 'socket.io-client';
import './App.css';


const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 512;
const TILE_WIDTH = 64;
const TILE_HEIGHT = 64;

class Player {

  constructor(ctx, game) {
    this.ctx = ctx;
    this.game = game;

    this.id = 0;

    this.x = 100;
    this.y = 100;
    this.type = 0;
  };
  
  draw = () => {
    this.ctx.drawImage(
    this.game.images.user0,
    0, 0, TILE_WIDTH, TILE_HEIGHT, 
    this.x, this.y, 
    TILE_WIDTH, TILE_HEIGHT);
  };
  
  update = () => {
    
    // //Oyunun döngüsü burada olacak
    // for (let m = 0; m < this.players.length; m++) {
    //   const player = this.players[m];
    //   player.update();
    // }

  };

};

class Game {
  
  constructor(ctx, socket) {
    //Oyunu başlatacak fonksiyon
    this.ctx = ctx;
    this.socket = socket;
    
    this.images = {};

    this.layers = [
      [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1
      ]

    ];

    this.players = [];

    socket.on('PLAYERS_UPDATE', (players) => {

      const newPlayers = [];

       for (let i = 0; i < players.length; i++) {
        
        const newPlayer = new Player(ctx, this);
        newPlayer.id = players[i].id;
        newPlayer.x = players[i].x;
        newPlayer.y = players[i].y;
        newPlayer.type = players[i].type;
         
        newPlayers.push(newPlayer);
       }
       this.players = newPlayers;
      // socket.emit('my other event', { my: 'data' });
    });

    }

  init = async () => {
    //Resimler yüklenecek

    const tile0 = await this.loadImage('./assets/layers/0.png');
    const tile1 = await this.loadImage('./assets/layers/1.png');
    const user0 = await this.loadImage('./assets/users/0.png');

    this.images = {
      user0: user0,
      0: tile0,
      1: tile1,
    };

    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);

  };

  _onKeyDown = event => {

    const keyCode = event.keyCode;
    //37 sol
    if (keyCode === 37) {
      this.socket.emit("PLAYER_DIRECTION_UPDATE", {dirx: -1});
    }
    //39 Sağ
    else if (keyCode === 39) {
      this.socket.emit("PLAYER_DIRECTION_UPDATE", {dirx: 1});
    }
    //Yukarı
    else if (keyCode === 38) {
      this.socket.emit("PLAYER_DIRECTION_UPDATE", {diry: -1});
    }
    else if (keyCode === 40) {
      this.socket.emit("PLAYER_DIRECTION_UPDATE", {diry: 1});
    }

  }

  _onKeyUp = event => {

    const keyCode = event.keyCode;
    //37 sol
    if (keyCode === 37) {
      this.socket.emit("PLAYER_DIRECTION_UPDATE", {dirx: 0});
    }
    //39 Sağ
    else if (keyCode === 39) {
      this.socket.emit("PLAYER_DIRECTION_UPDATE", {dirx: 0});
    }
    //Yukarı
    else if (keyCode === 38) {
      this.socket.emit("PLAYER_DIRECTION_UPDATE", {diry: 0});
    }
    else if (keyCode === 40) {
      this.socket.emit("PLAYER_DIRECTION_UPDATE", {diry: 0});
    }

  }

  update = () => {
    
    // //Oyunun döngüsü burada olacak
    // for (let m = 0; m < this.players.length; m++) {
    //   const player = this.players[m];
    //   player.update();
    // }

  };

  draw = () => {
    //Oyunu ekrana çizdirecek fonksiyon
    
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    //this.users.forEach(user => user.draw());
  
    const cols = CANVAS_WIDTH / TILE_WIDTH;
    const rows = CANVAS_HEIGHT / TILE_HEIGHT;

    for (var i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      for (var j = 0; j < rows; j++) {
        for (var k = 0; k < cols; k++) {
          const imageType = layer[j * cols + k];

          //console.log("imageType: " + layer[j * cols + k]);
          this.ctx.drawImage(
            this.images[imageType],
            0, 0, TILE_WIDTH, TILE_HEIGHT, 
            k * TILE_WIDTH, j * TILE_HEIGHT, 
            TILE_WIDTH, TILE_HEIGHT);
    
        }
      }


      for (let m = 0; m < this.players.length; m++) {
        const player = this.players[m];
        player.draw();
      }

  }
  };

  loadImage = (src) => {
    var img = new Image();
      var d = new Promise(function (resolve, reject) {
        img.onload = function () {
          resolve(img);
        }.bind(this);
  
        img.onerror = function () {
          reject('hata ' + src);
        };
      }.bind(this));
  
      img.src = src;
      return d;
  };

}


class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {

      CURRENT_STEP: '',
      isGameRunning: false,


    };

    this.canvasRef = React.createRef();
    this.lastLoop = null;
  }

  start = async () => {
    
    var socket = io('http://localhost:5000');

    if (!this.state.isGameRunning) {
      this.game = new Game(this.getCtx(), socket);
      await this.game.init();
      this.loop();
    }
    this.setState(state =>  ({isGameRunning: !state.isGameRunning}));
  }

  loop = () => {
    requestAnimationFrame(() => {
      const now = Date.now();
      //if (now - this.lastLoop > (1000 / 30)) {
        this.game.update();
      //}

      this.game.draw();

      this.lastLoop = Date.now();
      if (this.state.isGameRunning) {
        this.loop();
      }

    });
  }

  getCtx = () => this.canvasRef.current.getContext('2d');

  render() {
    return (
      <div style = {{height: '100%'}}>
        
        {!this.state.isGameRunning ? (
          <div>
            <input type = 'text' onChange = {(evt) => this.setState({name: evt.target.value})}/>
            <button disabled = {!this.state.name} onClick ={this.start}> START! </button>
          </div>
        ) : (null)};

        <div style = {{height: '100%', display: this.state.isGameRunning ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
          <canvas ref = {this.canvasRef} width = {CANVAS_WIDTH} height = {CANVAS_HEIGHT}>

          </canvas>
        
        </div>

      </div>
    );
  }
}

export default App;
