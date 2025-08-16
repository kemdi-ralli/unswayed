
export const encode = (text) => {
    var base64num = btoa(text);
    var encodedText = encodeURIComponent(base64num);
    return encodedText;
};

export const decode = (encodedText) => {
    var encodedUri = decodeURIComponent(encodedText);
    var decodedText = atob(encodedUri);
    return decodedText;
};