import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 512;
const TILE_WIDTH = 64;
const TILE_HEIGHT = 64;


const Player = {

  x: 0,
  y: 0,
  dirx: 0,
  diry: 0,

  health: 100,
  coins: 0,
  bullets: 0,
  medkits: 0,

  update: () => {

  },
  draw: () => {
    
  }
  

};

class Game {

  images = {};

  layers = [
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

  users = [];

  
  constructor(ctx) {
    //Oyunu başlatacak fonksiyon
    this.ctx = ctx;
    }

  init = async () => {
    //Resimler yüklenecek

    const tile0 = await this.loadImage('./assets/layers/0.png');
    const tile1 = await this.loadImage('./assets/layers/1.png');

    this.images = {
      0: tile0,
      1: tile1,
    }


  };

  update = () => {
    //Oyunun döngüsü burada olacak


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

          console.log("imageType: " + layer[j * cols + k]);
          this.ctx.drawImage(
            this.images[imageType],
            0, 0, TILE_WIDTH, TILE_HEIGHT, 
            k * TILE_WIDTH, j * TILE_HEIGHT, 
            TILE_WIDTH, TILE_HEIGHT);
    
        }
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
    this.setState(state =>  ({isGameRunning: state.isGameRunning}));
  }

  loop = () => {
    requestAnimationFrame(() => {
      const now = Date.now();
      if (now - this.lastLoop > (1000 / 30)) {
        this.game.update();
      }

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
