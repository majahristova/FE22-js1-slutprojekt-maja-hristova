const containerForImages = document.querySelector('#imageContainer');
const gridImageContainer = document.querySelector('#gridContainerForLandingpage');
const backToFormButton = document.getElementById("onClickBtn"); 
const error = document.querySelector('#errorParagraf');
const searchImageButton = document.querySelector('#button');
searchImageButton.addEventListener('click', searchImages);

const loadingAnimation = {  
    targets: '#divForAnimation',
    translateX: '35vw',
    direction: 'alternate',
    loop: true,
    easing: 'steps(3)',
    duration: 1000,
    delay: 0,
    begin: function() {
        document.querySelector('#divForAnimation').style.display = 'block';
      },  
}

function searchImages(event) {
    event.preventDefault();

    const searchbox = document.querySelector('#search_input_box');
    const searchInputValue = searchbox.value;
    searchInputValue.value= '';

    const numberbox = document.querySelector('#number_input_box');
    const numberInputValue = numberbox.value;
    numberInputValue.value ='';
    
    const sortbox = document.querySelector('#chooseSort');
    const sortInputValue = sortbox.value;

    if(searchbox.value === ''||numberbox.value ==='') {
        alert('Please insert all information in the form');
    } else { 
        fetchImages(searchInputValue,sortInputValue,numberInputValue);
    }
}

function fetchImages(searchText ,sortOption, numberOfImages){
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=38d66c0067208e612c0c5abe54218289&text=${searchText}&sort=${sortOption}&per_page=${numberOfImages}&format=json&nojsoncallback=1`;
    gridImageContainer.remove();

    anime(loadingAnimation);
    fetch(url)
    .then(response => {
        if (response.status >= 200 && response.status < 300) {
            return response.json()
        } else {
            throw 'ERROR, Something went wrong'

        }
    })
    .then(showImages)
    .catch(showErrorMessage)
    .finally(() => {
        document.querySelector('#divForAnimation').style.display ='none'
    });
}

function showImages(apiData) {
    if(apiData.photos.photo.length === 0) {
        showErrorMessage("Could not find any images");
        containerForImages.innerHTML= '';
        return;
    }

    containerForImages.innerHTML= '';
    error.innerText = '';

    const sizebox = document.querySelector('#chooseSize');
    const chooseSizeValue = sizebox.value;

    for(let i = 0; i < apiData.photos.photo.length; i++) {
        const imageContainer = document.createElement('div');
        containerForImages.appendChild(imageContainer);

        const currentPhoto = apiData.photos.photo[i]
        const id =currentPhoto.id;
        const serverId =currentPhoto.server;
        const secretId =currentPhoto.secret;

        const showImagesUrl =` https://live.staticflickr.com/${serverId}/${id}_${secretId}_${chooseSizeValue}.jpg`;

        const displayImages = document.createElement('img');
        imageContainer.appendChild(displayImages);
        displayImages.src = showImagesUrl;
    }
}

function showErrorMessage(errorMessage) {
    error.innerText = errorMessage;
    containerForImages.innerHTML= '';
}


//Scroll back to form button 
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 2000 || document.documentElement.scrollTop > 2000) {
    backToFormButton.style.display = "block";
  } else {
    backToFormButton.style.display = "none";
  }
}
function scrollbacktoFormFunction() {
  document.body.scrollTop = 1000;
  document.documentElement.scrollTop = 1000;
} 