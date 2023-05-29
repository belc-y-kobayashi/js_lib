Response.prototype.dom = function () {
    return this.text().then(text => new DOMParser().parseFromString(text, "text/html"))
}