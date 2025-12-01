class FAQAccordion {
  constructor() {
    this.accordionItems = document.querySelectorAll(".faq-item");
    this.init();
  }

  init() {
    this.accordionItems.forEach((item, index) => {
      const summary = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");
      const detailsElement = item;

      // Set up ARIA attributes for accessibility
      this.setupAccessibility(detailsElement, summary, answer, index);

      // Add event listeners
      this.addEventListeners(detailsElement, summary, answer);
    });

    // Create live region for screen reader announcements
    this.createLiveRegion();
  }

  setupAccessibility(details, summary, answer, index) {
    // Generate unique IDs
    const questionId = `faq-question-${index}`;
    const answerId = `faq-answer-${index}`;

    // Set IDs
    summary.id = questionId;
    answer.id = answerId;

    // Set ARIA attributes
    summary.setAttribute("aria-expanded", details.open ? "true" : "false");
    summary.setAttribute("aria-controls", answerId);
    answer.setAttribute("aria-labelledby", questionId);
    answer.setAttribute("role", "region");
  }

  addEventListeners(details, summary, answer) {
    // Handle native details toggle - this fires on both click and keyboard
    details.addEventListener("toggle", () => {
      this.handleToggle(details, summary, answer);
    });

    // Handle keyboard navigation
    summary.addEventListener("keydown", (e) => {
      this.handleKeyboard(e, details);
    });

    // Prevent text selection on double click
    summary.addEventListener("mousedown", (e) => {
      if (e.detail > 1) {
        e.preventDefault();
      }
    });
  }

  handleToggle(details, summary, answer) {
    const isOpen = details.open;

    // Update ARIA attribute to reflect current state
    summary.setAttribute("aria-expanded", isOpen ? "true" : "false");

    // Note: Removed style.display manipulation - relying on native <details> behavior
    // This allows screen readers to properly access content in the expanded state

    // Update icons
    this.updateIcons(summary, isOpen);

    // Announce to screen readers with answer content when expanded
    if (isOpen) {
      const answerText = answer.textContent.trim();
      this.announceToScreenReader(`Expanded. ${answerText}`);
    } else {
      this.announceToScreenReader("Collapsed");
    }
  }

  handleKeyboard(e, details) {
    // Space or Enter to toggle - let native details handle it, just prevent scroll
    if (e.key === " ") {
      e.preventDefault();
      // Native details will handle the toggle via Enter key automatically
    }

    // Arrow navigation
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      this.navigateAccordion(e.key);
    }

    // Home/End keys
    if (e.key === "Home") {
      e.preventDefault();
      this.focusFirstAccordion();
    }

    if (e.key === "End") {
      e.preventDefault();
      this.focusLastAccordion();
    }
  }

  updateIcons(summary, isOpen) {
    const iconWrapper = summary.querySelector(".icon-wrapper");
    if (!iconWrapper) return;

    const plusIcon = iconWrapper.querySelector(".icon-plus");
    const minusIcon = iconWrapper.querySelector(".icon-minus");

    if (plusIcon && minusIcon) {
      plusIcon.style.display = isOpen ? "none" : "block";
      minusIcon.style.display = isOpen ? "block" : "none";
    }
  }

  navigateAccordion(direction) {
    const currentFocus = document.activeElement;
    const summaries = Array.from(document.querySelectorAll(".faq-question"));
    const currentIndex = summaries.indexOf(currentFocus);

    if (currentIndex === -1) return;

    let nextIndex;
    if (direction === "ArrowDown") {
      nextIndex = (currentIndex + 1) % summaries.length;
    } else {
      nextIndex = (currentIndex - 1 + summaries.length) % summaries.length;
    }

    summaries[nextIndex].focus();
  }

  focusFirstAccordion() {
    const firstSummary = document.querySelector(".faq-question");
    if (firstSummary) firstSummary.focus();
  }

  focusLastAccordion() {
    const summaries = document.querySelectorAll(".faq-question");
    const lastSummary = summaries[summaries.length - 1];
    if (lastSummary) lastSummary.focus();
  }

  createLiveRegion() {
    // Create a visually hidden live region for screen reader announcements
    const liveRegion = document.createElement("div");
    liveRegion.id = "faq-announcements";
    liveRegion.setAttribute("role", "status");
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.className = "sr-only";
    document.body.appendChild(liveRegion);
  }

  announceToScreenReader(message) {
    const liveRegion = document.getElementById("faq-announcements");
    if (liveRegion) {
      // Clear previous announcement
      liveRegion.textContent = "";

      // Set new announcement after a brief delay to ensure it's read
      setTimeout(() => {
        liveRegion.textContent = message;
      }, 100);
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new FAQAccordion();
  });
} else {
  new FAQAccordion();
}
