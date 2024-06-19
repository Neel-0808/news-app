document.addEventListener('DOMContentLoaded', (event) => {
    const apiKey = "b912ae652eac446e8122420f38f29074";

    const blockContainer = document.getElementById('blockContainer');
    const searchField = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    async function fetchRandomNews() {
        try {
            const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=${apiKey}`;
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.articles;
        } catch (error) {
            console.error("Error fetching random news", error);
            return [];
        }
    }

    searchButton.addEventListener('click', async () => {
        const query = searchField.value.trim();
        if (query !== "") {
            try {
                const articles = await fetchNewsQuery(query); // Pass the query here
                displayBlogs(articles);
            } catch (error) {
                console.error("Error fetching by query", error);
                return;
            }
        }
    });

    async function fetchNewsQuery(query) {
        try {
            const apiUrl = `https://newsapi.org/v2/everything?q=${query}&pageSize=10&apiKey=${apiKey}`;
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.articles;
        } catch (error) {
            console.error("Error fetching news by query", error);
            return [];
        }
    }

    function displayBlogs(articles) {
        if (!blockContainer) {
            console.error('blockContainer not found');
            return;
        }
        blockContainer.innerHTML = ""; // Clear previous content
        articles.forEach((article) => {
            const block = document.createElement('div');
            block.classList.add('block-card');
            const img = document.createElement('img');
            img.src = article.urlToImage || 'https://via.placeholder.com/150';
            img.alt = article.title || 'No title available';
            const title = document.createElement('h2');
            const truncatedTitle = article.title && article.title.length > 30 ? article.title.slice(0, 30) + "..." : article.title || 'No title available';
            title.textContent = truncatedTitle;
            const description = document.createElement('p');
            const truncatedDescription = article.description && article.description.length > 120 ? article.description.slice(0, 120) + "..." : article.description || 'No description available';
            description.textContent = truncatedDescription;

            block.appendChild(img);
            block.appendChild(title);
            block.appendChild(description);
            block.addEventListener('click', () => {
                window.open(article.url, '_blank');
            });
            blockContainer.appendChild(block);
        });
    }

    (async () => {
        try {
            const articles = await fetchRandomNews();
            displayBlogs(articles);
        } catch (errors) {
            console.error("Error displaying blogs", errors);
        }
    })();
});
