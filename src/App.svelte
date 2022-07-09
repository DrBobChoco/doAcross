<script lang="ts">
    import { puzStrings, show } from './stores/puzzle';
    import Puzzle from './components/Puzzle.svelte';
    import FileLoad from './components/FileLoad.svelte';
</script>

<main>
    {#if $puzStrings !== null && $show === 'puzzle'}
        <Puzzle />
    {:else}
        <FileLoad />
    {/if}
</main>

<style lang="scss">
    main {
        text-align: center;
        padding: 1em;
        margin: 0 auto;
    }
</style>
