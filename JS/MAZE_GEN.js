var wallToAnimate = [];
const generateMazeBtn = document.getElementById('Maze');

generateMazeBtn.addEventListener('click', () => {
    clearPath();
    clearBoard();
    wallToAnimate = [];  // Reset wallToAnimate
    generateMaze(0, row - 1, 0, col - 1, false, 'horizontal');
    setTimeout(() => {  // Delay to ensure maze is generated before animation
        animate(wallToAnimate, 'wall', normal_AnimateDelay);  // Apply animation to walls
    }, 100);  // Adjust delay as needed
});

generateMaze( 0 , row-1, 0 , col-1 , false , 'horizontal');
function generateMaze(rowStart, rowEnd, colStart, colEnd, surroundingWall, orientation) {
    // Base case: If boundaries are invalid, exit the function
    if (rowStart > rowEnd || colStart > colEnd) {
        return;
    }

    // Adding surrounding walls if not already done
    if (!surroundingWall) {
        // Add top and bottom walls
        for (let i = 0; i < col; i++) {
            if (!matrix[0][i].classList.contains('source') && !matrix[0][i].classList.contains('target')) {
                wallToAnimate.push(matrix[0][i]);
            }
            if (!matrix[row - 1][i].classList.contains('source') && !matrix[row - 1][i].classList.contains('target')) {
                wallToAnimate.push(matrix[row - 1][i]);
            }
        }

        // Add left and right walls
        for (let i = 0; i < row; i++) {
            if (!matrix[i][0].classList.contains('source') && !matrix[i][0].classList.contains('target')) {
                wallToAnimate.push(matrix[i][0]);
            }
            if (!matrix[i][col - 1].classList.contains('source') && !matrix[i][col - 1].classList.contains('target')) {
                wallToAnimate.push(matrix[i][col - 1]);
            }
        }
        surroundingWall = true;
    }

    if (orientation === 'horizontal') {
        let possibleRow = [];
        for (let i = rowStart; i <= rowEnd; i += 2) {
            possibleRow.push(i);
        }

        let possibleCol = [];
        for (let i = colStart - 1; i <= colEnd + 1; i += 2) {
            if (i > 0 && i < col - 1) {
                possibleCol.push(i);
            }
        }

        let currentRow = possibleRow[Math.floor(Math.random() * possibleRow.length)];
        let randomCol = possibleCol[Math.floor(Math.random() * possibleCol.length)];

        // Add walls to the current row, except at the random column
        for (let i = colStart - 1; i <= colEnd + 1; i++) {
            const cell = matrix[currentRow][i];
            if (!cell || i === randomCol || cell.classList.contains('source') || cell.classList.contains('target')) {
                continue;
            }
            wallToAnimate.push(cell);
        }

        // Recursively generate maze in top and bottom parts
        generateMaze(rowStart, currentRow - 2, colStart, colEnd, surroundingWall, (currentRow - 2) - rowStart > colEnd - colStart ? 'horizontal' : 'vertical');
        generateMaze(currentRow + 2, rowEnd, colStart, colEnd, surroundingWall, rowEnd - (currentRow + 2) > colEnd - colStart ? 'horizontal' : 'vertical');

    } else {
        let possibleCol = [];
        for (let i = colStart; i <= colEnd; i += 2) {
            possibleCol.push(i);
        }

        let possibleRow = [];
        for (let i = rowStart - 1; i <= rowEnd + 1; i += 2) {
            if (i > 0 && i < row - 1) {
                possibleRow.push(i);
            }
        }

        let currentCol = possibleCol[Math.floor(Math.random() * possibleCol.length)];
        let randomRow = possibleRow[Math.floor(Math.random() * possibleRow.length)];

        // Add walls to the current column, except at the random row
        for (let i = rowStart - 1; i <= rowEnd + 1; i++) {
            if (!matrix[i]) continue;
            const cell = matrix[i][currentCol];

            if (i === randomRow || cell.classList.contains('source') || cell.classList.contains('target')) {
                continue;
            }
            wallToAnimate.push(cell);
        }

        // Recursively generate maze in left and right parts
        generateMaze(rowStart, rowEnd, colStart, currentCol - 2, surroundingWall, rowEnd - rowStart > (currentCol - 2) - colStart ? 'horizontal' : 'vertical');
        generateMaze(rowStart, rowEnd, currentCol + 2, colEnd, surroundingWall, rowEnd - rowStart > colEnd - (currentCol + 2) ? 'horizontal' : 'vertical');
    }
}

function animate(elements, className, delay = 10) {
    let animationDelay = delay;
    if(className === 'path'){
       animationDelay *= 3.5;
    }
    for (let i = 0; i < elements.length; i++) {
        setTimeout(() => {
          elements[i].classList.remove('visited');
            elements[i].classList.add(className);
            // Optional: remove 'visited' class if present, depending on your implementation
            if (className === 'visited' && i === elements.length - 1) {
                // Optionally trigger any additional logic or animations after walls are set
                animate(pathToAnimate , 'path');
            }
        }, delay * i);
    }
}
