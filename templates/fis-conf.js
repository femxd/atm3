var enableConf = {
  useSprite: true,
  useOptimize: false,
  userName: 'allanyu',
  projectName: 'demo'
};

fis.set('project.files', ['**', '.**', '.**/**'])
  .set('project.ignore', ['node_modules/**', '.gitignore', '**/_*.scss', '.docs/**', 'publish/**', '.dist/**', '.git/**', '.svn/**', 'fis-conf.js']);

fis.hook('relative');

/*************************目录规范*****************************/
fis.match('*', {
  useHash: false,
  relative: true,
  _isResourceMap: false
}).match(/.*\.(html|htm|php)$/, { //页面模板不用编译缓存
  useCache: false
}).match("/css/**.{css,less,scss}", {
  useSprite: enableConf.useSprite,
  optimizer: enableConf.useOptimize && fis.plugin('clean-css')
}).match('/css/**.less', {
  rExt: '.css',
  parser: fis.plugin('less')
//}).match('/css/**.scss', {
//  rExt: '.css',
//  parser: fis.plugin('scss')
}).match('*.mixin.less', {//less的mixin文件无需发布
  release: false
}).match("/design/**.psd", {
  release: false
}).match("font/**", {}).match("img/**", {}).match('img/**.png', {
  optimizer: fis.plugin('png-compressor')
}).match('js/**', {}).match('mail/**', {}).match('slice/**', {});

fis.match('**', {
  deploy: fis.plugin('local-deliver', {
    to: './publish'
  })
}).match("::packager", {
  spriter: fis.plugin('csssprites', {
    htmlUseSprite: true,
    layout: 'matrix',
    margin: '16',
    scale: 0.5,
    styleReg: /(<style(?:(?=\s)[\s\S]*?["'\s\w\/\-]>|>))([\s\S]*?)(<\/style\s*>|$)/ig
  })
});

fis.media('test').match("/css/**.{css,less}", {
  useSprite: true,
  optimizer: enableConf.useOptimize && fis.plugin('clean-css')
}).match('**', {
  deploy: fis.plugin('http-push', {
    receiver: 'http://ued.wsd.com/receiver/receiver2.php',
    to: '/data/wapstatic/' + enableConf.userName + '/' + enableConf.projectName
  })
});

