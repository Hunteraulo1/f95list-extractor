
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
// @match        http*://f95zone.to/threads/*
// @match        http*://*.f95zone.to/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lewdcorner.com
// @grant        none
// ==/UserScript==

"use strict";(()=>{var getData=()=>{let extracts=Array.from(document.querySelectorAll('script[type="application/ld+json"]')),result={};for(let{textContent}of extracts)try{let parsedContent=textContent?JSON.parse(textContent):{};Object.assign(result,parsedContent)}catch(error){console.error("Erreur lors du parsing JSON:",error)}let{mainEntity}=result;if(!mainEntity||typeof mainEntity!="object"){console.error("mainEntity n'est pas d\xE9fini ou mal form\xE9.");return}return mainEntity},extractTags=()=>getData()?.keywords??"",extractData=()=>{let mainEntity=getData(),title=document.querySelector(".p-title-value")?.innerText,id=mainEntity?.url?.split(".")[2]?.split("/")[0]??"",version=document.querySelector("dl[data-field='version'] > dd")?.textContent;title?.match(/(?!\[)([\w\\. \(\)\']+)(?=\]\s)/gi)?.[0];let name=mainEntity?.headline?.match(/([^\[]*) /)?.[1]??"",{status,type}=scrapeGetTitle(title??"");return JSON.stringify({id,domain:"LewdCorner",name,version,status,tags:mainEntity?.keywords??"",type,ac:!1,link:id===""?"":`https://lewdcorner.com/threads/${id}`,image:mainEntity?.image??""},null,0)},scrapeGetTitle=data=>{let status="",type="";return data.includes("Abandoned")?status="ABANDONN\xC9":data.includes("Complete")?status="TERMIN\xC9":status="EN COURS",data.includes("Ren'Py")?type="RenPy":data.includes("RPGM")?type="RPGM":data.includes("Unity")?type="Unity":data.includes("Unreal")?type="Unreal":data.includes("Flash")?type="Flash":data.includes("HTML")?type="HTML":data.includes("QSP")?type="QSP":data.includes("Others")&&(type="Autre"),{status,type}};var panelElement=document.createElement("div"),panel=()=>{panelElement.style.height="20rem",panelElement.style.width="16rem",panelElement.style.borderRadius="1rem",panelElement.style.backgroundColor="black",panelElement.style.position="fixed",panelElement.style.top="2rem",panelElement.style.right="2rem",panelElement.style.zIndex="1001",panelElement.style.display="none",panelElement.style.flex="flex",panelElement.style.flexDirection="column",panelElement.style.gap="1rem",panelElement.style.padding="1rem",document.querySelector("body")?.prepend(panelElement),closeButton(panelElement),button("Extract tags",extractTags),button("Extract all data",extractData)},closeButton=element=>{let close=document.createElement("button");close.style.height="4rem",close.style.width="4rem",close.style.borderRadius="99999px",close.style.backgroundColor="black",close.style.float="right",close.style.border="none",close.style.color="#ba4545",close.style.fontWeight="bold",close.style.fontSize="2rem",close.textContent="X",element.prepend(close),handleClickClose(close)},handleClickClose=element=>{element.addEventListener("click",()=>{panelElement.style.display="none"})},button=(title,action)=>{let button3=document.createElement("button");button3.style.height="4rem",button3.style.width="100%",button3.style.backgroundColor="grey",button3.style.border="#ba4545",button3.style.borderRadius="1rem",button3.style.color="#ba4545",button3.style.fontWeight="bold",button3.style.fontSize="1rem",button3.textContent=title,panelElement.append(button3),handleClickButton(action)},handleClickButton=action=>{navigator.clipboard.writeText(action()).then(()=>console.log("Text copied to clipboard")).catch(err=>console.error("Could not copy text",err))};var openElement=document.createElement("button"),button2=()=>{openElement.style.height="4rem",openElement.style.width="4rem",openElement.style.borderRadius="99999px",openElement.style.backgroundColor="black",openElement.style.position="fixed",openElement.style.top="2rem",openElement.style.right="2rem",openElement.style.zIndex="1000",openElement.style.border="none",openElement.style.color="#ba4545",openElement.style.fontWeight="bold",openElement.style.fontSize="2rem",openElement.textContent="E",document.querySelector("body")?.prepend(openElement),handleClickOpen(openElement)},handleClickOpen=element=>{element.addEventListener("click",()=>{panelElement.style.display="flex"})};button2(),panel();})();