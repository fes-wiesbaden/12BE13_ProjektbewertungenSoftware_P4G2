import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})


export class SidebarService {
    private isCollapsedSubject = new BehaviorSubject<boolean>(false);
    public isCollapsed$: Observable<boolean> = this.isCollapsedSubject.asObservable();


    toggle(){
        this.isCollapsedSubject.next(!this.isCollapsedSubject.value);
    }

    collapse(){
        this.isCollapsedSubject.next(true);
    }

    expand(){
        this.isCollapsedSubject.next(false);
    }

    getState(): boolean{
        return this.isCollapsedSubject.value;
    }
}