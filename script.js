// script-modern.js - 现代界面的脚本

// 从 Matter.js 中获取模块
const { Engine, Render, Runner, World, Bodies, Body, Mouse, MouseConstraint, Events, Composite } = Matter;

// 获取 canvas 元素
const canvas = document.getElementById('sandbox-canvas');

// 设置画布尺寸 (可以根据需要调整)
const canvasWidth = 800;
const canvasHeight = 600;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// 创建物理引擎实例
const engine = Engine.create();
const world = engine.world;

// 创建渲染器
const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: canvasWidth,
        height: canvasHeight,
        wireframes: false, // 显示填充颜色而非线框
        background: '#f8f9fa', // 设置背景色为浅灰色
        showAngleIndicator: false, // 不显示角度指示器
        showCollisions: false, // 不显示碰撞
        showVelocity: false // 不显示速度
    }
});

// 创建运行器
const runner = Runner.create();

// 物理属性设置
let currentRestitution = 0.7; // 当前弹性系数
let gravityDirection = 1; // 1表示向下，-1表示向上

// 创建地面和墙壁 (静态物体)
const ground = Bodies.rectangle(canvasWidth / 2, canvasHeight, canvasWidth, 60, { 
    isStatic: true, 
    render: { 
        fillStyle: '#34495e',
        strokeStyle: '#2c3e50',
        lineWidth: 1
    } 
});

const leftWall = Bodies.rectangle(0, canvasHeight / 2, 60, canvasHeight, { 
    isStatic: true, 
    render: { 
        fillStyle: '#34495e',
        strokeStyle: '#2c3e50',
        lineWidth: 1
    } 
});

const rightWall = Bodies.rectangle(canvasWidth, canvasHeight / 2, 60, canvasHeight, { 
    isStatic: true, 
    render: { 
        fillStyle: '#34495e',
        strokeStyle: '#2c3e50',
        lineWidth: 1
    } 
});

const ceiling = Bodies.rectangle(canvasWidth / 2, 0, canvasWidth, 60, { 
    isStatic: true, 
    render: { 
        fillStyle: '#34495e',
        strokeStyle: '#2c3e50',
        lineWidth: 1
    } 
});

// 将地面和墙壁添加到世界中
World.add(world, [ground, leftWall, rightWall, ceiling]);

// 添加鼠标控制
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2, // 鼠标约束的硬度
        render: {
            visible: true, // 显示约束线
            lineWidth: 2,
            strokeStyle: 'rgba(52, 152, 219, 0.7)' // 蓝色半透明
        }
    }
});

World.add(world, mouseConstraint);

// 使渲染器跟随鼠标
render.mouse = mouse;

// 创建物体的函数
function createBody(x, y, type) {
    const randomSize = Math.random() * 30 + 20; // 随机大小
    const randomColor = getRandomColor();
    let newBody;

    switch(type) {
        case 'circle':
            newBody = Bodies.circle(x, y, randomSize / 2, {
                restitution: currentRestitution,
                friction: 0.1,
                render: {
                    fillStyle: randomColor,
                    strokeStyle: darkenColor(randomColor),
                    lineWidth: 2
                }
            });
            break;
        case 'square':
            newBody = Bodies.rectangle(x, y, randomSize, randomSize, {
                restitution: currentRestitution,
                friction: 0.1,
                render: {
                    fillStyle: randomColor,
                    strokeStyle: darkenColor(randomColor),
                    lineWidth: 2
                }
            });
            break;
        case 'triangle':
            newBody = Bodies.polygon(x, y, 3, randomSize / 1.5, {
                restitution: currentRestitution,
                friction: 0.1,
                render: {
                    fillStyle: randomColor,
                    strokeStyle: darkenColor(randomColor),
                    lineWidth: 2
                }
            });
            break;
        default:
            // 默认创建圆形
            newBody = Bodies.circle(x, y, randomSize / 2, {
                restitution: currentRestitution,
                friction: 0.1,
                render: {
                    fillStyle: randomColor,
                    strokeStyle: darkenColor(randomColor),
                    lineWidth: 2
                }
            });
    }

    // 添加到世界
    World.add(world, newBody);
    updateParticleCount();
    return newBody;
}

