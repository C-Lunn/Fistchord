import { hasChords } from "./chords";

const sectionRe = /\[(?<title>.+)\]/;
type SectionMatch = {
    groups: {
        title: string;
    };
};

type Line = {
    chords?: string;
    lyrics?: string;
    title?: string;
};

type Lyric = {
    lines: Line;
};

const parse = (data: string) => {
    const rawLines = data.split("\n");
    const lines: Line[] = [];

    for (let i = 0; i < rawLines.length; i++) {
        const line = rawLines[i];

        if (sectionRe.test(line)) {
            const {
                groups: { title },
            } = sectionRe.exec(line) as unknown as SectionMatch;
            lines.push({ title: title });
            continue;
        }

        if (hasChords(line)) {
            const lyricLine: Line = { chords: line };
            const nextLine = rawLines[i + 1];
            if (!hasChords(nextLine)) {
                lyricLine.lyrics = nextLine;
                i += 1;
            }
            lines.push(lyricLine);
        }
    }
    return lines;
};

export default parse;
