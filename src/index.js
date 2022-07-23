import "./styles.scss";
import "./flipper.scss";
import { chip } from "./scripts/chips";
import "./scripts/board";
import anime from "animejs";
import { map, zip, fromEvent, pipe, withLatestFrom } from "./Observable";

window.anime = anime;

var currentBallRotation = 0;
var currentWheelRotation = 0;
var currentWheelIndex = 0;
var bankBalance = 1000;
var currentBets = {}
var isRotating = false;
var chipvalue = 5;

const rouletteWheelNumbers = [
  0,
  32,
  15,
  19,
  4,
  21,
  2,
  25,
  17,
  34,
  6,
  27,
  13,
  36,
  11,
  30,
  8,
  23,
  10,
  5,
  24,
  16,
  33,
  1,
  20,
  14,
  31,
  9,
  22,
  18,
  29,
  7,
  28,
  12,
  35,
  3,
  26
];

const boardOptions = [
  0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,
  16,17,18,19,20,21,22,23,24,25,26,27,28,
  29,30,31,32,33,34,35,36,211,212,213,
  3112,3212,3312,118,'even','red','black',
  'odd',1936
]

const extraOptionsPayoutTwo = [
  118,'even','red','black','odd',1936
]

const extraOptionsPayoutThree = [
  211,212,213,3112,3212,3312
]

const getRouletteWheelNumber = index =>
  rouletteWheelNumbers[index % 37 !== 0 ? 37 - Math.abs(index % 37) : 0];

const getRouletteWheelColor = index => {
  const i = index % 37 !== 0 ? 37 - Math.abs(index % 37) : 0;
  return i == 0 ? "green" : i % 2 == 0 ? "black" : "red";
};

window.rouletteWheelNumbers = rouletteWheelNumbers;

function addFlipper() {
  const mkDiv = className => {
    const d = document.createElement("div");
    d.classList.add(...className.split(" "));
    return d;
  };
  const flipper = mkDiv("flipper");
  const front = mkDiv("front-face");
  const back = mkDiv("back-face");
  flipper.appendChild(front);
  flipper.appendChild(back);
  document.querySelector(".result").appendChild(flipper);
  return (number, color) => {
    flipper.classList.add("flip", color);
    back.innerText = number;
  };
}

window.result = 0;
  
