# Taobao Order Logistics Extractor

This Chrome extension extracts product names and logistics information from the Taobao order page (https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm). It identifies valid orders (those with a "查看物流" - "View Logistics" - link) and displays a summary of the product names and the first 30 characters of their logistics status.

## Features

*   **Extracts Product Names:** Retrieves the names of all products within each order.
*   **Checks Order Validity:** Determines if an order is "valid" by checking for the presence of the "查看物流" (View Logistics) link.
*   **Extracts Logistics Information:**  Triggers the logistics tooltip by simulating a mouseover on the "查看物流" link and extracts the text content of the tooltip.
*   **Displays Summary:**  Presents a clean list in the extension popup, showing the product name, validity status (valid/invalid), and a truncated version of the logistics information (first 30 characters).
*   **Handles Asynchronous Loading:** Uses a `MutationObserver` to correctly handle the dynamically loaded logistics information, ensuring accurate data extraction.
*   **Duplicate Product Handling:** Prevents displaying duplicate product names.
*   **Error Handling:** Displays a "No elements found" message if no relevant orders are found on the page.
*   **Timeout for Tooltip**: Includes a timeout mechanism for the tooltip display to avoid indefinite waiting.

## Installation

1.  **Clone or Download:** Clone this repository to your local machine or download the ZIP file and extract it.
    ```bash
    git clone <repository_url>  # Replace <repository_url> with the actual URL
    ```
2.  **Open Chrome Extensions:** In your Google Chrome browser, go to `chrome://extensions/`.
3.  **Enable Developer Mode:** Toggle the "Developer mode" switch in the top right corner to the ON position.
4.  **Load Unpacked Extension:** Click the "Load unpacked" button.
5.  **Select Project Directory:** Navigate to the directory where you cloned or extracted the project, and select it.

## Usage

1.  **Navigate to Taobao Orders Page:** Open the Taobao order page in your browser:  `https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm`.  Make sure you are logged in to your Taobao account.
2.  **Open the Extension Popup:** Click the extension's icon in the Chrome toolbar (it will likely appear as a puzzle piece or a custom icon if you've added one).
3.  **View Extracted Data:** The popup will display a list of product names, their validity status, and the beginning of their logistics information.

## Troubleshooting

*   **No data is displayed:**
    *   Make sure you are on the correct Taobao order page (`https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm`).
    *   Ensure you are logged in to your Taobao account.
    *   Inspect the page's HTML structure (using the browser's developer tools) to see if Taobao has changed the class names or element structure.  If so, the CSS selectors in `popup.js` will need to be updated.
    *   Check the browser's developer console (right-click on the page, select "Inspect" or "Inspect Element", and go to the "Console" tab) for any error messages.  These messages are crucial for debugging.
*    **The logistics information does not showing up.**
	* There's a built in timeout. If the tooltip hasn't appeared in 5 seconds, the program will move on. Try reloading the page.
	* There might be changes to the webpage's element.

*   **The extension doesn't load:**
    *   Make sure "Developer mode" is enabled in `chrome://extensions/`.
    *   Verify that the `manifest.json` file is present and correctly formatted.
    *   Check for any errors in the Chrome extensions page.

## Project Structure

*   **`manifest.json`:**  The manifest file, which provides essential information about the extension to Chrome (name, version, permissions, etc.).
*   **`popup.html`:** The HTML structure for the extension's popup window.
*   **`popup.js`:**  The JavaScript code that handles the data extraction and display logic.
*   **`popup.css`:**  (Optional)  Styles for the popup.

## Contributing

If you'd like to contribute to this project, you can:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b my-new-feature
    ```
3.  **Make your changes** and commit them with descriptive commit messages.
4.  **Push your branch** to your forked repository:
    ```bash
    git push origin my-new-feature
    ```
5.  **Create a pull request** from your branch to the main repository's `main` branch.

Please follow good coding practices, include comments, and test your changes thoroughly.

## License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.  (You should create a `LICENSE` file in your project and paste the MIT license text into it if you choose this license.  You can use other licenses as well).