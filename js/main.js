const API = "http://localhost:8000/phones";
let inpName = document.querySelector("#inpName");
let inpAuthor = document.querySelector("#inpAuthor");
let inpImg = document.querySelector("#inpImg");
let inpPrice = document.querySelector("#inpPrice");
let btnAdd = document.querySelector("#btnAdd");
let sectionBooks = document.querySelector("#sectionBooks");
let btnOpenForm = document.querySelector("#collapseThree");
let inpSearch = document.querySelector("#inpSearch");
let searchValue = "";
let countPage = 1;
let currentPage = 1;
let prevBtn = document.querySelector("#prevBtn");
let nextBtn = document.querySelector("#nextBtn");
btnAdd.addEventListener("click", () => {
  if (
    !inpName.value.trim() ||
    !inpAuthor.value.trim() ||
    !inpImg.value.trim() ||
    !inpPrice.value.trim()
  ) {
    alert("Заполните все поля");
    return;
  }
  let newBook = {
    bookName: inpName.value,
    bookAuthor: inpAuthor.value,
    bookImg: inpImg.value,
    bookPrice: inpPrice.value,
  };
  createBook(newBook);
  readBooks();
});
//! ===================================CREATE=================================
function createBook(book) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(book),
  });
  btnOpenForm.classList.toggle("show");

  inpName.value = "";
  inpAuthor.value = "";
  inpImg.value = "";
  inpPrice.value = "";
}
//! ==============================READ=============================
async function readBooks() {
  const res = await fetch(
    `${API}?q=${searchValue}&_page=${currentPage}&_limit=3`
  );
  const data = await res.json();
  sectionBooks.innerHTML = "";
  data.forEach((elem) => {
    sectionBooks.innerHTML += `
    <div class="card m-4 cardBook" style="width: 15rem">
    <img style="height:280px" src="${elem.bookImg}" alt="${elem.bookName}" />
    <div class="card-body">
      <h5 class="card-title">${elem.bookName}</h5>
      <p class="card-text">${elem.bookAuthor}</p>
      <span>${elem.bookPrice}</span>
      <button class="btn btn-outline-danger btnDelete" id="${elem.id}">Удалить</button>
      <button data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-outline-warning btnEdit" id="${elem.id}">Редактировать</button>
    </div>
  </div>
    `;
  });
  pageFunc();
}
readBooks();
// ! ==========================DELETE===============================
document.addEventListener("click", (e) => {
  let del_id = e.target.id;
  let del_class = [...e.target.classList];
  if (del_class.includes("btnDelete")) {
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readBooks());
  }
});
// ! ==========================EDIT===============================
let editInpName = document.querySelector("#editInpName");
let editInpAuthor = document.querySelector("#editInpAuthor");
let editInpImg = document.querySelector("#editInpImg");
let editInpPrice = document.querySelector("#editInpPrice");
let editBtnSave = document.querySelector("#editBtnSave");
document.addEventListener("click", (e) => {
  let edit_class = [...e.target.classList];
  if (edit_class.includes("btnEdit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        editInpName.value = data.bookName;
        editInpAuthor.value = data.bookAuthor;
        editInpImg.value = data.bookImg;
        editInpPrice.value = data.bookPrice;
        editBtnSave.setAttribute("id", data.id);
      });
  }
});
editBtnSave.addEventListener("click", () => {
  let editedBook = {
    bookName: editInpName.value,
    bookAuthor: editInpAuthor.value,
    bookImg: editInpImg.value,
    bookPrice: editInpPrice.value,
  };
  editBook(editedBook, editBtnSave.id);
});

function editBook(editBook, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editBook),
  }).then(() => readBooks());
}
// ! ==========================SEARCH===============================
inpSearch.addEventListener("input", (e) => {
  searchValue = e.target.value.trim();
  readBooks();
  if (!currentPage == currentPage) {
    return;
  }
});
// ! ==========================PAGINATION===============================
function pageFunc() {
  fetch(`${API}?q=5${searchValue}`)
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
