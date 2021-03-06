

function updateStocks() {
    var searchUrl = 'https://www.google.com/finance/info?q=NSE:A,KEYS,.INX,TNX,.DJI';
    var x = new XMLHttpRequest();
    x.open('GET', searchUrl);
    // The Google image search API responds with JSON, so let Chrome parse it.
    //var responseString = x.responseText;
    x.responseType = 'text';


    x.onload = function () {
        // Parse and process the response from Google Image Search.
        var response = x.response;

        if (!response || response.length === 0) {
            errorCallback('No response from Google Finance search!');
            return;
        }
        var json = response.replace("//", "");

        var ticker = JSON.parse(json);
        var results = "";
        var pctChange = 0.0;

        for (i = 0; i < ticker.length; i++) {
            if (ticker[i].t === 'A') {
                //var result = 'Agilent is ' + ticker[i].l_cur + "   \n";
                //result = result + '   Changed ' + ticker[i].c + "   \n";
                pctChange = (ticker[i].c / ticker[i].pcls_fix) * 100;
                //result = result + '   Changed % ' + pctChange.toFixed(2) + "   \n";

                showStockNotification('Agilent Update', 'A', 'Agilent', ticker[i].l_cur, ticker[i].c, pctChange);

            }
            if (ticker[i].t === 'KEYS') {
                results = results + 'Keysight is ' + ticker[i].l_cur + "   \n";
                //return;
            }
            if (ticker[i].t === '.INX') {
                //var result = 'The S&P is ' + ticker[i].l_cur + "   \n";
                //result = result + '   Changed ' + ticker[i].c + "   \n";
                pctChange = (ticker[i].c / ticker[i].pcls_fix) * 100;
                //result = result + '   Changed % ' + pctChange.toFixed(2) + "   \n";

                showStockNotification('S&P 500 Update', 'S&P 500', 'The S&P 500', ticker[i].l_cur, ticker[i].c, pctChange);

            }
            if (ticker[i].t === 'TNX') {
                //var result = 'The 10 year is ' + ticker[i].l_cur + "   \n";
                //result = result + '   Changed ' + ticker[i].c + "   \n";
                pctChange = (ticker[i].c / ticker[i].pcls_fix) * 100;
                //result = result + '   Changed % ' + pctChange.toFixed(2) + "   \n";

                showStockNotification('10 Year Treasury Update', 'TNX', 'The 10 Year', ticker[i].l_cur, ticker[i].c, pctChange);

            }
            if (ticker[i].t === '.DJI') {
                //result = 'The Dow is ' + ticker[i].l_cur + ",";
                //result = result + '   Changed ' + ticker[i].c + "   \n";
                pctChange = (ticker[i].c / ticker[i].pcls_fix) * 100;
                //result = result + '   Changed % ' + pctChange.toFixed(2) + "   \n";

                showStockNotification('Dow Jones Update', 'DJI', 'The Dow', ticker[i].l_cur, ticker[i].c, pctChange);

            }
        }
        return;
    };
    x.onerror = function () {
        errorCallback('Network error.');
    };
    x.send();
}

function showStockNotification(notificationName, titleString, stockName, current, change, pctChange) {
    var statusText = stockName + ' is ' + current + ', ' + change + ' (' + pctChange.toFixed(2) + "%)";

    var normal_threshold_value = .25;
    if (localStorage['normal_threshold'] !== null)
    {
        normal_threshold_value = localStorage['normal_threshold'];
    }
        
    var special_threshold_value = 1.0;
    if (localStorage['special_threshold'] !== null)
    {
        special_threshold_value = localStorage['special_threshold'];
    }

    if (Math.abs(pctChange) > normal_threshold_value) {
        var upArrowString = 'images/upArrow.png';
        if (pctChange > special_threshold_value) {
            upArrowString = 'images/upArrowPriority.png';
        }
        if (pctChange >= 0) {
            chrome.notifications.create(notificationName, {
                type: 'basic',
                iconUrl: upArrowString,
                title: titleString,
                message: statusText
            }, function (notificationId) { });
        }
        else {
            var downArrowString = 'images/downArrow.png';
            if (pctChange < -1.0) {
                downArrowString = 'images/downArrowPriority.png';
            }
            chrome.notifications.create(notificationName, {
                type: 'basic',
                iconUrl: downArrowString,
                title: titleString,
                message: statusText
            }, function (notificationId) { });
        }
    }
}

function errorCallback(errorMessage) {
    renderStatus('Cannot display image. ' + errorMessage);
}

function startRequest() {
    //load currently stored options configuration
    var timeout_value = localStorage['timeout'];
    var pollInterval = 1000 * 60 * timeout_value; // configured by options

    updateStocks();
    var now = new Date().getHours();
    if (now < 14) {
        window.setTimeout(startRequest, pollInterval);
    }
    else {
        chrome.notifications.create('All Done', {
            type: 'basic',
            iconUrl: 'images/icon_128.png',
            title: 'Market Closed',
            message: 'No more notifications, market closed.'
        }, function (notificationId) { });
    }
}

function stopRequest() {
    window.clearTimeout(timerId);
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
      if (request.message === "options_saved") {
          startRequest();
      }
  }
);

onload = startRequest();