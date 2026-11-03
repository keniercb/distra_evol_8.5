/*
 *interfaz para la visualizacion de la Conciliacion bancaria
 *@autor Adolfo de la Paz
 *@version 1.0
 *UCID-2012
 **/
mostrarReporte(); //se ejecuta la funcion que muestra el reporte
function CalcularConc(datos)
{
    datos = Ext.decode(datos); 
    Ext.Ajax.request({
        url : 'calcularconciliacion',
        method:'POST',
        callback: function (options,success,response){
            creaReporte(Ext.decode(response.responseText));          
        },
        params:{
            tipocuenta:Ext.encode(datos[0]),
            fechainicio: datos[1],
            fechafin: datos[2],
            identidades: Ext.encode(datos[3])
        }
    });
}

function creaReporte(datosrep){   
    var datosresumen = datosrep.resumen;//datos de los resumenes
    var cantidadRes = datosrep.cantidadRes;//cantidad de reportes resumen
    var datosdesglose = datosrep.desglose;//datos de los desgloses
    var usuario = datosrep.usuario;//usuario que genera el reporte
    var iter=0;//iterador, se mueve por cada elemento de cantidad  ->estructuras  
    var mostrar='';//html a mostrar    
    if(cantidadRes > 0){//si vienen datos        
        do{
            /*var cadfecha='';
            if(datosrep.fechainicio) cadfecha+=' desde '+datosrep.fechainicio;//si tiene fecha desde
            if(datosrep.fechafin) cadfecha+=' hasta '+datosrep.fechafin;//si tiene fecha hasta*/
            //AQUI COMIENZA EL RESUMEN***********************************/       
            mostrar+= '<table width="100%" style="font-size:12px; font-family: Arial, Helvetica, sans-serif; border:1px solid #000;">'+//encabezado resumen
            '<tr><td colspan="3" align="center">UNIDAD MILITAR '+datosresumen[iter][0].codigoentidad+' '+datosresumen[iter][0].descripcionentidad+'</td></tr>'+
            '<tr><td colspan="3" align="center" style="border:1px solid #000; border-top:none;border-right:none;border-left:none">CONCILIACI&Oacute;N MENSUAL DE LAS CUENTAS BANCARIAS</td></tr>'+
            '<tr><td colspan="3">CUENTA BANCARIA DE: '+datosresumen[iter][0].texo+'</td></tr>'+//nombre del tipo documento
            '<tr><td colspan="3">CUENTA BANCARIA: '+datosresumen[iter][0].concatcuentabancaria+' '+datosresumen[iter][0].nombrecuentabancaria+'</td></tr>'+//nombre de la cta bancaria
            //'<tr><td colspan="3">FECHA: '+cadfecha+'</td>'+//fila de la fecha
            '<tr><td colspan="3">FECHA: '+datosrep.fechafin+'</td>'+//fila de la fecha
            '<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';//fila en blanco
            for (i = 1; i < datosresumen[iter].length-8; i++) {//las cuentas
                mostrar+= '<tr><td colspan="2">'+datosresumen[iter][i].texo+'</td>'+
                '<td colspan="1" align="right">'+formatoMoneda(Math.abs(datosresumen[iter][i].importe))+'</td></tr>';
            }
            var longitud=datosresumen[iter].length;
            mostrar+='<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';//fila en blanco
            mostrar+='<tr><td colspan="2">SALDO EN BANCO SEG&Uacute;N LIBRO </td><td align="right">'+formatoMoneda(Math.abs(datosresumen[iter][longitud-8].importe))+'</td></tr>';//saldo en banco segun libro
            mostrar+='<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';//fila en blanco
            mostrar+='<tr><td colspan="2">M&Aacute;S CHEQUES EN TR&Aacute;NSITO </td><td align="right">'+formatoMoneda(Math.abs(datosresumen[iter][longitud-7].importe))+'</td></tr>';//saldo en banco segun libro
            mostrar+='<tr><td>Pendiente a&ntilde;o anterior </td><td align="right">'+formatoMoneda(Math.abs(datosresumen[iter][longitud-6].importe))+'</td><td>&nbsp;</td></tr>';//saldo en banco segun libro
            mostrar+='<tr><td>Pendiente a&ntilde;o actual </td><td align="right">'+formatoMoneda(Math.abs(datosresumen[iter][longitud-5].importe))+'</td><td>&nbsp;</td></tr>';//saldo en banco segun libro
            mostrar+='<tr><td>TOTAL </td><td align="right">'+formatoMoneda(Math.abs(datosresumen[iter][longitud-4].importe))+'</td><td>&nbsp;</td></tr>';//saldo en banco segun libro
            mostrar+='<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';//fila en blanco
            mostrar+='<tr><td colspan="2">M&Aacute;S O (MENOS) </td><td align="right">'+formatoMoneda(Math.abs(datosresumen[iter][longitud-3].importe))+'</td></tr>';//saldo en banco segun libro
            mostrar+='<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';//fila en blanco
            mostrar+='<tr><td colspan="2">SALDO SEG&Uacute;N ESTADO DE CUENTA BANCARIA </td><td align="right">'+formatoMoneda(Math.abs(datosresumen[iter][longitud-2].importe))+'</td></tr>';//saldo en banco segun libro
            mostrar+='<tr><td>&nbsp;</td><td>&nbsp;</td></tr>';//fila en blanco
            mostrar+='<tr><td colspan="2">DIFERENCIA ENTRE LIBRO Y BANCO </td><td align="right">'+formatoMoneda(Math.abs(datosresumen[iter][longitud-1].importe))+'</td></tr>';//saldo en banco segun libro
            mostrar+='<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';//fila en blanco
            mostrar+='<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';//fila en blanco
            mostrar+='<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';//fila en blanco
            mostrar+='<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';//fila en blanco
            mostrar+='<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';//fila en blanco
            mostrar+='<tr align="center"><td width="35%">'+usuario+'</td><td width="35%">&nbsp;</td><td width="30%">&nbsp;</td></tr>';//firmas
            mostrar+='<tr align="center"><td width="35%">__________________________</td><td width="35%">__________________________</td><td width="30%">__________________________</td></tr>';//firmas rayita
            mostrar+='<tr align="center"><td width="35%">Confeccionado</td><td width="35%">Revisado</td><td width="30%">Aprobado</td></tr>';//pie de firmas
            mostrar+='</table>';
            mostrar+='<div class="saltopagina"></div>';//salto de pagina
            //AQUI COMIENZA EL DESGLOSE***********************************/            
            if(datosdesglose.length>0){//si almenos viene un desglose, evita que si no viene desglose de error
                var totalgeneral=0;// total por entidad
                if(datosdesglose[iter].length>0){//si trajo desglose para la entidad se muestra el desglose
                    var tamPage=0;//tamanno de la pagina del desglose en filas
                    var especialidadActual="";//especialidad que se esta procesando
                    var subtotal=0;//subtotal por especialidad
                    for (var i = 0; i < datosdesglose[iter].length; i++){
                        if(tamPage==0){//si tamPage=0 nueva pagina + encabezado
                            mostrar+= '<table width="100%" style="font-size:12px; font-family: Arial, Helvetica, sans-serif;">'+//encabezado desglose
                            '<tr><td colspan="7" height="20">LISTADO DE LOS CHEQUES NO CARGADOS POR EL BANCO: '+datosresumen[iter][0].codigoentidad+' '+datosresumen[iter][0].descripcionentidad+'</td></tr>'+
                            '<tr><td colspan="7" height="20">CUENTA BANCARIA: '+datosresumen[iter][0].concatcuentabancaria+' '+datosresumen[iter][0].nombrecuentabancaria+'</td></tr>'+
                            '<tr align="left" height="30"><td width="10%">UMGASTO</td><td width="10%">No. CO</td><td width="10%">FECHA</td><td width="15%">No. DOC</td><td width="10%" align="center" >IMPORTE</td><td width="2%">&nbsp;</td><td width="40%" align="center">ENTIDAD</td></tr>';
                            tamPage=30;//se manda a recorrer las proximas 30 filas de pag    
                        }//else{//se pinta el cuerpo del desglose
                            if(especialidadActual != datosdesglose[iter][i]['idespecialidad']){//si cambia la especialidad se muestra la nueva
                                if(tamPage!=30){//si ya se han pintado desgloses se pone el subtotal
                                    mostrar+= '<tr><td colspan="4"><b>SubTotal:</b></td><td align="right"><b>'+formatoMonedaImporte(subtotal)+'<b></td><td>&nbsp;</td><td>&nbsp;</td></tr>';
                                    subtotal=0;// se reinicia el subtotal
                                }
                                especialidadActual = datosdesglose[iter][i]['idespecialidad'];//se almacena la nueva especialidad
                                mostrar+= '<tr height="30" valign="bottom"><td colspan="7">'+datosdesglose[iter][i]['denominacionespecialidad']+'</td></tr>';
                            }
                            else if(tamPage==30)//si no cambia la especialidad pero cambio de pagina se muestra la especialidad
                                mostrar+= '<tr height="30" valign="bottom"><td colspan="7">'+datosdesglose[iter][i]['denominacionespecialidad']+'</td></tr>';
                            mostrar+= '<tr>'+
                            '<td width="10%" align="left">'+datosdesglose[iter][i]['unidadmilitar']+'</td>'+
                            '<td width="10%" align="left">'+datosdesglose[iter][i]['numcomprobante']+'</td>'+
                            '<td width="15%" align="left">'+datosdesglose[iter][i]['fechacreacion']+'</td>'+
                            '<td width="15%" align="left">'+datosdesglose[iter][i]['numdocumento']+'</td>'+
                            '<td width="10%" align="right">'+formatoMonedaImporte(datosdesglose[iter][i]['importe'])+'</td>'+
                            '<td width="2%">&nbsp;</td>'+
                            '<td width="40%" align="left">'+datosdesglose[iter][i]['nombrecliente']+'</td>'+
                            '</tr>';
                            tamPage--;//se disminuye la fila pintada
                            subtotal=parseFloat(subtotal)+parseFloat(datosdesglose[iter][i]['importe']);//se suma el subtotal
                            totalgeneral=parseFloat(totalgeneral)+parseFloat(datosdesglose[iter][i]['importe']);//se suma el total general
                            if(i == datosdesglose[iter].length-1){//si se llego al ultimo elemento del desglose se pinta el subtotal
                                mostrar+= '<tr><td colspan="4"><b>SubTotal:<b></td><td align="right"><b>'+formatoMonedaImporte(subtotal)+'<b></td><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
                                mostrar+= '<tr height="30" valign="bottom"><td colspan="4"><b>Total General:<b></td><td align="right"><b>'+formatoMonedaImporte(totalgeneral)+'<b></td><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
                                mostrar+='</table>';
                                mostrar+='<div class="saltopagina"></div>';//salto de pagina    
                            }
                            /*if(tamPage==0){//si se llego al final
                                mostrar+='</table>';//se cierra la tabla            
                                mostrar+='<div class="saltopagina"></div>';//salto de pagina
                            }*/
                        //}
                    }
                }
                else{//si no tiene desglose para la estructura en cuestion se pinta el vacio
                    mostrar+= '<table width="100%" style="font-size:12px; font-family: Arial, Helvetica, sans-serif;">'+//encabezado desglose
                    '<tr><td colspan="7" height="20">LISTADO DE LOS CHEQUES NO CARGADOS POR EL BANCO: '+datosresumen[iter][0].codigoentidad+' '+datosresumen[iter][0].descripcionentidad+'</td></tr>'+
                    '<tr><td colspan="7" height="30">CUENTA BANCARIA: '+datosresumen[iter][0].concatcuentabancaria+' '+datosresumen[iter][0].nombrecuentabancaria+'</td></tr>'+
                    '<tr align="center" height="30"><td width="10%">UMGASTO</td><td width="10%">No.RE</td><td width="10%">FECHA</td><td width="15%">No. CHEQ</td><td width="20%">IMPORTE</td><td width="2%">&nbsp;</td><td width="33%">ENTIDAD</td></tr>'+
                    '<tr><td colspan="4">NO TIENE CHEQUES EN TR&Aacute;NSITO</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';
                    mostrar+='</table>';
                    mostrar+='<div class="saltopagina"></div>';//salto de pagina
                }            
            }
            else{//si no tiene desglose para la estructura
                mostrar+= '<table width="100%" style="font-size:12px; font-family: Arial, Helvetica, sans-serif;">'+//encabezado desglose
                '<tr><td colspan="7" height="20">LISTADO DE LOS CHEQUES NO CARGADOS POR EL BANCO: '+datosresumen[iter][0].codigoentidad+' '+datosresumen[iter][0].descripcionentidad+'</td></tr>'+
                '<tr><td colspan="7" height="30">CUENTA BANCARIA: '+datosresumen[iter][0].concatcuentabancaria+' '+datosresumen[iter][0].nombrecuentabancaria+'</td></tr>'+
                '<tr align="center" height="30"><td width="10%">UMGASTO</td><td width="10%">No.RE</td><td width="10%">FECHA</td><td width="15%">No. CHEQ</td><td width="20%">IMPORTE</td><td width="2%">&nbsp;</td><td width="33%">ENTIDAD</td></tr>'+
                '<tr><td colspan="4">NO TIENE CHEQUES EN TR&Aacute;NSITO</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';
                mostrar+='</table>';
                mostrar+='<div class="saltopagina"></div>';//salto de pagina
            }
            iter++;//se itera a la proxima estructura
        } while(iter < cantidadRes)
        document.getElementById('reporte').innerHTML=mostrar;//se muestra el reporte
    }
    //si no vienen datos se muestra el cartel de NO DATOS
    else document.getElementById('reporte').innerHTML='<b>AVISO:</b> No se han recuperado datos para las entidades seleccionadas.';
}

