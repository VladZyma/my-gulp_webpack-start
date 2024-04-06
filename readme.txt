------------------- 04.04.24 -------------------
GULP + WEBPACK + BABEL
HTML,SCSS,JS,IMG(avif,webp,svg sprite),FONTS
------------------------------------------------

===================================================
================ INSTALLATION =====================
===================================================
1. initializing project
- npm init;
2. installation gulp into project
!!! встановити 4 версію !!!
-npm i gulp -D;

===================================================
=================== CONFIG ========================
===================================================
1. create .gitignore;
2. create gulpfile.js;
3. create webpack.config.js
4. config prettier in package.json;
5. config browserslist in package.json;
6. delete example files.

===================================================
================ APP STRUCTURE ====================
===================================================
1. create folder src or app (for initial files);
2. create folder dist or docs (for production);

===================================================
=========== INSIDE folder src or app ==============
===================================================
1. files: index.html;
2. folders: 
  -pages
  -components (header, footer, sections...)
  -scss (style, _vars, _mixins, _global, _reset, _fonts, _media, _libs)
  -js
  -images
  -fonts

================== !!!!!!! =======================================
"src(["app/js/*.js", "!app/js/*.min.js"])" --> src(["app/js/*.{js}"], { ignore: "app/js/*.min.{js}" })"