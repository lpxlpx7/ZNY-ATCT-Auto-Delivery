# ZNY Departure Director

基于 `data` 目录中 KJFK、KEWR、KLGA、KPHL 规则数据的本地起飞决策辅助网页。

## 启动

双击 `start.bat`。浏览器会自动打开 `http://localhost:8765/`，保持命令窗口运行即可。

页面必须通过本地服务器打开，因为浏览器会阻止直接从 `file://` 页面读取 JSON 数据。程序不需要 Node.js，也不会访问或上传本地规则数据。

## 数据

应用启动时直接加载：

- `data/kjfk/atct-cab.json`
- `data/kewr/departure.json`
- `data/klga/departure.json`
- `data/kphl/departure.json`

修改 JSON 后刷新页面即可看到新结果，无需重新构建。

> 本工具仅用于模拟管制决策辅助。实际使用前必须核对有效 SOP、实时机场构型、空域所有权及协调要求。
