(function(){
"use strict";

/* ================= product data ================= */
var P = [
  {id:"w01",name:"Linen Column Dress",gender:"women",type:"Dress",shape:"aline",price:4850,tag:"New",
   fabric:"100% washed European linen, 190gsm",fit:"Straight through the body, falls below the knee",care:"Cold machine wash, line dry, warm iron",
   colors:[{n:"Bone",h:"#E9E3D6"},{n:"Clay",h:"#B98A70"},{n:"Ink",h:"#23262C"}]},
  {id:"w02",name:"Silk-Wash Wrap Dress",gender:"women",type:"Dress",shape:"wrap",price:5400,
   fabric:"Sandwashed viscose with a matte silk hand",fit:"True wrap with a self tie at the waist",care:"Gentle wash or dry clean, cool iron",
   colors:[{n:"Olive",h:"#5E6448"},{n:"Plum",h:"#5C3A47"},{n:"Sand",h:"#D6C4A8"}]},
  {id:"w03",name:"Slip Midi Dress",gender:"women",type:"Dress",shape:"slip",price:4200,oldPrice:4900,
   fabric:"Cupro-blend satin, fully cut on the bias",fit:"Skims the body, adjustable straps",care:"Hand wash cold, hang to dry",
   colors:[{n:"Pearl",h:"#DFD9CE"},{n:"Slate",h:"#4A5560"},{n:"Wine",h:"#63313A"}]},
  {id:"w04",name:"Boxy Cotton Tee",gender:"women",type:"T-Shirt",shape:"tee",price:1450,tag:"Best seller",
   fabric:"Combed organic cotton, 220gsm",fit:"Boxy, sits at the hip",care:"Machine wash warm, tumble low",
   colors:[{n:"White",h:"#F4F2EC"},{n:"Black",h:"#1C1E20"},{n:"Sage",h:"#94A88F"},{n:"Butter",h:"#E7CE94"}]},
  {id:"w05",name:"Poplin Oversized Shirt",gender:"women",type:"Shirt",shape:"shirt",price:3200,
   fabric:"Crisp cotton poplin, mother-of-pearl buttons",fit:"Oversized, dropped shoulder",care:"Machine wash cold, iron while damp",
   colors:[{n:"White",h:"#F4F2EC"},{n:"Blue Stripe",h:"#A9BFD4"},{n:"Moss",h:"#6E7A5C"}]},
  {id:"w06",name:"Ribbed Camisole",gender:"women",type:"Top",shape:"cami",price:1150,
   fabric:"2×2 rib cotton-modal",fit:"Close fitting with a scoop neck",care:"Machine wash cold, do not bleach",
   colors:[{n:"Ivory",h:"#EEE8DC"},{n:"Black",h:"#1C1E20"},{n:"Cocoa",h:"#7A5F4E"}]},
  {id:"w07",name:"Georgette V-Neck Blouse",gender:"women",type:"Top",shape:"blouse",price:2600,
   fabric:"Lightweight georgette with a soft drape",fit:"Relaxed, blouson sleeve",care:"Gentle wash, cool iron",
   colors:[{n:"Blush",h:"#DFB9AE"},{n:"Ink",h:"#23262C"},{n:"Fern",h:"#4F6350"}]},
  {id:"w08",name:"Cropped Loopback Sweat",gender:"women",type:"Sweatshirt",shape:"crop",price:2900,
   fabric:"Loopback cotton terry, 320gsm",fit:"Cropped at the waist, ribbed hem",care:"Wash inside out, dry flat",
   colors:[{n:"Grey Melange",h:"#B3B6B2"},{n:"Ecru",h:"#E3DCCC"},{n:"Pine",h:"#33544B"}]},

  {id:"m01",name:"Heavy Cotton Crew Tee",gender:"men",type:"T-Shirt",shape:"tee",price:1350,tag:"Best seller",
   fabric:"Ring-spun cotton, 240gsm, ribbed collar",fit:"Regular, straight body",care:"Machine wash warm, tumble low",
   colors:[{n:"White",h:"#F4F2EC"},{n:"Black",h:"#1C1E20"},{n:"Navy",h:"#2A3A50"},{n:"Rust",h:"#A65B3D"}]},
  {id:"m02",name:"Oxford Button-Down",gender:"men",type:"Shirt",shape:"shirt",price:3450,
   fabric:"Yarn-dyed cotton oxford, button-down collar",fit:"Regular through the chest",care:"Machine wash cold, hang dry",
   colors:[{n:"Sky",h:"#A9C4DA"},{n:"White",h:"#F4F2EC"},{n:"Stone",h:"#C6BCA9"}]},
  {id:"m03",name:"Piqué Polo",gender:"men",type:"Polo",shape:"polo",price:2250,
   fabric:"Cotton piqué with a flat-knit collar",fit:"Trim, sits at the hip",care:"Machine wash cold, reshape damp",
   colors:[{n:"Forest",h:"#3B5A46"},{n:"Chalk",h:"#EDE8DE"},{n:"Charcoal",h:"#3A3E42"}]},
  {id:"m04",name:"Brushed Flannel Overshirt",gender:"men",type:"Shirt",shape:"shirt",price:3900,tag:"New",
   fabric:"Brushed cotton flannel, chest pocket",fit:"Roomy — wears over a tee",care:"Machine wash warm, tumble low",
   colors:[{n:"Rust Check",h:"#9C5238"},{n:"Green Check",h:"#4B6047"},{n:"Ash",h:"#767B7E"}]},
  {id:"m05",name:"Loopback Hoodie",gender:"men",type:"Sweatshirt",shape:"hoodie",price:4100,
   fabric:"Heavyweight loopback terry, 400gsm",fit:"Regular, kangaroo pocket",care:"Wash inside out, dry flat",
   colors:[{n:"Charcoal",h:"#35393B"},{n:"Oat",h:"#DDD2BE"},{n:"Navy",h:"#2A3A50"}]},
  {id:"m06",name:"Long-Sleeve Henley",gender:"men",type:"Top",shape:"henley",price:2400,oldPrice:2800,
   fabric:"Slub cotton jersey, four-button placket",fit:"Regular with a slight taper",care:"Machine wash cold, tumble low",
   colors:[{n:"Oat",h:"#DDD2BE"},{n:"Black",h:"#1C1E20"},{n:"Clay",h:"#B98A70"}]},
  {id:"m07",name:"Relaxed Linen Shirt",gender:"men",type:"Shirt",shape:"shirt",price:3600,
   fabric:"Garment-washed linen, camp collar",fit:"Relaxed and airy",care:"Machine wash cold, wear the wrinkles",
   colors:[{n:"Chalk",h:"#EDE8DE"},{n:"Sea",h:"#7C9AA6"},{n:"Olive",h:"#5E6448"}]},
  {id:"m08",name:"Crew Sweatshirt",gender:"men",type:"Sweatshirt",shape:"sweat",price:3300,
   fabric:"Brushed-back fleece, 350gsm",fit:"Regular with ribbed cuffs and hem",care:"Machine wash cold, dry flat",
   colors:[{n:"Grey Melange",h:"#B3B6B2"},{n:"Pine",h:"#33544B"},{n:"Black",h:"#1C1E20"}]},

  /* --- real stock ---------------------------------------------------------
     img    : a photo in the images/ folder, used instead of the drawing
     sizes  : the exact measurements of the pieces you actually have.
              chestMin/chestMax = the body chest this piece fits (inches)
              length            = shoulder to hem (inches)                    */
  {id:"r01",name:"Off White Cotton Tee",gender:"men",type:"T-Shirt",shape:"tee",price:180,
   img:"images/offwhite-tee.jpg",
   fabric:"Cotton jersey, ribbed crew neck",fit:"Regular, straight body",care:"Machine wash cold, tumble dry low",
   colors:[{n:"Off White Cream",h:"#F2EBDD"}],
   sizes:[{size:"M",chestMin:36,chestMax:38.5,length:27,stock:2}]},

  {id:"r02",name:"Black Cotton Tee",gender:"men",type:"T-Shirt",shape:"tee",price:180,
   img:"images/black-tee.jpg",
   fabric:"Cotton jersey, ribbed crew neck",fit:"Regular, straight body",care:"Machine wash cold, tumble dry low",
   colors:[{n:"Black",h:"#1C1E20"}],
   sizes:[{size:"S",chestMin:34,chestMax:36.5,length:27,stock:1},
          {size:"M",chestMin:36,chestMax:38.5,length:27,stock:1},
          {size:"L",chestMin:38,chestMax:40.5,length:29,stock:1}]}
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

try{
  var savedFit=localStorage.getItem("dreamofall.fit");
  if(savedFit){
    var f=JSON.parse(savedFit);
    if(f&&f.chest&&f.len){ state.fit=f; state.gender=f.gender||"all"; state.type=f.type||"all"; }
  }
}catch(e){}

function save(){ try{ localStorage.setItem("dreamofall.cart",JSON.stringify(state.cart)); }catch(e){} }
function saveFit(){ try{ localStorage.setItem("dreamofall.fit",JSON.stringify(state.fit)); }catch(e){} }

var TYPES=["all"].concat(P.map(function(p){return p.type;}).filter(function(v,i,a){return a.indexOf(v)===i;}).sort());

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
  var tag=p.oldPrice?'<span class="tag" data-kind="sale">Sale</span>':(p.tag?'<span class="tag">'+esc(p.tag)+"</span>":"");
  var st=stockTotal(p);
  if(st===0) tag='<span class="tag" data-kind="sale">Sold out</span>';
  else if(st!==null&&st<=5) tag='<span class="tag" data-kind="low">Only '+st+' left</span>';
  return '<article class="card">'+
    '<div class="plate"'+(p.img?' data-photo="true"':"")+'>'+tag+
      '<button class="plate-open" data-open="'+p.id+'" aria-label="View '+esc(p.name)+'" style="display:block;width:100%;">'+artHTML(p,col)+"</button>"+
      '<button class="quick" data-open="'+p.id+'">Choose size</button>'+
    "</div>"+
    '<div class="meta"><div><div class="name">'+esc(p.name)+badge+"</div>"+
      '<div class="sub">'+esc(p.gender==="women"?"Women":"Men")+" · "+esc(p.type)+" · "+esc(col.n)+"</div></div>"+
      '<div class="price">'+(p.oldPrice?"<s>"+money(p.oldPrice)+"</s>":"")+money(p.price)+"</div></div>"+
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
        '<br><br><button class="btn btn-ghost btn-sm" id="fitEdit2">Change measurements</button>';
    }
    g.innerHTML='<div class="empty">'+msg+"</div>";
  }else{
    g.innerHTML=list.map(cardHTML).join("");
  }
  $("#countNote").textContent=list.length+(list.length===1?" piece":" pieces");
}

