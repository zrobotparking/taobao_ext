// content-new-page.js (在新頁面中執行)

function extractDataFromNewPage() {
    const elements = document.querySelectorAll('.rax-view-v2.flexRow'); // 選擇器
    const data = [];

    elements.forEach(element => {
        data.push(element.textContent.trim());
    });

    // 將提取到的資料發送給 background script
    chrome.runtime.sendMessage({ type: 'extractedData', data: data });
}

extractDataFromNewPage();