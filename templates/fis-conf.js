fis.set("atm", {
  useSprite: true,
  useOptimize: false,
  useHash: false,
  userName: 'allanyu',
  projectName: '150911_brower_landing',
  cdnPath: ''
});

fis.set('project.files', ['**', '.**', '.**/**'])
  .set('project.ignore', ['node_modules/**', '.idea', '.gitignore', '**/_*.scss', '.docs/**', 'publish/**', '.dist/**', '.git/**', '.svn/**', 'fis-conf.js']);

fis.hook('relative');

if (!!fis.get("atm").cdnPath) {
  fis.get("atm").useDomain = !!fis.get("atm").cdnPath;
  fis.get("atm").domain = "http://3gimg.qq.com/mig-web/" + fis.get("atm").cdnPath;
}

var atmConf = fis.get("atm");

/*************************目录规范*****************************/
fis.match('*', {
  relative: true,
  useHash: false,
  useDomain: false,
  domain: atmConf.domain,
  _isResourceMap: false
}).match(/.*\.(html|htm|php)$/, { //页面模板不用编译缓存
  useCache: false,
}).match("/css/**.{css,less,scss}", {
  useSprite: atmConf.useSprite,
  useDomain: atmConf.useDomain,
  useHash: atmConf.useHash,
  optimizer: atmConf.useOptimize && fis.plugin('clean-css')
}).match('/css/**.less', {
  rExt: '.css',
  parser: fis.plugin('less')
}).match('*.mixin.less', {//less的mixin文件无需发布
  release: false
}).match("/design/**.psd", {
  release: false
}).match("font/**", {
  useHash: atmConf.useHash,
  useDomain: atmConf.useDomain
}).match("img/**", {
  useDomain: atmConf.useDomain,
  useHash: atmConf.useHash
}).match('img/**.png', {
  optimizer: fis.plugin('png-compressor')
}).match('js/**', {
  useDomain: atmConf.useDomain,
  useHash: atmConf.useHash
}).match('mail/**', {}).match('slice/**', {});

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
  optimizer: atmConf.useOptimize && fis.plugin('clean-css')
}).match('**', {
  deploy: fis.plugin('http-push', {
    receiver: 'http://ued.wsd.com/receiver/receiver2.php',
    to: '/data/wapstatic/' + atmConf.userName + '/' + atmConf.projectName
  })
});

fis.media('cdn').match("/css/**.{css,less}", {
  useSprite: true,
  optimizer: atmConf.useOptimize && fis.plugin('clean-css')
}).match('**', {
  deploy: fis.plugin('cdn', {
    remoteDir: atmConf.cdnPath,
    uploadUrl: 'http://super.kf0309.3g.qq.com/qm/upload'
  })
});

