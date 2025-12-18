# 多语言支持指南

## 概述

项目前台支持简体中文和英语两种语言，后台不需要多语言支持。

## 前台多语言

### 语言切换
- 页面右上角有语言切换按钮（地球图标）
- 支持简体中文（zh）和英语（en）
- 默认语言为简体中文
- 语言选择会保存在 localStorage 中，刷新页面后保持

### 翻译文件
翻译内容定义在 `lib/i18n/translations.ts` 中，可以在此添加新的翻译键值。

## 项目内容多语言处理方案

### 数据存储格式

项目内容使用两个独立的字段存储：
- `contentZh`: 中文内容（Markdown 格式）
- `contentEn`: 英文内容（Markdown 格式）

两个字段都是可选的，可以为空。

### 后台编辑

在后台编辑项目时：
1. 项目内容区域有语言标签页（简体中文 / English）
2. 可以分别编辑中文和英文内容
3. 保存时分别存储到对应的字段
4. 如果某个语言为空，则对应字段存储为 `null`

### 前台显示

前台会根据用户当前选择的语言自动显示对应内容：
- 如果当前语言的内容存在，显示当前语言的内容
- 如果当前语言的内容不存在，按优先级回退：zh → en
- 如果所有语言都不存在，显示空内容

## 使用示例

### 在组件中使用翻译

```tsx
'use client'

import { useI18n } from '@/lib/i18n/context'

export function MyComponent() {
  const { t, locale, setLocale } = useI18n()
  
  return (
    <div>
      <h1>{t.common.projects}</h1>
      <button onClick={() => setLocale('en')}>Switch to English</button>
    </div>
  )
}
```

### 在客户端组件中显示多语言内容

```tsx
'use client'

import { useI18n } from '@/lib/i18n/context'

export function ProjectContent({ project }: { project: ProjectData }) {
  const { locale } = useI18n()
  const content = locale === 'en' 
    ? (project.contentEn || project.contentZh || '')
    : (project.contentZh || project.contentEn || '')
  
  return <div>{content}</div>
}
```

## 扩展新语言

如需添加新语言（如日语、韩语等）：

1. 在 `lib/i18n/translations.ts` 中添加新语言的翻译
2. 更新 `Locale` 类型定义
3. 在语言切换器中添加新选项
4. 在 Prisma schema 中添加新的内容字段（如 `contentJa`）
5. 更新类型定义和 Repository/Service 层
6. 更新后台表单组件，添加新语言的编辑标签页
7. 更新前台显示逻辑，添加新语言的回退优先级

## 注意事项

1. 后台编辑界面保持中文，不进行多语言处理
2. 项目名称（`name`）字段暂不支持多语言，如需支持可以类似处理
3. 图片路径是通用的，不需要多语言处理
4. 演示链接（`demoUrl`）是通用的，不需要多语言处理

