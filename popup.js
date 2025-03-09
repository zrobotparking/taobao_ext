// popup.js

document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: extractData,
      }).then((result) => {
        const data = result[0]?.result;
        const dataList = document.getElementById('data-list');
  
        console.log("Extracted Data:", data); // 调试：查看提取到的数据
  
        if (data && data.length > 0) {
          const uniqueProductNames = new Set();
          data.forEach(({ productName, isValid }) => {
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
                statusSpan.classList.add('invalid'); // 添加 invalid 类
              }
              li.appendChild(statusSpan);
  
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
  
  function extractData() {
    const containers = document.querySelectorAll('.index-mod__order-container___1ur4-.js-order-container');
    const data = [];
  
    console.log("Containers found:", containers);
  
    containers.forEach(container => {
      let productName = '找不到商品名称';
      let isValid = false;
  
      try {
        // 找到包含商品名称和“查看物流”的 tbody
        const tbody = container.querySelector('.bought-wrapper-mod__head___2vnqo + tbody'); // 使用相邻兄弟选择器
        console.log("tbody Element:", tbody);
  
        if (tbody) {
          // 1. 提取商品名称 (在 tbody 内)
          const productNameElement = tbody.querySelector('.sol-mod__no-br___2tKy9');
          console.log("Product Name Element:", productNameElement);
  
          if (productNameElement) {
            productName = productNameElement.textContent.trim();
            console.log("Product Name:", productName);
  
            // 2. 检查是否存在 "查看物流" (在 tbody 内)
            const logisticsLink = tbody.querySelector('a[href*="pc-trade-logistics"]'); // 更精确的选择器
            console.log("Logistics Link:", logisticsLink);
              const viewtext = ["查看物流", "查看物料"];
              if(logisticsLink && viewtext.includes(logisticsLink.textContent.trim())){
                  isValid = true;
              }
            console.log("Is Valid:", isValid);
          }
        } else {
          console.warn("tbody not found in container:", container);
        }
      } catch (error) {
        console.error("Error extracting data:", error);
      }
  
      data.push({ productName, isValid });
    });
  
    return data;
  }