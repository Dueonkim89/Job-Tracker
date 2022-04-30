export function parseStringID(id: any): number | null {
    if (typeof id !== "string") {
        return null;
    }
    const parsedID = parseInt(id);
    if (isNaN(parsedID)) {
        return null;
    }
    return parsedID;
}
