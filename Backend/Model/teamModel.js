var mongoose=require('mongoose')
const Schema = mongoose.Schema;
const TeamSchema=mongoose.Schema({ 
    
        team_name:{
            type: String,
            required: true
        },
        wins:{
            type: Number,
            required: true
        },
        losses:{
            type: Number,
            required: true
        },
        ties:{
            type: Number,
            required: true
        },
        score:{
            type: Number,
            required: true
        },
        playWith: [{ type: Schema.Types.ObjectId, ref: 'teams'}]
        
   
});
const Team= mongoose.model('teams',TeamSchema);
module.exports=Team;