function ajaxCallBack(filename, result){
    $.ajax({
        url:"assets/data/"+filename+".json",
        method:"get",
        dataType:"json",
        success:result,
        error:function(jqXHR){
            var poruka="";
            if(jqXHR.status===0){
                poruka="Please verify your network.";
            }
            else if(jqXHR.status==400){
                poruka="Bad Request (400). The server cannot or will not process the request due to something that is perceived to be a client error.";
            }
            else if(jqXHR.status==404){
                poruka="Not found (404). The server can not find the requested resource. In the browser, this means the URL is not recognized.";
            }
            else if(jqXHR.status==408){
                poruka="Request Timeout (408). This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection.";
            }
            else if(jqXHR.status==409){
                poruka="Conflict (409). This response is sent when a request conflicts with the current state of the server.";
            }
            else if(jqXHR.status==500){
                poruka="Internal Server Error (500).The server has encountered a situation it does not know how to handle.";
            }
            else if(jqXHR.status==502){
                poruka="Bat Gateway (502). This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.";
            }
            else if(jqXHR.status==503){
                poruka="Service Unavailable (503). The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded.";
            }
            else if(jqXHR.status==504){
                poruka="Gateway Timeout (504). This error response is given when the server is acting as a gateway and cannot get a response in time.";
            }
            else if(jqXHR.status==505){
                poruka="HTTP Version not supported (505). The HTTP version used in the request is not supported by the server.";
            }
            else{
                poruka="Uncaught Error!" + jqXHR.responseText;
            }
            confirm(poruka);
        }
    });
}
function setItemToLocalStorage(ime, podatak){
    return localStorage.setItem(ime, JSON.stringify(podatak));
}
function getItemFromLocalStorage(ime){
    return JSON.parse(localStorage.getItem(ime));
}
//globalne variable za funkcije filtriranje i sortiranje 
var kategorijaIzabrana=false;
var vrstaIzabrana=false;
var bojaIzabrana=false;
var filter=false;

