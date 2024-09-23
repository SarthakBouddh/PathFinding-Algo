////// BFS ALGORITHM //////
var visitedCell = [];
var pathToAnimate = [];

visualizeBtn.addEventListener('click', () => {
    clearPath();
    visitedCell = [];
    pathToAnimate = [];

    switch (algorithm) {
        case 'BFS':
            BFS();
            break;
        case 'DFS':
            if (DFS(source_coordinate)) {
                pathToAnimate.push(matrix[source_coordinate.x][source_coordinate.y]);
            }
            break;
        case 'A*':
            Astar();
            break;
        case 'Dijkstra':
            Dijkstra();
            break;
        case 'greedy':
            Greedy();
            break;
        default:
    }
    animate(visitedCell, 'visited' , delay);
});

function BFS() {
    const queue = [];
    const visited = new Set();
    const parent = new Map();

    queue.push(source_coordinate);
    visited.add(`${source_coordinate.x}-${source_coordinate.y}`);

    while (queue.length > 0) {
        const current = queue.shift();
        visitedCell.push(matrix[current.x][current.y]);

        if (current.x === target_coordinate.x && current.y === target_coordinate.y) {
            getPath(parent, target_coordinate);
            return;
        }

        const neighbours = [
            { x: current.x - 1, y: current.y },
            { x: current.x, y: current.y + 1 },
            { x: current.x + 1, y: current.y },
            { x: current.x, y: current.y - 1 }
        ];

        for (const neighbour of neighbours) {
            const key = `${neighbour.x}-${neighbour.y}`;

            if (isValid(neighbour.x, neighbour.y) &&
                !visited.has(key) &&
                !matrix[neighbour.x][neighbour.y].classList.contains('wall')) {
                queue.push(neighbour);
                visited.add(key);
                parent.set(key, current);
            }
        }
    }
}

let timeoutIds = [];
function clearPreviousTimeouts() {
    for (let id of timeoutIds) {
        clearTimeout(id);
    }
    timeoutIds = [];
}

function animate(list, className, delay) {
    clearPreviousTimeouts();
    for (let i = 0; i < list.length; i++) {
        let timeoutId = setTimeout(() => {
            if (className === 'wall') {
                list[i].setAttribute('class', `col ${className}`);
            } else {
                list[i].classList.remove('visited', 'unvisited', 'path');
                list[i].classList.add(className);
            }

            // After searching is done, animate the path
            if (className === 'visited' && i === list.length - 1) {
                animate(pathToAnimate, 'path', delay);
            }
        }, (className === 'path') ? i * (delay + 20) : i * delay);

        timeoutIds.push(timeoutId);
    }
}

function getPath(parent, target) {
    if (!target || (target.x === source_coordinate.x && target.y === source_coordinate.y)) {
        pathToAnimate.push(matrix[source_coordinate.x][source_coordinate.y]);
        return;
    }
    pathToAnimate.push(matrix[target.x][target.y]);

    const p = parent.get(`${target.x}-${target.y}`);
    getPath(parent, p);
}

//===========Dijkstra algorithm ==========

class PriorityQueue {
    constructor() {
        this.elements = [];
        this.length = 0;
    }
    push(data) {
        this.elements.push(data);
        this.length++;
        this.upHeapify(this.length - 1);
    }
    pop() {
        this.swap(0, this.length - 1);
        const popped = this.elements.pop();
        this.length--;
        this.downHeapify(0);
        return popped;
    }
    upHeapify(i) {
        if (i === 0) {
            return;
        }
        const parent = Math.floor((i - 1) / 2);
        if (this.elements[i].cost < this.elements[parent].cost) {
            this.swap(parent, i);
            this.upHeapify(parent);
        }
    }
    downHeapify(i) {
        let minNode = i;
        const leftChild = (2 * i) + 1;
        const rightChild = (2 * i) + 2;

        if (leftChild < this.length && this.elements[leftChild].cost < this.elements[i].cost) {
            minNode = leftChild;
        }
        if (rightChild < this.length && this.elements[rightChild].cost < this.elements[i].cost) {
            minNode = rightChild;
        }
        if (minNode !== i) {
            this.swap(minNode, i);
            this.downHeapify(minNode);
        }
    }
    isEmpty() {
        return this.length === 0;
    }
    swap(x, y) {
        [this.elements[x], this.elements[y]] = [this.elements[y], this.elements[x]];
    }
}

