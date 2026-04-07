# GSD Portable Installer for Windows
# 用法: .\install.ps1 [-Local]

param(
    [switch]$Local
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GSD Portable Installer for Trae IDE  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检测安装模式
$installMode = if ($Local) { "local" } else { "global" }
$traeDir = if ($Local) { ".\.trae" } else { "$env:USERPROFILE\.trae" }

Write-Host "安装模式: $installMode" -ForegroundColor Yellow
Write-Host "目标目录: $traeDir" -ForegroundColor Yellow
Write-Host ""

# 创建目标目录
$dirs = @(
    "$traeDir",
    "$traeDir\agents",
    "$traeDir\commands\gsd",
    "$traeDir\get-shit-done",
    "$traeDir\hooks"
)

foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
        Write-Host "✅ 创建目录: $dir" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "开始复制文件..." -ForegroundColor Yellow

# 复制 agents
xcopy /E /I /Y ".\agents\*" "$traeDir\agents\" | Out-Null
Write-Host "✅ 复制 agents (18 个文件)" -ForegroundColor Green

# 复制 commands
xcopy /E /I /Y ".\commands\*" "$traeDir\commands\" | Out-Null
Write-Host "✅ 复制 commands (57 个文件)" -ForegroundColor Green

# 复制 get-shit-done
xcopy /E /I /Y ".\get-shit-done\*" "$traeDir\get-shit-done\" | Out-Null
Write-Host "✅ 复制 get-shit-done (133 个文件)" -ForegroundColor Green

# 复制 hooks
xcopy /E /I /Y ".\hooks\*" "$traeDir\hooks\" | Out-Null
Write-Host "✅ 复制 hooks (5 个文件)" -ForegroundColor Green

# 复制配置文件
Copy-Item ".\config\gsd-file-manifest.json" "$traeDir\gsd-file-manifest.json" -Force
Copy-Item ".\config\package.json" "$traeDir\package.json" -Force
Copy-Item ".\config\settings.json" "$traeDir\settings.json" -Force
Copy-Item ".\config\gsd-config-yolo.json" "$traeDir\get-shit-done\templates\config.json" -Force
Write-Host "✅ 复制配置文件" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ 安装完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步操作：" -ForegroundColor Yellow
Write-Host "1. 重启 Trae IDE" -ForegroundColor White
Write-Host "2. 输入 /gsd:help 验证安装" -ForegroundColor White
Write-Host "3. 开始使用: /gsd:new-project" -ForegroundColor White
Write-Host ""
Write-Host "配置说明：" -ForegroundColor Yellow
Write-Host "- 模式: YOLO (全自动)" -ForegroundColor White
Write-Host "- 权限: 自动批准所有操作" -ForegroundColor White
Write-Host "- 并行: 已启用" -ForegroundColor White
Write-Host ""
