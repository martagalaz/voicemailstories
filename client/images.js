Template.images.helpers({
	
	"show_overlay" : function(){
		if (Images.find({playing: true}).count() > 0) {
			return true;
		}
		else {
			return false;
		}
	},
	
	"totalCounts" : function(){
		return Images.find({}).count();
	},
	
	"attributes" : function(image,index){
		var attributes = { class : 'article'};
		
		if(image.playing){
			attributes.class += ' active';
		}
		
		var diameter = image.bytes / 7000;
		if (diameter < 70) {
			diameter = 100;
		}
		if (diameter > 750) {
			diameter = 750;
		}
		var font_size = diameter / 10;

		//assemble everything
		var style = "z-index:" + index + ";width:" + diameter +
		"px;height:" + diameter + "px;left:" + image.posX * 90 + "%;top:" + image.posY * 90 + 
		"%;font-size:" + font_size + "pt;" ;
		
		attributes.style = style;
		
		return attributes;
	},
	
	"visibleCounts" : function(){
		return Images.find({ visible : true }).count();
	},
	
	"images": function() {
		return Images.find({visible : true});
	}
});

Template.images.created = function(){
	Meteor.call('showAllImages',function(err,res){
		console.log('showed all images',err,res);
	})
	Meteor.call('generateRandomPositions',function(err,res){
		console.log('generated random positions',err,res);
	}); //regenerate the positions randomly.
}

Template.images.events({
	
	"click .closeImage" : function(event){//hide the image.
		var id = this._id;
		return Images.update(id,{$set : {visible:false}});
	},
	
	"load audio" : function(e){//audio loaded.
		e.target.play();
	},
	
	"ended audio" : function(e){ //audio ended playing.
		Images.update(this._id,{$set :{playing : false}});
	},
	
	"click .article": function(event) {
		var player = $(event.target).find('audio')[0];
		var oldPlaying = this.playing;
		Meteor.call('stopAllPlayingImages',{},(err,res)=>{
			if(err){
				return console.error(err);
			}else{
				Images.update(this._id,{$set : {playing:!oldPlaying}});
			}
		});
	}
	
});
