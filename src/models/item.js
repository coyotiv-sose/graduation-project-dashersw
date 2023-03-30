class Item {
  whoIsBringingWhat = []

  constructor(name, desiredQuantity = 1) {
    this.name = name
    this.desiredQuantity = desiredQuantity
  }

  get quantity() {
    return this.whoIsBringingWhat.reduce((acc, curr) => acc + curr.quantity, 0)
  }

  get isEnough() {
    return this.quantity >= this.desiredQuantity
  }
}

module.exports = Item
