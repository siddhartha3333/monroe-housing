document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    const tabButtons = document.querySelectorAll('.tab-btn');
    if (tabButtons.length) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    const inquiryBtn = document.getElementById('inquiryBtn');
    const inquiryModal = document.getElementById('inquiryModal');
    const inquiryForm = document.getElementById('inquiryForm');
    const inquirySuccess = document.getElementById('inquirySuccess');
    const closeModal = document.querySelector('.close-modal');
    const closeSuccess = document.getElementById('closeSuccess');

    if (inquiryBtn && inquiryModal) {
        inquiryBtn.addEventListener('click', () => {
            inquiryModal.style.display = 'block';
        });
    }
    if (closeModal && inquiryModal) {
        closeModal.addEventListener('click', () => {
            inquiryModal.style.display = 'none';
        });
    }
    if (inquiryForm && inquirySuccess) {
        inquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            inquiryForm.style.display = 'none';
            inquirySuccess.style.display = 'block';
        });
    }
    if (closeSuccess && inquiryModal) {
        closeSuccess.addEventListener('click', () => {
            inquiryModal.style.display = 'none';
            setTimeout(() => {
                inquiryForm.style.display = 'block';
                inquirySuccess.style.display = 'none';
                inquiryForm.reset();
            }, 300);
        });
    }

    const searchInput = document.getElementById('searchInput');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const listingGrid = document.getElementById('listingGrid');
    const listingCount = document.getElementById('listingCount');

    function filterAndSearch() {
        const typeValue = document.getElementById('housingType').value;
        const priceValue = document.getElementById('priceRange').value;
        const locationValue = document.getElementById('location').value;
        const searchTerm = searchInput.value.trim().toLowerCase();

        let visibleCount = 0;
        listingGrid.querySelectorAll('.listing-card').forEach(card => {
            const typeAttr = card.getAttribute('data-type');
            const priceAttr = card.getAttribute('data-price');
            const locationAttr = card.getAttribute('data-location');

            const typeMatch = (typeValue === 'all' || typeAttr === typeValue);
            const locationMatch = (locationValue === 'all' || locationAttr === locationValue);

            let priceMatch = false;
            if (priceValue === 'all') {
                priceMatch = true;
            } else {
                const [min, max] = priceValue.split('-').map(Number);
                const [low, high] = priceAttr.split('-').map(Number);
                priceMatch = (low <= max && high >= min);
            }

            const title = (card.querySelector('h3')?.innerText || '').toLowerCase();
            const loc = (card.querySelector('.location')?.innerText || '').toLowerCase();
            const desc = (card.querySelector('.listing-description')?.innerText || '').toLowerCase();
            const searchMatch = !searchTerm || title.includes(searchTerm) || loc.includes(searchTerm) || desc.includes(searchTerm);

            if (typeMatch && locationMatch && priceMatch && searchMatch) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        listingCount.innerText = visibleCount;
    }

    applyFiltersBtn?.addEventListener('click', filterAndSearch);
    searchInput?.addEventListener('keyup', e => {
        if (e.key === 'Enter') filterAndSearch();
    });

    if (listingGrid && searchInput) {
        const urlParams = new URLSearchParams(window.location.search);
        const initialSearch = urlParams.get('search');
        if (initialSearch) {
            searchInput.value = initialSearch;
            filterAndSearch();
        }
    }

    const homeSearchInput = document.querySelector('.search-box input[type="text"]');
    const homeSearchBtn = document.querySelector('.search-box button');
    if (homeSearchBtn && homeSearchInput) {
        homeSearchBtn.addEventListener('click', () => {
            const q = homeSearchInput.value.trim();
            if (q) {
                window.location.href = `listings.html?search=${encodeURIComponent(q)}`;
            } else {
                window.location.href = 'listings.html';
            }
        });
        homeSearchInput.addEventListener('keyup', e => {
            if (e.key === 'Enter') homeSearchBtn.click();
        });
    }

    const form = document.getElementById('contactForm');
    const statusMsg = document.getElementById('contactStatus');
    const ENDPOINT = 'https://script.google.com/macros/s/AKfycbxdBgCha8TbJORctdIMbMJRoiRs5A5q2_Wa_VD-EFB8L1MlhaepvDMZ1EIPMyexnNfG_A/exec';

    if (form && statusMsg) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const data = new URLSearchParams(new FormData(form));
            fetch(ENDPOINT, {
                method: 'POST',
                mode: 'no-cors',
                body: data
            })
            .then(() => {
                statusMsg.innerText = 'Thanks! Your message has been sent.';
                form.reset();
            })
            .catch(err => {
                console.error(err);
                statusMsg.innerText = 'Oops — something went wrong.';
            });
        });
    }
});

