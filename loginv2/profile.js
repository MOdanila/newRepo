const header = document.createElement("div");
const middle = document.createElement("div");
const postContainer = document.createElement("div");
const feed = document.createElement("div");
feed.id = "feed";
let generated = false;
let postId = 0;

let followersCount;
let followingCount;
let postCount;

const storedUsers = localStorage.getItem("users");
const parsedUsers = storedUsers ? JSON.parse(storedUsers) : [];
parsedUsers.forEach((user) => {
  if (user.username === localStorage.getItem("loggedInUser")) {
    followersCount = user.followers.length;
    followingCount = user.following.length;
    const storedPosts = localStorage.getItem("posts");
    const parsedPosts = storedPosts ? JSON.parse(storedPosts) : [];
    parsedPosts.forEach((post) => {
      if (post.user === localStorage.getItem("loggedInUser")) {
        postCount = postCount ? postCount + 1 : 1;
      }
    });
  }
});

class Post {
  constructor(user, image, description, comments) {
    this.user = user;
    this.image = image;
    this.description = description;
    this.comments = comments;
    this.id = Date.now();
  }
}

header.className = "header";
middle.className = "middle";
postContainer.className = "post-container";

let welcomeMessage = document.createElement("p");
header.appendChild(welcomeMessage);

let profilePicture = document.createElement("img");
parsedUsers.forEach((user) => {
  if (user.username === localStorage.getItem("loggedInUser")) {
    profilePicture.src = user.profilePic;
  }
});
header.appendChild(profilePicture);

document.body.appendChild(header);

const stats = document.createElement("div");
stats.className = "stats";

let postStats = document.createElement("div");
postStats.className = "post-stats";
if (postCount == null) postCount = 0;
postStats.textContent = `Posts: ${postCount}`;

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

const userData = {
  username: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  profilePic: "",
};
document.addEventListener("DOMContentLoaded", function (event) {
  refreshPostFeed(localStorage.getItem("loggedInUser"));
});
if (parsedUsers.length > 0) {
  const user = localStorage.getItem("loggedInUser");
  welcomeMessage.textContent = `Welcome, ${user}!`;
  const userIndex = parsedUsers.findIndex((u) => u.username === user);
  if (userIndex !== -1) {
    userData.username = parsedUsers[userIndex].username;
    userData.email = parsedUsers[userIndex].email;
    userData.password = parsedUsers[userIndex].password;
    userData.firstName = parsedUsers[userIndex].fname;
    userData.lastName = parsedUsers[userIndex].lname;
    userData.profilePic = parsedUsers[userIndex].profilePic;
  }
}
function editingProfile() {
  const modal = document.createElement("div");
  modal.className = "modal";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const close = document.createElement("span");
  close.className = "close";
  close.innerHTML = "&times;";
  modalContent.appendChild(close);
  const editForm = document.createElement("form");
  const fnameInput = document.createElement("input");
  fnameInput.type = "text";
  fnameInput.value = userData.firstName;
  const lnameInput = document.createElement("input");
  lnameInput.type = "text";
  lnameInput.value = userData.lastName;
  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.value = userData.email;
  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.value = userData.password;
  const usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.value = userData.username;

  const profilePic = document.createElement("input");
  profilePic.type = "file";

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Save";
  submitBtn.id = "submitBtn";
  editForm.appendChild(fnameInput);
  editForm.appendChild(lnameInput);
  editForm.appendChild(emailInput);
  editForm.appendChild(passwordInput);
  editForm.appendChild(usernameInput);
  editForm.appendChild(profilePic);
  editForm.appendChild(submitBtn);
  modalContent.appendChild(editForm);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  modal.style.display = "block";
  close.addEventListener("click", function () {
    modal.style.display = "none";
  });
  submitBtn.addEventListener("click", function (event) {
    event.preventDefault();
    const storedUsers = localStorage.getItem("users");
    const parsedUsers = storedUsers ? JSON.parse(storedUsers) : [];
    const userIndex = parsedUsers.findIndex(
      (u) => u.username === userData.username
    );
    if (userIndex !== -1) {
      parsedUsers[userIndex].fname = fnameInput.value;
      parsedUsers[userIndex].lname = lnameInput.value;
      parsedUsers[userIndex].email = emailInput.value;
      parsedUsers[userIndex].password = passwordInput.value;
      parsedUsers[userIndex].username = usernameInput.value;
      if (profilePic.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (event) {
          parsedUsers[userIndex].profilePic = event.target.result;
          localStorage.setItem("users", JSON.stringify(parsedUsers));
        };
        reader.readAsDataURL(profilePic.files[0]);
      }
      localStorage.setItem("users", JSON.stringify(parsedUsers));
      userData.firstName = fnameInput.value;
      userData.lastName = lnameInput.value;
      userData.email = emailInput.value;
      userData.password = passwordInput.value;
      userData.username = usernameInput.value;
      userData.profilePic = JSON.stringify(parsedUsers[userIndex].profilePic);
      localStorage.setItem("loggedInUser", userData.username);
    }
    location.reload();
  });
}

