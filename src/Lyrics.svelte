<script lang="ts">
    import { onMount } from "svelte";
    import type { Section } from "./util/parser";

    const fontSizes = {
        0: "1em",
        1: "1.2em",
        2: "1.5em",
        3: "2.5em",
        4: "3.5em",
    };

    export let fontSize = 3;
    export let showChords = true;
    export let lyrics: Section[] = [];
    export let ptr = "";
    export let KEYS;
    export let capo;
    let noscroll = false;
    let sectionPtr = 0;

    const handleKeydown = (e: KeyboardEvent) => {
        const el = e.target;
        if (el instanceof Element && ptr == "#lyrics-pointer" && !noscroll) {
            for (const dir of ["down", "up"]) {
                if (KEYS[dir].includes(e.key)) {
                    e.preventDefault();
                    e.stopPropagation();
                    const next = dir === "down" ? 1 : -1;
                    sectionPtr =
                        Math.min(lyrics.length-1, Math.max(0, (sectionPtr + next)));
                }
            }

            window.setTimeout(() => {
                const currentSection = el.querySelector(".active");
                if (currentSection) {
                    currentSection.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                }
            });

            noscroll = true;
        }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        if (noscroll) {
            noscroll = false;
            e.preventDefault();
            e.stopPropagation();
        }
    }

    onMount(() => {
        window.setTimeout(() => {
            const currentSection = document
                .getElementById("lyrics")
                .querySelector(".active");
            if (currentSection) {
                currentSection.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }
        });
    });

    $: fontSize, wst();

    function wst() {
        setTimeout(() => {
            const currentSection = document
                .getElementById("lyrics")
                .querySelector(".active");
            if (currentSection) {
                currentSection.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }
        }, 100);
    }

</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyUp}/>

<div
    id="lyrics"
    tabindex="0"
    style={`font-size: ${fontSizes[fontSize]}`}
    on:keydown={handleKeydown}
>
    <div class="filler" />
    {#each Object.entries(lyrics) as [id, section]}
        <div class="section" class:active={Number(id) === sectionPtr}>
            {#if section.title !== undefined}
                <h3 class="title">[{section.title}]</h3>
            {/if}

            {#if section.lines}
                {#each Object.entries(section.lines) as [lineId, line]}
                    {#if showChords && line.chords !== undefined}
                        <pre class="chords">{line.chords.toString()}</pre>
                    {/if}

                    {#if line.lyrics !== undefined}
                        <p class="lyrics">{line.lyrics}</p>
                    {/if}
                {/each}
            {/if}
        </div>
    {/each}
    <div class="filler" />
</div>

<style>
    #lyrics {
        background-color: rgb(238, 238, 238);
        display: grid;
        gap: 1em;
        overflow-y: hidden;
        padding: 2rem;
        transition: font-size 200ms ease-in-out;
    }

    .filler {
        height: 50vh;
    }

    .title {
        line-height: 2em;
        margin: 0 0 1em;
        font-weight: 400;
    }

    .section {
        opacity: 0.5;
    }

    .section.active {
        opacity: 1;
        position: relative;
        font-weight: 500;
    }

    .chords {
        margin: -0.7em 0 0 0;
        font-size: 0.9em;
        color: rgb(61, 99, 86);
        letter-spacing: 3px;
    }

    .lyrics {
        margin: 0 0 1.2em;
    }
</style>
