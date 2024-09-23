const board = document.getElementById('board');
var cells;
var matrix;
let row ;
let col ;

renderBoard();
function renderBoard(cellWidth = 22){
  const root = document.documentElement;
  root.style.setProperty('--cell-width' , `${cellWidth}px`)
  row = Math.floor(board.clientHeight / cellWidth);
  col = Math.floor(board.clientWidth / cellWidth);
  board.innerHTML = '';
  cells = [];
  matrix = [];

  for(let i = 0; i < row; i++){
    const rowArr = [];
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');
    rowElement.setAttribute('id', `${i}`); // Use backticks here

    for(let j = 0; j < col; j++){
      const colElement = document.createElement('div');
      colElement.classList.add('col');
      colElement.setAttribute('id', `${i}-${j}`); // Use backticks here
      cells.push(colElement);
      rowArr.push(colElement);
      rowElement.appendChild(colElement);
    }
    matrix.push(rowArr);
    board.appendChild(rowElement);
  }
  initializeDragAndDrop();
}

const navOptions = document.querySelectorAll('.nav-menu>li>a');
var dropOptions = null;

const removeActive = (elements , parent = false) => {
   elements.forEach(element => {
     if(parent) element = element.parentElement;
     element.classList.remove('active');
   });
}

navOptions.forEach(navOption => {
   navOption.addEventListener('click' , ()=>{
       const li = navOption.parentElement;
       if(li.classList.contains('active')){
         li.classList.remove('active');
         return;
       }
       removeActive(navOptions , true);
       li.classList.add('active');

       if(li.classList.contains('drop-box')){
          dropOptions = li.querySelectorAll('.drop-menu>li');

          toggle_dropOption(navOption.innerText);
       }
   })
})

let pixel = 22;
let speed = 'normal';
let algorithm = 'BFS';
const visualizeBtn = document.getElementById('Visualize');

function toggle_dropOption(target){
  dropOptions.forEach(dropOption => {
     dropOption.addEventListener('click' , ()=>{
       removeActive(dropOptions);
       dropOption.classList.add('active');

       if(target.toLowerCase().includes('pixel')){
         pixel = +dropOption.innerText.replace('px', '');
         console.log(pixel);
         let prevSource = {x:source_coordinate.x , y:source_coordinate.y};
         let prevTarget = {x:target_coordinate.x , y:target_coordinate.y};

         renderBoard(pixel);

         if (isValid(prevSource.x, prevSource.y)) {
          prevSource = { x: Math.min(prevSource.x, row - 1), y: Math.min(prevSource.y, col - 1) }; // Update global source coordinate
        }
        if (isValid(prevTarget.x, prevTarget.y)) {
          prevTarget = { x: Math.min(prevTarget.x, row - 1), y: Math.min(prevTarget.y, col - 1) };
        }

        matrix[prevSource.x][prevSource.y].classList.add('source');
        source_coordinate = prevSource;  // Update global source coordinate

         matrix[prevTarget.x][prevTarget.y].classList.add('target');
         target_coordinate = prevTarget;  // Update global target coordinate
       }
       else if(target.toLowerCase().includes('speed')){
           speed = dropOption.innerText;
       }else{
           algorithm = dropOption.innerText.split(' ')[0];
           visualizeBtn.innerText = `Visualize ${algorithm}`;
       }

       removeActive(navOptions , true);
     });
  });
}

document.addEventListener('click' , (e)=>{
    const navMenu = document.querySelector('.nav-menu');

    if(!navMenu.contains(e.target)){
       removeActive(navOptions , true);
    }
})


//board Interactions
function isValid(x,y){
  return (x>=0 && y>=0 && x<row && y<col);
}

function set(className , x = -1 , y = -1){
  if(isValid(x,y)){
    matrix[x][y].classList.add(className);
  }else{
    x = Math.floor(Math.random()*row);
    y = Math.floor(Math.random()*col);
    matrix[x][y].classList.add(className);
  }
  return {x,y};
}

let source_coordinate = set('source');
let target_coordinate = set('target');

function initializeDragAndDrop() {
  let dragPoint = null;
  let isDrawing = false;
  let isDragging = false;

  cells.forEach((cell) => {
    const pointerdown = (e) => {
      if (e.target.classList.contains('source')) {
        dragPoint = 'source';
        isDragging = true;
      } else if (e.target.classList.contains('target')) {
        dragPoint = 'target';
        isDragging = true;
      } else {
        isDrawing = true;
      }
    };

    const pointermove = (e) => {
      if (isDrawing) {
        e.target.classList.add('wall');
      } else if (dragPoint && isDragging) {
        cells.forEach((cell) => {
          cell.classList.remove(`${dragPoint}`);
        });

        e.target.classList.add(`${dragPoint}`);
        const coordinate = e.target.id.split('-');

        if (dragPoint === 'source') {
          source_coordinate.x = +coordinate[0];
          source_coordinate.y = +coordinate[1];
        } else {
          target_coordinate.x = +coordinate[0];
          target_coordinate.y = +coordinate[1];
        }
      }
    };

    const pointerup = () => {
      isDrawing = false;
      isDragging = false;
      dragPoint = null;
    };

    cell.addEventListener('pointerdown', pointerdown);
    cell.addEventListener('pointerup', pointerup);
    cell.addEventListener('pointermove', pointermove);
    cell.addEventListener('click', () => {
      cell.classList.toggle('wall');
    });
  });
}

//--====================CLear Buttons Interactions ========
const clearPathBtn = document.querySelector('#clearPathBtn');
const clearBoardBtn = document.querySelector('#clearBoardBtn');

const clearPath = () => {
    cells.forEach((cell) => {
        cell.classList.remove('visited', 'path');
    })
}
const clearBoard = () => {
    clearPath();
    cells.forEach((cell) => {
        cell.classList.remove('wall');
    })
}

clearPathBtn.addEventListener('click', clearPath);
clearBoardBtn.addEventListener('click', clearBoard);


///================Speed Controller ==============
const speedOptions = Array.from(document.querySelectorAll('.speed-options li'));
const fast_AnimateDelay = 7;
const normal_AnimateDelay = 15;
const slow_AnimateDelay = 30;
let delay = normal_AnimateDelay;

speedOptions.forEach((option) => {
    option.addEventListener('click', () => {
        let pickedSpeed = option.innerText;
        if (pickedSpeed === 'Fast') delay = fast_AnimateDelay;
        else if (pickedSpeed === 'Normal') delay = normal_AnimateDelay;
        else delay = slow_AnimateDelay;
    })
    console.log('Selected Speed:', delay);

})
