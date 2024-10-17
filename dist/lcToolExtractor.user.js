
// ==UserScript==
// @name         LC Tool Extractor
// @namespace    http://tampermonkey.net/
// @version      v1.1.1
// @description  Extract all LC thread data
// @author       Hunteraulo
// @source       https://github.com/Hunteraulo1/f95list-extractor
// @downloadURL  https://raw.githubusercontent.com/Hunteraulo1/f95list-extractor/refs/heads/main/dist/lcToolExtractor.user.js
// @updateURL    https://raw.githubusercontent.com/Hunteraulo1/f95list-extractor/refs/heads/main/dist/lcToolExtractor.user.js
// @match        http*://lewdcorner.com/threads/*
// @match        http*://*.lewdcorner.com/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lewdcorner.com
// @grant        none
// ==/UserScript==

"use strict";(()=>{(()=>{let btn=document.querySelector(".fa--xf.fa-tags");btn?.addEventListener("click",()=>{let extracts=Array.from(document.querySelectorAll('script[type="application/ld+json"]')),result={};for(let{textContent}of extracts)try{let parsedContent=textContent?JSON.parse(textContent):{};Object.assign(result,parsedContent)}catch(error){console.error("Erreur lors du parsing JSON:",error)}let{mainEntity}=result;if(!mainEntity||typeof mainEntity!="object"){console.error("mainEntity n'est pas d\xE9fini ou mal form\xE9.");return}let title=document.querySelector(".p-title-value")?.innerText,id=mainEntity?.url?.split(".")[2]?.split("/")[0]??"",version=document.querySelector("dl[data-field='version'] > dd")?.textContent;title?.match(/(?!\[)([\w\\. \(\)\']+)(?=\]\s)/gi)?.[0];let name=mainEntity?.headline?.match(/([^\[]*) /)?.[1]??"",{status,type}=scrapeGetTitle(title??""),textToCopy=JSON.stringify({id,domain:"LewdCorner",name,version,status,tags:mainEntity?.keywords??"",type,ac:!1,link:id===""?"":`https://lewdcorner.com/threads/${id}`,image:mainEntity?.image??""},null,0);navigator.clipboard.writeText(textToCopy).then(()=>console.log("Text copied to clipboard")).catch(err=>console.error("Could not copy text",err)),btn.style.color="green"})})();var scrapeGetTitle=data=>{let status="",type="";return data.includes("Abandoned")?status="ABANDONN\xC9":data.includes("Complete")?status="TERMIN\xC9":status="EN COURS",data.includes("Ren'Py")?type="RenPy":data.includes("RPGM")?type="RPGM":data.includes("Unity")?type="Unity":data.includes("Unreal")?type="Unreal":data.includes("Flash")?type="Flash":data.includes("HTML")?type="HTML":data.includes("QSP")?type="QSP":data.includes("Others")&&(type="Autre"),{status,type}};})();
