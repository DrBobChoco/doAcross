<script lang="ts">
    import Toast from './components/Toast.svelte';
    import Router from 'svelte-spa-router';
    import routes from './routes';
</script>

<Toast />
<main>
    <Router {routes} />
</main>

<style lang="scss">
    main {
        text-align: center;
        padding: 1rem;
        margin: 0 auto;
    }
</style>