//muestra una mascara dado el texto
function MostrarEtiquetas(componente, mensaje)
{
    lMask = new Ext.LoadMask(componente,{
        msg: mensaje
    });
    lMask.show();
}

//cambia el formato del numero  saldo
function formatoMoneda(v){
    v=(Math.round((v-0)*100))/100;
    v=(v==Math.floor(v))?v+".00":((v*10==Math.floor(v*10))?v+"0":v);
    v=String(v);
    var ps=v.split(".");
    var whole=ps[0];
    var sub=ps[1]?"."+ps[1]:".00";
    var r=/(\d+)(\d{3})/;
    while(r.test(whole))
        whole=whole.replace(r,"$1"+","+"$2");    
    v=whole+sub;
    if(v.charAt(0)=="-")//caso saldo negativo
        return"("+v.substr(1)+")" ;   
    return v;
}
//cambia el formato a importe
function formatoMonedaImporte(v){
    v=(Math.round((v-0)*100))/100;
    v=(v==Math.floor(v))?v+".00":((v*10==Math.floor(v*10))?v+"0":v);
    v=String(v);
    var ps=v.split(".");
    var whole=ps[0];
    var sub=ps[1]?"."+ps[1]:".00";
    var r=/(\d+)(\d{3})/;
    while(r.test(whole))
        whole=whole.replace(r,"$1"+","+"$2")
    v=whole+sub;
    if(v.charAt(0)=="-")//caso saldo negativo
        return v.substr(1);
    return v;
}
