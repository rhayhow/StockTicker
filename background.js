var pollInterval = 1000 * 60; // 1 minute

function updateStocks(callback, errorCallback, notificationCallback) {
  // Google image search - 100 searches per day.
  // https://developers.google.com/image-search/
  //var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
  //  '?v=1.0&q=' + encodeURIComponent(searchTerm);
    
   var searchUrl = 'https://www.google.com/finance/info?q=NSE:A,KEYS,.INX,TNX,.DJI'
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  // The Google image search API responds with JSON, so let Chrome parse it.
  //var responseString = x.responseText;
  x.responseType = 'text';
 
  
  x.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = x.response;
 
    if (!response || response.length == 0) {
      errorCallback('No response from Google Finance search!');
      return;
    }
    var json = response.replace("//", "");
    
    var ticker = JSON.parse(json);
    var results = "";
    
    for(i=0;i<ticker.length;i++)
    {
       if(ticker[i].t == 'A')
         {
              var result = 'Agilent is ' + ticker[i].l_cur + "   \n";
              result = result + '   Changed ' + ticker[i].c + "   \n";
              var pctChange = (ticker[i].c/ticker[i].pcls_fix) * 100;
              result = result + '   Changed % ' + pctChange.toFixed(2) + "   \n";
              
              if(pctChange >=0)
              {
              showStockUpNotification(result, 'Agilent Update', 'A');
              }
              else
              {
              showStockDownNotification(result, 'Agilent Update', 'A');
              }
              //showAgilentNotification(result);
              results = results + result;
              //return;
        }
      if(ticker[i].t == 'KEYS')
         {
              results = results + 'Keysight is ' + ticker[i].l_cur + "   \n";
              //return;
        }
        if(ticker[i].t == '.INX')
         {
              var result = 'The S&P is ' + ticker[i].l_cur + "   \n";
              result = result + '   Changed ' + ticker[i].c + "   \n";
              var pctChange = (ticker[i].c/ticker[i].pcls_fix) * 100;
              result = result + '   Changed % ' + pctChange.toFixed(2) + "   \n";
              
              if(pctChange >=0)
              {
              showStockUpNotification(result, 'S&P 500 Update', 'S&P 500');
              }
              else
              {
              showStockDownNotification(result, 'S&P 500 Update', 'S&P 500');
              }
              //showSNPNotification(result);
              results = results + result;
              //return;
        }
        if(ticker[i].t == 'TNX')
         {
              var result = 'The 10 year is ' + ticker[i].l_cur + "   \n";
              result = result + '   Changed ' + ticker[i].c + "   \n";
              var pctChange = (ticker[i].c/ticker[i].pcls_fix) * 100;
              result = result + '   Changed % ' + pctChange.toFixed(2) + "   \n";
              
              if(pctChange >=0)
              {
              showStockUpNotification(result, '10 Year Treasury Update', 'TNX');
              }
              else
              {
              showStockDownNotification(result, '10 Year Treasury Update', 'TNX');
              }
              //showTBillNotification(result);
              results = results + result;
              //return;
        }
           if(ticker[i].t == '.DJI')
         {
              result = 'The Dow is ' + ticker[i].l_cur + "   \n";
              result = result + '   Changed ' + ticker[i].c + "   \n";
              var pctChange = (ticker[i].c/ticker[i].pcls_fix) * 100;
              result = result + '   Changed % ' + pctChange.toFixed(2) + "   \n";
              
              if(pctChange >=0)
              {
              showStockUpNotification(result, 'Dow Jones Update', 'DJI');
              }
              else
              {
              showStockDownNotification(result, 'Dow Jones Update', 'DJI');
              }
              results = results + result;
              //return;
        }
    }
    //callback( results);
    return;
    
    //var firstResult = response.responseData.results[0];
    // Take the thumbnail instead of the full image to get an approximately
    // consistent image size.
    //var imageUrl = firstResult.tbUrl;
    //var width = parseInt(firstResult.tbWidth);
   // var height = parseInt(firstResult.tbHeight);
   // console.assert(
    //    typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
   //     'Unexpected respose from the Google Image Search API!');
   // callback(imageUrl, width, height);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}

function showStockUpNotification(statusText, notificationName, titleString)
{
  //document.getElementById('status').textContent = statusText;
  
  chrome.notifications.create(notificationName,{
        type: 'basic',
        iconUrl: 'images/upArrow.png',
        title: titleString,
        message: statusText
     }, function(notificationId) {});
}

function showStockDownNotification(statusText, notificationName, titleString)
{
  //document.getElementById('status').textContent = statusText;
  
  chrome.notifications.create(notificationName,{
        type: 'basic',
        iconUrl: 'images/downArrow.png',
        title: titleString,
        message: statusText
     }, function(notificationId) {});
} 

function errorCallback(errorMessage) {
      renderStatus('Cannot display image. ' + errorMessage);
    }

function startRequest() {
  updateStocks();
  window.setTimeout(startRequest, pollInterval);
}

function stopRequest() {
  window.clearTimeout(timerId);
}

onload=startRequest()