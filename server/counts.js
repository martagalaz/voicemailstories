Meteor.methods({
    getCounts: function() {
        return Images.find().count();
    },
    stopAllPlayingImages : function(){
        return Images.update({playing : true},{$set :  {playing : false}},{multi : true});
    },
    
    showAllImages : function(){
        return Images.update({},{ $set : {visible : true}},{multi : true});  
    },
    
    generateRandomPositions : function(){
        /*return Images.remove({},function(err,result){
            console.log('deleted qll!');
        })*/ //todo uncomment to delete all images.
        
        
        var asyncFunc = function(callback) {
          // callback has the form function (err, res) {}
             var images = Images.find({},{}).fetch();
             
                 images.forEach(function(image){
                    
            		//random position
            		image.posX = Math.random();
            		image.posY = Math.random();
            		Images.update(image._id,image,function(err,result){
            		    if(err){
            		        callback(new Meteor.error('could save an image.'));
            		    }else{
            		        console.log('saved',result);
            		    }
            		});
                 });
               
                 callback(null,true);

        };

        var syncFunc = Meteor.wrapAsync(asyncFunc);
  
        return syncFunc();
    }
});