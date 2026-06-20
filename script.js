// ==========================================
// CONFIGURATION & INITIALIZATION
// ==========================================
const WEDDING_DATE = new Date("August 22, 2026 14:30:00").getTime();
const RSVP_STORAGE_KEY = "wedding_rsvp_list";

document.addEventListener("DOMContentLoaded", () => {
    initCountdown();
    initMobileMenu();
    initScrollSpy();
    initRSVP();
    initGallery();
    initAdmin();
    initContact();
    initScheduleCalendars();
    initHeroSlideshow();
});

// ==========================================
// COUNTDOWN TIMER
// ==========================================
function initCountdown() {
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    function updateCountdown() {
        const now = new Date().getTime();
        const diff = WEDDING_DATE - now;

        if (diff <= 0) {
            daysEl.innerText = "00";
            hoursEl.innerText = "00";
            minutesEl.innerText = "00";
            secondsEl.innerText = "00";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.innerText = String(days).padStart(2, "0");
        hoursEl.innerText = String(hours).padStart(2, "0");
        minutesEl.innerText = String(minutes).padStart(2, "0");
        secondsEl.innerText = String(seconds).padStart(2, "0");
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================
function initMobileMenu() {
    const toggleBtn = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    const links = document.querySelectorAll(".nav-link");

    toggleBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        toggleBtn.classList.toggle("open");
    });

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            toggleBtn.classList.remove("open");
        });
    });
}

// ==========================================
// SCROLL SPY (ACTIVE NAVIGATION INDICATOR)
// ==========================================
function initScrollSpy() {
    const sections = document.querySelectorAll("section, header");
    const navLinks = document.querySelectorAll(".nav-link");
    const navbar = document.getElementById("navbar");

    window.addEventListener("scroll", () => {
        // Navbar scrolled state (adds class for background transitions)
        if (window.scrollY > 80) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        // Detect current section in view
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });
}

// ==========================================
// RSVP FORM LOGIC
// ==========================================
function initRSVP() {
    const form = document.getElementById("rsvp-form");
    const successBox = document.getElementById("rsvp-success");
    const guestsGroup = document.getElementById("guests-group");
    const attendingRadios = document.querySelectorAll('input[name="attending"]');

    // Toggle guests select depending on attendance radio
    attendingRadios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            if (e.target.value === "no") {
                guestsGroup.style.display = "none";
            } else {
                guestsGroup.style.display = "block";
            }
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("rsvp-name").value.trim();
        const attending = document.querySelector('input[name="attending"]:checked').value;
        const guests = attending === "yes" ? document.getElementById("rsvp-guests").value : "0";
        const message = document.getElementById("rsvp-message").value.trim();

        const newRSVP = { name, attending, guests, message, date: new Date().toLocaleString() };

        // Save to localStorage
        let currentRSVPs = JSON.parse(localStorage.getItem(RSVP_STORAGE_KEY)) || [];
        currentRSVPs.push(newRSVP);
        localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(currentRSVPs));

        // Animation transition to success state
        form.style.display = "none";
        successBox.style.display = "block";
    });
}

function resetRSVPForm() {
    const form = document.getElementById("rsvp-form");
    const successBox = document.getElementById("rsvp-success");
    const guestsGroup = document.getElementById("guests-group");
    
    form.reset();
    guestsGroup.style.display = "block";
    successBox.style.display = "none";
    form.style.display = "block";
}

// ==========================================
// LIGHTBOX GALLERY
// ==========================================
let currentImgIndex = 0;
let galleryImages = [];

function initGallery() {
    const galleryItems = document.querySelectorAll(".gallery-item");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.getElementById("lightbox-close");
    const prevBtn = document.getElementById("lightbox-prev");
    const nextBtn = document.getElementById("lightbox-next");

    // Map images
    galleryItems.forEach((item, index) => {
        const img = item.querySelector("img");
        galleryImages.push(img.src);

        item.addEventListener("click", () => {
            currentImgIndex = index;
            openLightbox(img.src);
        });
    });

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.style.display = "flex";
        setTimeout(() => {
            lightbox.classList.add("active");
        }, 10);
        document.body.style.overflow = "hidden"; // disable scroll
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
        setTimeout(() => {
            lightbox.style.display = "none";
        }, 300);
        document.body.style.overflow = "auto";
    }

    function showNext() {
        currentImgIndex = (currentImgIndex + 1) % galleryImages.length;
        lightboxImg.src = galleryImages[currentImgIndex];
    }

    function showPrev() {
        currentImgIndex = (currentImgIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentImgIndex];
    }

    closeBtn.addEventListener("click", closeLightbox);
    nextBtn.addEventListener("click", showNext);
    prevBtn.addEventListener("click", showPrev);

    // Close lightbox on click outside the image
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox || e.target.classList.contains("lightbox-content")) {
            closeLightbox();
        }
    });

    // Keyboard support
    document.addEventListener("keydown", (e) => {
        if (lightbox.style.display === "flex") {
            if (e.key === "ArrowRight") showNext();
            if (e.key === "ArrowLeft") showPrev();
            if (e.key === "Escape") closeLightbox();
        }
    });
}

