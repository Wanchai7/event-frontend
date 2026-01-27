// utils/cookies.js
// ฟังก์ชันเพื่อเก็บ token ใน cookies
export const setTokenCookie = (token, daysExpire = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + daysExpire * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `token=${token}; ${expires}; path=/`;
};

// ฟังก์ชันเพื่อดึง token จาก cookies
export const getTokenCookie = () => {
  const nameEQ = "token=";
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
};

// ฟังก์ชันเพื่อลบ token จาก cookies
export const deleteTokenCookie = () => {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

// ฟังก์ชันเพื่อเก็บข้อมูล user ใน cookies
export const setUserCookie = (userId, username, daysExpire = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + daysExpire * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `userId=${userId}; ${expires}; path=/`;
  document.cookie = `username=${username}; ${expires}; path=/`;
};

// ฟังก์ชันเพื่อดึงข้อมูล user จาก cookies
export const getUserIdCookie = () => {
  const nameEQ = "userId=";
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
};

export const getUsernameCookie = () => {
  const nameEQ = "username=";
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
};

// ฟังก์ชันเพื่อลบข้อมูล user จาก cookies
export const deleteUserCookie = () => {
  document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

// ฟังก์ชันเพื่อล้างทุก cookies
export const clearAllCookies = () => {
  deleteTokenCookie();
  deleteUserCookie();
};
