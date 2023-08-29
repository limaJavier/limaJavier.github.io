// Code for building dictionaries
// import data from "../Data/data.json" assert { type: "json"};
// import { createDictionary } from "./dataPreprocessor.js";
// createDictionary(data);

import structure from "../structure.json" assert { type: "json"};
import germanDictionary from "../Data/germanDictionary.json" assert {type: "json"};
import spanishDictionary from "../Data/spanishDictionary.json" assert {type: "json"};
import { getHtmlList, getWordDetails, getFailedSearch, getSpanishResults } from "./displayFunctions.js";
import { Trie } from "./trie.js";
import { Caller } from "./caller.js";
import { mainStyle } from "./styleScript.js";

const body = document.querySelector("body");

const germanTrie = new Trie();
const spanishTrie = new Trie();
for (let key in germanDictionary) germanTrie.Insert(key);
for (let key in spanishDictionary) spanishTrie.Insert(key);

executeMain();

function executeMain() {
    body.innerHTML = structure.main;
    mainStyle();
    const nextCaller = new Caller("main", []);

    const searchButton = document.querySelector("#search-btn");
    const languageButtons = document.querySelectorAll(".language-btn");
    const inputText = document.querySelector("input");
    const suggestionContainer = document.querySelector("datalist");
    let searchLanguage = true;

    // Displaying list of words
    const wordsContainer = document.getElementById("words-container");
    wordsContainer.innerHTML = getHtmlList(germanDictionary);

    // Managing events
    const words = document.querySelectorAll(".word");
    words.forEach((word) => word.addEventListener("click", () => executeDetails(nextCaller, word.innerText)));

    languageButtons.forEach((btn) => btn.addEventListener("click", () => {
        if (btn.value == "spanisch") searchLanguage = false;
        else searchLanguage = true;
        searchButton.innerText = searchLanguage ? "suchen" : "buscar";
        inputText.placeholder = searchLanguage ? "tippen Sie das Wort" : "escriba la palabra";
    }));

    inputText.addEventListener("keyup", () => {
        const currentWord = inputText.value.toLowerCase();
        if (currentWord == "") return;

        let suggestions;
        if (searchLanguage) suggestions = germanTrie.Search(currentWord);
        else suggestions = spanishTrie.Search(currentWord);

        if (suggestions == undefined) return;
        suggestionContainer.innerHTML = "";
        suggestions.forEach((suggestion) => {
            suggestionContainer.innerHTML += `<option value="${suggestion}">${suggestion}</option>`;
        });
    });

    inputText.addEventListener("focusout", () => searchButton.value = inputText.value.toLowerCase());
    searchButton.addEventListener("click", () => executeSearch([nextCaller, searchButton.value, searchLanguage]));
}

function executeDetails(caller, word) {
    body.innerHTML = structure.details;

    const container = document.querySelector("#details");
    const wordData = germanDictionary[word];

    container.innerHTML += getWordDetails(word, wordData);

    backEventHandle(caller);
}

function executeSearch(args) {
    // Getting arguments
    const caller = args[0]
    const userInput = args[1]
    const isGerman = args[2];

    if (isGerman) {
        if (germanDictionary[userInput] != undefined) {
            executeDetails(caller, userInput);
        }
        else {
            const nextCaller = new Caller("search", args);

            getFailedSearch(userInput, germanDictionary, isGerman);
            const listedWords = document.querySelectorAll("li");
            listedWords.forEach((word) => word.addEventListener("click", () => executeDetails(nextCaller, word.innerText)))
            backEventHandle(caller);
        }
    }
    else {
        if (spanishDictionary[userInput] != undefined) {
            executeSpanishFound([caller, userInput]);
        }
        else {
            const nextCaller = new Caller("search", args);

            getFailedSearch(userInput, spanishDictionary, isGerman);
            const listedWords = document.querySelectorAll("li");
            listedWords.forEach((word) => word.addEventListener("click", () => executeSearch([nextCaller, word.innerText, false])));
            backEventHandle(caller);
        }
    }
}

function executeSpanishFound(args) {
    // Getting arguments
    const caller = args[0];
    const userInput = args[1];

    const nextCaller = new Caller("spanish", args);

    getSpanishResults(userInput, spanishDictionary);
    const gWords = document.querySelectorAll("li");
    gWords.forEach((word) => word.addEventListener("click", () => executeDetails(nextCaller, word.innerText)));
    backEventHandle(caller);
}

function backEventHandle(caller) {
    const button = document.querySelector(".back-btn");
    if (caller.source == "main") {
        button.addEventListener("click", executeMain);
    }
    else if (caller.source == "search") {
        button.addEventListener("click", () => executeSearch(caller.args));
    }
    else {
        button.addEventListener("click", () => executeSpanishFound(caller.args));
    }
}