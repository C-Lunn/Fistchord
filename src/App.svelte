<script lang="ts">
    import { onMount } from "svelte";
    import LyricPointer from "./LyricPointer.svelte";
    import Sidebar from "./Sidebar.svelte";
    import Lyrics from "./Lyrics.svelte";

    import testLyric from "./assets/hotline-bling.txt?raw";
    import { parse, parseUG } from "./util/parser";
    let lyrics = parse(testLyric);

    interface ZoneObj {
        target: string;
        active: boolean;
        handleFunc: Function;
        state?: any;
    }

    const KEYS = {
        down: ["j", "ArrowDown"],
        up: ["k", "ArrowUp"],
        cycle: ["l", "ArrowRight"],
    };

    async function handleCapo(dir) {
        let st;
        if (dir == "up") {
            zones.capo.state = (zones.capo.state + 1) % 12;
            st = -1;
        } else {
            zones.capo.state = (zones.capo.state - 1) % 12;
            if (zones.capo.state < 0) {
                zones.capo.state = 11;
            }
            st = 1;
        }
        for (const sec of lyrics) {
            for (const line of sec.lines) {
                line.chords?.transpose(st);
            }
        }
        lyrics = lyrics;
    }

    async function handleChords(_) {
        if (zones.chords.state) {
            zones.chords.state = false;
            zones.capo.active = false;
        } else {
            zones.chords.state = true;
            zones.capo.active = true;
        }
    }

    async function handleScroll(direction?) {
        //
    }

    async function handleFont(direction) {
        if (direction == "up") {
            zones.font.state = (zones.font.state + 1) % 5;
        } else {
            zones.font.state = (zones.font.state - 1) % 5;
            if (zones.font.state < 0) {
                zones.font.state = 3;
            }
        }
    }

    const zones: { [z: string]: ZoneObj } = {
        lyrics: {
            target: "#lyrics-pointer",
            active: true,
            handleFunc: handleScroll,
        },
        font: {
            target: "#font-pointer",
            active: true,
            handleFunc: handleFont,
            state: 3,
        },
        chords: {
            target: "#chords-pointer",
            active: true,
            handleFunc: handleChords,
            state: true,
        },
        capo: {
            target: "#capo-pointer",
            active: true,
            handleFunc: handleCapo,
            state: 0,
        },
    };
    let sel = 1;
    const zoneNames = Object.keys(zones);
    let active_ptr_obj: ZoneObj = zones[zoneNames[sel]];

    function nextSelection() {
        do {
            sel = (sel + 1) % zoneNames.length;
        } while (!zones[zoneNames[sel]].active);
        active_ptr_obj = zones[zoneNames[sel]];
    }

    onMount(() => {
        function keylistener(event) {
            // i stole this from stackoverflow
            event = event || window.event;
            let key = event.key || event.which || event.key;

            // check the key pressed and whether there is something to scroll
            for (const dir of ["down", "up"]) {
                if (KEYS[dir].includes(key)) {
                    event.preventDefault();
                    event.stopPropagation();
                    active_ptr_obj.handleFunc(dir);
                    return;
                }
            }
            if (KEYS.cycle.includes(key)) {
                event.preventDefault();
                event.stopPropagation();
                nextSelection();
                return;
            }
        }

        window.addEventListener("keydown", keylistener);

        handleScroll();
    });

    function handleSidebarSelectChange(ev){
        switch(true) {
            case ev.detail.id.startsWith("font"):
                zones.font.state = ev.detail.value;
                break;
            case ev.detail.id.startsWith("chords"):
                zones.chords.state = ev.detail.value;
                break;
            case ev.detail.id.startsWith("capo"):
                handleCapo(ev.detail.dir);  
                break;
        }
    }

    async function handleUGLink(ev) {
        const r = await fetch(`http://localhost:3000/ug?link=${ev.detail.link}`);
        const t = await r.text();
        lyrics = parseUG(t);
    }
</script>

<Sidebar
    id="sidebar"
    showChords={zones.chords.state}
    fontSize={zones.font.state}
    capo={zones.capo.state}
    ptr={active_ptr_obj.target}
    on:sidebarSelectChange={handleSidebarSelectChange}
    on:ugLink={handleUGLink}
/>
<LyricPointer ptr={active_ptr_obj.target} />
<Lyrics
    fontSize={zones.font.state}
    {lyrics}
    showChords={zones.chords.state}
    {KEYS}
    ptr={active_ptr_obj.target}
    capo={zones.capo.state}
/>

<style>
    .verse {
        opacity: 0.5;
        @apply ease-in-out transition-all duration-150 opacity-50;
    }
    .verse.active {
        @apply opacity-100;
    }
</style>
