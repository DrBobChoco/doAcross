<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
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

    onDestroy(() => {
        keyInput.endKeyInput();
    });

    const showLoad = () => {
        $show = 'load';
    };
</script>

<section class="puzzle">
    <h1>
        {$puzStrings.title}{#if $puzStrings.author !== ''}&nbsp;by&nbsp;{$puzStrings.author}{/if}
        <button on:click={showLoad}>Load</button>
    </h1>
    <ClueDisplay />
    <section>
        <section>
            <input type="text" maxlength="1" bind:this={inputTextbox}>
            <Grid acceptKeyInput={keyInput.acceptKeyInput} />
            <ButtonBar />
        </section>
        <section>
            <h2>Across</h2>
            <ClueList direction='across' clueData={$clueData.across} acceptKeyInput={keyInput.acceptKeyInput} />
            <h2>Down</h2>
            <ClueList direction='down' clueData={$clueData.down} acceptKeyInput={keyInput.acceptKeyInput} />
        </section>
    </section>
</section>

<style lang="scss">
    section.puzzle {
        width: 100%;
        margin-left: auto;
        margin-right: auto;

        h1 {
            width: 100%;
            position: relative;
            margin: 0 auto 0.5em auto;

            button {
                position: absolute;
                right: 0;
                font-size: 50%;
                font-weight: bold;
                margin: 0.5em 0 0 0;
                padding: 0.1em 0.25em;
            }
        }

        @media (min-aspect-ratio: 1/1) and (min-width: 500px) {
            & > section {
                display: flex;
                column-gap: 0.25rem;
            }
        }
    }


    input {
        display: block;
        width: 40px;
        position: fixed;
        top: 0;
        left: -1000px;
    }
</style>
