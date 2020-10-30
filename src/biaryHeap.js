// 使用二叉堆 时间复杂度为O(log n)
// 二叉堆一般用数组来表示
// 如果存储数组的下标基于0，那么下标为i的节点的子节点是2i + 1与2i + 2
class BiaryHeap {
    constructor(data, compare) {
        this.data = data;
        this.compare = compare;
    }

    take() {
        if(!this.data.length) 
            return ;
        let min = this.data[0];
        let i = 0;
        // fix heap
        while(i < this.data.length) {
            // 限制边界
            if(2 * i + 1 >= this.data.length) 
                break;
            if(2 * i + 2 >= this.data.length) {
                this.data[i] = this.data[2 * i + 1];
                i = 2 * i + 1;
                break;
            }
            // 比较两个子节点，将较小的推向父节点
            if(this.compare(this.data[2 * i + 1], this.data[2 * i + 2]) < 0) {
                this.data[i] = this.data[2 * i + 1];
                i = 2 * i + 1;
            } else {
                this.data[i] = this.data[2 * i + 2];
                i = 2 * i + 2;
            }
        }
        if(i < this.data.length - 1)
            // 将末尾数字插入i点
            this.insertAt(i, this.data.pop())
        else 
            this.data.pop();
        
        return min;
    }

    insertAt(i, v) {
        this.data[i] = v;
        // 插入的数字不断和父节点比较，小于父节点则替代， 父节点的下标为Math.floor((i − 1) ∕ 2)
        while(i > 0 && this.compare(v, this.data[Math.floor((i - 1)/2)]) < 0) {
            this.data[i] = this.data[Math.floor((i - 1)/2)];
            this.data[Math.floor((i - 1)/2)] = v;
            i = Math.floor((i - 1)/2);
        }
    }
    insert(v) {
        this.insertAt(this.data.length, v);
    }
    get length() {
        return this.data.length;
    }
}

var map = localStorage.map1 ? JSON.parse(localStorage.map1) : new Array(10000).fill(0);
let container = document.getElementById('container');
// 设置标志位
let mouse = false;    
let clear = false;

function inloadContainer() {
    for(let y = 0; y < 100; y++) {
        for(let x = 0; x < 100; x++) {
            let cell = document.createElement("div");
            cell.classList.add('cell');
            
            if(map[y * 100 + x] === 1) {
                cell.style.backgroundColor = 'black';
            }
            
            cell.addEventListener('mousemove', () => {
                if(mouse) {
                    if(clear) {
                        cell.style.backgroundColor = 'grey';
                        map[y * 100 + x] = 0
                    } else {
                        cell.style.backgroundColor = 'black';
                        map[y * 100 + x] = 1
                    }
                    
                }
            })
            container.appendChild(cell);
        }
    }
}

document.addEventListener('mousedown', (e) => {
    mouse = true;
    clear = (e.which === 3);
})

document.addEventListener('mouseup', () => {
    mouse = false;
})

// 禁止点击右键出现菜单
document.addEventListener('contextmenu', e => {
    e.preventDefault();
}, true); 

async function findPath(map, start, end) {
    map = map.slice();   
    
    function distance([x, y]) {
        return (x - end[0]) ** 2 + (y - end[1]) ** 2
    }
    
    // 定义队列，从一侧入对，从一侧出队,广度优先搜索
    let collection = new BiaryHeap([start], (a, b) => distance(a) - distance(b));
    
    async function insert([x, y], pre) {
        if(map[100 * y + x] !== 0)
            return;
        if(x < 0 || y < 0 || x >= 100 || y >= 100) 
            return;
        map[100 * y + x] = pre;
        container.children[y * 100 + x].style.backgroundColor = 'lightgreen';
        await sleep(5)
        collection.insert([x, y]);
    }

    while(collection.length) {
        let [x, y] = collection.take(); 
        
        // 找到终点之后寻求路径
        if(x === end[0] && y === end[1]) {
            let path = [];
            while(x !== start[0] || y !== start[1]) {
                path.push([x, y])
                container.children[y * 100 + x].style.backgroundColor = 'pink';
                [x, y] = map[y * 100 + x];
            }
            return path;
        }

        // 处理直线
        await insert([x - 1, y], [x, y]);
        await insert([x + 1, y], [x, y]);
        await insert([x, y - 1], [x, y]);
        await insert([x, y + 1], [x, y]);
        // 处理斜线
        await insert([x - 1, y - 1], [x, y]);
        await insert([x + 1, y + 1], [x, y]);
        await insert([x + 1, y - 1], [x, y]);
        await insert([x - 1, y + 1], [x, y]);
    }
    return null;
}

function startFindPath() {
    let endx = Number(document.getElementById('input-x').value);
    let endy = Number(document.getElementById('input-y').value);
    container.children[endy * 100 + endx].style.backgroundColor = 'red';

    findPath(map, [0, 0], [endx, endy])
}

function sleep(dur) {
    return new Promise(resolve => {
        setTimeout(resolve, dur);
    })
}

inloadContainer();