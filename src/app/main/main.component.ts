import { Component, OnInit } from '@angular/core';
import * as jquery from '../../../node_modules/jquery/dist/jquery.min.js';
import * as $ from 'jquery';
import { Floor } from '../interfaces/floor.js';
import { Elevator } from '../interfaces/elevator.js';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  floors:Floor[] =[];
  elevators:Elevator[] = [];
  elevatorLEFT = 17;
  showelev = 1; // number of elevator that text show

  constructor() { }

  async callElevator(floor:Floor){
    let available = this.allElevatorIsActive()
    if (available) {
      floor.active = false;
      floor.textbutton = 'waiting'
      // Identify closet elevator
      let elevatorCloset:Elevator = this.elevators[0]
      let elevatorindex = 0;
      for (let index = 1; index < this.elevators.length; index++) {
        if (Math.abs(elevatorCloset.currentFloor - floor.NumFloor) > Math.abs(this.elevators[index].currentFloor - floor.NumFloor)) {
          elevatorCloset = this.elevators[index];
          elevatorindex = index
          //console.log('change elevator')
        }
      }
      this.showelev = elevatorindex+1;
      elevatorCloset.isMoving = true;
      this.moveing(elevatorCloset,floor)
      elevatorCloset.currentFloor = floor.NumFloor;
      this.elevators[elevatorindex] = elevatorCloset;
      //console.log(elevatorCloset)  
    }else{
      console.log('enter to queue');
      setTimeout(() => {
        this.callElevator(floor)
      }, 5000);
    }
  }

  moveing(elevatorclose:Elevator,floor:Floor){
    var cal =Math.abs((10*elevatorclose.currentFloor) - (10*floor.NumFloor))
    // console.log(cal)
    floor.timeToArrive = cal/10 +"sec"
    if ((elevatorclose.currentFloor - floor.NumFloor) > 0) {
      var str = "+=" + cal + "%"
      $(".ele"+elevatorclose.numElevator).animate({
        top: str
      }, cal*100);
    }else{
      var str = "-=" + cal + "%"
      $(".ele"+elevatorclose.numElevator).animate({
        top: str
      }, cal*100)
    }
    setTimeout(() => {
      floor.textbutton = 'arrived'
      this.playAudio()
      elevatorclose.isMoving = false;
      elevatorclose.isArrived = true;
      floor.active = true;
    }, cal*100);
    setTimeout(() => {
      floor.textbutton = "Call"
      elevatorclose.isArrived = false;
    },cal*100+2000);
  }

  allElevatorIsActive(){
    let available:boolean = true;
    let counter:number = 0;
    for (let index = 0; index < this.elevators.length; index++) {
      if (this.elevators[index].isMoving) {
        counter++;
      }
    }
    if (counter == this.elevators.length) {
      available =false;
    }
    return available;
  }

  // play sound that elevator arrived 
  playAudio(){
    $('.aud').get(0).play();
  }

  // create floor 
  initfloors(num: number) {
    for (let index = 0; index < num; index++) {
      let f:Floor;
      if (index > 0) {
        f ={
          name: index+"th",
          active: true,
          textbutton: 'Call',
          NumFloor: index+1,
          timeToArrive:'ffffffff'
        }
      }else{
        f ={
          name: "ground",
          active: true,
          textbutton: 'Call',
          NumFloor: index+1,
          timeToArrive:'ffffffff'
        }
      }
      this.floors.push(f)
    }
  }
  // create elevatrors
  initelevators(num:number){
    for (let index = 0; index < num; index++) {
      let ele:Elevator = {
        available: true,
        currentFloor: 1,
        previousTime: new Date().getTime(),
        deltaTime: 0,
        numElevator: (index+1),
        isMoving: false,
        isArrived: false
      }
      this.elevators.push(ele);
    }
  }


  ngOnInit() {
    this.initfloors(10);
    this.initelevators(5);
  }

}


