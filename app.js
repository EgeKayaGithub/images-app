const body = document.getElementsByTagName("body")[0];
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
const cleanButton = document.querySelector(".clean-button");
const imagesSection = document.querySelector(".images-section");
const grid = document.querySelector(".grid");
const loadingAnimation = document.querySelector(".loadingAnimation");

const API_KEY = "M-ukCfb0txQ8cQSuslN0t5GiNventxju2Ujtc5HX9GI";

searchInput.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    getImages();
  }
});
searchButton.addEventListener("click", getImages);
cleanButton.addEventListener("click", clean);

async function getImages() {
  let searchItem = searchInput.value
  if (searchInput.value == "") {
    alert("Please write anything to the input.");
    return;
  }
  clean();
  loadingAnimation.style.display = "flex";
  let url = `https://api.unsplash.com/search/photos?page=1&query=${searchItem}&client_id=${API_KEY}&per_page=30`;
  console.log(url);
  let data = await (await fetch(url)).json();
  console.log(data);

  grid.style.cssText = "";
  data.results.forEach((image) => {
    addImagesToUI(image.urls.small_s3,searchItem);
  });

  // Resimlerin yüklendiğini kontrol et
  imagesLoaded(grid, () => {
    loadingAnimation.style.display = "none";
    grid.style.display = "grid";
    const masonry = new Masonry(grid, {
      itemSelector: ".grid-item",
    });
  });
}

function reSizeApp() {
  body.style.width = "25%";
  body.style.width = "100%";
}

function addImagesToUI(url,searchItem) {
  grid.innerHTML += `
        <div class="grid-item">
        <div class="image">
         <img src="${url}" style="width:100%;"></img>
         <div class="buttons">
             <button class="downloadButton"onclick="downloadPhoto('${url}','${searchItem}')">Download</button>
         </div>
     </div></div>
     `;
}

function clean() {
  grid.innerHTML = "";
  searchInput.value = ""
}

async function downloadPhoto(firsturl,searchItem) {
  const url = "https://" + firsturl.slice("https://s3.us-west-2.amazonaws.com/".length)
  console.log(url)
  const response = await fetch(url);
  const blob = await response.blob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${searchItem}.png`; // Kaydedilecek dosya adı
  link.click();
}

// const previousUrl = `https://api.unsplash.com/photos/?client_id=${API_KEY}&query=`

// const response = await fetch(url);
// const blob = await response.blob();
// const link = document.createElement("a");
// link.href = URL.createObjectURL(blob);
// link.download = "unsplash-image.jpg";
// link.click();
// console.log(URL)
// URL.revokeObjectURL(link.href);
