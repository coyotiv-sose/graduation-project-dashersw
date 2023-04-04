const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const itemSchema = new mongoose.Schema(
  {
    name: String,
    desiredQuantity: {
      type: Number,
      default: 1,
    },
    whoIsBringingWhat: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          autopopulate: {
            select: 'name',
          },
        },
        quantity: Number,
      },
    ],
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
)

itemSchema.plugin(autopopulate)

class Item {
  get quantity() {
    return this.whoIsBringingWhat.reduce((acc, curr) => acc + curr.quantity, 0)
  }

  get isEnough() {
    return this.quantity >= this.desiredQuantity
  }
}

itemSchema.loadClass(Item)

module.exports = itemSchema
