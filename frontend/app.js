const API = "https://你的后端.onrender.com"; // ❗改成你的 Render 地址

let token = "";
let imageUrl = "";

/* 注册 */
async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  await fetch(API + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  alert("注册成功");
}

/* 登录 */
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  token = data.token;

  document.getElementById("auth").style.display = "none";
  document.getElementById("app").style.display = "block";

  loadNotes();
}

/* 上传图片 */
async function uploadImage() {
  const file = document.getElementById("image").files[0];
  const formData = new FormData();

  formData.append("image", file);

  const res = await fetch(API + "/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  imageUrl = data.url;

  alert("上传成功");
}

/* 保存笔记 */
async function saveNote() {
  const content = document.getElementById("content").value;
  const tags = document.getElementById("tags").value;

  await fetch(API + "/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ content, tags, image: imageUrl })
  });

  loadNotes();
}

/* 获取笔记 */
async function loadNotes() {
  const res = await fetch(API + "/notes", {
    headers: { "Authorization": token }
  });

  const notes = await res.json();

  const div = document.getElementById("notes");
  div.innerHTML = "";

  notes.forEach(n => {
    div.innerHTML += `
      <div class="note">
        <p>${n.content}</p>
        <small>${n.tags}</small><br/>
        ${n.image ? `<img src="${n.image}" width="200"/>` : ""}
      </div>
    `;
  });
}

/* 搜索 */
async function searchNote() {
  const q = document.getElementById("search").value;

  const res = await fetch(API + "/search?q=" + q, {
    headers: { "Authorization": token }
  });

  const notes = await res.json();

  const div = document.getElementById("notes");
  div.innerHTML = "";

  notes.forEach(n => {
    div.innerHTML += `
      <div class="note">
        <p>${n.content}</p>
      </div>
    `;
  });
}
