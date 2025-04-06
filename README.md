[English Version](README_EN.md) | 中文版

# 2D物理沙盒游戏

一个具有现代化UI设计的交互式2D物理沙盒游戏，让用户能够在画布上创建和操作各种物理元素，体验有趣的物理模拟效果。

## 特点

- 🎨 现代化UI设计
  - 清新优雅的界面布局
  - 响应式设计，适配各种屏幕尺寸
  - 动画效果和视觉反馈
  - 自定义主题色彩系统

- 🎮 交互功能
  - 直观的控制面板
  - 圆形工具按钮
  - 悬浮提示信息
  - 粒子效果实时指示器

- 🔧 物理模拟
  - 实时物理引擎
  - 多种物理元素
  - 粒子效果系统
  - 流畅的动画效果

## 技术栈

- HTML5 Canvas - 绘制和渲染
- CSS3 - 现代化界面样式
- JavaScript - 物理引擎和交互逻辑

## 安装

1. 克隆项目到本地：
```bash
git clone https://github.com/zym9863/2D-Physics-Sandbox.git
```

2. 使用支持现代Web标准的浏览器打开 `index-modern.html` 文件

## 使用说明

1. 打开游戏后，你会看到一个带有控制面板的画布界面
2. 使用控制面板中的工具按钮来：
   - 创建不同类型的物理元素
   - 调整模拟参数
   - 控制物理模拟的运行
3. 在画布上点击和拖动来与物理元素交互
4. 观察粒子效果指示器来了解当前系统状态

## 自定义主题

游戏使用CSS变量系统来管理主题颜色，你可以在 `modern-style.css` 文件中修改以下变量来自定义界面外观：

```css
:root {
    --primary-color: #3498db;
    --secondary-color: #2ecc71;
    --accent-color: #e74c3c;
    --background-color: #ecf0f1;
    --panel-color: #ffffff;
    --text-color: #2c3e50;
}
```

## 贡献

欢迎提交问题和改进建议！