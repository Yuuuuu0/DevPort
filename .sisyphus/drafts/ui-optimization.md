# Draft: DevPort UI 优化计划

## Requirements (confirmed)

### 用户选择的设计方向
- **设计风格**: 精致工业风 - 保持当前微圆角，增加更多精致细节和动效
- **动画强度**: Moderate (适中) - 平衡的动画，丰富但不过度
- **Hero 区域**: 终端风格介绍 - 模拟命令行界面的打字效果介绍
- **Accent 颜色**: 电光蓝/青色 #00D9FF - 更科技感的冷色调

## Technical Decisions

### 当前技术栈
- Next.js 16 + React 18 + TypeScript
- Tailwind CSS + shadcn/ui 组件库
- Framer Motion 动画 (已在项目中广泛使用)
- lucide-react 图标
- 字体: Chakra Petch (heading) + Manrope (body)

### 当前 UI 特征
- 方角设计 (radius 0.25rem)
- 网格背景图案 (linear-gradient grid with radial-gradient mask)
- 角落括号装饰 `[ ]` (在 project-card 和 project-detail 中)
- 大写标题 + tracking-tight
- 灰度图片 hover 变彩色效果
- PRJ-00X 项目编号标签
- "System Online" 状态指示器
- 当前橙色 accent: hsl(15 85% 55%)

### 颜色方案决策
- 新 accent 颜色: #00D9FF (电光蓝)
- HSL 转换: hsl(187 100% 50%) 或近似值
- 需要确保暗色主题下的对比度和可访问性
- 添加 glow/neon 效果用于强调元素

### 现有 Framer Motion 使用模式
- fade-in + slide-up: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`
- 交错动画: `delay: index * 0.1` (ProjectCard)
- 过渡时长: 0.5s - 0.6s

## Research Findings

### 终端打字效果
- **推荐库**: `typewriter-effect` (文档完善，Next.js 支持好)
- **备选**: `react-simple-typewriter` (更轻量)
- **自定义实现**: 可使用 Framer Motion + useState/setTimeout
- **参考**: SouleymaneSy7/terminal-portfolio-website (Next.js + TypeScript + Tailwind)

### 工业风 UI 设计模式
- 2026 趋势: "精致工业" 美学，强调清晰度和减少认知负担
- Siemens Design Systems 是工业 UI 的优秀参考
- 使用微妙的光效、边框和阴影创造深度感
- 微交互应有目的性，提供清晰反馈

### 电光蓝颜色使用
- 需要确保与背景的对比度满足 WCAG AA/AAA
- 使用 box-shadow 或 drop-shadow 实现 glow 效果
- 应谨慎使用，用于吸引关键元素注意力

### Framer Motion 动画模式
- 滚动触发动画: useScroll 或 whileInView
- 列表交错效果: staggerChildren
- 页面过渡: AnimatePresence
- 参考: russinmotion.com/motion

## Scope Boundaries

### INCLUDE (在范围内)
1. globals.css 颜色变量更新 (accent 从橙色改为电光蓝)
2. Hero 区域改为终端风格打字效果
3. 增强 Framer Motion 动画 (适中强度)
4. 精致化工业风细节 (光效、边框、阴影)
5. 更新所有使用 accent 颜色的组件
6. 涉及组件:
   - app/globals.css
   - app/_components/home-client.tsx
   - components/project-card.tsx
   - components/layout/header.tsx
   - components/layout/footer.tsx
   - components/social-links.tsx
   - app/projects/[id]/_components/project-detail-client.tsx
   - tailwind.config.ts (如需添加自定义动画)

### EXCLUDE (不在范围内)
- 后台管理界面的 UI 更新
- 数据库或 API 相关修改
- 新功能开发
- 字体更换
- 响应式布局调整 (除非与动画相关)

## Decisions Applied (Defaults)

### 终端 Hero 设计 → 命令模拟风格
- 显示模拟命令如 `$ whoami` → "Developer", `$ cat skills.txt` → 技能列表
- 包含闪烁光标效果
- 更科技感且符合"终端风格"的定义
- 用户可在计划执行前覆盖此决策

### Glow 效果 → 微妙 Hover Glow
- 默认无发光，hover 时显示柔和的电光蓝 glow
- 优雅且不分散注意力
- 用户可在计划执行前覆盖此决策

## Test Strategy Decision

- **Infrastructure exists**: NO (没有找到测试文件或测试配置)
- **User wants tests**: NO (应用默认 - 仅视觉验证)
- **QA approach**: Manual verification 通过 Playwright 浏览器自动化截图
