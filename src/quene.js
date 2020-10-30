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
    // 定义队列，从一侧入对，从一侧出队,广度优先搜索
    let quene = [start];
    
    async function insert([x, y], pre) {
        if(map[100 * y + x] !== 0)
            return;
        if(x < 0 || y < 0 || x >= 100 || y >= 100) 
            return;
        map[100 * y + x] = pre;
        container.children[y * 100 + x].style.backgroundColor = 'lightgreen';
        await sleep(1)
        quene.push([x, y]);
    }

    while(quene.length) {
        let [x, y] = quene.shift(); // pop unshift() | push shift()
        
        // 找到终点之后寻求路径
        if(x === end[0] && y === end[1]) {
            let path = [];
            while(x !== start[0] || y !== start[1]) {
                path.push([x, y])

                container.children[y * 100 + x].style.backgroundColor = 'pink';
                await sleep(5);
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

inloadContainer()
