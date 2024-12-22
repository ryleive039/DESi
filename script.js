if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then( () => {
    console.log('Service Worker Registered')
})
})
}


document.getElementById("fetchData").addEventListener("click", function () {
    const idInput = document.getElementById("idInput").value;

    // Validate input
    if (!idInput || idInput <= 0) {
        document.getElementById("output").textContent = "Please enter a valid positive number.";
        return;
    }

    // API URL
    const apiURL = `https://cdn.animenewsnetwork.com/encyclopedia/api.xml?title=${idInput}`;

    // Fetch data from API
    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            // Parse XML response
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "application/xml");

            // Extract information
            const title = xmlDoc.querySelector("info[type='Main title']")?.textContent || "No title found";
            const synopsis = xmlDoc.querySelector("info[type='Plot Summary']")?.textContent || "No synopsis available";
            const imageUrl = xmlDoc.querySelector("img")?.getAttribute("src") || "";

            // Display data
            const outputDiv = document.getElementById("output");
            outputDiv.innerHTML = `
                <h2>Title: ${title}</h2>
                <p><strong>Synopsis:</strong> ${synopsis}</p>
                ${imageUrl ? `<img src="${imageUrl}" alt="${title}" style="max-width: 100%; border-radius: 8px;">` : "<p>No image available</p>"}
            `;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            document.getElementById("output").textContent = "Failed to fetch data. The ID might not exist or there was an error.";
        });
});
