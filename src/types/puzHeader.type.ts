export type PuzHeader = {
    checksum: number;
    fileMagic: 'ACROSS&DOWN';
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
