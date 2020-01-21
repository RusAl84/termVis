function setColor (word, num){
    var outCode ="fff"
    switch (word){
        case "NOUN":
            if (num == "plur"){
                outCode = "#88d"
            }
            else{
                outCode = "#d88"
            }
            break;
        case "phrase":
            outCode = "#aaa"
            break;
        default:
            outCode = "#111";
    }
    return outCode
}

function checkMode(t){
    var out = []
    if(document.getElementById('POSRadio').checked) {
        for(var i = 0; i < t.length; i++){
            out.push(t[i].POS)
        }
      }else if(document.getElementById('caseRadio').checked) {
        for(var i = 0; i < t.length; i++){
            out.push(t[i].case)
        }
      }else if(document.getElementById('numberRadio').checked) {
        for(var i = 0; i < t.length; i++){
            out.push(t[i].number)
        }
      }else if(document.getElementById('genderRadio').checked) {
        for(var i = 0; i < t.length; i++){
            out.push(t[i].gender)
        }
      }else if(document.getElementById('animacyRadio').checked) {
        for(var i = 0; i < t.length; i++){
            out.push(t[i].animacy)
        }
        }else if(document.getElementById('wordCountRadio').checked) {
            for(var i = 0; i < t.length; i++){
                out.push(t[i].wordCount)
            }
        }else if(document.getElementById('wordImpRadio').checked) {
            for(var i = 0; i < t.length; i++){
                out.push(t[i].count)
            }
        }
        console.log(t)
        return out
}