function startRotation(speed) {
  if (isRotating) {
    return;
  }
  
  const ele = document.getElementById("balance");
  ele.innerHTML = bankBalance;

  isRotating = true;
  
  const writeResult = addFlipper();
    
  const bezier = [0.165, 0.84, 0.44, 1.005];

  const newWheelIndex = currentWheelIndex - speed;
  const result = getRouletteWheelNumber(newWheelIndex);
  window.result = result;
  window.currentBets = currentBets;
  const resultColor = getRouletteWheelColor(newWheelIndex);
  (() => {
    const newRotaion = currentWheelRotation + (360 / 37) * speed;
    var myAnimation = anime({
      targets: [".layer-2", ".layer-4"],
      rotate: function() {
        return newRotaion;
      },
      duration: function() {
        return 5000;
      },
      loop: 1,
      // easing: "cubicBezier(0.010, 0.990, 0.855, 1.010)",
      easing: `cubicBezier(${bezier.join(",")})`,
      // easing: "cubicBezier(0.000, 1.175, 0.980, 0.990)",
      complete: (...args) => {
        currentWheelRotation = newRotaion;
        currentWheelIndex = newWheelIndex;
      }
    });
  })();
  // if (currentBets[result]){
  //   const ele = document.getElementById("balance");
  //   setTimeout(() => {
  //       setTimeout(() => {
  //         boardOptions.forEach((number) => {
  //           let numDivBetChip = document.getElementById(`bet-chip-${number}`);
  //           let currentNumDivBetAmount = document.getElementById(`bet-amount-${number}`)
  //           numDivBetChip.style.visibility = 'hidden';
  //           currentNumDivBetAmount.style.visibility = 'hidden';
  //           currentBets = {};
  //         })
  //       }, 8000)
  //       ele.innerHTML = bankBalance;
  //       rouletteWheelNumbers.forEach((number) => {
  //         let numDivBetChip = document.getElementById(`bet-chip-${number}`);
  //         let currentNumDivBetAmount = document.getElementById(`bet-amount-${number}`)
  //         numDivBetChip.style.visibility = 'hidden';
  //         currentNumDivBetAmount.style.visibility = 'hidden';
  //         if (number === result){
  //           numDivBetChip.style.visibility = 'visible';
  //           currentNumDivBetAmount.style.visibility = 'visible';
  //           currentNumDivBetAmount.innerHTML = (currentBets[number] * 35)
  //           bankBalance += (currentBets[number] * 35);
  //         } else if ((currentBets[number] && number === 118 && ([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18].includes(result)))){
  //           numDivBetChip.style.visibility = 'visible';
  //           currentNumDivBetAmount.style.visibility = 'visible';
  //           currentNumDivBetAmount.innerHTML = (currentBets[number] * 2)
  //           bankBalance += (currentBets[number] * 2);
  //         } else if ((currentBets[number] && number === 1936 && ([19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36].includes(result)))){
  //           numDivBetChip.style.visibility = 'visible';
  //           currentNumDivBetAmount.style.visibility = 'visible';
  //           currentNumDivBetAmount.innerHTML = (currentBets[number] * 2)
  //           bankBalance += (currentBets[number] * 2);
  //         }
  //       })
  //     }, 5000);
  // } 
  // else {
  //   setTimeout(() => {
  //     const ele = document.getElementById("balance");
  //     ele.innerHTML = bankBalance;
  //     boardOptions.forEach((number) => {
  //       let numDivBetChip = document.getElementById(`bet-chip-${number}`);
  //       let currentNumDivBetAmount = document.getElementById(`bet-amount-${number}`)
  //       numDivBetChip.style.visibility = 'hidden';
  //       currentNumDivBetAmount.style.visibility = 'hidden';
  //     })
  //     currentBets = {};
  //   }, 8000);
  // }
  // const ele = document.getElementById("balance");
  setTimeout(() => {
    boardOptions.forEach((number) => {
      let numDivBetChip = document.getElementById(`bet-chip-${number}`);
      let currentNumDivBetAmount = document.getElementById(`bet-amount-${number}`)
      numDivBetChip.style.visibility = 'hidden';
      currentNumDivBetAmount.style.visibility = 'hidden';
      if (number === result && currentBets[number]){
        numDivBetChip.style.visibility = 'visible';
        currentNumDivBetAmount.style.visibility = 'visible';
        currentNumDivBetAmount.innerHTML = (currentBets[number] * 35)
        bankBalance += (currentBets[number] * 35);
      }
      if ((currentBets[number] && number === 118 && ([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18].includes(result)))){
        numDivBetChip.style.visibility = 'visible';
        currentNumDivBetAmount.style.visibility = 'visible';
        currentNumDivBetAmount.innerHTML = (currentBets[number] * 2)
        bankBalance += (currentBets[number] * 2);
      } 
      if ((currentBets[number] && number === 'even' && ([2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36].includes(result)))){
        numDivBetChip.style.visibility = 'visible';
        currentNumDivBetAmount.style.visibility = 'visible';
        currentNumDivBetAmount.innerHTML = (currentBets[number] * 2)
        bankBalance += (currentBets[number] * 2);
      }
      if ((currentBets[number] && number === 'red' && ([2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36].includes(result)))){
        numDivBetChip.style.visibility = 'visible';
        currentNumDivBetAmount.style.visibility = 'visible';
        currentNumDivBetAmount.innerHTML = (currentBets[number] * 2)
        bankBalance += (currentBets[number] * 2);
      }
      if ((currentBets[number] && number === 'black' && ([1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35].includes(result)))){
        numDivBetChip.style.visibility = 'visible';
        currentNumDivBetAmount.style.visibility = 'visible';
        currentNumDivBetAmount.innerHTML = (currentBets[number] * 2)
        bankBalance += (currentBets[number] * 2);
      }
      if ((currentBets[number] && number === 'odd' && ([1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35].includes(result)))){
        numDivBetChip.style.visibility = 'visible';
        currentNumDivBetAmount.style.visibility = 'visible';
        currentNumDivBetAmount.innerHTML = (currentBets[number] * 2)
        bankBalance += (currentBets[number] * 2);
      }
      if ((currentBets[number] && number === 1936 && ([19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36].includes(result)))){
        numDivBetChip.style.visibility = 'visible';
        currentNumDivBetAmount.style.visibility = 'visible';
        currentNumDivBetAmount.innerHTML = (currentBets[number] * 2)
        bankBalance += (currentBets[number] * 2);
      }
      if ((currentBets[number] && number === 211 && ([3,6,9,12,15,18,21,24,27,30,33,36].includes(result)))){
        numDivBetChip.style.visibility = 'visible';
        currentNumDivBetAmount.style.visibility = 'visible';
        currentNumDivBetAmount.innerHTML = (currentBets[number] * 3)
        bankBalance += (currentBets[number] * 3);
      }
      if ((currentBets[number] && number === 212 && ([2,5,8,11,14,17,20,23,26,29,32,35].includes(result)))){
        numDivBetChip.style.visibility = 'visible';
        currentNumDivBetAmount.style.visibility = 'visible';
        currentNumDivBetAmount.innerHTML = (currentBets[number] * 3)
        bankBalance += (currentBets[number] * 3);
      }
      if ((currentBets[number] && number === 213 && ([1,4,7,10,13,16,19,22,25,28,31,34].includes(result)))){
        numDivBetChip.style.visibility = 'visible';
        currentNumDivBetAmount.style.visibility = 'visible';
        currentNumDivBetAmount.innerHTML = (currentBets[number] * 3)
        bankBalance += (currentBets[number] * 3);
      }
      if ((currentBets[number] && number === 3112 && ([1,2,3,4,5,6,7,8,9,10,11,12].includes(result)))){
        numDivBetChip.style.visibility = 'visible';
        currentNumDivBetAmount.style.visibility = 'visible';
        currentNumDivBetAmount.innerHTML = (currentBets[number] * 3)
        bankBalance += (currentBets[number] * 3);
      }
      if ((currentBets[number] && number === 3212 && ([13,14,15,16,17,18,19,20,21,22,23,24].includes(result)))){
        numDivBetChip.style.visibility = 'visible';
        currentNumDivBetAmount.style.visibility = 'visible';
        currentNumDivBetAmount.innerHTML = (currentBets[number] * 3)
        bankBalance += (currentBets[number] * 3);
      }
      if ((currentBets[number] && number === 3312 && ([25,26,27,28,29,30,31,32,33,34,35,36].includes(result)))){
        numDivBetChip.style.visibility = 'visible';
        currentNumDivBetAmount.style.visibility = 'visible';
        currentNumDivBetAmount.innerHTML = (currentBets[number] * 3)
        bankBalance += (currentBets[number] * 3);
      }
    })
    ele.innerHTML = bankBalance;
    setTimeout(() => {
      boardOptions.forEach((number) => {
        let numDivBetChip = document.getElementById(`bet-chip-${number}`);
        let currentNumDivBetAmount = document.getElementById(`bet-amount-${number}`)
        numDivBetChip.style.visibility = 'hidden';
        currentNumDivBetAmount.style.visibility = 'hidden';
        currentBets = {};
      })
    }, 5000)
  }, 5000);
  (() => {
    const newRotaion = -4 * 360 + currentBallRotation;
    var myAnimation1 = anime({
      targets: ".ball-container",
      translateY: [
        { value: 0, duration: 2000 },
        { value: 20, duration: 1000 },
        { value: 25, duration: 900 },
        { value: 50, duration: 1000 }
      ],
      rotate: [{ value: newRotaion, duration: 4000 }],
      duration: function() {
        return 4000; // anime.random(800, 1400);
      },
      loop: 1,
      easing: `cubicBezier(${bezier.join(",")})`,
      complete: () => {
        currentBallRotation = newRotaion;
        writeResult(result, resultColor);
        isRotating = false;
      }
    });
  })();
}

