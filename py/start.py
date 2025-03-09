import requests
from bs4 import BeautifulSoup
import json
import re

# 淘寶已買到寶貝頁面的 URL (您需要替換成實際的 URL)
# 因為涉及到登入後的資料, 這裡需要使用 cookie
# url = "https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm"  # 範例，非真實 URL

# 使用 cookie
cookies = {
    't': '***',  # 填入您的Cookie 的 t 值
    'cookie2': '***', # 填入您的 cookie2
     '_tb_token_': '***' # 填入您的 _tb_token_
}

# 模擬瀏覽器發送請求
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
     "Referer": "https://buyertrade.taobao.com/"
}

# 假設這是您已經獲取的頁面 HTML 內容
# 因為需要cookie, 這裡改成直接讀取檔案
# response = requests.get(url, cookies=cookies, headers=headers)
# html_content = response.text

with open("./page/view-source_https___buyertrade.taobao.com_trade_itemlist_list_bought_items.htm_spm=a21bo.jianhua_a.bought.1.c3ca2a89HyAnmC&route_to=tm1.html", "r", encoding="gbk") as f:  # 使用 gbk 編碼讀取
    html_content = f.read()

soup = BeautifulSoup(html_content, 'html.parser')

# 找到所有「查看物流」連結
view_logistic_links = soup.find_all('a', id='viewLogistic')
# print(view_logistic_links)

for link in view_logistic_links:
    # 獲取 data-url 屬性
    data_url = link.get('data-url')
    if data_url:

        # 如果是相對路徑，則組合成完整 URL
        if data_url.startswith('/'):
            # 用https://trade.taobao.com 也可以
            base_url = "https://buyertrade.taobao.com"  # 根據實際情況調整
            full_url = base_url + data_url
        else:
            full_url = data_url

        print(f"Requesting URL: {full_url}")
        # 發送請求獲取物流資訊 (這裡可能需要處理 JSON 格式的響應)
        try:
            # 這裡可能需要cookie
            logistics_response = requests.get(full_url, cookies=cookies, headers=headers)
            logistics_response.raise_for_status()  # 檢查是否有錯誤

            # 嘗試解析 JSON 數據
            try:
                logistics_data = logistics_response.json()
                print("Logistics Data (JSON):")
                print(json.dumps(logistics_data, indent=2, ensure_ascii=False))  # 美化輸出

                # 提取關鍵物流資訊 (根據 JSON 結構調整)
                # 這部分需要根據實際返回的 JSON 結構來編寫，下面只是一個非常簡化的範例
                if logistics_data and 'data' in logistics_data:
                    if 'transitSteps' in logistics_data['data']:
                        for step in logistics_data['data']['transitSteps']:
                            print(f"  - 時間: {step.get('time', 'N/A')}")
                            print(f"    狀態: {step.get('statusDesc', 'N/A')}")

                    if 'logisticsName' in logistics_data['data']:
                         print(f"物流公司: {logistics_data['data'].get('logisticsName','')}")
                    if 'formatedBillId' in logistics_data['data']:
                         print(f"物流單號: {logistics_data['data'].get('formatedBillId', '')}")
                    if 'latestTrace' in logistics_data['data']:
                         print(f"最新狀態: {logistics_data['data']['latestTrace'].get('statusDesc','')}")

            except json.JSONDecodeError:
                print("Response is not valid JSON.")
                print("Response Text:", logistics_response.text)  # 輸出原始響應內容

        except requests.exceptions.RequestException as e:
            print(f"Error fetching logistics data: {e}")