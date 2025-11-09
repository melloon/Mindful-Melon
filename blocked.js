
let tabTimeTracker = {}; 
let activeTimers = {};  
let activeTabId = null; 

function startTimerForTab(tabId) {
    if (activeTimers[tabId]) {
        return; 
    }

    if (!tabTimeTracker[tabId]) {
        tabTimeTracker[tabId] = 0; 
    }
    
    if (tabId === activeTabId) { 
        activeTimers[tabId] = setInterval(() => {
            tabTimeTracker[tabId]++;
        }, 1000); 
    }
}

function stopTimerForTab(tabId) {
    if (activeTimers[tabId]) {
        clearInterval(activeTimers[tabId]);
        delete activeTimers[tabId];
    }
    
    const finalTime = tabTimeTracker[tabId] || 0;
    
    // You would use chrome.storage.local.set() here to save the final time 
    // and URL to permanent storage.
    
    console.log(`Final time for tab ${tabId} logged: ${finalTime} seconds.`);
    
    delete tabTimeTracker[tabId]; 
}

function pauseTimerForTab(tabId) {
    if (activeTimers[tabId]) {
        clearInterval(activeTimers[tabId]);
        delete activeTimers[tabId];
    }
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        stopTimerForTab(tabId); 
        startTimerForTab(tabId);
    }
});

browser.tabs.onActivated.addListener((activeInfo) => {

    if (activeTabId !== null) {
        pauseTimerForTab(activeTabId);
    }
    
    activeTabId = activeInfo.tabId;
    startTimerForTab(activeTabId);
});

browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
    stopTimerForTab(tabId); 
    if (tabId === activeTabId) {
        activeTabId = null;
    }
});

browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
    if (tabs.length > 0) {
        activeTabId = tabs[0].id;
        startTimerForTab(activeTabId);
    }
});