class cart {
    constructor(oldCart) {
        this.items = oldCart.items || {}
        this.totalQty = oldCart.totalQty || 0
        this.totalPrice = oldCart.totalPrice || 0
    }

    add(item, id) {
        var storedItem = this.items[id]

        if (!storedItem) {
            storedItem = this.items[id] = {
                item: item,
                qty: 0,
                price: 0
            }
        }
        storedItem.qty++
        storedItem.price = storedItem.item.price * storedItem.qty
        this.totalQty++
        this.totalPrice += storedItem.item.price
    }

    generateArray() {
        var arr = []

        for (var item in this.items) {
            arr.push(item)
        }

        return arr
    }
}

module.exports = cart