document.addEventListener('DOMContentLoaded', () => {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const postsElement = document.getElementById('posts');
    const postDetailsElement = document.getElementById('post-details');

    const fetchPostsAndUsers = async () => {
        loadingElement.style.display = 'block';
        try {
            const [postsResponse, usersResponse] = await Promise.all([
                fetch('https://jsonplaceholder.typicode.com/posts'),
                fetch('https://jsonplaceholder.typicode.com/users')
            ]);

            const posts = await postsResponse.json();
            const users = await usersResponse.json();

            const userMap = users.reduce((map, user) => {
                map[user.id] = user;
                return map;
            }, {});

            displayPosts(posts, userMap);
        } catch (error) {
            errorElement.textContent = 'Failed to load data';
            errorElement.style.display = 'block';
        } finally {
            loadingElement.style.display = 'none';
        }
    };

    const displayPosts = (posts, userMap) => {
        postsElement.innerHTML = '';
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
                <p><strong>Author:</strong> ${userMap[post.userId].name} (${userMap[post.userId].email})</p>
                <button onclick="viewPostDetails(${post.id})">View Details</button>
            `;
            postsElement.appendChild(postElement);
        });
    };

    window.viewPostDetails = async (postId) => {
        try {
            const postResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
            const post = await postResponse.json();

            const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
            const comments = await commentsResponse.json();

            displayPostDetails(post, comments);
        } catch (error) {
            errorElement.textContent = 'Failed to load post details';
            errorElement.style.display = 'block';
        }
    };

    const displayPostDetails = (post, comments) => {
        postDetailsElement.innerHTML = `
            <div class="post-details">
                <h2>${post.title}</h2>
                <p>${post.body}</p>
                <h3>Comments</h3>
                ${comments.map(comment => `
                    <div>
                        <p><strong>${comment.name}</strong> (${comment.email})</p>
                        <p>${comment.body}</p>
                    </div>
                `).join('')}
            </div>
        `;
        postDetailsElement.style.display = 'block';
    };

    fetchPostsAndUsers();
});
