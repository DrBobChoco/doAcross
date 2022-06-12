<script lang="ts">
    import { CellData } from '../types/puzzle.type';

    export let cellData: Celldata;
</script>

<div class:block={cellData.type === 'block'}>
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
            font-weight: bold;
            border: none;
        }
    }
</style>
