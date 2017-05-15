export default function (length:number){
    if(length < 1024){
        return "tiny".gray
    }
    if(length < 1024 * 1024){
        let size = Math.floor(length/1024*100)/100;
        if(size > 100){
            return `${size}kb`.red
        }
        return `${size}kb`.gray
    }
    return `${Math.floor(length/(1024*1024)*100)/100} MB`.red
}