import React, { useState, useEffect } from 'react'
import axios from '../axios'
import EnhancedTable from './Table'
import Modal from 'react-modal';
import '../css/Dashboard.css'
import Pusher from 'pusher-js'
Modal.setAppElement('#root');

const Dashboard = () => {

    const [teams, setTeams] = useState([]);
    const [limit, setLimit] = useState(10);
    const [skip, setSkip] = useState(0);
    const [team, setTeam] = useState([]);
    const [modalIsOpen,setModalIsOpen]=useState(false);
    const [modal2IsOpen,setModal2IsOpen]=useState(false);
    const [error,setError]=useState('');
    const [tie,setTie]=useState(false);
    const [teamname,setTeamName]=useState('');
    const [search,setSearch]=useState('');
    const [sort,setSort]=useState('');
    let color='';
    var pusher = new Pusher('ff47039d4f132db57446', {
        cluster: 'ap2'
      });
    const fetchTeams = (limit, skip) => {
        axios.get(`/fatchTeam?limit=${limit}&skip=${skip}`) 
            .then(res=>{
                setTeams(res.data)
            })
    }
    const updateTeam= (team)  => {
        console.log(team)
       axios.put('/update',team)
       .then(res=>console.log(res))
       .catch(err=>console.log(err))
    };
    const nextPage = () => {
        setSkip(skip + limit)
    }

    const previousPage = () => {
        setSkip(skip - limit)
    }

    useEffect(() => {
        fetchTeams(limit, skip)
    }, [skip, limit])
    useEffect(()=>{
        const channel = pusher.subscribe('insertTeams');
        channel.bind('newTeams', function(data) {
         fetchTeams(limit, skip)
        });
        const updateTeam = pusher.subscribe('updatedTeams');
        updateTeam.bind('updateTeams', function(data) {
         fetchTeams(limit, skip)
        });
      },[skip, limit]);
    const handleChange = (user) => {
        color='lightgray'
       if(team.indexOf(user)!== -1){
        setError('Please select two distinct team!!')
          return
       }
        setTeam([...team,user]);
        console.log(user)
        if(team.length===1){
           setModalIsOpen(true);
        }
      };
     // console.log(state)
      const closemodal=()=>{
        setModalIsOpen(false)
        setTeam([]);
        setTie(false);
      }
      const openModal=()=>{
        setModalIsOpen(true)
      }
     const closemodal_2=()=>{
        setModal2IsOpen(false)
     }
   const onChangeValue=(e)=>{
       console.log(e.target.value)
       let winner=team?.find(win=>win.team_name===e.target.value)
       let losser=team?.find(win=>win.team_name!==e.target.value)
       const wins=winner.wins+1;
       const score=winner.score+3;
       const losses=winner.losses+1;
   if(winner!==null || winner!=={} || winner!==''){
        winner={...winner,wins,score};
      }
      if(losser!==null || losser!=={})
        losser={...losser,losses}
        setModalIsOpen(false)
       updateTeam(winner)
       updateTeam(losser)
      
   }
   const onChangeCheckBox=()=>{
    setTie(true);
    for(let i=0;i<team.length;i++){
        team[i].ties=team[i].ties+1;
        team[i].score=team[i].score+1;
        updateTeam(team[i]);
    }
   }
   const addTeam=()=>{
    setModal2IsOpen(true);

   }
   const addNewTeam=(e)=>{
       e.preventDefault();
   if(teamname!==''){
    const team={
        team_name:teamname ,
        wins: 0,
        losses: 0,
        ties: 0,
        score: 0   
}
axios.post('/addTeam',team)
.then(res=>{
    setError(res.errMsg);
    setTeamName('')
    setModal2IsOpen(false);
})
.catch(err=>setError(err.errMsg))

   }else{
    setError('please enter a valid name!!')
   }
   }
   let Teams=teams;
  if(sort==='Score'){
    Teams=teams.sort((a, b) => (a.score > b.score) ? 1 : -1)
  }
  if(sort==='TeamName'){
    Teams=teams.sort((a, b) => (a.team_name > b.team_name) ? 1 : -1)
  }
  Teams=teams.filter(team=>team.team_name.toLowerCase().includes(search.toLowerCase()));
    return (
      
        <>
        <div className="search">
            <p className="search__text">Search Team:</p>
            <input type="text" placeholder="Enter your team name"
             value={search} onChange={(e)=>setSearch(e.target.value)} />
             <select onChange={(e)=>setSort(e.target.value)} value={sort}>
                 <option value="">select</option>
                 <option value="TeamName">Team Name</option>
                 <option value="Score">Score</option>
             </select>
        </div>
    <div className="Dashboard"> 
        <div className="Dashboard__table"> 
       
                
                    <table> 
                        <thead className="Dashboard__table__thead">
                        <th className="tableHead"> Team Name </th>
                        <th  className="tableHead"> Wins </th>
                        <th  className="tableHead">losses</th>
                        <th  className="tableHead">ties</th>
                        <th  className="tableHead">score</th>
                        </thead>
                        <tbody>
                           {Teams?.map((team,index) => <tr key={index} className="tableRow"  onClick={()=>handleChange(team)}>
                           <td>{team.team_name}</td>
                           <td>{team.wins}</td>
                           <td>{team.losses}</td>
                           <td>{team.ties}</td>
                           <td>{team.score}</td>
                           </tr>) }
                        </tbody>
                        
                   </table>
                
        </div>
        <div> 
        
        <button onClick={previousPage} disabled={skip===0}>  Previous Page </button> 
        <button onClick={addTeam}>Add Team</button>
            <button onClick={nextPage}> Next Page </button>
            
        </div>
    </div>
    <Modal
          isOpen={modalIsOpen}
             onRequestClose={closemodal}
             className="Modal"
             overlayClassName="Overlay">
                 <div className="modal_1">
                 <table>
                     <thead>
                         <th>Team Name
                         </th>
                         <th>
                             win
                         </th>
                     </thead>
                     <tbody>
                     {
                  team.map((m)=><tr>
                      <td>{m.team_name}</td>
                      <td onChange={onChangeValue}><input type="radio" value={m.team_name} name="win" disabled={tie}/></td>
                  </tr>)
              }  
                     </tbody>
                 </table>
                 <section className="modal_1_checkSection">
                            <p>Tie</p>
                        <input type="checkbox" value="tie" onChange={onChangeCheckBox}/> 
                 </section>
              
              <button onClick={closemodal}>close</button>  
                 </div>
                    
              
  </Modal>
  <Modal
          isOpen={modal2IsOpen}
             onRequestClose={closemodal_2}
             className="Modal"
             overlayClassName="Overlay">
            <div className="modal_2">
                <h4>Add Team</h4> 
                {error && <p style={{color:"red"}}>{error}</p>}
                <input type="text" placeholder="Please Enter Team Name" value={teamname} onChange={e=>setTeamName(e.target.value)}/>
                <button onClick={addNewTeam}>Add</button>
            </div>
           
              
  </Modal>
    </>)
    
}
export default Dashboard;