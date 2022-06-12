import { writable } from 'svelte/store';
import type { PuzHeader, PuzStrings, CellData } from '../types/puzzle.type';

export const puzHeader = writable(null);
export const puzStrings = writable(null);
export const cellData = writable([]);


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
    const clues = stringsClues.slice(3, 3 + header.numClues);

    //console.log('Header:', header);
    //console.log('Solution:', solution);
    //console.log('Player state:', playerState);
    //console.log(cells);
    //console.log('Strings:', strings);
    //console.log('Clues:', clues);
};