// ==========================================
// ADMIN PORTAL (ESPACE MARIÉS)
// ==========================================
function initAdmin() {
    const adminTrigger = document.getElementById("admin-trigger");
    const adminModal = document.getElementById("admin-modal");
    const closeBtn = document.getElementById("admin-close");
    const tableBody = document.getElementById("admin-table-body");
    const clearBtn = document.getElementById("admin-clear");
    const exportBtn = document.getElementById("admin-export");
    
    // Search and filter controls
    const searchInput = document.getElementById("admin-search");
    const filterTabs = document.querySelectorAll(".filter-tab");
    
    // Stats cards
    const statTotal = document.getElementById("admin-stat-total");
    const statConfirmed = document.getElementById("admin-stat-confirmed");
    const statPeople = document.getElementById("admin-stat-people");
    const statAbsent = document.getElementById("admin-stat-absent");

    let currentFilter = "all";
    let searchQuery = "";

    adminTrigger.addEventListener("click", () => {
        // Request simple wedding password
        const password = prompt("Entrez le mot de passe de l'Espace Mariés :");
        if (password === "220826") {
            // Reset filters/search upon login
            currentFilter = "all";
            searchQuery = "";
            searchInput.value = "";
            filterTabs.forEach(t => t.classList.remove("active"));
            document.querySelector('.filter-tab[data-filter="all"]').classList.add("active");
            
            renderAdminTable();
            adminModal.style.display = "flex";
            document.body.style.overflow = "hidden";
        } else if (password !== null) {
            alert("Mot de passe incorrect.");
        }
    });

    function closeAdmin() {
        adminModal.style.display = "none";
        document.body.style.overflow = "auto";
    }

    closeBtn.addEventListener("click", closeAdmin);
    
    // Close modal on click outside
    adminModal.addEventListener("click", (e) => {
        if (e.target === adminModal) {
            closeAdmin();
        }
    });

    // Handle search input
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderAdminTable();
    });

    // Handle filter tabs
    filterTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            filterTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentFilter = tab.getAttribute("data-filter");
            renderAdminTable();
        });
    });

    function renderAdminTable() {
        const rsvps = JSON.parse(localStorage.getItem(RSVP_STORAGE_KEY)) || [];
        
        // 1. Calculate & Display statistics (always based on full list)
        const totalCount = rsvps.length;
        const confirmedCount = rsvps.filter(r => r.attending === "yes").length;
        const absentCount = rsvps.filter(r => r.attending === "no").length;
        
        // Total people coming = main confirmed guests + their additional guests
        const totalPeopleCount = rsvps
            .filter(r => r.attending === "yes")
            .reduce((sum, r) => {
                const guestsNum = parseInt(r.guests, 10);
                return sum + 1 + (isNaN(guestsNum) ? 0 : guestsNum);
            }, 0);

        statTotal.innerText = totalCount;
        statConfirmed.innerText = confirmedCount;
        statPeople.innerText = totalPeopleCount;
        statAbsent.innerText = absentCount;

        // 2. Filter list
        let filteredRsvps = rsvps;
        
        // Filter by attendance status
        if (currentFilter === "yes") {
            filteredRsvps = filteredRsvps.filter(r => r.attending === "yes");
        } else if (currentFilter === "no") {
            filteredRsvps = filteredRsvps.filter(r => r.attending === "no");
        }

        // Filter by search query
        if (searchQuery) {
            filteredRsvps = filteredRsvps.filter(r => 
                (r.name && r.name.toLowerCase().includes(searchQuery))
            );
        }

        tableBody.innerHTML = "";

        if (filteredRsvps.length === 0) {
            const noDataMessage = rsvps.length === 0 
                ? "Aucune réponse enregistrée pour le moment." 
                : "Aucune réponse ne correspond à vos critères de recherche.";
            
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--charcoal-light); padding: 2rem;">${noDataMessage}</td></tr>`;
            return;
        }

        filteredRsvps.forEach(rsvp => {
            const tr = document.createElement("tr");
            const attendanceText = rsvp.attending === "yes" 
                ? '<span style="color: #27ae60; font-weight: 600;"><i class="fa-solid fa-circle-check"></i> Présent</span>' 
                : '<span style="color: #c0392b; font-weight: 600;"><i class="fa-solid fa-circle-xmark"></i> Absent</span>';
            const guestsText = rsvp.attending === "yes" ? rsvp.guests : "-";
            
            tr.innerHTML = `
                <td style="font-weight: 500;">${escapeHTML(rsvp.name)}</td>
                <td>${attendanceText}</td>
                <td style="text-align: center;">${guestsText}</td>
                <td style="font-style: italic; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHTML(rsvp.message)}">${escapeHTML(rsvp.message) || '-'}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // Export CSV logic
    exportBtn.addEventListener("click", () => {
        const rsvps = JSON.parse(localStorage.getItem(RSVP_STORAGE_KEY)) || [];
        if (rsvps.length === 0) {
            alert("Aucune donnée à exporter.");
            return;
        }

        // CSV Header
        let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Add BOM for excel french accents
        csvContent += "Nom,Presence,Accompagnateurs,Message,Date d'inscription\n";

        rsvps.forEach(rsvp => {
            const presence = rsvp.attending === "yes" ? "Présent" : "Absent";
            const row = [
                `"${rsvp.name.replace(/"/g, '""')}"`,
                `"${presence}"`,
                `"${rsvp.guests}"`,
                `"${rsvp.message.replace(/"/g, '""')}"`,
                `"${rsvp.date}"`
            ].join(",");
            csvContent += row + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "invites_mariage_brunelle_steve.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Reset database
    clearBtn.addEventListener("click", () => {
        if (confirm("Attention ! Voulez-vous vraiment réinitialiser toutes les réponses RSVP ? Cette action est irréversible.")) {
            localStorage.removeItem(RSVP_STORAGE_KEY);
            // Reset filter controls in DOM
            currentFilter = "all";
            searchQuery = "";
            searchInput.value = "";
            filterTabs.forEach(t => t.classList.remove("active"));
            document.querySelector('.filter-tab[data-filter="all"]').classList.add("active");
            renderAdminTable();
        }
    });
}

