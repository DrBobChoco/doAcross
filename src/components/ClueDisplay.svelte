<script lang="ts">
    import { currentClue, clueData } from '../stores/puzzle';

    let clueNum = '';
    let clue = '';
    $: if($currentClue?.[0]) {
        clueNum = `${$currentClue[0]}${$currentClue[1].charAt(0).toUpperCase()}`;
        clue = $clueData[$currentClue[1]][$currentClue[0]].clue;
    }
</script>

<div>
    {#if $currentClue?.[0]}
        <span>{clueNum}:</span> {clue}
    {:else}
        &nbsp;
    {/if}
</div>

<style lang="scss">
    div {
        position: sticky;
        top: 0.5em;
        z-index: 2;
        width: 98%;
        margin: 0 auto 0.75em auto;
        padding: 8px 4px;
        border: 3px solid #000;
        border-radius: 6px;
        box-shadow: 4px 4px 4px #aaa;
        text-align: left;
        background-color: #fff;
    }

    span {
        font-weight: bold;
    }
</style>
