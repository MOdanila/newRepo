const storedPosts = localStorage.getItem("posts");
const parsedPosts = storedPosts ? JSON.parse(storedPosts) : [];

const storedUsers = localStorage.getItem("users");
const parsedUsers = storedUsers ? JSON.parse(storedUsers) : [];

const header = document.createElement("div");
header.className = "header";

const feed = document.createElement("div");
feed.className = "feed";

const leftMenu = document.createElement("div");
leftMenu.className = "left-menu";

const rightMenu = document.createElement("div");
rightMenu.className = "right-menu";

const middle = document.createElement("div");

let postId = 0;

class Post {
  constructor(user, image, description, comments) {
    this.user = user;
    this.image = image;
    this.description = description;
    this.comments = comments;
    this.id = postId++;
  }
}

function createPost() {
  const postContainer = document.createElement("div");
  postContainer.className = "post-container";

  const postText = document.createElement("input");
  postText.type = "text";
  postText.placeholder = "Enter your post...";

  const postBtnSubmit = document.createElement("button");
  postBtnSubmit.textContent = "Post";

  const postImg = document.createElement("input");
  postImg.type = "file";

  const modal = document.createElement("div");
  modal.className = "modal";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const close = document.createElement("span");
  close.className = "close";
  close.innerHTML = "&times;";
  modalContent.appendChild(close);


  postContainer.appendChild(postText);
  postContainer.appendChild(postBtnSubmit);
  postContainer.appendChild(postImg);
  modalContent.appendChild(postContainer);

  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  modal.style.display = "block";

  close.addEventListener("click", function () {
    modal.remove();
  });

  postBtnSubmit.addEventListener("click", function () {
    const post = new Post();
    post.user = localStorage.getItem("loggedInUser");
    post.description = postText.value.trim();
    post.comments = [];
    const reader = new FileReader();
    reader.onload = function (event) {
      post.image = event.target.result;
      const storedPosts = localStorage.getItem("posts");
      let postsArray = storedPosts ? JSON.parse(storedPosts) : [];
      postsArray.push(post);
      localStorage.setItem("posts", JSON.stringify(postsArray));
      postText.value = "";
      postContainer.removeChild(postText);
      postContainer.removeChild(postBtnSubmit);
      postContainer.removeChild(postImg);
      //refreshPostFeed(localStorage.getItem("loggedInUser"));
    };
    reader.readAsDataURL(postImg.files[0]);
    modal.remove();
  });

  return postContainer;
}

