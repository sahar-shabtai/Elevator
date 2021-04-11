export interface Elevator {
    available:boolean;
    currentFloor: number;
    previousTime:number;
    deltaTime:number;
    numElevator:number;
    isMoving:boolean;
    isArrived:boolean;
}
