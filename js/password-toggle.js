/**
 * Password Toggle Handler
 * Standalone module for showing/hiding password inputs
 * Works independently from main dashboard JS
 */

(function() {
  'use strict';

  // Initialize on DOM ready
  function initPasswordToggles() {
    const passwordToggleBtns = document.querySelectorAll('.password-toggle-btn');
    
    if (passwordToggleBtns.length === 0) {
      console.warn('[password-toggle.js] No password toggle buttons found');
      return;
    }

    console.log('[password-toggle.js] Initializing', passwordToggleBtns.length, 'toggle buttons');

    passwordToggleBtns.forEach((btn, index) => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Get target from data-target attribute
        let targetId = this.getAttribute('data-target') || '';
        let passwordInput = null;

        // Support both selector formats: "#id" and "id"
        if (targetId.startsWith('#')) {
          passwordInput = document.querySelector(targetId);
        } else if (targetId) {
          // Try direct ID lookup first, then querySelector with #
          passwordInput = document.getElementById(targetId) || document.querySelector('#' + targetId);
        }

        if (!passwordInput) {
          console.warn('[password-toggle.js] Button', index, '- Password input not found for target:', targetId);
          return;
        }

        const icon = this.querySelector('i');
        if (!icon) {
          console.warn('[password-toggle.js] Button', index, '- No icon element found');
          return;
        }

        try {
          // Toggle password visibility
          if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
            console.log('[password-toggle.js] Showing password for target:', targetId);
          } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
            console.log('[password-toggle.js] Hiding password for target:', targetId);
          }
        } catch (err) {
          console.error('[password-toggle.js] Error toggling password:', err);
        }
      });

      console.log('[password-toggle.js] Button', index, 'initialized with target:', btn.getAttribute('data-target'));
    });
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPasswordToggles);
  } else {
    // DOM already loaded (e.g., script loaded after page render)
    initPasswordToggles();
  }

  // Also re-initialize if DOM changes (for dynamic content)
  const observer = new MutationObserver(function(mutations) {
    // Only check if new password-toggle-btn elements were added
    let hasNewButtons = mutations.some(mutation => {
      return Array.from(mutation.addedNodes).some(node => {
        return node.classList && node.classList.contains('password-toggle-btn') ||
               (node.querySelectorAll && node.querySelectorAll('.password-toggle-btn').length > 0);
      });
    });

    if (hasNewButtons) {
      console.log('[password-toggle.js] New toggle buttons detected, re-initializing');
      initPasswordToggles();
    }
  });

  // Start watching for DOM changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
