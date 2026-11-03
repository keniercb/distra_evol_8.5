/**
 * Created 
 */
funciones = function () {
    
}
//funciones renders
function crearToolTipPlanes(v, m) {
    if (v==null)
        v='';
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function crearToolTip(v, m) {
    if (v==null)
        v='';
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function renderActivado(val, m) {
    if (val == false) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo';
    } 
    if (val == true) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true verde';
    }
}

function renderAprobadoEsp(val, m) {
    if (!val.includes('7')) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo';
    } 
    if (val.includes('7')) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true verde';
    }
}

function renderAprobadoOSDEATM(val, m) {
    if (!val.includes('2')) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo';
    } 
    if (val.includes('2')) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true verde';
    }
}

function renderAprobadoOSDEDIRECC(val, m) {
    if (!val.includes('5')) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo';
    } 
    if (val.includes('5')) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true verde';
    }
}



function cambiarTituloFiltrar() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosgpModeloPlanes.getFiltrosActivos() == undefined || filtrosgpModeloPlanes.getFiltrosActivos().length == 0) {
        pModeloPlanes.setTitle(perfil.etiquetas.titModelos);
    } else {
        for (i = 0; i < filtrosgpModeloPlanes.getFiltrosActivos().length; i++) {
            var numberCol = columnasDinamicasgpModeloPlanes.findColumnIndex(filtrosgpModeloPlanes.getFiltrosActivos()[i].dataIndex);
            if (i == filtrosgpModeloPlanes.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += columnasDinamicasgpModeloPlanes.getColumnHeader(numberCol) + sep;
        }
        pModeloPlanes.setTitle('Detalles del plan ' + '<i>- Filtrado por: ' + filtrado_por + '</i>');
        filtrado_por = "";
    }
}

function Exportar711(){
    var solicitud = [];
    solicitud.push(smSolicitudes711.getSelected().data);
    var win = window.open('Exportar711?idsolicitud711=' + smSolicitudes711.getSelected().data.idsolicitud711 +'&ejercicio= '+cbEjercicioPlanes.getRawValue()+'&descripcion= '+null+'&solodescripcion= '+0);
    var win = window.open('Exportar711?idsolicitud711=' + smSolicitudes711.getSelected().data.idsolicitud711 +'&ejercicio= '+cbEjercicioPlanes.getRawValue()+'&descripcion= '+null+'&solodescripcion= '+1);

}

function addCommas(nStr) {
    nStr+='';
    ds=nStr.replace(/,/g,'');
    nStr = ds; 
    var x = nStr.split('.'); 
    var x1 = x[0]; 
    var x2 = x.length > 1 ? '.' + x[1] : ''; 
    var rgx = /(\d+)(\d{3})/; 
    while (rgx.test(x1)) { 
      x1 = x1.replace(rgx, '$1' + ',' + '$2'); 
    }
    return x1 + x2; 
} 
function RenderaddCommas(nStr, m) {
    nStr+='';
    ds=nStr.replace(/,/g,'');
    nStr = ds; 
    var x = nStr.split('.'); 
    var x1 = x[0]; 
    var x2 = x.length > 1 ? '.' + x[1] : ''; 
    var rgx = /(\d+)(\d{3})/; 
    while (rgx.test(x1)) { 
      x1 = x1.replace(rgx, '$1' + ',' + '$2'); 
    }
    salida=((x1 + x2)=='null')?'':(x1 + x2);
    m.attr = 'ext:qtip="' + salida + '"';
    return salida; 
}

function winDescripcionTodas() {
    btnCancelarAdd = new Ext.Button({
        iconCls: 'cerrar',
        id: 'btnCancelarAdd',
        tooltip: 'CERRAR',
        text: 'CERRAR',
        handler: function () {
            ventanaCrudProd.destroy();
        }
    });

    btnExportarDescripcion = new Ext.Button({
        iconCls: 'exportar',
        id: 'btnExportarDescripcion',
        tooltip: 'Exportar',
        text: 'Exportar',
        handler: function () {
            ExportarDescripcion(textsalida);
        }
    });

//*****Elementos de la ventana para adicionar personas**********
    Descripcion = new Ext.form.TextArea({
        allowBlank: false,
        hideLabel: true,
        width: 400,
        height:400,
        readOnly :true
    });
    var textsalida= 'Solicitud: '+smSolicitudes711.getSelected().data.nosolicitud + '\nDescripción General: '+smSolicitudes711.getSelected().data.descripciongeneral+
        '\n----------------------------------------------------------------'+
        '\n----------------------------------------------------------------';



    pfinalP = new Ext.FormPanel({
        id: 'pfinalP',
        frame: true,
        autoScroll: true,
        split:true,
        tbar: [btnExportarDescripcion],
        items: [Descripcion]
    });
    ventanaCrudProd = null;
    ventanaCrudProd = new Ext.Window({
        title: 'Especificaciones técnicas',
        id: 'ventanaCrudProd',
        width: 425,
        constrain: true,
        layout: 'fit',
        height: 425,
        resizable: false,
        frame: true,
        modal: true,
        buttons: [btnCancelarAdd],
        items: [pfinalP],
        listeners: {
            beforeshow: function () {
            }
        }
    });
    stProductos1 = new Ext.data.Store({
        url: 'listarProductosSeleccionados',
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
        }, [{
            name: 'idproducto711'
        }, {
            name: 'codigocup'
        }, {
            name: 'suministro'
        }, {
            name: 'precio'
        }, {
            name: 'cantidad'
        }, {
            name: 'valor'
        }, {
            name: 'trimestre1'
        }, {
            name: 'trimestre2'
        }, {
            name: 'trimestre3'
        }, {
            name: 'trimestre4'
        }, {
            name: 'unidadmedida'
        }, {
            name: 'descripcion'
        }, {
            name: 'urlimagen'
        }, {
            name: 'nombreimg'
        }, {
            name: 'descrip'
        }
        ]),
        listeners: {
            beforeload: function (store, record, options) {
                Ext.Ajax.timeout = 6400000;
                stProductos1.removeAll();
                stProductos1.baseParams.idsolp = idsolp;
            },
            load: function (store, record, options) {
                console.log(record);
                for(i=0; i<record.length;i++){
                    textsalida+='\nProducto:'+ record[i].data.suministro+
                        '\nPrecio:'+ record[i].data.precio+
                        '\nUnidad de medidad:'+ record[i].data.descrip+ 
                        '\nCantidad:'+ record[i].data.cantidad+
                        '\nValor Total:'+ record[i].data.valor+
                        '\nDescripción del producto:'+ '\n'+((record[i].data.descripcion==null)? ' ' : record[i].data.descripcion)+
                        '\nImagen:'+((record[i].data.urlimagen==null)? 'no' : 'si')+
                        '\n----------------------------------------------------------------'+
                        '\n----------------------------------------------------------------';
                }
                Descripcion.setValue(textsalida);
                mymask.hide();
                ventanaCrudProd.show();
            }
        }
    });
    mymask.show();
    stProductos1.reload();

}

function ExportarDescripcion(descripcion){
    var solicitud = [];
    solicitud.push(smSolicitudes711.getSelected().data);
    var win = window.open('Exportar711?idsolicitud711=' + smSolicitudes711.getSelected().data.idsolicitud711+'&solodescripcion= '+1);

}

