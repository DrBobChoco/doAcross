<script lang="ts">
    import { CellData } from '../types/puzzle.type';
    import { currentCell, canType, currentClue } from '../stores/puzzle';

    export let cellData: Celldata;
    export let acceptKeyInput;

    $: selected = $currentCell?.[0] === cellData.rowNum && $currentCell?.[1] === cellData.colNum;
    $: typable = selected && $canType;
    $: hilight = ($currentClue?.[1] === 'across' && $currentClue?.[0] === cellData.across) || ($currentClue?.[1] === 'down' && $currentClue?.[0] === cellData.down);

    const onClick = () => {
        if(cellData.type === 'block') {
            return;
        }
        $currentCell = [cellData.rowNum, cellData.colNum];
        if(!hilight) { // if this cell was already part of the current clue then don't change it
            $currentClue = cellData.across ? [cellData.across, 'across'] : [cellData.down, 'down'];
        }
        acceptKeyInput();
    };

</script>

<div
    class:block={cellData.type === 'block'}
    class:selected
    class:typable
    class:hilight
    on:click={onClick}
>
    {#if cellData.starts}
        <div class="number">
            {cellData.starts === 'across' ? cellData.across : cellData.down}
        </div>
    {/if}
    {cellData.type === 'cell' ? cellData.content : ''}
</div>

<style lang="scss">
    div {
        position: relative;
        border: 2px solid #000;
        background-color: #fff;
        width: 30px;
        height: 30px;
        font-weight: bold;

        &.hilight {
            background-color: var(--c-hilight);
        }

        &.selected {
            background-color: var(--c-selected);
            z-index: 1;

            &.typable {
                background-color: var(--c-selected-type);
            }
        }

        &.block {
            background-color: #000;
        }

        .number {
            position: absolute;
            top: 0;
            left: 0;
            width: 10px;
            height: 10px;
            font-size: 8px;
            border: none;
            background-color: transparent;
        }
    }
</style>
