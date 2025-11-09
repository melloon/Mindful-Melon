 
document.addEventListener("DOMContentLoaded", () => {
 const siteInput = document.getElementById("site-input");
  const addSiteBtn = document.getElementById("add-site-btn");
  const blockedSitesList = document.getElementById("blocked-sites-list");

  loadAndDisplayBlocklist();

  addSiteBtn.addEventListener("click", async () => {
    const site = siteInput.value;
    
    if (site) {
      // Get the current list from storage
      const result = await chrome.storage.local.get(["blockList"]);
      const blockList = result.blockList || []; // Use empty list if it doesn't exist yet
      
      // Cleans up the input
      const formattedSite = site.replace("https://", "").replace("http://", "").replace("www.", "").split('/')[0];

      // Add the site to the list ONLY if it's not already there
      if (formattedSite && !blockList.includes(formattedSite)) {
        blockList.push(formattedSite);
        
        // Save the new, updated list back to storage
        await chrome.storage.local.set({ blockList: blockList });
        
        // Clear the input box
        siteInput.value = "";
        loadAndDisplayBlocklist();
      }
    }
  });

  // This function loads the list from storage
  async function loadAndDisplayBlocklist() {
    const result = await chrome.storage.local.get(["blockList"]);
    const blockList = result.blockList || [];
    
    blockedSitesList.innerHTML = "";
    
    // Add each site to the HTML as a list item
    blockList.forEach(site => {
      const li = document.createElement("li");
      li.textContent = site;
      blockedSitesList.appendChild(li);
    });
  }
});