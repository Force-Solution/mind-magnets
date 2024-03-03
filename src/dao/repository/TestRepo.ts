import mongoose from "mongoose";
import Test from "../model/test";

export class TestRepo{
    public async getAllTestsByTeacher(id: mongoose.Types.ObjectId){
        return Test.find({teacher: id});
    }
    
    public async executePipeline(pipeline: any[]){
        return Test.aggregate(pipeline)
    }
}