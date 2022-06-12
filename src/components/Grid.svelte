<script lang="ts">
    import { cellData } from '../stores/puzzle';
    import Cell from '../components/Cell.svelte';
</script>

<section>
    <div class="grid">
        {#each $cellData as row}
            <div class="row">
                {#each row as cell}
                    <Cell cellData={cell} />
                {/each}
            </div>
        {/each}
    </div>
</section>

<style lang="scss">
    div.grid {
        display: inline-flex;
        flex-direction: column;
        border: 1px solid #000;
        background-color: #000;
    }

    div.row {
        display: flex;
    }
</style>
