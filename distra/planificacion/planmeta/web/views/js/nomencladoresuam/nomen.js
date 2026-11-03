initaddnomenclador = function() {
    //********************NOMENCLADOR*********************************************************************
    tfdennomenclador = new Ext.form.TextField({
        id: 'tfdennomenclador',
        disabled: false,
        fieldLabel: 'Denominaci&oacute;n',
        xtype: 'textfield',
        anchor: '100%',
        maskRe: /^([a-zA-ZáéíóúñüÑ\-\ \:\/\,\_\-\.\d]+ ?[a-zA-ZáéíóúñüÑ\-\:\/\,\_\-\.\d]*)+$/
    });

    tadescrnomenclador = new Ext.form.TextArea({
        xtype: 'textarea',
        id: 'tadescrnomenclador',
        anchor: '100%',
        fieldLabel: 'Descripción'
    });

    //************panel de add nomenclador**************
    fpaddnomenclador = new Ext.FormPanel({
        labelWidth: 75,
        frame: true,
        autoHeight: true,
        labelAlign: 'top',
        items: [{
                layout: 'column',
                items: [{
                        layout: 'form',
                        columnWidth: 1,
                        items: tfdennomenclador
                    }]
            }, {
                layout: 'column',
                items: [{
                        layout: 'form',
                        columnWidth: 1,
                        items: tadescrnomenclador
                    }]
            }],
        id: 'fpaddnomenclador'
    });
    //************window de add nomenclador*********************
    winaddnomenclador = new Ext.Window({
        modal: true,
        id: 'winaddnomenclador',
        constrain: true,
        closeAction: 'hide',
        items: [fpaddnomenclador],
        width: 450,
        layout: 'fit',
        title: 'Adicionar nomenclador',
        buttons: [{
                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'btn',
                tooltip: 'Cancelar',
                text: 'Cancelar',
                handler: function() {
                    winaddnomenclador.hide();
                }
            }, {
                icon: perfil.dirImg + 'aplicar.png',
                iconCls: 'btn',
                id: 'btnaplicar',
                tooltip: 'Aplicar',
                text: 'Aplicar',
                handler: function() {
                }
            }, {
                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'btn',
                id: 'btnaceptar2',
                tooltip: 'Aceptar',
                text: 'Aceptar',
                handler: function() {
                }
            }]
    });
    //********************DATOS**********************************************************************
    tfadddatos = new Ext.form.TextField({
        id: 'tfadddatos',
        disabled: false,
        fieldLabel: 'Denominaci&oacute;n',
        xtype: 'textfield',
        anchor: '100%',
        maskRe: /^([a-zA-ZáéíóúñüÑ\-\ \:\/\,\_\-\.\d]+ ?[a-zA-ZáéíóúñüÑ\-\:\/\,\_\-\.\d]*)+$/
    });

    taadddatos = new Ext.form.TextArea({
        xtype: 'textarea',
        id: 'taadddatos',
        anchor: '100%',
        fieldLabel: 'Descripción'
    });
    //************panel de add datos**************
    fpadddatos = new Ext.FormPanel({
        labelWidth: 75,
        frame: true,
        autoHeight: true,
        labelAlign: 'top',
        items: [{
                layout: 'column',
                items: [{
                        layout: 'form',
                        columnWidth: 1,
                        items: tfadddatos
                    }]
            }, {
                layout: 'column',
                items: [{
                        layout: 'form',
                        columnWidth: 1,
                        items: taadddatos
                    }]
            }],
        id: 'fpadddatos'
    });
    //************window de add datos*********************
    winadddatos = new Ext.Window({
        modal: true,
        id: 'winadddatos',
        constrain: true,
        closeAction: 'hide',
        items: [fpadddatos],
        width: 450,
        layout: 'fit',
        title: 'Adicionar datos',
        buttons: [{
                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'btn',
                tooltip: 'Cancelar',
                text: 'Cancelar',
                handler: function() {
                    winadddatos.hide();
                }
            }, {
                icon: perfil.dirImg + 'aplicar.png',
                iconCls: 'btn',
                id: 'btnaplicar',
                tooltip: 'Aplicar',
                text: 'Aplicar',
                handler: function() {
                }
            }, {
                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'btn',
                id: 'btnaceptar2',
                tooltip: 'Aceptar',
                text: 'Aceptar',
                handler: function() {
                }
            }]
    });


}