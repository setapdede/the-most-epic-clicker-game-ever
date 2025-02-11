/*
  _   _                                _                _             _ _      _                                                                _ _ _ 
 | | | |                              | |              (_)           | (_)    | |                                                              | | | |
 | |_| |__   ___   _ __ ___   ___  ___| |_    ___ _ __  _  ___    ___| |_  ___| | _____ _ __    __ _  __ _ _ __ ___   ___    _____   _____ _ __| | | |
 | __| '_ \ / _ \ | '_ ` _ \ / _ \/ __| __|  / _ \ '_ \| |/ __|  / __| | |/ __| |/ / _ \ '__|  / _` |/ _` | '_ ` _ \ / _ \  / _ \ \ / / _ \ '__| | | |
 | |_| | | |  __/ | | | | | | (_) \__ \ |_  |  __/ |_) | | (__  | (__| | | (__|   <  __/ |    | (_| | (_| | | | | | |  __/ |  __/\ V /  __/ |  |_|_|_|
  \__|_| |_|\___| |_| |_| |_|\___/|___/\__|  \___| .__/|_|\___|  \___|_|_|\___|_|\_\___|_|     \__, |\__,_|_| |_| |_|\___|  \___| \_/ \___|_|  (_|_|_)
                                                 | |                                            __/ |                                                 
                                                 |_|                                           |___/                                                  
  Created by stuartt_mcoded @ mcoded.xyz
  Official site: https://realmcoded.github.io/the-most-epic-clicker-game-ever/
  Source code: https://github.com/RealMCoded/the-most-epic-clicker-game-ever
*/

//Set Version
const version = "0.1.7"
document.getElementById("ver").innerHTML= `Version ${version}`

//Init "some" SFX
const chaching = new sound('buy.mp3')

//Global events (date, other stuff later)
const d = new Date(); //d for date
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) //Check for mobile device

// Init other stuff
var score=0
var angle = 0
var curskn=0
var level = 0
var clickerbuddyadd=0
var nextlvl = 75
var levelprogres=0
var daman = document.getElementById('img')
var itemsOwned = [null]
var skinsOwned = [null, '0']

//Get items, parse them, then separeate them into their own variables.
var json = httpGet("storeListings.json")
var json = JSON.parse(json);
var items = json.items
var skins = json.skins

//Print out store items
console.log("STORE ITEMS")
console.table(json.items)

console.log("SKIN ITEMS")
console.table(json.skins)

scaleToMobile()

//Start of Item Related Code
function loadStore() {

  var news = document.getElementsByClassName("shop")[0]; //Easier to define this here than to call this long string every time

  //Repeat until i is equal to the json's size.
  for(var i = 0; i < items.length; i++) {

    let img = document.createElement("img")
    if (UrlExists(`./store/items/${i}.png`) && (curskn==0)) {img.setAttribute("src",`./store/items/${i}.png`)} else {img.setAttribute("src",`./store/items/missing.png`)}
    img.setAttribute("id",`img_${i}`);
    news.appendChild(img)

    let h5 = document.createElement("h2");
    h5.setAttribute("id",`h5_${i}`);
    //h5.innerHTML = items[i].name + " - " + items[i].price + " Points"; //yuck
    h5.innerHTML = `${items[i].name} - ${items[i].price} Points`;
    news.appendChild(h5);

    let p = document.createElement("p");
    p.setAttribute("id",`p_desc_${i}`);
    p.innerHTML = items[i].description;
    news.appendChild(p);

    if (items[i].requireditem !== null) {
    let p = document.createElement("p");
    p.setAttribute("id",`p_rec_${i}`);
    p.innerHTML = `Required Item: ${items[items[i].requireditem].name}`;
    news.appendChild(p);
    }

    let btn = document.createElement("button");
    btn.innerHTML = "Buy";
    btn.setAttribute("id",`btn_${i}`);
    btn.setAttribute("onclick",`buyitem('${i}');`);
    //btn.name = "formBtn";
    news.appendChild(btn);

    let br = document.createElement("hr")
    br.setAttribute("id",`hr_${i}`);
    news.appendChild(br)

    console.log(`Loaded item ${i}`)
  }
  console.log("Loaded store.")

  //After loading, Remove the placeholder text
  try {
    document.getElementById("storeload").remove()
  } catch { //If failed, put an error
    console.log("Element \"storeload\" was already removed!")
  }
}

