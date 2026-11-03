
var perfil = window.parent.UCID.portal.perfil;
/*UCID.portal.cargarEtiquetas('gestionarconciliacionbancaria', function() {cargarInterfaz();});*/
Ext.QuickTips.init();


//cargarInterfaz(){
//*******************variables************************
var loadMask = new Ext.LoadMask(Ext.getBody(), {
    msg: 'Cargando datos...'
});
var loadMaskSaldo = new Ext.LoadMask(Ext.getBody(), {
    msg: perfil.etiquetas.lbloadS
});
var lMaskSave = new Ext.LoadMask(Ext.getBody(), {
    msg: 'Guardando datos...'
});
var lMaskPeriodo = new Ext.LoadMask(Ext.getBody(), {
    msg: perfil.etiquetas.lbloadP
});

var lMasktemp;
function MostrarEtiquetas(componente, mensaje)
{
    lMasktemp = new Ext.LoadMask(componente, {
        msg: mensaje
    });
    lMasktemp.show();
}

var tfsalactlibro = new Ext.form.TextField({
    style: 'text-align: right',
    fieldLabel: perfil.etiquetas.lbtextSaldoA,
    disabledClass: 'disabled-component',
    readOnly: true,
    name: 'tfsalactlibro',
    width: 140
});
var tfsalactbanco = new Ext.form.TextField({
    style: 'text-align: right',
    fieldLabel: perfil.etiquetas.lbtextSaldoA,
    disabledClass: 'disabled-component',
    readOnly: true,
    name: 'tfsalactbanco',
    width: 140
});
var tfcredlibro = new Ext.form.TextField({
    style: 'text-align: right',
    disabledClass: 'disabled-component',
    readOnly: true,
    name: 'tfcredlibro',
    width: 130
});
var tfcredbanco = new Ext.form.TextField({
    style: 'text-align: right',
    disabledClass: 'disabled-component',
    readOnly: true,
    name: 'tfcredbanco',
    width: 130
});
var tfdeblibro = new Ext.form.TextField({
    style: 'text-align: right',
    disabledClass: 'disabled-component',
    readOnly: true,
    name: 'tfdeblibro',
    width: 130
});
var tfdebbanco = new Ext.form.TextField({
    style: 'text-align: right',
    disabledClass: 'disabled-component',
    readOnly: true,
    name: 'tfdebbanco',
    width: 130
});
var tfsaldoajbanco = new Ext.form.TextField({
    style: 'text-align: right',
    disabledClass: 'disabled-component',
    fieldLabel: perfil.etiquetas.lbtextSaldoAj,
    readOnly: true,
    name: 'tfsaldoajbanco',
    width: 140
});
var tfsaldoajlibro = new Ext.form.TextField({
    style: 'text-align: right',
    disabledClass: 'disabled-component',
    fieldLabel: perfil.etiquetas.lbtextSaldoAj,
    readOnly: true,
    name: 'tfsaldajlibro',
    width: 140
});
var data, datasaldos, saldolibro, saldobanco, libro, bancotransito, bancodepositar, dblibro, datosconc, idviejos, grid, idbancouno, idbancodos,
        idlibrouno, idlibrodos, gridlibro, gridbanco,
        crlibro, dbbanco, crbanco, jsonlibrobanco, jsonsaldosact, idmoneda, datahistconc, histlibro, histbanco;
var arrGrid = new Array();
var winConciliacionBancaria;
var modificar = false;
var fechainicioperiodo = '0000-00-00';

// ************ variables de la ventana de conciliacion *************
var cbxbeneficiario, stbeneficiario, stentregadoa, cbxentregadoas;

//para el uso de la especialidad
var idespecialidad, oldvalue;
//*********        ComboCuenta         **********************	
var StcomboCuenta = new Ext.data.Store({
    id: 'StcomboCuenta',
    url: 'cargarcombocuentas',
    autoLoad: false,
    reader: new Ext.data.JsonReader({
        root: 'datos',
        id: 'idcuenta'
    }, [{
            name: 'idcuenta',
            type: 'string'
        }, {
            name: 'nombre'
        }, {
            name: 'numero'
        }, {
            name: 'moneda'
        }, {
            name: 'codigoiso'
        }, {
            name: 'banco'
        }, {
            name: 'nombanco'
        }, {
            name: 'sucursal'
        }, {
            name: 'nomsucursal'
        }
    ]),
    listeners: {
        load: function(store, r, options) {
            if (acc == 'mod') {
                comboCuenta.disable();
            } else {
                comboCuenta.enable();
            }
        }
    }
});

var comboCuenta = new Ext.form.ComboBox({
    fieldLabel: perfil.etiquetas.lbtextC,
    id: 'comboCuenta',
    disabledClass: 'disabled-component',
    name: 'comboCuenta',
    tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>', // Paramostrar los datos como detalle
    resizable: true,
    anchor: '100%',
    editable: true,
    selectOnFocus: true,
    emptyText: perfil.etiquetas.lbEmptyMsg,
    triggerAction: 'all',
    /*maskRe : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n�meros y espacios
     regex : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, 
     regexText : 'Este campo solo permite letras y n\xFAmeros.',*/
    allowBlank: false,
    blankText: perfil.etiquetas.lbMsgReq,
    displayField: 'nombre',
    valueField: 'idcuenta',
    hiddenName: 'idcuenta',
    store: StcomboCuenta,
    mode: 'local',
    forceSelection: true,
    enableKeyEvents: true,
    typeAhead: true,
    listeners: {
        keypress: function(t, e) {
            if (e.getKey() == 13) {
                if (!comboCuenta.getValue()) {
                    comboCuenta.setValue(StcomboCuenta.getAt(0).get('idcuenta'));
                    comboCuenta.fireEvent('select', this.comboCuenta);
                }

            }
        }
    }

});

/*comboIframe1 = new Ext.CONT.UIXCombo({
 fieldLabel: 'Especialidad',
 emptyText:  perfil.etiquetas.lbEmptyMsg,
 // disabled: true,
 hiddenTbar: true
 }, {
 identificador: 'Especialidad',
 displayText: 'Especialidad',
 singleSelect: true,
 url: 'loadTreeEspecialidad',
 reader: jrEspecialidad = new Ext.data.JsonReader({
 //        root: 'especialidades',
 id: 'idespecialidad'
 }, [{
 name: 'text',
 mapping: 'especialidad'
 }, {
 name: 'codigo',
 mapping: 'especialidad'
 }, {
 name: 'codespecialidad',
 mapping: 'codespecialidad'
 }, {
 name: '_parent',
 mapping: 'padre'
 }, {
 name: '_is_leaf',
 mapping: 'leaf'
 }, {
 name: 'ordenizq'
 }, {
 name: 'ordender'
 }, {
 name: 'idespecialidad'
 }])
 });*/


comboIframe1 = new Ext.UCID.ComboIframe({
    fieldLabel: perfil.etiquetas.lbtextEsp,
    //allowBlank: false,
    valueField: 'idespecialidad',
    displayField: 'descripcionespecialidad',
    id: 'textespecialidad',
    editable: false,
    resizable: true,
    idIframe: 'especialidad',
    onSelectNodo: function(nodo) {
        if (nodo.attributes.id != 0) {
            var node = nodo;
            var codespecialidad = '';//almacena el codigo de la especialidad
            while (node.parentNode.id != 0)
            {
                codespecialidad = nodo.parentNode.attributes.codespecialidad + codespecialidad + '.';
                node = node.parentNode;
            }
            idespecialidad = '';
            idespecialidad = nodo.attributes.id;//se guarda el id de la especialidad
            comboIframe1.reset();
            comboIframe1.setValue(nodo.attributes.id);
            comboIframe1.setRawValue(codespecialidad + nodo.attributes.text);
        }
        else {
            comboIframe1.reset();
            idespecialidad = '';
        }
    },
    url: 'getcomboiframeespecialidad',
    anchor: '100%',
    enableKeyEvents: true,
    listeners: {
        keypress: function(cIf, e) {
            if ((e.getKey() == 13) && (cIf.getValue())) {
                tacomentarioinst.focus(false, 100);// darle foco  a  ESTE CAMPO
            }
        }
    }
});

//DateField Fechaconciliacion
var dfdateconc = new Ext.form.DateField({
    fieldLabel: perfil.etiquetas.lbCamFechaconc,
    readOnly: true,
    disabledClass: 'disabled-component',
    allowBlank: false,
    blankText: perfil.etiquetas.lbMsgReq,
    editable: false,
    name: 'dfdateconc',
    anchor: '100%',
    format: 'd/m/Y',
    enableKeyEvents: true,
    selectOnFocus: true,
    listeners: {
        keypress: function(tf, event) {
            if (event.getKey() == 13) {
                var date = dfdateconc.minValue;
                if (!dfdateconc.getValue()) {
                    dfdateconc.setValue(date);
                }
                comboCuenta.focus(false, 10);// darle foco  a  ESTE CAMPO

            }
        }
    }
});

