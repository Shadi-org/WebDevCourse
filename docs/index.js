// -------------------------------------------------
// --Get HTML DOM Element References
const form = document.getElementById("songForm");
const list = document.getElementById("songList");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const searchInput = document.getElementById("search");
const sortRadios = document.querySelectorAll("input[name='sortOption']");
const toggleViewBtn = document.getElementById("toggleViewBtn");
const songTableView = document.getElementById("songTableView");
const songCardsView = document.getElementById("songCardsView");
const playerModal = new bootstrap.Modal(document.getElementById("playerModal"));
const playerFrame = document.getElementById("playerFrame");

// --Initialize Songs Array from localStorage or Empty Array
let songs = JSON.parse(localStorage.getItem("songs")) || [];
let editingId = null;
let isTableView = true;
let currentSort = "newest";
let currentSearch = "";

// Initialize on page load
renderSongs();

// --User Click the Add Button
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const url = document.getElementById("url").value;
  const rating = parseInt(document.getElementById("rating").value);

  if (editingId) {
    // Update existing song
    const songIndex = songs.findIndex((s) => s.id === editingId);
    if (songIndex !== -1) {
      songs[songIndex] = {
        ...songs[songIndex],
        title: title,
        url: url,
        rating: rating,
      };
      editingId = null;
    }
  } else {
    // Create new song
    const song = {
      id: Date.now(),
      title: title,
      url: url,
      rating: rating,
      dateAdded: Date.now(),
      videoId: extractVideoId(url),
    };
    songs.push(song);
  }

  saveAndRender();
  form.reset();
  cancelBtn.classList.add("d-none");
  submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
});

// Cancel editing
cancelBtn.addEventListener("click", () => {
  editingId = null;
  form.reset();
  cancelBtn.classList.add("d-none");
  submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
});

// Search functionality
searchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value.toLowerCase();
  renderSongs();
});

// Sort functionality
sortRadios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderSongs();
  });
});

// Toggle view
toggleViewBtn.addEventListener("click", () => {
  isTableView = !isTableView;
  songTableView.classList.toggle("d-none");
  songCardsView.classList.toggle("d-none");
  toggleViewBtn.innerHTML = isTableView
    ? '<i class="fas fa-th"></i>'
    : '<i class="fas fa-list"></i>';
  renderSongs();
});

// -------------------------------------------------

function saveAndRender() {
  localStorage.setItem("songs", JSON.stringify(songs));
  renderSongs();
}

// Extract YouTube Video ID from URL
function extractVideoId(url) {
  let videoId = "";
  const shortUrlRegex = /youtu.be\/([^\?&"'<>.^\[\]{}\s]*)/;
  const longUrlRegex = /youtube.com.*[?&]v=([^\?&"'<>.^\[\]{}\s]*)/;

  const shortMatch = url.match(shortUrlRegex);
  const longMatch = url.match(longUrlRegex);

  if (shortMatch && shortMatch[1]) {
    videoId = shortMatch[1];
  } else if (longMatch && longMatch[1]) {
    videoId = longMatch[1];
  }

  return videoId;
}

// Get thumbnail URL from video ID
function getThumbnailUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// Filter and sort songs
function getFilteredAndSortedSongs() {
  let filtered = songs.filter((song) =>
    song.title.toLowerCase().includes(currentSearch)
  );

  filtered.sort((a, b) => {
    if (currentSort === "newest") {
      return b.dateAdded - a.dateAdded;
    } else if (currentSort === "az") {
      return a.title.localeCompare(b.title);
    } else if (currentSort === "rating") {
      return b.rating - a.rating;
    }
    return 0;
  });

  return filtered;
}

// --------------------------------------------------
function renderSongs() {
  const filteredSongs = getFilteredAndSortedSongs();

  if (isTableView) {
    renderTableView(filteredSongs);
  } else {
    renderCardsView(filteredSongs);
  }
}

function renderTableView(filteredSongs) {
  list.innerHTML = "";

  filteredSongs.forEach((song) => {
    const row = document.createElement("tr");

    const thumbnail = song.videoId
      ? `<img src="${getThumbnailUrl(song.videoId)}" alt="thumbnail" style="width: 100px; height: 60px; object-fit: cover;" />`
      : '<span class="text-muted">No thumbnail</span>';

    row.innerHTML = `
      <td>${thumbnail}</td>
      <td>${song.title}</td>
      <td><a href="${song.url}" target="_blank" class="text-info">Watch</a></td>
      <td>⭐ ${song.rating}/10</td>
      <td class="text-end">
        <button class="btn btn-sm btn-primary me-2" onclick="playSong(${song.id})" title="Play">
          <i class="fas fa-play"></i>
        </button>
        <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    list.appendChild(row);
  });
}

function renderCardsView(filteredSongs) {
  songCardsView.innerHTML = "";

  filteredSongs.forEach((song) => {
    const thumbnail = song.videoId
      ? getThumbnailUrl(song.videoId)
      : "https://via.placeholder.com/320x180?text=No+Thumbnail";

    const card = document.createElement("div");
    card.className = "col-md-4 col-sm-6";
    card.innerHTML = `
      <div class="card h-100 border-primary">
        <img src="${thumbnail}" class="card-img-top" alt="${song.title}" style="height: 180px; object-fit: cover; cursor: pointer;" onclick="playSong(${song.id})">
        <div class="card-body">
          <h5 class="card-title">${song.title}</h5>
          <p class="card-text">⭐ Rating: ${song.rating}/10</p>
          <div class="d-grid gap-2">
            <a href="${song.url}" target="_blank" class="btn btn-info btn-sm">
              <i class="fas fa-link"></i> Watch on YouTube
            </a>
            <button class="btn btn-primary btn-sm" onclick="playSong(${song.id})">
              <i class="fas fa-play"></i> Play
            </button>
            <button class="btn btn-warning btn-sm" onclick="editSong(${song.id})">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteSong(${song.id})">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    `;
    songCardsView.appendChild(card);
  });
}

// --------------------------------------------------

function editSong(id) {
  const song = songs.find((s) => s.id === id);
  if (song) {
    document.getElementById("title").value = song.title;
    document.getElementById("url").value = song.url;
    document.getElementById("rating").value = song.rating;
    editingId = id;
    cancelBtn.classList.remove("d-none");
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update';
    form.scrollIntoView({ behavior: "smooth" });
  }
}

function deleteSong(id) {
  if (confirm("Are you sure?")) {
    songs = songs.filter((song) => song.id !== id);
    saveAndRender();
  }
}

function playSong(id) {
  const song = songs.find((s) => s.id === id);
  if (song && song.videoId) {
    const embedUrl = `https://www.youtube.com/embed/${song.videoId}`;
    playerFrame.src = embedUrl;
    document.getElementById("playerModalLabel").textContent = song.title;
    playerModal.show();
  }
}

// --------------------------------------------------