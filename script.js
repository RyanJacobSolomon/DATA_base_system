const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {

if(window.scrollY > 50){

navbar.classList.add("scrolled");

}else{

navbar.classList.remove("scrolled");

}

});

const hamburger = document.querySelector(".hamburger");

const mobileMenu = document.querySelector(".mobile-menu");

hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
});

document.querySelectorAll(".mobile-menu a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".menu .card");
  const modal = document.getElementById("card-lightbox-modal");
  const modalBody = document.getElementById("lightbox-body");
  const modalClose = document.getElementById("lightbox-close");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      if (modal && modalBody) {
        modalBody.innerHTML = card.innerHTML;
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  function closeModal() {
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Initialize Landing Menu Search
  initLandingMenuSearch();
  // Initialize Customer Reviews System
  initReviewsSystem();
});

function initReviewsSystem() {
  const reviewsGrid = document.getElementById("reviews-grid");
  const openModalBtn = document.getElementById("open-review-modal-btn");
  const modal = document.getElementById("review-modal");
  const closeModalBtn = document.getElementById("review-modal-close");
  const form = document.getElementById("review-form");
  const starIcons = document.querySelectorAll("#star-rating-select i");
  const ratingInput = document.getElementById("review-rating-input");

  fetchReviews();

  if (openModalBtn && modal) {
    openModalBtn.addEventListener("click", () => {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Star rating click handler
  starIcons.forEach(star => {
    star.addEventListener("click", () => {
      const val = parseInt(star.dataset.val);
      ratingInput.value = val;
      starIcons.forEach(s => {
        const sVal = parseInt(s.dataset.val);
        s.classList.toggle("active", sVal <= val);
      });
    });
  });

  // Review Form Submit
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const customerName = document.getElementById("review-name").value.trim();
      const rating = parseInt(ratingInput.value) || 5;
      const favoriteItem = document.getElementById("review-favorite").value.trim();
      const comment = document.getElementById("review-comment").value.trim();

      try {
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_name: customerName,
            rating: rating,
            favorite_item: favoriteItem,
            comment: comment
          })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          alert("🎉 Thank you! Your review has been published.");
          form.reset();
          closeModal();
          fetchReviews();
        } else {
          alert("Error submitting review: " + (data.error || "Please try again."));
        }
      } catch (err) {
        alert("Failed to connect to server. Please check your connection.");
      }
    });
  }

  async function fetchReviews() {
    if (!reviewsGrid) return;
    try {
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const reviews = await res.json();
        renderReviews(reviews);
      }
    } catch (e) {
      console.warn("Could not load reviews from backend:", e);
    }
  }

  function renderReviews(reviews) {
    if (!reviewsGrid) return;
    if (!reviews || reviews.length === 0) {
      reviewsGrid.innerHTML = `<p class="no-reviews">No reviews yet. Be the first to leave one!</p>`;
      return;
    }

    reviewsGrid.innerHTML = reviews.map(r => {
      const stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);
      return `
        <div class="review-card">
          <div class="review-header">
            <div class="reviewer-avatar"><i class="fa-solid fa-user"></i></div>
            <div class="reviewer-info">
              <h4>${escapeHtml(r.customer_name)}</h4>
              <div class="stars">${stars}</div>
            </div>
          </div>
          <p class="review-comment">"${escapeHtml(r.comment)}"</p>
          ${r.favorite_item ? `<span class="fav-badge"><i class="fa-solid fa-heart text-gold"></i> Prefers: ${escapeHtml(r.favorite_item)}</span>` : ""}
        </div>
      `;
    }).join("");
  }

  function escapeHtml(str) {
    return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
}

function initLandingMenuSearch() {
  const searchInput = document.getElementById("landing-menu-search");
  const clearBtn = document.getElementById("landing-search-clear");
  const feedback = document.getElementById("landing-search-feedback");
  const tags = document.querySelectorAll(".landing-tag-btn");
  const cards = document.querySelectorAll(".menu .card");

  if (!searchInput) return;

  // Cache original HTML for every item row inside cards
  cards.forEach(card => {
    card.querySelectorAll("p").forEach(p => {
      if (!p.dataset.origHtml) {
        p.dataset.origHtml = p.innerHTML;
      }
    });
  });

  function performSearch() {
    const rawVal = searchInput.value;
    const q = rawVal.trim().toLowerCase();

    // Toggle clear button
    if (clearBtn) {
      clearBtn.style.display = q ? "flex" : "none";
    }

    // Toggle active tag buttons
    tags.forEach(tag => {
      tag.classList.toggle("active", tag.dataset.query.toLowerCase() === q);
    });

    if (!q) {
      if (feedback) feedback.style.display = "none";
      cards.forEach(card => {
        card.classList.remove("has-match", "is-dimmed");
        card.querySelectorAll("p").forEach(p => {
          p.innerHTML = p.dataset.origHtml || p.innerHTML;
          p.style.opacity = "";
        });
      });
      return;
    }

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");

    let totalMatches = 0;

    cards.forEach(card => {
      let cardHasMatch = false;
      const h3 = card.querySelector("h3");
      const categoryMatch = h3 && h3.textContent.toLowerCase().includes(q);

      card.querySelectorAll("p").forEach(p => {
        const orig = p.dataset.origHtml || p.innerHTML;
        if (orig.toLowerCase().includes(q)) {
          cardHasMatch = true;
          totalMatches++;
          p.innerHTML = orig.replace(regex, '<mark class="landing-highlight">$1</mark>');
          p.style.opacity = "1";
        } else if (categoryMatch) {
          p.innerHTML = orig;
          p.style.opacity = "1";
        } else {
          p.innerHTML = orig;
          p.style.opacity = "0.35";
        }
      });

      if (cardHasMatch || categoryMatch) {
        card.classList.add("has-match");
        card.classList.remove("is-dimmed");
      } else {
        card.classList.remove("has-match");
        card.classList.add("is-dimmed");
      }
    });

    if (feedback) {
      feedback.style.display = "flex";
      if (totalMatches > 0) {
        feedback.innerHTML = `
          <span>Showing <strong>${totalMatches}</strong> ${totalMatches === 1 ? "item" : "items"} matching "<strong>${rawVal.trim()}</strong>"</span>
          <a href="orderonline.html?search=${encodeURIComponent(rawVal.trim())}" class="landing-order-cta">
            <i class="fa-solid fa-cart-shopping"></i> Order Online &rarr;
          </a>
        `;
      } else {
        feedback.innerHTML = `
          <span>No items found for "<strong>${rawVal.trim()}</strong>"</span>
          <a href="orderonline.html" class="landing-order-cta">
            <i class="fa-solid fa-mug-hot"></i> Explore Full Online Menu &rarr;
          </a>
        `;
      }
    }
  }

  searchInput.addEventListener("input", performSearch);

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchInput.value = "";
      performSearch();
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      performSearch();
      searchInput.focus();
    });
  }

  tags.forEach(tag => {
    tag.addEventListener("click", () => {
      const tagQuery = tag.dataset.query;
      if (searchInput.value.toLowerCase() === tagQuery.toLowerCase()) {
        searchInput.value = "";
      } else {
        searchInput.value = tagQuery;
      }
      performSearch();
      searchInput.focus();
    });
  });
}