/**
 * Created by Ariel on 17/09/2015.
 */


//var runner = new Ext.util.TaskRunner();
var cargando =  'loading...';
var _this = this;
var urlajax = '/planificacion/pdo/plan/index.php/cmpnotificaciones/jsonNotificacion';
//ajax(urlajax,true,cargando)


//window.setInterval("ajax(urlajax,true,cargando)", 150000,'JavaScript');

/*
 if (!document.getElementById('icons'))
 this.loadCss("/planificacion/pdo/comun/css/icons.css", 'icons');
 if (!document.getElementById('examples'))
 this.loadCss("/planificacion/pdo/comun/css/examples.css", 'examples');*/




if (!document.getElementById('RowExpander'))
    this.loadJs("/planificacion/pdo/comun/js/RowExpander.js", 'RowExpander');

/*if (!document.getElementById('GridFilters'))
 this.loadJs("/planificacion/pdo/comun/filtros/GridFilters.js", 'GridFilters')*;*/
if (!document.getElementById('examplesjs'))
    this.loadJs("/planificacion/pdo/comun/js/examples.js", 'examplesjs');
if (!document.getElementById('TreeGrid'))
    this.loadJs("/planificacion/pdo/comun/js/TreeGrid.js", 'TreeGrid');
if (!document.getElementById('CmpBase'))
    this.loadJs("/planificacion/pdo/comun/js/CmpBase.js", 'CmpBase');
if (!document.getElementById('CmpBarraProgreso'))
    this.loadJs("/planificacion/pdo/comun/js/CmpBarraProgreso.js", 'CmpBarraProgreso');
if (!document.getElementById('CmpPaginadoTreegrid'))
    this.loadJs("/planificacion/pdo/comun/js/CmpPaginadoTreegrid.js", 'CmpPaginadoTreegrid');
/*if (!document.getElementById('extensiones'))
    this.loadJs("/planificacion/pdo/comun/js/extensiones.js", 'extensiones');*/

if (!document.getElementById('cmpcrudplan'))
    this.loadJs("/planificacion/pdo/plan/views/js/cmpcrudplan/cmpcrudplan.js", 'cmpcrudplan');
if (!document.getElementById('cmprelaciones'))
    this.loadJs("/planificacion/pdo/plan/views/js/cmprelaciones/cmprelaciones.js", 'cmprelaciones');
if (!document.getElementById('cmpctrlreasignaciones'))
    this.loadJs("/planificacion/pdo/plan/views/js/cmpctrlreasignaciones/cmpctrlreasignaciones.js", 'cmpctrlreasignaciones');
if (!document.getElementById('cmpcrudactividades'))
    this.loadJs("/planificacion/pdo/plan/views/js/cmpcrudactividades/cmpcrudactividades.js", 'cmpcrudactividades');
if (!document.getElementById('cmpfondodetiempo'))
    this.loadJs("/planificacion/pdo/plan/views/js/cmpfondodetiempo/cmpfondodetiempo.js", 'cmpfondodetiempo');
if (!document.getElementById('cmpgestordocumental'))
    this.loadJs("/planificacion/pdo/plan/views/js/cmpgestordocumental/cmpgestordocumental.js", 'cmpgestordocumental');
if (!document.getElementById('cmpcrudactividadrecurso'))
    this.loadJs("/planificacion/pdo/plan/views/js/cmpcrudactividadrecurso/cmpcrudactividadrecurso.js", 'cmpcrudactividadrecurso');
if (!document.getElementById('cmpcrudobjetivos'))
    this.loadJs("/planificacion/pdo/plan/views/js/cmpcrudobjetivos/cmpcrudobjetivos.js", 'cmpcrudobjetivos');
if (!document.getElementById('cmpclasificadorinvol'))
    this.loadJs("/planificacion/pdo/plan/views/js/cmpclasificadorinvol/cmpclasificadorinvol.js", 'cmpclasificadorinvol');
if (!document.getElementById('cmpnotificaciones'))
    this.loadJs("/planificacion/pdo/plan/views/js/cmpnotificaciones/cmpnotificaciones.js", 'cmpnotificaciones');