function conciliacionqueguardar() {
    return (dfdateconc.getValue() && comboCuenta.getValue() && (stbancouno.getCount() || stbancodos.getCount() || stlibrouno.getCount() || stlibrodos.getCount()))
}

// ************  RECORDS ********************
var recbancouno = Ext.data.Record.create(
        {
            name: 'idinstrumentobancario',
            type: 'string'
        },
{
    name: 'numerodocumento',
    type: 'int'
},
{
    name: 'fecharecepcion'
},
{
    name: 'importemo'
},
{
    name: 'importemb'
},
{
    name: 'denominacion',
    type: 'string'
},
{
    name: 'comentario',
    type: 'string'
},
{
    name: 'idtipodocumento',
    type: 'string'
},
{
    name: 'idbeneficiario',
    type: 'string'
},
{
    name: 'beneficiario',
    type: 'string'
},
{
    name: 'tipob'
},
{
    name: 'idrecibe',
    type: 'string'
},
{
    name: 'recibe',
    type: 'string'
},
{
    name: 'tipor'
},
{
    name: 'idsolicitud',
    type: 'string'
},
{
    name: 'idespecialidad'
},
{
    name: 'descripcionespecialidad'
}
);

var stbancouno = new Ext.data.JsonStore({
    id: 'stbancouno',
    fields: recbancouno
});

var smbancouno = new Ext.grid.RowSelectionModel({
    singleSelect: true,
    listeners: {
        rowdeselect: function(sm, rowIndex, r) {
            btnMbancouno.setDisabled(true);
            btnCbancouno.setDisabled(true);
        },
        rowselect: function(sm, rowIndex, r) {
            btnMbancouno.setDisabled(false);
            btnCbancouno.setDisabled(false);
        }

    }


});


var recbancodos = Ext.data.Record.create(
        {
            name: 'idinstrumentobancario',
            type: 'string'
        },
{
    name: 'numerodocumento',
    type: 'int'
},
{
    name: 'fecharecepcion'
},
{
    name: 'importemo'
},
{
    name: 'importemb'
},
{
    name: 'denominacion',
    type: 'string'
},
{
    name: 'comentario',
    type: 'string'
},
{
    name: 'idtipodocumento',
    type: 'string'
},
{
    name: 'idbeneficiario',
    type: 'string'
},
{
    name: 'beneficiario',
    type: 'string'
},
{
    name: 'tipob'
},
{
    name: 'idrecibe',
    type: 'string'
},
{
    name: 'recibe',
    type: 'string'
},
{
    name: 'tipor'
},
{
    name: 'idsolicitud',
    type: 'string'
},
{
    name: 'idespecialidad'
},
{
    name: 'descripcionespecialidad'
}
);

var stbancodos = new Ext.data.JsonStore({
    id: 'stbancodos',
    fields: recbancodos
});

var smbancodos = new Ext.grid.RowSelectionModel({
    singleSelect: true,
    listeners: {
        rowdeselect: function(sm, rowIndex, r) {
            btnMbancodos.setDisabled(true);
            btnCbancodos.setDisabled(true);
        },
        rowselect: function(sm, rowIndex, r) {
            btnMbancodos.setDisabled(false);
            btnCbancodos.setDisabled(false);
        }
    }

});


//********          Record Reclibro     *********
var reclibro = Ext.data.Record.create([
    'iddiferencia',
    'nroestado',
    'diferenciamo'
]);


//******************* Grid Derecha Arriba ******************
var btnAbancouno = new Ext.Button({
    tooltip: perfil.etiquetas.lbTitleAddInsD,
//    icon: perfil.dirImg + 'adicionar.png',
    iconCls: 'adicionar',
    handler: function() {
        aplicarmodinst.show();

        if (comboCuenta.getValue()) {
            modificar = false;
            fpInstTrans.getForm().reset();
            gridbanco = 1;
            if (sttipoinstrumento.getCount())
            {
                winInstTrans.setTitle(perfil.etiquetas.lbTitleAddInsD);
                winInstTrans.show();
                cbxtipoinstrumento.focus(false, 100);//(darle el foco a este combo);
            }
            else
                mostrarMensaje(1, perfil.etiquetas.lbMsgSinDocC);
        }
        else
            mostrarMensaje(1, perfil.etiquetas.lbMsgSinseleccion);
    }

});
var btnCbancouno = new Ext.Button({
    tooltip: perfil.etiquetas.lbTitleElimInsD,
//    icon: perfil.dirImg + 'eliminar.png',
    iconCls: 'eliminar',
    disabled: true,
    handler: function() {
        if (comboCuenta.getValue()) {
            if (stbancouno.getCount()) // no hay elementos
            {
                if (smbancouno.getCount() == 0) {
                    mostrarMensaje(1, perfil.etiquetas.lbMsgSinElemElim);
                    //mostrarMensaje(1,'Debe seleccionar el elemento para ser eliminado.');
                } else {
                    var records = smbancouno.getSelections();
                    stbancouno.remove(records[0]);
                    CalcularSaldos();
                    if (!stbancouno.getCount()) {
                        btnMbancouno.setDisabled(true);
                        btnCbancouno.setDisabled(true);
                    }
                }
            }
            else {
                //mostrarMensaje(1,'No hay elementos a eliminar.');
                btnMbancouno.setDisabled(true);
                btnCbancouno.setDisabled(true);
            }
        }
        else
            mostrarMensaje(1, perfil.etiquetas.lbMsgSinseleccion);
    }
});
var btnMbancouno = new Ext.Toolbar.Button({
//    icon: perfil.dirImg + 'modificar.png',
    iconCls: 'modificar',
    disabled: true,
    tooltip: perfil.etiquetas.lbTitleModInsD,
    handler: function() {
        aplicarmodinst.hide();
        cargamodInstrumDepositar();
    }
});

function cargamodInstrumDepositar()
{
    if (comboCuenta.getValue()) {
        if (stbancouno.getCount()) // no hay elementos
        {
            if (smbancouno.getCount() == 0) // Si no ha seleccionado ninguno
            {
                //mostrarMensaje(1, 'Debe seleccionar el elemento para ser modificado.');
                mostrarMensaje(1, perfil.etiquetas.lbMsgSinElemMod);
                return;
            }
            if (sttipoinstrumento.getCount() == 0)
            {
                mostrarMensaje(1, perfil.etiquetas.lbMsgSinDocCMod);
                return;
            }
            modificar = true;
            fpInstTrans.getForm().reset();
            gridbanco = 1;
            winInstTrans.setTitle(perfil.etiquetas.lbTitleModInsD);
            fpInstTrans.getForm().loadRecord(smbancouno.getSelected());
            winInstTrans.show();
            idinstrumentobancario.setValue(smbancouno.getSelected().get('idinstrumentobancario'));
            cbxtipoinstrumento.setValue(smbancouno.getSelected().get('idtipodocumento'));
            tfnroinstrumento.setValue(smbancouno.getSelected().get('numerodocumento'));
            tfnrosolicitud.setValue(smbancouno.getSelected().get('idsolicitud'));
            dffecharecepcion.setValue(smbancouno.getSelected().get('fecharecepcion'));
            tfimporteinst.setValue(saldo(smbancouno.getSelected().get('importemo')));
            //tfimporteinstcont.setValue(saldo(smbancouno.getSelected().get('importemb')));
            var importemo = smbancouno.getSelected().get('importemo');
            var importemb = smbancouno.getSelected().get('importemb');
            tfimporteletras.setValue(convertir_a_letras(importemo));
            //tfimporteletrascont.setValue(convertir_a_letras(importemb));
            tacomentarioinst.setValue(smbancouno.getSelected().get('comentario'));

            //            idespecialidad=smbancouno.getSelected().get('idespecialidad');
            //            tfespecialidad.setValue(smbancouno.getSelected().get('descripcionespecialidad'));
            comboIframe1.setValue(smbancouno.getSelected().get('idespecialidad'));
            comboIframe1.setRawValue(smbancouno.getSelected().get('descripcionespecialidad'));
            idespecialidad = '';
            idespecialidad = smbancouno.getSelected().get('idespecialidad');
            oldvalue = idespecialidad;//se almacena el valor viejo de la especialidad para comparar si se modifico

            var datos = new Array();
            datos.push(smbancouno.getSelected().get('idbeneficiario'));
            datos.push(smbancouno.getSelected().get('tipob'));
            datos.push(smbancouno.getSelected().get('beneficiario'));
            stbeneficiario.removeAll();
            llenastoreTemp(stbeneficiario, cbxbeneficiario, datos);

            cbxbeneficiario.setValue(smbancouno.getSelected().get('idbeneficiario'));
            cbxbeneficiario.setRawValue(smbancouno.getSelected().get('beneficiario'));

            var datos1 = new Array();
            datos1.push(smbancouno.getSelected().get('idrecibe'));
            datos1.push(smbancouno.getSelected().get('tipor'));
            datos1.push(smbancouno.getSelected().get('recibe'));
            stentregadoa.removeAll();
            llenastoreTemp(stentregadoa, cbxentregadoa, datos1);

            cbxentregadoa.setValue(smbancouno.getSelected().get('idrecibe'));
            cbxentregadoa.setRawValue(smbancouno.getSelected().get('recibe'));
            if (!stbancouno.getCount()) {
                btnMbancouno.setDisabled(true);
                btnCbancouno.setDisabled(true);
            }
        }
        else {
            //mostrarMensaje(1,'No hay elementos a modificar.');
            btnMbancouno.setDisabled(true);
            btnCbancouno.setDisabled(true);
        }

    }
    else
        mostrarMensaje(1, perfil.etiquetas.lbMsgSinseleccion);
}




