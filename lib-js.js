; var seaCatCodeMiniAnalytics = (function (O) {

    O.host = O.host === void 0 ? '' : O.host;

    function create() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', O.host + '/create');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === xhr.DONE && xhr.status === 200) {
                var responseText = xhr.responseText;
            }
        };
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.send();
    }

    create();

    return O;
})(seaCatCodeMiniAnalytics === void 0 ? {} : seaCatCodeMiniAnalytics);