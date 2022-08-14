import { Writable, writable, get } from 'svelte/store';
import type { PuzHeader, PuzStrings, CellData, ClueData, PuzzleSave } from '../types/puzzle.type';
import toast from '../stores/toast';
import { push } from 'svelte-spa-router';

export const puzHeader: Writable<PuzHeader> = writable(null);
export const puzStrings: Writable<PuzStrings> = writable(null);
export const cellData: Writable<CellData[][]> = writable(null);
export const clueData: Writable<{across: ClueData[]; down: ClueData[];}> = writable(null);
export const currentCell: Writable<[number, number]> = writable(null);
export const canType: Writable<boolean> = writable(false);
export const currentClue: Writable<[number, 'across'|'down']> = writable(null);

const SAVE_DELIM = '|!!|';

export const loadPuzzleFromFile = async (file: File) => {
    puzHeader.set(null);
    puzStrings.set(null);

    const numberData = new DataView(await file.arrayBuffer());
    const header: PuzHeader = {
        checksum: numberData.getUint16(0, true),
        fileMagic: await file.slice(0x02, 0x0D).text(),
        cibChecksum: numberData.getUint16(0x0E, true),
        maskedLowChecksums: numberData.getUint32(0x10),
        maskedHighChecksums: numberData.getUint32(0x14),
        version: (await file.slice(0x18, 0x1B).text()).trimEnd(),
        reserved: null,
        scrambledChecksum: numberData.getUint16(0x1E, true),
        width: numberData.getUint8(0x2C),
        height: numberData.getUint8(0x2D),
        numClues: numberData.getUint16(0x2E, true),
        unknownBitmask: numberData.getUint16(0x30, true),
        scrambledTag: numberData.getUint16(0x32, true),
        saveKey: null,
    };

    if(header.fileMagic !== 'ACROSS&DOWN') {
        return false;
    }
    header.saveKey = 'doAcross:' + header.checksum.toString(16) + header.cibChecksum.toString(16) +
        header.maskedLowChecksums.toString(16) + header.maskedHighChecksums.toString(16);
    // See if we have this puzzle saved and load that in preference
    try {
        loadPuzzleFromStorage(header.saveKey);
        toast.set('Loaded a previously saved version');
        return;
    } catch (e) {
        // It'll throw if the puzzle wasn't there so just carry on loading from the file data
    }
    puzHeader.set(header);

    const puzSize = header.width * header.height;
    const rowRx = new RegExp(`.{${header.width}}`, 'g');
    const solutionStr = await file.slice(0x34, 0x34 + puzSize).text();
    const solution = solutionStr.match(rowRx).map(row => [...row]);
    const playerStateStr = await file.slice(0x34 + puzSize, 0x34 + (2 * puzSize)).text();
    const playerState = playerStateStr.match(rowRx).map(row => [...row]);

    let cells: CellData[][] = [];
    let nextNum = 1;
    let clueNums: [number, 'across'|'down'][] = [];
    let answerLetters = {
        across: [],
        down: [],
    }
    for(let rowNum = 0; rowNum < header.height; rowNum++) {
        let row: CellData[] = [];
        for(let colNum = 0; colNum < header.width; colNum++) {
            let across = 0;
            let down = 0;
            let starts = null;

            if(playerState[rowNum][colNum] !== '.') { // cell not block
                // Get across clue number
                if(row[colNum - 1]?.type === 'cell') {
                    across = row[colNum - 1].across;
                } else if (
                    (colNum === 0 || row[colNum -1].type === 'block') &&
                    typeof playerState[rowNum][colNum + 1] !== 'undefined' && playerState[rowNum][colNum + 1] !== '.'
                ) {
                    across = nextNum++;
                    clueNums.push([across, 'across']);
                    starts = 'across';
                }
                //Get down clue number
                if(cells[rowNum - 1]?.[colNum].type === 'cell') {
                    down = cells[rowNum - 1][colNum].down;
                } else if (
                    (rowNum === 0 || cells[rowNum - 1][colNum].type === 'block') &&
                    typeof playerState[rowNum + 1]?.[colNum] !== 'undefined' && playerState[rowNum + 1][colNum] !== '.'
                ) {
                    down = starts ? across : nextNum++;
                    clueNums.push([down, 'down']);
                    starts = 'down';
                }
            }

            row.push({
                type: playerState[rowNum][colNum] === '.' ? 'block' : 'cell',
                rowNum,
                colNum,
                content: playerState[rowNum][colNum] === '-' ? ' ' : playerState[rowNum][colNum],
                solution: solution[rowNum][colNum],
                across,
                down,
                starts,
            });

            if(across) {
                if(typeof answerLetters.across[across] === 'undefined') {
                    answerLetters.across[across] = {};
                }
                if(typeof answerLetters.across[across][solution[rowNum][colNum]] === 'undefined') {
                    answerLetters.across[across][solution[rowNum][colNum]] = 0;
                }
                answerLetters.across[across][solution[rowNum][colNum]]++
            }

            if(down) {
                if(typeof answerLetters.down[down] === 'undefined') {
                    answerLetters.down[down] = {};
                }
                if(typeof answerLetters.down[down][solution[rowNum][colNum]] === 'undefined') {
                    answerLetters.down[down][solution[rowNum][colNum]] = 0;
                }
                answerLetters.down[down][solution[rowNum][colNum]]++
            }
        }
        cells.push(row);
    }
    cellData.set(cells);

    const stringsClues = (await file.slice(0x34 + (2 * puzSize)).text()).split('\0');
    const strings: PuzStrings = {
        title: stringsClues[0],
        author: stringsClues[1],
        copyright: stringsClues[2],
        notes: stringsClues[3 + header.numClues],
    };
    puzStrings.set(strings);

    let clues: {
        across: ClueData[];
        down: ClueData[];
    } = {
        across: [],
        down: [],
    };
    let number: number;
    let direction: 'across'|'down';
    let thisClueData: ClueData;
    stringsClues.slice(3, 3 + header.numClues).forEach((clue, idx) => {
        [number, direction] = clueNums[idx];
        thisClueData = {
            number,
            direction,
            clue,
            hasAnswer: Object.keys(answerLetters[direction][number]).length > 1,
        };
        if(direction === 'across') {
            clues.across[number] = thisClueData;
        } else {
            clues.down[number] = thisClueData;
        }
    });
    clueData.set(clues);

    //console.log('Header:', header);
    //console.log('Solution:', solution);
    //console.log('Player state:', playerState);
    //console.log(cells);
    //console.log('Strings:', strings);
    //console.log('Clues:', clues);

    currentCell.set(null);
    currentClue.set(null);
    push('/');
};