function buyitem(itm) {
  let want = arguments[0] //easier to define it here than call arguments[0] every time lol

  if (confirm("Are you sure you want to buy this item?")){
    if (items[want].price <= score && itemsOwned.includes(items[want].requireditem)) {
      itemsOwned.push(want) //Add it to a list so the game knows you have it
      score = score - items[want].price
      //document.getElementById("sco").innerHTML= `Score: ${score}`

      //Update store to make item out of stock
      document.getElementById(`img_${want}`).remove()
      document.getElementById(`h5_${want}`).remove()
      document.getElementById(`p_desc_${want}`).remove()
      if (items[want].requireditem !== null) {document.getElementById(`p_rec_${want}`).remove()}
      document.getElementById(`btn_${want}`).remove()
      document.getElementById(`hr_${want}`).remove()
      chaching.stop()
      chaching.play()

      //Buy Events
      if (want == 9) {
        clickerbuddyadd=0.02
      } else if (want == 10){
        clickerbuddyadd=0.1
      } else if (want == 11){
        clickerbuddyadd=1
      } else if (want == 12){
        clickerbuddyadd=10
      } else if (want == 13){
        clickerbuddyadd=15
      } else if (want == 14) {
        score = score*2
      }
    } else {
      if (!itemsOwned.includes(items[want].requireditem)) {
        alert(`You need item ${items[items[want].requireditem].name} to get this.`)
      } else {
        var rem = items[want].price - score
        alert(`You don't have enough points!\nYou need ${Math.trunc(rem)} more!`)
      }
    }
  }
}

//Item Loop/update (every 50 or so ms)
var itemloop = setInterval(function() {
 //add clicker buddy bonus to score
  score+=clickerbuddyadd

  //auto clicker buddy multiplication
  if (itemsOwned.includes('15')) {
    if (itemsOwned.includes('0')) {
      score = score + clickerbuddyadd
    }
    if (itemsOwned.includes('1')) {
      score = score + clickerbuddyadd
    }
    if (itemsOwned.includes('2')) {
      score = score + clickerbuddyadd
    }
    if (itemsOwned.includes('3')) {
      score = score + clickerbuddyadd
    }
    if (itemsOwned.includes('4')) {
      score = score + clickerbuddyadd
    }
    if (itemsOwned.includes('5')) {
      score = score + clickerbuddyadd
    }
    if (itemsOwned.includes('6')) {
      score = score + clickerbuddyadd
    }
	  if (itemsOwned.includes('7')) {
      score = score + clickerbuddyadd
    }
  }
  //check lvl. if it equal to nextlevel, progress on
  if (levelprogres == nextlvl){
    levelprogres = 0
	level++
    nextlvl = nextlvl + 115
	score = score * 1.1
  }

  //Update HUD
  document.getElementById("sco").innerHTML= `Points: ${Math.trunc(score)}`
  document.getElementById("lvl").value = levelprogres
  document.getElementById("lvl").max=nextlvl
  document.getElementById("curlvl").innerHTML= `Level: ${level}`
  document.getElementById("lvl_raw").innerHTML=`${levelprogres}/${nextlvl}`
  document.getElementById("chance_bettip").innerHTML=`Lowest bet is 1, highest bet is ${Math.trunc(score)}`
  document.getElementById("dabet").max = Math.trunc(score)
}, 50)
//End of Item Related Code

