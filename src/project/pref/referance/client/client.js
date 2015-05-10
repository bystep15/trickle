(function(global, $, document, undefined){
    'use strict';

    $.client = function () {
        // 呈现引擎
        var engine = {
            ie: 0,
            gecko: 0,
            webkit: 0,
            khtml: 0,
            opera: 0,
    
            // 完整版本号
            version: null
        };
        
        // 浏览器
        var browser = {
            // 主要浏览器
            ie: 0,
            firefox: 0,
            safari: 0,
            konq: 0,
            opera: 0,
            chrome: 0,
    
            // 完整版本号
            version: null
        };
    
        // 平台、设备和操作系统
        var system = {
            win: false,
            mac: false,
            x11: false,
    
            // 移动设备
            iphone: false,
            ipod: false,
            ipad: false,
            ios: false,
            android: false,
            nokiaN: false,
            winMobile: false,
    
            // 游戏系统
            wii: false,
            ps: false
        };
        
        // 检测呈现引擎和浏览器
        var ua = navigator.userAgent;
        if(global.opera){
            engine.version = browser.version = global.opera.version();
            engine.opera = browser.opera = parseFloat(engine.version);
        }
        else if(/AppleWebKit\/(\S+)/.test(ua)){
            engine.version = RegExp.$1;
            engine.webkit = parseFloat(engine.version);
    
            // 确定是Chrome还是Safari
            if(/Chrome\/(\S+)/.test(ua)){
                browser.version = RegExp.$1;
                browser.chrome = parseFloat(browser.version);
            }
            else if(/Version\/(\S+)/.test(ua)){
                browser.version = RegExp.$1;
                browser.safari = parseFloat(browser.version);
            }
            else{
                // 近似的确定版本号
                var safariVersion = 1;
                if(engine.webkit < 100){
                    safariVersion = 1;
                }
                else if(engine.webkit < 312){
                    safariVersion = 1.2;
                }
                else if(engine.webkit < 412){
                    safariVersion = 1.3;
                }
                else{
                    safariVersion = 2;
                }
                browser.safari = browser.version = safariVersion;
            }
        }
        else if(/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)){
            engine.version = browser.version = RegExp.$1;
            engine.khtml = browser.konq = parseFloat(engine.version);
        }
        else if(/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)){
            engine.version = RegExp.$1;
            engine.gecko = parseFloat(engine.version);
    
            // 确定是不是firefox
            if(/Firefox\/(\S+)/.test(ua)){
                browser.version = RegExp.$1;
                browser.firefox = parseFloat(browser.version);
            }
        }
        else if(/MSIE ([^;]+)/.test(ua)){
            engine.version = browser.version = RegExp.$1;
            engine.ie = browser.ie = parseFloat(engine.version);
        }
    
        // 检测平台
        var p = navigator.platform;
        system.win = p.indexOf('Win') == 0;
        system.mac = p.indexOf('Mac') == 0;
        system.x11 = p.indexOf('Linux') == 0 || p == 'X11';
    
        // 游戏系统
        system.wii = ua.indexOf('Wii') > -1;
        system.ps = /playstation/i.test(ua);
        
    
        // 检测Windows操作系统
        if(system.win){
            if(/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)){
                if(RegExp.$1 == 'NT'){
                    switch(RegExp.$2){
                        case '5.0':
                            system.win = '2000';
                            break;
                        case '5.1':
                            system.win = 'XP';
                            break;
                        case '6.0':
                            system.win = 'Vista';
                            break;
                        case '6.1':
                            system.win = '7';
                            break;
                        case '6.2':
                            system.win = '8';
                            break;
                        default:
                            system.win = 'NT';
                    }
                }
                else if(RegExp.$1 == '9x'){
                    system.win = 'ME';
                }
                else{
                    system.win = RegExp.$1;
                }
            }
        }
    
        system.iphone = ua.indexOf('iPhone') > -1;
        system.ipod = ua.indexOf('iPod') > -1;
        system.ipad = ua.indexOf('iPad') > -1;
        system.nokiaN = ua.indexOf('NokiaN') > -1;
    
        // window mobile
        if(system.win == 'CE'){
            system.winMobile = system.win;
        }
        else if(system.win == 'Ph'){
            if(/Windows Phone OS (\d+_.\d+)/.test(ua)){
                system.win = "Phone";
                system.winMobile = parseFloat(RegExp.$1);
            }
        }
    
        // 检测iOS版本
        if(system.mac && ua.indexOf('Mobile') > -1){
            if(/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)){
                system.ios = parseFloat(RegExp.$1.replace('_', '.'));
            }
            else{
                // 不能真正检测出来，所以只能猜测
                system.ios = 2;
            }
        }
    
        // 检测Android版本
        if(/Android (\d+\.\d+)/.test(ua)){
            system.android = parseFloat(RegExp.$1);
        }
        
        // 返回这些对象
        return {
            engine: engine,
            browser: browser,
            system: system,
            toString: function(){
                var i,
                    result = []; 

                result.push('engine:');
                for(i in engine){
                    if(engine[i] && i!='version'){
                        result.push(i + engine[i]);
                    }
                }
                result.push('browser:');
                for(i in browser){
                    if(browser[i] && i!='version'){
                        result.push(i + browser[i]);
                    }
                }
                result.push('system:');
                for(i in system){
                    if(system[i]){
                        result.push(i + system[i]);
                    }
                }

                return result.join(' ');
            }
        };
    }();
}(this, this.jQuery || this.Zepto, document));

