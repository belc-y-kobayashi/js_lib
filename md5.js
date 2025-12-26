// 定数は外で1度だけ生成
const T = new Uint32Array(64);
for (let i = 0; i < 64; i++) T[i] = (Math.abs(Math.sin(i + 1)) * 4294967296) >>> 0;

const md5 = (input) => {
    const inputArray = new Uint8Array(input);
    const len = inputArray.length;

    const dataLen = ((len + 8 + 64) >>> 6) << 6;
    const data = new Uint8Array(dataLen);
    data.set(inputArray);
    data[len] = 0x80;

    const view = new DataView(data.buffer);
    view.setUint32(dataLen - 8, len * 8, true);

    let a = 0x67452301, b = 0xEFCDAB89, c = 0x98BADCFE, d = 0x10325476;

    for (let offset = 0; offset < dataLen; offset += 64) {
        const x = new Uint32Array(data.buffer, offset, 16);
        let aa = a, bb = b, cc = c, dd = d;

        for (let j = 0; j < 64; j++) {
            let f, g;
            if (j < 16) {
                f = (b & c) | (~b & d);
                g = j;
            } else if (j < 32) {
                f = (d & b) | (~d & c);
                g = (5 * j + 1) % 16;
            } else if (j < 48) {
                f = b ^ c ^ d;
                g = (3 * j + 5) % 16;
            } else {
                f = c ^ (b | ~d);
                g = (7 * j) % 16;
            }

            const s = [
                7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
                5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
                4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
                6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
            ][j];

            let temp = d;
            d = c;
            c = b;
            let t = a + f + x[g] + T[j];
            b = b + ((t << s) | (t >>> (32 - s)));
            a = temp;
        }

        a = (a + aa) >>> 0;
        b = (b + bb) >>> 0;
        c = (c + cc) >>> 0;
        d = (d + dd) >>> 0;
    }

    return [a, b, c, d].map(val => {
        console.log('Intermediate MD5 value:', val.toString(16).padStart(8, '0'));
        const b0 = (val & 0xff).toString(16).padStart(2, '0');
        const b1 = ((val >> 8) & 0xff).toString(16).padStart(2, '0');
        const b2 = ((val >> 16) & 0xff).toString(16).padStart(2, '0');
        const b3 = ((val >> 24) & 0xff).toString(16).padStart(2, '0');
        return b0 + b1 + b2 + b3;
    }).join('');
};
