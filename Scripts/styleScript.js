export const mainStyle = () => {
    let searchLanguage = true;
    const languageButtons = document.querySelectorAll(".language-btn");

    changeCurrent(languageButtons[0], languageButtons[1]);

    languageButtons.forEach((btn) => btn.addEventListener("click", () => {
        if (btn.value == "deutsche") {
            changeCurrent(languageButtons[0], languageButtons[1]);
            searchLanguage = true;
        }
        else {
            changeCurrent(languageButtons[1], languageButtons[0]);
            searchLanguage = false;
        }
    }));
};

function changeColors(btn1, btn2) {
    btn1.style.backgroundColor = "black";
    btn1.style.color = "white";
    btn2.style.backgroundColor = "white";
    btn2.style.color = "black";
}

function changeCurrent(btn1, btn2){
    btn1.id = "language-current";
    btn2.id = "";
}