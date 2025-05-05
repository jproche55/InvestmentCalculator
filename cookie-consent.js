// cookie-consent.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if user has already made a cookie choice
    if (!localStorage.getItem('cookieConsent')) {
        // Create the cookie consent banner
        const consentBanner = document.createElement('div');
        consentBanner.id = 'cookie-consent-banner';
        consentBanner.innerHTML = `
            <div class="cookie-content">
                <h3>Cookie Consent</h3>
                <p>This website uses cookies to enhance your experience and to analyze site traffic. We also include cookies from third party services like Google Analytics and Google Ads.</p>
                <div class="cookie-options">
                    <div class="cookie-option">
                        <input type="checkbox" id="essential-cookies" checked disabled>
                        <label for="essential-cookies">Essential Cookies</label>
                        <small>Required for the website to function and cannot be disabled</small>
                    </div>
                    <div class="cookie-option">
                        <input type="checkbox" id="analytics-cookies" checked>
                        <label for="analytics-cookies">Analytics Cookies</label>
                        <small>Help us improve our website by collecting anonymous usage information</small>
                    </div>
                    <div class="cookie-option">
                        <input type="checkbox" id="marketing-cookies" checked>
                        <label for="marketing-cookies">Marketing Cookies</label>
                        <small>Used to deliver personalized ads and content</small>
                    </div>
                </div>
                <div class="cookie-actions">
                    <button id="accept-selected">Accept Selected</button>
                    <button id="accept-all">Accept All</button>
                    <button id="reject-all">Reject Non-Essential</button>
                </div>
                <div class="cookie-footer">
                    <a href="privacy-policy.html">View our Privacy Policy</a>
                </div>
            </div>
        `;
        document.body.appendChild(consentBanner);

        // Style the banner
        const style = document.createElement('style');
        style.textContent = `
            #cookie-consent-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: #ffffff;
                box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                font-family: inherit;
            }
            .cookie-content {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }
            .cookie-content h3 {
                margin-top: 0;
                color: #333;
            }
            .cookie-options {
                margin: 20px 0;
            }
            .cookie-option {
                margin-bottom: 10px;
            }
            .cookie-option label {
                font-weight: bold;
                margin-left: 8px;
            }
            .cookie-option small {
                display: block;
                margin-left: 25px;
                color: #666;
                font-size: 0.8em;
            }
            .cookie-actions {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            .cookie-actions button {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
            }
            #accept-all {
                background-color: #4CAF50;
                color: white;
            }
            #accept-selected {
                background-color: #2196F3;
                color: white;
            }
            #reject-all {
                background-color: #f1f1f1;
                color: #333;
            }
            .cookie-footer {
                margin-top: 15px;
                font-size: 0.9em;
            }
            .cookie-footer a {
                color: #2196F3;
                text-decoration: none;
            }
            .cookie-footer a:hover {
                text-decoration: underline;
            }
            @media (max-width: 768px) {
                .cookie-actions {
                    flex-direction: column;
                }
                .cookie-actions button {
                    width: 100%;
                    margin-bottom: 5px;
                }
            }
        `;
        document.head.appendChild(style);

        // Event listeners
        document.getElementById('accept-all').addEventListener('click', function() {
            saveConsent({
                essential: true,
                analytics: true,
                marketing: true
            });
        });

        document.getElementById('accept-selected').addEventListener('click', function() {
            saveConsent({
                essential: true,
                analytics: document.getElementById('analytics-cookies').checked,
                marketing: document.getElementById('marketing-cookies').checked
            });
        });

        document.getElementById('reject-all').addEventListener('click', function() {
            saveConsent({
                essential: true,
                analytics: false,
                marketing: false
            });
        });
    } else {
        // User has already made a choice, load appropriate scripts
        loadConsentedScripts();
    }
});

function saveConsent(consent) {
    // Save consent to localStorage
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    
    // Remove the banner
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
        banner.remove();
    }
    
    // Load appropriate scripts based on consent
    loadConsentedScripts();
}

function loadConsentedScripts() {
    const consent = JSON.parse(localStorage.getItem('cookieConsent'));
    
    // Always load essential scripts
    
    // Load Google Analytics if analytics consent is given
    if (consent && consent.analytics) {
        loadGoogleAnalytics();
    }
    
    // Load Google Ads if marketing consent is given
    if (consent && consent.marketing) {
        loadGoogleAds();
    }
}

function loadGoogleAnalytics() {
    // Google Analytics 4 implementation
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX'; // Replace with your GA4 ID
    document.head.appendChild(gaScript);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX'); // Replace with your GA4 ID
}

function loadGoogleAds() {
    // Google Ads implementation
    const adsScript = document.createElement('script');
    adsScript.async = true;
    adsScript.src = 'https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXXX'; // Replace with your Google Ads ID
    document.head.appendChild(adsScript);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-XXXXXXXXXX'); // Replace with your Google Ads ID
}

// Function to manage cookie preferences
function openCookiePreferences() {
    // Remove any existing preference modal
    const existingModal = document.getElementById('cookie-preferences-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Get current preferences
    const currentConsent = localStorage.getItem('cookieConsent') 
        ? JSON.parse(localStorage.getItem('cookieConsent')) 
        : { essential: true, analytics: false, marketing: false };
    
    // Create preferences modal
    const modal = document.createElement('div');
    modal.id = 'cookie-preferences-modal';
    modal.innerHTML = `
        <div class="preferences-content">
            <h3>Cookie Preferences</h3>
            <p>Manage your cookie preferences below.</p>
            <div class="cookie-options">
                <div class="cookie-option">
                    <input type="checkbox" id="pref-essential-cookies" checked disabled>
                    <label for="pref-essential-cookies">Essential Cookies</label>
                    <small>Required for the website to function and cannot be disabled</small>
                </div>
                <div class="cookie-option">
                    <input type="checkbox" id="pref-analytics-cookies" ${currentConsent.analytics ? 'checked' : ''}>
                    <label for="pref-analytics-cookies">Analytics Cookies</label>
                    <small>Help us improve our website by collecting anonymous usage information</small>
                </div>
                <div class="cookie-option">
                    <input type="checkbox" id="pref-marketing-cookies" ${currentConsent.marketing ? 'checked' : ''}>
                    <label for="pref-marketing-cookies">Marketing Cookies</label>
                    <small>Used to deliver personalized ads and content</small>
                </div>
            </div>
            <div class="cookie-actions">
                <button id="pref-save">Save Preferences</button>
                <button id="pref-close">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Style the modal
    const style = document.createElement('style');
    style.textContent = `
        #cookie-preferences-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1001;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .preferences-content {
            background-color: white;
            padding: 25px;
            border-radius: 8px;
            max-width: 500px;
            width: 100%;
        }
        /* Reusing other styles from cookie banner */
    `;
    document.head.appendChild(style);
    
    // Event listeners
    document.getElementById('pref-save').addEventListener('click', function() {
        saveConsent({
            essential: true,
            analytics: document.getElementById('pref-analytics-cookies').checked,
            marketing: document.getElementById('pref-marketing-cookies').checked
        });
        modal.remove();
    });
    
    document.getElementById('pref-close').addEventListener('click', function() {
        modal.remove();
    });
}

// Add this line to your HTML to expose the function globally
window.openCookiePreferences = openCookiePreferences;