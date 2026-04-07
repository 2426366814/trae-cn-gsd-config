---
name: gsd-deploy
description: 一键部署GSD (Get Shit Done) 配置到Trae国内版 - 自动安装agents、commands、workflows和用户规则
keywords:
  - gsd
  - deploy
  - install
  - setup
  - trae-cn
  - 配置
  - 部署
  - 安装
---

# GSD 一键部署

自动部署GSD (Get Shit Done) 配置到Trae国内版。

## 触发条件

当用户说以下关键词时触发：
- "部署GSD"
- "安装GSD"
- "配置GSD"
- "gsd deploy"
- "gsd install"

## 部署流程

### 步骤1: 检测环境

```javascript
// 检测Trae国内版配置目录
const HOME = process.env.USERPROFILE || process.env.HOME;
const traeCnDir = path.join(HOME, '.trae-cn');
const traeDir = path.join(HOME, '.trae');

let configDir = traeCnDir;
if (!fs.existsSync(traeCnDir) && fs.existsSync(traeDir)) {
  configDir = traeDir;
}

console.log(`配置目录: ${configDir}`);
```

### 步骤2: 下载配置包

从GitHub下载最新配置：
- 仓库: https://github.com/2426366814/trae-cn-gsd-config
- 分支: main

### 步骤3: 安装组件

安装以下组件到 `${configDir}`:

1. **Agents** (GSD代理)
   - gsd-planner.md
   - gsd-executor.md
   - gsd-debugger.md
   - gsd-verifier.md
   - gsd-roadmapper.md
   - 等18个代理

2. **Commands** (GSD命令)
   - commands/gsd/*.md (50+命令)

3. **Workflows** (工作流)
   - get-shit-done/workflows/*.md

4. **User Rules** (用户规则)
   - 复制个人规则.md内容到 user_rules/global.md

### 步骤4: 验证安装

运行验证命令：
```bash
node ~/.trae-cn/get-shit-done/bin/gsd-tools.cjs stats
```

## 快速安装命令

### PowerShell一键安装

```powershell
# 下载并执行安装脚本
$scriptUrl = "https://raw.githubusercontent.com/2426366814/trae-cn-gsd-config/main/gsd-fixed-export/gsd-portable-package/install.ps1"
Invoke-Expression (Invoke-RestMethod $scriptUrl)
```

### 手动安装

1. 克隆仓库：
```bash
git clone https://github.com/2426366814/trae-cn-gsd-config.git
```

2. 复制文件：
```powershell
$dest = "$env:USERPROFILE\.trae-cn"
Copy-Item -Path "trae-cn-gsd-config\gsd-fixed-export\gsd-portable-package\*" -Destination $dest -Recurse -Force
```

3. 复制用户规则：
```powershell
$content = Invoke-RestMethod "https://raw.githubusercontent.com/2426366814/trae-cn-gsd-config/main/个人规则.md"
New-Item -Path "$env:USERPROFILE\.trae-cn\user_rules" -ItemType Directory -Force
Set-Content -Path "$env:USERPROFILE\.trae-cn\user_rules\global.md" -Value $content
```

## 验证安装成功

安装完成后，运行以下命令验证：

```bash
# 查看GSD状态
node ~/.trae-cn/get-shit-done/bin/gsd-tools.cjs stats

# 验证agents
node ~/.trae-cn/get-shit-done/bin/gsd-tools.cjs validate agents

# 验证健康状态
node ~/.trae-cn/get-shit-done/bin/gsd-tools.cjs validate health
```

## 更新配置

```powershell
# 拉取最新配置
Set-Location "trae-cn-gsd-config"
git pull origin main

# 重新安装
Copy-Item -Path "gsd-fixed-export\gsd-portable-package\*" -Destination "$env:USERPROFILE\.trae-cn" -Recurse -Force
```

## 常见问题

### Q: 如何确认是Trae国内版还是国际版？

检查配置目录：
- 国内版: `~/.trae-cn`
- 国际版: `~/.claude`

### Q: 安装后GSD命令不生效？

1. 确认配置目录正确
2. 重启Trae IDE
3. 检查文件权限

### Q: 如何卸载？

```powershell
Remove-Item -Path "$env:USERPROFILE\.trae-cn\get-shit-done" -Recurse -Force
Remove-Item -Path "$env:USERPROFILE\.trae-cn\agents\gsd-*" -Force
Remove-Item -Path "$env:USERPROFILE\.trae-cn\commands\gsd" -Recurse -Force
```
