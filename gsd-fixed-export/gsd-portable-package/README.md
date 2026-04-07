# GSD Fixed Export - Trae 国内版兼容

## 修改内容

### 核心文件
- `get-shit-done/bin/lib/core.cjs` - 添加 TRAE_CONFIG、getGsdDir()、getGsdBinDir()
- `get-shit-done/bin/gsd-tools.cjs` - 添加 `path` 命令

### Workflow 文件 (48个)
所有 workflow 文件已更新：
- 动态 GSD_BIN 变量检测
- 替换硬编码的 `$HOME/.claude` 路径

### Reference 文件 (6个)
- planning-config.md
- phase-argument-parsing.md
- git-planning-commit.md
- git-integration.md
- decimal-phase-calculation.md
- user-profiling.md

### Template 文件
- UAT.md
- 其他模板

## 安装方法

### 方法1：覆盖安装
将此文件夹内容复制到你的 GSD 安装目录：

**Trae 国内版：**
```
C:\Users\<用户名>\.trae-cn\get-shit-done\
```

**Claude 国际版：**
```
C:\Users\<用户名>\.claude\get-shit-done\
```

### 方法2：完整替换
如果你是全新安装，直接将整个 `gsd-portable-package` 文件夹复制到：
```
C:\Users\<用户名>\.trae-cn\
```
然后重命名为 `get-shit-done`

## 新增命令

```bash
# 获取 GSD 目录
node gsd-tools.cjs path gsd

# 获取 GSD bin 目录
node gsd-tools.cjs path gsd-bin

# 获取配置目录
node gsd-tools.cjs path config

# 获取 agents 目录
node gsd-tools.cjs path agents

# 获取 skills 目录
node gsd-tools.cjs path skills
```

## 变量说明

| 变量 | 描述 |
|------|------|
| `$GSD_BIN` | GSD bin 目录路径 |
| `$GSD_DIR` | GSD 根目录路径 |
| `$CONFIG_DIR` | 配置目录 (.trae-cn 或 .claude) |

## 自动检测逻辑

系统会自动检测：
1. `.trae-cn` (Trae 国内版) - 优先
2. `.claude` (Claude 国际版) - 备选

## 修改的文件列表

### 核心文件
```
get-shit-done/
├── bin/
│   ├── gsd-tools.cjs
│   └── lib/
│       └── core.cjs
├── workflows/ (48个 .md 文件)
├── references/ (6个 .md 文件)
└── templates/ (多个 .md 文件)
```

## 验证安装

运行以下命令验证安装是否正确：

```bash
node -e "const core = require('path/to/core.cjs'); console.log(core.TRAE_CONFIG.paths);"
```

应该输出：
```json
{
  "base": "C:\\Users\\<用户名>\\.trae-cn",
  "gsd": "C:\\Users\\<用户名>\\.trae-cn\\get-shit-done",
  "gsdBin": "C:\\Users\\<用户名>\\.trae-cn\\get-shit-done\\bin",
  ...
}
```