//Start of Skin Related Code
function loadSkins() {

  var news = document.getElementsByClassName("skin")[0]; //Easier to define this here than to call this long string every time

  //Repeat until i is equal to the json's size.
  for(var i = 0; i < skins.length; i++) {

    let img = document.createElement("img")
    if (UrlExists(`./store/skins/${i}.png`)) {img.setAttribute("src",`./store/skins/${i}.png`)} else {img.setAttribute("src",`./store/skins/missing.png`)}
    img.setAttribute("id",`skn_img_${i}`);
    news.appendChild(img)

    let h5 = document.createElement("h2");
    h5.setAttribute("id",`skn_h5_${i}`);
    h5.innerHTML = `${skins[i].name} - ${skins[i].price} Points`;
    news.appendChild(h5);

    let p = document.createElement("p");
    p.setAttribute("id",`skn_p_desc_${i}`);
    p.innerHTML = skins[i].description;
    news.appendChild(p);

    let btn = document.createElement("button");
    btn.innerHTML = "Buy";
    btn.setAttribute("id",`skn_btn_${i}`);
    btn.setAttribute("onclick",`buyskin('${i}');`);
    //btn.name = "formBtn";
    news.appendChild(btn);

    let br = document.createElement("hr")
    br.setAttribute("id",`skn_hr_${i}`);
    news.appendChild(br)

    console.log(`Loaded skin ${i}`)
  }
  console.log("Loaded skin store.")

  //Change Default skin to "Owned"
  let btn = document.getElementById(`skn_btn_0`)
  btn.innerHTML = "Equipped";
  btn.disabled = true
  btn.setAttribute("onclick",`equipskin('0');`);

  //After loading, Remove the placeholder text
  try {
    document.getElementById("sknload").remove()
  } catch { //If failed, put an error
    console.log("Element \"storeload\" was already removed!")
  }
}

function buyskin(skn) {
  let want = skn //easier to define it here than call arguments[0] every time lol

  if (confirm("Are you sure you want to buy this skin?")){
    if (skins[want].price <= score) {
      skinsOwned.push(want) //Add it to a list so the game knows you have it
      score = score - skins[want].price

      let btn = document.getElementById(`skn_btn_${want}`)
      btn.innerHTML = "Equip";
      btn.setAttribute("onclick",`equipskin('${want}');`);
      chaching.stop()
      chaching.play()
      equipskin(skn)
    } else {
        var rem = skins[want].price - score
        alert(`You don't have enough points!\nYou need ${Math.trunc(rem)} more!`)
    }
  }
}

function equipskin(skn) {
  //Set old button text to say "Equip"
  document.getElementById(`skn_btn_${curskn}`).innerHTML = "Equip"
  document.getElementById(`skn_btn_${curskn}`).disabled = false

  //Set new button text to say "Equipped"
  document.getElementById(`skn_btn_${skn}`).innerHTML = "Equipped";
  document.getElementById(`skn_btn_${skn}`).disabled = true

  curskn = skn
  daman.src=`./skin/${skn}/0.png`

  //Skin Events

  //Reset to normal
  document.body.style.background = "#FFFFFF";
  document.getElementById("dabase").style.color = "black";
  document.body.style.fontFamily = ""

  //Events
  if (skn == 7) { //Seasonal
    document.body.style.background = "#00137F url('./skin/7/bg.png')";
    document.getElementById("dabase").style.color = "white";
  } else if (skn == 3) { //Modern
    document.body.style.fontFamily = "Arial, sans-serif"
  } else if (skn == 5) { //Ballons
    document.body.style.background = "#FFFFFF url('./skin/5/bg.png')";
    document.body.style.fontFamily = "Comic Sans MS, Times New Roman, sans-serif"
	document.getElementById("dabase").style.color = "#bfbfbf";
  } else if (skn == 1) { //ACSII
    document.body.style.background = "#000000";
    document.body.style.fontFamily = "Consolas, Times New Roman, sans-serif"
	document.getElementById("dabase").style.color = "#FFFFFF"; 
  } else if (skn == 6) { //Skeuomorphic
    document.body.style.background = "#E5E5E5 url('./skin/6/bg.png')";
    document.body.style.fontFamily = "Tahoma, Trebuchet MS, Arial, Times New Roman, sans-serif"
  scaleToMobile()
}
}
//End of Skin Related Code

//Add click anim if on desktop
if (!isMobile) {
  daman.addEventListener("mousedown", function() {
    daman.src=`./skin/${curskn}/1.png`
  });
  daman.addEventListener("mouseup", function() {
    daman.src=`./skin/${curskn}/0.png`
  });
}

