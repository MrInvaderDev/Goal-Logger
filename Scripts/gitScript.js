async function fetchGitHubReleases() {
    const apiUrl = 'https://api.github.com/repos/MrInvaderDev/GoalLogger/releases';
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const releases = await response.json();
        
        // Filter releases that contain .exe files
        const exeReleases = releases.filter(release => 
            release.assets && release.assets.some(asset => asset.name.endsWith('.exe'))
        );
        
        // Display the releases
        displayReleases(exeReleases);
    } catch (error) {
        console.error('Error fetching releases:', error);
        const githubCard = document.getElementById('github-card');
        if (githubCard) {
            githubCard.innerHTML = '<p style="color: red;">Failed to load releases. Please try again later.</p>';
        }
    }
}

function displayReleases(releases) {
    const githubCard = document.getElementById('github-card');
    
    if (!releases || releases.length === 0) {
        githubCard.innerHTML = '<p>No releases found.</p>';
        return;
    }
    
    // Sort by release date (newest first)
    releases.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    
    // Clear existing content and rebuild
    let html = '<div class="github-icon"></div>';
    html += `<h3>Available Releases</h3>`;
    html += `<div style="max-height: 300px; overflow-y: auto;">`;
    
    releases.forEach(release => {
        const exeAsset = release.assets.find(asset => asset.name.endsWith('.exe'));
        if (exeAsset) {
            const releaseDate = new Date(release.published_at).toLocaleDateString();
            html += `
                <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <p style="margin: 0 0 4px 0; font-weight: 600;">${release.tag_name}</p>
                    <small style="opacity: 0.7; display: block; margin-bottom: 8px;">${releaseDate}</small>
                    <a href="${exeAsset.browser_download_url}" class="download-btn" style="display: inline-block; padding: 6px 12px; background-color: #7c4dff; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; cursor: pointer;">
                        Download ${exeAsset.name}
                    </a>
                </div>
            `;
        }
    });
    
    html += `</div>`;
    githubCard.innerHTML = html;
}

// Fetch releases when the page loads
document.addEventListener('DOMContentLoaded', fetchGitHubReleases);
