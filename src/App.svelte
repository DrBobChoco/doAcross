<script lang="ts">
    import { PuzStrings } from './types/puzzle.type';
    import { puzStrings, clueData } from './stores/puzzle';
    import FileLoad from './components/FileLoad.svelte';
    import ClueDisplay from './components/ClueDisplay.svelte';
    import Grid from './components/Grid.svelte';
    import ClueList from './components/ClueList.svelte';
</script>

<main>
    {#if $puzStrings !== null}
        <h1>{$puzStrings.title}{#if $puzStrings.author !== ''}&nbsp;by&nbsp;{$puzStrings.author}{/if}</h1>
        <ClueDisplay />
        <Grid />
        <h2>Across</h2>
        <ClueList direction='across' clueData={$clueData.across} />
        <h2>Down</h2>
        <ClueList direction='down' clueData={$clueData.down} />
    {:else}
        <h1>Werd</h1>
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
