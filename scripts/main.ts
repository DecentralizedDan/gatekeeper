/**
 * Main entry point for the Gatekeeper binary counting educational app
 */

import { gameManager } from "./game.js";
import { UI } from "./ui.js";
import { getLearningSequence } from "./binary.js";

/**
 * Application class that coordinates all components
 */
class GatekeeperApp {
  private ui: UI;
  private isInitialized: boolean = false;

  constructor() {
    this.ui = new UI();
    this.initialize();
  }

  /**
   * Initialize the application
   */
  private initialize(): void {
    if (this.isInitialized) {
      return;
    }

    try {
      this.setupEventListeners();
      this.validateEnvironment();
      this.loadUserPreferences();
      this.isInitialized = true;

      this.logAppInfo();
    } catch (error) {
      console.error("Failed to initialize Gatekeeper app:", error);
      this.showError(
        "Failed to initialize the application. Please refresh the page."
      );
    }
  }

  /**
   * Setup global event listeners
   */
  private setupEventListeners(): void {
    // Handle page visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        this.onPageVisible();
      }
    });

    // Handle window resize
    window.addEventListener(
      "resize",
      this.debounce(() => {
        this.onWindowResize();
      }, 250)
    );

    // Handle beforeunload
    window.addEventListener("beforeunload", () => {
      this.saveUserPreferences();
    });

    // Handle online/offline status
    window.addEventListener("online", () => {
      this.ui.showMessage("Connection restored", "success");
    });

    window.addEventListener("offline", () => {
      this.ui.showMessage(
        "You are offline. Some features may be limited.",
        "info"
      );
    });
  }

  /**
   * Validate the environment
   */
  private validateEnvironment(): void {
    // Check for required browser features
    if (!window.localStorage) {
      throw new Error("Local storage is not supported");
    }

    if (!document.querySelector) {
      throw new Error("Modern DOM methods are not supported");
    }

    // Check for required DOM elements
    const requiredElements = [
      "target-number",
      "binary-display",
      "result-display",
      "evaluate-btn",
      "next-btn",
      "progress-fill",
      "progress-text",
    ];

    for (const id of requiredElements) {
      if (!document.getElementById(id)) {
        throw new Error(`Required element with id '${id}' not found`);
      }
    }
  }

  /**
   * Load user preferences from localStorage
   */
  private loadUserPreferences(): void {
    try {
      const preferences = localStorage.getItem("gatekeeper-preferences");
      if (preferences) {
        const config = JSON.parse(preferences);
        gameManager.updateConfig(config);
      }
    } catch (error) {
      console.warn("Failed to load user preferences:", error);
    }
  }

  /**
   * Save user preferences to localStorage
   */
  private saveUserPreferences(): void {
    try {
      const config = gameManager.getConfig();
      localStorage.setItem("gatekeeper-preferences", JSON.stringify(config));
    } catch (error) {
      console.warn("Failed to save user preferences:", error);
    }
  }

  /**
   * Handle page becoming visible
   */
  private onPageVisible(): void {
    // Refresh the UI state
    const state = gameManager.getState();
    this.ui.updateUI(state);
  }

  /**
   * Handle window resize
   */
  private onWindowResize(): void {
    // Update responsive elements if needed
    const isMobile = window.innerWidth <= 768;
    document.body.classList.toggle("mobile", isMobile);
  }

  /**
   * Show error message
   */
  private showError(message: string): void {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.innerHTML = `
            <div class="error-content">
                <h3>Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()">Reload Page</button>
            </div>
        `;

    document.body.appendChild(errorDiv);
  }

  /**
   * Log application information
   */
  private logAppInfo(): void {
    // Application info logging removed for production
  }

  /**
   * Utility function for debouncing
   */
  private debounce(func: () => void, wait: number): () => void {
    let timeout: number;
    return function executedFunction() {
      const later = () => {
        clearTimeout(timeout);
        func();
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Get application statistics
   */
  getStats() {
    return {
      ...gameManager.getStats(),
      learningSequence: getLearningSequence(),
      config: gameManager.getConfig(),
    };
  }

  /**
   * Reset the application
   */
  reset(): void {
    gameManager.resetGame();
    this.ui.showMessage("Application reset successfully", "success");
  }
}

/**
 * Initialize the application when the DOM is ready
 */
function initializeApp(): void {
  // Check if app is already initialized
  if (window.gatekeeperApp) {
    return;
  }

  try {
    window.gatekeeperApp = new GatekeeperApp();
  } catch (error) {
    console.error("Failed to create Gatekeeper app:", error);

    // Show fallback error message
    const errorMessage = document.createElement("div");
    errorMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fee;
            border: 1px solid #fcc;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            z-index: 10000;
        `;
    errorMessage.innerHTML = `
            <h3>Application Error</h3>
            <p>Failed to initialize the Gatekeeper app.</p>
            <button onclick="location.reload()" style="padding: 8px 16px; margin-top: 10px;">
                Reload Page
            </button>
        `;
    document.body.appendChild(errorMessage);
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}

// Export for potential external use
export { GatekeeperApp };

// Add to window object for debugging
declare global {
  interface Window {
    gatekeeperApp?: GatekeeperApp;
  }
}
