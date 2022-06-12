<script lang="ts">
    import { PuzStrings } from './types/puzzle.type';
    import { puzStrings } from './stores/puzzle';
    import FileLoad from './components/FileLoad.svelte';
    import Grid from './components/Grid.svelte';
</script>

<main>
    {#if $puzStrings !== null}
        <h1>{$puzStrings.title}{#if $puzStrings.author !== ''}&nbsp;by&nbsp;{$puzStrings.author}{/if}</h1>
        <Grid />
    {:else}
        <h1>Werd</h1>
        <FileLoad />
    {/if}
</main>

<style lang="scss">
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;

        @media (min-width: 640px) {
            max-width: none;
        }
    }
</style>
