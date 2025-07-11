export interface Result{
    valid:boolean
    title?:string,
    description?:string,
    extract?:string
    imgs?:string
}


export interface dino{
    id:string,
    name:string,
    family:string,
    occurrences:number,
    regions:string[],
    continents:string[]
    start_period:string|null,
    end_period?:string|null,
    popular:boolean
}