const homeBtn = document.createElement("button");
homeBtn.className = "home-btn";
homeBtn.textContent = "Home";
buttons.appendChild(homeBtn);
homeBtn.addEventListener("click", () => {
  window.location.href = "./feed.html";
});

const postBtn = document.createElement("button");
postBtn.className = "post-btn";
postBtn.textContent = "Create Post";
buttons.appendChild(postBtn);

postBtn.addEventListener("click", () => {
  createPost();
});

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

  postContainer.appendChild(postText);
  postContainer.appendChild(postBtnSubmit);
  postContainer.appendChild(postImg);
  middle.appendChild(postContainer);

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
      refreshPostFeed(localStorage.getItem("loggedInUser"));
    };
    reader.readAsDataURL(postImg.files[0]);
  });

  return postContainer;
}

function refreshPostFeed(postUser) {
  feed.innerHTML = "";
  const storedPosts = localStorage.getItem("posts");
  const parsedPosts = storedPosts ? JSON.parse(storedPosts) : [];
  parsedPosts.forEach((post) => {
    if (post.user === postUser) {
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
}

document.body.appendChild(feed);

const editBtn = document.createElement("button");
editBtn.className = "edit-btn";
editBtn.textContent = "Edit Profile";
buttons.appendChild(editBtn);
editBtn.addEventListener("click", editingProfile);

const logout = document.createElement("button");
logout.className = "logout";
logout.textContent = "Logout";
logout.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "./loginv2.html";
});
buttons.appendChild(logout);

middle.appendChild(buttons);

document.body.appendChild(middle);

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("post")) {
    const storedPosts = localStorage.getItem("posts");
    const parsedPosts = storedPosts ? JSON.parse(storedPosts) : [];
    const postDesc = event.target.querySelector("#postDesc");
    const selectedPost = parsedPosts.find(
      (post) => post.description === postDesc.textContent
    );
    const selectedPostId = selectedPost.id;
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

    const editPostBtn = document.createElement("button");
    editPostBtn.textContent = "Edit Post";
    editPostBtn.id = "editPostBtn";
    modalContent.appendChild(editPostBtn);

    editPostBtn.addEventListener("click", function () {
      const editForm = document.createElement("form");
      editForm.id = "editForm";
      const editFields = [
        {
          type: "text",
          name: "description",
          placeholder: "Edit post...",
        },
      ];
      editFields.forEach((field) => {
        const input = document.createElement("input");
        input.type = field.type;
        input.name = field.name;
        input.placeholder = field.placeholder;
        editForm.appendChild(input);
      });
      modalContent.appendChild(editForm);
      const submitEditBtn = document.createElement("button");
      submitEditBtn.id = "submitEditBtn";
      submitEditBtn.textContent = "Submit";
      editForm.appendChild(submitEditBtn);
      submitEditBtn.addEventListener("click", function (event) {
        event.preventDefault();
        selectedPost.description = editForm.description.value;
        localStorage.setItem("posts", JSON.stringify(parsedPosts));
        location.reload();
      });
    });

    const deletePostBtn = document.createElement("button");
    deletePostBtn.textContent = "Delete Post";
    deletePostBtn.id = "deletePostBtn";
    modalContent.appendChild(deletePostBtn);

    deletePostBtn.addEventListener("click", function () {
      const updatedPosts = parsedPosts.filter(
        (post) => post.id !== selectedPostId
      );
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
      location.reload();
    });

    const commentList = document.createElement("ul");
    commentList.className = "comment-list";
    selectedPost.comments.forEach((comment) => {
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

  if(event.target.classList.contains("followers")){
    const modal = document.createElement("div");
    modal.className = "modal";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const close = document.createElement("span");
    close.className = "close";
    close.innerHTML = "&times;";
    modalContent.appendChild(close);

    const followersList = document.createElement("ul");
    followersList.className = "followers-list";
    parsedUsers.forEach((user) => {
      if (user.following.includes(localStorage.getItem("loggedInUser"))) {
        const followerItem = document.createElement("li");
        followerItem.textContent = user.username;
        followersList.appendChild(followerItem);
      }
    });
    modalContent.appendChild(followersList);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    modal.style.display = "block";

    close.addEventListener("click", function () {
      modal.remove();
    });
  }

  if(event.target.classList.contains("following")){
    const modal = document.createElement("div");
    modal.className = "modal";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const close = document.createElement("span");
    close.className = "close";
    close.innerHTML = "&times;";
    modalContent.appendChild(close);

    const followersList = document.createElement("ul");
    followersList.className = "followers-list";
    parsedUsers.forEach((user) => {
      if (user.followers.includes(localStorage.getItem("loggedInUser"))) {
        const followerItem = document.createElement("li");
        followerItem.textContent = user.username;
        followersList.appendChild(followerItem);
      }
    });
    modalContent.appendChild(followersList);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    modal.style.display = "block";

    close.addEventListener("click", function () {
      modal.remove();
    });
  }

});
