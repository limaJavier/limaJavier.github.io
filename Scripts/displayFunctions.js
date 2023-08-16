import { levenshteinDistance } from "./levensthein.js";
import structure from "../structure.json" assert { type: "json"};

const body = document.querySelector("body");

export function getHtmlList(dictionary) {
    let html = "";
    let currentLetter;
    for (let key in dictionary) {
        if (key[0] != currentLetter) {
            html +=
                `
                    </ul>
                </div>
                <div class="word-list">
                    <h3>${key[0]}</h3>
                    <ul>
                        <li class="word">${key}</li>
            `;
            currentLetter = key[0];
        }
        else {
            html += `<li class="word">${key}</li>`;
        }
    }
    html += `</ul></div>`;
    return html;
}

export function getWordDetails(word, wordData) {
    // Displaying data
    let html = `<h1>${word}</h1><div id="definition">`;
    wordData.forEach((data) => {
        let innerHtml =
            `
     <div class="definition-container">
         <p><strong>Bedeutung: </strong>${data.description}</p>
     `;

        if (data.synonyms.length != 0) innerHtml += `<p><strong>Synonyme: </strong>${data.synonyms}</p>`

        if (data.sWords.length != 0) {
            innerHtml += `
         <p><strong>Equivalente en español: </strong>${data.sWords}</p>
         <p><strong>Significado en español: </strong>${data.translation}</p>
         `;
        }
        else {
            innerHtml += `<p><strong>Significado en español: </strong>${data.extra}</p>`
        }

        innerHtml +=
            `
         <img src="${data.image}" alt="image not found">
     </div>
     `;

        html += innerHtml;
    });
    return html += `</div>`;
}

export function getFailedSearch(userInput, dictionary, language) {
    // Displaying data
    body.innerHTML = structure.failedSearch;
    const container = document.querySelector("#failed-search");
    const germanMessage = `Entschuldigung! Das Wort wurde leider nicht gefunden. Meinen Sie:`;
    const spanishMessage = `Lo sentimos, la palabra no fue encontrada. Quiso decir:`;
    container.innerHTML += language ? `<h1>${germanMessage}</h1>` : `<h1>${spanishMessage}</h1>`;
    container.innerHTML += getSuggestions(userInput, dictionary, 3);
}

export function getSpanishResults(userInput, dictionary) {
    body.innerHTML = structure.spanishSearch;
    const container = document.querySelector("#spanish-search");
    let html = `<h1>${userInput}</h1><ul>`;
    dictionary[userInput].forEach((gWord) => {
        html+= `<li class="word">${gWord}</li>`;
    });
    html += `</ul>`;

    container.innerHTML += html;
}

function getSuggestions(userInput, dictionary, maxAmount) {
    const scoredSuggestions = [];
    for (let key in dictionary) scoredSuggestions.push([key, levenshteinDistance(key, userInput)]);

    scoredSuggestions.sort((x, y) => {
        const value1 = x[1];
        const value2 = y[1];
        if (value1 < value2) return -1;
        else if (value1 > value2) return 1;
        else return 0;
    })

    let html = `<ul>`;
    for (let i = 0; i < maxAmount; i++) {
        html += `<li class="word">${scoredSuggestions[i][0]}</li>`
    }
    html += `</ul>`;

    return html;
}