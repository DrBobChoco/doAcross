<script lang="ts">
    import { clueData, currentClue, cellData } from '../stores/puzzle';

    let buttonsDisabled = true;
    $: if($currentClue) {
        buttonsDisabled = !$clueData[$currentClue[1]][$currentClue[0]].hasAnswer;
    }

    const check = () => {
        if($currentClue) {
            const currentCells = $cellData.flat().filter(cd => cd[$currentClue[1]] === $currentClue[0]);

            currentCells.forEach(c => {
                if(c.content !== c.solution) {
                    $cellData[c.rowNum][c.colNum].content = ' ';
                }
            });
        }
    };

    const reveal = () => {
        if($currentClue) {
            const currentCells = $cellData.flat().filter(cd => cd[$currentClue[1]] === $currentClue[0]);

            currentCells.forEach(c => $cellData[c.rowNum][c.colNum].content = c.solution);
        }
    };
</script>

<div>
    <button disabled={buttonsDisabled} on:click={check}>Check</button>
    <button disabled={buttonsDisabled} on:click={reveal}>Reveal</button>
</div>

<style lang="scss">
    div {
        display: flex;
        justify-content: flex-start;
        gap: 0.75em;
        margin: 0.75em 0.75em 0.75em auto;

        @media (min-aspect-ratio: 1/1) and (min-width: 500px) {
            button {
                font-size: 75%;
            }
        }
    }
</style>
