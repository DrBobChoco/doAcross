<script lang="ts">
    import { loadPuzzle } from '../stores/puzzle';

    let files: FileList;
    const onFileSelect = () => {
        loadPuzzle(files[0]);
    };
</script>

<section>
    <input type="file" bind:files accept=".puz" on:change={onFileSelect}>
</section>
