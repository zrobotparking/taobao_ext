// background.js

chrome.action.onClicked.addListener((tab) => {
    // 點擊擴充功能圖示時觸發
    // 這裡不需要做任何事情，因為我們直接在 popup.js 中注入程式碼
      console.log("擴充功能圖示已點擊");
  });