const chipColor = {1:'white', 2:'yellow', 5:'red', 10:'blue', 25:'green', 50:'orange', 100:'black'}

export class chip{
  constructor(number, value){
    // this.betLocation = betLocation;
    this.number = number
    this.value = value;
  }
  get color(){
    const color = Object.keys(chipColor).filter(key => chipColor[key])
    return 'color';
  }
}