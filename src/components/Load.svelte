<script lang="ts">
    import { loadPuzzleFromFile } from '../stores/puzzle';
    import SavedPuzzleList from '../components/SavedPuzzleList.svelte';

    let files: FileList;
    const onFileSelect = () => {
        loadPuzzleFromFile(files[0]);
    };
</script>

<section>
    <h1>Pick A Puzzle</h1>
    <h2>New</h2>
    <input type="file" bind:files accept=".puz" on:change={onFileSelect}>
    <h2>Saved</h2>
    <SavedPuzzleList />
</section>
