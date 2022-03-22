const addToWishlist = require('../processes/addToWishlist')

function Browser() {
    this.instance = undefined
    this.page = undefined
    this.addToWishlist = async ()=>{
        await addToWishlist(this).then((returnObj)=>{
            console.log(new Date().toLocaleString() + ': Completed')
        }).catch((returnObj)=>{
            console.log(new Date().toLocaleString() + ': Error')
        })
    }
}

module.exports = Browser