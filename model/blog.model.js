const mongoose=require('mongoose')
const BlogSchema=mongoose.Schema({
  
    Username :{type:String,require:true},
	Title : {type:String,require:true},
	Content : {type:String,require:true},
	Category : {type:String,require:true},
	Date : {type:Date,require:true},
	likes: [
		{
		  type: mongoose.Schema.Types.ObjectId,
		  ref: 'Users',
		},
	  ],
	comments: [
		{
			content : {type:String,require:true},
		  username: {type:String,require:true}
		},
	  ],
  
})


const BlogModel=mongoose.model("Blogs",BlogSchema)
module.exports={
    BlogModel
}