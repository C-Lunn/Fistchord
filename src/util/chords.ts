const chordRe = /^(?:\s*[CDEFGAB](?:#{1,2}|b{1,2})?(?:m?)?(?:maj7?|min7?|sus2?|sus4?|7?|5?|add9?)?\s*)+$/;
export const notes = ["C", "C#", "D", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const isChord = (word: string) => {
    return chordRe.test(word);
};

export const hasChords = (line: string) => {
    return line.split(" ").filter((s) => isChord(s)).length > 0;
};
