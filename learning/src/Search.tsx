import type {Result} from "./types.ts"


interface Props{
    value:string,
    setQuery:(newValue:string)=> void;
    setResult:(newValue:Result)=>void;
    ref:React.RefObject<HTMLButtonElement>;
}


const Search = (props:Props) =>{
    
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>) => {
        props.setQuery(e.target.value);
    };
    
    const handleSearch = async (term: string) => {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        props.setResult({ valid: false });
        return;
      }
      props.setResult({
        valid: true,
        title: data.title,
        description: data.description,
        extract: data.extract,
        imgs:data.originalimage.source
      });
    } catch {
      props.setResult({ valid: false });
    }
  };

    const handleSubmit =async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        handleSearch(props.value);
    };
    
    return(
        <form onSubmit={handleSubmit}>
        <input value={props.value} onChange={handleChange} type="text"></input>
        <button type="submit" ref={props.ref}>check</button>
        </form>
    )
}

export default Search;