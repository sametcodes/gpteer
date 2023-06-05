
export const waitForTimeout = (t: number) => {
    return new Promise(resolve => setTimeout(resolve, t));
}