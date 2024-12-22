
// ==UserScript==
// @name         Tool Extractor
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  Extract all LC/F95z thread data
// @author       Hunteraulo
// @source       https://github.com/Hunteraulo1/f95list-extractor
// @downloadURL  https://github.com/Hunteraulo1/f95list-extractor/raw/refs/heads/main/dist/toolExtractor.user.js
// @updateURL    https://github.com/Hunteraulo1/f95list-extractor/raw/refs/heads/main/dist/toolExtractor.user.js
// @match        http*://lewdcorner.com/threads/*
// @match        http*://*.lewdcorner.com/threads/*
// @match        http*://f95zone.to/threads/*
// @match        http*://*.f95zone.to/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lewdcorner.com
// @grant        none
// ==/UserScript==

var a=()=>window.location.hostname==="f95zone.to";var d=()=>{let t=document.querySelectorAll(".tagItem")??[];return Array.from(t).map((n)=>n.textContent).join(", ")},u=()=>{let t=document.querySelector("title")?.textContent??"",n=document.querySelector("img.bbImage")?.getAttribute("src")??"",e=Number(window.location.pathname.split(".")[1]?.split("/")[0]),o=n?.replace("attachments.","preview.")??"",s=/.*-\s(.*?)\s\[/i,i=/([\w\\']+)(?=\s-)/gi,l=/\[([^\]]+)\]/gi,p=t.match(i)??[],T=t.match(s)??[],m=t.match(l)??[];console.log("versionMatch:",m);let N=T?.[1]??"",{status:w,type:M}=L(p),S=m?.[0]??"",v=d();return JSON.stringify({id:e,domain:"F95z",name:N,version:S,status:w,tags:v,type:M,ac:!1,link:e?`https://f95zone.to/threads/${e}`:"",image:o},null,0)},L=(t)=>{let n="",e="";for(let o of t){switch(o){case"Abandoned":n="ABANDONN\xC9";break;case"Completed":n="TERMIN\xC9";break;default:n="EN COURS";break}switch(o){case"Ren'Py":e="RenPy";break;case"RPGM":e="RPGM";break;case"Unity":e="Unity";break;case"Unreal Engine":e="Unreal";break;case"Flash":e="Flash";break;case"HTML":e="HTML";break;case"QSP":e="QSP";break;case"Others":e="Autre";break}}return{status:n,type:e}};var x=()=>{let t=Array.from(document.querySelectorAll('script[type="application/ld+json"]')),n={};for(let{textContent:o}of t)try{let s=o?JSON.parse(o):{};Object.assign(n,s)}catch(s){console.error("Erreur lors du parsing JSON:",s)}let{mainEntity:e}=n;if(!e||typeof e!=="object"){console.error("mainEntity n'est pas d\xE9fini ou mal form\xE9.");return}return e},g=()=>{return x()?.keywords??""},b=()=>{let t=x(),n=document.querySelector(".p-title-value")?.innerText,e=Number(t?.url?.split(".")[2]?.split("/")[0]),o=document.querySelector("img.bbImage")?.getAttribute("src")??"",s=document.querySelector("dl[data-field='version'] > dd")?.textContent;console.log("\uD83D\uDE80 ~ extractDataLC ~ titleMatch:",n);let i=t?.headline?.match(/([^\[]*) /)?.[1]??"",{status:l,type:p}=z(n??"");return JSON.stringify({id:e,domain:"LewdCorner",name:i,version:s,status:l,tags:t?.keywords??"",type:p,ac:!1,link:e?"":`https://lewdcorner.com/threads/${e}`,image:o},null,0)},z=(t)=>{let n="",e="";if(t.includes("Abandoned"))n="ABANDONN\xC9";else if(t.includes("Complete"))n="TERMIN\xC9";else n="EN COURS";if(t.includes("Ren'Py"))e="RenPy";else if(t.includes("RPGM"))e="RPGM";else if(t.includes("Unity"))e="Unity";else if(t.includes("Unreal Engine"))e="Unreal";else if(t.includes("Flash"))e="Flash";else if(t.includes("HTML"))e="HTML";else if(t.includes("QSP"))e="QSP";else if(t.includes("Others"))e="Autre";return{status:n,type:e}};var f=()=>a()?d():g(),h=()=>a()?u():b();var r=document.createElement("div"),E=()=>{r.className="extractor-panel",r.style.marginTop=a()?"8px":"14px",document.querySelector("nav")?.prepend(r),A(r),y("Extract tags",f),y("Extract all data",h)},A=(t)=>{let n=document.createElement("button");n.className="extractor-close",n.textContent="X",t.prepend(n),F(n)},F=(t)=>{t.addEventListener("click",()=>{r.style.display="none"})},y=(t,n)=>{let e=document.createElement("button");e.className="extractor-panelButton",e.textContent=t,r.append(e),e.addEventListener("click",()=>{O(n)})},O=(t)=>{navigator.clipboard.writeText(t()).then(()=>{console.info("Text copied to clipboard"),console.log(t())}).catch((n)=>console.error("Could not copy text",n))};var c=document.createElement("button"),C=()=>{c.className="extractor-button",c.style.marginTop=a()?"8px":"14px",c.textContent="E",document.querySelector("nav")?.prepend(c),P(c)},P=(t)=>{t.addEventListener("click",()=>{r.style.display="flex"})};var k=document.createElement("style");k.textContent=`.extractor-button {
  height: "48px";
  width: "48px";
  border-radius: "99999px";
  background-color: "#1e2022";
  top: "0";
  right: "0";
  position: "absolute";
  margin-right: "14px";
  z-index: "1000";
  border: "none";
  color: "#ba4545";
  font-weight: "bold";
  font-size: "24px";
}

.extractor-panel {
  width: "128px";
  border-radius: "8px";
  background-color: "#1e2022";
  top: "0";
  right: "0";
  position: "absolute";
  margin-right: "14px";
  z-index: "1001";
  display: "none";
  flex: "flex";
  flex-direction: "column";
  gap: "1rem";
  padding: "1rem";
}
.extractor-panel .extractor-close {
  height: "16px";
  width: "16px";
  border-radius: "99999px";
  background-color: "#37383a";
  align-self: "end";
  border: "none";
  color: "#ba4545";
  font-weight: "bold";
  font-size: "8px";
}
.extractor-panel .extractor-panelButton {
  height: "16px";
  width: "100%";
  background-color: "#37383a";
  border: "#ba4545";
  border-radius: "8px";
  color: "#ba4545";
  font-weight: "bold";
  font-size: "8px";
}`;document.head.appendChild(k);(()=>{C(),E()})();
