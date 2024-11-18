const container = document.getElementsByClassName("container")[0];
const loginBtn = document.createElement("button");
const regBtn = document.createElement("button");
const loginform = document.createElement("form");
const regform = document.createElement("form");
const dashboard = document.createElement("div");
const header = document.createElement("div");
const biography = document.createElement("p");
const postStat = document.createElement("div");
const followersStat = document.createElement("div");
const followingStat = document.createElement("div");
const headerMenu = document.createElement("div");

let users = [];
let posts = [];
let user;
let emailOrUsername;

class Post {
  constructor(user, image, description, comments) {
    this.user = user;
    this.image = image;
    this.description = description;
    this.comments = comments;
    this.postId = Date.now();
  }
}

function createPost(user) {
  const postContainer = document.createElement("div");
  postContainer.className = "post-container";

  const postText = document.createElement("input");
  postText.type = "text";
  postText.placeholder = "Enter your post...";

  const postBtn = document.createElement("button");
  postBtn.textContent = "Post";

  const postImg = document.createElement("input");
  postImg.type = "file";

  postBtn.addEventListener("click", function () {
    const post = new Post();
    post.user = user;
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
      postContainer.removeChild(postBtn);
      postContainer.removeChild(postImg);
      refreshPostFeed(emailOrUsername);
    };
    reader.readAsDataURL(postImg.files[0]);
  });

  postContainer.appendChild(postText);
  postContainer.appendChild(postBtn);
  postContainer.appendChild(postImg);

  return postContainer;
}

