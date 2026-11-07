// Pet Data Array (Used dynamically across pages)
const petsData = [
  { id: 1, name: 'Bella', type: 'dog', age: 'young', breed: 'Labrador', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80', description: 'Friendly and energetic pup looking for an active family.' },
  { id: 2, name: 'Milo', type: 'cat', age: 'baby', breed: 'Tabby', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80', description: 'Playful kitten who loves cuddles and string toys.' },
  { id: 3, name: 'Charlie', type: 'dog', age: 'adult', breed: 'Beagle', image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=400&q=80', description: 'Calm and affectionate companion for lazy afternoons.' },
  { id: 4, name: 'Luna', type: 'cat', age: 'adult', breed: 'Siamese', image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=400&q=80', description: 'Quiet cat that loves sunny window spots.' },
  { id: 5, name: 'Coco', type: 'other', age: 'young', breed: 'Rabbit', image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=400&q=80', description: 'Gentle house rabbit that loves fresh greens.' }
];

// Helper to manage LocalStorage Favorites
function getFavorites() {
  return JSON.parse(localStorage.getItem('favPets')) || [];
}

function toggleFavorite(id) {
  let favs = getFavorites();
  if (favs.includes(id)) {
    favs = favs.filter(favId => favId !== id);
  } else {
    favs.push(id);
  }
  localStorage.setItem('favPets', JSON.stringify(favs));
}

// Render Pet Cards
function renderPets(petsToRender) {
  const container = document.getElementById('pet-grid-container');
  if (!container) return;

  const favs = getFavorites();
  container.innerHTML = petsToRender.map(pet => `
    <div class="pet-card">
      <button class="fav-btn ${favs.includes(pet.id) ? 'active' : ''}" onclick="handleFavClick(${pet.id})">♥</button>
      <img src="${pet.image}" alt="${pet.name}">
      <div class="pet-card-body">
        <h3>${pet.name}</h3>
        <p><strong>Breed:</strong> ${pet.breed}</p>
        <p><strong>Age:</strong> ${pet.age}</p>
        <br>
        <a href="pet-profile.html?id=${pet.id}" class="btn">View Profile</a>
      </div>
    </div>
  `).join('');
}

function handleFavClick(id) {
  toggleFavorite(id);
  if (document.getElementById('pet-grid-container')) {
    applyFilters();
  }
}

// Filtering Functionality
function applyFilters() {
  const typeFilter = document.getElementById('type-filter')?.value || 'all';
  const ageFilter = document.getElementById('age-filter')?.value || 'all';
  const showFavsOnly = document.getElementById('fav-filter')?.checked || false;
  const favs = getFavorites();

  let filtered = petsData.filter(pet => {
    const matchType = typeFilter === 'all' || pet.type === typeFilter;
    const matchAge = ageFilter === 'all' || pet.age === ageFilter;
    const matchFav = !showFavsOnly || favs.includes(pet.id);
    return matchType && matchAge && matchFav;
  });

  renderPets(filtered);
}

// Multi-Step Form Logic
let currentStep = 1;

function showStep(step) {
  document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
  const targetStep = document.getElementById(`step-${step}`);
  if (targetStep) targetStep.classList.add('active');
}

function nextStep() {
  if (currentStep < 3) {
    currentStep++;
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}

// Success Stories Slider
let currentSlide = 0;

function showSlide(index) {
  const slides = document.querySelectorAll('.slide');
  if (slides.length === 0) return;
  
  if (index >= slides.length) currentSlide = 0;
  else if (index < 0) currentSlide = slides.length - 1;
  else currentSlide = index;

  slides.forEach((slide, idx) => {
    slide.classList.toggle('active', idx === currentSlide);
  });
}

function moveSlide(direction) {
  showSlide(currentSlide + direction);
}

// Page Specific Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Adopt Page Init
  if (document.getElementById('pet-grid-container')) {
    renderPets(petsData);
    document.getElementById('type-filter')?.addEventListener('change', applyFilters);
    document.getElementById('age-filter')?.addEventListener('change', applyFilters);
    document.getElementById('fav-filter')?.addEventListener('change', applyFilters);
  }

  // Pet Profile Page Init
  if (document.getElementById('pet-profile-details')) {
    const urlParams = new URLSearchParams(window.location.search);
    const petId = parseInt(urlParams.get('id')) || 1;
    const pet = petsData.find(p => p.id === petId);

    if (pet) {
      document.getElementById('pet-profile-details').innerHTML = `
        <div style="display: flex; gap: 2rem; flex-wrap: wrap; background: #fff; padding: 2rem; border-radius: 8px;">
          <img src="${pet.image}" alt="${pet.name}" style="max-width: 400px; width: 100%; border-radius: 8px; object-fit: cover;">
          <div>
            <h1>Meet ${pet.name}</h1>
            <p style="margin: 1rem 0;"><strong>Type:</strong> ${pet.type}</p>
            <p style="margin-bottom: 1rem;"><strong>Breed:</strong> ${pet.breed}</p>
            <p style="margin-bottom: 1rem;"><strong>Age Group:</strong> ${pet.age}</p>
            <p style="margin-bottom: 1.5rem;">${pet.description}</p>
            <a href="adoption-form.html" class="btn">Start Adoption Process</a>
          </div>
        </div>
      `;
    }
  }

  // Adoption Form Submission
  const form = document.getElementById('adoption-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your adoption application has been submitted successfully.');
      window.location.href = 'index.html';
    });
  }

  // Slider Auto Play
  if (document.querySelector('.slider-container')) {
    showSlide(0);
  }
});