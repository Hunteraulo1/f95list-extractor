
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

"use strict";(()=>{var extractTagsF95z=()=>{let tags=document.querySelectorAll(".tagItem")??[];return Array.from(tags).map(tag=>tag.textContent).join(", ")},extractDataF95z=()=>{let title=document.querySelector("title")?.textContent??"",img=document.querySelector("img.bbImage")?.getAttribute("src")??"",id=window.location.pathname.split(".")[1]?.split("/")[0]??"",image=img?.replace("attachments.","preview.")??"",regName=/.*-\s(.*?)\s\[/i,regTitle=/([\w\\']+)(?=\s-)/gi,regVersion=/\[([^\]]+)\]/gi,titleMatch=title.match(regTitle)??[],nameMatch=title.match(regName)??[],versionMatch=title.match(regVersion)??[],name=nameMatch?.[1]??"",{status,type}=scrapeGetTitle(titleMatch),version=versionMatch?.[1]??"",tags=extractTagsF95z();return JSON.stringify({id,domain:"F95z",name,version,status,tags,type,ac:!1,link:id===""?"":`https://f95zone.to/threads/${id}`,image},null,0)},scrapeGetTitle=data=>{let status="",type="";for(let e of data){switch(e){case"Abandoned":status="ABANDONN\xC9";break;case"Completed":status="TERMIN\xC9";break;default:status="EN COURS";break}switch(e){case"Ren'Py":type="RenPy";break;case"RPGM":type="RPGM";break;case"Unity":type="Unity";break;case"Unreal Engine":type="Unreal";break;case"Flash":type="Flash";break;case"HTML":type="HTML";break;case"QSP":type="QSP";break;case"Others":type="Autre";break}}return{status,type}};var getData=()=>{let extracts=Array.from(document.querySelectorAll('script[type="application/ld+json"]')),result={};for(let{textContent}of extracts)try{let parsedContent=textContent?JSON.parse(textContent):{};Object.assign(result,parsedContent)}catch(error){console.error("Erreur lors du parsing JSON:",error)}let{mainEntity}=result;if(!mainEntity||typeof mainEntity!="object"){console.error("mainEntity n'est pas d\xE9fini ou mal form\xE9.");return}return mainEntity},extractTagsLC=()=>getData()?.keywords??"",extractDataLC=()=>{let data=getData(),title=document.querySelector(".p-title-value")?.innerText,id=data?.url?.split(".")[2]?.split("/")[0]??"",version=document.querySelector("dl[data-field='version'] > dd")?.textContent;title?.match(/(?!\[)([\w\\. \(\)\']+)(?=\]\s)/gi)?.[0];let name=data?.headline?.match(/([^\[]*) /)?.[1]??"",{status,type}=scrapeGetTitle2(title??"");return JSON.stringify({id,domain:"LewdCorner",name,version,status,tags:data?.keywords??"",type,ac:!1,link:id===""?"":`https://lewdcorner.com/threads/${id}`,image:data?.image??""},null,0)},scrapeGetTitle2=data=>{let status="",type="";for(let e of data){switch(e){case"Abandoned":status="ABANDONN\xC9";break;case"Completed":status="TERMIN\xC9";break;default:status="EN COURS";break}switch(e){case"Ren'Py":type="RenPy";break;case"RPGM":type="RPGM";break;case"Unity":type="Unity";break;case"Unreal Engine":type="Unreal";break;case"Flash":type="Flash";break;case"HTML":type="HTML";break;case"QSP":type="QSP";break;case"Others":type="Autre";break}}return{status,type}};var extractTags=()=>window.location.hostname==="f95zone.to"?extractTagsF95z():extractTagsLC(),extractData=()=>window.location.hostname==="f95zone.to"?extractDataF95z():extractDataLC();var panelElement=document.createElement("div"),panel=()=>{panelElement.style.width="128px",panelElement.style.borderRadius="8px",panelElement.style.backgroundColor="#1e2022",panelElement.style.position="fixed",panelElement.style.top="16px",panelElement.style.right="16px",panelElement.style.zIndex="1001",panelElement.style.display="none",panelElement.style.flex="flex",panelElement.style.flexDirection="column",panelElement.style.gap="1rem",panelElement.style.padding="1rem",document.querySelector("body")?.prepend(panelElement),closeButton(panelElement),button("Extract tags",extractTags),button("Extract all data",extractData)},closeButton=element=>{let close=document.createElement("button");close.style.height="16px",close.style.width="16px",close.style.borderRadius="99999px",close.style.backgroundColor="#37383a",close.style.alignSelf="end",close.style.border="none",close.style.color="#ba4545",close.style.fontWeight="bold",close.style.fontSize="8px",close.textContent="X",element.prepend(close),handleClickClose(close)},handleClickClose=element=>{element.addEventListener("click",()=>{panelElement.style.display="none"})},button=(title,action)=>{let button3=document.createElement("button");button3.style.height="16px",button3.style.width="100%",button3.style.backgroundColor="#37383a",button3.style.border="#ba4545",button3.style.borderRadius="8px",button3.style.color="#ba4545",button3.style.fontWeight="bold",button3.style.fontSize="8px",button3.textContent=title,panelElement.append(button3),button3.addEventListener("click",()=>{handleClickButton(action)})},handleClickButton=action=>{navigator.clipboard.writeText(action()).then(()=>{console.info("Text copied to clipboard"),console.log(action())}).catch(err=>console.error("Could not copy text",err))};var openElement=document.createElement("button"),button2=()=>{openElement.style.height="48px",openElement.style.width="48px",openElement.style.borderRadius="99999px",openElement.style.backgroundColor="#1e2022",openElement.style.position="fixed",openElement.style.top="16px",openElement.style.right="16px",openElement.style.zIndex="1000",openElement.style.border="none",openElement.style.color="#ba4545",openElement.style.fontWeight="bold",openElement.style.fontSize="24px",openElement.textContent="E",document.querySelector("body")?.prepend(openElement),handleClickOpen(openElement)},handleClickOpen=element=>{element.addEventListener("click",()=>{panelElement.style.display="flex"})};button2(),panel();})();