var grdbancouno = new Ext.grid.GridPanel({
    store: stbancouno,
    region: 'north',
    tbar: [btnAbancouno, btnMbancouno, btnCbancouno, '->', perfil.etiquetas.lbtextDenLibro, tfdeblibro],
    frame: true,
    rowHeight: .50,
    loadMask: true,
    autoExpandColumn: 'especialidad',
    sm: smbancouno,
    disableSelection: true,
    autoScroll: true,
    style: 'margin:5 0 5 0',
    columns: [
        {
            id: 'numerodocumento',
            header: perfil.etiquetas.lbCamNodoc,
            width: 95,
            sortable: true,
            dataIndex: 'numerodocumento'
        },
        {
            id: 'denominacion',
            header: perfil.etiquetas.lbtextTipodoc,
            width: 120,
            sortable: true,
            dataIndex: 'denominacion'
        },
        {
            id: 'especialidad',
            header: perfil.etiquetas.lbtextEsp,
            sortable: true,
            dataIndex: 'descripcionespecialidad'
        },
        {
            header: perfil.etiquetas.lbCamFecha,
            width: 80,
            sortable: true,
            dataIndex: 'fecharecepcion',
            align: 'center'
        },
        {
            id: 'importemo',
            header: perfil.etiquetas.lbCamImporte,
            width: 100,
            sortable: true,
            align: 'right',
            renderer: saldo,
            dataIndex: 'importemo'
        }
    ],
    listeners: {
        rowclick: function(sm, indiceFila, record) {
            idbancouno = indiceFila;
        },
        rowdblclick: function(t, rowIndex, e) {
            cargamodInstrumDepositar();
        }
    }
});


//****************** Grid Derecho Abajo *********************
var btnAbancodos = new Ext.Button({
    tooltip: perfil.etiquetas.lbTitleAddInsT,
//    icon: perfil.dirImg + 'adicionar.png',
    iconCls: 'adicionar',
    handler: function() {
        aplicarmodinst.show();
        if (comboCuenta.getValue()) {
            modificar = false;
            fpInstTrans.getForm().reset();
            gridbanco = 2;
            if (sttipoinstrumento.getCount())
            {
                winInstTrans.setTitle(perfil.etiquetas.lbTitleAddInsT);
                winInstTrans.show();
                cbxtipoinstrumento.focus(false, 100);//(darle el foco a este combo);
            }
            else
                mostrarMensaje(1, perfil.etiquetas.lbMsgSinDocC);
        }
        else
            mostrarMensaje(1, perfil.etiquetas.lbMsgSinseleccion);
    }
});
var btnCbancodos = new Ext.Button({
    tooltip: perfil.etiquetas.lbTitleElimInsT,
//    icon: perfil.dirImg + 'eliminar.png',
    iconCls: 'eliminar',
    disabled: true,
    handler: function() {
        if (comboCuenta.getValue()) {
            if (stbancodos.getCount()) {  // si no hay elementos
                if (smbancodos.getCount() == 0) {
                    // mostrarMensaje(1, 'Debe seleccionar el elemento para ser eliminado.');
                    mostrarMensaje(1, perfil.etiquetas.lbMsgSinElemElim);
                } else {
                    var records = smbancodos.getSelections();
                    stbancodos.remove(records[0]);
                    CalcularSaldos();
                    if (!stbancodos.getCount()) {
                        btnMbancodos.setDisabled(true);
                        btnCbancodos.setDisabled(true);
                    }
                }
            } else {
                // mostrarMensaje(1,'No hay elementos a eliminar.');
                btnMbancodos.setDisabled(true);
                btnCbancodos.setDisabled(true);
            }
        }
        else
            mostrarMensaje(1, perfil.etiquetas.lbMsgSinseleccion);
    }
});
var btnMbancodos = new Ext.Toolbar.Button({
//    icon: perfil.dirImg + 'modificar.png',
    iconCls: 'modificar',
    disabled: true,
    tooltip: perfil.etiquetas.lbTitleModInsT,
    handler: function() {
        aplicarmodinst.hide();
        cargamodInstrumTransito();
    }
});

function cargamodInstrumTransito()
{
    if (comboCuenta.getValue()) {
        if (stbancodos.getCount()) {  // si no hay elementos
            if (smbancodos.getCount() == 0)  // si no ha seleccionado
            {
                //mostrarMensaje(1, 'Debe seleccionar el elemento para ser modificado.');
                mostrarMensaje(1, perfil.etiquetas.lbMsgSinElemMod);
                return;
            }
            if (sttipoinstrumento.getCount() == 0)
            {
                mostrarMensaje(1, perfil.etiquetas.lbMsgSinDocCMod);
                return;
            }
            modificar = true;
            fpInstTrans.getForm().reset();
            fpInstTrans.getForm().loadRecord(smbancodos.getSelected());
            winInstTrans.setTitle(perfil.etiquetas.lbTitleModInsT);
            winInstTrans.show();
            idinstrumentobancario.setValue(smbancodos.getSelected().get('idinstrumentobancario'));
            cbxtipoinstrumento.setValue(smbancodos.getSelected().get('idtipodocumento'));
            tfnroinstrumento.setValue(smbancodos.getSelected().get('numerodocumento'));
            tfnrosolicitud.setValue(smbancodos.getSelected().get('idsolicitud'));
            dffecharecepcion.setValue(smbancodos.getSelected().get('fecharecepcion'));
            tfimporteinst.setValue(saldo(smbancodos.getSelected().get('importemo')));
            //tfimporteinstcont.setValue(saldo(smbancodos.getSelected().get('importemb')));
            var importemo = smbancodos.getSelected().get('importemo');
            var importemb = smbancodos.getSelected().get('importemb');
            tfimporteletras.setValue(convertir_a_letras(importemo));
            //tfimporteletrascont.setValue(convertir_a_letras(importemb));
            tacomentarioinst.setValue(smbancodos.getSelected().get('comentario'));

            //            idespecialidad=smbancodos.getSelected().get('idespecialidad');
            //            tfespecialidad.setValue(smbancodos.getSelected().get('descripcionespecialidad'));
            comboIframe1.setValue(smbancodos.getSelected().get('idespecialidad'));
            comboIframe1.setRawValue(smbancodos.getSelected().get('descripcionespecialidad'));
            idespecialidad = '';
            idespecialidad = smbancodos.getSelected().get('idespecialidad');
            oldvalue = idespecialidad;//se almacena el valor viejo de la especialidad para comparar si se modifico

            var datos = new Array();
            datos.push(smbancodos.getSelected().get('idbeneficiario'));
            datos.push(smbancodos.getSelected().get('tipob'));
            datos.push(smbancodos.getSelected().get('beneficiario'));
            stbeneficiario.removeAll();
            llenastoreTemp(stbeneficiario, cbxbeneficiario, datos);

            cbxbeneficiario.setValue(smbancodos.getSelected().get('idbeneficiario'));
            cbxbeneficiario.setRawValue(smbancodos.getSelected().get('beneficiario'));

            var datos1 = new Array();
            datos1.push(smbancodos.getSelected().get('idrecibe'));
            datos1.push(smbancodos.getSelected().get('tipor'));
            datos1.push(smbancodos.getSelected().get('recibe'));
            stentregadoa.removeAll();
            llenastoreTemp(stentregadoa, cbxentregadoa, datos1);

            cbxentregadoa.setValue(smbancodos.getSelected().get('idrecibe'));
            cbxentregadoa.setRawValue(smbancodos.getSelected().get('recibe'));
            gridbanco = 2;
            if (!stbancodos.getCount()) {
                btnMbancodos.setDisabled(true);
                btnCbancodos.setDisabled(true);
            }
        } else {
            //mostrarMensaje(1,'No hay elementos a modificar.');
            btnMbancodos.setDisabled(true);
            btnCbancodos.setDisabled(true);
        }
    }
    else
        mostrarMensaje(1, perfil.etiquetas.lbMsgSinseleccion);
}

