export const generateVibrantColor = () => {
    const getVibrantValue = () => Math.floor(Math.random() * 128 + 128).toString(16).padStart(2, "0");
    const red = getVibrantValue();
    const green = getVibrantValue();
    const blue = getVibrantValue();
    return `#${red}${green}${blue}`;
};