//Click Event Code
function clickev() {
  score = score + 1
  levelprogres++

  if (itemsOwned.includes('0')) {
    score = score +1
  }
  if (itemsOwned.includes('1')) {
    score = score +1
  }
  if (itemsOwned.includes('2')) {
    score = score +1
  }
  if (itemsOwned.includes('3')) {
    score = score +1
  }
  if (itemsOwned.includes('4')) {
    score = score +1
  }
  if (itemsOwned.includes('5')) {
    score = score +1
  }
  if (itemsOwned.includes('6')) {
    score = score +1
  }
  if (itemsOwned.includes('7')) {
    score = score +1
  }
  if (itemsOwned.includes('8')) {
    score = score +1
  }
  if (itemsOwned.includes('16')) {
    score = score + level * 0.05
  }
  if (itemsOwned.includes('17')) {
    score = score + level * 0.1
  }
  if (itemsOwned.includes('18')) {
    score = score + level * 0.25
  }
}
//Coin Flip Game
function chancegame(){
  let bet = document.getElementById("dabet").value //Define how much the Player is betting
  if (bet > score) {alert(`You bet ${bet},\nbut you don't have that much...`); return "ERR_INVALID_BET";} //If bet is somehow above, throw an error.
  if (0 > bet) {alert(`You bet ${bet},\nbut you cannot bet negative points.`); return "ERR_INVALID_BET";}
  if (confirm(`Are you sure you want to bet ${bet}?`)) { //Double check to make sure they wanna do this

  let side = confirm("Ok for heads, Cancel for tails.") //Define side as TRUE (1) for heads, and FALSE (0) for tails
  document.getElementById("chance_smit").disabled = true //Disable the button
  document.getElementById("coinimg").src = "./coin/flip.gif" //Change the coin to have the flip anim
  document.getElementById("chance_status").innerHTML="Status: Flipping..." //Change the status

  setTimeout(function(){ //Do this after 5 seconds
    document.getElementById("chance_smit").disabled = false //Re-enable the button
    document.getElementById("chance_status").innerHTML="Status: Idle..." //Reset the status

    let winner = getRandomInt(2) //Decide if )0wins or if 1 wins

    if (winner == 0){ //If tails wins...
      document.getElementById("coinimg").src = "./coin/tail.png" //Set image to tails
    } else {
      document.getElementById("coinimg").src = "./coin/head.png" //Set image to Heads
    }

    if (winner == side){ //If the player chose the winning side
      if (winner == 0) alert(`The coin landed on Tails.\nYou win ${bet*2} points!`); //Show this if 0 was chosen
      if (winner == 1) alert(`The coin landed on Heads.\nYou win ${bet*2} points!`); //Show this if 1 was chosen
      score = score + (bet*2)
    } else {
      if (winner == 0) alert(`The coin landed on Tails.\nYou lost ${bet} points!`); //Show this if 0 was chosen
      if (winner == 1) alert(`The coin landed on Heads.\nYou lost ${bet} points!`); //Show this if 1 was chosen
      score-=bet
    }
  },5000);
}
}

//Other Scripts

//https://stackoverflow.com/a/3646923
function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}

//httpGet
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

//thx to https://www.w3schools.com/graphics/game_sound.asp 4 this code xoxo
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.stop = function(){
    this.sound.pause();
    this.sound.currentTime = 0;
  }
  this.play = function(){
    this.sound.play();
  }
}

//Rotating man thing. Every 50ms
var rotclock = setInterval(function() {
  if (angle > 359) {angle = 0}
  angle = angle + 1
  daman.style.transform = `rotate(${angle}deg)`;
}, 50);

//Scale things if mobile
function scaleToMobile(){
  if (isMobile) {
    /*if (curskn == 3){
      daman.style.height = `240px`
      daman.style.width = `240px`
    } else if (curskn == 4){
      daman.style.height = `240px`
      daman.style.width = `240px`
    } else if (curskn == 5){
      daman.style.width = `236px`
      daman.style.height = `236px`
    } else {
      daman.style.height = `160px`
      daman.style.width = `236px`
    }*/
    daman.style.height = `50%`
    daman.style.width = `50%`
  }
}

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//DEBUG STUFF
function debug() {
  let arg = arguments[0]

  if (arg == "forceMobile"){
    isMobile = true
    scaleToMobile()
  }
  if (arg == "oldScale"){
    daman.style.height = `160px`
    daman.style.width = `236px`
  }
}

