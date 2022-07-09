<script lang="ts">
    import { getSavedPuzzles, loadPuzzleFromStorage } from '../stores/puzzle';
    import toast from '../stores/toast';

    const savedPuzzles = getSavedPuzzles();

    const loadPuzzle = (saveKey) => {
        try {
            loadPuzzleFromStorage(saveKey);
        } catch (e) {
            if(typeof e === 'string') {
                $toast = e;
            } else {
                $toast = e.message;
            }
        }
    };
</script>

<ul>
    {#if savedPuzzles.length}
        {#each savedPuzzles as puzzle}
            <li on:click={() => loadPuzzle(puzzle.saveKey)}>
                <span class="title">{puzzle.title}</span> (saved at <span class="date">{new Date(parseInt(puzzle.date, 10)).toLocaleString()}</span>)
            </li>
        {/each}
    {:else}
        <li>No saved puzzles</li>
    {/if}
</ul>

<style lang="scss">
    ul {
        list-style-type: none;
        padding-left: 0;

        li {
            cursor: pointer;

            span.title {
                font-weight: bold;
            }
        }
    }
</style>
