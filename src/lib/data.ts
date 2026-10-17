export type Transaction = {id:string;date:string;amount:number;type:'income'|'expense';category:string;description:string;notes:string;recurringId?:string};
export type Goal = {id:string;name:string;target:number;current:number;date:string};
export type Recurring = {id:string;name:string;amount:number;category:string;day:number;start:string};
export type Data = {transactions:Transaction[];categories:string[];budgets:Record<string,Record<string,number>>;goals:Goal[];recurring:Recurring[];postedRecurring?:string[];dark:boolean;seeded:boolean};
export const key='pocket-budget-v1';
export const monthKey=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
export const today=()=>`${monthKey()}-${String(new Date().getDate()).padStart(2,'0')}`;
export const money=(n:number)=>new Intl.NumberFormat('en-SG',{style:'currency',currency:'SGD',maximumFractionDigits:2}).format(n);
export const colors=['#7770d7','#edae77','#6caaa1','#8aa8d0','#cf91aa','#b1b77b','#c396d1','#a8b0bc'];
export const defaultCategories=['Food','Transport','Shopping','Bills','Entertainment','School','Health','Other'];
export const uid=()=>crypto.randomUUID();
export function seed():Data {
 const m=monthKey(); const t=(day:number,amount:number,category:string,description:string,type:'expense'|'income'='expense'):Transaction=>({id:uid(),date:`${m}-${String(Math.min(day,new Date().getDate())).padStart(2,'0')}`,amount,category,description,type,notes:''});
 return {transactions:[t(1,4200,'Salary','Monthly salary','income'),t(2,850,'Bills','Room rental'),t(3,82.5,'Food','Weekly groceries · FairPrice'),t(5,45,'Transport','SimplyGo top-up'),t(7,69.9,'Shopping','A few everyday essentials'),t(8,28,'Food','Lunch at Tiong Bahru'),t(10,15.98,'Entertainment','Spotify Premium'),t(11,60,'Health','Dental check-up'),t(12,24.5,'Food','Coffee & catch-up'),t(13,120,'School','Design course'),t(14,38,'Entertainment','A night at the movies'),t(15,62,'Food','Dinner with friends'),t(16,32,'Transport','Grab ride'),t(16,350,'Other','Freelance illustration','income')],categories:[...defaultCategories,'Salary'],budgets:{[m]:{Food:400,Transport:120,Shopping:150,Bills:1000,Entertainment:50,School:200,Health:100,Other:100}},goals:[{id:uid(),name:'Japan, here I come',target:3500,current:2100,date:`${new Date().getFullYear()+1}-04-01`},{id:uid(),name:'A little peace of mind',target:10000,current:4250,date:`${new Date().getFullYear()+1}-12-31`}],recurring:[{id:uid(),name:'Spotify Premium',amount:15.98,category:'Entertainment',day:10,start:m}],dark:false,seeded:true};
}
export function load():Data {const raw=localStorage.getItem(key); if(!raw)return seed(); try {const d=JSON.parse(raw); if(!Array.isArray(d.transactions)||!Array.isArray(d.categories)||!d.budgets||!Array.isArray(d.goals)||!Array.isArray(d.recurring))throw Error(); return d;}catch{throw new Error('Your saved data could not be read. Export or back up browser storage before clearing it.');}}
export function materialize(d:Data):Data {
 const m=monthKey();const transactions=[...d.transactions];
 const posted=new Set(d.postedRecurring||transactions.map(t=>t.recurringId).filter((x):x is string=>!!x));
 for(const r of d.recurring){
  if(r.start>m)continue;
  const marker=`${r.id}:${m}`;
  const last=new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate();
  const date=`${m}-${String(Math.min(last,r.day)).padStart(2,'0')}`;
  if(date<=today()&&!posted.has(marker)){
   const seedMatch=d.seeded&&r.name==='Spotify Premium'&&transactions.some(t=>t.description===r.name&&t.date.startsWith(m));
   if(!seedMatch)transactions.push({id:uid(),date,amount:r.amount,type:'expense',category:r.category,description:r.name,notes:'Recurring monthly expense',recurringId:marker});
   posted.add(marker);
  }
 }
 return {...d,transactions,postedRecurring:[...posted]};
}
