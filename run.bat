@echo off  
start cmd /k "title 服务器窗口 && cd ./server && yarn start"
start cmd /k "title 前台窗口 && yarn react-start"