function refreshPostFeed(emailFind) {
  const feed = document.getElementById("feed");
  feed.innerHTML = "";
  const storedPosts = localStorage.getItem("posts");
  const parsedPosts = storedPosts ? JSON.parse(storedPosts) : [];
  parsedPosts.forEach((post) => {
    if (post.user === emailFind) {
      const postElement = document.createElement("div");
      postElement.className = "post";
      const postDesc = document.createElement("p");
      postDesc.textContent = post.description;
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

document.addEventListener("DOMContentLoaded", function () {
  loginBtn.textContent = "Login";
  loginBtn.id = "login";
  regBtn.textContent = "Register";
  regBtn.id = "register";
  container.appendChild(loginBtn);
  container.appendChild(regBtn);
});
document.addEventListener("click", function (event) {
  if (event.target.id === "register") {
    const submitBtn = document.createElement("button");
    container.removeChild(regBtn);
    container.removeChild(loginBtn);
    container.appendChild(submitBtn);
    regform.id = "regform";
    submitBtn.id = "submitBtn";
    submitBtn.textContent = "Register";
    submitBtn.type = "button";
    const fields = [
      { type: "text", name: "fname", placeholder: "Enter your first name..." },
      { type: "text", name: "lname", placeholder: "Enter your last name..." },
      { type: "email", name: "email", placeholder: "Enter your email..." },
      { type: "text", name: "username", placeholder: "Enter your username..." },
      {
        type: "password",
        name: "password",
        placeholder: "Enter your password...",
      },
      {
        type: "password",
        name: "password2",
        placeholder: "Confirm password...",
      },
    ];
    fields.forEach((field) => {
      const input = document.createElement("input");
      input.type = field.type;
      input.name = field.name;
      input.placeholder = field.placeholder;
      regform.appendChild(input);
    });
    submitBtn.addEventListener("click", function () {
      const fname = regform.fname.value;
      const lname = regform.lname.value;
      const email = regform.email.value;
      const username = regform.username.value;
      const password = regform.password.value;
      const password2 = regform.password2.value;
      if (password !== password2) {
        alert("Passwords do not match");
        location.reload();
      }
      const user = { fname, lname, email, username, password, followers: [], following: [] };
      const storedUsers = localStorage.getItem("users");
      let usersArray = storedUsers ? JSON.parse(storedUsers) : [];
      usersArray.push(user);
      localStorage.setItem("users", JSON.stringify(usersArray));
      alert("Registration successful");
      location.reload();
    });
    container.appendChild(regform);
    container.appendChild(submitBtn);
  } else if (event.target.id === "login") {
    if (localStorage.getItem("loggedInUser")) {
      window.location.href = "feed.html";
    }
    const submitLoginBtn = document.createElement("button");
    container.removeChild(regBtn);
    container.removeChild(loginBtn);
    loginform.id = "loginform";
    submitLoginBtn.id = "subLoginBtn";
    submitLoginBtn.textContent = "Login";
    submitLoginBtn.type = "button";
    const loginFields = [
      {
        type: "text",
        name: "emailOrUsername",
        placeholder: "Enter your email/username...",
      },
      {
        type: "password",
        name: "password",
        placeholder: "Enter your password...",
      },
    ];
    loginFields.forEach((field) => {
      const input = document.createElement("input");
      input.type = field.type;
      input.name = field.name;
      input.placeholder = field.placeholder;
      loginform.appendChild(input);
    });
    container.appendChild(loginform);
    container.appendChild(submitLoginBtn);
    submitLoginBtn.addEventListener("click", function () {
      emailOrUsername = loginform.emailOrUsername.value;
      const password = loginform.password.value;
      const storedUsers = localStorage.getItem("users");
      const parsedUsers = storedUsers ? JSON.parse(storedUsers) : [];
      const user = parsedUsers.find(
        (u) =>
          (u.email === emailOrUsername && u.password === password) ||
          (u.username === emailOrUsername && u.password === password)
      );
      if (user) {
        alert("Login successful");
        loggedInUser = user.username;
        localStorage.setItem("loggedInUser", loggedInUser);
        container.removeChild(loginform);
        container.removeChild(submitLoginBtn);
        window.location.href = "feed.html";
      } else if(localStorage.getItem("loggedInUser")===null){
        alert("No user found. Please register!");
        location.reload();
      }
      else {
        alert("Incorrect email/username or password");
        location.reload();
      }
    });
  } else if (event.target.id === "editProfile") {
    const storedUsers = localStorage.getItem("users");
    const parsedUsers = storedUsers ? JSON.parse(storedUsers) : [];
    const user = parsedUsers.find((u) => u.username === emailOrUsername);
    const editProfileForm = document.createElement("form");
    editProfileForm.id = "editProfileForm";
    const editProfileFields = [
      {
        type: "text",
        name: "fname",
        placeholder: "Enter your first name...",
      },
      {
        type: "text",
        name: "lname",
        placeholder: "Enter your last name...",
      },
      { type: "email", name: "email", placeholder: "Enter your email..." },
      {
        type: "password",
        name: "password",
        placeholder: "Enter new password...",
      },
      {
        type: "password",
        name: "confirmPassword",
        placeholder: "Confirm new password...",
      },
      { type: "text", name: "bio", placeholder: "Enter your bio..." },
    ];
    editProfileFields.forEach((field) => {
      const input = document.createElement("input");
      input.type = field.type;
      input.name = field.name;
      input.placeholder = field.placeholder;
      editProfileForm.appendChild(input);
    });
    editProfileForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const fname = editProfileForm.fname.value || user.fname;
      const lname = editProfileForm.lname.value || user.lname;
      const email = editProfileForm.email.value || user.email;
      const password = editProfileForm.password.value || user.password;
      user.fname = fname;
      user.lname = lname;
      user.email = email;
      user.password = password;
      user.bio = editProfileForm.bio.value || user.bio;
      biography.textContent = user.bio;
      localStorage.setItem("users", JSON.stringify(parsedUsers));
      alert("Profile updated");
      location.reload();
    });
    header.appendChild(editProfileForm);
    const submitEditBtn = document.createElement("button");
    submitEditBtn.id = "submitEditBtn";
    submitEditBtn.textContent = "Submit";
    editProfileForm.appendChild(submitEditBtn);
  }
});

document.addEventListener("dblclick", function (event) {
  if (event.target.className === "post") {
    const edit = document.createElement("button");
    const delPost = document.createElement("button");
    const addCommentBtn = document.createElement("button");
    addCommentBtn.textContent = "Add Comment";
    addCommentBtn.id = "addCommentBtn";
    edit.textContent = "Edit";
    delPost.textContent = "Delete Post";
    edit.id = "edit";
    delPost.id = "delPost";
    event.target.appendChild(edit);
    event.target.appendChild(delPost);
    event.target.appendChild(addCommentBtn);
    addCommentBtn.addEventListener("click", function () {
      const commentForm = document.createElement("form");
      commentForm.id = "commentForm";
      const commentFields = [
        { type: "text", name: "comment", placeholder: "Comment..." },
      ];
      commentFields.forEach((field) => {
        const input = document.createElement("input");
        input.type = field.type;
        input.name = field.name;
        input.placeholder = field.placeholder;
        commentForm.appendChild(input);
      });
      event.target.appendChild(commentForm);
      const submitCommentBtn = document.createElement("button");
      submitCommentBtn.id = "submitCommentBtn";
      submitCommentBtn.textContent = "Submit";
      commentForm.appendChild(submitCommentBtn);
      commentForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const postId = event.target.dataset.postId;
        const storedPosts = localStorage.getItem("posts");
        const parsedPosts = storedPosts ? JSON.parse(storedPosts) : [];
        const postToEdit = parsedPosts.find((post) => post.id === postId);
        if (postToEdit) {
          postToEdit.comments.push(commentForm.comment.value);
          localStorage.setItem("posts", JSON.stringify(parsedPosts));
          alert("Comment added");
          location.reload();
        }
      });
    });
    edit.addEventListener("click", function () {
      const editForm = document.createElement("form");
      editForm.id = "editForm";
      const editFields = [
        { type: "text", name: "description", placeholder: "Edit post..." },
      ];
      editFields.forEach((field) => {
        const input = document.createElement("input");
        input.type = field.type;
        input.name = field.name;
        input.placeholder = field.placeholder;
        editForm.appendChild(input);
      });
      event.target.appendChild(editForm);
      const submitEditBtn = document.createElement("button");
      submitEditBtn.id = "submitEditBtn";
      submitEditBtn.textContent = "Submit";
      editForm.appendChild(submitEditBtn);
      editForm.addEventListener("submit", function (event) {
        
        const postId = event.target.dataset.postId;
        const storedPosts = localStorage.getItem("posts");
        const parsedPosts = storedPosts ? JSON.parse(storedPosts) : [];
        const postToEdit = parsedPosts.find((post) => post.id === postId);
        if (postToEdit) {
          postToEdit.description = editForm.description.value;
          localStorage.setItem("posts", JSON.stringify(parsedPosts));
        }
      });
    });
    delPost.addEventListener("click", function () {
      event.target.remove();
      const storedPosts = localStorage.getItem("posts");
      const parsedPosts = storedPosts ? JSON.parse(storedPosts) : [];
      parsedPosts.forEach((post) => {
        if (post.user === emailOrUsername) {
          parsedPosts.splice(parsedPosts.indexOf(post), 1);
          localStorage.setItem("posts", JSON.stringify(parsedPosts));
        }
      });
    });
  }
});
