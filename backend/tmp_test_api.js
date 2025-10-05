// tmp_test_api.js - automated integration test for apply/approve flow
const fetch = require('node-fetch');
(async ()=>{
  try{
    const base='http://localhost:3000';
    const rnd=Date.now()%100000;
    const menteeEmail='test_mentee_'+rnd+'@example.com';
    console.log('menteeEmail',menteeEmail);

    // register mentee
    let r=await fetch(base+'/auth/register',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:menteeEmail,password:'Pass1234!',full_name:'Test Mentee'})});
    let j=await r.json();console.log('register',r.status,j);
    const access=j.accessToken; if(!access){console.error('no token from register'); process.exit(1);} 

    // apply
    r=await fetch(base+'/mentors/apply',{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+access}});
    j=await r.json();console.log('apply',r.status,j);

    // create admin user (if exists the register may return 409 so handle)
    const adminEmail='test_admin@example.com';
    r=await fetch(base+'/auth/register',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:adminEmail,password:'AdminPass123!',full_name:'Admin User',role:'ADMIN'})});
    j=await r.json();console.log('admin register',r.status,j);
    // if 409, login
    let adminAccess;
    if(r.status===201){ adminAccess=j.accessToken; }
    else{
      r=await fetch(base+'/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:adminEmail,password:'AdminPass123!'})}); j=await r.json(); console.log('admin login',r.status,j); adminAccess=j.accessToken;
    }
    if(!adminAccess){console.error('no admin token'); process.exit(1);} 

    // list pending via admin
    r=await fetch(base+'/admin/mentors/pending',{method:'GET',headers:{'authorization':'Bearer '+adminAccess}});j=await r.json();console.log('pending',r.status,JSON.stringify(j).slice(0,800));

    // find pending user id and approve
    const items=j.items||[];const pending = items.find(it=>it.user_id && it.user_id.email===menteeEmail);
    if(!pending){console.log('pending not found, items count',items.length); process.exit(1);} 
    const userId=pending.user_id._id; r=await fetch(base+'/admin/mentors/'+userId+'/approve',{method:'PATCH',headers:{'authorization':'Bearer '+adminAccess}}); j=await r.json(); console.log('approve',r.status,j);

    console.log('\nDone');
  }catch(e){console.error('err',e); process.exit(1);} 
})();
