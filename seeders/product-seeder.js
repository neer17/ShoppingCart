var Product = require('./../models/product')
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/shopping')

var product = [
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Call_of_Duty_Black_Ops_4_official_box_art.jpg/220px-Call_of_Duty_Black_Ops_4_official_box_art.jpg',
        title: 'Black Ops 4',
        description: 'Awesome Game 1!!!!!!',
        price: '10'
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Cover_Art_for_Harry_Potter_video_game_Philosopher%27s_Stone.jpg/200px-Cover_Art_for_Harry_Potter_video_game_Philosopher%27s_Stone.jpg',
        title: 'Harry Potter',
        description: 'Awesome Game 2!!!!!!',
        price: '20'
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Gothiccover.png/220px-Gothiccover.png',
        title: 'Gothic',
        description: 'Awesome Game 3!!!!!!',
        price: '30'
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d0/Rise_of_Nations_Coverart.png/220px-Rise_of_Nations_Coverart.png',
        title: 'Rise of the Nations',
        description: 'Awesome Game 4!!!!!!',
        price: '40'
    }),
    new Product({
        imagePath: 'https://www.mobygames.com/images/covers/l/274120-counter-strike-global-offensive-macintosh-front-cover.jpg',
        title: 'CS GO',
        description: 'Awesome Game 5!!!!!!',
        price: '50'
    }),
    new Product({
        imagePath: 'https://www.extremetech.com/wp-content/uploads/2017/12/PUBG-Feature-640x353.jpg',
        title: 'PUBG',
        description: 'Awesome Game 6!!!!!!',
        price: '60'
    })
]

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