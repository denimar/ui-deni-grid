(function (window) {
    if (!window.parent.initDone && window.location.pathname === '/context.html') {
         window.parent.initDone = true;

         //Open the debug page on start
         window.open('/debug.html', '_blank');
    }
})(window)
