import { Writable, writable } from 'svelte/store';

const toast: Writable<string> = writable(null);
export default toast;
