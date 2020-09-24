
const lyricsForm = document.querySelector('form');
const listWrapper = document.querySelector(".listWrapper");
const mainWrapper = document.querySelector(".main-wrapper");
const listing = document.querySelector(".listWrapper .row");
const lyricsPageWrapper = document.querySelector(".lyrics-page-wrapper");
const searchResult = {};
// lyricsForm.addEventListener('mouseup', () => {
//   document.querySelector(".main-heading").style.display="none";
// })
lyricsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector(".main-heading").style.display="none";
  listWrapper.classList.remove("d-none");
  listWrapper.classList.add("d-block");
  mainWrapper.classList.remove("page-center");
  const lyrics = document.getElementById("lyricsSearch").value;
  let queryString = `suggest/${lyrics}`;
  fetchSongs(queryString);
});

function updateUI(result) {
  for(let i=0 ; i< result.data.length; i++) {
    let html= `<div class="col-md-4 my-3 px-2">
                <div class="card"">
                  <div class="card-body">
                    <h5 class="card-title">${result.data[i].title}</h5>
                    <p class="card-text d-inline-block"><span>Artist :</span> ${result.data[i].artist.name}</p>
                    <btn class="btn d-inline-block btn-show-lyrics btn-custom">Show Lyrics</btn>
                  </div>
                </div>
              </div>`;
    listing.innerHTML += html;
  }
  //Apply event on each songs card
  const showLyricsBtn = document.querySelectorAll(".btn-show-lyrics");
  for(let i=0; i<showLyricsBtn.length; i++) {
    showLyricsBtn[i].addEventListener('click', (e)=> {
      let title = e.currentTarget.parentNode.firstElementChild.innerText;
      let artist = e.currentTarget.parentNode.childNodes[3].childNodes[1].textContent;
      let queryString = `v1/${artist}/${title}`;
      fetchSongsLyrics(queryString, title, artist);
    });
  }
}

function fetchSongs(url) {
  fetch(`https://api.lyrics.ovh/${url}`).then((response) => {
    console.log('resolved',response);
    return response.json(); 
  }).then(data => {
    console.log(data);
    return data;
  }).then(songsResult => {
    updateUI(songsResult);
  });
}

function fetchSongsLyrics(url, songTitle, songArtist) {
  fetch(`https://api.lyrics.ovh/${url}`).then((response) => {
    console.log('resolved',response);
    return response.json(); 
  }).then(data => {
    console.log(data);
    return data;
  }).then(lyricsResult => {
    lyricsForm.parentNode.classList.add("d-none");
    listWrapper.classList.add("d-none");
    lyricsPageWrapper.classList.remove("d-none");
    if(lyricsResult.lyrics !== "") {
      lyricsPageWrapper.childNodes[1].innerText = songTitle
      lyricsPageWrapper.childNodes[3].innerText = lyricsResult.lyrics;
      lyricsPageWrapper.childNodes[4].innerText = songArtist;
    } else {
      lyricsPageWrapper.childNodes[1].innerText = "Not Found"
    }
  });
}