var grdbancodos = new Ext.grid.GridPanel({
    store: stbancodos,
    region: 'center',
    tbar: [btnAbancodos, btnMbancodos, btnCbancodos, '->', perfil.etiquetas.lbtextCenLibro, tfcredlibro],
    frame: true,
    //height:190,
    rowHeight: .50,
    //width:535,
    //autoWidth:true,
    autoExpandColumn: 'especialidad',
    loadMask: true,
    disableSelection: true,
    autoScroll: true,
    sm: smbancodos,
    style: 'margin:5 0 5 0',
    columns: [
        {
            header: perfil.etiquetas.lbCamNodoc,
            width: 95,
            sortable: true,
            dataIndex: 'numerodocumento'
        },
        {
            id: 'denominacion',
            header: perfil.etiquetas.lbtextTipodoc,
            width: 120,
            sortable: true,
            dataIndex: 'denominacion'
        },
        {
            id: 'especialidad',
            header: perfil.etiquetas.lbtextEsp,
            sortable: true,
            dataIndex: 'descripcionespecialidad'
        },
        {
            header: perfil.etiquetas.lbCamFecha,
            width: 80,
            sortable: true,
            dataIndex: 'fecharecepcion',
            align: 'center'
        },
        {
            header: perfil.etiquetas.lbCamImporte,
            width: 100,
            sortable: true,
            align: 'right',
            renderer: saldo,
            dataIndex: 'importemo'
        }
    ],
    listeners: {
        rowclick: function(sm, indiceFila, record) {
            idbancodos = indiceFila;
        },
        rowdblclick: function(t, rowIndex, e) {
            cargamodInstrumTransito();
        }
    }
});


//****************  Grid Izquierdo Arriba *****************
var btnAlibrouno = new Ext.Button({
//    icon: perfil.dirImg + 'adicionar.png',
    iconCls: 'adicionar',
    tooltip: perfil.etiquetas.lbTitleAddCred,
    handler: function() {
        if (comboCuenta.getValue()) {
            modificar = false;
            fpdebitocred.getForm().reset();
            tfnroestadocuenta.setValue('');
            tfdiferencia.setValue('');
            tfdiferenciacontable.setValue('');
            tacomentario.setValue('');
            tfcuentabancaria.setValue(comboCuenta.getRawValue());
            fpdebitocred.getForm().clearInvalid();
            gridlibro = 1;
            winDebitoCred.setTitle(perfil.etiquetas.lbTitleAddCred);
            winDebitoCred.show();
            Ext.getCmp('winDebitoCredAplicar').show();
            tfnroestadocuenta.focus(false, 100);
            fpdebitocred.getForm().clearInvalid();
        }
        else
            mostrarMensaje(1, perfil.etiquetas.lbMsgSinseleccion);
    }
});
var btnClibrouno = new Ext.Button({
    tooltip: perfil.etiquetas.lbTitleElimCred,
//    icon: perfils.dirImg + 'eliminar.png',
    iconCls: 'eliminar',
    disabled: true,
    handler: function() {
        if (comboCuenta.getValue()) {
            if (stlibrouno.getCount()) {  // si no hay elementos
                if (smlibrouno.getCount() == 0) {
                    mostrarMensaje(1, perfil.etiquetas.lbMsgSinElemElim);
                } else {
                    var records = smlibrouno.getSelections();
                    stlibrouno.remove(records[0]);
                    CalcularSaldos();
                }
                if (!stlibrouno.getCount()) {
                    btnMlibrouno.setDisabled(true);
                    btnClibrouno.setDisabled(true);
                }
            } else {
                // mostrarMensaje(1,'No hay elementos a eliminar.');
                btnMlibrouno.setDisabled(true);
                btnClibrouno.setDisabled(true);
            }
        }
        else
            mostrarMensaje(1, perfil.etiquetas.lbMsgSinseleccion);
    }
});
var btnMlibrouno = new Ext.Toolbar.Button({
    tooltip: perfil.etiquetas.lbTitleModCred,
//    icon: perfil.dirImg + 'modificar.png',
    iconCls: 'modificar',
    disabled: true,
    handler: function() {
        cargamodDiferenciacredito();
    }
});

var reclibrouno = Ext.data.Record.create([
    {
        name: 'nroestado',
        type: 'string'
    },
    {
        name: 'iddiferencia',
        type: 'string'
    },
    {
        name: 'diferenciamo',
        type: 'string'
    },
    {
        name: 'diferenciamocontable',
        type: 'string'
    },
    {
        name: 'comentario',
        type: 'string'
    }
]);

var stlibrouno = new Ext.data.Store({
    reader: new Ext.data.ArrayReader({
        id: "iddiferencia"
    }, reclibrouno)
});
var smlibrouno = new Ext.grid.RowSelectionModel({
    singleSelect: true,
    listeners: {
        rowdeselect: function(sm, rowIndex, r) {
            btnMlibrouno.setDisabled(true);
            btnClibrouno.setDisabled(true);
        },
        rowselect: function(sm, rowIndex, r) {
            btnMlibrouno.setDisabled(false);
            btnClibrouno.setDisabled(false);
        }
    }
});


var grdlibrouno = new Ext.grid.GridPanel({
    store: stlibrouno,
    tbar: [btnAlibrouno, btnMlibrouno, btnClibrouno, '->', perfil.etiquetas.lbtextCenBanco, tfcredbanco],
    frame: true,
    //height:185,
    rowHeight: .50,
    //autoWidth:true,
    //width:320,
    loadMask: true,
    sm: smlibrouno,
    disableSelection: true,
    autoScroll: true,
    style: 'margin:5 0 5 0',
    columns: [
        {
            header: perfil.etiquetas.lbCamNoestadocta,
            width: 115,
            sortable: true,
            dataIndex: 'nroestado'
        },
        {
            header: perfil.etiquetas.lbtextComentario,
            width: 95,
            sortable: true,
            dataIndex: 'comentario'
        },
        {
            id: 'dif',
            header: perfil.etiquetas.lbCamDiferencia,
            width: 85,
            align: 'right',
            sortable: true,
            renderer: saldo,
            dataIndex: 'diferenciamo'
        }
    ],
    autoExpandColumn: 'dif',
    listeners: {
        rowclick: function(sm, indiceFila, record) {
            idlibrouno = indiceFila;
        },
        rowdblclick: function(t, rowIndex, e) {
            cargamodDiferenciacredito();
        }
    }
});

function cargamodDiferenciacredito()
{
    if (comboCuenta.getValue()) {
        if (stlibrouno.getCount()) {  // si no hay elementos
            if (smlibrouno.getCount()) {
                modificar = true;
                fpdebitocred.getForm().reset();
                tfcuentabancaria.setValue(comboCuenta.getRawValue());
                iddiferencia.setValue(stlibrouno.data.items[idlibrouno].get('iddiferencia'));
                tfdiferencia.setValue(saldo(stlibrouno.data.items[idlibrouno].get('diferenciamo')));
                tfdiferenciacontable.setValue(saldo(stlibrouno.data.items[idlibrouno].get('diferenciamocontable')));
                tfnroestadocuenta.setValue(stlibrouno.data.items[idlibrouno].get('nroestado'));
                tacomentario.setValue(stlibrouno.data.items[idlibrouno].get('comentario'));
                gridlibro = 1;
                winDebitoCred.setTitle(perfil.etiquetas.lbTitleModDeb);
                winDebitoCred.show();
                Ext.getCmp('winDebitoCredAplicar').hide();
                tfnroestadocuenta.focus(false, 100);

                if (!stlibrouno.getCount()) {
                    btnMlibrouno.setDisabled(true);
                    btnClibrouno.setDisabled(true);
                }
            } else
                mostrarMensaje(1, perfil.etiquetas.lbMsgSinElemMod);
        } else {
            // mostrarMensaje(1,'No hay elementos a modificar.');
            btnMlibrouno.setDisabled(true);
            btnClibrouno.setDisabled(true);
        }
    }
    else
        mostrarMensaje(1, perfil.etiquetas.lbMsgSinseleccion);
}


