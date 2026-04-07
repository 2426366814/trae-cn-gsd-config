# GSD 便携版安装指南 (Trae 国内版)

## 快速安装

### 1. 解压文件
将 `gsd-fixed-export.zip` 解压到任意目录，例如 `D:\gsd-install`

### 2. 运行安装脚本
在解压目录中运行：
```powershell
cd D:\gsd-install\gsd-fixed-export\gsd-portable-package
.\install.ps1
```

### 3. 验证安装
```powershell
cd $env:USERPROFILE\.trae-cn\get-shit-done
node bin\gsd-tools.cjs path
node bin\gsd-tools.cjs validate agents
```

预期输出：
- `path` 返回: `C:\Users\你的用户名\.trae-cn\get-shit-done`
- `validate agents` 返回所有 agents 已安装，`missing: []`

---

## 常见错误排除

### 错误1: "Cannot find module"
**原因**: lib 目录文件缺失
**解决**: 确保解压时包含完整的 `get-shit-done\bin\lib\` 目录

### 错误2: "agents 目录不存在"
**原因**: `.trae-cn` 目录未创建
**解决**: 手动创建目录
```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.trae-cn\agents"
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.trae-cn\commands\gsd"
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.trae-cn\get-shit-done"
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.trae-cn\hooks"
```

### 错误3: "checkAgentsInstalled is not a function"
**原因**: core.cjs 导出缺失
**解决**: 检查 `core.cjs` 末尾的 `module.exports` 是否包含 `getAgentsDir` 和 `checkAgentsInstalled`

### 错误4: 路径返回 `.claude` 而非 `.trae-cn`
**原因**: TRAE_CONFIG 未正确检测
**解决**: 检查 `core.cjs` 中的 `TRAE_CONFIG` 配置是否包含自动检测逻辑

---

## 文件清单

安装完成后，`.trae-cn` 目录应包含：
```
.trae-cn/
├── agents/           (18 个 .md 文件)
├── commands/
│   └── gsd/          (57 个 .md 文件)
├── get-shit-done/
│   └── bin/
│       ├── gsd-tools.cjs
│       └── lib/        (18 个 .cjs 文件)
├── hooks/            (5 个 .js 文件)
├── gsd-file-manifest.json
├── package.json
└── settings.json
```

---

## 核心文件说明

| 文件 | 作用 |
|------|------|
| `core.cjs` | 核心模块，包含 TRAE_CONFIG 自动检测 |
| `gsd-tools.cjs` | CLI 入口，所有命令的入口点 |
| `init.cjs` | 初始化命令，包含 agent-skills |

---

## 给 AI 的安装提示词

复制以下内容发给 AI：

```
请帮我安装 GSD 便携版：

1. 解压 gsd-fixed-export.zip 到当前目录
2. 进入 gsd-portable-package 目录运行 install.ps1
3. 验证安装: node bin/gsd-tools.cjs validate agents
4. 如果有错误，检查 .trae-cn 目录结构是否完整

安装目标: C:\Users\你的用户名\.trae-cn\
```