function offsetEl(el) {
  var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
    width: rect.width,
    height: rect.height
  };
}

function isInBoundaryEl(el, x, y) {
  const o = offsetEl(el);
  return (
    x >= o.left && x <= o.left + o.width && y >= o.top && y <= o.top + o.height
  );
}

function isInRadiusEl(el, x, y) {
  const o = offsetEl(el);
  const cx = o.left + o.width / 2;
  const cy = o.top + o.height / 2;
  const dx = x - cx;
  const dy = y - cy;
  const r = o.width / 2;
  return Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(r, 2);
}

const documentEvent = eventName =>
  pipe(
    fromEvent(document, eventName),
    map(e =>
      e.type == "touchstart" || e.type == "touchmove"
        ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
        : { x: e.clientX, y: e.clientY }
    )
  );

const tryRotate = ([p0, p1]) => {
  const w = document.querySelector(".layer-2.wheel");
  if (isInRadiusEl(w, p0.x, p0.y)) {
    const d = Math.round(
      Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2)) / 4
    );
    if (Math.abs(d) > 3) {
      window.startRotation(d);
    }
  }
};

zip(documentEvent("mousedown"))(documentEvent("mouseup")).subscribe({
  next: tryRotate
});

zip(documentEvent("touchstart"))(
  pipe(
    withLatestFrom(documentEvent("touchmove"))(fromEvent(document, "touchend")),
    map(([_, r]) => r)
  )
).subscribe({
  next: tryRotate
});