//**************** Grid Izquierda Abajo ***************** 
var btnAlibrodos = new Ext.Button({
//    icon: perfil.dirImg + 'adicionar.png',
    iconCls: 'adicionar',
    tooltip: perfil.etiquetas.lbTitleAddDeb,
    handler: function() {
        if (comboCuenta.getValue()) {
            modificar = false;
            fpdebitocred.getForm().reset();
            tfnroestadocuenta.setValue('');
            tfdiferencia.setValue('');
            tfdiferenciacontable.setValue('');
            tacomentario.setValue('');
            tfcuentabancaria.setValue(comboCuenta.getRawValue());
            fpdebitocred.getForm().clearInvalid();
            gridlibro = 2;
            winDebitoCred.setTitle(perfil.etiquetas.lbTitleAddDeb);
            winDebitoCred.show();
            tfnroestadocuenta.focus(false, 100);
            fpdebitocred.getForm().clearInvalid();
        }
        else
            mostrarMensaje(1, perfil.etiquetas.lbMsgSinseleccion);
    }

});
var btnClibrodos = new Ext.Button({
//    icon: perfil.dirImg + 'eliminar.png',
    iconCls: 'eliminar',
    tooltip: perfil.etiquetas.lbTitleElimDeb,
    disabled: true,
    handler: function() {
        if (comboCuenta.getValue()) {
            if (stlibrodos.getCount()) {  // si no hay elementos
                if (smlibrodos.getCount() == 0)
                    mostrarMensaje(1, perfil.etiquetas.lbMsgSinElemElim);
                else
                {
                    var records = smlibrodos.getSelections();
                    stlibrodos.remove(records[0]);
                    CalcularSaldos();
                    if (!stlibrodos.getCount()) {
                        btnMlibrodos.setDisabled(true);
                        btnClibrodos.setDisabled(true);
                    }
                }

            }
            else {
                //mostrarMensaje(1,'No hay elementos a eliminar.');
                btnMlibrodos.setDisabled(true);
                btnClibrodos.setDisabled(true);
            }
        }
        else
            mostrarMensaje(1, perfil.etiquetas.lbMsgSinseleccion);
    }
});
var btnMlibrodos = new Ext.Toolbar.Button({
//    icon: perfil.dirImg + 'modificar.png',
    iconCls: 'modificar',
    disabled: true,
    tooltip: perfil.etiquetas.lbTitleModDeb,
    handler: function() {
        cargamodDiferenciaDebito();
    }
});

var reclibrodos = Ext.data.Record.create([
    {
        name: 'nroestado',
        type: 'string'
    },
    {
        name: 'iddiferencia',
        type: 'string'
    },
    {
        name: 'diferenciamo',
        type: 'string'
    },
    {
        name: 'diferenciamocontable',
        type: 'string'
    },
    {
        name: 'comentario',
        type: 'string'
    }
]);

var stlibrodos = new Ext.data.Store({
    reader: new Ext.data.ArrayReader({
        id: "iddiferencia"
    }, reclibrodos)
});
var smlibrodos = new Ext.grid.RowSelectionModel({
    singleSelect: true,
    listeners: {
        rowdeselect: function(sm, rowIndex, r) {
            btnMlibrodos.setDisabled(true);
            btnClibrodos.setDisabled(true);
        },
        rowselect: function(sm, rowIndex, r) {
            btnMlibrodos.setDisabled(false);
            btnClibrodos.setDisabled(false);
        }
    }
});


var grdlibrodos = new Ext.grid.GridPanel({
    store: stlibrodos,
    tbar: [btnAlibrodos, btnMlibrodos, btnClibrodos, '->', {
            xtype: 'tbtext',
            text: perfil.etiquetas.lbtextDenBanco
        }, tfdebbanco],
    frame: true,
    //height:185,
    rowHeight: .50,
    //width:320,
    //autoWidth:true,
    loadMask: true,
    sm: smlibrodos,
    disableSelection: true,
    autoScroll: true,
    style: 'margin:5 0 5 0',
    columns: [
        {
            header: perfil.etiquetas.lbCamNoestadocta,
            width: 115,
            sortable: true,
            dataIndex: 'nroestado'
        },
        {
            header: perfil.etiquetas.lbtextComentario,
            width: 95,
            sortable: true,
            dataIndex: 'comentario'
        },
        {
            id: 'dif',
            header: perfil.etiquetas.lbCamDiferencia,
            width: 85,
            align: 'right',
            sortable: true,
            renderer: Ext.util.Format.erpMoney,
            dataIndex: 'diferenciamo'
        }
    ],
    autoExpandColumn: 'dif',
    listeners: {
        rowclick: function(sm, indiceFila, record) {
            idlibrodos = indiceFila;
        },
        rowdblclick: function(t, rowIndex, e) {
            idlibrodos = rowIndex;
            cargamodDiferenciaDebito();
        }
    }
});

function cargamodDiferenciaDebito() {
    if (comboCuenta.getValue()) {
        if (stlibrodos.getCount()) {  // si no hay elementos
            if (smlibrodos.getCount()) {
                modificar = true;
                fpdebitocred.getForm().reset();
                tfcuentabancaria.setValue(comboCuenta.getRawValue());
                iddiferencia.setValue(stlibrodos.data.items[idlibrodos].get('iddiferencia'));
                tfdiferencia.setValue(saldo(stlibrodos.data.items[idlibrodos].get('diferenciamo')));
                tfdiferenciacontable.setValue(saldo(stlibrodos.data.items[idlibrodos].get('diferenciamocontable')));
                tfnroestadocuenta.setValue(stlibrodos.data.items[idlibrodos].get('nroestado'));
                tacomentario.setValue(stlibrodos.data.items[idlibrodos].get('comentario'));
                gridlibro = 2;
                winDebitoCred.setTitle(perfil.etiquetas.lbTitleElimDeb);
                winDebitoCred.show();
                tfnroestadocuenta.focus(false, 10);
                if (!stlibrodos.getCount()) {
                    btnMlibrodos.setDisabled(true);
                    btnClibrodos.setDisabled(true);
                }
            }
            else
                mostrarMensaje(1, perfil.etiquetas.lbMsgSinElemMod);
        }
        else {
            // mostrarMensaje(1,'No hay elementos a modificar.');
            btnMlibrodos.setDisabled(true);
            btnClibrodos.setDisabled(true);
        }
    }
    else
        mostrarMensaje(1, perfil.etiquetas.lbMsgSinseleccion);
}

//label para simular column vacia
var lfDatos = new Ext.form.Label({
    id: 'lfvacio',
    text: perfil.etiquetas.lbtextMonSuc,
    style: 'font:12px tahoma,arial,verdana,sans-serif;',
    anchor: '100%'
});

/** Form panel **/
var fpconcbancaria = new Ext.FormPanel({
    frame: true,
    id: 'fpconcbancaria',
    name: 'fpconcbancaria',
    layout: 'border',
    defaults: {
        split: true
    },
    items: [{
            region: 'north',
            height: 70,
            frame: true,
            items: [{
                    layout: 'column',
                    items: [{
                            layout: 'form',
                            labelWidth: 110,
                            columnWidth: .25,
                            items: dfdateconc
                        }, {
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            columnWidth: .75,
                            items: comboCuenta
                        }]
                }, {
                    style: 'margin:10 0 0 0',
                    layout: 'form',
                    items: lfDatos
                }]
        }, {
            xtype: 'fieldset',
            region: 'west',
            width: 369,
            title: perfil.etiquetas.lbCamSaldolibro,
            layout: 'row',
            labelAlign: 'right',
            tbar: ['->', perfil.etiquetas.lbtextSaldoAI, tfsalactlibro],
            //tbar: ['->', '= Saldo actual:', tfsalactlibro],
            bbar: ['->', perfil.etiquetas.lbtextSaldoAjI, tfsaldoajlibro],
            //bbar: ['->', '= Saldo ajustado:', tfsaldoajlibro],
            items: [{
                    rowHeight: .99,
                    layout: 'row',
                    items: [
                        grdlibrouno,
                        grdlibrodos
                    ]
                }]
        }, {
            xtype: 'fieldset',
            region: 'center',
            layout: 'row',
            title: perfil.etiquetas.lbCamSaldobanco,
            labelAlign: 'right',
            tbar: ['->', perfil.etiquetas.lbtextSaldoAI, tfsalactbanco],
            //tbar: ['->', '= Saldo actual:', tfsalactbanco],
            bbar: ['->', perfil.etiquetas.lbtextSaldoAjI, tfsaldoajbanco],
            //bbar: ['->', '= Saldo ajustado:', tfsaldoajbanco],
            items: [{
                    layout: 'row',
                    rowHeight: .99,
                    items: [grdbancouno, grdbancodos]
                }]
        }]
});

