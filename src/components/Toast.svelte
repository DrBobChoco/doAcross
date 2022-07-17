<script lang="ts">
    import toast from '../stores/toast';
    import { fly } from 'svelte/transition';

    const onClose = () => {
        $toast = null;
    }
</script>

{#if $toast}
    <div class="toast" transition:fly="{{ y: -75 }}">
        <div>{$toast}</div>
        <a href="#/" on:click|preventDefault={onClose} aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"/></svg>
        </a>
    </div>
{/if}

<style lang="scss">
    div.toast {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        z-index: 100;
        display: flex;
        justify-content: space-between;
        background-color: var(--c-hilight);
        border: 4px solid #000;
        border-top-width: 0;
        border-radius: 0 0 4px 4px;
        padding: 8px 16px;

        svg {
            width: 28px;
            height: 28px;
        }
    }
</style>
