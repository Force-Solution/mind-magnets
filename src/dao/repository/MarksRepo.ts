import Marks from "../model/marks";

export class MarksRepo {
    public async executePipeline(pipeline: any[]){
       return Marks.aggregate(pipeline);
    }
}