export const toFixedMine = (value) => {
    let result = value.toString().split('.').map((d, idx) => idx === 1 ? d.substring(0, 4) : d).join('.')
    return parseFloat(result);
} 