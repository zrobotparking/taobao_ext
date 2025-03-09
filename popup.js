// popup.js

document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: extractData,
      }).then((result) => {
        const data = result[0]?.result;
        const dataList = document.getElementById('data-list');
  
        console.log("Extracted Data:", data); // 调试
  
        if (data && data.length > 0) {
          const uniqueProductNames = new Set();
          data.forEach(({ productName, isValid, logisticsText }) => {
            if (!uniqueProductNames.has(productName)) {
              uniqueProductNames.add(productName);
              const li = document.createElement('li');
  
              const productNameSpan = document.createElement('span');
              productNameSpan.classList.add('product-name');
              productNameSpan.textContent = productName;
              li.appendChild(productNameSpan);
  
              const statusSpan = document.createElement('span');
              statusSpan.classList.add('status');
              statusSpan.textContent = isValid ? 'valid' : 'invalid';
              if (!isValid) {
                statusSpan.classList.add('invalid');
              }
              li.appendChild(statusSpan);
  
              const logisticsSpan = document.createElement('span');
              logisticsSpan.classList.add('logistics-info');
              logisticsSpan.textContent = logisticsText || '';
              li.appendChild(logisticsSpan);
  
              dataList.appendChild(li);
            }
          });
        } else {
          const li = document.createElement('li');
          li.textContent = '沒有找到指定的元素';
          dataList.appendChild(li);
        }
      });
    });
  });
  
  async function extractData() {
    const containers = document.querySelectorAll('.index-mod__order-container___1ur4-.js-order-container');
    const data = [];
    console.log("Containers found:", containers);
  
    // 1. 触发所有 "查看物流" 链接的 mouseover 事件
      for (const container of containers) {
      try {
        const tbody = container.querySelector('.bought-wrapper-mod__head___2vnqo + tbody');
        if (tbody) {
          const logisticsLink = tbody.querySelector('a[href*="pc-trade-logistics"]');
           const viewtext = ["查看物流", "查看物料"];
          if (logisticsLink && viewtext.includes(logisticsLink.textContent.trim())) {
            const event = new MouseEvent('mouseover', {
              bubbles: true,
              cancelable: true,
              view: window,
            });
            logisticsLink.dispatchEvent(event);
          }
        }
      } catch (error) {
        console.error("Error triggering mouseover:", error);
      }
    }
  
    // 2. 等待所有悬浮框出现
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 等待 1 秒
  
    // 3. 获取所有悬浮框
    const tooltips = document.querySelectorAll('.logistics-info-mod__header___1z4Ea');
    console.log("Tooltips found:", tooltips);
  
    // 4. 再次遍历容器，匹配悬浮框
    let tooltipIndex = 0;
    for (const container of containers) {
      let productName = '找不到商品名称';
      let isValid = false;
      let logisticsText = '';
  
      try {
        const tbody = container.querySelector('.bought-wrapper-mod__head___2vnqo + tbody');
        if (tbody) {
          const productNameElement = tbody.querySelector('.sol-mod__no-br___2tKy9');
          if (productNameElement) {
            productName = productNameElement.textContent.trim();
          }
  
          const logisticsLink = tbody.querySelector('a[href*="pc-trade-logistics"]');
           const viewtext = ["查看物流", "查看物料"];
          if (logisticsLink && viewtext.includes(logisticsLink.textContent.trim())) {
            isValid = true;
  
            // 从 tooltips 数组中取出对应的悬浮框
            if (tooltipIndex < tooltips.length) {
              logisticsText = tooltips[tooltipIndex].textContent.trim();
              tooltipIndex++; // 增加索引，指向下一个悬浮框
            }
          }
        }
      } catch (error) {
        console.error("Error extracting data:", error);
      }
  
      data.push({ productName, isValid, logisticsText });
    }
  
    return data;
  }