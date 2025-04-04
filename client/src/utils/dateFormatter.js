const formatDate = (dateVal) => {
    let d = null;
    if (typeof dateVal === "string") {
        d = new Date(dateVal);
    }
    else if (typeof dateVal === "object") {
        d = dateVal && dateVal._seconds
            ? new Date(dateVal._seconds * 1000)
            : new Date(dateVal);
    }
    return d.toLocaleDateString() + ', ' +
        d.getHours().toString().padStart(2, '0') + ':' +
        d.getMinutes().toString().padStart(2, '0');
};

export default formatDate