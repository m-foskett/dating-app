// Custom Function: generateId
// - Takes the matched user's ids and returns their concatenation based on string comparison
const generateId = (id1, id2) => (id1 > id2 ? id1 + id2 : id2 + id1);
export default generateId;