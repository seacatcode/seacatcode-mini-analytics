; var seaCatCodeMiniAnalytics = (function (O) {

    O.host = O.host === void 0 ? '' : O.host;

    var code = null;

    function create() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', O.host + '/create');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === xhr.DONE && xhr.status === 200) {
                var responseText = xhr.responseText;
                code = responseText;
                ping();
            }
        };
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.send();
    }

    function ping() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', O.host + '/ping?t=' + Date.now() + '&code=' + code);
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.send();
    }

    create();

    O.interval = setInterval(function () {
        ping();
    }, 5000);

    O.scrollBuff = [];
    O.scrollTimeout = null;
    O.scroll = function (event) {
        var scrollX = window.scrollX;
        var scrollY = window.scrollY;
        var t = Date.now();

        if (O.scrollTimeout == null) {
            O.scrollTimeout = setTimeout(function () {
                var buf = O.scrollBuff;
                O.scrollBuff = [];
                O.scrollTimeout = null;

                var log = buf.reduce(function (array, cur) {
                    //TODO: 스크롤 진행 방향이 일치하며 이벤트 시간이 가까우면 하나의 로그로 병합
                    const { scrollX, scrollY, t } = cur;
                    return array;
                }, []);

            }, 2000);
        }

        O.scrollBuff.push({ scrollX, scrollY, t });
    }

    window.addEventListener("scroll", function (event) {
        O.scroll(event);
    });

    document.addEventListener("visibilitychange", function () {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', O.host + '/visibility?t=' + Date.now() + '&hidden=' + String(document.hidden));
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.send();
    });

    return O;
})(seaCatCodeMiniAnalytics === void 0 ? {} : seaCatCodeMiniAnalytics);