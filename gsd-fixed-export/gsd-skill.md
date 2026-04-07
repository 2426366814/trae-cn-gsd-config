---
name: gsd
description: GSD (Get Shit Done) 工作流调用器 - 一键执行GSD命令进行项目管理、任务规划、代码执行等
keywords:
  - gsd
  - get shit done
  - 任务管理
  - 项目规划
  - 执行
  - plan
  - do
  - execute
---

# GSD 工作流调用器

直接调用GSD (Get Shit Done) 工作流系统。

## 触发关键词

- "gsd" 或 "GSD"
- "get shit done"
- "任务规划"
- "执行任务"
- "项目管理"

## 快速命令

### 状态查看
```bash
gsd stats          # 查看项目统计
gsd progress       # 查看进度
gsd health         # 健康检查
```

### 项目初始化
```bash
gsd init           # 初始化GSD
gsd new-project    # 创建新项目
gsd new-milestone  # 创建新里程碑
```

### 任务管理
```bash
gsd add-todo       # 添加待办
gsd add-phase      # 添加阶段
gsd add-tests      # 添加测试
```

### 执行工作流
```bash
gsd plan-phase     # 规划阶段
gsd execute-phase  # 执行阶段
gsd do             # 执行任务
gsd verify-work    # 验证工作
```

### 验证
```bash
gsd validate agents    # 验证代理
gsd validate health    # 验证健康
gsd validate phase     # 验证阶段
```

## 使用方式

当用户说：
- "gsd stats" → 执行 `node ~/.trae-cn/get-shit-done/bin/gsd-tools.cjs stats`
- "gsd init" → 执行初始化工作流
- "gsd plan" → 执行规划工作流
- "gsd do" → 执行任务工作流

## 工作流说明

GSD是一个完整的项目管理工作流系统：

1. **规划阶段** (plan-phase) - 分析需求，制定计划
2. **执行阶段** (execute-phase) - 按计划执行任务
3. **验证阶段** (verify-phase) - 验证完成情况
4. **完成阶段** (complete-milestone) - 完成里程碑

## 代理系统

GSD包含多个专业代理：

- **gsd-planner** - 任务规划专家
- **gsd-executor** - 任务执行专家
- **gsd-debugger** - 调试专家
- **gsd-verifier** - 验证专家
- **gsd-roadmapper** - 路线图专家

## 示例用法

```
用户: gsd stats
→ 显示项目统计信息

用户: gsd init
→ 初始化当前项目

用户: gsd plan-phase 1
→ 规划第1阶段任务

用户: gsd do
→ 执行当前任务
```
