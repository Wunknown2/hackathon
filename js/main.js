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
    const password = document.getElementById("registrationPassword").value;

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
      .then((userData) => {
        // Обработка успешного ответа от сервера
        console.log("Пользователь зарегистрирован:", userData);

        // Создать учетную запись (login) в массиве login
        const userLogin = {
          email: userData.email,
          password, // Здесь используется введенный пользователем пароль
          userId: userData.id,
        };
        document
          .getElementById("registrationForm")
          .addEventListener("keyup", function (event) {
            if (event.key === "Enter") {
              event.preventDefault();
              document.getElementById("registerUser").click();
            }
          });

        // Отправляем данные на сервер для добавления учетной записи
        fetch("http://localhost:8000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userLogin),
        })
          .then((loginResponse) => loginResponse.json())
          .then((loginData) => {
            console.log("Учетная запись создана:", loginData);
          })
          .catch((loginError) => {
            console.error("Ошибка создания учетной записи:", loginError);
          });

        // Закрыть модальное окно после успешной регистрации
        registrationModal.hide();

        // Отобразить имя пользователя
        showUserName(userData.name);
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
/* Регистрация Финиш */

/* Вход старт */
// Обработка входа пользователя
document.addEventListener("DOMContentLoaded", () => {
  // Ваш код для обработки входа пользователя
  // ...

  const loginUserButton = document.getElementById("loginUser");
  const loginContainer = document.getElementById("loginContainer");
  const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));

  loginUserButton.addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const userCredentials = {
      email,
      password,
    };

    // Отправляем данные на сервер для аутентификации
    fetch("http://localhost:8000/login", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCredentials),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Authentication failed");
        }
        return response.json();
      })
      .then((data) => {
        // Обработка успешной аутентификации
        console.log("Вход выполнен успешно:", data);

        // Сохранить информацию о пользователе (например, в localStorage)
        localStorage.setItem("currentUser", JSON.stringify(data));

        // Закрыть модальное окно после успешного входа
        loginModal.hide();

        // Отобразить имя пользователя
        showUserName(data.name);
      })
      .catch((error) => {
        // Обработка ошибок при отправке данных на сервер или неверных учетных данных
        console.error("Ошибка входа:", error);

        // Вывести сообщение об ошибке (например, "Неверные учетные данные")
        alert("Неверные учетные данные");
      });
  });

  // Обработка события hidden.bs.modal для закрытия окна
  loginModal._element.addEventListener("hidden.bs.modal", () => {
    // Сбросить содержимое loginContainer при закрытии окна
    loginContainer.innerHTML = "";
  });

  // Функция для отображения имени пользователя
  function showUserName(userName) {
    loginContainer.innerHTML = `<p>Привет, ${userName}!</p>`;
  }
});
/* Вход финиш */

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
