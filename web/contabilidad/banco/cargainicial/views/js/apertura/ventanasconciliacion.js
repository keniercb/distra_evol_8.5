
/*************Adicionar diferencia de debito o credito***************/
var tfdiferencia = new Ext.form.TextField({
    fieldLabel: perfil.etiquetas.lbtextImpOriginal,
    style: 'text-align: right',
    name: 'tfdiferencia',
    id: 'tfdiferencia',
    disabledClass: 'disabled-component',
    maskRe: /^([0-9\+\xf3\xf1\xe1\xe9\xed\xfa\#\$\xd1.]?[0-9.]*)+$/,
    regex: /^([0-9\+\xf3\xf1\xe1\xe9\xed\xfa\#\$\xd1.]?[0-9.]*)+$/,
    regexText: perfil.etiquetas.regexText19,
    maxLength: 19,
    maxLengthText: perfil.etiquetas.maxLengthText19,
    msgTarget: 'qtip',
    allowBlank: false,
    blankText: perfil.etiquetas.lbMsgReq,
    anchor: '100%',
    enableKeyEvents: true,
    listeners: {
        blur: function(tf) {
            if (tf.isValid())
                tfdiferencia.setRawValue(saldo(tfdiferencia.getValue()));
        },
        keypress: function(tf, e) { // Para dejar solo 2 decimales
            if (e.getKey() != 8) //
            {
                var value = new String(tf.getValue());
                var position = value.indexOf(".", 0);
                if (position > -1 && (e.getKey() == 37 || e.getKey() == 39))// Para que no permita desplazarse hacia izq o der
                    e.stopEvent();
                if (position > -1 && e.getKey() == 46)// Para que solo permita un punto
                    e.stopEvent();
                if (position > -1 && (value.length - position) > 2)// Para que solo permita 2 lugares decimales
                    e.stopEvent();
                if (position == -1 && value.length >= 16 && e.getKey() != 46)// Para que escriba solo 16 caracteres antes del '.'
                    e.stopEvent();
                if (value.length >= 19)// Para que escriba solo 19 caracteres
                    e.stopEvent();
                if ((e.getKey() == 13) && (tf.getValue())) {
                    tfdiferenciacontable.focus(false, 100);// darle foco  a fecha 
                }
            }
        }
    }
});

var tfdiferenciacontable = new Ext.form.TextField({
    fieldLabel: perfil.etiquetas.lbtextImpContable,
    style: 'text-align: right',
    name: 'importedifcontdebito',
    id: 'importedifcontdebito',
    disabledClass: 'disabled-component',
    maskRe: /^([0-9\+\xf3\xf1\xe1\xe9\xed\xfa\xd1.]?[0-9.]*)+$/,
    regex: /^([0-9\+\xf3\xf1\xe1\xe9\xed\xfa\xd1.]?[0-9.]*)+$/,
    regexText: perfil.etiquetas.regexText19,
    maxLength: 19,
    maxLengthText: perfil.etiquetas.maxLengthText19,
    msgTarget: 'qtip',
    allowBlank: false,
    blankText: perfil.etiquetas.lbMsgReq,
    anchor: '100%',
    enableKeyEvents: true,
    listeners: {
        keyup: function(t, e) {
            var num = tfdiferenciacontable.getValue();
            // verificar los lugares decimalesdecimales
        },
        blur: function(tf) {
            if (tf.isValid())
                tfdiferenciacontable.setRawValue(saldo(tfdiferenciacontable.getValue()));
        },
        keypress: function(tf, e) { // Para dejar solo 2 decimales
            if (e.getKey() != 8) //
            {
                var value = new String(tf.getValue());
                var position = value.indexOf(".", 0);
                if (position > -1 && (e.getKey() == 37 || e.getKey() == 39))// Para que no permita desplazarse hacia izq o der
                    e.stopEvent();
                if (position > -1 && e.getKey() == 46)// Para que solo permita un punto
                    e.stopEvent();
                if (position > -1 && (value.length - position) > 2)// Para que solo permita 2 lugares decimales
                    e.stopEvent();
                if (position == -1 && value.length >= 16 && e.getKey() != 46)// Para que escriba solo 16 caracteres antes del '.'
                    e.stopEvent();
                if (value.length >= 19)// Para que escriba solo 19 caracteres
                    e.stopEvent();
                if ((e.getKey() == 13) && (tf.getValue())) {
                    tacomentario.focus(false, 100);// darle foco  a fecha
                }
            }
        }
    }
});

var tfcuentabancaria = new Ext.form.TextField({
    fieldLabel: perfil.etiquetas.lbtextC,
    disabledClass: 'disabled-component',
    name: 'tfcuentabancaria',
    id: 'tfcuentabancaria',
    disabled: true,
    readOnly: true,
    allowBlank: false,
    blankText: perfil.etiquetas.lbMsgReq,
    anchor: '100%'
});

var tfnroestadocuenta = new Ext.form.TextField({
    fieldLabel: perfil.etiquetas.lbCamNoestadocta,
    name: 'nroestadocuentadifdebito',
    id: 'nroestadocuentadifdebito',
    disabledClass: 'disabled-component',
    msgTarget: 'qtip',
    maskRe: /^([0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1]+?[0-9]*)+$/,
    regex: /^([0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1]+?[0-9]*)+$/,
    regexText: perfil.etiquetas.regexText16,
    maxLength: 16,
    maxLengthText: perfil.etiquetas.maxLengthText16,
    allowBlank: false,
    blankText: perfil.etiquetas.lbMsgReq,
    anchor: '100%',
    enableKeyEvents: true,
    listeners: {
        keypress: function(tf, e) {
            if (e.getKey() != 8 && e.getKey() != 46) // Para que permita borrar
            {
                var value = new String(tf.getValue());
                if (value.length >= 16)
                    e.stopEvent();  // Para que no escriba m�s de 16 caracteres 
            }
            if ((e.getKey() == 13) && (tf.getValue())) {
                tfdiferencia.focus(false, 100);// darle foco  a fecha 
            }
        }
    }
});

var tacomentario = new Ext.form.TextArea({
    fieldLabel: perfil.etiquetas.lbtextComentario,
    name: 'comentarioadicdifdebito',
    id: 'comentarioadicdifdebito',
    disabledClass: 'disabled-component',
    msgTarget: 'qtip',
    maskRe: /^([a-zA-Z0-9 \xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\/\-\_\+\(\)\#\;\,\:\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]*)+$/, // xf3-ó, ñ, á, é, í, ú, Ñ, xfc-ü   Espacios y caracteres especiales
    regex: /^([a-zA-Z0-9 \xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\/\-\_\+\(\)\#\;\,\:\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]*)+$/, // xf3-ó, ñ, á, é, í, ú, Ñ, xfc-ü   Espacios y caracteres especiales
    //regex: /^([a-zA-Z0-9 \xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\/\-\_\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]*)+$/,  // xf3-ó, ñ, á, é, í, ú, Ñ, xfc-ü  Espacios y caracteres especiales
    maxLength: 255,
    regexText: perfil.etiquetas.regexText,
    maxLengthText: perfil.etiquetas.maxLengthText255,
    allowBlank: false,
    blankText: perfil.etiquetas.lbMsgReq,
    anchor: '100%',
    enableKeyEvents: true,
    listeners: {
        keypress: function(tf, event) {
            var key = event.getKey();
            if (key == event.ENTER)
                event.stopEvent();  // Para que no escriba ENTER
            if ((event.getKey() == 13) && (tacomentario.getValue())) {
                probar();
            }
        }
    }
});

var iddiferencia = new Ext.form.Hidden({
    name: 'iddiferencia',
    id: 'iddiferencia'
});

var fpdebitocred = new Ext.FormPanel({
    labelAlign: 'top',
    frame: true,
    border: true,
    layout: 'form',
    autoHeight: true,
    modal: true,
    plain: true,
    trackResetOnLoad: true,
    bodyStyle: 'padding:10px 10px 10px 10px',
    anchor: '100%',
    items: [{
            layout: 'column',
            items: [{/*
             layout: 'form',	
             columnWidth:.5,													
             items: [tfnroestadocuenta]
             
             },{*/
                    layout: 'form',
                    columnWidth: 1,
                    items: [tfcuentabancaria]
                }]
        }, {
            layout: 'column',
            items: [{
                    layout: 'form',
                    //style : 'margin:0 0 0 5',
                    columnWidth: .3,
                    items: [tfnroestadocuenta]

                }, {
                    layout: 'form',
                    style: 'margin:0 0 0 10',
                    columnWidth: .35,
                    items: [tfdiferencia]
                }, {
                    layout: 'form',
                    columnWidth: .35,
                    style: 'margin:0 0 0 10',
                    items: [tfdiferenciacontable]
                }, iddiferencia]
        }, {
            layout: 'form',
            columnWidth: 1,
            items: [tacomentario]
        }]
});

var winDebitoCred = new Ext.Window({
    modal: true,
    resizable: true,
    closeAction: 'hide',
    layout: 'fit',
    autoHeight: true,
    width: 600,
    height: 300,
    items: [fpdebitocred],
    buttons: [{
//            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            text: perfil.etiquetas.lbBtnCancelar,
            tooltip: perfil.etiquetas.lbBtnTooltipCancelar,
            handler: function() {
                modificar = false;
                winDebitoCred.hide();
                fpdebitocred.getForm().reset();
            }
        }, {
//            icon: perfil.dirImg + 'aplicar.png',
            iconCls: 'aplicar',
            id:'winDebitoCredAplicar',
            text: perfil.etiquetas.lbBtnAplicar,
            tooltip: perfil.etiquetas.lbBtnTooltipAplicar,
            handler: function() {
                probar(true);
            }
        }, {
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            text: perfil.etiquetas.lbBtnAceptar,
            tooltip: perfil.etiquetas.lbBtnTooltipAceptar,
            handler: function() {
                probar();
            }
        }]
});


function probar(apli) {
    var flag = true;
    if (tfdiferencia.getValue() == 0.00 || tfdiferenciacontable.getValue() == 0.00)
        flag = false;
    if (fpdebitocred.getForm().isValid() && verificaDecimales(tfdiferencia) && verificaDecimales(tfdiferenciacontable) && flag) {
        if (gridlibro == 1) {
            newRecord = new reclibrouno({
                nroestado: tfnroestadocuenta.getValue(),
                iddiferencia: 0,
                diferenciamo: tfdiferencia.getValue(),
                diferenciamocontable: tfdiferenciacontable.getValue(),
                comentario: tacomentario.getValue()
            });
            if (modificar == true) {
                index = stlibrouno.indexOf(smlibrouno.getSelected());
                stlibrouno.remove(smlibrouno.getSelected());
                newRecord.set('iddiferencia', iddiferencia.getValue());
                stlibrouno.insert(index, newRecord);
            }
            else
                stlibrouno.add(newRecord);
        }
        else {
            newRecord = new reclibrodos({
                nroestado: tfnroestadocuenta.getValue(),
                iddiferencia: 0,
                diferenciamo: tfdiferencia.getValue(),
                diferenciamocontable: tfdiferenciacontable.getValue(),
                comentario: tacomentario.getValue()
            });
            if (modificar == true) {
                index = stlibrodos.indexOf(smlibrodos.getSelected());
                stlibrodos.remove(smlibrodos.getSelected());
                newRecord.set('iddiferencia', iddiferencia.getValue());
                stlibrodos.insert(index, newRecord);
            }
            else
                stlibrodos.add(newRecord);
        }
        modificar = false;
        if (!apli) {
            winDebitoCred.hide();
        }
        fpdebitocred.getForm().reset();
        CalcularSaldos();
    } else {
        mostrarMensaje(1, perfil.etiquetas.lbMsgDIncorr);
        if (tfdiferencia.getValue() == '0.00')
            tfdiferencia.markInvalid(perfil.etiquetas.lbMsgInvalidIO);
        if (tfdiferenciacontable.getValue() == '0.00')
            tfdiferenciacontable.markInvalid(perfil.etiquetas.lbMsgInvalidIC);
    }
}


/*************Adicionar instrumento por depositar o en transito***************/
var sttipoinstrumento = new Ext.data.Store({
    url: 'cargartipoDocumento',
    reader: new Ext.data.JsonReader({
        root: 'datos',
        id: 'iddoc',
        totalProperty: 'cant'
    },
    [
        {
            name: 'iddoc',
            type: 'string'
        },
        {
            name: 'iddocumentos',
            type: 'string'
        },
        {
            name: 'denominacion'
        }
    ])
});

var cbxtipoinstrumento = new Ext.form.ComboBox({
    fieldLabel: perfil.etiquetas.lbtextTipodoc,
    mode: 'local',
    name: 'iddocumentos',
    hiddenName: 'iddoc',
    emptyText: perfil.etiquetas.lbEmptyMsg,
    store: sttipoinstrumento,
    valueField: 'iddoc',
    displayField: 'denominacion',
    forceSelection: true,
    editable: true,
    resizable: true,
    //typeAhead: true,
    msgTarget: 'qtip',
    /*maskRe : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n�meros y espacios
     regex : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, 
     regexText : 'Este campo solo permite letras y n&uacute;meros.',*/
    allowBlank: false,
    blankText: perfil.etiquetas.lbMsgReq,
    anchor: '100%',
    triggerAction: 'all',
    enableKeyEvents: true,
    listeners: {
        keypress: function(t, e) {
            if (e.getKey() == 13) {
                if (!cbxtipoinstrumento.getValue()) {
                    cbxtipoinstrumento.setValue(sttipoinstrumento.getAt(0).get('iddoc'));
                }
                if ((cbxtipoinstrumento.getValue()) && (cbxtipoinstrumento.isValid())) {
                    tfnroinstrumento.focus(false, 100);// darle foco  a fecha 
                }
            }
        }
    }

});

var tfnroinstrumento = new Ext.form.TextField({
    fieldLabel: perfil.etiquetas.lbCamNodoc,
    name: 'nroinstrumento',
    id: 'nroinstrumento',
    disabledClass: 'disabled-component',
    msgTarget: 'qtip',
    maskRe: /^([0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9]*)+$/,
    regex: /^([0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9]*)+$/,
    regexText: perfil.etiquetas.regexText16,
    maxLength: 16,
    maxLengthText: perfil.etiquetas.maxLengthText16,
    allowBlank: false,
    blankText: perfil.etiquetas.lbMsgReq,
    width: '100%',
    enableKeyEvents: true,
    listeners: {
        keypress: function(tf, e) {
            if (e.getKey() != 8 && e.getKey() != 46) // Para que permita borrar
            {
                var value = new String(tf.getValue());
                if (value.length >= 16)
                    e.stopEvent();  // Para que no escriba m�s de 16 caracteres
            }
            if (e.getKey() == 13) {
                if (tfnroinstrumento.getValue()) {
                    dffecharecepcion.focus(false, 100);// darle foco  a fecha 
                }
            }
        }
    }
});

var tfnrosolicitud = new Ext.form.TextField({
    fieldLabel: perfil.etiquetas.lbtextNoSolicitud,
    name: 'nrosolicitud',
    id: 'nrosolicitud',
    disabledClass: 'disabled-component',
    msgTarget: 'qtip',
    maskRe: /^([0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9]*)+$/,
    regex: /^([0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9]*)+$/,
    regexText: perfil.etiquetas.regexText16,
    maxLength: 16,
    maxLengthText: perfil.etiquetas.maxLengthText16,
    allowBlank: true,
    blankText: perfil.etiquetas.lbMsgReq,
    width: '100%',
    enableKeyEvents: true,
    listeners: {
        keypress: function(tf, e) {
            if (e.getKey() != 8 && e.getKey() != 46) // Para que permita borrar
            {
                var value = new String(tf.getValue());
                if (value.length >= 16)
                    e.stopEvent();  // Para que no escriba m�s de 16 caracteres
            }
            if ((e.getKey() == 13) && (tf.getValue())) {
                tfimporteinst.focus(false, 100);// darle foco  a este campo 
            }
        }

    }

});

var dffecharecepcion = new Ext.form.DateField({
    fieldLabel: perfil.etiquetas.lbtextFRecepcion,
    readOnly: true,
    msgTarget: 'qtip',
    allowBlank: false,
    blankText: perfil.etiquetas.lbMsgReq,
    format: 'd/m/Y',
    name: 'fecharecepcion',
    id: 'fecharecepcion',
    anchor: '100%',
    enableKeyEvents: true,
    listeners: {
        keypress: function(tf, event) {
            if (event.getKey() == 13) {
                var date = dffecharecepcion.minValue;
                if (!dffecharecepcion.getValue()) {
                    dffecharecepcion.setValue(date);
                }
                if (dffecharecepcion.getValue()) {
                    tfnrosolicitud.focus(false, 100);//para darle foco a este campo
                }

            }
        }
    }
});

var tfimporteinst = new Ext.form.TextField({
    fieldLabel: perfil.etiquetas.lbtextImpOriginal,
    style: 'text-align: right',
    name: 'tfimporteinst',
    id: 'tfimporteinst',
    msgTarget: 'qtip',
    disabledClass: 'disabled-component',
    allowBlank: false,
    blankText: perfil.etiquetas.lbMsgReq,
    width: '100%',
    maxLength: 19,
    maxLengthText: perfil.etiquetas.maxLengthText19,
    maskRe: /^([0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
    regex: /^([0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
    regexText: perfil.etiquetas.regexText19,
    allowNegative: false,
    allowDecimals: true,
    enableKeyEvents: true,
    selectOnFocus: true,
    listeners: {
        keyup: function(tf, e) {
            if (tf.isValid())
                tfimporteletras.setValue(convertir_a_letras(tfimporteinst.getValue()));
            else
                tfimporteletras.setValue('');
        },
        blur: function(tf) {
            if (tf.isValid())
                tfimporteinst.setRawValue(saldo(tfimporteinst.getValue()));
            else
                tfimporteletras.setValue('');
        },
        keypress: function(tf, e) { // Para dejar solo 2 decimales
            if (e.getKey() != 8) //
            {
                var value = new String(tf.getValue());
                var position = value.indexOf(".", 0);
                if (position > -1 && (e.getKey() == 37 || e.getKey() == 39))// Para que no permita desplazarse hacia izq o der
                    e.stopEvent();
                if (position > -1 && e.getKey() == 46)// Para que solo permita un punto
                    e.stopEvent();
                if (position > -1 && (value.length - position) > 2)// Para que solo permita 2 lugares decimales
                    e.stopEvent();
                if (position == -1 && value.length >= 16 && e.getKey() != 46)// Para que escriba solo 16 caracteres antes del '.'
                    e.stopEvent();
                if (value.length >= 19)// Para que escriba solo 19 caracteres
                    e.stopEvent();
                if ((e.getKey() == 13) && (tf.getValue())) {
                    tfimporteinstcont.focus(false, 100);// darle foco  a este campo 
                }
            }
        }
    }
});

var tfimporteinstcont = new Ext.form.TextField({
    fieldLabel: perfil.etiquetas.lbtextImpContable,
    style: 'text-align: right',
    name: 'tfimporteinstcont',
    id: 'tfimporteinstcont',
    disabledClass: 'disabled-component',
    msgTarget: 'qtip',
    allowBlank: false,
    blankText: perfil.etiquetas.lbMsgReq,
    width: '100%',
    maxLength: 19,
    maxLengthText: perfil.etiquetas.maxLengthText19,
    maskRe: /^([0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
    regex: /^([0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
    regexText: perfil.etiquetas.regexText19,
    allowNegative: false,
    allowDecimals: true,
    enableKeyEvents: true,
    selectOnFocus: true,
    listeners: {
        keyup: function(tf, e) {
            if (tf.isValid())
                tfimporteletrascont.setValue(convertir_a_letras(tfimporteinstcont.getValue()));
            else
                tfimporteletrascont.setValue('');
        },
        blur: function(tf) {
            if (tf.isValid())
                tfimporteinstcont.setRawValue(saldo(tfimporteinstcont.getValue()));
            else
                tfimporteletrascont.setValue('');
        },
        keypress: function(tf, e) { // Para dejar solo 2 decimales
            if (e.getKey() != 8) //
            {
                var value = new String(tf.getValue());
                var position = value.indexOf(".", 0);
                if (position > -1 && (e.getKey() == 37 || e.getKey() == 39)) {// Para que no permita desplazarse hacia izq o der
                    e.stopEvent();
                }
                if (position > -1 && e.getKey() == 46) {// Para que solo permita un punto
                    e.stopEvent();
                }
                if (position > -1 && (value.length - position) > 2) {// Para que solo permita 2 lugares decimales
                    e.stopEvent();
                }
                if (position == -1 && value.length >= 16 && e.getKey() != 46) {// Para que escriba solo 16 caracteres antes del '.'
                    e.stopEvent();
                }
                if (value.length >= 19) {// Para que escriba solo 19 caracteres
                    e.stopEvent();
                }
                if ((e.getKey() == 13) && (tf.getValue())) {
                    cbxbeneficiario.focus(false, 100);// darle foco  a este campo 
                }
            }
        }
    }
});

var tfimporteletras = new Ext.form.TextField({
    fieldLabel: perfil.etiquetas.lbtextImpLetras,
    disabledClass: 'disabled-component',
    name: 'importeletras',
    id: 'importeletras',
    disabledClass:'disabled-component',
            msgTarget: 'qtip',
    allowBlank: false,
    blankText: perfil.etiquetas.lbMsgReq,
    readOnly: true,
    disabled: true,
    anchor: '100%'
});

var tfimporteletrascont = new Ext.form.TextField({
    fieldLabel: perfil.etiquetas.lbtextImpLetras,
    disabledClass: 'disabled-component',
    name: 'importeletrascont',
    id: 'importeletrascont',
    msgTarget: 'qtip',
    allowBlank: false,
    blankText: perfil.etiquetas.lbMsgReq,
    readOnly: true,
    disabled: true,
    anchor: '100%'
});

var tacomentarioinst = new Ext.form.TextArea({
    fieldLabel: perfil.etiquetas.lbtextComentario,
    name: 'comentarioinstxdepositar',
    id: 'comentarioinstxdepositar',
    disabledClass: 'disabled-component',
    msgTarget: 'qtip',
    maskRe: /^([a-zA-Z0-9 \xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\/\-\_\+\(\)\#\;\,\:\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]*)+$/, // xf3-ó, ñ, á, é, í, ú, Ñ, xfc-ü   Espacios y caracteres especiales
    regex: /^([a-zA-Z0-9 \xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\/\-\_\+\(\)\#\;\,\:\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]*)+$/, // xf3-ó, ñ, á, é, í, ú, Ñ, xfc-ü   Espacios y caracteres especiales
    //regex: /^([a-zA-Z0-9 \xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\/\-\_\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]*)+$/,  // xf3-ó, ñ, á, é, í, ú, Ñ, xfc-ü  Espacios y caracteres especiales

    regexText: perfil.etiquetas.regexText,
    maxLength: 255,
    maxLengthText: perfil.etiquetas.maxLengthText255,
    allowBlank: false,
    blankText: perfil.etiquetas.lbMsgReq,
    anchor: '100%',
    enableKeyEvents: true,
    listeners: {
        keypress: function(tf, event) {
            var key = event.getKey();
            if (key == event.ENTER)
                event.stopEvent();  // Para que no escriba ENTER
        }
    }
});

stbeneficiario = new Ext.data.Store({
    //reader: new Ext.data.JsonReader({
    id: 'stbeneficiario',
    reader: new Ext.data.DataReader({
        id: 'rdbeneficiario'
    },
    [{
            name: 'id',
            type: 'string'
        },
        {
            name: 'tipo'
        },
        {
            name: 'denominacion'
        }
    ])
});

cbxbeneficiario = new Ext.form.ComboBox({
    fieldLabel: perfil.etiquetas.lbtextBeneficiario,
    mode: 'local',
    name: 'cbxbeneficiario',
    id: 'cbxbeneficiario',
    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>', // Paramostrar los datos como detalle
    resizable: true,
    hideTrigger: true,
    selectOnFocus: true,
    valueField: 'id',
    displayField: 'denominacion',
    hiddenName: 'id',
    emptyText: perfil.etiquetas.lbEmptyMsg,
    store: stbeneficiario,
    forceSelection: false,
    editable: false,
    //typeAhead: true,
    msgTarget: 'qtip',
    allowBlank: false,
    blankText: perfil.etiquetas.lbMsgReq,
    anchor: '100%',
    triggerAction: 'all',
    enableKeyEvents: true,
    listeners: {
        keypress: function(t, e) {
            if ((e.getKey() == 8) || (e.getKey() == 46)) {// Limpiar el combo
                cbxbeneficiario.clearValue();
            }
            if (e.getKey() == 13) {// Buscar con enter
                if (!cbxbeneficiario.getValue()) {
                    buscargenerico(stbeneficiario, cbxbeneficiario, 1);
                }
                if (cbxbeneficiario.getValue()) {
                    cbxentregadoa.focus(false, 100);// darle foco  a este campo 
                }
            }
        }
    }
});

var btnbeneficiario = new Ext.Button({
    disabled: false,
    id: 'btnbeneficiario',
    tooltip: perfil.etiquetas.lbBtnBuscartooltB,
    text: perfil.etiquetas.lbBtnBuscar,
//    icon: perfil.dirImg + 'buscar.png',
    iconCls: 'buscar',
    //anchor: '100%',
    handler: function() {
        //Buscar Beneficiario
        buscargenerico(stbeneficiario, cbxbeneficiario, 1);
    }
});

stentregadoa = new Ext.data.Store({
    //reader: new Ext.data.JsonReader({
    id: 'stentregadoa',
    reader: new Ext.data.DataReader({
        id: 'rdentregadoa'
    },
    [{
            name: 'id',
            type: 'string'
        },
        {
            name: 'tipo'
        },
        {
            name: 'denominacion'
        }
    ])
});


cbxentregadoa = new Ext.form.ComboBox({
    fieldLabel: perfil.etiquetas.lbtextRecibido,
    mode: 'local',
    name: 'cbxentregadoa',
    id: 'cbxentregadoa',
    emptyText: perfil.etiquetas.lbEmptyMsg,
    store: stentregadoa,
    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>', // Paramostrar los datos como detalle
    resizable: true,
    hideTrigger: true,
    editable: false,
    selectOnFocus: true,
    valueField: 'id',
    displayField: 'denominacion',
    hiddenName: 'id',
    forceSelection: false,
    //typeAhead: false,
    msgTarget: 'qtip',
    allowBlank: true,
    blankText: perfil.etiquetas.lbMsgReq,
    anchor: '100%',
    triggerAction: 'all',
    enableKeyEvents: true,
    listeners: {
        keypress: function(t, e) {
            if ((e.getKey() == 8) || (e.getKey() == 46)) {// Limpiar el combo
                cbxentregadoa.clearValue();
            } else {
                if (e.getKey() == 13) {// Buscar con enter
                    if (!cbxentregadoa.getValue()) {
                        buscargenerico(stentregadoa, cbxentregadoa, 1);
                    }
                }
            }
        }
    }
});

var btnentregadoa = new Ext.Button({
    disabled: false,
    id: 'btnentregadoa',
    tooltip: perfil.etiquetas.lbtextRecibido,
    text: perfil.etiquetas.lbBtnBuscar,
    //anchor: '100%',
//    icon: perfil.dirImg + 'buscar.png',
    iconCls: 'buscar',
    handler: function() {
        buscargenerico(stentregadoa, cbxentregadoa, 1);
    }
});

var panelcomboxcuenta = new Ext.Panel({
    layout: 'fit',
    items: [{
            items: [{
                    labelAlign: 'top',
                    autoHeight: true,
                    layout: 'column',
                    items: [{
                            style: 'margin:0 0 0 5',
                            layout: 'form',
                            columnWidth: .33,
                            items: [tfnroinstrumento]
                        }, {
                            style: 'margin:0 0 0 5',
                            layout: 'form',
                            columnWidth: .33,
                            items: [dffecharecepcion]
                        }, {
                            style: 'margin:0 0 0 5',
                            layout: 'form',
                            columnWidth: .34,
                            items: [tfnrosolicitud]
                        }]
                }]
        }]
});

var boton = new Ext.Panel({
    layout: 'fit',
    items: [{
            items: [{
                    labelAlign: 'top',
                    autoHeight: true,
                    layout: 'column',
                    items: [{
                            style: 'margin:26 0 0 0',
                            layout: 'form',
                            columnWidth: .99,
                            items: [btnentregadoa]
                        }]
                }]
        }]
});

//Panel q agrupa Beneficiaro/Botón, Recibido por/Botón, Especialidad
var beneficiariopnel = new Ext.Panel({
    layout: 'form',
    items: [{
            items: [{
                    labelAlign: 'top',
                    autoHeight: true,
                    layout: 'column',
                    items: [{
                            style: 'margin:0 0 0 0',
                            layout: 'form',
                            columnWidth: .87,
                            items: [cbxbeneficiario, cbxentregadoa, ]
                        }, {
                            style: 'margin:18 0 0 20',
                            layout: 'form',
                            columnWidth: .13,
                            items: [btnbeneficiario, boton]
                        }]
                }, {
                    layout: 'form',
                    columnWidth: 1,
                    items: [comboIframe1]
                }
            ]
        }]
});

var idinstrumentobancario = new Ext.form.Hidden({
    name: 'idinstrumentobancario',
    id: 'idinstrumentobancario'
});
var fpInstTrans = new Ext.FormPanel({
    labelAlign: 'top',
    frame: true,
    border: true,
    layout: 'form',
    autoHeight: true,
    modal: true,
    plain: true,
    bodyStyle: 'padding:10px 10px 0px 10px',
    items: [{
            items: [{
                    labelAlign: 'top',
                    layout: 'column',
                    items: [{
                            labelAlign: 'top',
                            layout: 'form',
                            columnWidth: .30,
                            items: [{
                                    items: [{
                                            layout: 'form',
                                            items: [cbxtipoinstrumento]
                                        }, {
                                            layout: 'form',
                                            items: [tfimporteinst]
                                        }/*, {
                                            layout: 'form',
                                            items: [tfimporteinstcont]
                                        }*/]
                                }]
                        }, {
                            layout: 'form',
                            columnWidth: .70,
                            items: [{
                                    items: [{
                                            autoHeight: true,
                                            items: [{
                                                    labelAlign: 'top',
                                                    layout: 'column',
                                                    items: [{
                                                            style: 'margin:0 0 0 10',
                                                            layout: 'form',
                                                            columnWidth: .3,
                                                            items: [tfnroinstrumento]
                                                        }, {
                                                            style: 'margin:0 0 0 10',
                                                            layout: 'form',
                                                            columnWidth: .35,
                                                            items: [dffecharecepcion]
                                                        }, {
                                                            style: 'margin:0 0 0 10',
                                                            layout: 'form',
                                                            columnWidth: .35,
                                                            items: [tfnrosolicitud]
                                                        }]
                                                }]
                                        }, {
                                            layout: 'form',
                                            style: 'margin:0 0 0 10',
                                            columnWidth: 1,
                                            items: [tfimporteletras]
                                        }/*, {
                                            layout: 'form',
                                            style: 'margin:0 0 0 10',
                                            columnWidth: 1,
                                            items: [tfimporteletrascont]
                                        }*/]
                                }]
                        }]
                }, {
                    layout: 'form',
                    autoHeight: true,
                    columnWidth: 1,
                    items: [beneficiariopnel]
                }, {
                    layout: 'form',
                    autoHeight: true,
                    columnWidth: 1,
                    items: [tacomentarioinst]
                }
            ]
        }
    ]

});


var aplicarmodinst = new Ext.Button({
//    icon: perfil.dirImg + 'aplicar.png',
    iconCls: 'aplicar',
    text: perfil.etiquetas.lbBtnAplicar,
    tooltip: perfil.etiquetas.lbBtnTooltipAplicar,
    handler: function() {
        cbxbeneficiario.isValid(false);
        cbxentregadoa.isValid(false);
        var flag = true;
        if ((tfimporteinst.getValue() == 0.00) || (tfimporteinstcont.getValue() == 0.00))
            flag = false;
        if (fpInstTrans.getForm().isValid() && cbxbeneficiario.getRawValue() /*&& cbxentregadoa.getRawValue()*/ && verificaDecimales(tfimporteinst) && verificaDecimales(tfimporteinstcont) && flag) {
            if (gridbanco == 1) {
                newRecord = new recbancouno({
                    numerodocumento: tfnroinstrumento.getValue(),
                    idinstrumentobancario: 0,
                    fecharecepcion: dffecharecepcion.getValue().format('d/m/Y'),
                    importemo: tfimporteinst.getValue(),
                    importemb: tfimporteinstcont.getValue(),
                    denominacion: cbxtipoinstrumento.getRawValue(),
                    comentario: tacomentarioinst.getValue(),
                    idtipodocumento: cbxtipoinstrumento.getValue(),
                    idbeneficiario: cbxbeneficiario.getValue(),
                    beneficiario: cbxbeneficiario.getRawValue(),
                    tipob: stbeneficiario.getAt(0).get('tipo'), // Persona Ext, Cliente, Proveed, etc
                    idrecibe: cbxentregadoa.getValue(),
                    recibe: cbxentregadoa.getRawValue(),
                    tipor: (cbxentregadoa.getValue()) ? stentregadoa.getAt(0).get('tipo') : '', // Persona Ext, Cliente, Proveed, etc
                    idsolicitud: tfnrosolicitud.getValue(),
                    idespecialidad: idespecialidad,
                    descripcionespecialidad: comboIframe1.getRawValue()
                });
                if (modificar == true) {
                    index = stbancouno.indexOf(smbancouno.getSelected());
                    stbancouno.remove(smbancouno.getSelected());
                    newRecord.set('idinstrumentobancario', idinstrumentobancario.getValue());
                    stbancouno.insert(index, newRecord);
                    smbancouno.selectRow(index);
                }
                else {
                    stbancouno.add(newRecord);
                    fpInstTrans.getForm().reset();
                }
            }
            else {
                newRecord = new recbancodos({
                    numerodocumento: tfnroinstrumento.getValue(),
                    idinstrumentobancario: 0,
                    fecharecepcion: dffecharecepcion.getValue().format('d/m/Y'),
                    importemo: tfimporteinst.getValue(),
                    importemb: tfimporteinstcont.getValue(),
                    denominacion: cbxtipoinstrumento.getRawValue(),
                    comentario: tacomentarioinst.getValue(),
                    idtipodocumento: cbxtipoinstrumento.getValue(),
                    idbeneficiario: cbxbeneficiario.getValue(),
                    beneficiario: cbxbeneficiario.getRawValue(),
                    tipob: stbeneficiario.getAt(0).get('tipo'), // Persona Ext, Cliente, Proveed, etc
                    idrecibe: cbxentregadoa.getValue(),
                    recibe: cbxentregadoa.getRawValue(),
                    tipor: (cbxentregadoa.getValue()) ? stentregadoa.getAt(0).get('tipo') : '', // Persona Ext, Cliente, Proveed, etc
                    idsolicitud: tfnrosolicitud.getValue(),
                    idespecialidad: idespecialidad,
                    descripcionespecialidad: comboIframe1.getRawValue()
                });
                if (modificar == true) {
                    index = stbancodos.indexOf(smbancodos.getSelected());
                    stbancodos.remove(smbancodos.getSelected());
                    newRecord.set('idinstrumentobancario', idinstrumentobancario.getValue());
                    stbancodos.insert(index, newRecord);
                    smbancodos.selectRow(index);
                }
                else {
                    stbancodos.add(newRecord);
                    fpInstTrans.getForm().reset();
                }
            }
            CalcularSaldos();
        } else {
            mostrarMensaje(1, pefil.etiquetas.lbMsgDIncorr);
            if (tfimporteinst.getValue() == '0.00')
                tfimporteinst.markInvalid(pefil.etiquetas.lbMsgInvalidIO);
            if (tfimporteinstcont.getValue() == '0.00')
                tfimporteinstcont.markInvalid(pefil.etiquetas.lbMsgInvalidIC);
        }
    }
});

var winInstTrans = new Ext.Window({
    modal: true,
    resizable: true,
    closeAction: 'hide',
    layout: 'fit',
    autoHeight: true,
    plain: true,
    width: 780,
    height: 300,
    items: [fpInstTrans],
    buttons: [{
//            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            text: perfil.etiquetas.lbBtnCancelar,
            tooltip: perfil.etiquetas.lbBtnTooltipCancelar,
            handler: function() {
                modificar = false;
                winInstTrans.hide();
                fpInstTrans.getForm().reset();
            }
        },
        aplicarmodinst,
        {
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            text: perfil.etiquetas.lbBtnAceptar,
            tooltip: perfil.etiquetas.lbBtnTooltipAceptar,
            handler: function() {
                cbxbeneficiario.isValid(false);
                cbxentregadoa.isValid(false);
                var flag = true;
                if ((tfimporteinst.getValue() == 0.00) || (tfimporteinstcont.getValue() == 0.00))
                    flag = false;
                if (fpInstTrans.getForm().isValid() && cbxbeneficiario.getValue() /*&& cbxentregadoa.getValue()*/ && verificaDecimales(tfimporteinst) && verificaDecimales(tfimporteinstcont) && flag) {
                    if (gridbanco == 1) {
                        newRecord = new recbancouno({
                            numerodocumento: tfnroinstrumento.getValue(),
                            idinstrumentobancario: 0,
                            fecharecepcion: dffecharecepcion.getValue().format('d/m/Y'),
                            importemo: tfimporteinst.getValue(),
                            importemb: tfimporteinstcont.getValue(),
                            denominacion: cbxtipoinstrumento.getRawValue(),
                            comentario: tacomentarioinst.getValue(),
                            idtipodocumento: cbxtipoinstrumento.getValue(),
                            idbeneficiario: cbxbeneficiario.getValue(),
                            beneficiario: cbxbeneficiario.getRawValue(),
                            tipob: stbeneficiario.getAt(0).get('tipo'), // Persona Ext, Cliente, Proveed, etc
                            idrecibe: cbxentregadoa.getValue(),
                            recibe: cbxentregadoa.getRawValue(),
                            tipor: (cbxentregadoa.getValue()) ? stentregadoa.getAt(0).get('tipo') : '', // Persona Ext, Cliente, Proveed, etc
                            idsolicitud: tfnrosolicitud.getValue(),
                            idespecialidad: idespecialidad,
                            descripcionespecialidad: comboIframe1.getRawValue()
                        });
                        if (modificar == true) {
                            index = stbancouno.indexOf(smbancouno.getSelected());
                            stbancouno.remove(smbancouno.getSelected());
                            newRecord.set('idinstrumentobancario', idinstrumentobancario.getValue());
                            stbancouno.insert(index, newRecord);
                        }
                        else
                            stbancouno.add(newRecord);
                    }
                    else {
                        newRecord = new recbancodos({
                            numerodocumento: tfnroinstrumento.getValue(),
                            idinstrumentobancario: 0,
                            fecharecepcion: dffecharecepcion.getValue().format('d/m/Y'),
                            importemo: tfimporteinst.getValue(),
                            importemb: tfimporteinstcont.getValue(),
                            denominacion: cbxtipoinstrumento.getRawValue(),
                            comentario: tacomentarioinst.getValue(),
                            idtipodocumento: cbxtipoinstrumento.getValue(),
                            idbeneficiario: cbxbeneficiario.getValue(),
                            beneficiario: cbxbeneficiario.getRawValue(),
                            tipob: stbeneficiario.getAt(0).get('tipo'), // Persona Ext, Cliente, Proveed, etc
                            idrecibe: cbxentregadoa.getValue(),
                            recibe: cbxentregadoa.getRawValue(),
                            tipor: (cbxentregadoa.getValue()) ? stentregadoa.getAt(0).get('tipo') : '', // Persona Ext, Cliente, Proveed, etc
                            idsolicitud: tfnrosolicitud.getValue(),
                            idespecialidad: idespecialidad,
                            descripcionespecialidad: comboIframe1.getRawValue()
                        });
                        if (modificar == true) {
                            index = stbancodos.indexOf(smbancodos.getSelected());
                            stbancodos.remove(smbancodos.getSelected());
                            newRecord.set('idinstrumentobancario', idinstrumentobancario.getValue());
                            stbancodos.insert(index, newRecord);
                        }
                        else
                            stbancodos.add(newRecord);
                    }
                    modificar = false;
                    winInstTrans.hide();
                    fpInstTrans.getForm().reset();
                    CalcularSaldos();
                } else {
                    mostrarMensaje(1, perfil.etiquetas.lbMsgDIncorr);
                    if (tfimporteinst.getValue() == '0.00')
                        tfimporteinst.markInvalid(perfil.etiquetas.lbMsgInvalidIO);
                    if (tfimporteinstcont.getValue() == '0.00')
                        tfimporteinstcont.markInvalid(perfil.etiquetas.lbMsgInvalidIO);
                }
            }
        }]
});