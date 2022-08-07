export class Linereader {
    _lines: string[];
    _ctr: number;
    _max: number;

    constructor(lines: string[]) {
        this._ctr = 0;
        this._lines = lines;
        this._max = lines.length - 1;
    }

    public get eof() {
        return this._ctr >= this._max;
    }

    public get nextLine() {
        return this._lines[this._ctr];
    }

    public read(lines: number): string[] {
        const out = this._lines.slice(this._ctr, this._ctr + lines);
        this._ctr += lines;
        return out;
    }

    public readLine() {
        return this.read(1)[0];
    }

    readIf(delegate: (s: string) => boolean, lines: number) {
        if (delegate(this.nextLine)) {
            return this.read(lines);
        }
    }

    readLineIf(str: string) {
        const res = this.readIf((s) => s === str, 1);
        if (res) return res[0];
    }

    readAll(): string[] {
        return this.read(this._max - this._ctr);
    }

    readUntilTrue(comparator: (line: string) => boolean): string | string[] | undefined {
        let lines = new Array<string>();
        const prevCtr = this._ctr;

        while (!this.eof) {
            let line = this.nextLine;
            if (comparator(line)) return lines;

            line = this.readLine();

            lines = [...lines, line];
        }
        this._ctr = prevCtr;
    }

    readUntil(input: string): string | string[] | undefined {
        return this.readUntilTrue((w) => w === input);
    }
}
