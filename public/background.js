/*global chrome*/

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.greeting == "hello")
        sendResponse({farewell: "goodbye"});//        if(sender.tab.url != undefined){
            console.log(chrome.declarativeNetRequest.getEnabledRulesets())
            chrome.declarativeNetRequest.updateEnabledRulesets({
                "enableRulesetIds": ["ruleset_1"] // or disableRulesetIds
            })
            console.log(chrome.declarativeNetRequest.getEnabledRulesets())
        }
    );

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          console.log(sender.tab ?
                      "from a content scriptssss:" + sender.tab.url :
                      "from the extensionsssss");
          if (request.greeting == "hellos")
            sendResponse({farewell: "goodbye"});//        if(sender.tab.url != undefined){
                console.log("not undefined")
                console.log(chrome.declarativeNetRequest.getEnabledRulesets())
                //let options=["ruleset_1"]
                //let hi = options.enableRulesetIds()
                //chrome.declarativeNetRequest.updateEnabledRulesets(hi)
                chrome.declarativeNetRequest.updateEnabledRulesets({
                    "disableRulesetIds": ["ruleset_1"] // or disableRulesetIds
                })
                console.log(chrome.declarativeNetRequest.getEnabledRulesets())
            }
        );
    
