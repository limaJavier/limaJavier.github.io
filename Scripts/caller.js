export const Caller = (() => {
    class Caller {
        constructor(source, args) {
            this.source = source;
            this.args = args;
        }
    }
    return Caller
})();