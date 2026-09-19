const languageSelector = document.getElementById('languageSelector');
const repoName = document.getElementById('repo-name');
const repoDescription = document.getElementById('repo-description');
const repoStars = document.getElementById('repo-stars');
const repoForks = document.getElementById('repo-forks');
const repoIssues = document.getElementById('repo-issues');
const refreshButton = document.getElementById('refreshButton');
const retryButton = document.getElementById('retryButton');

const emptyDiv = document.getElementById('empty');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const repoInfoDiv = document.getElementById('repoinfo');

async function repoFinder(language) {
    try {
        stateHandler("loading");
        const url = `https://api.github.com/search/repositories?q=language:${encodeURIComponent(language)}&sort=stars&order=desc`;
        const response = await fetch(url);
        
        if(!response.ok) {
            throw new Error("error fetching data");
        }

        const data = await response.json();

        if(!data.items || data.items.length === 0) {
            throw new Error("no repositories found");
        }
        
        const randomIndex = Math.floor(Math.random() * data.items.length);
        const repo = data.items[randomIndex];

        repoProcesing(repo);

    } catch (err) {
        console.error(err);
        stateHandler("error");
    }
}

function repoProcesing(repo) {
    repoName.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
    repoDescription.textContent = repo.description || "no description";
    repoStars.textContent = `Stars: ${repo.stargazers_count}`;
    repoForks.textContent = `Forks: ${repo.forks_count}`;
    repoIssues.textContent = `Issues: ${repo.open_issues_count}`;
    stateHandler("correct");
}

function stateHandler(state) {
    emptyDiv.classList.add('hidden');
    loadingDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    repoInfoDiv.classList.add('hidden');

    switch(state) {
        case "empty":
            emptyDiv.classList.remove('hidden');
            break;
        case "loading": 
            loadingDiv.classList.remove('hidden');
            break;
        case "error":
            errorDiv.classList.remove('hidden');
            break;
        case "correct": 
            repoInfoDiv.classList.remove('hidden');
            break;        
    }
}

languageSelector.addEventListener("change", (e) => {
    const selectedLanguage = e.target.value;
    repoFinder(selectedLanguage);
})

refreshButton.addEventListener("click", () => {
    const selectedLanguage = languageSelector.value;
    repoFinder(selectedLanguage);
})

retryButton.addEventListener("click", () => {
    const selectedLanguage = languageSelector.value;
    repoFinder(selectedLanguage);
})