//********          Botones       ***********		
var btnG = new Ext.Button({
    name: 'btnG',
    text: perfil.etiquetas.lbBtnAceptar,
    tooltip: perfil.etiquetas.lbBtnTooltipAceptar,
//    icon: perfil.dirImg + 'aceptar.png',
    iconCls: 'aceptar',
    handler: function() {
        SalvarConciliacion();
    }
});
var btnC = new Ext.Button({
    name: 'btnC',
    text: perfil.etiquetas.lbBtnCancelar,
    tooltip: perfil.etiquetas.lbBtnTooltipCancelar,
//    icon: perfil.dirImg + 'cancelar.png',
    iconCls: 'cancelar',
    handler: function() {
        windowopen = false;
        winConciliacionBancaria.hide();
        limpiarformulario();
        lfDatos.setText(perfil.etiquetas.lbtextMonSuc);
    }
});
var btnA = new Ext.Button({
    name: 'btnA',
//    icon: perfil.dirImg + 'aplicar.png',
    iconCls: 'aplicar',
    text: perfil.etiquetas.lbBtnAplicar,
    tooltip: perfil.etiquetas.lbBtnTooltipAplicar,
    handler: function() {
        SalvarConciliacion(true);
    }
});

function cargarDatosiniciales(idctab) {
    if (!winConciliacionBancaria) {
        winConciliacionBancaria = new Ext.Window({
            layout: 'fit',
            width: 900,
            height: 510,
            modal: true,
            closeAction: 'hide',
            items: [fpconcbancaria],
            buttons: [btnC, btnA, btnG],
            listeners: {
                beforehide: function(win) {
                    lfDatos.setText(perfil.etiquetas.lbtextMonSuc);
                    fpconcbancaria.getForm().reset();
                },
                hide: function() {
                    windowopen = false;// para indicar que la ventana fue cerrada
                },
                close: function() {
                    windowopen = false;// para indicar que la ventana fue cerrada
                }
            }
        });
    }

    MostrarEtiquetas(Ext.getBody(), perfil.etiquetas.lbload);

    StcomboCuenta.load({
        params: {
            idcuentabancaria: idctab
        },
        callback: function(options, success, response) {
            if (StcomboCuenta.getCount() == 0)
            {
                lMasktemp.hide();
                //winConciliacionBancaria.hide();stbanco
                if (stbanco.getCount())
                    mostrarMensaje(1, perfil.etiquetas.lbMsgCBconCA);
                else
                    mostrarMensaje(1, perfil.etiquetas.lbMsgSinCB);
            } else {
                winConciliacionBancaria.show();
                winConciliacionBancaria.maximize();
                winConciliacionBancaria.doLayout();
                dfdateconc.focus(false, 100);

                comboCuenta.enable();
                limpiarformulario();//dejar o no

                DameFechaPeriodo();
                if (idctab > 0 && acc == 'mod') { // si cuenta bancaria se cargo y voy a modificar....
                    winConciliacionBancaria.setTitle(perfil.etiquetas.lbTitleModC);
                    btnA.hide();
                    Ext.getCmp('comboCuenta').fireEvent('select', this);/*se dispara el evento que carga el grid*/
                    comboCuenta.disable();
                } else {
                    winConciliacionBancaria.setTitle(perfil.etiquetas.lbTitleAddC);
                    btnA.show();
                    if (StcomboCuenta.getCount() == 1) {
                        Ext.getCmp('comboCuenta').setValue(StcomboCuenta.data.items[0].data.idcuenta);
                        Ext.getCmp('comboCuenta').setRawValue(StcomboCuenta.data.items[0].data.nombre);
                        Ext.getCmp('comboCuenta').fireEvent('select', this);/*se dispara el evento que carga el grid*/
                    }
                }

            }
        } // del calback
    });
}

function DameFechaPeriodo() {
    lMaskPeriodo.show();
    Ext.Ajax.request({
        url: 'buscarfechacontable',
        callback: function(options, success, response) {
            var responseData = Ext.decode(response.responseText);
            if (acc == 'ins')
                lMaskPeriodo.hide();
            if (responseData == undefined) {
                mostrarMensaje(1, perfil.etiquetas.lbMsgSinP);
            } else if (responseData.fechai) {
                // Fecha de inicio y fecha de fin
                fechainicioperiodo = responseData.fechai;
                dfdateconc.setMinValue(responseData.fechai);
                dfdateconc.setValue(responseData.fecha);
                dfdateconc.setMaxValue(responseData.fechafin);
                if (acc != 'mod')
                    dffecharecepcion.setMinValue(responseData.fechai);
                dffecharecepcion.setMaxValue(responseData.fechafin);
            }
            else
                mostrarMensaje(1, perfil.etiquetas.lbMsgSinP);
            lMaskPeriodo.hide();
        }
    });
}

function cargandoDatosCta()
{
    loadMaskSaldo.show();
    sttipoinstrumento.load();
    Ext.Ajax.request({
        url: 'cargardatos',
        method: 'POST',
        params: {
            idcuenta: comboCuenta.getValue()
        },
        success: function(response) {
            var jsonlibrobanco = response.responseText;
            var data = Ext.decode(jsonlibrobanco);
            if (data == undefined)
            {
                mostrarMensaje(3, perfil.etiquetas.lbMsgSinD);
                winConciliacionBancaria.hide();
                loadMaskSaldo.hide();
            }
            else
            {
                if (data.codMsg == undefined)
                {
                    tfsalactlibro.setValue(saldo(data.saldolibro));
                    tfsalactbanco.setValue(saldo(data.saldobanco));
                    dfdateconc.setMinValue(fechainicioperiodo);
                    if (dfdateconc.minValue.format('Y-m-d') < data.fechaapertura)
                        dfdateconc.setMinValue(data.fechaapertura);
                    dffecharecepcion.setMinValue(data.fechaapertura);
                    CalcularSaldos();
                    loadMaskSaldo.hide();
                    if (acc == 'mod')
                        cargardatosmodificar();
                }
                else
                {
                    mostrarMensaje(data.codMsg, data.mensaje);
                    winConciliacionBancaria.hide();
                    loadMaskSaldo.hide();
                }
            }
        },
        failure: function(response) {
            loadMaskSaldo.hide();
            mostrarMensaje(1, perfil.etiquetas.lbMsgSinD);
            return false;
        }
    });
}
comboCuenta.on('select', function cargar(Tpan, tab) {

    /*  if(acc == 'mod')
     {		
     idcuentabancaria = StcomboCuenta.getAt(0).get('idcuenta');
     comboCuenta.setValue(idcuentabancaria); 
     var objdata = StcomboCuenta.getAt(0).data;
     // myitems = fpconcbancaria.getTopToolbar().items;  
     if(objdata.nomsucursal){
     //myitems.itemAt(0).getEl().innerHTML = 'Moneda: <b>'+objdata.codigoiso+'</b>. Sucursal: <b>'+objdata.nomsucursal+'</b>.';
     
     lfDatos.setText('Moneda: ' + objdata.codigoiso + '. ' + 'Sucursal: ' + objdata.nomsucursal + '.');
     }else{
     // myitems.itemAt(0).getEl().innerHTML = 'Moneda: <b>'+objdata.codigoiso+'</b>. Banco: <b>'+objdata.nombanco+'</b>.';	  
     lfDatos.setText('Moneda: ' + objdata.codigoiso + '. ' + 'Banco: ' + objdata.nombanco + '.');
     }
     cargandoDatosCta();
     }else // se va a adicionar
     {		 
     var objdata = StcomboCuenta.getAt(StcomboCuenta.find('idcuenta', comboCuenta.getValue())).data;
     /*myitems = fpconcbancaria.getTopToolbar().items;  
     if(objdata.nomsucursal)
     myitems.itemAt(0).getEl().innerHTML = 'Moneda: <b>'+objdata.codigoiso+'</b>. Sucursal: <b>'+objdata.nomsucursal+'</b>.';
     else
     myitems.itemAt(0).getEl().innerHTML = 'Moneda: <b>'+objdata.codigoiso+'</b>. Banco: <b>'+objdata.nombanco+'</b>.';	  */
    /*if(objdata.nomsucursal){
     //myitems.itemAt(0).getEl().innerHTML = 'Moneda: <b>'+objdata.codigoiso+'</b>. Sucursal: <b>'+objdata.nomsucursal+'</b>.';
     lfDatos.setText('Moneda: ' + objdata.codigoiso + '. ' + 'Sucursal: ' + objdata.nomsucursal + '.');
     }else{
     // myitems.itemAt(0).getEl().innerHTML = 'Moneda: <b>'+objdata.codigoiso+'</b>. Banco: <b>'+objdata.nombanco+'</b>.';	  
     lfDatos.setText('Moneda: ' + objdata.codigoiso + '. ' + 'Banco: ' + objdata.nombanco + '.');
     }		
     cargandoDatosCta();*/ // la asignacion del  texto es igual  independientemente de la accion add o  mod
    if (acc == 'mod') {
        idcuentabancaria = StcomboCuenta.getAt(0).get('idcuenta');
        comboCuenta.setValue(idcuentabancaria);
        var objdata = StcomboCuenta.getAt(0).data;
    } else // se va a adicionar
    {
        var objdata = StcomboCuenta.getAt(StcomboCuenta.find('idcuenta', comboCuenta.getValue())).data;
    }

    if (objdata.nomsucursal) {
        //myitems.itemAt(0).getEl().innerHTML = 'Moneda: <b>'+objdata.codigoiso+'</b>. Sucursal: <b>'+objdata.nomsucursal+'</b>.';
        lfDatos.setText(perfil.etiquetas.lbTextMoneda + objdata.codigoiso + '. ' + perfil.etiquetas.lbTextSucursal + objdata.nomsucursal + '.');
    } else {
        // myitems.itemAt(0).getEl().innerHTML = 'Moneda: <b>'+objdata.codigoiso+'</b>. Banco: <b>'+objdata.nombanco+'</b>.';	  
        lfDatos.setText(perfil.etiquetas.lbTextMoneda + objdata.codigoiso + '. ' + perfil.etiquetas.lbTextBanco + objdata.nombanco + '.');
    }
    cargandoDatosCta();
});