function Dijkstra() {
    const pq = new PriorityQueue();
    const parent = new Map();
    const distance = Array.from({ length: row }, () => Array(col).fill(Infinity));

    distance[source_coordinate.x][source_coordinate.y] = 0;
    pq.push({ coordinate: source_coordinate, cost: 0 });

    while (!pq.isEmpty()) {
        const { coordinate: current, cost: currentDistance } = pq.pop();
        visitedCell.push(matrix[current.x][current.y]);

        if (current.x === target_coordinate.x && current.y === target_coordinate.y) {
            getPath(parent, target_coordinate);
            return;
        }

        const neighbours = [
            { x: current.x - 1, y: current.y },
            { x: current.x, y: current.y + 1 },
            { x: current.x + 1, y: current.y },
            { x: current.x, y: current.y - 1 }
        ];

        for (const neighbour of neighbours) {
            if (isValid(neighbour.x, neighbour.y) && !matrix[neighbour.x][neighbour.y].classList.contains('wall')) {
                const newDistance = currentDistance + 1;
                if (newDistance < distance[neighbour.x][neighbour.y]) {
                    distance[neighbour.x][neighbour.y] = newDistance;
                    pq.push({ coordinate: neighbour, cost: newDistance });
                    parent.set(`${neighbour.x}-${neighbour.y}`, current);
                }
            }
        }
    }
}

//=====GREEDY ALGORITHM =======

function Greedy() {
    const queue = new PriorityQueue();
    const visited = new Set();
    const parent = new Map();

    queue.push({ coordinate: source_coordinate, cost: heuristicValue(source_coordinate) });
    visited.add(`${source_coordinate.x}-${source_coordinate.y}`);

    while (!queue.isEmpty()) {
        const { coordinate: current } = queue.pop();
        visitedCell.push(matrix[current.x][current.y]);

        if (current.x === target_coordinate.x && current.y === target_coordinate.y) {
            getPath(parent, target_coordinate);
            return;
        }

        const neighbours = [
            { x: current.x - 1, y: current.y },
            { x: current.x, y: current.y + 1 },
            { x: current.x + 1, y: current.y },
            { x: current.x, y: current.y - 1 }
        ];

        for (const neighbour of neighbours) {
            const key = `${neighbour.x}-${neighbour.y}`;
            if (isValid(neighbour.x, neighbour.y) &&
                !visited.has(key) &&
                !matrix[neighbour.x][neighbour.y].classList.contains('wall')) {
                queue.push({ coordinate: neighbour, cost: heuristicValue(neighbour) });
                visited.add(key);
                parent.set(key, current);
            }
        }
    }
}

function heuristicValue(node) {
    return Math.sqrt(Math.pow(node.x - target_coordinate.x, 2) + Math.pow(node.y - target_coordinate.y, 2));
}

//=======A Star Algorithm ========

function Astar() {
    const queue = new PriorityQueue();
    const visited = new Set();
    const queued = new Set();
    const parent = new Map();
    const distance = Array.from({ length: row }, () => Array(col).fill(Infinity));

    distance[source_coordinate.x][source_coordinate.y] = 0;
    queue.push({ coordinate: source_coordinate, cost: heuristicValue(source_coordinate) });
    queued.add(`${source_coordinate.x}-${source_coordinate.y}`);

    while (!queue.isEmpty()) {
        const { coordinate: current, cost: currentDistance } = queue.pop();
        visitedCell.push(matrix[current.x][current.y]);

        if (current.x === target_coordinate.x && current.y === target_coordinate.y) {
            getPath(parent, target_coordinate);
            return;
        }

        visited.add(`${current.x}-${current.y}`);

        const neighbours = [
            { x: current.x - 1, y: current.y },
            { x: current.x, y: current.y + 1 },
            { x: current.x + 1, y: current.y },
            { x: current.x, y: current.y - 1 }
        ];

        for (const neighbour of neighbours) {
            const key = `${neighbour.x}-${neighbour.y}`;
            if (isValid(neighbour.x, neighbour.y) && !visited.has(key) &&
                !queued.has(key) && !matrix[neighbour.x][neighbour.y].classList.contains('wall')) {
                const newDistance = currentDistance + 1;
                if (newDistance < distance[neighbour.x][neighbour.y]) {
                    distance[neighbour.x][neighbour.y] = newDistance;
                    queue.push({ coordinate: neighbour, cost: newDistance + heuristicValue(neighbour) });
                    queued.add(key);
                    parent.set(key, current);
                }
            }
        }
    }
}

//========DFS Algorithm ========

const visited = new Set();

function DFS(current) {
    if (visited.has(`${current.x}-${current.y}`)) {
        return false;
    }

    visited.add(`${current.x}-${current.y}`);
    visitedCell.push(matrix[current.x][current.y]);

    if (current.x === target_coordinate.x && current.y === target_coordinate.y) {
        return true;
    }

    const neighbours = [
        { x: current.x - 1, y: current.y },
        { x: current.x, y: current.y + 1 },
        { x: current.x + 1, y: current.y },
        { x: current.x, y: current.y - 1 }
    ];

    for (const neighbour of neighbours) {
        if (isValid(neighbour.x, neighbour.y) && !matrix[neighbour.x][neighbour.y].classList.contains('wall')) {
            if (DFS(neighbour)) {
                pathToAnimate.push(matrix[neighbour.x][neighbour.y]);
                return true;
            }
        }
    }

    return false;
}