function Request()
{
    var a = false;
    try{
        a = new XMLHttpRequest();
    }
    catch(err1){
        try{
            a =  new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch(err2){
            try
            {
                a = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch(err3)
            {
                a = false;
            }
        }
    }
    return a;
}

function getTime(){
    var t=new Date();
    return t.getTime();
}

function ajax(URL,r,c){
    fechaUltimaAccion=getTime();
    var objeto=Request();
    if(objeto.readyState==4||objeto.readyState==0)
    {
        var ramdon=Math.floor(Math.random()*11111111);
        objeto.open("GET",URL,true);
        objeto.onreadystatechange=function()
        {

            if(objeto.readyState==1)
                c();
            if(objeto.readyState==4)
            {
                if(objeto.status==200){
                    respuesta=objeto.responseText;
                    if(respuesta!=0){
                        var audio = new Audio('/planificacion/pdo/comun/Windows Foreground.wav');
                        audio.play();
                        popup('Usted tiene nuevas notificaciones.');
                    }

                }
                else
                    alert("Problemas en la conexion al servidor: "+objeto.statusText);
            }
        };
        objeto.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest');
        objeto.setRequestHeader( 'X-Infodrez-version',  '0.2');
        objeto.setRequestHeader( 'Accept' , 'text/javascript, text/html, application/xml, text/xml, */*' );
        objeto.send(null);
    }
    else
    if(r==true)
        setTimeout("ajax('"+URL+"','"+r+"','"+c+"')",1000);
}

initStyles = function () {
    var styleLeaf = document.createElement('style');
    styleLeaf.innerHTML = "" +
    ".msg .x-box-mc {font-size:14px;} " +
    'div#imgOk{background: url("/lib/UCID/images/ok.png") no-repeat left; width: 50px; height: 50px; float: left; margin: -25px 0px 0px -25px;}' +
    "#msg-div-notif {position:absolute;left:1%;top:90%;width:280px;z-index:20000;} " +
    "#msg-div-notif .msg {border-radius: 8px;-moz-border-radius: 8px;background: #F6F6F6;border: 2px solid #3764A0;margin-top: 0px;padding: 10px 15px;color: #04408c;box-shadow: 2px 2px 15px #3764A0;} " +
    "#msg-div-notif .msg h3 {margin: 0 0 8px;font-weight: bold;font-size: 12px;text-align: center;} " +
    "msg-div-notif .msg p {margin: 0;} "+
        "#closePopup-notif { background: url('/planificacion/pdo/comun/recursos/images/close.png') no-repeat center !important;width: 9px;height: 9px;position: absolute;right:6px;top:5px;cursor:pointer;opacity:0.5}"+
        "#closePopup-notif:hover {opacity:1 }";
    document.body.appendChild(styleLeaf);
}();
popup = function (msg) {

    var elem = document.getElementById('msg-div-notif');
    if(elem)
        elem.parentNode.removeChild(elem);

    var msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-div-notif'}, true);
    var nuevo = Ext.DomHelper.append(msgCt, '<div class="msg"><div onclick="this.parentNode.remove()" id="closePopup-notif"></div><h3>' + msg +'</h3><div style="text-align:center; padding-top: 7px; color: white; cursor:pointer;   margin-right: auto; margin-left: auto; background-color: rgb(4, 64, 140); height: 25px; width: 120px; border-radius: 5px; margin-top: 1px;" onclick="mostrarNotificaciones()">Visualizar</div> </div>', true);
    nuevo.on('click',function(eve,ert,opt){
        nuevo.ghost("b", {/*duration: 4,*/ remove: true});
    })

    nuevo.slideIn('b');//.pause(1).ghost("b", {/*duration: 4, remove: true*/});
};


function mostrarNotificaciones(){




    this.objCmpNotificaciones = new Utilidades.Cmp.CmpNotificaciones(
        {
            MostrarFiltroPorTipoElem: true,
            UsarBtnCerrar: false,
            maxWinPrincipal: false,
            closeableWinPrincipal: true,
            Mostrartitle: 'Registro de notificaciones'
        });

    _this.objCmpNotificaciones.CargarCmpNotificaciones();
}


function loadJs(jsSrc, id)
{
    if (jsSrc != null)
    {
        var tagScript = document.createElement("script");
        tagScript.setAttribute("type", "text/javascript");
        tagScript.setAttribute("id", id);
        tagScript.setAttribute("src", jsSrc);
        document.getElementsByTagName("body")[0].appendChild(tagScript);
    }
}


function loadCss(cssSrc, id)
{
    if (cssSrc != null)
    {
        var tagScript = document.createElement("link");
        tagScript.setAttribute("type", "text/css");
        tagScript.setAttribute("id", id);
        tagScript.setAttribute("href", cssSrc);
        tagScript.setAttribute("rel","stylesheet");
        document.getElementsByTagName("body")[0].appendChild(tagScript);
    }
}