export const saveCurrentPuzzle = () => {
    const puzzleSave: PuzzleSave = {
        puzHeader: get(puzHeader),
        puzStrings: get(puzStrings),
        cellData: get(cellData),
        clueData: get(clueData),

    };

    const saveStr =
        puzzleSave.puzStrings.title + SAVE_DELIM +
        Date.now() + SAVE_DELIM +
        JSON.stringify(puzzleSave);
    window.localStorage.setItem(puzzleSave.puzHeader.saveKey, saveStr);
};

export const getSavedPuzzles = () => {
    const storage = window.localStorage;
    let savedPuzzles = [];
    for(let kn = 0; kn < storage.length; kn++) {
        let saveKey = storage.key(kn);
        if(saveKey.substring(0, 9) === 'doAcross:') {
            const [title, date] = storage.getItem(saveKey).split(SAVE_DELIM).slice(0, 2);
            savedPuzzles.push({
                saveKey,
                title,
                date,
            });
        }
    }

    savedPuzzles = savedPuzzles.sort((a, b) => {
        if(a.date === b.date) {
            return 0;
        }
        return a.date > b.date ? -1 : 1;
    });

    return savedPuzzles;
};

export const loadPuzzleFromStorage = (saveKey: string) => {
    const saveStr = window.localStorage.getItem(saveKey);
    if(saveStr === null) {
        throw 'Missing save data';
    }
    const saveData = saveStr.split(SAVE_DELIM);
    if(saveData.length < 3) {
        throw 'Bad save data';
    }
    // re-join any array elements beyond the title and time just in case there were some SAVE_DELIMs in the puzzle data
    let puzzleSave: PuzzleSave;
    try {
        puzzleSave = JSON.parse(saveData.slice(2).join(SAVE_DELIM));
    } catch (e) {
        throw 'Error decoding save data';
    }

    puzHeader.set(puzzleSave.puzHeader);
    puzStrings.set(puzzleSave.puzStrings);
    cellData.set(puzzleSave.cellData);
    clueData.set(puzzleSave.clueData);
    currentCell.set(null);
    canType.set(false);
    currentClue.set(null);
    push('/');
};
