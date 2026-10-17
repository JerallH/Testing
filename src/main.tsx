import React, {Component,type ReactNode} from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
class StorageBoundary extends Component<{children:ReactNode},{failed:boolean}>{
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 render(){if(this.state.failed)return <div className="empty" style={{minHeight:'100vh'}}><h1>Your saved data needs a little attention.</h1><p>Pocket could not read browser storage. Existing data has not been overwritten.</p><p>Check that browser storage is enabled. If the data is damaged, back up the “pocket-budget-v1” entry in browser developer tools before removing it.</p><button className="btn primary" onClick={()=>location.reload()}>Try again</button></div>;return this.props.children;}
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><StorageBoundary><App/></StorageBoundary></React.StrictMode>);