function limpiarformulario() {
    fpconcbancaria.getForm().reset();
    //fpconcbancaria.getTopToolbar().items.itemAt(6).getEl().innerHTML = '';
    //if(fpconcbancaria.getTopToolbar()) fpconcbancaria.getTopToolbar().items.clear();
    comboCuenta.reset();
    if (StcomboCuenta.getCount())
        comboCuenta.clearValue();
    stbancouno.removeAll();
    stbancodos.removeAll();
    stlibrouno.removeAll();
    stlibrodos.removeAll();
    dblibro = 0;
    crlibro = 0;
    dbbanco = 0;
    crbanco = 0;
    tfsalactlibro.setValue(0.00);
    tfsalactbanco.setValue(0.00);
    tfcredlibro.setValue(0.00);
    tfcredbanco.setValue(0.00);
    tfdeblibro.setValue(0.00);
    tfdebbanco.setValue(0.00);
    tfsaldoajbanco.setValue(0.00);
    tfsaldoajlibro.setValue(0.00);
    dfdateconc.reset();
}

function CalcularSaldos() {
    //gestionando arreglo Libro primer grid
    var creditobanco = 0;
    if (stlibrouno.getCount())
        for (var i = 0; i < stlibrouno.getCount(); i++)
            creditobanco += parseFloat(stlibrouno.data.items[i].get('diferenciamo'));

    //gestionando arreglo Libro segundo grid
    var debitobanco = 0;
    if (stlibrodos.getCount())
        for (var i = 0; i < stlibrodos.getCount(); i++)
            debitobanco += parseFloat(stlibrodos.data.items[i].get('diferenciamo'));

    tfcredbanco.setValue(saldo(creditobanco));
    tfdebbanco.setValue(saldo(debitobanco));
    // Saldo ajustado = saldo de la cuenta + (diferencia  grid abajo_debito - grid arriba_credito)
    sldobook = parseFloat(tfsalactlibro.getValue())
    sldorestabook = sldobook + creditobanco - debitobanco;
    tfsaldoajlibro.setValue(saldoformateado(sldorestabook));

    /*** SEGUN BANCO - INSTRUMENTO ***/
    //gestionando arreglo banco primer grid
    var debitolibro = 0;
    if (stbancouno.getCount())
        for (var i = 0; i < stbancouno.getCount(); i++)
            debitolibro += parseFloat(stbancouno.data.items[i].get('importemo'));

    //gestionando arreglo banco segundo grid
    var creditolibro = 0;
    if (stbancodos.getCount())
        for (var i = 0; i < stbancodos.getCount(); i++)
            creditolibro += parseFloat(stbancodos.data.items[i].get('importemo'));

    tfcredlibro.setValue(saldo(creditolibro));
    tfdeblibro.setValue(saldo(debitolibro));
    tfsaldoajbanco.setValue(saldoformateado(parseFloat(tfsalactbanco.getValue()) + debitolibro - creditolibro));
}

function Agrupargrid() {

    //gestionando arreglo Libro primer grid
    var arrLibrouno = new Array();
    if (stlibrouno.getCount()) {
        for (var i = 0; i < stlibrouno.getCount(); i++) {
            arrLibrouno[i] = {
                'nroestado': stlibrouno.data.items[i].get('nroestado'),
                'iddiferencia': stlibrouno.data.items[i].get('iddiferencia'),
                'diferenciamo': stlibrouno.data.items[i].get('diferenciamo'),
                'diferenciamocontable': stlibrouno.data.items[i].get('diferenciamocontable'),
                'comentario': stlibrouno.data.items[i].get('comentario')
            };
        }
    }
    arrGrid[0] = arrLibrouno;

    //gestionando arreglo Libro segundo grid
    var arrLibrodos = new Array();
    if (stlibrodos.getCount()) {
        for (var i = 0; i < stlibrodos.getCount(); i++) {
            arrLibrodos[i] = {
                'nroestado': stlibrodos.data.items[i].get('nroestado'),
                'iddiferencia': stlibrodos.data.items[i].get('iddiferencia'),
                'diferenciamo': stlibrodos.data.items[i].get('diferenciamo'),
                'diferenciamocontable': stlibrodos.data.items[i].get('diferenciamocontable'),
                'comentario': stlibrodos.data.items[i].get('comentario')
            };
        }
    }
    arrGrid[1] = arrLibrodos;

    //gestionando arreglo Banco primer grid 
    var arrBancouno = new Array();
    if (stbancouno.getCount()) {
        for (var i = 0; i < stbancouno.getCount(); i++) {
            arrBancouno[i] = {
                numerodocumento: stbancouno.data.items[i].get('numerodocumento'),
                idinstrumentobancario: stbancouno.data.items[i].get('idinstrumentobancario'),
                fecharecepcion: stbancouno.data.items[i].get('fecharecepcion'),
                importemo: stbancouno.data.items[i].get('importemo'),
                importemb: stbancouno.data.items[i].get('importemb'),
                denominacion: comboCuenta.getRawValue(),
                comentario: stbancouno.data.items[i].get('comentario'),
                idtipodocumento: stbancouno.data.items[i].get('idtipodocumento'),
                idbeneficiario: stbancouno.data.items[i].get('idbeneficiario'),
                beneficiario: stbancouno.data.items[i].get('beneficiario'),
                tipob: stbancouno.data.items[i].get('tipob'),
                idrecibe: stbancouno.data.items[i].get('idrecibe'),
                recibe: stbancouno.data.items[i].get('recibe'),
                tipor: stbancouno.data.items[i].get('tipor'),
                idsolicitud: stbancouno.data.items[i].get('idsolicitud'),
                idespecialidad: stbancouno.data.items[i].get('idespecialidad'),
                descripcionespecialidad: stbancouno.data.items[i].get('descripcionespecialidad')
            };
        }
    }
    arrGrid[2] = arrBancouno;

    //gestionando arreglo Banco primer grid 
    var arrBancodos = new Array();
    if (stbancodos.getCount()) {
        for (var i = 0; i < stbancodos.getCount(); i++) {
            arrBancodos[i] = {
                numerodocumento: stbancodos.data.items[i].get('numerodocumento'),
                idinstrumentobancario: stbancodos.data.items[i].get('idinstrumentobancario'),
                fecharecepcion: stbancodos.data.items[i].get('fecharecepcion'),
                importemo: stbancodos.data.items[i].get('importemo'),
                importemb: stbancodos.data.items[i].get('importemb'),
                denominacion: comboCuenta.getRawValue(),
                comentario: stbancodos.data.items[i].get('comentario'),
                idtipodocumento: stbancodos.data.items[i].get('idtipodocumento'),
                idbeneficiario: stbancodos.data.items[i].get('idbeneficiario'),
                beneficiario: stbancodos.data.items[i].get('beneficiario'),
                tipob: stbancodos.data.items[i].get('tipob'),
                idrecibe: stbancodos.data.items[i].get('idrecibe'),
                recibe: stbancodos.data.items[i].get('recibe'),
                tipor: stbancodos.data.items[i].get('tipor'),
                idsolicitud: stbancodos.data.items[i].get('idsolicitud'),
                idespecialidad: stbancodos.data.items[i].get('idespecialidad'),
                descripcionespecialidad: stbancodos.data.items[i].get('descripcionespecialidad')
            };
        }
    }
    arrGrid[3] = arrBancodos;

    return arrGrid;
}

