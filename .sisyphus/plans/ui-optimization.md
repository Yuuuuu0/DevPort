# DevPort UI 优化计划 - 精致工业风 + 电光蓝

## TL;DR

> **Quick Summary**: 将 DevPort 作品展示网站从橙色 accent 升级为电光蓝 (#00D9FF)，Hero 区域改为终端风格打字效果，增强 Framer Motion 动画，精致化工业风细节。
> 
> **Deliverables**:
> - 电光蓝配色方案 (dark/light mode)
> - 终端风格 Hero 组件 (打字效果 + 命令模拟)
> - 增强的组件动画 (hover glow, scroll reveal)
> - 精致化边框、阴影、光效细节
> 
> **Estimated Effort**: Medium (约 4-6 小时)
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Task 1 (颜色系统) → Task 2 (Hero) → Task 6 (集成验证)

---

## Context

### Original Request
用户选择了以下设计方向：
1. **设计风格：精致工业风** - 保持当前微圆角，增加更多精致细节和动效
2. **动画强度：Moderate (适中)** - 平衡的动画，丰富但不过度
3. **Hero 区域：终端风格介绍** - 模拟命令行界面的打字效果介绍
4. **Accent 颜色：电光蓝/青色** - 更科技感的冷色调 #00D9FF

### Interview Summary
**Key Discussions**:
- 当前 accent 颜色为橙色 `hsl(15 85% 55%)`，需改为电光蓝 `#00D9FF`
- 项目已使用 Framer Motion，有成熟的动画模式可扩展
- 无测试基础设施，使用 Playwright 视觉验证

**Research Findings**:
- 打字效果推荐使用 `typewriter-effect` 或自定义 Framer Motion 实现
- 电光蓝 glow 效果通过 `box-shadow` 实现
- 现有动画模式：fade-in, slide-up, stagger (delay: index * 0.1)

### Gap Analysis (Self-Review)
**Identified Gaps** (addressed):
- Light mode 颜色适配：在计划中明确包含
- i18n 支持：终端内容使用 i18n 配置
- 无障碍性：验证 WCAG 对比度
- prefers-reduced-motion：添加动画降级

---

## Work Objectives

### Core Objective
将 DevPort 的视觉风格从橙色工业风升级为电光蓝科技感，增强动效和交互细节。

### Concrete Deliverables
- `app/globals.css` - 更新后的电光蓝颜色变量
- `app/_components/terminal-hero.tsx` - 新的终端风格 Hero 组件
- `app/_components/home-client.tsx` - 集成终端 Hero
- `components/project-card.tsx` - 增强的卡片动画
- `components/layout/header.tsx` - 增强的 header 动效
- `components/layout/footer.tsx` - 增强的 footer 动效
- `components/social-links.tsx` - 增强的社交链接动效
- `app/projects/[id]/_components/project-detail-client.tsx` - 更新的项目详情样式
- `tailwind.config.ts` - 新增自定义动画 keyframes

### Definition of Done
- [ ] 所有 accent 颜色从橙色变为电光蓝
- [ ] Hero 区域显示终端风格打字效果
- [ ] Hover 时显示电光蓝 glow 效果
- [ ] Dark mode 和 Light mode 均正确显示
- [ ] 所有动画流畅，无性能问题
- [ ] `pnpm build` 构建成功

### Must Have
- 电光蓝 `#00D9FF` 作为新 accent 颜色
- 终端打字效果 (命令模拟风格)
- Hover glow 效果
- 保持现有 i18n 支持
- 保持响应式布局

### Must NOT Have (Guardrails)
- ❌ 不修改后台管理 UI (`/admin` 路径下的任何组件)
- ❌ 不添加新的 npm 依赖 (使用 Framer Motion 自定义打字效果)
- ❌ 不修改数据库或 API 逻辑
- ❌ 不改变字体选择
- ❌ 不重构组件架构
- ❌ 不添加新页面或路由
- ❌ 不过度使用 glow 效果 (仅 hover 状态)

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO
- **User wants tests**: NO (视觉验证)
- **Framework**: Playwright browser automation

### Automated Verification (Visual)

每个 TODO 包含 Playwright 浏览器自动化验证步骤：

**验证模式：**
1. 启动开发服务器 `pnpm dev`
2. 使用 Playwright 访问页面
3. 截图保存到 `.sisyphus/evidence/`
4. 验证关键元素的颜色、动画、交互状态

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: 更新颜色系统 (globals.css)
└── Task 2: 创建终端 Hero 组件

Wave 2 (After Wave 1):
├── Task 3: 增强 ProjectCard 动画
├── Task 4: 增强 Header/Footer 动效
└── Task 5: 增强 SocialLinks/ProjectDetail

Wave 3 (After Wave 2):
└── Task 6: 集成验证和微调

Critical Path: Task 1 → Task 3/4/5 → Task 6
Parallel Speedup: ~35% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 3, 4, 5 | 2 |
| 2 | None | 6 | 1 |
| 3 | 1 | 6 | 4, 5 |
| 4 | 1 | 6 | 3, 5 |
| 5 | 1 | 6 | 3, 4 |
| 6 | 2, 3, 4, 5 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 2 | `visual-engineering` with `playwright` skill |
| 2 | 3, 4, 5 | `visual-engineering` (parallel dispatch) |
| 3 | 6 | `visual-engineering` with `playwright` skill |

---

## TODOs

- [ ] 1. 更新颜色系统 - 电光蓝配色

  **What to do**:
  - 修改 `app/globals.css` 中的 `--accent` 变量
  - Dark mode: 使用 `#00D9FF` 的 HSL 值 `187 100% 50%`
  - Light mode: 调整为适合浅色背景的变体 `187 85% 45%`
  - 添加自定义 CSS 变量用于 glow 效果：
    ```css
    --accent-glow: 0 0 20px hsl(var(--accent) / 0.5);
    --accent-glow-strong: 0 0 30px hsl(var(--accent) / 0.7);
    ```
  - 在 `tailwind.config.ts` 中添加 glow 动画 keyframes

  **Must NOT do**:
  - 不修改非 accent 相关的颜色变量
  - 不改变 `--radius` 或其他布局相关变量

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: CSS 变量和 Tailwind 配置属于视觉工程领域
  - **Skills**: [`ui-ux-pro-max`]
    - `ui-ux-pro-max`: 颜色系统设计和无障碍性检查

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Task 3, 4, 5
  - **Blocked By**: None (can start immediately)

  **References**:
  
  **Pattern References**:
  - `app/globals.css:27-28` - 当前 accent 颜色定义位置 (`--accent: 15 85% 55%`)
  - `app/globals.css:59-60` - Dark mode accent 定义位置
  - `tailwind.config.ts:47-49` - Accent 颜色 Tailwind 映射

  **Documentation References**:
  - HSL 颜色转换: #00D9FF = hsl(187, 100%, 50%)
  - WCAG 对比度: 确保 accent 与 background 对比度 >= 4.5:1

  **Acceptance Criteria**:

  **Automated Verification**:
  ```bash
  # 验证 CSS 变量已更新
  grep -n "187 100% 50%" app/globals.css
  # 预期: 找到 --accent 定义

  # 验证 Tailwind 配置无语法错误
  pnpm build
  # 预期: 构建成功
  ```

  **For Frontend/UI changes** (using playwright skill):
  ```
  1. Navigate to: http://localhost:3000
  2. Wait for: page load complete
  3. Screenshot: .sisyphus/evidence/task-1-home-dark.png
  4. Execute: document.querySelector('.text-accent')?.computedStyleMap().get('color')
  5. Assert: 颜色值接近 rgb(0, 217, 255)
  ```

  **Commit**: YES
  - Message: `style(theme): change accent color to electric blue #00D9FF`
  - Files: `app/globals.css`, `tailwind.config.ts`
  - Pre-commit: `pnpm build`

---

- [ ] 2. 创建终端风格 Hero 组件

  **What to do**:
  - 创建新组件 `app/_components/terminal-hero.tsx`
  - 实现终端窗口 UI 样式：
    - 深色背景 + 细边框
    - 顶部标题栏 (可选：模拟按钮)
    - 等宽字体 (font-mono)
  - 使用 Framer Motion 实现打字效果：
    - 命令行提示符 `$`
    - 模拟输入命令 (如 `whoami`, `cat about.txt`)
    - 逐字符显示输出
    - 闪烁光标效果
  - 支持 i18n (从 context 获取文本)
  - 在 `home-client.tsx` 中替换或增强现有 Hero

  **Must NOT do**:
  - 不安装额外的 npm 依赖
  - 不移除现有的项目统计信息
  - 不破坏响应式布局

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: React 组件开发 + Framer Motion 动画
  - **Skills**: [`ui-ux-pro-max`]
    - `ui-ux-pro-max`: 动效设计和用户体验

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 6
  - **Blocked By**: None (can start immediately)

  **References**:
  
  **Pattern References**:
  - `app/_components/home-client.tsx:24-58` - 当前 Hero 区域实现
  - `components/project-card.tsx:25-28` - Framer Motion 动画模式
  - `app/globals.css:112-114` - `.prose code` 等宽字体样式

  **API/Type References**:
  - `lib/i18n/context.tsx` - useI18n hook 用法

  **External References**:
  - Framer Motion 打字效果: 使用 `animate` + `transition` 控制字符显示
  - 终端 UI 参考: `github.com/SouleymaneSy7/terminal-portfolio-website`

  **Acceptance Criteria**:

  **Automated Verification**:
  ```bash
  # 验证新组件文件存在
  ls app/_components/terminal-hero.tsx
  # 预期: 文件存在

  # 验证构建成功
  pnpm build
  # 预期: 无错误
  ```

  **For Frontend/UI changes** (using playwright skill):
  ```
  1. Navigate to: http://localhost:3000
  2. Wait for: selector "[data-testid='terminal-hero']" to be visible (10s timeout)
  3. Wait for: 3 seconds (观察打字动画)
  4. Screenshot: .sisyphus/evidence/task-2-terminal-hero.png
  5. Assert: 终端区域可见
  6. Assert: 有闪烁光标元素
  ```

  **Commit**: YES
  - Message: `feat(hero): add terminal-style typing effect hero component`
  - Files: `app/_components/terminal-hero.tsx`, `app/_components/home-client.tsx`
  - Pre-commit: `pnpm build`

---

- [ ] 3. 增强 ProjectCard 动画

  **What to do**:
  - 添加 hover glow 效果 (电光蓝 box-shadow)
  - 增强 hover 时的边框颜色过渡
  - 添加 `whileHover` 微动效：
    - 轻微放大 (scale: 1.02)
    - 阴影增强
  - 保持灰度→彩色的图片效果
  - 添加 `prefers-reduced-motion` 支持

  **Must NOT do**:
  - 不改变卡片基本布局
  - 不移除现有的角落装饰
  - 不添加过于夸张的动画

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Framer Motion 动画增强
  - **Skills**: [`ui-ux-pro-max`]
    - `ui-ux-pro-max`: 微交互设计

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 4, 5)
  - **Blocks**: Task 6
  - **Blocked By**: Task 1

  **References**:
  
  **Pattern References**:
  - `components/project-card.tsx:33` - 当前 hover 边框效果 (`group-hover:border-accent`)
  - `components/project-card.tsx:46` - 图片灰度效果
  - `components/project-card.tsx:31` - 阴影偏移效果

  **Documentation References**:
  - Framer Motion `whileHover`: https://www.framer.com/motion/gestures/#hover
  - CSS `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

  **Acceptance Criteria**:

  **Automated Verification**:
  ```bash
  # 验证文件已修改
  git diff components/project-card.tsx | grep -c "whileHover"
  # 预期: 至少 1 处

  pnpm build
  # 预期: 构建成功
  ```

  **For Frontend/UI changes** (using playwright skill):
  ```
  1. Navigate to: http://localhost:3000
  2. Wait for: selector ".group" (项目卡片)
  3. Screenshot: .sisyphus/evidence/task-3-card-default.png
  4. Hover: first project card
  5. Wait for: 500ms (动画完成)
  6. Screenshot: .sisyphus/evidence/task-3-card-hover.png
  7. Assert: hover 状态有 glow 效果
  ```

  **Commit**: YES (groups with Task 4, 5)
  - Message: `style(cards): enhance project card hover animations with glow effect`
  - Files: `components/project-card.tsx`
  - Pre-commit: `pnpm build`

---

- [ ] 4. 增强 Header/Footer 动效

  **What to do**:
  - **Header**:
    - Logo hover 时添加 glow 效果
    - "System Online" 状态指示器改用电光蓝
    - 添加更平滑的入场动画
  - **Footer**:
    - 版本标签添加电光蓝装饰
    - 链接 hover 效果增强
    - 添加底部边框 glow 效果 (微妙)

  **Must NOT do**:
  - 不改变 header 的粘性定位逻辑
  - 不添加过于复杂的动画
  - 不影响导航功能

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 布局组件视觉增强
  - **Skills**: []
    - 无需额外技能，标准 Tailwind + Framer Motion

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 3, 5)
  - **Blocks**: Task 6
  - **Blocked By**: Task 1

  **References**:
  
  **Pattern References**:
  - `components/layout/header.tsx:24` - Logo 样式 (`group-hover:bg-accent`)
  - `components/layout/header.tsx:41` - "System Online" 指示器 (当前绿色)
  - `components/layout/footer.tsx:19` - 版本标签电光蓝装饰

  **Acceptance Criteria**:

  **For Frontend/UI changes** (using playwright skill):
  ```
  1. Navigate to: http://localhost:3000
  2. Screenshot: .sisyphus/evidence/task-4-header.png
  3. Hover: header logo
  4. Wait for: 300ms
  5. Screenshot: .sisyphus/evidence/task-4-header-hover.png
  6. Scroll to: bottom
  7. Screenshot: .sisyphus/evidence/task-4-footer.png
  ```

  **Commit**: YES (groups with Task 3, 5)
  - Message: `style(layout): enhance header and footer with electric blue accents`
  - Files: `components/layout/header.tsx`, `components/layout/footer.tsx`
  - Pre-commit: `pnpm build`

---

- [ ] 5. 增强 SocialLinks 和 ProjectDetail 样式

  **What to do**:
  - **SocialLinks**:
    - 按钮 hover 时添加 glow 效果
    - 图标 hover 时颜色过渡到电光蓝
    - 添加交错入场动画 (已有，可增强)
  - **ProjectDetail**:
    - 角落装饰改用电光蓝
    - "View Demo" 按钮增强 (glow + hover 动效)
    - 侧边装饰条改用电光蓝
    - 添加滚动揭示动画 (`whileInView`)

  **Must NOT do**:
  - 不改变 Markdown 内容渲染逻辑
  - 不影响项目 URL 跳转功能

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 组件视觉增强
  - **Skills**: []
    - 无需额外技能

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 3, 4)
  - **Blocks**: Task 6
  - **Blocked By**: Task 1

  **References**:
  
  **Pattern References**:
  - `components/social-links.tsx:89` - 按钮 hover 样式
  - `app/projects/[id]/_components/project-detail-client.tsx:49` - 侧边装饰条
  - `app/projects/[id]/_components/project-detail-client.tsx:81-84` - 角落装饰

  **Acceptance Criteria**:

  **For Frontend/UI changes** (using playwright skill):
  ```
  1. Navigate to: http://localhost:3000
  2. Screenshot: .sisyphus/evidence/task-5-social-links.png
  3. Hover: first social link
  4. Screenshot: .sisyphus/evidence/task-5-social-hover.png
  5. Click: first project card (进入详情)
  6. Wait for: navigation complete
  7. Screenshot: .sisyphus/evidence/task-5-project-detail.png
  8. Assert: 角落装饰为电光蓝
  ```

  **Commit**: YES (groups with Task 3, 4)
  - Message: `style(components): enhance social links and project detail with electric blue`
  - Files: `components/social-links.tsx`, `app/projects/[id]/_components/project-detail-client.tsx`
  - Pre-commit: `pnpm build`

---

- [ ] 6. 集成验证和微调

  **What to do**:
  - 完整页面走查 (首页 → 项目详情 → 返回)
  - 验证 dark mode / light mode 切换
  - 验证响应式布局 (mobile / tablet / desktop)
  - 检查动画性能 (无卡顿)
  - 微调任何不协调的颜色或动效
  - 确保 `pnpm build` 成功
  - 生成最终验证截图

  **Must NOT do**:
  - 不进行大规模重构
  - 不添加新功能

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 最终视觉验收
  - **Skills**: [`playwright`]
    - `playwright`: 多设备截图和自动化验证

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (final)
  - **Blocks**: None
  - **Blocked By**: Task 2, 3, 4, 5

  **References**:
  
  **Pattern References**:
  - 所有前述任务的文件变更

  **Acceptance Criteria**:

  **Automated Verification**:
  ```bash
  # 最终构建验证
  pnpm build
  # 预期: 成功，无警告

  # 检查 lint
  pnpm lint
  # 预期: 无错误
  ```

  **For Frontend/UI changes** (using playwright skill):
  ```
  # Desktop 验证
  1. Set viewport: 1920x1080
  2. Navigate to: http://localhost:3000
  3. Wait for: 3 seconds (动画完成)
  4. Screenshot: .sisyphus/evidence/final-home-desktop.png
  5. Click: first project card
  6. Wait for: navigation complete
  7. Screenshot: .sisyphus/evidence/final-detail-desktop.png

  # Mobile 验证
  8. Set viewport: 390x844
  9. Navigate to: http://localhost:3000
  10. Screenshot: .sisyphus/evidence/final-home-mobile.png

  # Light mode 验证 (如果支持切换)
  11. Toggle: light mode
  12. Screenshot: .sisyphus/evidence/final-home-light.png
  ```

  **Commit**: YES
  - Message: `chore: complete UI optimization with electric blue theme`
  - Files: 任何微调的文件
  - Pre-commit: `pnpm build && pnpm lint`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `style(theme): change accent color to electric blue #00D9FF` | globals.css, tailwind.config.ts | pnpm build |
| 2 | `feat(hero): add terminal-style typing effect hero component` | terminal-hero.tsx, home-client.tsx | pnpm build |
| 3, 4, 5 | `style(ui): enhance components with electric blue accents and glow effects` | 多个组件文件 | pnpm build |
| 6 | `chore: complete UI optimization with electric blue theme` | 微调文件 | pnpm build && pnpm lint |

---

## Success Criteria

### Verification Commands
```bash
# 构建验证
pnpm build  # Expected: 成功

# Lint 验证
pnpm lint   # Expected: 无错误

# 开发服务器
pnpm dev    # Expected: http://localhost:3000 正常访问
```

### Final Checklist
- [ ] 所有 accent 颜色为电光蓝 (#00D9FF)
- [ ] Hero 显示终端打字效果
- [ ] 卡片 hover 有 glow 效果
- [ ] Header logo hover 有 glow 效果
- [ ] 项目详情角落装饰为电光蓝
- [ ] Dark mode 正常显示
- [ ] Light mode 正常显示 (如适用)
- [ ] Mobile 响应式正常
- [ ] 动画流畅无卡顿
- [ ] 构建成功，无警告