// ==========================================
// CONTACT FORM SIMULATION
// ==========================================
function initContact() {
    const form = document.getElementById("contact-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Merci pour votre message ! Steve ou Brunelle vous recontacteront dans les plus brefs délais.");
        form.reset();
    });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// ==========================================
// CALENDAR INTEGRATION (GOOGLE & ICS)
// ==========================================
function initScheduleCalendars() {
    const calendarWrappers = document.querySelectorAll(".calendar-wrapper");

    calendarWrappers.forEach(wrapper => {
        const button = wrapper.querySelector(".btn-calendar");
        const dropdown = wrapper.querySelector(".calendar-dropdown");

        button.addEventListener("click", (e) => {
            e.stopPropagation();
            
            // Close other dropdowns
            calendarWrappers.forEach(otherWrapper => {
                if (otherWrapper !== wrapper) {
                    otherWrapper.querySelector(".calendar-dropdown").classList.remove("active");
                    otherWrapper.querySelector(".btn-calendar").classList.remove("active");
                    otherWrapper.querySelector(".btn-calendar").setAttribute("aria-expanded", "false");
                }
            });

            // Toggle current dropdown
            const isActive = dropdown.classList.toggle("active");
            button.classList.toggle("active", isActive);
            button.setAttribute("aria-expanded", isActive ? "true" : "false");
        });
    });

    // Close calendar dropdowns when clicking outside
    document.addEventListener("click", () => {
        calendarWrappers.forEach(wrapper => {
            wrapper.querySelector(".calendar-dropdown").classList.remove("active");
            wrapper.querySelector(".btn-calendar").classList.remove("active");
            wrapper.querySelector(".btn-calendar").setAttribute("aria-expanded", "false");
        });
    });

    // Handle ICS downloads
    const icsButtons = document.querySelectorAll(".download-ics-btn");
    const eventsData = {
        ceremony: {
            title: "Cérémonie de Mariage - Brunelle & Steve",
            description: "C'est ici, devant nos proches et devant Dieu, que nous prononcerons nos vœux de mariage.",
            location: "Salle du Royaume des Témoins de Jéhovah, 2100 Boulevard Shevchenko, LaSalle, QC",
            start: "20260822T183000Z", // 14h30 EDT is 18h30 UTC
            end: "20260822T200000Z"   // 16h00 EDT is 20h00 UTC
        },
        reception: {
            title: "Réception & Dîner - Brunelle & Steve",
            description: "Rejoignez-nous pour célébrer, porter un toast, déguster un délicieux dîner et danser jusqu'au bout de la nuit.",
            location: "Salle de Réception LaSalle, 420 Avenue Lafleur, LaSalle, QC H8R 3H6",
            start: "20260822T210000Z", // 17h00 EDT is 21h00 UTC
            end: "20260823T040000Z"   // 00h00 EDT (August 23) is 04h00 UTC
        },
        party_end: {
            title: "Fin de la Soirée - Brunelle & Steve",
            description: "Fin de la célébration et repos bien mérité pour les mariés et leurs invités !",
            location: "LaSalle, QC",
            start: "20260823T040000Z", // 00h00 EDT is 04h00 UTC
            end: "20260823T050000Z"   // 01h00 EDT is 05h00 UTC
        }
    };

    icsButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const eventKey = btn.getAttribute("data-event");
            const eventInfo = eventsData[eventKey];
            if (eventInfo) {
                downloadICSFile(eventInfo);
            }
        });
    });
}

