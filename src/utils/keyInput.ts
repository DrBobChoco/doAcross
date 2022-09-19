import { canType, cellData, currentCell, currentClue, puzHeader, saveCurrentPuzzle } from '../stores/puzzle';
import { get } from 'svelte/store';

const INPUT_RESET = "DB";

const createKeyInput = () => {
    const enum MoveDir {
        BACKWARD = -1,
        STAY = 0,
        FORWARD = 1,
    };

    let keyInput;

    let needSave:boolean = false;
    let intervalId:number = 0;

    const acceptKeyInput = () => {
        resetKeyInput();

        setTimeout(() => {
            const cell = document.querySelector('div.grid div.selected');
            cell?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
    };

    const resetKeyInput = () => {
        keyInput.focus();
        keyInput.value = INPUT_RESET;
        keyInput.setSelectionRange(1, 1);
    };

    const onFocus = () => {
        //console.log('Input focus');
        canType.set(true);
    };

    const onBlur = () => {
        //console.log('Input blur');
        canType.set(false);
    };

    const onKeyup = () => {
        const cCell = get(currentCell);
        if(!cCell) {
            return;
        }

        let cellContent = '';
        let direction: MoveDir;
        let inputVal = keyInput.value;
        resetKeyInput();

        if(inputVal === 'B') { // Backspace
            direction = MoveDir.BACKWARD;
        } else if(inputVal === 'D') { // Delete
            direction = MoveDir.STAY;
        } else if(inputVal.length < 3) {
            return; // shouldn't happen by this point
        } else {
            direction = MoveDir.FORWARD;
            cellContent = inputVal.charAt(1).toUpperCase();
            if(!cellContent.match(/^[A-Z]$/)) {
                return;
            }
            needSave = true;
        }
        const cData = get(cellData);
        cData[cCell[0]][cCell[1]].content = cellContent;
        cellData.set(cData);
        moveCell(direction, 1);
    };

    const moveCell = (direction: MoveDir, amount: number) => {
        amount = amount * direction;
        if(!amount) {
            return;
        }

        let [rowNum, colNum] = get(currentCell);
        if(get(currentClue)[1] === 'across') {
            colNum += amount;
        } else {
            rowNum += amount;
        }

        const pHeader = get(puzHeader);
        if(
            rowNum < 0 || rowNum >= pHeader.height ||
            colNum < 0 || colNum >= pHeader.width ||
            get(cellData)[rowNum][colNum].type === 'block'
        ) {
            return
        }

        currentCell.set([rowNum, colNum]);
    };

    const setKeyInput = (ki) => {
        ki.addEventListener('focus', onFocus);
        ki.addEventListener('blur', onBlur);
        ki.addEventListener('keyup', onKeyup);
        keyInput = ki;

        if(intervalId === 0) {
            intervalId = window.setInterval(() => {
                if(needSave) {
                    needSave = false;
                    saveCurrentPuzzle();
                }
            }, 5000);
        }
    };

    const endKeyInput = () => {
        keyInput = null;
        needSave = false;
        window.clearInterval(intervalId);
        window.setTimeout(saveCurrentPuzzle, 0);
    };

    return {
        setKeyInput,
        acceptKeyInput,
        endKeyInput,
    };
}

export const keyInput = createKeyInput();
