const a = {
    swim: function(){
        console.log('swim');
    }
}

const b = {
    fly: function(){
        console.log('fly');
    }
}

function print(animal){
    if('swim' in animal){
        animal.swim();
    }else{

    }
}

