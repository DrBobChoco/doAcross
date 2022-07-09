<script lang="ts">
    import { puzStrings, show } from './stores/puzzle';
    import Toast from './components/Toast.svelte';
    import Puzzle from './components/Puzzle.svelte';
    import Load from './components/Load.svelte';
</script>

<Toast />
<main>
    {#if $puzStrings !== null && $show === 'puzzle'}
        <Puzzle />
    {:else}
        <Load />
    {/if}
</main>

<style lang="scss">
    main {
        text-align: center;
        padding: 1em;
        margin: 0 auto;
    }
</style>
