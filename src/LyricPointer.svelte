<script lang="ts">
    export let ptr = "";
</script>

<div class="lyr-ptr-holder">
    <div class="lyr-pointer{ptr == "#lyrics-pointer" ? ' pactive' : ''}" id="lyr-ptr">▶</div>
</div>

<style>
    .lyr-ptr-holder {
        position: relative;
        width: 32px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>