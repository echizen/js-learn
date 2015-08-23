function ready(readyFn) {
    //非IE浏览器
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', function () {
            readyFn && readyFn();
        }, false);
    } else {
        // IE
        //方案1和2  哪个快用哪一个
        var bReady = false;
        //方案1
        document.attachEvent('onreadystatechange', function () {
            if (bReady) {
                return;
            }
            // complete和interactive发生的顺序不确定
            if (document.readyState == 'complete' || document.readyState == "interactive") {
                bReady = true;
                readyFn && readyFn();
            };
        });

        //方案2
        //jquery也会担心doScroll会在iframe内失效，此处是判断当前页是否被放在了iframe里
        if (!window.frameElement) {
            setTimeout(checkDoScroll, 1);
        }
        function checkDoScroll() {
            try {
                document.documentElement.doScroll("left");
                if (bReady) {
                    return;
                }
                bReady = true;
                readyFn && readyFn();
            }
            catch (e) {
                // 不断检查 doScroll 是否可用 - DOM结构是否加载完成
                setTimeout(checkDoScroll, 1);
            }
        };
    }
};