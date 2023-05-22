import {useEffect,useState} from "react";
import{
    Card,CardMedia,CardContent,Typography,useMediaQuery,
    Dialog,DialogContent,IconButton,AppBar,Stack,Autocomplete,
    TextField,Fab
} from "@mui/material";
import "./App.css";
import axios from "axios";
import logo from "./assets/pokeball.png";
import CloseIcon from '@mui/icons-material/Close';
import Loader from "./loader";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
function App(){
    const isMobile=useMediaQuery("(max-width:425px)");
    const[poke,setPoke]=useState([]);
    const[singlepoke,setSinglepoke]=useState([]);
    const[close,setClose]=useState(false);
    const[count,setCount]=useState(10);
    const[val,setVal]=useState('');
    const[visible,setVisible]=useState(false);
    console.log(val)
    const[pokemoncharacterdetails,setPokemoncharacterdetails]=useState({
name:'',
image:'',
types:[],
height:0,
ability:[],
stats:[],
moves:[]
    });
    const[querylist,setQuerylist]=useState([]);
    const[spin,setSpin]=useState(true);
    
    useEffect(()=>{
        axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${count}&offset=0`)
        .then(res=>{
            setPoke(res.data.results)
        })
        .catch(err=>console.log(err.message))
        /**when the scrollbar reaches the bottom of the page need to add 10 results to the api url */
        window.addEventListener("scroll",()=>{
            if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight){
              return setCount((count)=>count+10)
            }
            if(document.documentElement.scrollTop>10){
                setVisible(true)
               
            }
            else{
                setVisible(false)
                
            }
         })
    },[count])
    /**fetching the individual pokemon results */
    useEffect(()=>{
        let arr=[];
        Promise.all(
            poke.map((pokeitem)=>{
                const{url}=pokeitem;
                return axios.get(url)
            })
        )
        .then(res=>res.map((resitem)=>{
            const{data}=resitem;
            arr.push(data)
            setSinglepoke(arr)
            setSpin(false)
        }))
        .catch(err=>console.log(err.message))
    },[poke])

    useEffect(()=>{
        //console.log(singlepoke)
    },[singlepoke])
  /** function to display the pokemon full details on clicking the respective card */
    const pokemoncardfinding=(name)=>{
        const pokemoncharacter=singlepoke.find((el)=>el.name===name);
        const{types,height,abilities,stats,moves,sprites:{other:{dream_world:{front_default}}}}=pokemoncharacter;
    const poketype=types.map((itemtypes)=>{
        return itemtypes?.type?.name;
    })
    const pokeability=abilities.map((ability)=>{
        return ability?.ability?.name
    })
    const pokestats=stats.map((stat)=>{
        return stat?.stat?.name
    })
    const pokemoves=moves.map((move)=>{
        return move?.move?.name
    })
    setPokemoncharacterdetails({
        name:name,
        image:front_default,
        types:poketype,
        height:height,
        ability:pokeability,
        stats:pokestats,
        moves:pokemoves
    })
    setClose(true)
    }

    /**function to display the auto-suggestion ui to the user */
    const autosearching=(e)=>{
        const findingnames=singlepoke.filter((item)=>item.name.includes(e.target.value));
        findingnames.map((matchednames)=>{
            const{name}=matchednames;
            let listofnames=[];
            listofnames.push(name);
           setQuerylist(listofnames)
        })
    }
    /**Adding the smooth transtion fade effect when the elements has been scrolled */
    useEffect(()=>{
const cards=document.querySelectorAll('.poke-card');
const observer=new IntersectionObserver((entries)=>{
   entries.forEach((entry)=>{
    if(entry.isIntersecting){
       return entry.target.classList.toggle('card-style')
    }
    
   })
},{threshold:0.5})
cards.forEach((card)=>{
    observer.observe(card)
})

    },[])
//opening the dilaog box
    const handleclose=()=>{
        setClose(false)
    }
//fomrating the array in the human readable form
    const listformatting=(param)=>{
        return new Intl.ListFormat("en",{style:'long',type:'conjunction'}).format(param);
    }
    /**function to retrieve the particular pokemon details based on input value entered */
    const querySearching=()=>{
        if(val===""){
            return null
        }
        else{
       const pokequery=poke.find((el)=>el.name===val);
       const{name}=pokequery;
      pokemoncardfinding(name)
      return
        }
    }
    const scrollingtop=()=>{
        return document.documentElement.scrollTo({top:0,left:0,behavior:'smooth'})
    }
    return(
        <>
        <AppBar position="static"color="secondary"sx={{p:0.7,marginBlockEnd:3}}>
            {visible&&<Fab color="secondary"sx={{position:'fixed',right:15,bottom:15}} onClick={scrollingtop} className="fab">
                <ArrowUpwardIcon/>
            </Fab>}
            <Stack direction="row"justifyContent="center"gap={0.1}alignItems="center">
                <img src={logo}alt="logo"style={{
                    width:isMobile?'8%':'2rem'
                }}/>
            <Typography variant={isMobile?'h6':'h4'}color="inherit">Pokedux</Typography>
            </Stack>
        </AppBar>
        <Stack direction="row"justifyContent="center"alignItems="center"gap={1}sx={{marginBlockEnd:6}}>
        <Autocomplete
        sx={{width:isMobile?220:500,
    }}
        options={querylist}
        value={val}
        onChange={(event,newVal)=>{
setVal(newVal)
        }} 
        renderInput={(params)=><TextField label="Find your character" variant="standard"{...params}
        onChange={autosearching}
        />}
    />
<IconButton color="inherit"sx={{bgcolor:'purple',marginBlockStart:0.8}} onClick={querySearching}>
    <SearchIcon/>
</IconButton>
</Stack>
        <div style={{display:'flex',
        justifyContent:'center',
        alignItems:'center'}}id="box">
            {spin?<div style={{
                marginBlockStart:'10rem'
            }}><Loader/></div>:
<div className="pokemon-cards">
    {singlepoke.map((pokeitem,index)=>{
        const{name,sprites:{other:{dream_world:{front_default}}}}=pokeitem;
        return <Card key={index}
         sx={{
            width:isMobile?170:245,
            height:'100%',
            display:'flex',
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'center',
            '&:hover':{
                boxShadow:'0px 5px  15px rgba(0,0,0,0.5)'
            }
            }} onClick={()=>pokemoncardfinding(name)} className="poke-card"
            >
            <CardMedia
            component="img"
            image={front_default}
            alt=""
            sx=
            {{
                width:isMobile?100:'12rem',
                display:'block',
                margin:'auto'
            }}/>
            <CardContent>
                <Typography vaiant="body1"
                textAlign="center"color="seagreen"sx={{
                    '&:first-letter':{
                        textTransform:'uppercase'
                    }
                }}>{name}</Typography>
            </CardContent>
        </Card>
    })}
</div>}
<Dialog 
open={close}
fullScreen
onClose={handleclose}>
<DialogContent>
    <AppBar color="inherit">
        <IconButton sx={{marginLeft:'auto'}}color="success"onClick={handleclose}>
            <CloseIcon/>
        </IconButton>
    </AppBar>
    <div style={{display:'block',marginInlineStart:isMobile?'2rem':'35rem',marginBlockStart:isMobile?'4rem':'8rem'}}>
    <Stack direction="column"justifyContent="center"alignItems="baseline"
    gap={2}sx={{
        marginBlockStart:5
    }}>
        <img src={pokemoncharacterdetails?.image}alt=""style={{
            width:isMobile?'40%':'12rem'
        }}/>
        <Typography variant="body2"color="#60695C">
            <span>Name</span> : {pokemoncharacterdetails?.name}
        </Typography>
        <Typography variant="body2"color="#60695C">
            <span>Height</span> : {pokemoncharacterdetails?.height}
        </Typography>
        <Typography variant="body2"color="#60695C">
            <span>Types</span> : {listformatting(pokemoncharacterdetails?.types)}
        </Typography>
        <Typography variant="body2"color="#60695C">
            <span>Stats</span> : {listformatting(pokemoncharacterdetails?.stats)}
        </Typography>
        <Typography variant="body2"color="#60695C">
            <span>Abilities</span> : {listformatting(pokemoncharacterdetails?.ability)}
        </Typography>
        <Typography variant="body2"color="#60695C">
            <span>Moves</span> : {listformatting(pokemoncharacterdetails?.moves.slice(0,8))}
        </Typography>
    </Stack>
    </div>
</DialogContent>
</Dialog>
</div>
</>
    )
}
export default App;