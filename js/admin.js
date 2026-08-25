/* =========================================================
   Dream of All — admin panel
   Login, orders and products, all through Supabase.
   ========================================================= */
(function(){
"use strict";

var $=function(s){return document.querySelector(s);};
var $$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s));};
function esc(s){ return String(s==null?"":s).replace(/[&<>"]/g,function(c){
  return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
function money(n){ return "৳"+(Number(n)||0).toLocaleString("en-US"); }

var toastT;
function toast(msg){
  var t=$("#toast"); t.textContent=msg; t.setAttribute("data-show","true");
  clearTimeout(toastT); toastT=setTimeout(function(){ t.removeAttribute("data-show"); },2600);
}

/* ---------- connection ---------- */
var SB=null;
try{
  if(window.supabase&&window.SUPABASE_URL&&window.SUPABASE_ANON_KEY){
    SB=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
  }
}catch(e){ SB=null; }

if(!SB){
  document.body.innerHTML=
    '<div class="login-wrap"><div class="login-card">'+
    '<p class="eyebrow">Setup needed</p><h1>Not connected yet</h1>'+
    '<p class="login-lede">Supabase-এর Project URL আর anon key এখনও বসানো হয়নি। '+
    '<code>js/supabase-config.js</code> ফাইলে দুটো ঘর পূরণ করে আবার push করুন — '+
    'ধাপগুলো <code>SUPABASE-SETUP.md</code> ফাইলে লেখা আছে।</p>'+
    '<p class="gate-foot"><a href="index.html">← Back to the shop</a></p></div></div>';
  return;
}

var BUCKET=window.SUPABASE_BUCKET||"product-images";

/* ---------- login ---------- */
function showLogin(msg){
  $("#panel").hidden=true;
  $("#loginWrap").hidden=false;
  if(msg){ $("#loginErr").textContent=msg; $("#loginErr").hidden=false; }
}
function showPanel(user){
  $("#loginWrap").hidden=true;
  $("#panel").hidden=false;
  $("#whoAmI").textContent=user&&user.email?user.email:"";
  loadOrders();
  loadProducts();
}

SB.auth.getSession().then(function(res){
  var sess=res&&res.data&&res.data.session;
  if(sess&&sess.user) showPanel(sess.user); else showLogin();
});

$("#loginForm").addEventListener("submit",function(ev){
  ev.preventDefault();
  $("#loginErr").hidden=true;
  var btn=$("#loginGo"); btn.disabled=true; btn.textContent="Signing in…";
  SB.auth.signInWithPassword({email:$("#logEmail").value.trim(),password:$("#logPass").value})
    .then(function(res){
      btn.disabled=false; btn.textContent="Sign in";
      if(res.error){ showLogin("Wrong email or password."); return; }
      $("#logPass").value="";
      showPanel(res.data.user);
    });
});

$("#signOut").addEventListener("click",function(){
  SB.auth.signOut().then(function(){ location.reload(); });
});

/* ---------- tabs ---------- */
$$(".admin-tabs .chip").forEach(function(b){
  b.addEventListener("click",function(){
    var tab=b.getAttribute("data-tab");
    $$(".admin-tabs .chip").forEach(function(x){
      x.setAttribute("aria-pressed",String(x===b));
    });
    $("#tabOrders").hidden=tab!=="orders";
    $("#tabProducts").hidden=tab!=="products";
  });
});

/* ================= orders ================= */
var orders=[];

function when(ts){
  if(!ts) return "";
  var d=new Date(ts);
  return d.toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",
                                   hour:"2-digit",minute:"2-digit"});
}

function loadOrders(){
  $("#ordersBox").innerHTML='<div class="empty-note">Loading…</div>';
  SB.from("orders").select("*").order("id",{ascending:false}).limit(300)
    .then(function(res){
      if(res.error){ $("#ordersBox").innerHTML='<div class="empty-note">Could not load orders — '+esc(res.error.message)+"</div>"; return; }
      orders=res.data||[];
      renderOrders();
    });
}

function renderOrders(){
  var f=$("#orderFilter").value;
  var list=orders.filter(function(o){ return f==="all"||o.status===f; });
  if(!list.length){ $("#ordersBox").innerHTML='<div class="empty-note">No orders here yet.</div>'; return; }

  $("#ordersBox").innerHTML=list.map(function(o){
    var items=(o.items||[]).map(function(l){
      return "<li>"+esc(l.name)+" — "+esc(l.color)+" / "+esc(l.size)+" × "+l.qty+
             " = "+money(l.price*l.qty)+"</li>";
    }).join("");
    var m=o.measurements;
    var phone=String(o.phone||"").replace(/[^0-9]/g,"");
    var wa=phone?("https://wa.me/"+(phone.length===11?"88"+phone:phone)):null;
    return '<article class="o-card" data-id="'+o.id+'">'+
      '<div class="o-top">'+
        '<span class="o-code">'+esc(o.code||("#"+o.id))+"</span>"+
        '<span class="status" data-s="'+esc(o.status)+'">'+esc(o.status)+"</span>"+
        '<span class="o-when">'+esc(when(o.created_at))+"</span>"+
        '<span class="spacer"></span>'+
        '<span class="o-total">'+money(o.total)+"</span>"+
      "</div>"+
      '<dl class="o-grid">'+
        "<div><dt>Customer</dt><dd><strong>"+esc(o.name)+"</strong><br>"+
          esc(o.phone)+(wa?' · <a href="'+wa+'" target="_blank" rel="noopener">WhatsApp</a>':"")+"</dd>"+
          "<dt>Address</dt><dd>"+esc(o.district)+" — "+esc(o.address)+"</dd>"+
          (o.note?"<dt>Instructions</dt><dd>"+esc(o.note)+"</dd>":"")+
          (m?"<dt>Measurements</dt><dd>chest "+esc(m.chest)+"″ · length "+esc(m.len)+"″ (± "+esc(m.tol)+"″)</dd>":"")+
        "</div>"+
        "<div><dt>Items</dt><dd><ul class='o-items'>"+items+"</ul></dd>"+
          "<dt>Payment</dt><dd>Subtotal "+money(o.subtotal)+" · Delivery "+
            (o.delivery?money(o.delivery):"free")+" · <strong>Total "+money(o.total)+"</strong> (cash on delivery)</dd>"+
        "</div>"+
      "</dl>"+
      '<div class="o-actions">'+
        '<select class="sort" data-status="'+o.id+'">'+
          ["new","confirmed","delivered","cancelled"].map(function(s){
            return '<option value="'+s+'"'+(o.status===s?" selected":"")+">"+s+"</option>";
          }).join("")+
        "</select>"+
        '<button class="btn btn-ghost btn-sm" data-del-order="'+o.id+'">Delete</button>'+
      "</div>"+
    "</article>";
  }).join("");
}

$("#orderFilter").addEventListener("change",renderOrders);
$("#reloadOrders").addEventListener("click",loadOrders);

$("#ordersBox").addEventListener("change",function(ev){
  var sel=ev.target.closest("[data-status]"); if(!sel) return;
  var id=sel.getAttribute("data-status");
  SB.from("orders").update({status:sel.value}).eq("id",id).then(function(res){
    if(res.error){ toast("Could not update — "+res.error.message); return; }
    var o=orders.filter(function(x){return String(x.id)===String(id);})[0];
    if(o) o.status=sel.value;
    renderOrders(); toast("Order marked "+sel.value);
  });
});

$("#ordersBox").addEventListener("click",function(ev){
  var b=ev.target.closest("[data-del-order]"); if(!b) return;
  var id=b.getAttribute("data-del-order");
  if(!window.confirm("Delete this order for good?")) return;
  SB.from("orders").delete().eq("id",id).then(function(res){
    if(res.error){ toast("Could not delete — "+res.error.message); return; }
    orders=orders.filter(function(x){return String(x.id)!==String(id);});
    renderOrders(); toast("Order deleted");
  });
});

/* ================= products ================= */
var products=[], editing=null;

function loadProducts(){
  $("#productsBox").innerHTML='<div class="empty-note">Loading…</div>';
  SB.from("products").select("*").order("sort",{ascending:true}).order("id",{ascending:true})
    .then(function(res){
      if(res.error){ $("#productsBox").innerHTML='<div class="empty-note">Could not load products — '+esc(res.error.message)+"</div>"; return; }
      products=res.data||[];
      renderProducts();
    });
}

function renderProducts(){
  if(!products.length){
    $("#productsBox").innerHTML='<div class="empty-note">No products yet — press “Add product”.</div>';
    return;
  }
  $("#productsBox").innerHTML=products.map(function(p){
    var sizes=(p.sizes||[]).map(function(s){
      return s.size+" ("+(s.stock==null?"∞":s.stock)+")";
    }).join(", ")||"no sizes";
    return '<article class="p-card'+(p.active?"":" p-off")+'">'+
      (p.img?'<img src="'+esc(p.img)+'" alt="">':'<img alt="">')+
      "<div><div class='p-name'>"+esc(p.name)+(p.active?"":" · hidden")+"</div>"+
      "<div class='p-sub'>"+esc(p.gender)+" · "+esc(p.type)+" · "+money(p.price)+" · "+esc(sizes)+"</div></div>"+
      '<span class="spacer"></span>'+
      '<button class="btn btn-ghost btn-sm" data-edit="'+p.id+'">Edit</button>'+
      '<button class="btn btn-ghost btn-sm" data-del="'+p.id+'">Delete</button>'+
    "</article>";
  }).join("");
}

$("#productsBox").addEventListener("click",function(ev){
  var e=ev.target.closest("[data-edit]"), d=ev.target.closest("[data-del]");
  if(e){ openEditor(products.filter(function(p){return String(p.id)===e.getAttribute("data-edit");})[0]); return; }
  if(d){
    var id=d.getAttribute("data-del");
    var p=products.filter(function(x){return String(x.id)===id;})[0];
    if(!window.confirm("Delete “"+(p?p.name:"this piece")+"” for good?")) return;
    SB.from("products").delete().eq("id",id).then(function(res){
      if(res.error){ toast("Could not delete — "+res.error.message); return; }
      products=products.filter(function(x){return String(x.id)!==id;});
      renderProducts(); toast("Product deleted");
    });
  }
});

/* ---------- editor rows ---------- */
function colorRow(c){
  var w=document.createElement("div");
  w.className="row-color";
  w.innerHTML='<input type="text" placeholder="Colour name" value="'+esc(c&&c.n||"")+'">'+
              '<input type="color" value="'+esc(c&&c.h||"#333333")+'">'+
              '<button type="button" class="row-x" aria-label="Remove">×</button>';
  w.querySelector(".row-x").addEventListener("click",function(){ w.remove(); });
  return w;
}
function sizeRow(s){
  var w=document.createElement("div");
  w.className="row-size";
  w.innerHTML='<input type="text" placeholder="M" value="'+esc(s&&s.size||"")+'">'+
              '<input type="number" step="0.5" placeholder="36" value="'+esc(s&&s.chestMin!=null?s.chestMin:"")+'">'+
              '<input type="number" step="0.5" placeholder="38.5" value="'+esc(s&&s.chestMax!=null?s.chestMax:"")+'">'+
              '<input type="number" step="0.5" placeholder="27" value="'+esc(s&&s.length!=null?s.length:"")+'">'+
              '<input type="number" step="1" placeholder="1" value="'+esc(s&&s.stock!=null?s.stock:"")+'">'+
              '<button type="button" class="row-x" aria-label="Remove">×</button>';
  w.querySelector(".row-x").addEventListener("click",function(){ w.remove(); });
  return w;
}

$("#addColor").addEventListener("click",function(){ $("#pColors").appendChild(colorRow()); });
$("#addSize").addEventListener("click",function(){ $("#pSizes").appendChild(sizeRow()); });

function openEditor(p){
  editing=p||null;
  $("#pEditTitle").textContent=p?"Edit product":"Add product";
  $("#pName").value=p?p.name:"";
  $("#pPrice").value=p?p.price:"";
  $("#pGender").value=p?p.gender:"men";
  $("#pType").value=p?p.type:"T-Shirt";
  $("#pOld").value=p&&p.old_price?p.old_price:"";
  $("#pTag").value=p&&p.tag?p.tag:"";
  $("#pImg").value=p&&p.img?p.img:"";
  $("#pFabric").value=p&&p.fabric?p.fabric:"";
  $("#pFit").value=p&&p.fit?p.fit:"";
  $("#pCare").value=p&&p.care?p.care:"";
  $("#pActive").checked=p?!!p.active:true;
  $("#pImgFile").value="";
  showPreview(p&&p.img?p.img:"");

  $("#pColors").innerHTML="";
  ((p&&p.colors&&p.colors.length)?p.colors:[{n:"Black",h:"#1C1E20"}])
    .forEach(function(c){ $("#pColors").appendChild(colorRow(c)); });

  $("#pSizes").innerHTML="";
  ((p&&p.sizes&&p.sizes.length)?p.sizes:[{}])
    .forEach(function(s){ $("#pSizes").appendChild(sizeRow(s)); });

  $("#pErr").hidden=true;
  $("#pEdit").hidden=false;
  document.body.style.overflow="hidden";
}
function closeEditor(){
  $("#pEdit").hidden=true; editing=null; document.body.style.overflow="";
}
function showPreview(src){
  var img=$("#pPreview");
  if(src){ img.src=src; img.hidden=false; } else { img.removeAttribute("src"); img.hidden=true; }
}

$("#newProduct").addEventListener("click",function(){ openEditor(null); });
$("#pClose").addEventListener("click",closeEditor);
document.addEventListener("keydown",function(e){
  if(e.key==="Escape"&&!$("#pEdit").hidden) closeEditor();
});
$("#pImg").addEventListener("input",function(){ showPreview($("#pImg").value.trim()); });
$("#pImgFile").addEventListener("change",function(){
  var f=$("#pImgFile").files[0];
  if(f) showPreview(URL.createObjectURL(f));
});

/* ---------- save ---------- */
function collectColors(){
  return $$("#pColors .row-color").map(function(r){
    var i=r.querySelectorAll("input");
    return {n:i[0].value.trim()||"Colour",h:i[1].value};
  });
}
function collectSizes(){
  return $$("#pSizes .row-size").map(function(r){
    var i=r.querySelectorAll("input");
    var o={size:i[0].value.trim(),
           chestMin:parseFloat(i[1].value),
           chestMax:parseFloat(i[2].value),
           length:parseFloat(i[3].value)};
    var st=i[4].value.trim();
    if(st!=="") o.stock=parseInt(st,10);
    return o;
  }).filter(function(s){
    return s.size&&isFinite(s.chestMin)&&isFinite(s.chestMax)&&isFinite(s.length);
  });
}

function uploadPhoto(){
  var f=$("#pImgFile").files[0];
  if(!f) return Promise.resolve($("#pImg").value.trim()||null);
  var ext=(f.name.split(".").pop()||"jpg").toLowerCase();
  var path="p-"+Date.now()+"-"+Math.floor(Math.random()*9999)+"."+ext;
  return SB.storage.from(BUCKET).upload(path,f,{cacheControl:"3600",upsert:false})
    .then(function(res){
      if(res.error) throw new Error(res.error.message);
      return SB.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    });
}

$("#pSave").addEventListener("click",function(){
  var name=$("#pName").value.trim();
  var price=parseInt($("#pPrice").value,10);
  var type=$("#pType").value.trim();
  var sizes=collectSizes();
  var err=null;
  if(!name) err="Please write the product name.";
  else if(!isFinite(price)||price<0) err="Please write a price.";
  else if(!type) err="Please write the type (T-Shirt, Shirt …).";
  else if(!sizes.length) err="Please add at least one size with chest and length.";
  if(err){ $("#pErr").textContent=err; $("#pErr").hidden=false; return; }

  var btn=$("#pSave"); btn.disabled=true; btn.textContent="Saving…";
  uploadPhoto().then(function(imgUrl){
    var row={
      name:name, gender:$("#pGender").value, type:type,
      shape:(type.toLowerCase().indexOf("dress")>-1?"aline":
             type.toLowerCase().indexOf("shirt")>-1&&type.toLowerCase()!=="t-shirt"?"shirt":"tee"),
      price:price,
      old_price:$("#pOld").value?parseInt($("#pOld").value,10):null,
      tag:$("#pTag").value.trim()||null,
      img:imgUrl||null,
      fabric:$("#pFabric").value.trim()||null,
      fit:$("#pFit").value.trim()||null,
      care:$("#pCare").value.trim()||null,
      colors:collectColors(),
      sizes:sizes,
      active:$("#pActive").checked
    };
    var q=editing
      ? SB.from("products").update(row).eq("id",editing.id).select()
      : SB.from("products").insert([row]).select();
    return q;
  }).then(function(res){
    btn.disabled=false; btn.textContent="Save product";
    if(res.error){ $("#pErr").textContent=res.error.message; $("#pErr").hidden=false; return; }
    closeEditor(); loadProducts(); toast("Product saved");
  }).catch(function(e){
    btn.disabled=false; btn.textContent="Save product";
    $("#pErr").textContent=e.message||String(e); $("#pErr").hidden=false;
  });
});

})();
