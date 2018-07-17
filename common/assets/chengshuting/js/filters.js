let filters = {};
filters.replaceX = function (str) {
    if (!str) return;
    let reg = /(X+|xx+)/;
    let args = [...arguments];
    args.shift();
    let strNew = str;
    args.forEach((num) => {
        strNew = strNew.replace(reg, String(num));
    });
    return strNew;
};

filters.replaceW = function (str) {
    if (!str) return;
    let args = [...arguments];
    return str.replace(args[1], String(args[2]));
};
export default filters;
