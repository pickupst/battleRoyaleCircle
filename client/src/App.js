import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 320;

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

const Game = {

  users : [],

  load: async () => {
    //Resimler yüklenecek

  },

  init: () => {
    //Oyunu başlatacak fonksiyon

  },

  update: () => {
    //Oyunun döngüsü burada olacak

  },

  draw: () => {
    //Oyunu ekrana çizdirecek fonksiyon

  }

};


class App extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {

      CURRENT_STEP: '',


    };

  }

  getCtx = () => this.canvasRef.current.getContext('2d');

  render() {
    return (
      <div>
        hello world!
        <canvas ref = {this.canvasRef} width = {CANVAS_WIDTH} height = {CANVAS_HEIGHT}>

        </canvas>
      
      </div>
    );
  }
}

export default App;
