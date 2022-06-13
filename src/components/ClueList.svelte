<script lang="ts">
    import { ClueData } from '../types/puzzle.type';

    export let clueData: ClueData[];
</script>

<ul>
    {#each clueData as clue}
        <li>
            <span>{clue.number}</span>
            {clue.clue}
        </li>
    {/each}
</ul>

<style lang="scss">
    ul {
        display: inline-block;
        list-style-type: none;
        margin-top: 0;
        padding-left: 0;
        text-align: left;

        li span {
            font-weight: bold;
        }
    }
</style>
