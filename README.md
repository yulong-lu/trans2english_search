# Google Search Auto Translator

### Description
This is a Tampermonkey user script designed to streamline your Google search experience. When you search in Chinese, this script automatically translates your keywords into English or Japanese, delivering search results directly in your target language. It helps you break through language barriers to access a wider, more international range of information.

### Core Features
*   **Seamless Auto-Translation**: The script handles the entire "Detect-Translate-Search" process in the background, presenting you directly with the final, translated search results. It effectively eliminates the "flash" of Chinese results before redirecting, providing a truly smooth and seamless search experience.
*   **Flexible Language Switching**: Through the Tampermonkey script menu, you can switch the translation mode at any time to suit your needs:
    *   Translate to English (Default)
    *   Translate to Japanese
    *   No Translation (Easily disable translation when you need to search for the original Chinese terms).
*   **Comprehensive Scenario Support**:
    *   **Search Box Input**: Type Chinese in the Google search box and press Enter. The script will automatically intercept, translate, and execute the new search.
    *   **Address Bar Input**: Access Google directly with a URL containing Chinese search terms. The script will process it automatically and redirect to the translated results page.
*   **Efficient and Stable**: The script runs at `document-start`, ensuring it intercepts the request before the page renders, which maximizes performance and stability. It also includes a built-in timeout to prevent the page from getting stuck in case of network issues.

### How to Use
1.  Ensure you have the **Tampermonkey** extension installed in your browser.
2.  Click "create a new script", then copy the content of translate_search.js to the Editor of Tampermonkey and save it.
3.  Open the Google homepage, click the Tampermonkey extension icon in your browser, and select this script from the menu to see the language options.
4.  Choose "Translate to English," "Translate to Japanese," or "No Translation" based on your needs.
5.  You're now ready to start your cross-language search journey!

This script is especially useful for researchers, developers, students, and anyone who needs to consult foreign-language materials frequently and wants to broaden their access to information.
