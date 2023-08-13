export const Trie = (() => {
    const _insert = (node, word) => {
        let currentNode = node;
        for (let i = 0; i < word.length; i++) {

            // Calculating the index of the current character (english alphabet) according to the ASCII code
            const letterIndex = word.charCodeAt(i) - "a".charCodeAt(0);

            if (currentNode.children[letterIndex] == undefined) {
                let newNode = new TrieNode();
                currentNode.children[letterIndex] = newNode;
            }

            // Moving downwards in the tree
            currentNode = currentNode.children[letterIndex];

            // Adding word into the node record ("words")
            currentNode.words.push(word)
        }
    };
    const _search = (node, word) => {
        let currentNode = node;
        for (let i = 0; i < word.length; i++) {

            // Calculating the index of the current character (english alphabet) according to the ASCII code
            const letterIndex = word.charCodeAt(i) - "a".charCodeAt(0);

            // If the current character isn't contained then the word is not contained in the trie
            if (currentNode.children[letterIndex] == undefined) return undefined;

            // Moving downwards in the tree
            currentNode = currentNode.children[letterIndex];
        }
        return currentNode;
    };
    class Trie {
        constructor() {
            this.Root = new TrieNode();
        }

        Insert(word) { _insert(this.Root, word) };
        Search(word) {
            const suggestions = [];
            const targetNode = _search(this.Root, word);

            if (targetNode == undefined) return undefined;

            const maxSuggestionAmmount = 5;
            const suggestionAmmount = (targetNode.words.length < maxSuggestionAmmount) ? targetNode.words.length : maxSuggestionAmmount;

            for (let i = 0; i < suggestionAmmount; i++)
                suggestions.push(targetNode.words[i]);

            return suggestions;
        }
    }
    return Trie
})();

const TrieNode = (() => {
    class TrieNode {
        constructor() {
            this.children = [];
            this.isAWord = false;
            this.words = [];
        }
    }
    return TrieNode
})();