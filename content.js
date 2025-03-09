// content.js (初始頁面)

function clickAllLogisticsButtons() {
    const buttons = document.querySelectorAll("a, button");  // 找到所有可能的按鈕
    const viewtext = ["查看物流","查看物料"];
    buttons.forEach(button => {

        if (viewtext.includes(button.textContent.trim())) {
            button.click();
        }
    });
}

clickAllLogisticsButtons();