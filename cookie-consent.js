// cookie-consent.js with AdSense integration
document.addEventListener('DOMContentLoaded', function() {
    // Check if user has already made a cookie choice
    if (!localStorage.getItem('cookieConsent')) {
        // Create the cookie consent banner
        const consentBanner = document.createElement('div');
        consentBanner.id = 'cookie-consent-banner';
        consentBanner.innerHTML = `
            <div class="cookie-content">
                <h3>Cookie Consent</h3>
                <p>This website uses cookies to enhance your experience and to analyze site traffic. We also include cookies from third party services like Google Analytics and Google AdSense.</p>
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
                        <small>Used to deliver ads and personalized content through Google AdSense</small>
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

        // Style the banner - Your existing styles

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
    
    // Load Google AdSense if marketing consent is given
    if (consent && consent.marketing) {
        loadGoogleAds();
    }
}

function loadGoogleAnalytics() {
    // Your existing Google Analytics implementation
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-8X5PJJM9T6'; // Your GA4 ID
    document.head.appendChild(gaScript);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-8X5PJJM9T6'); // Your GA4 ID
}

function loadGoogleAds() {
    // Create the AdSense script element with your publisher ID
    const adSenseScript = document.createElement('script');
    adSenseScript.async = true;
    adSenseScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8772646039118823';
    adSenseScript.crossOrigin = 'anonymous';
    
    // Append the script to the document head
    document.head.appendChild(adSenseScript);
    
    // If you're using auto ads, enable them when the script loads
    adSenseScript.onload = function() {
        // For Auto ads (if you're using them)
        if (typeof adsbygoogle !== 'undefined') {
            (adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: 'ca-pub-8772646039118823',
                enable_page_level_ads: true
            });
        }
        
        // For manual ad units, initialize them
        const adUnits = document.querySelectorAll('.adsbygoogle');
        adUnits.forEach(unit => {
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error('Error initializing ad unit:', e);
            }
        });
    };
    
    console.log('Google AdSense scripts loaded successfully');
}

// Function to manage cookie preferences - Your existing openCookiePreferences function
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
                    <small>Used to deliver ads and personalized content through Google AdSense</small>
                </div>
            </div>
            <div class="cookie-actions">
                <button id="pref-save">Save Preferences</button>
                <button id="pref-close">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Your existing modal styles
    
    // Event listeners
    document.getElementById('pref-save').addEventListener('click', function() {
        const previousConsent = JSON.parse(localStorage.getItem('cookieConsent'));
        const newConsent = {
            essential: true,
            analytics: document.getElementById('pref-analytics-cookies').checked,
            marketing: document.getElementById('pref-marketing-cookies').checked
        };
        
        // Save the new consent
        saveConsent(newConsent);
        
        // Handle the case where marketing was previously disabled but is now enabled
        if (!previousConsent.marketing && newConsent.marketing) {
            loadGoogleAds();
        }
        
        // Handle the case where analytics was previously disabled but is now enabled
        if (!previousConsent.analytics && newConsent.analytics) {
            loadGoogleAnalytics();
        }
        
        modal.remove();
    });
    
    document.getElementById('pref-close').addEventListener('click', function() {
        modal.remove();
    });
}

// Add this line to your HTML to expose the function globally
window.openCookiePreferences = openCookiePreferences;

// Helper function to check if AdSense is already loaded
function isAdSenseLoaded() {
    return document.querySelector('script[src*="adsbygoogle.js"]') !== null;
}

// Optional: Function to handle ad blocker detection
function checkAdBlocker() {
    return new Promise((resolve) => {
        let adBlockDetected = false;
        const testAd = document.createElement('div');
        testAd.innerHTML = '&nbsp;';
        testAd.className = 'ad-unit adsbox adsbygoogle';
        testAd.style.cssText = 'position: absolute; left: -999px; top: -999px; height: 1px; width: 1px;';
        document.body.appendChild(testAd);
        
        setTimeout(() => {
            adBlockDetected = testAd.offsetHeight === 0;
            document.body.removeChild(testAd);
            resolve(adBlockDetected);
        }, 100);
    });
}

// Optional: Show a message if ads are blocked
function showAdBlockerMessage() {
    checkAdBlocker().then(isBlocked => {
        if (isBlocked) {
            const message = document.createElement('div');
            message.className = 'ad-blocker-message';
            message.innerHTML = `
                <div class="ad-blocker-content">
                    <h3>Ad Blocker Detected</h3>
                    <p>We notice you're using an ad blocker. Our content is supported by advertising. 
                    Please consider disabling your ad blocker or supporting us another way.</p>
                    <button id="close-ad-message">Close</button>
                </div>
            `;
            document.body.appendChild(message);
            
            document.getElementById('close-ad-message').addEventListener('click', function() {
                message.remove();
            });
            
            // Add styles for the message
            const style = document.createElement('style');
            style.textContent = `
                .ad-blocker-message {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background-color: white;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    padding: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    z-index: 1000;
                    max-width: 300px;
                }
                .ad-blocker-content h3 {
                    margin-top: 0;
                }
                #close-ad-message {
                    background-color: #f1f1f1;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 3px;
                    cursor: pointer;
                    margin-top: 10px;
                }
            `;
            document.head.appendChild(style);
        }
    });
}

// Uncomment if you want to show ad blocker messages
// window.addEventListener('load', showAdBlockerMessage);
