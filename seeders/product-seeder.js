var Product = require('./../models/product')
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/shopping')

var product = [
    new Product({
        imagePath: 'img1',
        title: 'Black Ops 4',
        description: 'Awesome Game 1!!!!!!',
        price: '10'
    }),
    new Product({
        imagePath: 'img2',
        title: 'Harry Potter',
        description: 'Awesome Game 2!!!!!!',
        price: '20'
    }),
    new Product({
        imagePath: 'img3',
        title: 'Gothic',
        description: 'Awesome Game 3!!!!!!',
        price: '30'
    }),
    new Product({
        imagePath: 'img4',
        title: 'Rise of the Nations',
        description: 'Awesome Game 4!!!!!!',
        price: '40'
    }),
    new Product({
        imagePath: 'img5',
        title: 'CS GO',
        description: 'Awesome Game 5!!!!!!',
        price: '50'
    }),
    new Product({
        imagePath: 'img6',
        title: 'PUBG',
        description: 'Awesome Game 6!!!!!!',
        price: '60'
    })
]

console.log(product)

var done = 0
for (var i = 0; i < product.length; i++) {
    product[i].save(function(err, res){
        if (err) {
            return console.log(err)
        }
        done++
        console.log(res)
        if (done == product.length) {
            exit()
        }
    })
}

function exit () {
    mongoose.disconnect()
}