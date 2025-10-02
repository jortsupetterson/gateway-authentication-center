import byteCodec from './src/server/utilities/byteCodec.js';

const binaryString = byteCodec.getBase64url(32);

console.log(binaryString);
