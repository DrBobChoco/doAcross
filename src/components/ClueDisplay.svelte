<script lang="ts">
    import { currentClue, clueData } from '../stores/puzzle';

    let clueNum = '';
    let clue = '';
    $: if($currentClue?.[0]) {
        clueNum = `${$currentClue[0]}${$currentClue[1].charAt(0).toUpperCase()}`;
        clue = $clueData[$currentClue[1]].filter(clueData => clueData.number === $currentClue[0])[0].clue;
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
        width: 50%;
        margin: 0 auto 0.75em auto;
        text-align: left;
        padding: 8px 4px;
        border: 3px solid #000;
        border-radius: 6px;
    }

    span {
        font-weight: bold;
    }
</style>