document.addEventListener("DOMContentLoaded", function () {
  const leftTop = createDiv("left-top", "Instagram");
  leftMenu.appendChild(leftTop);

  const leftOptions = createDiv("left-options");
  leftOptions.className = "leftOptions";
  const options = [
    "Home",
    "Search",
    "Profile",
    "Logout",
    "Settings",
    "Create Post",
  ];
  options.forEach((option, i) => {
    const button = createButton(option, `option${i}`);
    leftOptions.appendChild(button);
  });
  leftMenu.appendChild(leftOptions);

  const followerList = createDiv("followerList");
  parsedUsers.forEach((user) => {
    if (user.following.includes(localStorage.getItem("loggedInUser"))) {
      const follower = createDiv(null, user.username);
      followerList.appendChild(follower);
    }
  });
  leftMenu.appendChild(followerList);

  const stories = createDiv("stories");
  for (let i = 0; i < 3; i++) {
    const story = createDiv(null, `story${i}`);
    stories.appendChild(story);
  }
  header.appendChild(stories);

  const rightTop = createDiv(
    "right-top",
    `${localStorage.getItem("loggedInUser")}`
  );
  rightMenu.appendChild(rightTop);

  const suggestions = createDiv("suggestions");
  const suggList = createDiv("suggList");
  for (let i = 0; i < 5; i++) {
    const suggestion = createDiv(null, `suggestion${i}`);
    suggList.appendChild(suggestion);
  }
  suggestions.appendChild(suggList);
  rightMenu.appendChild(suggestions);

  header.appendChild(feed);
  parsedUsers.forEach((user) => {
    if (user.followers.includes(localStorage.getItem("loggedInUser"))) {
      parsedPosts.forEach((post) => {
        if (post.user === user.username) {
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

          const postUsername = document.createElement("p");
          postUsername.textContent = `@${post.user}`;
          postUsername.style.fontSize = "10px";
          postUsername.style.color = "grey";
          postUsername.style.marginTop = "0px";

          postElement.appendChild(postUsername);
          postElement.appendChild(postDesc);
          postElement.appendChild(postImg);
          feed.appendChild(postElement);
          postElement.addEventListener("click", function (event) {
            if (event.target.classList.contains("post")) {
              const postContent = event.target.innerHTML;
              const modal = document.createElement("div");
              modal.className = "modal";

              const modalContent = document.createElement("div");
              modalContent.className = "modal-content";

              const close = document.createElement("span");
              close.className = "close";
              close.innerHTML = "&times;";
              modalContent.appendChild(close);

              const postContentElement = document.createElement("div");
              postContentElement.className = "post-content";
              postContentElement.innerHTML = `${postContent}`;

              modalContent.appendChild(postContentElement);

              const commentInput = document.createElement("input");
              commentInput.type = "text";
              commentInput.placeholder = "Add a comment...";
              commentInput.id = "commentInput";
              modalContent.appendChild(commentInput);

              const addCommentBtn = document.createElement("button");
              addCommentBtn.textContent = "Add Comment";
              addCommentBtn.id = "addCommentBtn";
              modalContent.appendChild(addCommentBtn);

              addCommentBtn.addEventListener("click", function () {
                const comment = commentInput.value;
                const commentUser = localStorage.getItem("loggedInUser");
                post.comments.push({ comment, commentUser });
                localStorage.setItem("posts", JSON.stringify(parsedPosts));
                alert("Comment added");
                location.reload();
              });

              const commentList = document.createElement("ul");
              commentList.className = "comment-list";
              post.comments.forEach((comment) => {
                const commentItem = document.createElement("li");
                commentItem.textContent =
                  comment.comment + " - " + `@${comment.commentUser}`;
                commentList.appendChild(commentItem);
              });
              modalContent.appendChild(commentList);

              modal.appendChild(modalContent);
              document.body.appendChild(modal);
              modal.style.display = "block";

              const closeBtn = modal.querySelector(".close");
              closeBtn.addEventListener("click", function () {
                modal.remove();
              });
            }
          });
        }
      });
    }
  });

  document.body.appendChild(header);
  document.body.appendChild(leftMenu);
  document.body.appendChild(rightMenu);
});
function createDiv(id, text) {
  const div = document.createElement("div");
  if (id) div.id = id;
  if (text) div.textContent = text;
  return div;
}

function createButton(text, id) {
  const button = document.createElement("button");
  button.textContent = text;
  button.id = id;
  return button;
}

document.addEventListener("click", function (event) {
  if (event.target.id === "option0") {
    location.reload();
  }
  if (event.target.id === "option1") {
    const searchUsername = document.createElement("input");
    searchUsername.type = "text";
    searchUsername.placeholder = "Search by username...";
    searchUsername.id = "searchUsername";
    header.appendChild(searchUsername);
    const searchBtn = document.createElement("button");
    searchBtn.textContent = "Search";
    searchBtn.id = "searchBtn";
    header.appendChild(searchBtn);
    searchBtn.addEventListener("click", function () {
      const searchedUsername = searchUsername.value.trim();
      localStorage.setItem("searchedUser", searchedUsername);
      if (searchedUsername) {
        const users = JSON.parse(localStorage.getItem("users"));
        const user = users.find((u) => u.username === searchedUsername);
        if (user) {
          window.location.href = "searchedProfile.html";
        } else {
          alert("User not found");
        }
      }
    });
  }
  if (event.target.id === "option2") {
    if (localStorage.getItem("loggedInUser")) {
      window.location.href = "profile.html";
    } else {
      alert("Please login first");
      window.location.href = "loginv2.html";
    }
  }
  if (event.target.id === "option3") {
    localStorage.removeItem("loggedInUser");
    window.location.href = "loginv2.html";
  }

  if (event.target.id === "option5") {
    createPost();
  }
});
