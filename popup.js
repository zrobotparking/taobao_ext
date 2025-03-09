// popup.js

document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: extractTextFromTarget,
      }).then((result) => {
        const texts = result[0]?.result;
        const dataList = document.getElementById('data-list');
  
        if (texts && texts.length > 0) {
          texts.forEach((text) => {
            const li = document.createElement('li');
            const pre = document.createElement('pre'); // 建立 <pre>
            pre.textContent = text; // 將文字放入 <pre>
            li.appendChild(pre); // 將 <pre> 加入到 <li>
            dataList.appendChild(li);
          });
        } else {
          const li = document.createElement('li');
          li.textContent = '沒有找到指定的元素';
          dataList.appendChild(li);
        }
      });
    });
  });
  
  function extractTextFromTarget() {
      const containers = document.querySelectorAll('.index-mod__order-container___1ur4-.js-order-container');
      const texts = [];
  
      containers.forEach(container => {
          const targetElement = container.querySelector('.sol-mod__no-br___2tKy9');
          if (targetElement) {
              texts.push(targetElement.textContent.trim());
          }
      });
  
      return texts;
  }