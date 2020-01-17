function setColor (word){
    var outCode ="fff"
    switch (word){
        case "NOUN":
            outCode = "#d55";
            break;
        case "phrase":
            outCode = "#fff"
        default:
            outCode = "#111";
    }
    return outCode
}