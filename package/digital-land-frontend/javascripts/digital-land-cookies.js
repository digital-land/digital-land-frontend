function setCookie (name, value, days) {
  var expires = ''
  if (days) {
    var date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}

function getCookie (name) {
  var nameEQ = name + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

function acceptCookies () { // eslint-disable-line no-unused-vars
  setCookie('cookies_preferences_set', true, 365)
  setCookie('cookies_policy', JSON.stringify({ essential: true, settings: true, usage: true, campaigns: true }), 365)
  hideCookieBanner()
  showCookieConfirmation()
  setTrackingCookies()
}

function hideCookieBanner () {
  var cookieBanner = document.getElementById('cookie-banner')
  cookieBanner.style.display = 'none'
}

function showCookieConfirmation () {
  var cookieBanner = document.getElementById('cookie-confirmation')
  cookieBanner.style.display = 'block'
}

function setTrackingCookies () {
  var cookiesPolicy = JSON.parse(getCookie('cookies_policy'))
  var doNotTrack = cookiesPolicy == null || !cookiesPolicy.usage
  if (doNotTrack) {
    window['ga-disable-UA-127566551-1'] = true
  } else {
    window.ga = window.ga || function () { (ga.q = ga.q || []).push(arguments) }; ga.l = +new Date()
    ga('create', 'UA-127566551-1', 'auto')
    ga('send', 'pageview')
  }
}

class cookiePrefs{
  static essential = true;
  static settings = false;
  static usage = false;
  static campaigns = false;

  static get = () => {
    var cookiesPolicy = JSON.parse(getCookie('cookies_policy'));
    if(cookiesPolicy){
      this.setEssential(cookiesPolicy.essential);
      this.setSettings(cookiesPolicy.settings);
      this.setUsage(cookiesPolicy.usage);
      this.setCampaigns(cookiesPolicy.campaigns);
    }
  }

  static setEssential = (value) => this.essential = value;
  static setSettings = (value) => this.settings = value;
  static setUsage = (value) => this.usage = value;
  static setCampaigns = (value) => this.campaigns = value;

  static save = (expires = 365) => {
    setCookie('cookies_preferences_set', true, expires)
    setCookie('cookies_policy', JSON.stringify({ 
      essential: this.essential, 
      settings: this.settings, 
      usage: this.usage, 
      campaigns: this.campaigns 
    }), expires)
    hideCookieBanner()
    setTrackingCookies()
  }
}

if (getCookie('cookies_preferences_set')) {
  hideCookieBanner()
}

setTrackingCookies()
