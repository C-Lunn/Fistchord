import { hasChords, notes } from "./chords";
import { Linereader } from "./linereader";

const sectionRe = /\[(?<title>.+)\]/;

const isSection = (s: string) => sectionRe.test(s);

const getSectionTitle = (s: string) => {
    const {
        groups: { title },
    } = sectionRe.exec(s) as unknown as SectionMatch;
    return title;
};

class ChordLine extends Array {
    constructor(){
        super();
    }

    toString(){
        if(this.length == 7) {
            console.log("burger")
        }
        let line = '';
        let line_ptr = 0;
        for(const chord of this){
            line += ' '.repeat(chord.line_offset - line_ptr);
            line_ptr = chord.line_offset + chord.toString().length;
            line += chord.toString();
        }
        return line;
    }

    static fromString(str){
        str = str.replaceAll('#', 'SH');
        let split_str = str.split(/\b/);
        for (let i = 0; i < split_str.length; i++) {
            split_str[i] = split_str[i].replaceAll("SH", "#");
        }
        let line_ptr = 0;
        const line = new ChordLine();
        for(const e of split_str){
            if(e.trim().length != 0){
                line.push(Chord.fromString(e, line_ptr));
            }
            line_ptr += e.length;
        }
        if(line.includes(undefined)) {
            console.log("oh aye summet's gone off ere like")
        }
        return line;
    }

    transpose (steps: number){
        if(isNaN(steps)) return;
        for (const chord of this) {
            chord.transpose(steps);
        }
    }
}

class Chord {
    note: number;
    additional: string;
    line_offset: number;

    constructor(note, additional, line_offset) {
        this.note = note;
        this.additional = additional;
        this.line_offset = line_offset;
    }

    static fromString(str, offset = 0) {
        if(notes.indexOf(str[0]) != -1) {
            let note = notes.indexOf(str[0]);
            if(str[1] == 'b') {
                note -= 1 % notes.length;
                if (note < 0) {
                    note += notes.length;
                }
            } else if(str[1] == '#') {
                note += 1 % notes.length;
            }
            let additional = str.slice(['b', '#'].indexOf(str[1]) != -1 ? 2 : 1);
            return new Chord(note, additional, offset);
        }
    }

    toString() {
        return notes[this.note] + this.additional ?? '';
    }

    transpose(offset) {
        this.note += offset;
        this.note %= notes.length;
        if(this.note < 0) {
            this.note += notes.length;
        }
    }
}

type SectionMatch = {
    groups: {
        title: string;
    };
};

type Line = {
    chords?: ChordLine;
    lyrics?: string;
};

export type Section = {
    title?: string;
    lines?: Line[];
};

const parse = (data: string) => {
    const rawLines = data.split("\n").filter((l) => l.trim() !== "");

    const r = new Linereader(rawLines);

    const sections: Section[] = [];

    while (!r.eof) {
        const section: Section = {};

        if (isSection(r.nextLine)) {
            section.title = getSectionTitle(r.readLine());
            if (isSection(r.nextLine)) {
                sections.push(section);
                continue;
            }
        }

        let stanzaCtr = 0;
        while (stanzaCtr < 8 && !isSection(r.nextLine) && !r.eof) {
            const line: Line = {};

            const text = r.readLine();

            if (hasChords(text)) {
                line.chords = ChordLine.fromString(text);
                line.lyrics = !hasChords(r.nextLine) && !isSection(r.nextLine) ? r.readLine() : "";
            } else {
                line.lyrics = text;
            }
            section.lines = [...(section.lines || []), line];
            stanzaCtr++;
        }
        sections.push(section);
    }

    return sections;
};

function parseUG(text: string) {
    text = text.replaceAll("[tab]", "");
    text = text.replaceAll("[/tab]", "");
    text = text.replaceAll("[ch]", "");
    text = text.replaceAll("[/ch]", "");
    text = text.replaceAll("\r", "");
    return parse(text);
}

export {
    parse,
    parseUG,
};
