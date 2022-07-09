import { canType, cellData, currentCell, currentClue, puzHeader } from '../stores/puzzle';
import { get } from 'svelte/store';

const createKeyInput = () => {
    const enum MoveDir {
        BACKWARD = -1,
        STAY = 0,
        FORWARD = 1,
    };

    let keyInput;

    const acceptKeyInput = () => {
        keyInput.focus();
    };

    const onFocus = () => {
        //console.log('Input focus');
        canType.set(true);
    }

    const onBlur = () => {
        //console.log('Input blur');
        canType.set(false);
    }

    const onKeyup = (ev) => {
        //console.log(ev.code);
        const cCell = get(currentCell);
        if(!cCell) {
            return;
        }

        let cellContent = '';
        let direction: MoveDir;
        switch(ev.code) {
            case 'Backspace':
                direction = MoveDir.BACKWARD;
                break;
            case 'Delete':
                direction = MoveDir.STAY;
                break;
            default:
                direction = MoveDir.FORWARD;
                cellContent = ev.key.charAt(0).toUpperCase();
                if(!cellContent.match(/^[A-Z]$/)) {
                    return;
                }
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
    }

    const setKeyInput = (ki) => {
        ki.addEventListener('focus', onFocus);
        ki.addEventListener('blur', onBlur);
        ki.addEventListener('keyup', onKeyup);
        keyInput = ki;
    }

    return {
        setKeyInput,
        acceptKeyInput,
    };
}

export const keyInput = createKeyInput();