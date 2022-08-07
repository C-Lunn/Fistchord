<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const deCamel = (s: string) =>
        s.replaceAll(/([A-Z])/g, "-$&").toLowerCase();

    const mekStyle = (style: Partial<CSSStyleDeclaration>) =>
        style &&
        Object.entries(style)
            .map(([key, val]) => `${deCamel(key)}: ${val};`)
            .join(" ");

    type Option = {
        id: string;
        label: string;
        value: string | number | boolean;
        className?: string;
        style?: Partial<CSSStyleDeclaration>;
    };

    export let id: string = "";
    export let options: Option[] = [];
    export let value: string | number | boolean;

    export function equalwidth(node, data) {
        const r = node.getBoundingClientRect();

        if (r.width > data.max) {
            for (let n of data.nodes) {
                n.style.width = r.width + "px";
            }
            data.max = r.width;
        } else {
            node.style.width = data.max + "px";
        }
        data.nodes.push(node);
    }

    const eqsize = {
        nodes: [],
        max: 0
    }

    const dispatch = createEventDispatcher();
</script>

<div {id} class="ui-select">
    {#each options as option (option.id)}
        <div
            id={option.id}
            class="ui-select__option{option.value === value ? ' selected' : ''}"
            style={mekStyle(option.style)}
            on:click={(e) => dispatch("change", { detail: option.value })}
            use:equalwidth={eqsize}
        >
            {option.label}
        </div>
    {/each}
</div>

<style>
    .ui-select {
        display: flex;
        align-items: center;
        gap: 0.125rem;
        justify-content: center;
        user-select: none;
    }

    .ui-select__option {
        border: 1px solid transparent;
        border-radius: 0.25rem;
        display: grid;
        line-height: 1rem;
        min-height: 3rem;
        min-width: 1.5rem;
        padding: 0 0.25rem;
        place-items: center;
        color: darkgrey;
    }

    .selected {
        border-color: white;
        border-width: 3px;
        color: rgb(240, 240, 240);
    }

    .ui-select__option:hover {
        background-color: #fff3;
    }
</style>
