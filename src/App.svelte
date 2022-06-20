<script lang="ts">
    import { PuzStrings } from './types/puzzle.type';
    import { puzStrings, clueData, cellData, currentCell, canType, currentClue, puzHeader } from './stores/puzzle';
    import FileLoad from './components/FileLoad.svelte';
    import ClueDisplay from './components/ClueDisplay.svelte';
    import Grid from './components/Grid.svelte';
    import ClueList from './components/ClueList.svelte';

    const STAY = 0;
    const FORWARD = 1;
    const BACKWARD = -1;

    let keyInput;

    const acceptKeyInput = () => {
        keyInput.focus();
    };

    const onFocus = () => {
        //console.log('Input focus');
        $canType = true;
    }

    const onBlur = () => {
        //console.log('Input blur');
        $canType = false;
    }

    const onKeyup = (ev) => {
        //console.log(ev.code);
        if(!$currentCell) {
            return;
        }

        let cellContent = '';
        let direction: STAY|FORWARD|BACKWARD;
        switch(ev.code) {
            case 'Backspace':
                direction = BACKWARD;
                break;
            case 'Delete':
                direction = STAY;
                break;
            default:
                direction = FORWARD;
                cellContent = ev.key.charAt(0).toUpperCase();
                if(!cellContent.match(/^[A-Z]$/)) {
                    return;
                }
        }
        $cellData[$currentCell[0]][$currentCell[1]].content = cellContent;
        moveCell(direction, 1);
    };

    const moveCell = (direction: STAY|FORWARD|BACKWARD, amount: number) => {
        amount = amount * direction;
        if(!amount) {
            return;
        }

        let [rowNum, colNum] = $currentCell;
        if($currentClue[1] === 'across') {
            colNum += amount;
        } else {
            rowNum += amount;
        }

        if(
            rowNum < 0 || rowNum >= $puzHeader.height ||
            colNum < 0 || colNum >= $puzHeader.width ||
            $cellData[rowNum][colNum].type === 'block'
        ) {
            return
        }

        $currentCell = [rowNum, colNum];
    }
</script>

<main>
    {#if $puzStrings !== null}
        <h1>{$puzStrings.title}{#if $puzStrings.author !== ''}&nbsp;by&nbsp;{$puzStrings.author}{/if}</h1>
        <ClueDisplay />
        <input type="text" maxlength="1"
            bind:this={keyInput}
            on:keyup={onKeyup}
            on:focus={onFocus}
            on:blur={onBlur}
        >
        <Grid acceptKeyInput={acceptKeyInput} />
        <h2>Across</h2>
        <ClueList direction='across' clueData={$clueData.across} acceptKeyInput={acceptKeyInput} />
        <h2>Down</h2>
        <ClueList direction='down' clueData={$clueData.down} acceptKeyInput={acceptKeyInput} />
    {:else}
        <h1>Werd</h1>
        <FileLoad />
    {/if}
</main>

<style lang="scss">
    main {
        text-align: center;
        padding: 1em;
        margin: 0 auto;
    }

    input {
        display: block;
        width: 40px;
        position: absolute;
        top: -1000px;
    }
</style>
