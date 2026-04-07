# GSD 便携版安装指南 (Trae 国内版)

# 
# 给 AI 的说明：
# 
# 这是一个 GSD (Get Shit Done) 便携版安装包，用于 Trae IDE 国内版。
# 请按照以下步骤安装并验证。
# 

# ## 安装步骤

# ### 步骤 1: 解压文件
# 
# 将 `gsd-fixed-trae-cn.zip` 解压到任意目录

# ### 步骤 2: 运行安装脚本
# 
# 在解压目录中运行 PowerShell 脚本：
# 
# ```powershell
# cd <解压目录>\gsd-portable-package
# .\install.ps1
# ```
# 
# 鄨期输出：
# ```
# ✅ 创建目录: C:\Users\<用户名>\.trae-cn
# ✅ 复制 agents (18 个文件)
# ✅ 复制 commands (57 个文件)
# ✅ 复制 get-shit-done (133 个文件)
# ✅ 复制 hooks (5 个文件)
# ```

# ### 步骤 3: 修复所有 skills (重要!)
# 
# 全局 skills 默认使用 `.claude` 路径，需要修复：
# 
# ```powershell
# cd <解压目录>
# node fix-all-skills.js
# ```
# 
# 预期输出：
# ```
# FIXED: skill-manager/setup.js
# FIXED: hooks/skill-activation-prompt.ts
# FIXED: hooks/skill-verification-guard.ts
# FIXED: skill-developer/SKILL.md
# ...
# Done. Total files fixed: X
# ```

# ### 步骤 4: 验证安装
# 
# 在解压目录中运行：
# 
# ```powershell
# cd <解压目录>\gsd-portable-package\get-shit-done
# node bin\gsd-tools.cjs validate agents
# ```
# 
# 预期输出：
# ```json
# {
#   "agents_dir": "C:\\Users\\<用户名>\\.trae-cn\\agents",
#   "agents_found": true,
#   "installed": ["gsd-planner", "gsd-roadmapper", ...],
#   "missing": []
# }
# ```

# ## 验证命令清单

# | 命令 | 说明 | 预期结果 |
# |------|------|----------|
# | `node bin\gsd-tools.cjs path` | 显示 GSD 数据路径 | `C:\Users\<用户名>\.trae-cn\get-shit-done` |
# | `node bin\gsd-tools.cjs stats` | 显示项目统计信息 | JSON 统计对象 |
# | `node bin\gsd-tools.cjs validate agents` | 验证 agents 安装状态 | `missing: []` |
# | `node bin\gsd-tools.cjs init new-project --raw` | 初始化新项目 | `agents_installed: true` |

# ## 常见错误排除

# ### 错误 1: "Cannot find module"
# 
# **原因**: lib 目录文件缺失
# **解决**: 确保解压时包含完整的 `get-shit-done\bin\lib\` 目录（18 个 .cjs 文件）

# ### 错误 2: "agents 目录不存在"
# 
# **原因**: `.trae-cn` 目录未创建
# **解决**: 手动创建目录：
# ```powershell
# New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.trae-cn\agents"
# New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.trae-cn\commands\gsd"
# New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.trae-cn\get-shit-done"
# New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.trae-cn\hooks"
# ```

# ### 错误 3: "checkAgentsInstalled is not a function"
# 
# **原因**: core.cjs 导出缺失
# **解决**: 检查 `get-shit-done\bin\lib\core.cjs` 末尾的 `module.exports` 是否包含：
# - `getAgentsDir`
# - `checkAgentsInstalled`
# - `TRAE_CONFIG`

# ### 错误 4: 路径返回 `.claude` 而非 `.trae-cn`
# 
# **原因**: TRAE_CONFIG 未正确检测
# **解决**: 检查 `core.cjs` 中的 `TRAE_CONFIG` 配置是否包含自动检测 `.trae-cn` 的逻辑

# ### 错误 5: skills 使用错误路径
# 
# **原因**: 全局 skills 硬编码 `.claude`
# **解决**: 运行 `fix-all-skills.js` 修复所有 skills

# ## 文件清单

# 安装完成后用户目录下的 `.trae-cn` 应包含：
# 
# ```
# .trae-cn/
# ├── agents/          (18 个 .md 文件)
# ├── commands/
# │   └── gsd/         (57 个 .md 文件)
# ├── get-shit-done/   (完整目录)
# │   ├── bin/
# │   │   ├── lib/     (18 个 .cjs 文件)
# │   │   └── gsd-tools.cjs
# │   ├── references/  (15 个 .md 文件)
# │   ├── templates/   (35 个 .md 文件)
# │   └── workflows/   (48 个 .md 文件)
# ├── hooks/           (5 个 .js 文件)
# └── skills/          (全局 skills 目录，已修复)
#     └── skill-manager/
#         └── setup.js (已修复)
# ```

# ## 核心修复说明

# 本安装包已修复以下问题：
# 
# 1. **GSD 路径硬编码问题**: 原版硬编码 `.claude`，现已改为自动检测 `.trae-cn`
# 2. **模块导出缺失**: 添加了 `getAgentsDir` 和 `checkAgentsInstalled` 导出
# 3. **工作流路径变量**: 所有 workflow 文件已改用 `$GSD_BIN` 动态变量
# 4. **全局 skills 修复**: `fix-all-skills.js` 修复所有全局 skill 的路径问题
