<script lang="ts">
    import { onMount } from 'svelte';
    import { PuzStrings } from '../types/puzzle.type';
    import { clueData, puzStrings, show } from '../stores/puzzle';
    import { keyInput } from '../utils/keyInput';

    import ClueDisplay from '../components/ClueDisplay.svelte';
    import Grid from '../components/Grid.svelte';
    import ButtonBar from '../components/ButtonBar.svelte';
    import ClueList from '../components/ClueList.svelte';

    let inputTextbox;
    onMount(() => {
        keyInput.setKeyInput(inputTextbox);
    });

    const showLoad = () => {
        $show = 'load';
    };
</script>

<section>
    <h1>
        {$puzStrings.title}{#if $puzStrings.author !== ''}&nbsp;by&nbsp;{$puzStrings.author}{/if}
        <button on:click={showLoad}>Load</button>
    </h1>
    <ClueDisplay />
    <input type="text" maxlength="1" bind:this={inputTextbox}>
    <Grid acceptKeyInput={keyInput.acceptKeyInput} />
    <ButtonBar />
    <h2>Across</h2>
    <ClueList direction='across' clueData={$clueData.across} acceptKeyInput={keyInput.acceptKeyInput} />
    <h2>Down</h2>
    <ClueList direction='down' clueData={$clueData.down} acceptKeyInput={keyInput.acceptKeyInput} />
</section>

<style lang="scss">
    h1 {
        width: 50%;
        position: relative;
        margin: 0 auto;

        button {
            position: absolute;
            right: 0;
            font-size: 50%;
            margin: 0.5em 0 0 0;
            padding: 0.1em 0.25em;
        }
    }

    input {
        display: block;
        width: 40px;
        position: absolute;
        top: -1000px;
    }
</style>
