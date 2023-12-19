import Hashids from 'hashids';

class HashID {
    hashObj;
    constructor(){
        this.hashObj = new Hashids(
            process.env.HASHID_SALT,
            parseInt(process.env.HASHID_MIN_LENGTH as string)
        );
    }

    encodeNumber(num: number): string {
        return this.hashObj.encode(num);
    }

    decodeNumber(num: string):number | null{
        const decodedNum = this.hashObj.decode(num);
        if(typeof decodedNum[0] == 'undefined') return null;
        return decodedNum[0] as number;
    }
}

export default new HashID();