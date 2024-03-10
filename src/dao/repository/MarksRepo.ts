import Marks from "@src/dao/model/marks";
import { injectable } from "inversify";
@injectable()
export class MarksRepo {
    marks: typeof Marks;
    constructor(){
        this.marks = Marks;
    }
    
    public async executePipeline(pipeline: any[]){
       return this.marks.aggregate(pipeline);
    }
}