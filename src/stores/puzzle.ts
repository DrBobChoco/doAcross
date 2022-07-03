import { Writable, writable } from 'svelte/store';
import type { PuzHeader, PuzStrings, CellData, ClueData } from '../types/puzzle.type';

export const puzHeader: Writable<PuzHeader> = writable(null);
export const puzStrings: Writable<PuzStrings> = writable(null);
export const cellData: Writable<CellData[][]> = writable(null);
export const clueData: Writable<{across: ClueData[]; down: ClueData[];}> = writable(null);
export const currentCell: Writable<[number, number]> = writable(null);
export const canType: Writable<boolean> = writable(false);
export const currentClue: Writable<[number, 'across'|'down']> = writable(null);


export const loadPuzzle = async (file: File) => {
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
    };

    if(header.fileMagic !== 'ACROSS&DOWN') {
        return false;
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
};
