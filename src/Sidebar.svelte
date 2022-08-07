<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Select from "./Select.svelte";

    export let id = "";
    export let fontSize = 3;
    export let showChords = true;
    export let capo = 0;
    export let ptr = "blah";

    const fontSizes = {
        0: "1em",
        1: "1.2em",
        2: "1.5em",
        3: "2.5em",
        4: "3.5em",
    };

    const fontOptions = [0, 1, 2, 3, 4].map((num) => ({
        id: `font-${num}`,
        value: num,
        label: "A",
        style: {
            fontSize: fontSizes[num],
            fontWeight: "bold",
            paddingLeft: "0px",
            paddingRight: "0px",
        },
    }));

    const dispatch = createEventDispatcher();

    function ge (e: HTMLElement) {
        return (e as HTMLInputElement).value
    }
</script>

<div {id} class="sidebar">
    <div class="section">
        <img src="fclogo.svg" class="logo" alt="FC Logo" />
    </div>
    <div class="section">
        <h2 class="header">
            <div
                class="pointer sidebar-pointer{ptr == '#font-pointer'
                    ? ' pactive'
                    : ''}"
                id="font-pointer"
            >
                ▶
            </div>
            FONT SIZE
        </h2>

        <Select
            options={fontOptions}
            value={fontSize}
            on:change={(e) => dispatch("fontsize", e.detail)}
            on:sidebarSelectChange
        />
    </div>
    <div class="section">
        <h2 class="header">
            <div
                class="pointer sidebar-pointer{ptr == '#chords-pointer'
                    ? ' pactive'
                    : ''}"
                id="chords-pointer"
            >
                ▶
            </div>
            CHORDS
        </h2>
        <Select
            id="chords"
            options={[
                {
                    id: "chords-true",
                    value: true,
                    label: "ON",
                    style: {
                        fontWeight: "bold",
                        fontSize: "2.5em",
                        paddingLeft: "0px",
                        paddingRight: "0px",
                        paddingTop: "7px",
                        paddingBottom: "7px",
                    },
                },
                {
                    id: "chords-false",
                    value: false,
                    label: "OFF",
                    style: {
                        fontWeight: "bold",
                        fontSize: "2.5em",
                        paddingLeft: "15px",
                        paddingRight: "15px",
                        paddingTop: "7px",
                        paddingBottom: "7px",
                    },
                },
            ]}
            value={showChords}
            on:change={(e) => dispatch("chords", e.detail)}
            on:sidebarSelectChange
        />
    </div>
    {#if showChords}
        <div class="section">
            <h2 class="header">
                <div
                    class="pointer sidebar-pointer {ptr == '#capo-pointer'
                        ? ' pactive'
                        : ''}"
                    id="capo-pointer"
                >
                    ▶
                </div>
                CAPO
            </h2>
            <div id="capo-number-holder">
                <div
                    id="capo-down"
                    class="capo-change"
                    on:click={(e) =>
                        dispatch("sidebarSelectChange", {
                            id: "capo",
                            dir: "down",
                        })}
                >
                    -
                </div>
                <div id="capo-number">{capo}</div>
                <div
                    id="capo-up"
                    class="capo-change"
                    on:click={(e) =>
                        dispatch("sidebarSelectChange", {
                            id: "capo",
                            dir: "up",
                        })}
                >
                    +
                </div>
            </div>
        </div>
    {/if}

    <div class="section">
        <h2 class="header">UG LINK</h2>
        <input type="text" id="ug-link" />
        <div
            id="ug-link-button"
            on:click={(e) =>
                dispatch("ugLink", {
                    link: ge(document.getElementById("ug-link")),
                })}
        >
            LOAD
        </div>
    </div>
</div>

<style>
    .sidebar {
        align-content: flex-start;
        background-color: #222;
        color: rgb(240, 240, 240);
        display: grid;
        gap: 6rem;
        padding-top: 4rem;
        user-select: none;
    }

    .section {
        display: grid;
        place-items: center;
        gap: 2rem;
    }

    h2 {
        line-height: 0.15em !important;
    }

    .header {
        font-size: 2.3em;
        font-weight: bold;
        color: rgb(240, 240, 240);
    }

    #capo-number {
        font-size: 6em;
        line-height: 0.8em;
        font-weight: bold;
        color: rgb(240, 240, 240);
        min-width: 98.7px;
        text-align: center;
    }

    .logo {
        width: 80%;
    }

    #capo-number-holder {
        display: grid;
        grid-template-columns: auto auto auto;
        place-items: center;
        gap: 0.5rem;
    }

    .capo-change {
        font-size: 2em;
        color: rgb(150, 150, 150);
        border-radius: 999px;
        border-color: #222;
        border-width: 4px;
        border-style: solid;
        display: grid;
        place-items: center;
        line-height: 0;
        height: 32px;
        width: 32px;
        border-radius: 999px;
    }

    .capo-change:hover {
        color: rgb(240, 240, 240);
        cursor: default;
        background-color: rgb(100, 100, 100);
        border-color: rgb(240, 240, 240);
        border-width: 4px;
        border-style: solid;
    }
</style>
