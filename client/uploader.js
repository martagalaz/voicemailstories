Template.uploader.events({
	"change #fileSelected": function(e){
		if(!e.target.files || e.target.files.length === 0){
			$("#chooseVoicemail").text('Choose a voicemail');
			return;
		}
		
		var fileName = e.target.files[0].name;
		fileName = (fileName.length > 16 ? fileName.slice(0,16) + '...' : fileName);
		
		$("#chooseVoicemail").text(fileName);
	},
	"submit": function(e) {
		e.preventDefault();
		var fileName = e.target.fileTitle.value;
		var files = e.target.fileSelected.files;
		Cloudinary.upload(files, { resource_type: "video" }, function(err, res) {
			if(err){
				return console.error(err);
			}
			
			res.from = e.target.fileTitle.value;
			res.title = Math.floor(Math.random() * 10000000000); //random number.
			res.visible = true;
			res.fileName = fileName;
			
			e.target.fileSelected.files = null;
			e.target.fileTitle.value = '';
			
    		//random position
    		res.posX = Math.random() / 1.4;
    		res.posY = Math.random() / 1.4;

			$('#chooseVoicemail').text("Choose a voicemail");
			
			Images.insert(res,function(err,createdId){
				console.log('created image',err,createdId);
				Meteor.call('generateRandomPosition',createdId,function(err,res){
					console.log('updated image',err,res);
				});
			});
		});
	}
});

Template.uploader.helpers({
		randomAudio: function() {
		var randomAudio = Images.find({}).fetch()[Session.get('randIndex')];
		return randomAudio ? randomAudio : {};
	}
});

Meteor.call('getCounts', function(err, count) {
	if(err){
		return console.error(err);
	}
	count = count - 1;
	var randomFloat = Math.random() * (count - 0);
	var randomInt = Math.floor(Math.random() * (count +1));
	Session.set('randIndex', randomInt);	
});

