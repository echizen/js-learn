/**
 *     __  ___
 *    /  |/  /___   _____ _____ ___   ____   ____ _ ___   _____
 *   / /|_/ // _ \ / ___// ___// _ \ / __ \ / __ `// _ \ / ___/
 *  / /  / //  __/(__  )(__  )/  __// / / // /_/ //  __// /
 * /_/  /_/ \___//____//____/ \___//_/ /_/ \__, / \___//_/
 *                                        /____/
 *
 * @description MessengerJS, a common cross-document communicate solution.
 * @author biqing kwok
 * @version 2.0
 * @license release under MIT license
 * @document-url:http://www.alloyteam.com/2013/11/the-second-version-universal-solution-iframe-cross-domain-communication/
 */

/* 使用
    1、在需要通信的文档中(父窗口和iframe们), 都确保引入MessengerJS

    2、每一个文档(document), 都需要自己的Messenger与其他文档通信. 即每一个window对象都对应着一个, 且仅有一个Messenger对象, 该Messenger对象会负责当前window的所有通信任务. 每个Messenger对象都需要唯一的名字, 这样它们才可以知道跟谁通信.

    // 父窗口中 - 初始化Messenger对象
    var messenger = new Messenger('Parent');
     
    // iframe中 - 初始化Messenger对象
    var messenger = new Messenger('iframe1');
     
    // 多个iframe, 使用不同的名字
    var messenger = new Messenger('iframe2');


    3、在发送消息前, 确保目标文档已经监听了消息事件.

    // iframe中 - 监听消息
    // 回调函数按照监听的顺序执行
    messenger.listen(function(msg){
        alert("收到消息: " + msg);
    });


    4、父窗口想给iframe发消息, 它怎么知道iframe的存在呢? 添加一个消息对象吧.

    // 父窗口中 - 添加消息对象, 明确告诉父窗口iframe的window引用与名字
    messenger.addTarget(iframe1.contentWindow, 'iframe1');
     
    // 父窗口中 - 可以添加多个消息对象
    messenger.addTarget(iframe2.contentWindow, 'iframe2');
    

    5、一切ready, 发消息吧~ 发送消息有两种方式. (以父窗口向iframe发消息为例)

    // 父窗口中 - 向单个iframe发消息
    messenger.targets['iframe1'].send(msg1);
    messenger.targets['iframe2'].send(msg2);
     
    // 父窗口中 - 向所有目标iframe广播消息
    messenger.send(msg);
 */

window.Messenger = (function(){

    // 消息前缀, 建议使用自己的项目名, 避免多项目之间的冲突
    // !注意 消息前缀应使用字符串类型
    var prefix = "[PROJECT_NAME]",
        supportPostMessage = 'postMessage' in window;

    // Target 类, 消息对象
    function Target(target, name){
        var errMsg = '';
        if(arguments.length < 2){
            errMsg = 'target error - target and name are both required';
        } else if (typeof target != 'object'){
            errMsg = 'target error - target itself must be window object';
        } else if (typeof name != 'string'){
            errMsg = 'target error - target name must be string type';
        }
        if(errMsg){
            throw new Error(errMsg);
        }
        this.target = target;
        this.name = name;
    }

    // 往 target 发送消息, 出于安全考虑, 发送消息会带上前缀
    if ( supportPostMessage ){
        // IE8+ 以及现代浏览器支持
        Target.prototype.send = function(msg){
            this.target.postMessage(prefix + msg, '*');
        };
    } else {
        // 兼容IE 6/7
        Target.prototype.send = function(msg){
            var targetFunc = window.navigator[prefix + this.name];
            if ( typeof targetFunc == 'function' ) {
                targetFunc(prefix + msg, window);
            } else {
                throw new Error("target callback function is not defined");
            }
        };
    }

    // 信使类
    // 创建Messenger实例时指定, 必须指定Messenger的名字, (可选)指定项目名, 以避免Mashup类应用中的冲突
    // !注意: 父子页面中projectName必须保持一致, 否则无法匹配
    function Messenger(messengerName, projectName){
        this.targets = {};
        this.name = messengerName;
        this.listenFunc = [];
        prefix = projectName || prefix;
        if(typeof prefix !== 'string') {
            prefix = prefix.toString();
        }
        this.initListen();
    }

    // 添加一个消息对象
    Messenger.prototype.addTarget = function(target, name){
        var targetObj = new Target(target, name);
        this.targets[name] = targetObj;
    };

    // 初始化消息监听
    Messenger.prototype.initListen = function(){
        var self = this;
        var generalCallback = function(msg){
            if(typeof msg == 'object' && msg.data){
                msg = msg.data;
            }
            // 剥离消息前缀
            msg = msg.slice(prefix.length);
            for(var i = 0; i < self.listenFunc.length; i++){
                self.listenFunc[i](msg);
            }
        };

        if ( supportPostMessage ){
            if ( 'addEventListener' in document ) {
                window.addEventListener('message', generalCallback, false);
            } else if ( 'attachEvent' in document ) {
                window.attachEvent('onmessage', generalCallback);
            }
        } else {
            // 兼容IE 6/7
            window.navigator[prefix + this.name] = generalCallback;
        }
    };

    // 监听消息
    Messenger.prototype.listen = function(callback){
        this.listenFunc.push(callback);
    };
    // 注销监听
    Messenger.prototype.clear = function(){
        this.listenFunc = [];
    };
    // 广播消息
    Messenger.prototype.send = function(msg){
        var targets = this.targets,
            target;
        for(target in targets){
            if(targets.hasOwnProperty(target)){
                targets[target].send(msg);
            }
        }
    };

    return Messenger;
})();