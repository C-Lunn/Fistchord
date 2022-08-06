<script lang="ts">
    const fontSizes = {
        0: "1em",
        1: "1.2em",
        2: "1.5em",
        3: "2.5em",
        4: "3.5em",
    };

    export let fontSize = 3;
    export let showChords = true;
    export let lyrics = [];
    export let ptr = "";
    export let KEYS;
    let sectionPtr = 0;

    const handleKeydown = (e: KeyboardEvent) => {
        const el = e.target;
        if (el instanceof Element && ptr == "#lyrics-pointer") {
            for (const dir of ["down", "up"]) {
                if (KEYS[dir].includes(e.key)) {
                    e.preventDefault();
                    e.stopPropagation();
                    const next = dir === "down" ? 1 : -1;
                    sectionPtr = (sectionPtr + next + lyrics.length) % lyrics.length;
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
        }
    };

</script>

<svelte:window on:keydown={handleKeydown}/>

<div
    id="lyrics"
    tabindex="0"
    style={`font-size: ${fontSizes[fontSize]}`}
    on:keydown={handleKeydown}
>
    <div class="filler" />
    {#each Object.entries(lyrics) as [id, lyric]}
        <div class="section" class:active={Number(id) === sectionPtr}>
            {#if lyric.title !== undefined}
                <h3 class="title">[{lyric.title}]</h3>
            {/if}

            {#if showChords && lyric.chords !== undefined}
                <pre class="chords">{lyric.chords}</pre>
            {/if}

            {#if lyric.lyrics !== undefined}
                <p class="lyrics">{lyric.lyrics}</p>
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
    }


    .filler {
        height: 50vh;
    }

    .title {
        white-space: pre;
    }

    .section {
        opacity: 0.5;
    }

    .section.active {
        opacity: 1;
        position: relative;
    }


    .chords {
        margin: -0.7em 0 0 0;
    }
</style>
