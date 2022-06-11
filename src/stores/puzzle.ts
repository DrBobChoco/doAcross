import { writable } from 'svelte/store';
import type { PuzHeader, PuzStrings } from '../types/puzzle.type';

export const puzHeader = writable(null);

export const loadPuzzle = async (file: File) => {
    puzHeader.set(null);

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

    const stringsClues = (await file.slice(0x34 + (2 * puzSize)).text()).split('\0');
    const strings: PuzStrings = {
        title: stringsClues[0],
        author: stringsClues[1],
        copyright: stringsClues[2],
        notes: stringsClues[3 + header.numClues],
    };
    const clues = stringsClues.slice(3, 3 + header.numClues);

    console.log('Header:', header);
    console.log('Solution:', solution);
    console.log('Player state:', playerState);
    console.log('Strings:', strings);
    console.log('Clues:', clues);

};