function Idviejos() {
    //gestionando arreglo Libro primer grid
    var arrLibrouno = new Array();
    if (stlibrouno.getCount())
        for (var i = 0; i < stlibrouno.getCount(); i++)
            arrLibrouno.push(stlibrouno.data.items[i].get('iddiferencia'));
    arrGrid[0] = arrLibrouno;

    //gestionando arreglo Libro segundo grid
    var arrLibrodos = new Array();
    if (stlibrodos.getCount())
        for (var i = 0; i < stlibrodos.getCount(); i++)
            arrLibrodos.push(stlibrodos.data.items[i].get('iddiferencia'));
    arrGrid[1] = arrLibrodos;

    //gestionando arreglo Banco primer grid 
    var arrBancouno = new Array();
    if (stbancouno.getCount())
        for (var i = 0; i < stbancouno.getCount(); i++)
            arrBancouno.push(stbancouno.data.items[i].get('idinstrumentobancario'));
    arrGrid[2] = arrBancouno;

    //gestionando arreglo Banco primer grid 
    var arrBancodos = new Array();
    if (stbancodos.getCount())
        for (var i = 0; i < stbancodos.getCount(); i++)
            arrBancodos.push(stbancodos.data.items[i].get('idinstrumentobancario'));
    arrGrid[3] = arrBancodos;

    return arrGrid;
}

function SalvarConciliacion(apli) {
    if (!comboCuenta.getValue()) {
        mostrarMensaje(1, perfil.etiquetas.lbMsgDIncorr);
        comboCuenta.markInvalid(perfil.etiquetas.lbMsgReq);
    }
    else if (!dfdateconc.getValue()) {
        mostrarMensaje(1, perfil.etiquetas.lbMsgDIncorr);
        comboCuenta.markInvalid(perfil.etiquetas.lbMsgReq);
    }
    else {
        var conciliado = 0;
        if (saldounformat(tfsaldoajlibro.getValue()) == saldounformat(tfsaldoajbanco.getValue()))
            conciliado = 1;
        lMaskSave.show();
        Ext.Ajax.request({
            url: 'InsMod',
            method: 'POST',
            params: {
                acc: acc,
                idcuentabancaria: comboCuenta.getValue(),
                //idconciliacionbancaria: null, 
                conciliado: conciliado,
                saldo: tfsalactbanco.getValue(),
                fechaconcil: dfdateconc.getRawValue(),
                gridsviejo: Ext.encode(idviejos),
                grids: Ext.encode(Agrupargrid())
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);

                if (responseData == undefined) {
                    mostrarMensaje(3, perfil.etiquetas.lbMsgSinG);
                    winConciliacionBancaria.hide();
                    lMaskSave.hide();
                }
                else {
                    if (responseData.codMsg != undefined) {
                        mostrarMensaje(responseData.codMsg, responseData.mensaje);
                        lMaskSave.hide();
                    }
                    else {
                        var result = eval(response.responseText);

                        var temp = (acc == 'mod') ? perfil.etiquetas.lbMsgAdjetivoM : perfil.etiquetas.lbMsgAdjetivoA;
                        var temp1 = (acc == 'mod') ? perfil.etiquetas.lbMsgInfinitivoM : perfil.etiquetas.lbMsgInfinitivoA;
                        switch (result) {
                            case -1 :
                                mostrarMensaje(1, perfil.etiquetas.lbMsgGpartA + temp + perfil.etiquetas.lbMsgGpartB);
                                cierraylimpia(apli);
                                stbanco.reload();
                                break;
                            case -3 :
                                mostrarMensaje(3, perfil.etiquetas.lbMsgNoGpartA + temp1 + perfil.etiquetas.lbMsgNoGpartB);
                                lMaskSave.hide();
                                break;
                            case -4 :
                                mostrarMensaje(3, perfil.etiquetas.lbMsgNoGpartA + temp1 + perfil.etiquetas.lbMsgNoGpartC);
                                lMaskSave.hide();
                                break;
                            case -5 :
                                mostrarMensaje(3, perfil.etiquetas.lbMsgNoGpartA + temp1 + perfil.etiquetas.lbMsgNoGpartD);
                                lMaskSave.hide();
                                break;
                            case -6 :
                                mostrarMensaje(1, perfil.etiquetas.lbMsgNoGpartA + temp1 + perfil.etiquetas.lbMsgNoGpartF);
                                comboCuenta.reset();
                                StcomboCuenta.load({
                                    callback: function(options, success, response) {
                                        if (StcomboCuenta.getCount() == 0)
                                        {
                                            winConciliacionBancaria.hide();
                                        }
                                    } // del calback
                                });
                                lfDatos.setText(perfil.etiquetas.lbtextMonSuc);
                                fpconcbancaria.getForm().reset();
                                limpiarformulario();
                                lMaskSave.hide();
                                break;
                            case -7 :
                                mostrarMensaje(1, perfil.etiquetas.lbMsgNoGpartA + temp1 + perfil.etiquetas.lbMsgNoGpartF);
                                cargandoDatosCta();
                                lMaskSave.hide();
                                break;
                            default :
                                mostrarMensaje(3, perfil.etiquetas.lbMsgNoGpartA + temp1 + perfil.etiquetas.lbMsgNoGpartH);
                                lMaskSave.hide();
                                break;
                        }
                    }
                }
            }
        });
        return true;
    }
}

function cierraylimpia(apli) {
    if (!apli)
        winConciliacionBancaria.hide();
    else
        dfdateconc.focus(false, 100);
    lfDatos.setText(perfil.etiquetas.lbtextMonSuc);
    fpconcbancaria.getForm().reset();
    limpiarformulario();
}

function cargardatosmodificar() {
    loadMask.show();
    Ext.Ajax.request({
        url: 'cargargrids',
        method: 'POST',
        params: {
            idcuenta: idcuentabancaria
        },
        callback: function(options, success, response) {
            data = Ext.decode(response.responseText);
            if (data == undefined)
            {
                mostrarMensaje(3, perfil.etiquetas.lbMsgSinD);
                winConciliacionBancaria.hide();
                loadMask.hide();
            }
            else
            {
                if (data.codMsg == undefined)

                {
                    idviejos = new Array();
                    var dblibro = 0, crlibro = 0, saldolibro = 0, saldobanco = 0;
                    jsonlibrobanco = response.responseText;

                    /*conciliacion = data.conciliacion;*************** PQ es esto
                     if(conciliacion.length)
                     {
                     dfdateconc.setMinValue(conciliacion.fecha);
                     dfdateconc.setValue(conciliacion.fecha);
                     }else 
                     { 
                     dfdateconc.setMinValue(new Date());
                     dfdateconc.setValue(new Date());
                     }*/

                    dfdateconc.setMinValue(data.fecha);
                    dfdateconc.setValue(data.fecha);

                    libro = data.libro;
                    for (var i = 0; i < libro.length; i++) {
                        if (libro[i].tipo < 0) { //  diferenciamo < 0   ya se trae el valor absoluto
                            crlibro += parseFloat(libro[i].diferenciamo);
                            stlibrouno.add(new reclibrouno(libro[i]));
                        } else {
                            dblibro += parseFloat(libro[i].diferenciamo);
                            stlibrodos.add(new reclibrodos(libro[i]));
                        }
                    }

                    tfcredbanco.setValue(saldo(crlibro));
                    tfdebbanco.setValue(saldo(dblibro));

                    var dbbanco = 0;
                    var crbanco = 0;

                    if (data.banco != 0)
                    {
                        bancotransito = data.banco.transito;   // (-) negativos
                        bancodepositar = data.banco.depositar; // (+) depositar
                        stbancouno.removeAll();  // Arriba, grid depositar
                        stbancodos.removeAll();  // Arriba, grid transito

                        // Por depositar, los positivos (arriba)
                        for (var i = 0; i < bancodepositar.length; i++) {
                            dbbanco += parseFloat(bancodepositar[i].importemo);
                            stbancouno.add(new recbancouno(bancodepositar[i]));
                        }
                        // Transito, los negativos (abajo)
                        for (var i = 0; i < bancotransito.length; i++) {
                            crbanco += parseFloat(bancotransito[i].importemo);
                            stbancodos.add(new recbancodos(bancotransito[i]));
                        }
                    }

                    tfcredlibro.setValue(saldo(crbanco));
                    tfdeblibro.setValue(saldo(dbbanco));
                    tfsaldoajlibro.setValue(saldoformateado(parseFloat(tfsalactlibro.getValue()) + crlibro - saldo(dblibro)));
                    tfsaldoajbanco.setValue(saldoformateado(parseFloat(tfsalactbanco.getValue()) + dbbanco - saldo(crbanco)));

                    for (var i = 0; i < Idviejos().length; i++)
                        idviejos.push(Idviejos()[i]);

                    if (saldounformat(tfsaldoajlibro.getValue()) == saldounformat(tfsaldoajbanco.getValue())) {
                        mostrarMensaje(1, perfil.etiquetas.lbMsgConciliada);
                        loadMask.hide();
                    }
                    else {
                        mostrarMensaje(1, perfil.etiquetas.lbMsgNoConciliada);
                        loadMask.hide();
                    }

                }
                else
                {
                    mostrarMensaje(data.codMsg, data.mensaje);
                    winConciliacionBancaria.hide();
                    loadMask.hide();
                }
            }
        }
    });
}
