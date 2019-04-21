import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 512;
const TILE_WIDTH = 64;
const TILE_HEIGHT = 64;


class Player {

  constructor(ctx, game) {
    this.ctx = ctx;
    this.game = game;

    this.x = 100;
    this.y = 100;
    this.dirx = 0;
    this.diry = 0;
  
    this.health = 100;
    this.coins = 0;
    this.bullets = 0;
    this.medkits = 0;
  };
  
  update = () => {

    this.x += this.dirx * 5;
    this.y += this.diry * 5;

  };

  draw = () => {
    this.ctx.drawImage(
    this.game.images.user0,
    0, 0, TILE_WIDTH, TILE_HEIGHT, 
    this.x, this.y, 
    TILE_WIDTH, TILE_HEIGHT);
  };
  

};

class Game {
  
  constructor(ctx) {
    //Oyunu başlatacak fonksiyon
    this.ctx = ctx;

    
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

    this.players = [
      new Player(ctx, this)
    ];

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
      this.players[0].dirx = -1;
    }
    //39 Sağ
    else if (keyCode === 39) {
      this.players[0].dirx = 1;
    }
    //Yukarı
    else if (keyCode === 38) {
      this.players[0].diry = -1;
    }
    else if (keyCode === 40) {
      this.players[0].diry = 1;
    }

  }

  _onKeyUp = event => {

    const keyCode = event.keyCode;
    //37 sol
    if (keyCode === 37) {
      this.players[0].dirx = 0;
    }
    //39 Sağ
    else if (keyCode === 39) {
      this.players[0].dirx = 0;
    }
    //Yukarı
    else if (keyCode === 38) {
      this.players[0].diry = 0;
    }
    else if (keyCode === 40) {
      this.players[0].diry = 0;
    }

  }

  update = () => {
    
    //Oyunun döngüsü burada olacak
    for (let m = 0; m < this.players.length; m++) {
      const player = this.players[m];
      player.update();
    }

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
    
    if (!this.state.isGameRunning) {
      this.game = new Game(this.getCtx());
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
      <div style = {{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
        <button onClick ={this.start}> START! </button>

        <canvas ref = {this.canvasRef} width = {CANVAS_WIDTH} height = {CANVAS_HEIGHT}>

        </canvas>
      
      </div>
    );
  }
}

export default App;
