const API = "http://localhost:8000/phones";
let inpBrand = document.querySelector("#inpBrand");
let inpModel = document.querySelector("#inpModel");
let inpImg = document.querySelector("#inpImg");
let inpPrice = document.querySelector("#inpPrice");
let btnAdd = document.querySelector("#btnAdd");
let sectionPhones = document.querySelector("#sectionPhones");
let btnOpenForm = document.querySelector("#collapseThree");
let inpSearch = document.querySelector("#inpSearch");
let searchValue = "";
let countPage = 1;
let currentPage = 1;
let prevBtn = document.querySelector("#prevBtn");
let nextBtn = document.querySelector("#nextBtn");
btnAdd.addEventListener("click", () => {
  if (
    !inpBrand.value.trim() ||
    !inpModel.value.trim() ||
    !inpImg.value.trim() ||
    !inpPrice.value.trim()
  ) {
    alert("Заполните все поля");
    return;
  }
  let newPhone = {
    phoneBrand: inpBrand.value,
    phoneModel: inpModel.value,
    phoneImg: inpImg.value,
    phonePrice: inpPrice.value,
  };
  createPhone(newPhone);
  readPhones();
});
//! ===================================CREATE=================================
function createPhone(phone) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(phone),
  });
  btnOpenForm.classList.toggle("show");

  inpBrand.value = "";
  inpModel.value = "";
  inpImg.value = "";
  inpPrice.value = "";
}
//! ==============================READ=============================
async function readPhones() {
  const res = await fetch(
    `${API}?q=${searchValue}&_page=${currentPage}&_limit=3`
  );
  const data = await res.json();
  sectionPhones.innerHTML = "";
  data.forEach((elem) => {
    sectionPhones.innerHTML += `
    <div class="card m-4 cardPhone" style="width: 15rem">
        <img style="height:280px" src="${elem.phoneImg}" alt="${elem.phoneBrand}" />
        <div class="card-body">
            <h5 class="card-title">${elem.phoneBrand}</h5>
            <p class="card-text">${elem.phoneModel}</p>
            <span>${elem.phonePrice}</span>
            <button class="btn btn-outline-danger btnDelete" id="${elem.id}">Удалить</button>
            <button data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-outline-warning btnEdit" id="${elem.id}">Редактировать</button>
        </div>
    </div>
    `;
  });
  pageFunc();
}
readPhones();
// ! ==========================DELETE===============================
document.addEventListener("click", (e) => {
  let del_id = e.target.id;
  let del_class = [...e.target.classList];
  if (del_class.includes("btnDelete")) {
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readPhones());
  }
});
// ! ==========================EDIT===============================
let editInpBrand = document.querySelector("#editInpBrand");
let editInpModel = document.querySelector("#editInpModel");
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
        editInpBrand.value = data.phoneBrand;
        editInpModel.value = data.phoneModel;
        editInpImg.value = data.phoneImg;
        editInpPrice.value = data.phonePrice;
        editBtnSave.setAttribute("id", data.id);
      });
  }
});
editBtnSave.addEventListener("click", () => {
  let editedPhone = {
    phoneBrand: editInpBrand.value,
    phoneModel: editInpModel.value,
    phoneImg: editInpImg.value,
    phonePrice: editInpPrice.value,
  };
  editPhone(editedPhone, editBtnSave.id);
});

function editPhone(editPhone, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editPhone),
  }).then(() => readPhones());
}
// ! ==========================SEARCH===============================
inpSearch.addEventListener("input", (e) => {
  searchValue = e.target.value.trim();
  readPhones();
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
  readPhones();
});
nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  readPhones();
});
/* Регистрация */
document.addEventListener("DOMContentLoaded", () => {
  const registerUserButton = document.getElementById("registerUser");
  const registrationContainer = document.getElementById(
    "registrationContainer"
  );
  const registrationModal = new bootstrap.Modal(
    document.getElementById("registrationModal")
  );

  registerUserButton.addEventListener("click", () => {
    const name = document.getElementById("registrationName").value;
    const dob = document.getElementById("registrationDOB").value;
    const email = document.getElementById("registrationEmail").value;

    const newUser = {
      name,
      dob,
      email,
    };

    // Отправляем данные на сервер
    fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => {
        // Обработка успешного ответа от сервера
        console.log("Пользователь зарегистрирован:", data);

        // Закрыть модальное окно после успешной регистрации
        registrationModal.hide();

        // Отобразить имя пользователя
        showUserName(data.name);
      })
      .catch((error) => {
        // Обработка ошибок при отправке данных на сервер
        console.error("Ошибка регистрации:", error);
      });
  });

  // Обработка события hidden.bs.modal для закрытия окна
  registrationModal._element.addEventListener("hidden.bs.modal", () => {
    // Сбросить содержимое registrationContainer при закрытии окна
    registrationContainer.innerHTML = "";
  });

  // Функция для отображения имени пользователя
  function showUserName(userName) {
    registrationContainer.innerHTML = `<p>Привет, ${userName}!</p>`;
  }
});