window.onload=function(){
    let url=window.location.hostname;
    console.log(url)
    ajaxCallBack("nav",function(result){
        ispisNav(result);
    });
    
    stampajBrojElKorpe();

    if(url=="saskaradosavljevic.github.io"||url=="cityflower.github.io/index.html"){
        ajaxCallBack("kat",function(result){
            ispisKategorija(result);
        });
        ajaxCallBack("usluge", function(result){
            ispisUsluga(result);
        })
        ajaxCallBack("preporuceni", function(result){
            ispisProizvoda(result,"prProizvodi");
        });
    }
    if(url=="saskaradosavljevic.github.io"||url=="cityflower.github.io/shop.html"){
        ajaxCallBack("kat", function(result){
            kreirajPadajuciListu(result,"Kategorija","listaKategorije");
        })
        ajaxCallBack("vrsta", function(result){
            kreirajPadajuciListu(result,"Vrste cveća","listaVrsta");
        })
        ajaxCallBack("sortiranje", function(result){
            kreirajPadajuciListu(result,"Sortiranje","listaSortiranja");
        })
        ajaxCallBack("boja", function(result){
            kreirajPadajuciListu(result,"Boje","listaSortiranjaBoja");
        });
        ajaxCallBack("proizvodi", function(result){
            ispisProizvoda(result,"proizvodi");
            setItemToLocalStorage("proizvodiNiz", result);
        })
        $(document).on('change','#listaKategorije', function(){
            var idK=$(this).val();
            if(idK==0){
                kategorijaIzabrana=false;
            }
            else{
                kategorijaIzabrana=true;
                
            }
            setItemToLocalStorage("kategorija", idK);
                filtriranje(idK,"idKat");
            
        });
        $(document).on('change','#listaVrsta', function(){
            var idV=$(this).val();
            if(idV==0){
                vrstaIzabrana=false;
            }
            else{
                vrstaIzabrana=true;
            }
            setItemToLocalStorage("vrsta",idV);
     

                filtriranje(idV,"idVrste");
            
        });
        $(document).on('change','#listaSortiranjaBoja', function(){
            var idBoja=$(this).val();
            if(idBoja==0){
                bojaIzabrana=false;
            }
            else{
                bojaIzabrana=true;
            }
            setItemToLocalStorage("boja",idBoja);

            filtriranje(idBoja,"boja")
           
        });
        $(document).on('change','#listaSortiranja', function(){
            var idSort=$(this).val();
            sortiranje(idSort,"cena");
        });
    }
    if(url=="saskaradosavljevic.github.io"||url=="cityflower.github.io/contact.html"){
        $(document).on('click','#btnPosalji',provera);
    }
    if(url=="saskaradosavljevic.github.io"||url=="cityflower.github.io/korpa.html"){
        var proizvodiLsKorpa=getItemFromLocalStorage("nizProizvodaUKorpi");

        if(proizvodiLsKorpa==null || proizvodiLsKorpa.length==0){
            prikazPrazneKorpe();
        }
        else{
            prikazKupljenihProizvoda();
        }
        $(document).on('click','#btnObrisiSve',obrisiSveStavke);
        $(document).on('click','#btnKupi',kupi);

        //$(document).on('click','#btnKupi', kupi);


    }
    
    
}
//funkcija za ispis nav
function ispisNav(nizNav){
    var ispis="";
    for(var objNav of nizNav){
        ispis+=`<li class="nav-item">
                    <a class="nav-link" href="${objNav.href}" target=${objNav.nacin}>${objNav.textLink}</a>
                </li>`;
    }
    $("#nav").html(ispis);
}
//funkcije za ispis kat
function ispisKategorija(nizKat){
    var ispis="";
    for(var objKat of nizKat){
        ispis+=`<div class="col-lg-4 text-center" id="b">
                    <h4 class="text-italic mt-5 mb-2">${objKat.naziv}</h4>
                    <p class="font-italic">-${objKat.opis}</p>
                    <img class="img-fluid" src="${objKat.slika.src}" alt="${objKat.slika.alt}"/>
                </div>`;
    }
    $("#kat").html(ispis);
}
//funkcija za ispis usluga
function ispisUsluga(nizUsluga){
    var ispis="";
    for(var objUsluge of nizUsluga){
        ispis+=`<div class="col-lg-4 text center">
                    <div class="usluga">
                        <span>
                            <img class="mb-2" src="${objUsluge.slika.src}" alt="${objUsluge.slika.alt}"/>
                        </span>
                        <div class="opis">
                             <h4 class="font-weight-bold">${objUsluge.naziv}</h4>
                             <p>${objUsluge.opis}</p>
                         </div>
                    </div>
                </div>`
    }
    $("#mi").html(ispis);
}
//funkcija za ispisivanje proizvoda
function ispisProizvoda(nizProizvoda, id){
    var ispis="";
    if(nizProizvoda.length==0){
        ispis+=`<p class="alert alert-danger">Ovog proizvoda trenutno nema.</p>`
    }
    else{
        for(var objProizvoda of nizProizvoda){
            ispis+=`<div class="col-md-6 col-lg-3 text-centre pt-5 mb-5" id="p">
            <img class="img-fluid" src="${objProizvoda.slika.src}" alt="${objProizvoda.slika.alt}"/>
            <h4 class="mt-5 mb-3">${objProizvoda.naziv}</h4>
            <h5>${objProizvoda.cena}.00 RSD</h5>
            <input type="button" value="DODAJ U KORPU" data-id=${objProizvoda.id} class="btn mt-3 mb-2 dodaj-u-korpu"/>
            </div>`;
        }
    }
    $("#"+id).html(ispis);
    $('.dodaj-u-korpu').click(dodajUKorpu);
}
//funkcija za dodavanje u korpu
function dodajUKorpu(){
    var id=$(this).data('id');

    var porizvodiKorpa=getItemFromLocalStorage("nizProizvodaUKorpi");

    if(porizvodiKorpa){
        if(proizvodJeVecUKorpi()){
            povecajBroj();
            $(this).val("DODATO U KORPU");
        }
        else{
            dodajNoviProizvod();
            stampajBrojElKorpe();
            $(this).val("DODATO U KORPU");
        }
    }
    else{
        dodavanjePrvogProizvodaUKorpu();
        stampajBrojElKorpe();
        $(this).val("DODATO U KORPU");
    }

    //funkcija za dodavnje prvog proizvoda u korpu
    function dodavanjePrvogProizvodaUKorpu(){
        var proizvodi=[];
        proizvodi[0]={
            id : id,
            kolicina : 1
        };
        setItemToLocalStorage("nizProizvodaUKorpi", proizvodi);

    }
    //funkcija koja proverava da li proizvod vec postoji u korpi
    function proizvodJeVecUKorpi(){
        return porizvodiKorpa.find(el=>el.id==id);
    }
    //funkcija koja povecava kolicinu
    function povecajBroj(){
        var proizvodiLS=getItemFromLocalStorage("nizProizvodaUKorpi");
        
        for(var i=0;i<proizvodiLS.length;i++){
            if(proizvodiLS[i].id==id){
                proizvodiLS[i].kolicina++;
                break;
            }
        }
        setItemToLocalStorage("nizProizvodaUKorpi", proizvodiLS);
    }
    //funkcija za dodavanje novog proizvoda
    function dodajNoviProizvod(){
        var proizvodiLS=getItemFromLocalStorage("nizProizvodaUKorpi");

        proizvodiLS.push({
            id : id,
            kolicina : 1
        });
        setItemToLocalStorage("nizProizvodaUKorpi", proizvodiLS);
    }
   

}
//funkcija za povecavanje proizvoda prilikom klika na dodaj u korpu
function stampajBrojElKorpe(){
    var proizvodiLsKorpa=getItemFromLocalStorage("nizProizvodaUKorpi");

    if(proizvodiLsKorpa!=null){
        var brojOdProizvoda=proizvodiLsKorpa.length;
        document.getElementById("brProizvoda").textContent=`${brojOdProizvoda}`;
    }
    else{
        document.getElementById("brProizvoda").textContent=`0`;
    }
}
//funkcija za obavestenje da je korpa prazna
function prikazPrazneKorpe(){
    $("#sadrzaj").html(`<div class="col-12 text-center"><h3>Vaša korpa je prazna!</h3></div>
                        <div class="col-12 text-center mt-3 f"> <a class="p-2 text-decoration-none" href="shop.html">pogledajte ponudu</a></div>`);

}
//funkcija za prikaz kupljenih proizvoda
function prikazKupljenihProizvoda(){
    var proizvodi=getItemFromLocalStorage("proizvodiNiz")
    var proizvodiLsKorpa=getItemFromLocalStorage("nizProizvodaUKorpi");

    var kupljeniProizvodi=[];


    kupljeniProizvodi=proizvodi.filter(p=>{
        for(var objPr of proizvodiLsKorpa){
            if(p.id == objPr.id){
                p.kolicina = objPr.kolicina;
                return true;
            }
        }
        return false;
    });
    prikaziKupljenjeProizvode(kupljeniProizvodi);
}
//funkcija za prikaz sadrzaj korpe
function prikaziKupljenjeProizvode(proizvodi){
    var ispis="";
    var html="";
    var cenaUkupna=0;

    for(var p of proizvodi){
        ispis+=`<div class="col-12 text-left btn">
        <div class="card mb-3" style="max-width: 740px ;">
            <div class="row no-gutters">
                <div class="col-sm-4">
                    <img src="${p.slika.src}" class="card-img" alt="${p.slika.alt}">
                </div>
                <div class="col-sm-8">
                    <div class="card-body">
                        <h5 class="card-title">${p.naziv}</h5>
                        <p class="card-text">Količina  ${p.kolicina}</p>
                        <p class="card-text">Cena  ${p.cena * p.kolicina}.00 RSD</p>
                    </div>
                    <div class="card-footer text-right">
                        <p class="card-text">Ukupno  ${p.cena * p.kolicina}.00 RSD</p>
                        <button type="button" id="btnObrisi" class="btn" onclick="obrisiStavkuKorpe(${p.id})">Obriši</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    }
    for(var p of proizvodi){
        cenaUkupna+=p.cena*p.kolicina;
    }
    html+=`<div class="col-12 text-right btn">
            <p>Ukupna cena porudžbine  ${cenaUkupna}.00 RSD</p>
            <button type="button" id="btnObrisiSve" class="btn">Obriši Sve</button>
            <button type="button" id="btnKupi" class="btn">Kupi</button>
        </div>
        `;

    $('#obrisiSve').html(html);
    $('#sadrzaj').html(ispis);
}
//funkcija za brisanje stavke u korpi
function obrisiStavkuKorpe(id){
    var proizvodi=getItemFromLocalStorage("nizProizvodaUKorpi");
    var obrisaniProizvodi=proizvodi.filter(p=>p.id!=id);

    setItemToLocalStorage("nizProizvodaUKorpi",obrisaniProizvodi);
    
    var proizvodi2=getItemFromLocalStorage("nizProizvodaUKorpi");

    if(proizvodi2.length==0){
        $("#sadrzaj").html(`<div class="col-12 text-center"><h3>Vaša korpa je prazna!</h3></div>
                            <div class="col-12 text-center mt-3 f"> <a class="p-2 text-decoration-none" href="shop.html">pogledajte ponudu</a></div>`);;
        $("#obrisiSve").html("");

    }
    else{
        prikazKupljenihProizvoda();
    }
    stampajBrojElKorpe();

}
//funkcija za brisanje sviih stavki
function obrisiSveStavke(){
    localStorage.removeItem("nizProizvodaUKorpi");

    $("#sadrzaj").html(`<div class="col-12 text-center"><h3>Vaša korpa je prazna!</h3></div>
                        <div class="col-12 text-center mt-3 f"> <a class="p-2 text-decoration-none" href="shop.html">pogledajte ponudu</a></div>`);
    $("#obrisiSve").html("");
    stampajBrojElKorpe();

}
//funkcija za kupi
function kupi(){
    $("#sadrzaj").html(`<div class="col-12 text-center"><h3>Još samo malo do uspešne kupovine!</h3></div>
                        <div class="col-12 text-center mt-3 f"> <a class="p-2 text-decoration-none" href="contact.html ">popunite formu</a></div>`)
    $("#obrisiSve").html("");

    stampajBrojElKorpe();
    //obrisiSveStavke();
}
//kreiranje padajuce liste
function kreirajPadajuciListu(podaci, selected, id){
    var lista =`<option value="0" selected>${selected}</option>`;
                
    for(var podatakObj of podaci){
        lista +=`<option value="${podatakObj.id}">${podatakObj.naziv}</option>`;
    }
    
    $("#"+id).html(lista);
}
//funkcija za filtriranje
function filtriranje(id, svojstvo){
    //var filtriranje;
    filter=true;
    var proizvodiLS=getItemFromLocalStorage("proizvodiNiz");
    var kat=getItemFromLocalStorage("kategorija");
    var vrsta=getItemFromLocalStorage("vrsta");
    var boja=getItemFromLocalStorage("boja");
    
    if(kategorijaIzabrana==true){
        proizvodiLS=proizvodiLS.filter(objProizvod=>objProizvod["idKat"]==kat);
    }
    
    if(vrstaIzabrana==true){
        proizvodiLS=proizvodiLS.filter(objProizvod=>objProizvod["idVrste"]==vrsta);

    }
    if(bojaIzabrana==true){
        proizvodiLS=proizvodiLS.filter(objProizvod=>objProizvod["boja"]==boja);

    }
    setItemToLocalStorage("filtriraniProizvodi", proizvodiLS);
    ispisProizvoda(proizvodiLS,"proizvodi");

}
//funkcija za sortiranje
function sortiranje(id, svojstvo){
    var proizvodiLS=getItemFromLocalStorage("proizvodiNiz");
    if(filter==true){
        proizvodiLS=getItemFromLocalStorage("filtriraniProizvodi");
    }

    if(id=="1"){
        proizvodiLS.sort(function(a,b){
            return a[svojstvo]-b[svojstvo];
        });
    }
    else if(id=="2"){
        proizvodiLS.sort(function(a,b){
            return b[svojstvo]-a[svojstvo];
        });
    }
    else if(id=="3"){
        proizvodiLS.sort(function(a,b){
            if(a.naziv<b.naziv){
                return -1;
            }
            else if(a.naziv>b.naziv){
                return 1;
            }
            else{
                return 0;
            }
        });
    }
    else if(id=="4"){
        proizvodiLS.sort(function(a,b){
            if(a.naziv>b.naziv){
                return -1;
            }
            else if(a.naziv<b.naziv){
                return 1;
            }
            else{
                return 0;
            }
        });
    }
    else{
        proizvodiLS=getItemFromLocalStorage("proizvodiNiz")
    }

    ispisProizvoda(proizvodiLS, "proizvodi");
}
//funkcija za proveru forme
function provera(){
    var poljeImePrezime=document.querySelector("#tbImePrezime");
    var poljeEmail=document.querySelector("#tbEmail");
    var poljeTelefon=document.querySelector("#tbTelefon");
    var poljeAdresa=document.querySelector("#tbAdresa");
    var poljeDatum=document.querySelector("#datum");
    var poljeVreme=document.querySelector("#vreme");

    var reImePrezime=/^[A-ZŠĐČĆŽ][a-zšđčćž]{2,15}(\s[A-ZŠĐČĆŽ][a-zšđčćž]{2,15})+$/;
    var reEmail=/^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    var reTelefon=/^\+381\s6[0-9]\s[0-9]{3}\s[0-9]{3,4}$/;
    var reAdresa=/^([A-ZŠĐČĆŽ]|[1-9]{2,20})([A-ZŠĐČĆŽa-zšđčćž\d\-\.\s])+$/;

    var greska=0;

    //provera ime i prezime
    if (poljeImePrezime.value.length < 3 || (!reImePrezime.test(poljeImePrezime.value))) {
        poljeImePrezime.nextElementSibling.classList.add("prikaz");
        greska++;
    }
    else {
        poljeImePrezime.nextElementSibling.classList.remove("prikaz");
    }

    //provera mejla
    if (!reEmail.test(poljeEmail.value)) {
        poljeEmail.nextElementSibling.classList.add("prikaz");
        greska++;
    }
    else {
        poljeEmail.nextElementSibling.classList.remove("prikaz");
    }

    //provera telefona
    if(!reTelefon.test(poljeTelefon.value)){
        poljeTelefon.nextElementSibling.classList.add("prikaz");
        greska++;
    }
    else{
        poljeTelefon.nextElementSibling.classList.remove("prikaz");
    }

    //provera adrese
    if(!reAdresa.test(poljeAdresa.value)){
        poljeAdresa.nextElementSibling.classList.add("prikaz");
        greska++;
    }
    else{
        poljeAdresa.nextElementSibling.classList.remove("prikaz");
    }

    //provera datuma
    if(poljeDatum.value.length<1){
        poljeDatum.nextElementSibling.classList.add("prikaz");
        greska++;
    }
    else{
        poljeDatum.nextElementSibling.classList.remove("prikaz");
    }

    //provera vremena
    if(poljeVreme.value.length<1){
        poljeVreme.nextElementSibling.classList.add("prikaz");
        greska++;
    }
    else{
        poljeVreme.nextElementSibling.classList.remove("prikaz");
    }

    //provera radio button
    var taster=document.getElementsByName("rbDostava");
    var tasteriVrednost="";

    for(var i=0;i<taster.length;i++){
        if(taster[i].checked){
            tasteriVrednost=taster[i].value;
            break;
        }
    }
    var poruka=document.getElementById("rb");
    if(tasteriVrednost==""){
        poruka.classList.add("prikaz");
        greska++;
    }
    else{
        poruka.classList.remove("prikaz")
    }



    //provera gresaka
    if(greska==0){
        document.querySelector("#uspesno").classList.add("prikaz");
        document.querySelector("#neuspesno").classList.remove("prikaz");
        obrisiSveStavke();
    }
    else{
        document.querySelector("#neuspesno").classList.add("prikaz");
    }



    
    

}