/* ================= render: hero ================= */
function renderHero(){
  var picks=[P[0],P[8],P[4]];
  $("#heroArt").innerHTML=picks.map(function(p){
    return '<figure><button data-open="'+p.id+'" aria-label="View '+esc(p.name)+'" style="display:block;width:100%;">'+
      garmentSVG(p.shape,p.colors[0].h)+"</button><figcaption>"+esc(p.type)+"</figcaption></figure>";
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
    '<div class="detail-grid"><div class="detail-art">'+artHTML(p,col)+"</div>"+
    '<div class="detail-info">'+
      '<div><p class="eyebrow">'+esc(p.gender==="women"?"Women":"Men")+" · "+esc(p.type)+"</p>"+
      "<h3>"+esc(p.name)+"</h3></div>"+
      '<div class="price-block">'+
        '<div class="detail-price">'+money(p.price)+(p.oldPrice?" <s>"+money(p.oldPrice)+"</s>":"")+"</div>"+
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
        "<div><dt>Delivery</dt><dd>Dhaka next-day · 2–4 days elsewhere · free over ৳3,000</dd></div>"+
      "</dl>"+
    "</div></div>";
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
function cartTotals(){
  var sub=state.cart.reduce(function(a,l){return a+l.price*l.qty;},0);
  var ship=sub===0?0:(sub>=3000?0:120);
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
    foot.innerHTML=
      '<div class="sumrow"><span>Subtotal</span><span>'+money(t.sub)+"</span></div>"+
      '<div class="sumrow"><span>Delivery</span><span>'+(t.ship===0?"Free":money(t.ship))+"</span></div>"+
      (t.ship>0?'<p class="ship-note">Add '+money(3000-t.sub)+" more for free delivery.</p>":"")+
      '<div class="sumrow total"><span>Total</span><span>'+money(t.total)+"</span></div>"+
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

  if(el.hasAttribute("data-open")){ openDetail(el.getAttribute("data-open")); return; }

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
    state.type=el.getAttribute("data-type");
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
    var bcol=bp.colors[state.sel[bp.id]||0];
    var msg="Hello Dream of All, I would like to order:\n\n"+
      bp.name+"\n"+
      "Size: "+detailState.size+"\n"+
      "Colour: "+bcol.n+"\n"+
      "Quantity: "+detailState.qty+"\n"+
      "Price: "+money(bp.price*detailState.qty)+"\n\n"+
      "My name:\nDelivery address:\nPhone:";
    window.open("https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent(msg),"_blank");
    return;
  }
  if(t.closest("#checkout")){
    state.placed="DOA-"+Math.floor(100000+Math.random()*899999);
    state.cart=[]; save(); renderCart(); return;
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

/* ================= measurement gate ================= */
var gateDraft={gender:"women"};

function renderFitBar(){
  var bar=$("#fitBar");
  if(!state.fit){ bar.hidden=true; return; }
  bar.hidden=false;
  $("#fitVals").textContent=
    "chest "+state.fit.chest+"″ · length "+state.fit.len+"″ ± "+state.fit.tol+"″"+
    " — showing only what fits";
}

function fillGateTypes(){
  $("#gateType").innerHTML=TYPES.map(function(t){
    return '<option value="'+esc(t)+'">'+(t==="all"?"Everything":esc(t))+"</option>";
  }).join("");
}

function openGate(){
  var f=state.fit||{};
  gateDraft.gender=f.gender||"women";
  fillGateTypes();
  $("#gateChest").value=f.chest||"";
  $("#gateLen").value=f.len||"";
  $("#gateType").value=f.type||"all";
  $("#gateTol").value=String(f.tol||2);
  $("#gateErr").hidden=true;
  document.querySelectorAll("#gateGender .chip").forEach(function(b){
    b.setAttribute("aria-pressed",String(b.getAttribute("data-gg")===gateDraft.gender));
  });
  $("#gate").hidden=false;
  document.body.style.overflow="hidden";
  setTimeout(function(){ $("#gateChest").focus(); },60);
}

function closeGate(){
  $("#gate").hidden=true;
  if(!state.open) document.body.style.overflow="";
}

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
    return;
  }
  if(ev.target.closest&&(ev.target.closest("#fitEdit")||ev.target.closest("#fitEdit2"))){ openGate(); return; }
  if(ev.target.closest&&ev.target.closest("#gateGo")){
    var chest=parseFloat($("#gateChest").value);
    var len=parseFloat($("#gateLen").value);
    $("#gateChest").setAttribute("data-bad",String(!(chest>=24&&chest<=60)));
    $("#gateLen").setAttribute("data-bad",String(!(len>=14&&len<=60)));
    if(!(chest>=24&&chest<=60)){ gateError("Chest should be between 24 and 60 inches."); return; }
    if(!(len>=14&&len<=60)){ gateError("Length should be between 14 and 60 inches."); return; }
    state.fit={gender:gateDraft.gender,chest:chest,len:len,
               type:$("#gateType").value,tol:parseFloat($("#gateTol").value)||2};
    saveFit();
    state.gender=state.fit.gender;
    state.type=state.fit.type;
    state.q=""; $("#q").value="";
    closeGate();
    syncChips(); renderTypeChips(); renderFitBar(); renderGrid();
    document.getElementById("shop").scrollIntoView({behavior:"smooth",block:"start"});
    var n=visible().length;
    toast(n?n+(n===1?" piece":" pieces")+" fit your measurements":"Nothing matched — try a wider tolerance");
    return;
  }
});

$("#gateChest").addEventListener("keydown",function(e){ if(e.key==="Enter") $("#gateGo").click(); });
$("#gateLen").addEventListener("keydown",function(e){ if(e.key==="Enter") $("#gateGo").click(); });

/* ================= boot ================= */
renderTypeChips();
renderHero();
renderFitBar();
renderGrid();
renderCart();
document.querySelector('#nav button[data-nav="all"]').setAttribute("aria-current","true");
syncChips();
if(!state.fit) openGate();

})();
