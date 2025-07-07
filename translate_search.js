// ==UserScript==
// @name         Auto Translate Chinese to Japanese or English and Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically translate Chinese keywords to Japanese or English and search on Google
// @author       YulongLu
// @match        https://www.google.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    let targetLang = GM_getValue('targetLang', 'en'); // 从存储中读取语言设置，默认英语
    const TRANSLATE_URL = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&dt=t&ie=UTF-8';
    let isProcessing = false;
    let pageHidden = false;

    // 菜单切换语言
    GM_registerMenuCommand('No Translation', () => {
        targetLang = 'none';
        GM_setValue('targetLang', targetLang);
        alert('Translation disabled');
    });
    GM_registerMenuCommand('Translate to Japanese', () => {
        targetLang = 'ja';
        GM_setValue('targetLang', targetLang);
        alert('Translation set to Japanese');
    });
    GM_registerMenuCommand('Translate to English', () => {
        targetLang = 'en';
        GM_setValue('targetLang', targetLang);
        alert('Translation set to English');
    });

    // 检查是否包含中文
    function containsChinese(text) {
        return text && /[一-龥]/.test(text);
    }

    // 显示页面
    function showPage() {
        if (pageHidden) {
            document.documentElement.style.display = '';
            pageHidden = false;
        }
    }

    // 执行搜索跳转
    function performSearch(text) {
        const newUrl = new URL('https://www.google.com/search');
        newUrl.searchParams.set('q', text);
        
        const currentParams = new URLSearchParams(window.location.search);
        for (const [key, value] of currentParams.entries()) {
            if (key !== 'q' && key !== 'oq') {
                newUrl.searchParams.set(key, value);
            }
        }
        window.location.replace(newUrl.toString());
    }

    // 处理搜索请求
    function handleSearch(text) {
        if (isProcessing) return;

        if (!containsChinese(text) || targetLang === 'none') {
            showPage();
            return;
        }

        isProcessing = true;
        
        // 超时保护，防止页面一直空白
        const timeout = setTimeout(() => {
            showPage();
            isProcessing = false;
        }, 5000);

        translateToLanguage(text, targetLang, (translatedText) => {
            clearTimeout(timeout);
            if (translatedText && translatedText !== text) {
                performSearch(translatedText);
            } else {
                showPage(); // 翻译失败或结果相同，显示原页面
            }
            isProcessing = false;
        });
    }

    // 翻译函数
    function translateToLanguage(text, lang, callback) {
        const url = `${TRANSLATE_URL}&tl=${lang}&q=${encodeURIComponent(text)}`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            timeout: 4000,
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    const translated = result && result[0] && result[0][0] && result[0][0][0];
                    callback(translated || text);
                } catch (err) {
                    callback(text);
                }
            },
            onerror: () => callback(text),
            ontimeout: () => callback(text)
        });
    }

    // --- Main Execution ---

    // 1. 立即检查URL
    const query = new URLSearchParams(window.location.search).get('q');
    if (containsChinese(query) && targetLang !== 'none') {
        // 如果需要翻译，立即隐藏页面防止闪烁
        document.documentElement.style.display = 'none';
        pageHidden = true;
        handleSearch(query);
    }

    // 2. 监听表单提交
    window.addEventListener('submit', function(e) {
        const form = e.target;
        if (form && form.action.includes('/search')) {
            const input = form.querySelector('input[name="q"]');
            const text = input ? input.value : null;
            if (containsChinese(text) && targetLang !== 'none') {
                e.preventDefault();
                e.stopPropagation();
                handleSearch(text);
            }
        }
    }, true); // 使用捕获阶段提前拦截

})();