// 生成随机颜色
function getRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 60%)`;
}

// 使颜色变暗（用于边框）
function darkenColor(color) {
    // 如果是HSL格式
    if (color.startsWith('hsl')) {
        const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (match) {
            const h = match[1];
            const s = match[2];
            const l = Math.max(parseInt(match[3]) - 15, 0); // 降低亮度
            return `hsl(${h}, ${s}%, ${l}%)`;
        }
    }
    return color; // 如果无法解析，返回原始颜色
}

// 更新物体计数
function updateParticleCount() {
    const count = Composite.allBodies(world).length - 4; // 减去4个边界
    document.getElementById('particle-count').textContent = count;
}

// 清除所有非静态物体
function clearAllBodies() {
    const bodies = Composite.allBodies(world);
    
    // 过滤出非静态物体
    const bodiesToRemove = bodies.filter(body => !body.isStatic);
    
    // 从世界中移除这些物体
    World.remove(world, bodiesToRemove);
    
    // 更新计数
    updateParticleCount();
}

// 切换重力方向
function toggleGravity() {
    gravityDirection *= -1;
    engine.world.gravity.y = 1 * gravityDirection;
    
    // 添加视觉反馈
    const gravityBtn = document.getElementById('toggle-gravity');
    gravityBtn.classList.add('pulse');
    setTimeout(() => {
        gravityBtn.classList.remove('pulse');
    }, 1500);
    
    // 更新图标
    const icon = gravityBtn.querySelector('i');
    if (gravityDirection === 1) {
        icon.className = 'fas fa-arrow-down icon';
    } else {
        icon.className = 'fas fa-arrow-up icon';
    }
}

// 增加弹性
function increaseRestitution() {
    currentRestitution = Math.min(currentRestitution + 0.1, 1.0);
    document.getElementById('increase-bounce').classList.add('pulse');
    setTimeout(() => {
        document.getElementById('increase-bounce').classList.remove('pulse');
    }, 1500);
}

// 减少弹性
function decreaseRestitution() {
    currentRestitution = Math.max(currentRestitution - 0.1, 0.1);
    document.getElementById('decrease-bounce').classList.add('pulse');
    setTimeout(() => {
        document.getElementById('decrease-bounce').classList.remove('pulse');
    }, 1500);
}

// 随机改变所有物体的颜色
function randomizeColors() {
    const bodies = Composite.allBodies(world);
    
    // 过滤出非静态物体
    const dynamicBodies = bodies.filter(body => !body.isStatic);
    
    // 为每个物体设置新的随机颜色
    dynamicBodies.forEach(body => {
        const newColor = getRandomColor();
        body.render.fillStyle = newColor;
        body.render.strokeStyle = darkenColor(newColor);
    });
    
    // 添加视觉反馈
    document.getElementById('random-color').classList.add('pulse');
    setTimeout(() => {
        document.getElementById('random-color').classList.remove('pulse');
    }, 1500);
}

// 添加事件监听：鼠标点击时创建物体
Events.on(mouseConstraint, 'mousedown', (event) => {
    // 检查鼠标是否在现有物体上，如果是，则不创建新物体
    if (mouseConstraint.body) {
        return;
    }

    const mousePosition = event.mouse.position;
    // 默认创建随机形状
    const randomShape = ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)];
    createBody(mousePosition.x, mousePosition.y, randomShape);
});

// 添加按钮事件监听
document.addEventListener('DOMContentLoaded', () => {
    // 形状按钮
    document.getElementById('create-circle').addEventListener('click', () => {
        createBody(canvasWidth / 2, 100, 'circle');
    });
    
    document.getElementById('create-square').addEventListener('click', () => {
        createBody(canvasWidth / 2, 100, 'square');
    });
    
    document.getElementById('create-triangle').addEventListener('click', () => {
        createBody(canvasWidth / 2, 100, 'triangle');
    });
    
    // 物理属性按钮
    document.getElementById('toggle-gravity').addEventListener('click', toggleGravity);
    document.getElementById('increase-bounce').addEventListener('click', increaseRestitution);
    document.getElementById('decrease-bounce').addEventListener('click', decreaseRestitution);
    
    // 操作按钮
    document.getElementById('clear-all').addEventListener('click', clearAllBodies);
    document.getElementById('random-color').addEventListener('click', randomizeColors);
    
    // 初始化物体计数
    updateParticleCount();
});

// 运行渲染器和引擎
Render.run(render);
Runner.run(runner, engine);

console.log("2D 物理沙盒已初始化。使用控制面板创建和操作物体，或直接点击画布创建随机物体。");