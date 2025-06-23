import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class HttpService{

    constructor(private http: HttpClient){ }

    getMatrixById(id: number){
        return this.http.get("http://localhost:8080/transport/task/" + id);
    }

    getAllMatrix(){
        return this.http.get("http://localhost:8080/transport/tasks");
    }

    postSolve(data){
        return this.http.post("http://localhost:8080/transport/solve", data);
    }

    getSolution(id:number){
        return this.http.get("http://localhost:8080/transport/solution/" + id);
    }
}