function downloadICSFile(eventInfo) {
    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Brunelle et Steve//Wedding Website//FR",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:${eventInfo.start}-${Math.random().toString(36).substr(2, 9)}@mariage-brunelle-steve.ca`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"}`,
        `DTSTART:${eventInfo.start}`,
        `DTEND:${eventInfo.end}`,
        `SUMMARY:${eventInfo.title}`,
        `DESCRIPTION:${eventInfo.description}`,
        `LOCATION:${eventInfo.location}`,
        "SEQUENCE:0",
        "STATUS:CONFIRMED",
        "TRANSP:OPAQUE",
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${eventInfo.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ==========================================
// BACKGROUND HERO SLIDESHOW
// ==========================================
function initHeroSlideshow() {
    const heroBg1 = document.getElementById("hero-bg-1");
    const heroBg2 = document.getElementById("hero-bg-2");
    
    const images = [
        "WhatsApp Image 2026-06-15 at 22.32.37 (1).jpeg",
        "WhatsApp Image 2026-06-15 at 22.32.37 (2).jpeg",
        "WhatsApp Image 2026-06-15 at 22.32.37 (3).jpeg",
        "WhatsApp Image 2026-06-15 at 22.32.37 (4).jpeg",
        "WhatsApp Image 2026-06-15 at 22.32.37 (5).jpeg",
        "WhatsApp Image 2026-06-15 at 22.32.37 (6).jpeg",
        "WhatsApp Image 2026-06-15 at 22.32.37 (7).jpeg",
        "WhatsApp Image 2026-06-15 at 22.32.37 (8).jpeg",
        "WhatsApp Image 2026-06-15 at 22.32.37.jpeg",
        "WhatsApp Image 2026-06-15 at 22.32.38.jpeg",
        "WhatsApp Image 2026-06-15 at 22.32.38 (1).jpeg",
        "WhatsApp Image 2026-06-15 at 22.32.38 (2).jpeg",
        "WhatsApp Image 2026-06-15 at 22.32.38 (3).jpeg",
        "WhatsApp Image 2026-06-15 at 22.39.17.jpeg"
    ];

    // Preload all slideshow images to prevent flickering during transition
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    let currentIndex = 0;
    let activeLayer = heroBg1;
    let inactiveLayer = heroBg2;

    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        const nextImage = images[currentIndex];

        // Preload next image and apply to inactive layer
        inactiveLayer.style.backgroundImage = `url('${nextImage}')`;
        
        // Cross-fade opacity
        inactiveLayer.style.opacity = 1;
        activeLayer.style.opacity = 0;

        // Swap active and inactive layers
        const temp = activeLayer;
        activeLayer = inactiveLayer;
        inactiveLayer = temp;
    }, 4000);
}
