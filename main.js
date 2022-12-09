const API = "http://localhost:8000/product";

let title = document.querySelector("#Title");
let prise = document.querySelector("#Prise");
let descr = document.querySelector(
  "#Description"
);
let image = document.querySelector("#Image");
let btnAdd = document.querySelector("#btn-add");

console.log(title);

let list = document.querySelector(
  "#products-list"
);

//? Search
let searchInp = document.querySelector("#search");
let searchVal = "";

//? Pagination
let currentPage = 1;
let pageTotalCount = 1;
let paginationList = document.querySelector(
  ".pagination-list"
);
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

let editTitle = document.querySelector(
  "#edit-Title"
);
let editPrise = document.querySelector(
  "#edit-Prise"
);
let editDescr = document.querySelector(
  "#edit-Description"
);
let editImage = document.querySelector(
  "#edit-Image"
);
let editBtnAdd = document.querySelector(
  "#btn-save-edit"
);
let examleModal = document.querySelector(
  "#exampleModal"
);

btnAdd.addEventListener(
  "click",
  async function () {
    let obj = {
      title: title.value,
      prise: prise.value,
      descr: descr.value,
      image: image.value,
    };
    if (
      !obj.title.trim() ||
      !obj.prise.trim() ||
      !obj.descr.trim() ||
      !obj.image.trim()
    ) {
      alert("Заполните поле");
      return;
    }
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json;chareset=utf-8",
      },
      body: JSON.stringify(obj),
    });
    title.value = "";
    prise.value = "";
    descr.value = "";
    image.value = "";
    render();
  }
);
render();
async function render() {
  let products = await fetch(
    `${API}?q=${searchVal}&_page=${currentPage}&_limit=3`
  )
    .then((res) => res.json())
    .catch((err) => console.log(err));
  drawPaginationButtons();
  list.innerHTML = "";
  products.forEach((element) => {
    let newElem = document.createElement("div");
    newElem.id = element.id;
    newElem.innerHTML = `
            <div class="card m-5" style="width: 18rem;">
                <img src="${element.image}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${element.title}</h5>
                    
                    <p class="card-text">${element.descr}</p>
                    <p class="card-text">${element.prise}</p>

                    <a href="#" class="btn btn-danger btn-delete" id =${element.id}>Удалить</a>
                    <a href="#" class="btn btn-primary btn-edit"  data-bs-toggle="modal" data-bs-target="#exampleModal" id=${element.id}>Изменить</a>
                </div>
            </div>`;
    list.append(newElem);
  });
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-edit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editTitle.value = data.title;
        editPrise.value = data.prise;
        editDescr.value = data.descr;
        editImage.value = data.image;
        editBtnAdd.setAttribute("id", data.id);
      });
  }
});

editBtnAdd.addEventListener("click", function () {
  let id = this.id;

  let title = editTitle.value;
  let prise = editPrise.value;
  let descr = editDescr.value;
  let image = editImage.value;

  if (!title || !descr || !prise || !image)
    return;

  let editedProduct = {
    title: title,
    descr: descr,
    prise: prise,
    image: image,
  };

  saveEdit(editedProduct, id);
});

function saveEdit(editedProduct, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type":
        "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedProduct),
  }).then(() => render());

  let modal =
    bootstrap.Modal.getInstance(examleModal);
  modal.hide();
}

//? delet function
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    let id = e.target.id;
    fetch(`${API}/${id}`, {
      method: "DELETE",
    }).then(() => render());
  }
});

//? Search
searchInp.addEventListener("input", () => {
  searchVal = searchInp.value;
  render();
});

//? pagination
function drawPaginationButtons() {
  fetch(`${API}?q=${searchVal}`)
    .then((res) => res.json())
    .then((data) => {
      pageTotalCount = Math.ceil(data.length / 3);

      paginationList.innerHTML = "";

      for (let i = 1; i <= pageTotalCount; i++) {
        if (currentPage == i) {
          let page1 =
            document.createElement("li");
          page1.innerHTML = `<li class="page-item active"><a class="page-link page_number" href="#">${i}</a></li>`;
          paginationList.append(page1);
        } else {
          let page1 =
            document.createElement("li");
          page1.innerHTML = `<li class="page-item"><a class="page-link page_number" href="#">${i}</a></li>`;
          paginationList.append(page1);
        }
      }

      if (currentPage == 1) {
        prev.classList.add("disabled");
      } else {
        prev.classList.remove("disabled");
      }

      if (currentPage == pageTotalCount) {
        next.classList.add("disabled");
      } else {
        next.classList.remove("disabled");
      }
    });
}

prev.addEventListener("click", () => {
  if (currentPage <= 1) {
    return;
  }
  currentPage--;
  render();
});

next.addEventListener("click", () => {
  if (currentPage >= pageTotalCount) {
    return;
  }
  currentPage++;
  render();
});

document.addEventListener("click", function (e) {
  if (
    e.target.classList.contains("page_number")
  ) {
    currentPage = e.target.innerText;
    render();
  }
});
