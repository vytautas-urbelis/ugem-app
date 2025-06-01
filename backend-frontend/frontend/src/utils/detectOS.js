// utils/detectOS.js

export function detectOS() {
    const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;
  
    // Windows
    if (/windows phone/i.test(userAgent)) {
      return "Windows Phone";
    }
    if (/win/i.test(userAgent)) {
      return "Windows";
    }
  
    // macOS
    if (/mac/i.test(userAgent)) {
      return "macOS";
    }
  
    // iOS
    if (/iphone|ipad|ipod/i.test(userAgent)) {
      return "iOS";
    }
  
    // Android
    if (/android/i.test(userAgent)) {
      return "Android";
    }
  
    // Linux
    if (/linux/i.test(userAgent)) {
      return "Linux";
    }
  
    // Default
    return "Unknown OS";
  }
  

  export const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/Mobi|Android/i.test(ua)) {
      return 'Mobile';
    } else if (/Tablet|iPad/i.test(ua)) {
      return 'Tablet';
    } else {
      return 'Desktop';
    }
  };