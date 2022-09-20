export default function getItem(id, array) {
    let element = null;
    array.forEach(item => {
        if (item.id == id) {
            element = item;
        }
    });

    return element;
}