// popup.js
document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
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
                    if(!uniqueProductNames.has(productName)){
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
    const logisticsLinks = []; // 存储所有物流链接，稍后用于关闭
    containers.forEach(container => {
        try {
            const tbody = container.querySelector('.bought-wrapper-mod__head___2vnqo + tbody');
            if (tbody) {
                const logisticsLink = tbody.querySelector('a[href*="pc-trade-logistics"]');
                if (logisticsLink) {
                    const viewtext = ["查看物流", "查看物料"];
                    if(logisticsLink && viewtext.includes(logisticsLink.textContent.trim())){
                         logisticsLinks.push(logisticsLink); // 将链接添加到数组中
                        const event = new MouseEvent('mouseover', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        logisticsLink.dispatchEvent(event);
                    }
                }
            }
        } catch (error) {
            console.error("Error triggering mouseover:", error);
        }
    });

    // 2. 等待一段时间，确保所有悬浮框都已显示 (可以根据实际情况调整延时)
    await new Promise(resolve => setTimeout(resolve, 500));

    // 3. 一次性抓取所有悬浮框的内容
    const tooltips = document.querySelectorAll('.logistics-info-mod__header___1z4Ea');
    console.log("Tooltips found:", tooltips);
    const logisticsTexts = Array.from(tooltips).map(tooltip => tooltip.textContent.trim());


    // 4. 再次遍历容器，提取商品名称、isValid，并与物流信息匹配
    let logisticsIndex = 0; // 物流信息索引
    containers.forEach(container => {
      let productName = '找不到商品名称';
      let isValid = false;
      let logisticsText = '';

      try{
        const tbody = container.querySelector('.bought-wrapper-mod__head___2vnqo + tbody');
        if (tbody) {
            const productNameElement = tbody.querySelector('.sol-mod__no-br___2tKy9');
            if (productNameElement) {
                productName = productNameElement.textContent.trim();

                const logisticsLink = tbody.querySelector('a[href*="pc-trade-logistics"]');
                const viewtext = ["查看物流", "查看物料"];
                if(logisticsLink && viewtext.includes(logisticsLink.textContent.trim())){
                    isValid = true;
                }

                if (isValid) {
                  // 从 logisticsTexts 数组中获取对应的物流信息
                  logisticsText = logisticsTexts[logisticsIndex] || '';
                  logisticsIndex++;
                }
            }
        }
      } catch(error){
          console.error("Error extracting data:", error);
      }

      data.push({ productName, isValid, logisticsText });
    });

    // 5. (可选) 关闭所有悬浮框
    logisticsLinks.forEach(link => {
        const event = new MouseEvent('mouseout', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        link.dispatchEvent(event);
    });

    return data;
}