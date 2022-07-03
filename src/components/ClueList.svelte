<script lang="ts">
    import { ClueData } from '../types/puzzle.type';
    import { currentClue, currentCell, cellData } from '../stores/puzzle';

    export let direction: 'across'|'down';
    export let clueData: ClueData[];
    export let acceptKeyInput;

    const onClick = (clueNum) => {
        $currentClue = [clueNum, direction];
        const currentCellData = $cellData.flat().filter(
            (cd) => cd[direction] === clueNum && (cd.starts === direction || (cd.starts !== null && cd.across === cd.down))
        )[0];
        $currentCell = [currentCellData.rowNum, currentCellData.colNum];
        acceptKeyInput();
    };
</script>

<ul>
    {#each clueData as clue}
        {#if clue}
            <li
                class:hilight={$currentClue?.[0] === clue.number && $currentClue?.[1] === direction}
                on:click={() => onClick(clue.number)}
            >
                <span>{clue.number}</span>
                {clue.clue}
            </li>
        {/if}
    {/each}
</ul>

<style lang="scss">
    ul {
        display: inline-block;
        list-style-type: none;
        margin-top: 0;
        padding-left: 0;
        text-align: left;

        li {
            cursor: default;
            padding: 4px;
            border-left: 4px solid #fff;

            &.hilight {
                background-color: var(--c-hilight);
                border-left-color: var(--c-selected);
            }

            span {
                font-weight: bold;
            }
        }
    }
</style>
