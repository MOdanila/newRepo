const header = document.createElement("div");
const middle = document.createElement("div");
const postContainer = document.createElement("div");
const feed = document.createElement("div");
feed.id = "feed";
header.className = "header";
middle.className = "middle";
postContainer.className = "post-container";
let followersCount;
let followingCount;

const storedUsers = localStorage.getItem("users");
const parsedUsers = storedUsers ? JSON.parse(storedUsers) : [];
parsedUsers.forEach((user) => {
  if (user.username === localStorage.getItem("searchedUser")) {
    followersCount = user.followers.length;
    followingCount = user.following.length;
  }
});

let welcomeMessage = document.createElement("p");
welcomeMessage.textContent = localStorage.getItem("searchedUser");
header.appendChild(welcomeMessage);

let profilePicture = document.createElement("img");
parsedUsers.forEach((user) => {
  if (user.username === localStorage.getItem("searchedUser")) {
    profilePicture.src = user.profilePic;
  }
});
header.appendChild(profilePicture);

document.body.appendChild(header);

const stats = document.createElement("div");
stats.className = "stats";

let postStats = document.createElement("div");
postStats.className = "post-stats";
postStats.textContent = "Posts: 0";

let followers = document.createElement("div");
followers.className = "followers";
followers.textContent = `Followers: ${followersCount}`;

let following = document.createElement("div");
following.className = "following";
following.textContent = `Following: ${followingCount}`;

stats.appendChild(followers);
stats.appendChild(following);
stats.appendChild(postStats);
middle.appendChild(stats);

const buttons = document.createElement("div");
buttons.className = "buttons";

const followBtn = document.createElement("button");
followBtn.className = "follow-btn";
buttons.appendChild(followBtn);

//const viewedProfile = localStorage.getItem("searchedUser");
parsedUsers.forEach((user) => {
  if (user.username === localStorage.getItem("searchedUser")) {
    if (user.followers.includes(localStorage.getItem("loggedInUser"))) {
      followBtn.textContent = "Unfollow";
    } else {
      followBtn.textContent = "Follow";
    }
  }
});

followBtn.addEventListener("click", () => {
  if (followBtn.textContent === "Follow") {
    parsedUsers.forEach((user) => {
      if (user.username === localStorage.getItem("searchedUser")) {
        user.followers.push(localStorage.getItem("loggedInUser"));
        localStorage.setItem("users", JSON.stringify(parsedUsers));
      }
      if (user.username === localStorage.getItem("loggedInUser")) {
        user.following.push(localStorage.getItem("searchedUser"));
        localStorage.setItem("users", JSON.stringify(parsedUsers));
      }
    });
    followBtn.textContent = "Unfollow";
  } else {
    parsedUsers.forEach((user) => {
      if (user.username === localStorage.getItem("searchedUser")) {
        user.followers.splice(
          user.followers.indexOf(localStorage.getItem("loggedInUser")),
          1
        );
        localStorage.setItem("users", JSON.stringify(parsedUsers));
      }
      if (user.username === localStorage.getItem("loggedInUser")) {
        user.following.splice(
          user.following.indexOf(localStorage.getItem("searchedUser")),
          1
        );
        localStorage.setItem("users", JSON.stringify(parsedUsers));
      }
    });
    followBtn.textContent = "Follow";
  }
});

const homeBtn = document.createElement("button");
homeBtn.className = "home-btn";
homeBtn.textContent = "Home";
buttons.appendChild(homeBtn);
homeBtn.addEventListener("click", () => {
  localStorage.removeItem("searchedUser");
  window.location.href = "./feed.html";
});

middle.appendChild(buttons);

document.body.appendChild(middle);

document.body.appendChild(feed);

const storedPosts = localStorage.getItem("posts");
const parsedPosts = storedPosts ? JSON.parse(storedPosts) : [];
parsedPosts.forEach((post) => {
  if (post.user === localStorage.getItem("searchedUser")) {
    const postElement = document.createElement("div");
    postElement.className = "post";
    const postDesc = document.createElement("p");
    postDesc.textContent = post.description;
    postDesc.id = "postDesc";
    const postImg = document.createElement("img");
    postImg.src = post.image;
    postImg.style.objectFit = "cover";
    postImg.style.width = "100%";
    postImg.style.height = "100%";
    postElement.appendChild(postDesc);
    postElement.appendChild(postImg);
    feed.appendChild(postElement);
  }
});

document.body.appendChild(feed);

document.addEventListener("click", (event) => {
  if (event.target.className === "post") {
    const storedPosts = localStorage.getItem("posts");
    const parsedPosts = storedPosts ? JSON.parse(storedPosts) : [];
    const postDesc = event.target.querySelector("#postDesc");
    const selectedPost = parsedPosts.find(
      (post) => post.description === postDesc.textContent
    );
    const modal = document.createElement("div");
    modal.className = "modal";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const close = document.createElement("span");
    close.className = "close";
    close.innerHTML = "&times;";
    modalContent.appendChild(close);

    const postContent = event.target.innerHTML;
    const postContentElement = document.createElement("div");
    postContentElement.className = "post-content";
    postContentElement.innerHTML = `${postContent}`;

    modalContent.appendChild(postContentElement);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    modal.style.display = "block";

    close.addEventListener("click", function () {
      modal.remove();
    });

    const commentForm = document.createElement("input");
    commentForm.type = "text";
    commentForm.placeholder = "Enter your comment...";
    commentForm.id = "commentForm";
    modalContent.appendChild(commentForm);

    const submitCommentBtn = document.createElement("button");
    submitCommentBtn.id = "submitCommentBtn";
    submitCommentBtn.textContent = "Submit";
    modalContent.appendChild(submitCommentBtn);
    submitCommentBtn.addEventListener("click", function () {
      const comment = commentForm.value;
      const commentUser = localStorage.getItem("loggedInUser");
      const postDesc = event.target.querySelector("#postDesc");
      const storedPosts = localStorage.getItem("posts");
      const parsedPosts = storedPosts ? JSON.parse(storedPosts) : [];
      const selectedPost = parsedPosts.find(
        (post) => post.description === postDesc.textContent
      );
      selectedPost.comments.push({ comment, commentUser });
      localStorage.setItem("posts", JSON.stringify(parsedPosts));
      alert("Comment added");
      location.reload();
    });

    const commentList = document.createElement("ul");
    commentList.className = "comment-list";
    selectedPost.comments.forEach((comment) => {
      const commentElement = document.createElement("li");
      commentElement.textContent =
        comment.comment + " - " + `@${comment.commentUser}`;
      commentList.appendChild(commentElement);
    });
    modalContent.appendChild(commentList);
  }
});
