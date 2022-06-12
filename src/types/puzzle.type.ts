export type PuzHeader = {
    checksum: number;
    fileMagic: string;
    cibChecksum: number;
    maskedLowChecksums: number;
    maskedHighChecksums: number;
    version: string;
    reserved: any;
    scrambledChecksum: number;
    width: number;
    height: number;
    numClues: number;
    unknownBitmask: number;
    scrambledTag: number;
};

export type PuzStrings = {
    title: string;
    author: string;
    copyright: string;
    notes: string;
};

export type CellData = {
    type: 'cell'|'block';
    rowNum: number;
    colNum: number;
    content: string;
    solution: string;
    across: number;
    down: number;
    starts: 'across'|'down';
};
