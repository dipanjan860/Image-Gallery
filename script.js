let stars = document.getElementById("stars");
let moon = document.getElementById("moon");
let mountains_behind = document.getElementById("mountains_behind");
let = document.getElementById("text");
let search_box = document.getElementById("search-box");
let mountains_front = document.getElementById("mountains_front");
let header = document.querySelector("header");

window.addEventListener("scroll", function () {
  let value = window.scrollY;
  stars.style.left = value * 0.25 + "px";
  moon.style.top = value * 1.02 + "px";
  mountains_behind.style.top = value * 0.5 + "px";
  text.style.marginRight = value * 4 + "px";
  text.style.marginTop = value * 1.5 + "px";
  search_box.style.marginTop = value * 1.5 + "px";
  mountains_front.style.top = value * 0 + "px";
  header.style.top = value * 0.5 + "px";
});

const imagesWrapper = document.querySelector(".images");
const loadMore = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");

const apiKey = "wQgNJLJPcMh7QFzMhLh6oPtGhUT5dRQx0uRnrSL4ehzufAB1dVGcQDHj";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
  // console.log(imgURL);
  fetch(imgURL)
    .then((res) => res.blob())
    .then((file) => {
      // console.log(file);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert("Failed to download images!"));
};

const generateHTML = (images) => {
  imagesWrapper.innerHTML += images
    .map(
      (img) =>
        `<li class="card">
          <img src="${img.src.large}" alt="img" />
          <div class="details">
            <div class="photographer">
              <i class="uil uil-camera"></i>
              <span>${img.photographer}</span>
            </div>
            <button onclick="downloadImg('${img.src.large}')">
              <i class="uil uil-import"></i>
            </button>
          </div>
        </li>`
    )
    .join("");
};

const getImages = (apiURL) => {
  loadMore.innerHTML = "Loading...";
  loadMore.classList.add("disabled");
  fetch(apiURL, {
    headers: { Authorization: apiKey },
  })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      generateHTML(data.photos);
      loadMore.innerHTML = "Load More";
      loadMore.classList.remove("disabled");
    })
    .catch(() => alert("Failed to load images!"));
};

const loadMoreImages = () => {
  currentPage++;
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  apiURL = searchTerm
    ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
    : apiURL;
  getImages(apiURL);
};

const searchImages = (e) => {
  if (e.target.value === "") {
    return (searchTerm = null);
  }
  if (e.key === "Enter") {
    // console.log(e);
    currentPage = 1;
    searchTerm = e.target.value;
    imagesWrapper.innerHTML = "";
    getImages(
      `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
    );
  }
};

getImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
);
loadMore.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", searchImages);
