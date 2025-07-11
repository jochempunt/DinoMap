import { createRef, useEffect, useRef, useState } from 'react'
import './App.css'

import Search from "./Search.tsx"

import type {Result} from "./types.ts"
import Card from "./Card.tsx"
import dinoList from './clean_dino_list.json';

function Dino() {
  
  const [query, setQuery] = useState<string>("");
  const[result,setResult]= useState<Result|null>(null)
  const[isDinosaur,setIsDinosaur] = useState<boolean>(false)



  
  
  const dinos = useRef<Set<string>>(new Set())
  
  const submitButton = createRef<HTMLButtonElement>()
  
  
  useEffect(() => {
    dinos.current = new Set(dinoList);
  }, []);
  
  
  useEffect(()=>{
    if(result && result.valid){
      if(dinos.current.has(result.title?.trim())){
        setIsDinosaur(true)
        console.log(result.title + " is a dinosaur")
      }else{
        setIsDinosaur(false)
        console.log(result.title + " is not a dinosaur")
      }
    }
    
  },[result])
  
  function getRandomDino(){
    const dinoArray:string[] = Array.from(dinos.current.values());
    const random = Math.floor(Math.random()* dinoArray.length);
    setQuery(dinoArray[random]) 
  }
  
  
  
  return (
    <>
    <h1>Is it a Dinosaur?</h1>
    <Search value={query} setQuery={setQuery} setResult={setResult} ref={submitButton}/>
    <button className='random'   onClick={getRandomDino}>Random Dino</button>
    <div>
    {result && (!result.valid?(
      <p><b>not found</b> </p>
    ):
    (
      <Card result={result} isDinosaur={isDinosaur}/>
    )) }
    
   
    </div>
    </>
  )
}

export default Dino
