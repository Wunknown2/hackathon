const API = "http://localhost:8000/clothes"
const addBtn = document.querySelector("#btnShow");
const none = document.querySelector(".none");
const cont__2 = document.querySelector(".cont__2");
none.addEventListener("click", () => {
  editModal.style.display = "none";
});
addBtn.addEventListener("click", () => {
  cont__2.classList.toggle("active");
});
let inpName = document.querySelector("#inpName");
let inpImg = document.querySelector("#inpImg");
let inpPrice = document.querySelector("#inpPrice");
let btnAdd = document.querySelector("#btnAdd");
let contt = document.querySelector("#contt");
let inpSearch1 = document.querySelector("#inpSearch");
let searchValue = "";
let countPage = 1;
let currentPage = 1;
let prevBtn = document.querySelector("#prevBtn");
let nextBtn = document.querySelector("#nextBtn");

btnAdd.addEventListener("click", () => {
  if (!inpName.value.trim() || !inpImg.value.trim() || !inpPrice.value.trim()) {
    alert("Заполните все поля");
    return;
  }
  let newBook = {
    bookName: inpName.value,
    bookImg: inpImg.value,
    bookPrice: inpPrice.value,
  };
  createBook(newBook);
});

// ! ===================== CREATE ======================
function createBook(book) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(book),
  }).then((res) => readTask());
  inpName.value = "";
  inpImg.value = "";
  inpPrice.value = "";
}

// ! ===================== READ ======================
async function readBooks(test = currentPage) {
  const res = await fetch(
    `${API}?q=${searchValue}&_page=${currentPage}&_limit=3`
  );
  const data = await res.json();
  contt.innerHTML = "";
  data.forEach((elem) => {
    contt.innerHTML += `
    <div class="card">
    <img src="${elem.bookImg}" alt="" />
    <div class="card-body">
        <h5 class="card-title">${elem.bookName}</h5>
        <div>${elem.bookPrice}</div>
        <button class="btn btn-outline-danger btnDelete" id="${elem.id}">Удалить</button>
        <button data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-outline-warning btnEdit" id="${elem.id}">Редактировать</button>
    </div>
    </div>
    `;
    pageFunc();
  });
}
readBooks();

// ! ==================== DELETE =======================
document.addEventListener("click", (e) => {
  let del_id = e.target.id;
  let del_class = [...e.target.classList];
  if (del_class.includes("btnDelete")) {
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readBooks());
  }
});

// ! ==================== EDIT =======================
let inpEdit = document.querySelector(".inpEdit");
let inpEdit1 = document.querySelector(".inpEdit1");
let inpEdit2 = document.querySelector(".inpEdit2");
let btnEditSave = document.querySelector(".saveEdit");
let editModal = document.querySelector(".editModal");

document.addEventListener("click", (e) => {
  let edit_class = [...e.target.classList];
  if (edit_class.includes("btnEdit", "btnEdit1", "btnEdit2", "btnEdit3")) {
    editModal.style.display = "block";
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        inpEdit.value = data.bookImg;
        inpEdit1.value = data.bookName;
        inpEdit2.value = data.bookPrice;
        btnEditSave.setAttribute("id", data.id);
      });
  }
});

btnEditSave.addEventListener("click", () => {
  let editTask = {
    bookImg: inpEdit.value,
    bookName: inpEdit1.value,
    bookPrice: inpEdit2.value,
  };
  editedTask(editTask, btnEditSave.id);
  editModal.style.display = "none";
});

function editedTask(editTask, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editTask),
  }).then(() => readTask());
}

// ! ====================== SEARCH =======================
let test = currentPage;
inpSearch1.addEventListener("input", (e) => {
  searchValue = e.target.value.trim();
});
inpSearch1.addEventListener("input", () => {
  if (!searchValue) {
    readBooks(test);
    currentPage = 1;
    console.log(currentPage);
  } else {
    let test = currentPage;
    readBooks(test);
  }
});

// ! ==================== PAGINATION ====================
function pageFunc() {
  fetch(`${API}?q=${searchValue}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      countPage = Math.ceil(data.length / 3);
    });
}
prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  readBooks();
});
nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  readBooks();
});
