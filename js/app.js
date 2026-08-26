(function(){
"use strict";

/* ================= product data ================= */
var P = [
  {id:"w04",name:"Boxy Cotton Tee",gender:"women",type:"T-Shirt",shape:"tee",price:1450,tag:"Best seller",
   fabric:"Combed organic cotton, 220gsm",fit:"Boxy, sits at the hip",care:"Machine wash warm, tumble low",
   colors:[{"n":"White","h":"#F4F2EC"},{"n":"Black","h":"#1C1E20"},{"n":"Sage","h":"#94A88F"},{"n":"Butter","h":"#E7CE94"}]},

  {id:"w08",name:"Cropped Loopback Sweat",gender:"women",type:"Sweatshirt",shape:"crop",price:2900,
   fabric:"Loopback cotton terry, 320gsm",fit:"Cropped at the waist, ribbed hem",care:"Wash inside out, dry flat",
   colors:[{"n":"Grey Melange","h":"#B3B6B2"},{"n":"Ecru","h":"#E3DCCC"},{"n":"Pine","h":"#33544B"}]},

  {id:"m01",name:"Heavy Cotton Crew Tee",gender:"men",type:"T-Shirt",shape:"tee",price:1350,tag:"Best seller",
   fabric:"Ring-spun cotton, 240gsm, ribbed collar",fit:"Regular, straight body",care:"Machine wash warm, tumble low",
   colors:[{"n":"White","h":"#F4F2EC"},{"n":"Black","h":"#1C1E20"},{"n":"Navy","h":"#2A3A50"},{"n":"Rust","h":"#A65B3D"}]},

  {id:"m03",name:"Piqué Polo",gender:"men",type:"Polo",shape:"polo",price:2250,
   fabric:"Cotton piqué with a flat-knit collar",fit:"Trim, sits at the hip",care:"Machine wash cold, reshape damp",
   colors:[{"n":"Forest","h":"#3B5A46"},{"n":"Chalk","h":"#EDE8DE"},{"n":"Charcoal","h":"#3A3E42"}]},

  {id:"m05",name:"Loopback Hoodie",gender:"men",type:"Sweatshirt",shape:"hoodie",price:4100,
   fabric:"Heavyweight loopback terry, 400gsm",fit:"Regular, kangaroo pocket",care:"Wash inside out, dry flat",
   colors:[{"n":"Charcoal","h":"#35393B"},{"n":"Oat","h":"#DDD2BE"},{"n":"Navy","h":"#2A3A50"}]},

  {id:"m08",name:"Crew Sweatshirt",gender:"men",type:"Sweatshirt",shape:"sweat",price:3300,
   fabric:"Brushed-back fleece, 350gsm",fit:"Regular with ribbed cuffs and hem",care:"Machine wash cold, dry flat",
   colors:[{"n":"Grey Melange","h":"#B3B6B2"},{"n":"Pine","h":"#33544B"},{"n":"Black","h":"#1C1E20"}]},

  {id:"r01",name:"Off White Cotton Tee",gender:"men",type:"T-Shirt",shape:"tee",price:180,
   img:"images/offwhite-tee.jpg",
   fabric:"Cotton jersey, ribbed crew neck",fit:"Regular, straight body",care:"Machine wash cold, tumble dry low",
   colors:[{"n":"Off White Cream","h":"#F2EBDD"}],
   sizes:[{"size":"M","chestMin":36,"chestMax":38.5,"length":27,"stock":2}]},

  {id:"r03",name:"Let’s Get Exploring Print Tee",gender:"men",type:"T-Shirt",shape:"tee",price:180,tag:"New",
   img:"images/exploring-tee.jpg",
   fabric:"Cotton jersey with a white front print",fit:"Regular, straight body",care:"Wash inside out, cold water, do not iron the print",
   colors:[{"n":"Black","h":"#141414"}],
   sizes:[{"size":"XXS","chestMin":30,"chestMax":32.5,"length":24,"stock":1}]},

  {id:"r04",name:"Grey Cotton Tee",gender:"men",type:"T-Shirt",shape:"tee",price:180,
   img:"images/grey-tee.jpg",
   fabric:"Cotton jersey, ribbed crew neck",fit:"Regular, straight body",care:"Machine wash cold, tumble dry low",
   colors:[{"n":"Charcoal Grey","h":"#565A5E"}],
   sizes:[{"size":"XL","chestMin":40,"chestMax":42.5,"length":31,"stock":2}]},

  {id:"r02",name:"Black Cotton Tee",gender:"men",type:"T-Shirt",shape:"tee",price:180,
   img:"images/black-tee.jpg",
   fabric:"Cotton jersey, ribbed crew neck",fit:"Regular, straight body",care:"Machine wash cold, tumble dry low",
   colors:[{"n":"Black","h":"#1C1E20"}],
   sizes:[{"size":"S","chestMin":34,"chestMax":36.5,"length":27,"stock":1},{"size":"M","chestMin":36,"chestMax":38.5,"length":27,"stock":1},{"size":"L","chestMin":38,"chestMax":40.5,"length":29,"stock":1}]},

  {id:"r05",name:"Orange Reflective Stripe Tee",gender:"men",type:"T-Shirt",shape:"tee",price:180,tag:"New",
   img:"images/orange-reflective-tee.jpg",
   fabric:"Cotton jersey with a white reflective chest stripe",fit:"Regular, straight body",care:"Wash inside out, cold water, do not iron the stripe",
   colors:[{"n":"Safety Orange","h":"#FA7002"}],
   sizes:[{"size":"S","chestMin":36,"chestMax":38.5,"length":28,"stock":1},{"size":"L","chestMin":42,"chestMax":44.5,"length":29,"stock":2},{"size":"XL","chestMin":46,"chestMax":48.5,"length":29,"stock":1},{"size":"XXL","chestMin":48,"chestMax":50.5,"length":30,"stock":1}]},

  {id:"r06",name:"Walk Me Bicycle Print Tee",gender:"men",type:"T-Shirt",shape:"tee",price:180,tag:"New",
   img:"images/royalblue-walk-tee.jpg",
   fabric:"Cotton jersey with a front bicycle print",fit:"Regular, straight body",care:"Wash inside out, cold water, do not iron the print",
   colors:[{"n":"Royal Blue","h":"#19348C"}],
   sizes:[{"size":"XL","chestMin":44,"chestMax":46.5,"length":29,"stock":1}]},

  {id:"r07",name:"Royal Blue Stripe Band Tee",gender:"men",type:"T-Shirt",shape:"tee",price:180,tag:"New",
   img:"images/royalblue-stripe-tee.jpg",
   fabric:"Cotton jersey with a printed stripe band across the chest",fit:"Regular, straight body",care:"Wash inside out, cold water, do not iron the print",
   colors:[{"n":"Royal Blue","h":"#12318A"}],
   sizes:[{"size":"XL","chestMin":44,"chestMax":46.5,"length":29,"stock":1}]},

  {id:"r08",name:"New York USA Print Tee",gender:"men",type:"T-Shirt",shape:"tee",price:180,tag:"New",
   img:"images/newyork-black-tee.jpg",
   fabric:"Cotton jersey with a New York USA front print",fit:"Regular, straight body",care:"Wash inside out, cold water, do not iron the print",
   colors:[{"n":"Black","h":"#161817"}],
   sizes:[{"size":"XL","chestMin":42,"chestMax":44.5,"length":31,"stock":2}]},

  {id:"r09",name:"Endurance Text Print Tee",gender:"men",type:"T-Shirt",shape:"tee",price:180,tag:"New",
   img:"images/endurance-blue-tee.jpg",
   fabric:"Cotton jersey with a bold black text print",fit:"Regular, straight body",care:"Wash inside out, cold water, do not iron the print",
   colors:[{"n":"Blue","h":"#1F3799"}],
   sizes:[{"size":"XL","chestMin":44,"chestMax":46.5,"length":29,"stock":1}]}
];

/* your WhatsApp number in international form, no + and no spaces */
var WA_NUMBER = "8801342240408";

var SIZES = {women:["XS","S","M","L","XL"],men:["S","M","L","XL","XXL"]};

/* ================= size + fit engine =================
   CHEST  — the body chest/bust range (in inches) each label size is cut for.
   LEN_BASE — garment length in inches (shoulder seam to hem) for the SMALLEST
              size of each shape. Each size up adds LEN_STEP.
   Edit these three tables to match your own measurement chart.        */
var CHEST = {
  women:{XS:[30,32.5],S:[32.5,35],M:[35,37.5],L:[37.5,40],XL:[40,43]},
  men:  {S:[35,37.5],M:[37.5,40.5],L:[40.5,43.5],XL:[43.5,46.5],XXL:[46.5,50]}
};
var LEN_BASE = {tee:24.5,henley:26,sweat:25.5,crop:17.5,shirt:27,polo:26.5,
                hoodie:26,blouse:23.5,cami:22,aline:38,wrap:42,slip:46};
var LEN_STEP = 0.5;

/* every size of one product, with its chest range and finished length */
function sizeTable(p){
  if(p.sizes&&p.sizes.length) return p.sizes;
  var list=SIZES[p.gender], base=LEN_BASE[p.shape]||25;
  return list.map(function(s,i){
    var r=CHEST[p.gender][s];
    return {size:s,chestMin:r[0],chestMax:r[1],length:Math.round((base+i*LEN_STEP)*2)/2};
  });
}

/* how many pieces of one size are left. null = not tracked (always available) */
function stockFor(p,size){
  if(!p.sizes) return null;
  var r=p.sizes.filter(function(x){return x.size===size;})[0];
  return r&&typeof r.stock==="number"?r.stock:null;
}
/* total pieces left across every size; null when stock is not tracked */
function stockTotal(p){
  if(!p.sizes) return null;
  var any=false,n=0;
  p.sizes.forEach(function(r){ if(typeof r.stock==="number"){any=true;n+=r.stock;} });
  return any?n:null;
}
/* how many of this size are already sitting in the bag */
function inBag(p,size){
  return state.cart.filter(function(l){return l.id===p.id&&l.size===size;})
                   .reduce(function(a,l){return a+l.qty;},0);
}

/* the size of this product that fits the customer, or null if none does */
function fitMatch(p,fit){
  if(!fit) return null;
  var tol=fit.tol||2,best=null;
  sizeTable(p).forEach(function(r){
    if(fit.chest<r.chestMin-0.25||fit.chest>r.chestMax+0.25) return;
    var d=Math.abs(r.length-fit.len);
    if(d<=tol&&(!best||d<best.d)) best={d:d,row:r};
  });
  return best?best.row:null;
}

/* closest length we actually stock — used when nothing matches */
function nearestLength(fit){
  var best=null;
  P.forEach(function(p){
    if(fit.type!=="all"&&p.type!==fit.type) return;
    sizeTable(p).forEach(function(r){
      if(fit.chest<r.chestMin-0.25||fit.chest>r.chestMax+0.25) return;
      var d=Math.abs(r.length-fit.len);
      if(!best||d<best.d) best={d:d,len:r.length};
    });
  });
  return best;
}

/* ================= garment illustrations ================= */
var SHAPES = {
  tee:    {sleeve:"short",neck:"crew",   hem:198,hw:40},
  henley: {sleeve:"long", neck:"placket",hem:196,hw:39},
  sweat:  {sleeve:"long", neck:"crew",   hem:190,hw:44,rib:true},
  crop:   {sleeve:"long", neck:"crew",   hem:152,hw:41,rib:true},
  shirt:  {sleeve:"long", neck:"collar", hem:200,hw:42,pocket:true},
  polo:   {sleeve:"short",neck:"polo",   hem:196,hw:38},
  hoodie: {sleeve:"long", neck:"hood",   hem:190,hw:46,rib:true,pouch:true},
  blouse: {sleeve:"long", neck:"v",      hem:194,hw:42},
  cami:   {sleeve:"none", neck:"strap",  hem:190,hw:36},
  aline:  {sleeve:"short",neck:"crew",   hem:224,hw:58,flare:true},
  wrap:   {sleeve:"long", neck:"wrap",   hem:224,hw:56,flare:true,belt:true},
  slip:   {sleeve:"none", neck:"strap",  hem:228,hw:48,flare:true}
};

function luminance(hex){
  var c=hex.replace("#","");
  var r=parseInt(c.slice(0,2),16)/255,g=parseInt(c.slice(2,4),16)/255,b=parseInt(c.slice(4,6),16)/255;
  return 0.2126*r+0.7152*g+0.0722*b;
}

function garmentSVG(shapeKey,hex){
  var s=SHAPES[shapeKey]||SHAPES.tee;
  var light=luminance(hex)>0.52;
  var stroke=light?"rgba(20,24,26,.42)":"rgba(255,255,255,.40)";
  var soft=light?"rgba(20,24,26,.16)":"rgba(255,255,255,.18)";
  var hem=s.hem,hw=s.hw,lx=100-hw,rx=100+hw;
  var strap=s.neck==="strap";
  var shl=strap?78:66, shr=strap?122:134;
  var ax=strap?68:62, bx=strap?132:138, ay=strap?92:88;
  var parts=[];

  // torso
  var d="M"+shl+",42 L"+ax+","+ay+" ";
  if(s.flare) d+="L74,128 ";
  d+="L"+lx+","+hem+" Q100,"+(hem+9)+" "+rx+","+hem+" ";
  if(s.flare) d+="L126,128 ";
  d+="L"+bx+","+ay+" L"+shr+",42 ";
  if(s.neck==="crew"||s.neck==="placket"||s.neck==="polo"||s.neck==="collar"||s.neck==="hood") d+="C124,58 76,58 "+shl+",42 ";
  else if(s.neck==="v"||s.neck==="wrap") d+="L116,44 L100,80 L84,44 L"+shl+",42 ";
  else d+="C118,62 82,62 "+shl+",42 ";
  d+="Z";

  // sleeves
  if(s.sleeve==="short"){
    parts.push('<path d="M66,42 L34,66 L48,100 L62,88 Z" fill="'+hex+'" stroke="'+stroke+'" stroke-width="1.6" stroke-linejoin="round"/>');
    parts.push('<path d="M134,42 L166,66 L152,100 L138,88 Z" fill="'+hex+'" stroke="'+stroke+'" stroke-width="1.6" stroke-linejoin="round"/>');
  }else if(s.sleeve==="long"){
    var cuff=Math.min(166,hem-24);
    parts.push('<path d="M66,42 L34,66 L44,'+cuff+' L68,'+(cuff-4)+' L62,88 Z" fill="'+hex+'" stroke="'+stroke+'" stroke-width="1.6" stroke-linejoin="round"/>');
    parts.push('<path d="M134,42 L166,66 L156,'+cuff+' L132,'+(cuff-4)+' L138,88 Z" fill="'+hex+'" stroke="'+stroke+'" stroke-width="1.6" stroke-linejoin="round"/>');
    parts.push('<path d="M45,'+(cuff-14)+' L67,'+(cuff-18)+' M155,'+(cuff-14)+' L133,'+(cuff-18)+'" fill="none" stroke="'+soft+'" stroke-width="1.4"/>');
  }

  parts.push('<path d="'+d+'" fill="'+hex+'" stroke="'+stroke+'" stroke-width="1.7" stroke-linejoin="round"/>');

  // straps
  if(strap){
    parts.push('<path d="M78,48 L79,16 L87,16 L86,50 Z" fill="'+hex+'" stroke="'+stroke+'" stroke-width="1.4" stroke-linejoin="round"/>');
    parts.push('<path d="M122,48 L121,16 L113,16 L114,50 Z" fill="'+hex+'" stroke="'+stroke+'" stroke-width="1.4" stroke-linejoin="round"/>');
    parts.push('<path d="M82,50 C90,64 110,64 118,50" fill="none" stroke="'+soft+'" stroke-width="1.4"/>');
  }

  // necklines & closures
  if(s.neck==="crew"){
    parts.push('<path d="M70,44 C82,58 118,58 130,44" fill="none" stroke="'+soft+'" stroke-width="1.5"/>');
  }
  if(s.neck==="v"||s.neck==="wrap"){
    parts.push('<path d="M88,45 L100,74 L112,45" fill="none" stroke="'+soft+'" stroke-width="1.4"/>');
  }
  if(s.neck==="collar"||s.neck==="polo"){
    var cs=s.neck==="polo"?0.62:1;
    var y1=40,y2=38+22*cs;
    parts.push('<path d="M'+(100-16*cs)+','+y1+' L100,'+(52+6*cs)+' L'+(100-6*cs)+','+(60+18*cs)+' L'+(100-24*cs)+','+(46+8*cs)+' Z" fill="'+hex+'" stroke="'+stroke+'" stroke-width="1.5" stroke-linejoin="round"/>');
    parts.push('<path d="M'+(100+16*cs)+','+y1+' L100,'+(52+6*cs)+' L'+(100+6*cs)+','+(60+18*cs)+' L'+(100+24*cs)+','+(46+8*cs)+' Z" fill="'+hex+'" stroke="'+stroke+'" stroke-width="1.5" stroke-linejoin="round"/>');
    var pEnd=s.neck==="polo"?104:hem-8;
    parts.push('<path d="M100,'+(56+4*cs)+' L100,'+pEnd+'" fill="none" stroke="'+soft+'" stroke-width="1.4"/>');
    var n=s.neck==="polo"?3:5, step=(pEnd-70)/(n);
    for(var i=0;i<n;i++){
      parts.push('<circle cx="100" cy="'+(70+step*i)+'" r="2.3" fill="none" stroke="'+stroke+'" stroke-width="1.2"/>');
    }
    if(y2){/* keep lint quiet */}
  }
  if(s.neck==="placket"){
    parts.push('<path d="M100,54 L100,108" fill="none" stroke="'+soft+'" stroke-width="1.4"/>');
    for(var j=0;j<4;j++){
      parts.push('<circle cx="100" cy="'+(64+14*j)+'" r="2.2" fill="none" stroke="'+stroke+'" stroke-width="1.2"/>');
    }
  }
  if(s.neck==="hood"){
    parts.push('<path d="M70,44 C70,8 130,8 130,44 C118,60 82,60 70,44 Z" fill="'+hex+'" stroke="'+stroke+'" stroke-width="1.6" stroke-linejoin="round"/>');
    parts.push('<path d="M78,42 C84,20 116,20 122,42" fill="none" stroke="'+soft+'" stroke-width="1.4"/>');
    parts.push('<path d="M92,52 L91,86 M108,52 L109,86" fill="none" stroke="'+stroke+'" stroke-width="1.5" stroke-linecap="round"/>');
    parts.push('<circle cx="91" cy="88" r="2.6" fill="'+soft+'"/><circle cx="109" cy="88" r="2.6" fill="'+soft+'"/>');
  }

  // extras
  if(s.pocket) parts.push('<path d="M74,98 L94,98 L94,118 L84,124 L74,118 Z" fill="none" stroke="'+soft+'" stroke-width="1.4" stroke-linejoin="round"/>');
  if(s.pouch)  parts.push('<path d="M68,146 L132,146 L128,180 L72,180 Z" fill="none" stroke="'+soft+'" stroke-width="1.5" stroke-linejoin="round"/>');
  if(s.belt){
    parts.push('<path d="M86,46 C98,86 116,98 134,102" fill="none" stroke="'+soft+'" stroke-width="1.5"/>');
    parts.push('<path d="M'+(100-hw*0.62)+',122 L'+(100+hw*0.62)+',122 L'+(100+hw*0.60)+',136 L'+(100-hw*0.60)+',136 Z" fill="'+hex+'" stroke="'+stroke+'" stroke-width="1.5" stroke-linejoin="round"/>');
    parts.push('<path d="M126,129 L152,138 L146,146" fill="none" stroke="'+stroke+'" stroke-width="1.5" stroke-linejoin="round"/>');
  }
  if(s.rib){
    parts.push('<path d="M'+(lx+2)+','+(hem-12)+' Q100,'+(hem-3)+' '+(rx-2)+','+(hem-12)+'" fill="none" stroke="'+soft+'" stroke-width="1.4"/>');
  }else{
    parts.push('<path d="M'+(lx+3)+','+(hem-9)+' Q100,'+(hem-1)+' '+(rx-3)+','+(hem-9)+'" fill="none" stroke="'+soft+'" stroke-width="1.2" stroke-dasharray="4 4"/>');
  }

  return '<svg viewBox="0 0 200 254" role="img" aria-label="Illustration of the garment" xmlns="http://www.w3.org/2000/svg">'+
    '<ellipse cx="100" cy="'+(hem+20)+'" rx="'+(hw*0.85)+'" ry="5.5" fill="var(--plate-shadow)"/>'+
    parts.join("")+'</svg>';
}

/* ================= state ================= */
var state={gender:"all",type:"all",q:"",sort:"featured",sel:{},cart:[],open:null,placed:null,fit:null};

P.forEach(function(p){ state.sel[p.id]=0; });

try{
  var saved=localStorage.getItem("dreamofall.cart");
  if(saved){ var c=JSON.parse(saved); if(Array.isArray(c)) state.cart=c; }
}catch(e){}

/* measurements are NOT remembered — the gate is asked again on every visit
   and on every refresh, always with empty fields */
try{ localStorage.removeItem("dreamofall.fit"); }catch(e){}

function save(){ try{ localStorage.setItem("dreamofall.cart",JSON.stringify(state.cart)); }catch(e){} }
function saveFit(){ /* intentionally not stored — see note above */ }

var TYPES=["all"].concat(P.map(function(p){return p.type;}).filter(function(v,i,a){return a.indexOf(v)===i;}).sort());

/* ================= 10% off on everything =================
   DISCOUNT=0.10 মানে ১০% ছাড়। ছাড় বন্ধ করতে 0 বসিয়ে দিন।     */
var DISCOUNT=0.10;
var OFF_BADGE=DISCOUNT>0?'<span class="off-badge">'+Math.round(DISCOUNT*100)+'% OFF</span>':"";

function applyDiscount(list){
  if(!DISCOUNT) return list;
  list.forEach(function(p){
    if(p.discounted) return;
    if(!p.oldPrice) p.oldPrice=p.price;          /* কাটা দাম = আসল দাম */
    p.price=Math.round(p.oldPrice*(1-DISCOUNT)); /* নতুন দাম */
    p.discounted=true;
  });
  return list;
}
applyDiscount(P);

/* ================= Supabase (admin panel data) =================
   ঘর দুটো ফাঁকা থাকলে সব আগের মতোই চলবে — শুধু কোডে লেখা প্রোডাক্ট
   দেখাবে এবং অর্ডার ডেটাবেজে জমা হবে না।                          */
var SB=null;
try{
  if(window.supabase&&window.SUPABASE_URL&&window.SUPABASE_ANON_KEY){
    SB=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
  }
}catch(e){ SB=null; }

function rowToProduct(r){
  return {
    id:r.slug||("db"+r.id),
    dbId:r.id,
    name:r.name,
    gender:r.gender,
    type:r.type,
    shape:r.shape||"tee",
    price:Number(r.price)||0,
    oldPrice:r.old_price?Number(r.old_price):undefined,
    tag:r.tag||undefined,
    img:r.img||undefined,
    fabric:r.fabric||"",
    fit:r.fit||"",
    care:r.care||"",
    colors:(r.colors&&r.colors.length)?r.colors:[{n:"Default",h:"#333333"}],
    sizes:(r.sizes&&r.sizes.length)?r.sizes:undefined
  };
}

function applyProducts(list){
  P.length=0;
  applyDiscount(list);
  list.forEach(function(x){ P.push(x); });
  P.forEach(function(p){ if(state.sel[p.id]===undefined) state.sel[p.id]=0; });
  TYPES=["all"].concat(P.map(function(p){return p.type;})
        .filter(function(v,i,a){return a.indexOf(v)===i;}).sort());
}

function loadProductsFromDb(){
  if(!SB) return Promise.resolve(false);
  return SB.from("products").select("*").eq("active",true)
    .order("sort",{ascending:true}).order("id",{ascending:true})
    .then(function(res){
      if(res.error||!res.data||!res.data.length) return false;
      applyProducts(res.data.map(rowToProduct));
      return true;
    })
    .catch(function(){ return false; });
}

function saveOrderToDb(o){
  if(!SB) return;
  SB.from("orders").insert([o]).then(function(res){
    if(res.error) console.warn("order not saved:",res.error.message);
  });
}

/* ================= helpers ================= */
var $=function(s){return document.querySelector(s);};
function money(n){ return "৳"+n.toLocaleString("en-US"); }
function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }

var CART_ICON='<svg class="bi" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" '+
  'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+
  '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/>'+
  '<path d="M2.5 3h2.6l2.5 12.1a1.8 1.8 0 0 0 1.8 1.4h7.8a1.8 1.8 0 0 0 1.8-1.4L20.5 7H6"/></svg>';

/* a real photo when the product has one, otherwise the drawn garment */
function artHTML(p,col){
  if(p.img) return '<img class="photo" src="'+esc(p.img)+'" alt="'+esc(p.name)+'" loading="lazy">';
  return garmentSVG(p.shape,col.h);
}

var toastTimer=null;
function toast(msg){
  var t=$("#toast"); t.textContent=msg; t.setAttribute("data-show","true");
  clearTimeout(toastTimer); toastTimer=setTimeout(function(){ t.setAttribute("data-show","false"); },2200);
}

function visible(){
  var list=P.filter(function(p){
    if(state.gender==="women"&&p.gender!=="women") return false;
    if(state.gender==="men"&&p.gender!=="men") return false;
    if(state.type!=="all"&&p.type!==state.type) return false;
    if(state.q){
      var hay=(p.name+" "+p.type+" "+p.gender+" "+p.fabric).toLowerCase();
      if(hay.indexOf(state.q.toLowerCase())===-1) return false;
    }
    if(state.fit&&!fitMatch(p,state.fit)) return false;
    return true;
  });
  if(state.sort==="low") list.sort(function(a,b){return a.price-b.price;});
  else if(state.sort==="high") list.sort(function(a,b){return b.price-a.price;});
  else if(state.sort==="name") list.sort(function(a,b){return a.name.localeCompare(b.name);});
  return list;
}

/* ================= render: filters ================= */
function renderTypeChips(){
  $("#typeChips").innerHTML=TYPES.map(function(t){
    return '<button class="chip" data-type="'+esc(t)+'" aria-pressed="'+(state.type===t)+'">'+(t==="all"?"All types":esc(t))+"</button>";
  }).join("");
}

/* ================= render: grid ================= */
function cardHTML(p){
  var ci=state.sel[p.id]||0, col=p.colors[ci];
  var m=state.fit?fitMatch(p,state.fit):null;
  var badge=m?'<span class="fit-badge">Size '+m.size+" · "+m.length+"″</span>":"";
  var st=stockTotal(p);
  var tag="";
  if(st===0) tag='<span class="tag" data-kind="sale">Sold out</span>';
  else if(st!==null&&st<=5) tag='<span class="tag" data-kind="low">Only '+st+' left</span>';
  else if(p.oldPrice) tag='<span class="tag" data-kind="sale">'+Math.round(DISCOUNT*100)+'% OFF</span>';
  /* the product's own label (Best Sell / New …) sits in the top-right corner */
  var tag2=p.tag?'<span class="tag tag-alt">'+esc(p.tag)+"</span>":"";
  return '<article class="card">'+
    '<div class="plate"'+(p.img?' data-photo="true"':"")+'>'+tag+tag2+
      '<button class="plate-open" data-open="'+p.id+'" aria-label="View '+esc(p.name)+'" style="display:block;width:100%;">'+artHTML(p,col)+"</button>"+
      '<button class="quick" data-open="'+p.id+'">Choose size</button>'+
    "</div>"+
    '<div class="meta"><div><div class="name">'+esc(p.name)+badge+"</div>"+
      '<div class="sub">'+esc(p.gender==="women"?"Women":"Men")+" · "+esc(p.type)+" · "+esc(col.n)+"</div></div>"+
      '<div class="price">'+(p.oldPrice?"<s>"+money(p.oldPrice)+"</s>":"")+money(p.price)+
        (p.oldPrice?OFF_BADGE:"")+"</div></div>"+
    '<div class="swatches">'+p.colors.map(function(c,i){
      return '<button class="sw" title="'+esc(c.n)+'" aria-label="'+esc(c.n)+'" data-sw="'+p.id+'" data-i="'+i+'" aria-pressed="'+(i===ci)+'" style="background:'+c.h+'"></button>';
    }).join("")+"</div>"+
  "</article>";
}

function renderGrid(){
  var list=visible();
  var g=$("#grid");
  if(!list.length){
    var msg='<strong>Nothing matches that.</strong><br>Try clearing the search or picking another type.';
    if(state.fit){
      var n=nearestLength(state.fit);
      msg='<strong>Nothing in stock matches those measurements.</strong><br>'+
        (n?"The closest length we cut for a "+state.fit.chest+"″ chest is <strong>"+n.len+"″</strong>. ":"")+
        'Widen the length tolerance or change your measurements.'+
        '<br><br><button class="btn btn-ghost btn-sm" id="fitEdit2">মাপ পরিবর্তন করুন</button>';
    }
    g.innerHTML='<div class="empty">'+msg+"</div>";
  }else{
    g.innerHTML=list.map(cardHTML).join("");
  }
  $("#countNote").textContent=list.length+(list.length===1?" piece":" pieces");
}

/* ================= render: hero ================= */
function renderHero(){
  var el=$("#heroArt"); if(!el) return;
  /* up to three different pieces — works with 1 product or 100 */
  var picks=[];
  [0,Math.floor(P.length/2),P.length-1,1,2].forEach(function(i){
    var p=P[i];
    if(p&&picks.length<3&&picks.indexOf(p)===-1) picks.push(p);
  });
  if(!picks.length){ el.innerHTML=""; return; }
  el.innerHTML=picks.map(function(p){
    var col=(p.colors&&p.colors[0])?p.colors[0]:{h:"#cccccc"};
    var art=p.img
      ? '<img class="photo" src="'+esc(p.img)+'" alt="'+esc(p.name)+'" loading="lazy">'
      : garmentSVG(p.shape,col.h);
    return '<figure><button data-open="'+p.id+'" aria-label="View '+esc(p.name)+'" style="display:block;width:100%;">'+
      art+"</button><figcaption>"+esc(p.type)+"</figcaption></figure>";
  }).join("");
}

/* the small grey line under the price — the size and length being bought */
function unitLine(p,size){
  var rows=sizeTable(p);
  var r=size?rows.filter(function(x){return x.size===size;})[0]:null;
  if(r) return "Size "+r.size+" · "+r.length+"″ length · chest "+r.chestMin+"–"+r.chestMax+"″";
  return rows.length+" size"+(rows.length===1?"":"s")+" · "+rows[0].length+"–"+rows[rows.length-1].length+"″ length";
}

/* ================= render: detail ================= */
var detailState={id:null,size:null,qty:1};

function renderDetail(){
  var p=P.filter(function(x){return x.id===detailState.id;})[0];
  if(!p) return;
  var ci=state.sel[p.id]||0, col=p.colors[ci];
  var rows=sizeTable(p);
  var m=state.fit?fitMatch(p,state.fit):null;
  var sz=detailState.size;
  var left=sz?stockFor(p,sz):null;
  var remaining=(left===null)?null:Math.max(0,left-inBag(p,sz));
  var canBuy=!!sz&&(remaining===null||remaining>0);
  var stockNote="";
  if(sz&&remaining!==null){
    stockNote=remaining>0
      ? '<p class="stock-line"'+(remaining<=2?' data-low="true"':'')+'>Only '+remaining+' piece'+(remaining===1?'':'s')+' left in size '+esc(sz)+'.</p>'
      : '<p class="stock-line" data-low="true">Size '+esc(sz)+' is sold out.</p>';
  }
  var fitLine="";
  if(state.fit){
    fitLine=m
      ? '<p class="fit-line">For a <strong>'+state.fit.chest+"″</strong> chest and a <strong>"+state.fit.len+
        '″</strong> length we suggest <strong>'+m.size+"</strong> — this piece measures "+m.length+"″ long in that size.</p>"
      : '<p class="fit-line">None of these sizes match the measurements you gave.</p>';
  }
  $("#detail").innerHTML=
    '<button class="close-x" id="detailClose" aria-label="Close">'+
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 5l14 14M19 5L5 19"/></svg></button>'+
    '<div class="sheet-scroll">'+
    '<div class="detail-grid"><div class="detail-art">'+artHTML(p,col)+"</div>"+
    '<div class="detail-info">'+
      '<div><p class="eyebrow">'+esc(p.gender==="women"?"Women":"Men")+" · "+esc(p.type)+"</p>"+
      "<h3>"+esc(p.name)+"</h3></div>"+
      '<div class="price-block">'+
        '<div class="detail-price">'+money(p.price)+(p.oldPrice?" <s>"+money(p.oldPrice)+"</s>"+OFF_BADGE:"")+"</div>"+
        '<div class="price-unit">'+esc(unitLine(p,sz))+"</div>"+
        (p.oldPrice?'<span class="save-badge">Save '+money(p.oldPrice-p.price)+"</span>":"")+
      "</div>"+
      '<div class="field"><div class="field-head"><span class="eyebrow">Colour</span><span class="val">'+esc(col.n)+"</span></div>"+
        '<div class="swatches">'+p.colors.map(function(c,i){
          return '<button class="sw sw-lg" data-sw="'+p.id+'" data-i="'+i+'" aria-label="'+esc(c.n)+'" aria-pressed="'+(i===ci)+'" style="background:'+c.h+'"></button>';
        }).join("")+"</div></div>"+
      '<div class="field"><div class="field-head"><span class="eyebrow">Size</span><span class="val">'+esc(p.gender==="women"?"Women’s sizing":"Men’s sizing")+"</span></div>"+
        '<div class="sizes">'+rows.map(function(r){
          return '<button class="size" data-size="'+r.size+'" aria-pressed="'+(detailState.size===r.size)+
                 '" title="Chest '+r.chestMin+"–"+r.chestMax+"″ · length "+r.length+'″">'+r.size+"</button>";
        }).join("")+"</div>"+stockNote+fitLine+"</div>"+
      '<div class="field"><span class="eyebrow">Quantity</span>'+
        '<div class="stepper"><button data-q="-1" aria-label="Decrease quantity">−</button><span id="qtyVal">'+detailState.qty+'</span><button data-q="1" aria-label="Increase quantity">+</button></div></div>'+
      '<div class="buy-row">'+
        '<button class="btn btn-outline" id="addBtn">'+CART_ICON+
          "<span>"+(!sz?"Select a size":(canBuy?"Add to cart":"Out of stock"))+"</span></button>"+
        '<button class="btn btn-buy" id="buyBtn">'+CART_ICON+"<span>Buy Now</span></button>"+
      "</div>"+
      '<dl class="specs">'+
        "<div><dt>Fabric</dt><dd>"+esc(p.fabric)+"</dd></div>"+
        "<div><dt>Fit</dt><dd>"+esc(p.fit)+"</dd></div>"+
        "<div><dt>Care</dt><dd>"+esc(p.care)+"</dd></div>"+
        "<div><dt>Delivery</dt><dd>Dhaka next-day · 2–4 days elsewhere · free over ৳500</dd></div>"+
      "</dl>"+
    "</div></div>"+
    "</div>";
  var add=$("#addBtn");
  if(add) add.disabled=!canBuy;
  var buy=$("#buyBtn");
  if(buy) buy.disabled=!canBuy;
}

function openDetail(id){
  var prod=P.filter(function(x){return x.id===id;})[0];
  var pre=prod&&state.fit?fitMatch(prod,state.fit):null;
  detailState={id:id,size:pre?pre.size:null,qty:1};
  var d=$("#detail");
  d.hidden=false;
  renderDetail();
  requestAnimationFrame(function(){
    d.setAttribute("data-shown","true");
    $("#scrim").setAttribute("data-shown","true");
  });
  state.open="detail";
  document.body.style.overflow="hidden";
}

/* ================= render: cart ================= */
/* delivery: free over ৳500, otherwise ৳80 inside Dhaka and ৳120 elsewhere */
var FREE_OVER=500, SHIP_DHAKA=80, SHIP_OUTSIDE=120;

function isDhaka(d){
  var v=String(d||"").toLowerCase().trim();
  return v.indexOf("dhaka")>-1||v.indexOf("ঢাকা")>-1;
}
function shipFor(sub,district){
  if(sub===0) return 0;
  if(sub>=FREE_OVER) return 0;
  return isDhaka(district)?SHIP_DHAKA:SHIP_OUTSIDE;
}

function cartTotals(){
  var sub=state.cart.reduce(function(a,l){return a+l.price*l.qty;},0);
  var ship=sub===0?0:(sub>=FREE_OVER?0:SHIP_OUTSIDE);
  return {sub:sub,ship:ship,total:sub+ship};
}

function renderCart(){
  var body=$("#cartBody"), foot=$("#cartFoot");

  if(state.placed){
    body.innerHTML='<div class="confirm">'+
      '<div class="ring"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 13l4 4L19 7"/></svg></div>'+
      "<h4>Order placed</h4>"+
      "<p>We’ll text you a delivery slot. Pay cash when it arrives.</p>"+
      '<span class="order-id">'+esc(state.placed)+"</span>"+
      "</div>";
    foot.innerHTML='<button class="btn btn-ghost btn-block" id="keepShopping">Keep shopping</button>'+
      '<p class="demo-note">This is a demonstration storefront — nothing was charged and no order was really created.</p>';
    $("#cartCount").textContent="0";
    $("#cartCount").setAttribute("data-empty","true");
    return;
  }

  if(!state.cart.length){
    body.innerHTML='<div class="cart-empty"><strong>Your bag is empty</strong><p>Sixteen pieces are waiting in the collection.</p>'+
      '<button class="btn btn-ghost" id="keepShopping">Browse the collection</button></div>';
    foot.innerHTML='<p class="demo-note">Demonstration storefront — no payment is processed.</p>';
  }else{
    body.innerHTML=state.cart.map(function(l,idx){
      var p=P.filter(function(x){return x.id===l.id;})[0];
      return '<div class="line">'+
        '<div class="thumb">'+garmentSVG(p.shape,l.hex)+"</div>"+
        '<div><div class="ln">'+esc(l.name)+"</div>"+
          '<div class="lsub">'+esc(l.color)+" · "+esc(l.size)+"</div>"+
          '<div class="lrow"><div class="qty">'+
            '<button data-line="'+idx+'" data-d="-1" aria-label="Decrease quantity">−</button>'+
            "<span>"+l.qty+"</span>"+
            '<button data-line="'+idx+'" data-d="1" aria-label="Increase quantity">+</button>'+
          "</div>"+
          '<button class="link-btn" data-remove="'+idx+'">Remove</button></div></div>'+
        '<div class="lp">'+money(l.price*l.qty)+"</div>"+
      "</div>";
    }).join("");
    var t=cartTotals();
    var free=t.ship===0;
    foot.innerHTML=
      '<div class="sumrow"><span>Subtotal</span><span>'+money(t.sub)+"</span></div>"+
      '<div class="sumrow"><span>Delivery</span><span>'+
        (free?"Free":money(SHIP_DHAKA)+" – "+money(SHIP_OUTSIDE))+"</span></div>"+
      (free?"":'<p class="ship-note">Inside Dhaka '+money(SHIP_DHAKA)+", other districts "+money(SHIP_OUTSIDE)+
             ". Add "+money(FREE_OVER-t.sub)+" more for free delivery.</p>")+
      '<div class="sumrow total"><span>Total</span><span>'+
        (free?money(t.total):money(t.sub+SHIP_DHAKA)+" – "+money(t.sub+SHIP_OUTSIDE))+"</span></div>"+
      '<button class="btn btn-primary btn-block" id="checkout">Place order</button>'+
      '<p class="demo-note">Demonstration storefront — no payment is processed.</p>';
  }
  var n=state.cart.reduce(function(a,l){return a+l.qty;},0);
  $("#cartCount").textContent=n;
  $("#cartCount").setAttribute("data-empty",n===0?"true":"false");
}

function openCart(){
  renderCart();
  $("#cart").setAttribute("data-shown","true");
  $("#scrim").setAttribute("data-shown","true");
  state.open="cart";
  document.body.style.overflow="hidden";
}

function closeAll(){
  var d=$("#detail");
  d.setAttribute("data-shown","false");
  $("#cart").setAttribute("data-shown","false");
  $("#scrim").setAttribute("data-shown","false");
  state.open=null;
  document.body.style.overflow="";
  setTimeout(function(){ if(state.open!=="detail") d.hidden=true; },280);
}

/* ================= events ================= */
document.addEventListener("click",function(ev){
  var el=ev.target.closest?ev.target.closest("[data-open],[data-sw],[data-nav],[data-gender],[data-type],[data-size],[data-q],[data-line],[data-remove]"):null;

  // nav
  var nav=ev.target.closest?ev.target.closest("[data-nav]"):null;
  if(nav){
    var v=nav.getAttribute("data-nav");
    state.type="all";
    if(v==="dresses"){ state.gender="all"; state.type="Dress"; }
    else state.gender=v;
    syncChips(); renderTypeChips(); renderGrid();
    document.querySelectorAll("#nav button").forEach(function(b){
      b.setAttribute("aria-current",String(b.getAttribute("data-nav")===v));
    });
    var shop=document.getElementById("shop");
    if(shop) shop.scrollIntoView({behavior:"smooth",block:"start"});
    ev.preventDefault();
    return;
  }

  if(!el) return;

  if(el.hasAttribute("data-open")){
    var openId=el.getAttribute("data-open");
    if(!state.fit){ requireFit({kind:"open",value:openId}); return; }
    openDetail(openId); return;
  }

  if(el.hasAttribute("data-sw")){
    state.sel[el.getAttribute("data-sw")]=parseInt(el.getAttribute("data-i"),10);
    renderGrid();
    if(state.open==="detail") renderDetail();
    return;
  }

  if(el.hasAttribute("data-gender")){
    state.gender=el.getAttribute("data-gender");
    syncChips(); renderGrid(); return;
  }

  if(el.hasAttribute("data-type")){
    var wantType=el.getAttribute("data-type");
    if(!state.fit){ requireFit({kind:"type",value:wantType}); return; }
    state.type=wantType;
    renderTypeChips(); renderGrid(); return;
  }

  if(el.hasAttribute("data-size")){
    detailState.size=el.getAttribute("data-size");
    detailState.qty=1;
    renderDetail(); return;
  }

  if(el.hasAttribute("data-q")){
    var delta=parseInt(el.getAttribute("data-q"),10);
    var pq=P.filter(function(x){return x.id===detailState.id;})[0];
    var cap=9, lft=(pq&&detailState.size)?stockFor(pq,detailState.size):null;
    if(lft!==null) cap=Math.max(1,lft-inBag(pq,detailState.size));
    detailState.qty=Math.max(1,Math.min(cap,detailState.qty+delta));
    renderDetail(); return;
  }

  if(el.hasAttribute("data-line")){
    var i=parseInt(el.getAttribute("data-line"),10);
    var dd=parseInt(el.getAttribute("data-d"),10);
    var lp=P.filter(function(x){return x.id===state.cart[i].id;})[0];
    var lmax=lp?stockFor(lp,state.cart[i].size):null;
    if(dd>0&&lmax!==null&&state.cart[i].qty>=lmax){
      toast("Only "+lmax+" piece"+(lmax===1?"":"s")+" available in size "+state.cart[i].size); return;
    }
    state.cart[i].qty+=dd;
    if(state.cart[i].qty<1) state.cart.splice(i,1);
    save(); renderCart(); return;
  }

  if(el.hasAttribute("data-remove")){
    state.cart.splice(parseInt(el.getAttribute("data-remove"),10),1);
    save(); renderCart(); return;
  }
});

document.addEventListener("click",function(ev){
  var t=ev.target;
  if(t.closest("#addBtn")){
    var p=P.filter(function(x){return x.id===detailState.id;})[0];
    if(!p||!detailState.size) return;
    var col=p.colors[state.sel[p.id]||0];
    var key=p.id+"|"+col.n+"|"+detailState.size;
    var found=state.cart.filter(function(l){return l.key===key;})[0];
    var lim=stockFor(p,detailState.size);
    var want=detailState.qty;
    if(lim!==null){
      want=Math.min(want,Math.max(0,lim-inBag(p,detailState.size)));
      if(want<=0){ toast("Sorry — no more pieces left in size "+detailState.size); return; }
    }
    if(found) found.qty=Math.min(lim===null?20:lim,found.qty+want);
    else state.cart.push({key:key,id:p.id,name:p.name,color:col.n,hex:col.h,size:detailState.size,price:p.price,qty:want});
    save();
    state.placed=null;
    closeAll();
    toast(p.name+" added to your bag");
    var n=state.cart.reduce(function(a,l){return a+l.qty;},0);
    $("#cartCount").textContent=n;
    $("#cartCount").setAttribute("data-empty","false");
    return;
  }
  if(t.closest("#buyBtn")){
    var bp=P.filter(function(x){return x.id===detailState.id;})[0];
    if(!bp||!detailState.size) return;
    if(!state.fit){ requireFit(null); return; }
    var bcol=bp.colors[state.sel[bp.id]||0];
    openOrder([{name:bp.name,color:bcol.n,size:detailState.size,
                qty:detailState.qty,price:bp.price}],"buy");
    return;
  }
  if(t.closest("#addBtn")&&!state.fit){ requireFit(null); return; }
  if(t.closest("#checkout")&&!state.fit){ requireFit(null); return; }
  if(t.closest("#checkout")){
    openOrder(state.cart.map(function(l){
      return {name:l.name,color:l.color,size:l.size,qty:l.qty,price:l.price};
    }),"cart");
    return;
  }
  if(t.closest("#keepShopping")){ state.placed=null; closeAll(); return; }
  if(t.closest("#detailClose")||t.closest("#cartClose")||t.id==="scrim"){ closeAll(); return; }
});

$("#cartBtn").addEventListener("click",function(){ state.placed=null; openCart(); });
$("#scrim").addEventListener("click",closeAll);

document.addEventListener("keydown",function(e){ if(e.key==="Escape"&&state.open) closeAll(); });

$("#q").addEventListener("input",function(e){ state.q=e.target.value.trim(); renderGrid(); });
$("#sort").addEventListener("change",function(e){ state.sort=e.target.value; renderGrid(); });

function syncChips(){
  document.querySelectorAll("#genderChips .chip").forEach(function(b){
    b.setAttribute("aria-pressed",String(b.getAttribute("data-gender")===state.gender));
  });
}

/* theme toggle */
$("#themeBtn").addEventListener("click",function(){
  var cur=document.documentElement.getAttribute("data-theme");
  var prefersDark=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;
  var next;
  if(!cur) next=prefersDark?"light":"dark";
  else next=cur==="dark"?"light":"dark";
  document.documentElement.setAttribute("data-theme",next);
  try{ localStorage.setItem("dreamofall.theme",next); }catch(e){}
});
try{
  var th=localStorage.getItem("dreamofall.theme");
  if(th==="dark"||th==="light") document.documentElement.setAttribute("data-theme",th);
}catch(e){}

/* ================= order form ================= */
var orderCtx=null;   /* {lines:[{name,color,size,qty,price}],sub,ship,total,from} */

function orderTotals(lines,district){
  var sub=lines.reduce(function(a,l){return a+l.price*l.qty;},0);
  var ship=shipFor(sub,district);
  return {sub:sub,ship:ship,total:sub+ship};
}

/* recalculate the delivery charge from the district box and redraw the summary */
function refreshOrderSummary(){
  if(!orderCtx) return;
  var t=orderTotals(orderCtx.lines,$("#oDist").value);
  orderCtx.sub=t.sub; orderCtx.ship=t.ship; orderCtx.total=t.total;
  orderCtx.district=$("#oDist").value.trim();
  $("#orderSum").textContent=orderSummaryText();
}

function orderSummaryText(){
  if(!orderCtx) return "";
  var out="Assalamu alaikum, Dream of All — I would like to place an order.\n\n";
  orderCtx.lines.forEach(function(l){
    out+="• "+l.name+" — "+l.color+" / "+l.size+" × "+l.qty+" = "+money(l.price*l.qty)+"\n";
  });
  var where=orderCtx.ship===0
    ? "Free"
    : money(orderCtx.ship)+(isDhaka(orderCtx.district)?" (inside Dhaka)":" (outside Dhaka)");
  out+="\nSubtotal: "+money(orderCtx.sub)+
       "\nDelivery: "+where+
       "\nTotal: "+money(orderCtx.total)+" (cash on delivery)";
  return out;
}

function openOrder(lines,from){
  if(!lines||!lines.length){ toast("Your bag is empty"); return; }
  var t=orderTotals(lines,"");
  orderCtx={lines:lines,sub:t.sub,ship:t.ship,total:t.total,from:from,district:""};
  $("#orderSum").textContent=orderSummaryText();
  ["oname","ophone","odist","oaddr"].forEach(function(n){ markOrderField(n,false); });
  $("#orderErr").hidden=true;
  syncOrderGo();
  $("#order").hidden=false;
  document.body.style.overflow="hidden";
  setTimeout(function(){ $("#oName").focus(); },60);
}

function closeOrder(){
  $("#order").hidden=true;
  orderCtx=null;
  if(!state.open) document.body.style.overflow="";
}

function orderFieldEl(name){ return document.querySelector('#order [data-field="'+name+'"]'); }
function markOrderField(name,bad,msg){
  var f=orderFieldEl(name); if(!f) return;
  f.classList.toggle("is-bad",!!bad);
  var e=f.querySelector('.field-err[data-err="'+name+'"]');
  if(e){ if(msg) e.textContent=msg; e.hidden=!bad; }
}

function orderProblems(){
  var out=[];
  var phone=$("#oPhone").value.replace(/[^0-9]/g,"");
  if(!$("#oName").value.trim()) out.push({f:"oname",m:"Please write your name."});
  if(!/^01[0-9]{9}$/.test(phone)) out.push({f:"ophone",m:"Please give an 11-digit number starting with 01."});
  if(!$("#oDist").value.trim()) out.push({f:"odist",m:"Please write your district."});
  if($("#oAddr").value.trim().length<10) out.push({f:"oaddr",m:"Please write the full address."});
  return out;
}

function syncOrderGo(){
  var left=orderProblems().length;
  $("#orderGo").classList.toggle("is-incomplete",left>0);
  if(left===0) $("#orderErr").hidden=true;
}

["#oName","#oPhone","#oDist","#oAddr"].forEach(function(sel,i){
  var el=$(sel), name=["oname","ophone","odist","oaddr"][i];
  ["input","change"].forEach(function(evt){
    el.addEventListener(evt,function(){
      if(el.value.trim()!=="") markOrderField(name,false);
      if(name==="odist") refreshOrderSummary();
      syncOrderGo();
    });
  });
});

$("#orderClose").addEventListener("click",closeOrder);
document.addEventListener("keydown",function(e){
  if(e.key==="Escape"&&!$("#order").hidden) closeOrder();
});

$("#orderGo").addEventListener("click",function(){
  if(!orderCtx) return;
  var probs=orderProblems();
  ["oname","ophone","odist","oaddr"].forEach(function(n){ markOrderField(n,false); });
  if(probs.length){
    probs.forEach(function(p){ markOrderField(p.f,true,p.m); });
    var e=$("#orderErr");
    e.textContent=probs.length===1?probs[0].m:"Please complete the "+probs.length+" fields marked in red.";
    e.hidden=false;
    $("#orderGo").classList.add("is-incomplete");
    var first=orderFieldEl(probs[0].f), f=first&&first.querySelector("input,textarea");
    if(f) f.focus();
    return;
  }
  var note=$("#oNote").value.trim();
  var code="DOA-"+Math.floor(100000+Math.random()*899999);
  var msg="Order no: "+code+"\n"+orderSummaryText()+
    "\n\nName: "+$("#oName").value.trim()+
    "\nMobile: "+$("#oPhone").value.trim()+
    "\nDistrict: "+$("#oDist").value.trim()+
    "\nAddress: "+$("#oAddr").value.trim()+
    (note?"\nInstructions: "+note:"")+
    (state.fit?"\nMeasurements: chest "+state.fit.chest+"″, length "+state.fit.len+"″ (± "+state.fit.tol+"″)":"");
  window.open("https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent(msg),"_blank");
  saveOrderToDb({
    code:code,
    name:$("#oName").value.trim(),
    phone:$("#oPhone").value.trim(),
    district:$("#oDist").value.trim(),
    address:$("#oAddr").value.trim(),
    note:note||null,
    items:orderCtx.lines,
    subtotal:orderCtx.sub,
    delivery:orderCtx.ship,
    total:orderCtx.total,
    measurements:state.fit||null
  });
  var from=orderCtx.from;
  closeOrder();
  if(from==="cart"){
    state.placed=code;
    state.cart=[]; save(); renderCart();
  }else{
    toast("Your order is ready in WhatsApp — press send to confirm.");
  }
});

/* ================= measurement gate ================= */
/* nothing is pre-selected — the customer must choose every field */
var gateDraft={gender:null};

/* what the customer was trying to do when the form appeared */
var gatePending=null;
function requireFit(pending){
  gatePending=pending||null;
  openGate();
  toast("আগে আপনার মাপ বলুন — তারপর শুধু যা ফিট হবে তা-ই দেখাব।");
}

/* the "Talk on WhatsApp" button carries the measurements once they are given */
function renderWaTalk(){
  var a=$("#waTalk"); if(!a) return;
  var msg="Hi Dream of All, I would like to ask about a piece.";
  if(state.fit){
    msg+="\nMy measurements — chest "+state.fit.chest+"\", length "+state.fit.len+
         "\" (± "+state.fit.tol+"\"), shopping for "+state.fit.gender+".";
  }
  a.href="https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent(msg);
}

function renderFitBar(){
  renderWaTalk();
  var bar=$("#fitBar"), edit=$("#fitEdit");
  /* the button is always on screen — it invites the measurements, then edits them */
  if(edit){
    edit.hidden=false;
    edit.textContent=state.fit?"মাপ পরিবর্তন করুন":"আপনার মাপ বলুন";
    edit.classList.toggle("is-set",!!state.fit);
  }
  if(!state.fit){ bar.hidden=true; return; }
  bar.hidden=false;
  $("#fitVals").textContent=
    "বুক "+state.fit.chest+"″ · লম্বা "+state.fit.len+"″ ± "+state.fit.tol+"″"+
    " — শুধু যা ফিট, তাই দেখানো হচ্ছে";
}

function fillGateTypes(){
  $("#gateType").innerHTML=
    '<option value="" selected disabled>একটি বেছে নিন…</option>'+
    TYPES.map(function(t){
      return '<option value="'+esc(t)+'">'+(t==="all"?"সবকিছু":esc(t))+"</option>";
    }).join("");
}

/* --- red-mark validation helpers --- */
function gateFieldEl(name){ return document.querySelector('#gate [data-field="'+name+'"]'); }

function markField(name,bad,msg){
  var f=gateFieldEl(name); if(!f) return;
  f.classList.toggle("is-bad",!!bad);
  var e=f.querySelector('.field-err[data-err="'+name+'"]');
  if(e){ if(msg) e.textContent=msg; e.hidden=!bad; }
  var input=f.querySelector("input");
  if(input) input.setAttribute("data-bad",String(!!bad));
}

function clearGateErrors(){
  ["gender","chest","len","type","tol"].forEach(function(n){ markField(n,false); });
  $("#gateErr").hidden=true;
}

/* what is still missing / invalid, in field order */
function gateProblems(){
  var out=[];
  var chest=parseFloat($("#gateChest").value);
  var len=parseFloat($("#gateLen").value);
  if(!gateDraft.gender) out.push({f:"gender",m:"নারী নাকি পুরুষ — একটি বেছে নিন।"});
  if($("#gateChest").value.trim()==="") out.push({f:"chest",m:"বুকের মাপটি লিখুন।"});
  else if(!(chest>=24&&chest<=60)) out.push({f:"chest",m:"বুকের মাপ ২৪ থেকে ৬০ ইঞ্চির মধ্যে হতে হবে।"});
  if($("#gateLen").value.trim()==="") out.push({f:"len",m:"কত লম্বা চান তা লিখুন।"});
  else if(!(len>=14&&len<=60)) out.push({f:"len",m:"লম্বা ১৪ থেকে ৬০ ইঞ্চির মধ্যে হতে হবে।"});
  if(!$("#gateType").value) out.push({f:"type",m:"কী খুঁজছেন তা বেছে নিন।"});
  if(!$("#gateTol").value) out.push({f:"tol",m:"লম্বায় কতটা ছাড় দেবেন বেছে নিন।"});
  return out;
}

/* dim the button while the form is incomplete (it still reports errors on click) */
function syncGateGo(){
  var left=gateProblems().length;
  $("#gateGo").classList.toggle("is-incomplete",left>0);
  if(left===0) $("#gateErr").hidden=true;
}

function openGate(){
  var f=state.fit||{};
  gateDraft.gender=f.gender||null;
  fillGateTypes();
  $("#gateChest").value=(f.chest||f.chest===0)?f.chest:"";
  $("#gateLen").value=(f.len||f.len===0)?f.len:"";
  $("#gateType").value=(gatePending&&gatePending.kind==="type")?gatePending.value:(f.type||"");
  $("#gateTol").value=f.tol?String(f.tol):"";
  clearGateErrors();
  document.querySelectorAll("#gateGender .chip").forEach(function(b){
    b.setAttribute("aria-pressed",String(!!gateDraft.gender&&b.getAttribute("data-gg")===gateDraft.gender));
  });
  syncGateGo();
  $("#gate").hidden=false;
  document.body.style.overflow="hidden";
  setTimeout(function(){ $("#gateChest").focus(); },60);
}

function closeGate(){
  gatePending=null;
  $("#gate").hidden=true;
  if(!state.open) document.body.style.overflow="";
}
$("#gateClose").addEventListener("click",closeGate);
document.addEventListener("keydown",function(e){
  if(e.key==="Escape"&&!$("#gate").hidden) closeGate();
});

function gateError(msg){
  var e=$("#gateErr"); e.textContent=msg; e.hidden=false;
}

document.addEventListener("click",function(ev){
  var g=ev.target.closest?ev.target.closest("[data-gg]"):null;
  if(g){
    gateDraft.gender=g.getAttribute("data-gg");
    document.querySelectorAll("#gateGender .chip").forEach(function(b){
      b.setAttribute("aria-pressed",String(b.getAttribute("data-gg")===gateDraft.gender));
    });
    markField("gender",false);
    syncGateGo();
    return;
  }
  if(ev.target.closest&&(ev.target.closest("#fitEdit")||ev.target.closest("#fitEdit2"))){ openGate(); return; }
  if(ev.target.closest&&ev.target.closest("#gateGo")){
    var probs=gateProblems();
    ["gender","chest","len","type","tol"].forEach(function(n){ markField(n,false); });
    if(probs.length){
      probs.forEach(function(p){ markField(p.f,true,p.m); });
      gateError(probs.length===1
        ? probs[0].m
        : "লাল দাগ দেওয়া "+probs.length+"টি ঘর পূরণ করুন — তারপরই আমরা দেখাতে পারব কী কী আপনার মাপে ফিট।");
      syncGateGo();
      var first=gateFieldEl(probs[0].f);
      var focusable=first&&first.querySelector("input,select,button");
      if(focusable) focusable.focus();
      return;   /* the button does nothing until everything is chosen */
    }
    $("#gateErr").hidden=true;
    state.fit={gender:gateDraft.gender,
               chest:parseFloat($("#gateChest").value),
               len:parseFloat($("#gateLen").value),
               type:$("#gateType").value,
               tol:parseFloat($("#gateTol").value)};
    saveFit();
    state.gender=state.fit.gender;
    state.type=state.fit.type;
    state.q=""; $("#q").value="";
    closeGate();
    syncChips(); renderTypeChips(); renderFitBar(); renderGrid();
    document.getElementById("shop").scrollIntoView({behavior:"smooth",block:"start"});
    var n=visible().length;
    toast(n?n+"টি পোশাক আপনার মাপে ফিট":"কিছুই মিলল না — ছাড় একটু বাড়িয়ে দেখুন");
    /* মাপ দেওয়ার পর আগের প্রোডাক্টটি খোলা হয় না —
       কাস্টমার তার মাপে যা যা আছে, পুরো তালিকাটাই দেখে */
    return;
  }
});

$("#gateChest").addEventListener("keydown",function(e){ if(e.key==="Enter") $("#gateGo").click(); });
$("#gateLen").addEventListener("keydown",function(e){ if(e.key==="Enter") $("#gateGo").click(); });

/* clear a field's red state as soon as the customer fills it in */
[["#gateChest","chest"],["#gateLen","len"],["#gateType","type"],["#gateTol","tol"]]
  .forEach(function(pair){
    var el=$(pair[0]);
    ["input","change"].forEach(function(evt){
      el.addEventListener(evt,function(){
        if(el.value!==""){ markField(pair[1],false); }
        syncGateGo();
      });
    });
  });


/* ================= কাস্টমার রিভিউ =================
   এখানে নতুন রিভিউ যোগ করুন — কাস্টমার শুধু পড়তে ও ছবি দেখতে পারবে।
   একটি রিভিউর ঘরগুলো:
     name   — ক্রেতার নাম
     stars  — ১ থেকে ৫
     date   — যেকোনো লেখা, যেমন "আগস্ট ২০২৬"
     text   — মন্তব্য
     photos — ছবির তালিকা (না থাকলে বাদ দিন), যেমন ["images/review-1.jpg"]
   ছবিগুলো images ফোল্ডারে রাখুন।                                    */
var REVIEWS=[
  {name:"রিয়াদ হাসান",stars:5,date:"আগস্ট ২০২৬",
   text:"কাপড়ের মান খুব ভালো, মাপও ঠিকঠাক এসেছে। ডেলিভারিও দ্রুত ছিল।",
   photos:["images/review-1.jpg"]},

  {name:"সাদিয়া আক্তার",stars:5,date:"আগস্ট ২০২৬",
   text:"ছবিতে যেমন দেখেছি ঠিক তেমনই পেয়েছি। আবার অর্ডার করব ইনশাআল্লাহ।"},

  {name:"তানভীর আহমেদ",stars:4,date:"জুলাই ২০২৬",
   text:"প্রিন্ট সুন্দর, রঙ নষ্ট হয়নি ধোয়ার পরেও। দাম হিসেবে দারুণ।"}
];

function starsHTML(n){
  n=Math.max(0,Math.min(5,Math.round(n||0)));
  var out="";
  for(var i=1;i<=5;i++) out+='<span'+(i<=n?' class="on"':"")+">★</span>";
  return '<span class="stars" aria-label="'+n+' out of 5">'+out+"</span>";
}

function renderReviews(){
  var sec=document.getElementById("reviews");
  var box=document.getElementById("reviewGrid");
  if(!sec||!box) return;
  if(!REVIEWS.length){ sec.hidden=true; return; }
  sec.hidden=false;

  var avg=REVIEWS.reduce(function(a,r){return a+(r.stars||0);},0)/REVIEWS.length;
  var score=document.getElementById("reviewScore");
  if(score) score.innerHTML=starsHTML(avg)+
    '<span class="score-num">'+(Math.round(avg*10)/10)+"</span>"+
    '<span class="score-count">'+REVIEWS.length+"টি রিভিউ</span>";

  box.innerHTML=REVIEWS.map(function(r){
    var photos=(r.photos&&r.photos.length)
      ? '<div class="review-shots">'+r.photos.map(function(src){
          return '<button type="button" class="review-shot" data-shot="'+esc(src)+'">'+
                 '<img src="'+esc(src)+'" alt="" loading="lazy"></button>';
        }).join("")+"</div>"
      : "";
    return '<article class="review">'+
      '<div class="review-top">'+
        '<span class="review-who">'+esc(r.name||"ক্রেতা")+"</span>"+
        (r.date?'<span class="review-date">'+esc(r.date)+"</span>":"")+
      "</div>"+
      starsHTML(r.stars)+
      '<p class="review-text">'+esc(r.text||"")+"</p>"+
      photos+
    "</article>";
  }).join("");
}

/* ছবিতে ক্লিক করলে বড় করে দেখা যায় */
(function(){
  var lb=document.getElementById("lightbox");
  if(!lb) return;
  var img=document.getElementById("lightboxImg");
  function close(){ lb.hidden=true; document.body.style.overflow=""; }
  document.addEventListener("click",function(ev){
    var shot=ev.target.closest?ev.target.closest("[data-shot]"):null;
    if(shot){ img.src=shot.getAttribute("data-shot"); lb.hidden=false; document.body.style.overflow="hidden"; return; }
    if(ev.target.closest&&(ev.target.closest("#lightboxClose")||ev.target===lb)) close();
  });
  document.addEventListener("keydown",function(e){ if(e.key==="Escape"&&!lb.hidden) close(); });
})();

/* ================= boot ================= */
function boot(){
  /* each step on its own, so one hiccup can never blank the shop */
  [renderTypeChips,renderHero,renderFitBar,renderGrid,renderCart,syncChips,renderReviews]
    .forEach(function(fn){
      try{ fn(); }catch(e){ console.warn("boot step failed:",e); }
    });
  try{
    document.querySelector('#nav button[data-nav="all"]').setAttribute("aria-current","true");
  }catch(e){}
}

if(SB) loadProductsFromDb().then(boot,boot); else boot();

/* ================= hero banner slideshow =================
   প্রতি ৩ সেকেন্ডে পরের ছবি। সময় বদলাতে 3000 বদলান।        */
(function(){
  var box=document.getElementById("heroSlides");
  if(!box) return;
  var imgs=[].slice.call(box.querySelectorAll("img"));
  var dots=document.getElementById("slideDots");
  if(imgs.length<2){ if(dots) dots.remove(); return; }
  if(dots) dots.innerHTML=imgs.map(function(_,i){
    return "<i"+(i===0?' class="on"':"")+"></i>";
  }).join("");
  var marks=dots?[].slice.call(dots.children):[];
  var i=0, timer=null;
  function show(n){
    imgs[i].classList.remove("on"); if(marks[i]) marks[i].classList.remove("on");
    i=(n+imgs.length)%imgs.length;
    imgs[i].classList.add("on");  if(marks[i]) marks[i].classList.add("on");
  }
  function start(){ timer=setInterval(function(){ show(i+1); },3000); }
  function stop(){ clearInterval(timer); }
  start();
  box.addEventListener("mouseenter",stop);
  box.addEventListener("mouseleave",start);
  document.addEventListener("visibilitychange",function(){
    if(document.hidden) stop(); else { stop(); start(); }
  });
})();
/* the shop opens straight away — the measurement form is asked for only when
   the customer picks a type or opens a piece, and again on every new visit  */

})();
