// ============================================
// UTILITY FUNCTIONS
// ============================================

function showLoader(buttonId) {
    const button = document.getElementById(buttonId);
    const buttonText = button.querySelector('.fb-graph-button-text');
    const buttonLoader = button.querySelector('.fb-graph-button-loader');
    buttonText.style.display = 'none';
    buttonLoader.style.display = 'inline-block';
    button.disabled = true;
}

function hideLoader(buttonId) {
    const button = document.getElementById(buttonId);
    const buttonText = button.querySelector('.fb-graph-button-text');
    const buttonLoader = button.querySelector('.fb-graph-button-loader');
    buttonText.style.display = 'inline';
    buttonLoader.style.display = 'none';
    button.disabled = false;
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.innerHTML = '<i class="bi bi-exclamation-triangle"></i>' + message;
    errorDiv.style.display = 'flex';
    setTimeout(function() {
        errorDiv.style.display = 'none';
    }, 5000);
}

function hideError() {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.style.display = 'none';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function validateAccessToken(token) {
    if (!token || token.trim() === '') {
        showError('Please provide an access token to fetch data');
        return false;
    }
    if (token.length < 10) {
        showError('Invalid access token format');
        return false;
    }
    return true;
}

// kumukuha ng access token na nilagay ng user sa input field
function getAccessToken() {
    const tokenInput = document.getElementById('accessToken');
    const token = tokenInput.value.trim();
    if (!validateAccessToken(token)) {
        return null;
    }
    return token;
}

function handleApiError(response, data) {
    if (data.error) {
        const errorCode = data.error.code;
        const errorMessage = data.error.message;
        
        if (errorCode === 190 || response.status === 401) {
            showError('Invalid or expired access token');
        } else if (response.status === 403) {
            showError('Permission denied');
        } else if (response.status === 404) {
            showError('Resource not found');
        } else if (response.status === 429) {
            showError('Too many requests please wait');
        } else {
            showError(errorMessage);
        }
        return true;
    }
    return false;
}

// ============================================
// API LOGIC FUNCTIONS
// ============================================

const API_BASE_URL = 'https://graph.facebook.com/v24.0';

function makeApiRequest(endpoint, token) {
    const url = API_BASE_URL + endpoint + '&access_token=' + token;
    
    return fetch(url)
        .then(function(response) {
            return response.json().then(function(data) {
                return { response: response, data: data };
            });
        })
        .then(function(result) {
            if (result.response.status !== 200) {
                handleApiError(result.response, result.data);
                return null;
            }
            if (result.data.error) {
                handleApiError(result.response, result.data);
                return null;
            }
            return result.data;
        })
        .catch(function(error) {
            showError('Network error occurred');
            return null;
        });
}

// kumukuha ng profile data mula sa Facebook API gamit ang access token
function fetchProfileData() {
    const token = getAccessToken();
    if (!token) return;
    
    showLoader('fetchProfileBtn');
    hideError();
    
    const endpoint = '/me?fields=id,name,email,location,age_range,gender,birthday,hometown,picture';
    makeApiRequest(endpoint, token)
        .then(function(data) {
            hideLoader('fetchProfileBtn');
            if (data) {
                displayProfile(data);
            }
        });
}

// kumukuha ng posts data mula sa Facebook API, limit lang ng 10 posts
function fetchPostsData() {
    const token = getAccessToken();
    if (!token) return;
    
    showLoader('fetchPostsBtn');
    hideError();
    
    const endpoint = '/me/posts?fields=id,message,created_time,story&limit=10';
    makeApiRequest(endpoint, token)
        .then(function(data) {
            hideLoader('fetchPostsBtn');
            if (data) {
                displayPosts(data.data || []);
            }
        });
}

function fetchPhotosData() {
    const token = getAccessToken();
    if (!token) return;
    
    showLoader('fetchPhotosBtn');
    hideError();
    
    const endpoint = '/me/photos?fields=id,created_time,images&limit=12';
    makeApiRequest(endpoint, token)
        .then(function(data) {
            hideLoader('fetchPhotosBtn');
            if (data) {
                displayPhotos(data.data || []);
            }
        });
}

// ============================================
// DOM MANIPULATION FUNCTIONS
// ============================================

// nagpapakita ng profile data sa screen kasama ang picture, name, email at id
function displayProfile(profileData) {
    const profileSection = document.getElementById('profileSection');
    const profileContent = document.getElementById('profileContent');
    
    if (!profileData || (!profileData.id && !profileData.name)) {
        showError('No profile data found');
        return;
    }
    
    let html = '';
    
    if (profileData.picture && profileData.picture.data && profileData.picture.data.url) {
        html += '<img src="' + profileData.picture.data.url + '" alt="Profile Picture" class="fb-graph-profile-image">';
    }
    
    html += '<div class="fb-graph-profile-item">';
    html += '<div class="fb-graph-profile-label">ID</div>';
    html += '<div class="fb-graph-profile-value">' + (profileData.id || 'N/A') + '</div>';
    html += '</div>';
    
    html += '<div class="fb-graph-profile-item">';
    html += '<div class="fb-graph-profile-label">Name</div>';
    html += '<div class="fb-graph-profile-value">' + (profileData.name || 'N/A') + '</div>';
    html += '</div>';
    
    if (profileData.email) {
        html += '<div class="fb-graph-profile-item">';
        html += '<div class="fb-graph-profile-label">Email</div>';
        html += '<div class="fb-graph-profile-value">' + profileData.email + '</div>';
        html += '</div>';
    }
    
    if (profileData.location && profileData.location.name) {
        html += '<div class="fb-graph-profile-item">';
        html += '<div class="fb-graph-profile-label">Location</div>';
        html += '<div class="fb-graph-profile-value">' + profileData.location.name + '</div>';
        html += '</div>';
    }
    
    if (profileData.hometown && profileData.hometown.name) {
        html += '<div class="fb-graph-profile-item">';
        html += '<div class="fb-graph-profile-label">Hometown</div>';
        html += '<div class="fb-graph-profile-value">' + profileData.hometown.name + '</div>';
        html += '</div>';
    }
    
    if (profileData.age_range) {
        let ageRange = 'N/A';
        if (profileData.age_range.min && profileData.age_range.max) {
            ageRange = profileData.age_range.min + ' - ' + profileData.age_range.max + ' years old';
        } else if (profileData.age_range.min) {
            ageRange = profileData.age_range.min + '+ years old';
        }
        html += '<div class="fb-graph-profile-item">';
        html += '<div class="fb-graph-profile-label">Age Range</div>';
        html += '<div class="fb-graph-profile-value">' + ageRange + '</div>';
        html += '</div>';
    }
    
    if (profileData.birthday) {
        html += '<div class="fb-graph-profile-item">';
        html += '<div class="fb-graph-profile-label">Birthday</div>';
        html += '<div class="fb-graph-profile-value">' + profileData.birthday + '</div>';
        html += '</div>';
    }
    
    if (profileData.gender) {
        html += '<div class="fb-graph-profile-item">';
        html += '<div class="fb-graph-profile-label">Gender</div>';
        html += '<div class="fb-graph-profile-value">' + profileData.gender + '</div>';
        html += '</div>';
    }
    
    profileContent.innerHTML = html;
    profileSection.classList.remove('fb-graph-section-hidden');
}

// nagpapakita ng lahat ng posts sa screen kasama ang message o story at date
function displayPosts(posts) {
    const postsSection = document.getElementById('postsSection');
    const postsContent = document.getElementById('postsContent');
    
    if (!posts || posts.length === 0) {
        postsContent.innerHTML = '<div class="fb-graph-empty-state"><i class="bi bi-inbox"></i><div class="fb-graph-empty-state-text">No posts found</div></div>';
        postsSection.classList.remove('fb-graph-section-hidden');
        return;
    }
    
    let html = '';
    
    posts.forEach(function(post) {
        html += '<div class="fb-graph-post-card">';
        
        html += '<div class="fb-graph-post-header">';
        html += '<div class="fb-graph-post-date">';
        html += '<i class="bi bi-calendar"></i>';
        html += formatDate(post.created_time);
        html += '</div>';
        html += '</div>';
        
        if (post.message) {
            html += '<div class="fb-graph-post-message">' + escapeHtml(post.message) + '</div>';
        } else if (post.story) {
            html += '<div class="fb-graph-post-message">' + escapeHtml(post.story) + '</div>';
        } else {
            html += '<div class="fb-graph-post-message" style="color: #86868b; font-style: italic;">No message content</div>';
        }
        html += '</div>';
    });
    
    postsContent.innerHTML = html;
    postsSection.classList.remove('fb-graph-section-hidden');
}

function displayPhotos(photos) {
    const photosSection = document.getElementById('photosSection');
    const photosContent = document.getElementById('photosContent');
    
    if (!photos || photos.length === 0) {
        photosContent.innerHTML = '<div class="fb-graph-empty-state"><i class="bi bi-inbox"></i><div class="fb-graph-empty-state-text">No photos found</div></div>';
        photosSection.classList.remove('fb-graph-section-hidden');
        return;
    }
    
    let html = '';
    
    photos.forEach(function(photo) {
        const imageUrl = photo.images && photo.images[0] ? photo.images[0].source : '';
        
        if (imageUrl) {
            html += '<div class="fb-graph-photo-card">';
            html += '<img src="' + imageUrl + '" alt="Photo" class="fb-graph-photo-image">';
            html += '<div class="fb-graph-photo-info">';
            html += '<div class="fb-graph-photo-date">';
            html += '<i class="bi bi-calendar"></i>';
            html += formatDate(photo.created_time);
            html += '</div>';
            html += '</div>';
            html += '</div>';
        }
    });
    
    photosContent.innerHTML = html;
    photosSection.classList.remove('fb-graph-section-hidden');
}

// ============================================
// EVENT LISTENERS
// ============================================

document.getElementById('fetchProfileBtn').addEventListener('click', fetchProfileData);
document.getElementById('fetchPostsBtn').addEventListener('click', fetchPostsData);
document.getElementById('fetchPhotosBtn').addEventListener('click', fetchPhotosData);

document.getElementById('accessToken').addEventListener('input', function(e) {
    e.target.value = e.target.value.trim();
});
