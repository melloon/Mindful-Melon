document.addEventListener("DOMContentLoaded", () => {
 
  const quoteElement = document.querySelector("h1"); // Finds the <h1> in Sites.html
  if (quoteElement) { // Check if it exists before trying to use it
    fetch("https://zenquotes.io/api/random")
      .then(res => res.json())
      .then(data => {
        const quote = data[0].q;
        const author = data[0].a;
        quoteElement.innerText = `"${quote}" - ${author}`;
      })
      .catch(() => {
        quoteElement.innerText = '"Stay focused. You got this."'; // Backup
      });
  }

  const siteInput = document.getElementById("site-input");
  const addSiteBtn = document.getElementById("add-site-btn");
  const blockedSitesList = document.getElementById("blocked-sites-list");

  loadAndDisplayBlocklist();

  addSiteBtn.addEventListener("click", async () => {
    const site = siteInput.value;
    if (site) {
      const result = await chrome.storage.local.get(["blockList"]);
      const blockList = result.blockList || [];
      const formattedSite = site.replace("https", "").replace("http://", "").replace("www.", "").split('/')[0];

      if (formattedSite && !blockList.includes(formattedSite)) {
        blockList.push(formattedSite);
        await chrome.storage.local.set({ blockList: blockList });
        siteInput.value = "";
        loadAndDisplayBlocklist();
      }
    }
  });

  async function loadAndDisplayBlocklist() {
    const result = await chrome.storage.local.get(["blockList"]);
    const blockList = result.blockList || [];
    
    blockedSitesList.innerHTML = "";
    
    // Add each site to list 
    blockList.forEach(site => {
      const li = document.createElement("li");
      li.textContent = site;

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.style.marginLeft = "10px"; 
      removeBtn.dataset.site = site; 

      // Add a click listener for the new remove button
      removeBtn.addEventListener("click", async (e) => {
        const siteToRemove = e.target.dataset.site;
        
        // Get the current list
        const result = await chrome.storage.local.get(["blockList"]);
        const currentList = result.blockList || [];
        
        // Create a NEW list, filtering out the site we want to remove
        const newList = currentList.filter(s => s !== siteToRemove);
        
        // Save the new, shorter list back to storage
        await chrome.storage.local.set({ blockList: newList });
        
        // Refresh the list in the popup
        loadAndDisplayBlocklist();
      });

      li.appendChild(removeBtn); // Add the remove button to the list item

      blockedSitesList.appendChild(li);
    });
  }
});