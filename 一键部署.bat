@echo off
chcp 65001 >nul
echo ========================================
echo   产品介绍页面 - 一键准备部署文件
echo ========================================
echo.

set SOURCE_DIR=%~dp0
set DEPLOY_DIR=%USERPROFILE%\Desktop\product-deploy

echo [1/5] 创建部署文件夹...
mkdir "%DEPLOY_DIR%" 2>nul
echo       已创建: %DEPLOY_DIR%

echo.
echo [2/5] 复制主页面文件...
copy "%SOURCE_DIR%download-page.html" "%DEPLOY_DIR%\" >nul
copy "%SOURCE_DIR%stats-panel.html" "%DEPLOY_DIR%\" >nul
echo       已复制: download-page.html, stats-panel.html

echo.
echo [3/5] 复制配置文件...
xcopy "%SOURCE_DIR%config" "%DEPLOY_DIR%\config\" /E /I /Y >nul
echo       已复制: config/

echo.
echo [4/5] 复制JS文件...
xcopy "%SOURCE_DIR%js" "%DEPLOY_DIR%\js\" /E /I /Y >nul
echo       已复制: js/

echo.
echo [5/5] 复制样式文件...
xcopy "%SOURCE_DIR%styles" "%DEPLOY_DIR%\styles\" /E /I /Y >nul
echo       已复制: styles/

echo.
echo ========================================
echo   部署文件已准备完成！
echo ========================================
echo.
echo 文件位置: %DEPLOY_DIR%
echo.
echo 下一步:
echo   1. 打开 https://github.com 创建仓库
echo   2. 上传这个文件夹
echo   3. 连接 Vercel 部署
echo.
echo 或者直接访问 https://app.netlify.com
echo   拖拽这个文件夹进行部署
echo.
pause