pipe(
  withLatestFrom(documentEvent("touchmove"))(fromEvent(document, "touchend")),
  map(([_, r]) => r)
).subscribe({
  next: e => console.log(e)
});

document.querySelector(".roulette-wheel").addEventListener(
  "touchmove",
  e => {
    e.preventDefault();
  },
  { passive: false }
);

window.startRotation = startRotation;

function placeBet(num, value){
  if (!currentBets[num]) currentBets[num] = 0;
  currentBets[num] += value;
  // console.log(currentBets)
}

boardOptions.forEach((number) => {
  const numDiv = document.getElementById(`nums-label-${number}`);
  let numDivBetChip = document.getElementById(`bet-chip-${number}`);
  return numDiv.addEventListener('click', (e) => {
    e.preventDefault();
    let currentNum = number;
    if(bankBalance >= chipvalue){
      placeBet(currentNum, chipvalue);
      numDivBetChip.style.visibility = 'visible';
      let currentNumDivBetAmount = document.getElementById(`bet-amount-${currentNum}`)
      if (currentBets[currentNum]){
        currentNumDivBetAmount.innerHTML = currentBets[currentNum]
        currentNumDivBetAmount.style.visibility = 'visible';
      }
      const ele = document.getElementById("balance");
      bankBalance -= chipvalue;
      ele.innerHTML = bankBalance;
    }
  })
})

let chip1 = document.getElementById('chip1');
let chip5 = document.getElementById('chip5');
let chip10 = document.getElementById('chip10');
let chip25 = document.getElementById('chip25');
let chip100 = document.getElementById('chip100');

let chip1box = document.getElementById('chips-image-box-1')
let chip5box = document.getElementById('chips-image-box-5')
let chip10box = document.getElementById('chips-image-box-10')
let chip25box = document.getElementById('chips-image-box-25')
let chip100box = document.getElementById('chips-image-box-100')

chip1.addEventListener('click', function (e) {
  e.preventDefault();
  chip1box.style.borderStyle = 'solid';
  chip5box.style.borderStyle = 'hidden';
  chip10box.style.borderStyle = 'hidden';
  chip25box.style.borderStyle = 'hidden';
  chip100box.style.borderStyle = 'hidden';
  let newChipValue = 1;
  chipvalue = newChipValue;
})

chip5.addEventListener('click', function (e) {
  e.preventDefault();
  chip1box.style.borderStyle = 'hidden';
  chip5box.style.borderStyle = 'solid';
  chip10box.style.borderStyle = 'hidden';
  chip25box.style.borderStyle = 'hidden';
  chip100box.style.borderStyle = 'hidden';
  let newChipValue = 5;
  chipvalue = newChipValue;
})

chip10.addEventListener('click', function (e) {
  e.preventDefault();
  chip1box.style.borderStyle = 'hidden';
  chip5box.style.borderStyle = 'hidden';
  chip10box.style.borderStyle = 'solid';
  chip25box.style.borderStyle = 'hidden';
  chip100box.style.borderStyle = 'hidden';
  let newChipValue = 10;
  chipvalue = newChipValue;
})

chip25.addEventListener('click', function (e) {
  e.preventDefault();
  chip1box.style.borderStyle = 'hidden';
  chip5box.style.borderStyle = 'hidden';
  chip10box.style.borderStyle = 'hidden';
  chip25box.style.borderStyle = 'solid';
  chip100box.style.borderStyle = 'hidden';
  let newChipValue = 25;
  chipvalue = newChipValue;
})

chip100.addEventListener('click', function (e) {
  e.preventDefault();
  chip1box.style.borderStyle = 'hidden';
  chip5box.style.borderStyle = 'hidden';
  chip10box.style.borderStyle = 'hidden';
  chip25box.style.borderStyle = 'hidden';
  chip100box.style.borderStyle = 'solid';
  let newChipValue = 100;
  chipvalue = newChipValue;
})

// function play(){
  
// }

