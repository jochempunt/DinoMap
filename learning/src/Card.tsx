import type {Result} from "./types.ts"
import styles from "./Card.module.css"

interface Props{
    result:Result;
    isDinosaur:boolean
}


export default function Card ({result,isDinosaur}:Props){
    return(
        <>
        <div className={styles.card} 
        style={{ backgroundColor: isDinosaur ? "#8BC34A" : "#E57373" }}>
            
        <div className={styles.text}>
            <h2>{result.title}</h2>
            <p><em>{result.description}</em></p>
            <p><strong><i>is {isDinosaur?"":"not"} a dinosaur</i></strong></p>
            </div>
            
        </div>
        <img alt="testing" src={result.imgs} className={styles.img} />
        </>
    )
}

