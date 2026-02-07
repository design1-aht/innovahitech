// Main site script: navigation toggle, year, hero slider, dealer render, and basic contact form validation

(function(){
  var body=document.body;
  var navToggle=document.getElementById("navToggle");
  var siteNav=document.getElementById("siteNav");
  var yearSpan=document.getElementById("year");
  if(yearSpan){yearSpan.textContent=new Date().getFullYear();}

  if(navToggle&&siteNav){
    navToggle.addEventListener("click",function(){
      if(body.classList.contains("nav-open")){
        body.classList.remove("nav-open");
      }else{
        body.classList.add("nav-open");
      }
    });
  }

  // Lightweight hero slider for home page visuals
  (function(){
    var slides=document.querySelectorAll(".hero-slide");
    if(!slides.length){return;}
    var dots=document.querySelectorAll(".hero-dot");
    var index=0;
    var timer;

    function show(i){
      index=i;
      for(var s=0;s<slides.length;s++){
        slides[s].classList.toggle("hero-slide-active",s===index);
      }
      for(var d=0;d<dots.length;d++){
        dots[d].classList.toggle("hero-dot-active",d===index);
      }
    }

    function start(){
      stop();
      timer=setInterval(function(){
        show((index+1)%slides.length);
      },4500);
    }

    function stop(){
      if(timer){clearInterval(timer);timer=null;}
    }

    for(var d=0;d<dots.length;d++){
      /* eslint-disable no-loop-func */
      dots[d].addEventListener("click",function(e){
        var i=parseInt(e.currentTarget.getAttribute("data-index"),10);
        if(!isNaN(i)){show(i);start();}
      });
      /* eslint-enable no-loop-func */
    }

    show(0);
    start();
  })();

  // Dealer list render using provided data
  (function(){
    var dealerContainer=document.getElementById("dealerList");
    var filterSelect=document.getElementById("dealerStateFilter");
    var mapSvg=document.getElementById("indiaMap");
    var markerGroup=mapSvg?mapSvg.querySelector("#dealerMarkers"):null;
    var mapInfo=document.getElementById("dealerMapInfo");
    if(!dealerContainer){return;}

    var dealers=[
      {
        name:"AHUJA ARMOURY",
        address:"SHOP NO. G-5, SHUBHAM PLAZA, OLD KASAULI ROAD, PARWANOO, TEHSIL KASAULI, DISTRICT SOLAN H.P.",
        state:"HIMACHAL PRADESH",
        email:"kaisersarhadi@gmail.com",
        contactPerson:"N/A",
        MobileNumber:"9805484666",
        latlng:[30.841627262909597,76.95777718125744],
        isSports:false
      },
      {
        name:"AJEETSINH RAMAKANTRAO SHINDE ARMS & AMMUNITION DEALER",
        address:"Plot 11, Near, Bibi ka Maqbara Rd, Gurudatta Nagar, Vidyut Colony, Begumpura, Chhatrapati Sambhajinagar (Aurangabad), MH 431004.",
        state:"MAHARASHTRA",
        email:"arshinde59@gmail.com",
        contactPerson:"N/A",
        MobileNumber:"7588568235",
        latlng:[19.90016437873702,75.31704770296004]
      },
      {
        name:"AIMPOINT ARMS & AMMUNITION DEALER",
        address:'Shop No. 59 "Wonderland" 7, M.G. Road Pune-411001',
        state:"MAHARASHTRA",
        email:"aimpointpune@gmail.com",
        contactPerson:"Mohammed Bandukwala",
        MobileNumber:"9823866007",
        latlng:[18.51637323903321,73.879118212283]
      },
      {
        name:"AMATHI KALGUDY ARMOURY",
        address:"AMATHI KALGUDY ARMOURY, VIRAJPET,KARMADU  KODAGU , KARNATAKA 571249",
        state:"KARNATAKA",
        email:"Somtarget@gmail.com",
        contactPerson:"N/A",
        MobileNumber:"7338339333",
        latlng:[12.239487588011697,75.85702554235698]
      },
      {
        name:"ANIL ARMOURY",
        address:"SHOP NO 58 MANGAL MARKET RAILWAY STATION JAMMU (J&K) 180012",
        state:"JAMMU AND KASHMIR",
        email:"anilarmoury@gmail.com",
        contactPerson:"N/A",
        MobileNumber:"9858801668",
        latlng:[32.706993667065696,74.87692259626319]
      },
      {
        name:"ARIES ENTERPRISE",
        address:"GF. Shop no. 9, choice restaurants, Ocean Park, Satellite Rd, Niyojan Nagar, Nehru Nagar, Ambawadi, Ahmedabad, Gujarat 380015",
        state:"GUJARAT",
        email:"ariesgunshop@gmail.com",
        contactPerson:"N/A",
        MobileNumber:"9898018633",
        latlng:[23.02213897594641,72.53838570688629]
      },
      {
        name:"BADSHAH ARMS",
        address:"103/A Kshir Sagar Complex, Tilak Marg New Road, Ujjain (M.P.) 456006",
        state:"MADHYA PRADESH",
        email:"badshaharms@gmail.com",
        contactPerson:"N/A",
        MobileNumber:"9826725219,9424014672",
        latlng:[23.18660254498433,75.77711713589582]
      }
    ];

    var statePositions={
      "HIMACHAL PRADESH":[115,80],
      "JAMMU AND KASHMIR":[115,55],
      "PUNJAB":[110,95],
      "MAHARASHTRA":[135,165],
      "GUJARAT":[100,150],
      "KARNATAKA":[135,205],
      "MADHYA PRADESH":[135,145]
    };

    var activeDealerId=null;

    function updateMapInfo(d){
      if(!mapInfo){return;}
      if(!d){
        mapInfo.innerHTML="<p>Select a dealer from the list or tap a marker to view details.</p>";
        return;
      }
      var html="<strong>"+d.name+"</strong><br>"+d.address+"<br>State: "+d.state;
      if(d.MobileNumber){html+="<br>Phone: "+d.MobileNumber;}
      if(d.email){html+='<br>Email: '+d.email;}
      mapInfo.innerHTML="<p>"+html+"</p>";
    }

    function renderMarkers(){
      if(!markerGroup){return;}
      markerGroup.innerHTML="";
      dealers.forEach(function(d,idx){
        var pos=statePositions[d.state];
        if(!pos){return;}
        var g=document.createElementNS("http://www.w3.org/2000/svg","g");
        g.setAttribute("class","dealer-marker");
        g.setAttribute("data-index",String(idx));
        var circle=document.createElementNS("http://www.w3.org/2000/svg","circle");
        circle.setAttribute("cx",String(pos[0]));
        circle.setAttribute("cy",String(pos[1]));
        circle.setAttribute("r","5");
        circle.setAttribute("fill","#38bdf8");
        circle.setAttribute("stroke","#020617");
        circle.setAttribute("stroke-width","2");
        g.appendChild(circle);
        markerGroup.appendChild(g);
      });

      markerGroup.addEventListener("click",function(e){
        var target=e.target;
        while(target&&target!==markerGroup&&!target.getAttribute("data-index")){
          target=target.parentNode;
        }
        if(!target||target===markerGroup){return;}
        var idx=parseInt(target.getAttribute("data-index"),10);
        if(isNaN(idx)){return;}
        setActiveDealer(idx);
      });
    }

    function setActiveDealer(idx){
      activeDealerId=idx;
      var d=dealers[idx];
      updateMapInfo(d);
      if(markerGroup){
        var markerNodes=markerGroup.querySelectorAll(".dealer-marker");
        for(var i=0;i<markerNodes.length;i++){
          markerNodes[i].classList.toggle("active",parseInt(markerNodes[i].getAttribute("data-index"),10)===idx);
        }
      }
      var dealerItems=dealerContainer.querySelectorAll("[data-dealer-index]");
      for(var j=0;j<dealerItems.length;j++){
        dealerItems[j].classList.toggle("active",parseInt(dealerItems[j].getAttribute("data-dealer-index"),10)===idx);
      }
    }

    function renderList(filterState){
      dealerContainer.innerHTML="";
      var filtered=dealers.filter(function(d){
        return !filterState||d.state===filterState;
      });

      var byState={};
      filtered.forEach(function(d){
        if(!byState[d.state]){byState[d.state]=[];}
        byState[d.state].push(d);
      });

      Object.keys(byState).sort().forEach(function(state){
        var region=document.createElement("article");
        region.className="dealer-region";

        var h=document.createElement("h2");
        h.textContent=state;
        region.appendChild(h);

        var list=document.createElement("ul");
        byState[state].forEach(function(d){
          var idx=dealers.indexOf(d);
          var li=document.createElement("li");
          li.setAttribute("data-dealer-index",String(idx));
          li.textContent=d.name;
          li.addEventListener("click",function(){
            setActiveDealer(idx);
          });
          list.appendChild(li);
        });
        region.appendChild(list);

        dealerContainer.appendChild(region);
      });
    }

    // Populate state filter
    if(filterSelect){
      var seenStates={};
      dealers.forEach(function(d){
        if(!seenStates[d.state]){
          seenStates[d.state]=true;
          var opt=document.createElement("option");
          opt.value=d.state;
          opt.textContent=d.state;
          filterSelect.appendChild(opt);
        }
      });

      filterSelect.addEventListener("change",function(){
        var val=filterSelect.value||"";
        renderList(val);
        updateMapInfo(null);
      });
    }

    renderList("");
    renderMarkers();
    updateMapInfo(null);
  })();

  // Scroll to top button
  (function(){
    var btn=document.getElementById("scrollTopBtn");
    if(!btn){return;}
    window.addEventListener("scroll",function(){
      if(window.scrollY>160){btn.classList.remove("hidden");}
      else{btn.classList.add("hidden");}
    });
    btn.addEventListener("click",function(){
      window.scrollTo({top:0,behavior:"smooth"});
    });
  })();

  // Basic contact form validation and dummy submit
  var form=document.getElementById("contactForm");
  if(form){
    var statusEl=document.getElementById("formStatus");
    form.addEventListener("submit",function(e){
      e.preventDefault();
      if(statusEl){statusEl.textContent="";statusEl.className="form-status";}

      var nameEl=form.querySelector("#name");
      var emailEl=form.querySelector("#email");
      var phoneEl=form.querySelector("#phone");
      var messageEl=form.querySelector("#message");

      var valid=true;

      function setError(id,msg){
        var errorEl=form.querySelector('.form-error[data-for="'+id+'"]');
        if(errorEl){errorEl.textContent=msg;}
      }
      function clearError(id){
        var errorEl=form.querySelector('.form-error[data-for="'+id+'"]');
        if(errorEl){errorEl.textContent="";}
      }

      var nameValue=nameEl.value.trim();
      if(!nameValue){valid=false;setError("name","Please enter your name.");}else{clearError("name");}

      var emailValue=emailEl.value.trim();
      var emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailValue){valid=false;setError("email","Please enter your email address.");}
      else if(!emailPattern.test(emailValue)){valid=false;setError("email","Please enter a valid email address.");}
      else{clearError("email");}

      var phoneValue=phoneEl.value.trim();
      if(!phoneValue){valid=false;setError("phone","Please enter your phone number.");}
      else if(phoneValue.replace(/\D/g,"").length<7){valid=false;setError("phone","Please enter a complete phone number.");}
      else{clearError("phone");}

      var messageValue=messageEl.value.trim();
      if(!messageValue){valid=false;setError("message","Please enter your message.");}else{clearError("message");}

      if(!valid){
        if(statusEl){statusEl.textContent="Please correct the highlighted fields and try again.";statusEl.className="form-status error";}
        return;
      }

      // At this point, the data is considered valid on the client side.
      // To connect with a real Google Sheet, replace the placeholder URL below
      // with your published Apps Script / form endpoint.
      // Example: var endpoint="https://script.google.com/macros/s/XXXXX/exec";
      var endpoint="https://example.com/dummy-google-sheet-endpoint";

      // Lightweight simulated submission to keep this static and fast.
      if(statusEl){statusEl.textContent="Submitting...";statusEl.className="form-status";}

      // Simulate async submit without actual network dependency
      setTimeout(function(){
        if(statusEl){statusEl.textContent="Your enquiry has been captured locally. Connect the form to your Google Sheet endpoint to receive submissions.";statusEl.className="form-status success";}
        form.reset();
      },600);
    });
  }
})();

