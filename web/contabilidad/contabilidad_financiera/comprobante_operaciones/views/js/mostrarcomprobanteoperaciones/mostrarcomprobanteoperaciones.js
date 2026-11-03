if (window.parent.parent.UCID.portal.perfil)
    var perfil = window.parent.parent.UCID.portal.perfil;
else
    perfil = {};
perfil.etiquetas = Object();
var windowParent, winReg;
if (window.idwiniframe)
    windowParent = window.parent.Ext.getCmp(window.idwiniframe);
var descripcion_co, fecha_co, numero_co;
function cargarInterfaz() {

    Ext.Ajax.request ({
        url: 'AbrirCo',
        params: {id: window.params.idcmp},
        callback: function(options, success, response) {
            descripcion_co = Ext.decode(response.responseText).des; // descripcion del comprobante
            fecha_co = Ext.decode(response.responseText).fecha; // fecha del comprobante
            numero_co = Ext.decode(response.responseText).numero; // numero del comprobante

            var tf_descripcion_co = new Ext.form.TextField ({
                fieldLabel: 'Descripci&oacute;n',
                id: 'tf_descripcion_co',
                readOnly: true,
                value: descripcion_co
            });

            var gridmostrarcomp = new Ext.grid.GridPanel ({
                cm: cm,
                sm: sm,
                frame: true,
                autoExpandColumn: 'cuenta',
                store: store,
                loadMask: {store: store},
                tbar: [
                    btnregistroanexo,
                    new Ext.Toolbar.TextItem("Descripci&oacute;n:&nbsp;&nbsp;" + descripcion_co + "&nbsp;"),
                    '->',
                    new Ext.Toolbar.TextItem("&nbsp;&nbsp;Fecha:&nbsp;&nbsp;" + fecha_co + "&nbsp;")
                ],
                listeners:
                {
                    'rowdblclick': function(Grid, rowIndex, e) {
                        if (sm.getSelected().data.anexo == '*') {
                            winForm('Reg');
                            storeGridR.removeAll();
                            storeGridR.load({params: {idpase: sm.getSelected().data.id, idcuenta: sm.getSelected().data.idcuenta}});
                        }
                    }
                },
                bbar: [
                    new Ext.Toolbar.TextItem("&nbsp;N&uacute;mero del comprobante:&nbsp;&nbsp;" + numero_co + "&nbsp;&nbsp;&nbsp;&nbsp;Estado:&nbsp;&nbsp;Asentado"),
                    '->',
                    new Ext.Toolbar.TextItem("Suma de control:&nbsp;&nbsp;"),
                    nfsumacdebe,
                    new Ext.Toolbar.TextItem("&nbsp;&nbsp;&nbsp;&nbsp;"),
                    nfsumachaber,
                    new Ext.Toolbar.TextItem("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"), ]
            });

            var vmostrar = new Ext.Viewport ({
                layout: 'fit',
                //renderTo : document.body,
                items: [gridmostrarcomp]
            });
        }
    });

//var btnprimarios = new Ext.Button({	disabled : false,	id : 'btnprimario',	icon : perfil.dirImg + 'modificar.png',	iconCls : 'btn',	tooltip : 'Documentos primarios',text:'Documentos primarios'});
//var btndebcred = new Ext.Button({	disabled : false,	id : 'btndebrecredi',	icon : perfil.dirImg + 'ver.png',	iconCls : 'btn',	tooltip : 'Desglose del d&eacute;bito/cr&eacute;dito',text:'Desglose del d&eacute;bito/cr&eacute;dito', handler:function(){} });
    var btnregistroanexo = new Ext.Button ({
        disabled: true,
        id: 'btnregistroanex',
        iconCls: 'abrirventana',
        tooltip: 'Registro anexo al pase',
        text: 'Registro anexo al pase',
        handler: function() {
            winForm('Reg');
            storeGridR.removeAll();
            storeGridR.load ({
                params: {
                    idpase: sm.getSelected().data.id,
                    idcuenta: sm.getSelected().data.idcuenta
                }
            });
        }
    });

    var nfsumacdebe = new Ext.form.TextField ({
        style: 'text-align:right',
        disabled: true,
        id: 'nfsumacdebe',
        allowNegative: false,
        enableKeyEvents: true,
        width: 110,
        emptyText: '0.00'
    });

    var nfsumachaber = new Ext.form.TextField ({
        style: 'text-align:right',
        disabled: true,
        id: 'nfsumachaber',
        allowNegative: false,
        enableKeyEvents: true,
        width: 110,
        emptyText: '0.00'
    });

    var sm = new Ext.grid.RowSelectionModel({singleSelect: true});
    var smr = new Ext.grid.RowSelectionModel({singleSelect: true});

// ******************************CM**********************************************************************
    var cm = new Ext.grid.ColumnModel ([
        {
            id: 'cuenta',
            header: "Cuenta",
            dataIndex: 'cuenta',
            width: 108
        }, {
            id: 'mon',
            header: "Moneda",
            dataIndex: 'mon',
            width: 108
        }, {
            id: 'deb',
            header: "D&eacute;bito",
            dataIndex: 'deb',
            width: 145,
            align: 'right'
        }, {
            id: 'cred',
            header: "Cr&eacute;dito",
            dataIndex: 'cred',
            width: 145,
            align: 'right'
        }, {
            id: 'anexo',
            header: "*",
            dataIndex: 'anexo',
            width: 25,
            align: 'center'
        }
    ]);

    var store = new Ext.data.Store({
        url: 'cargargridmov',
        reader: new Ext.data.JsonReader({
            id: 'sctrl'
        }, [{
                name: 'id', mapping: 'idpase'
            }, {
                name: 'idcuenta', mapping: 'idcuenta'
            }, {
                name: 'cuenta', mapping: 'cuenta'
            }, {
                name: 'mon', mapping: 'idmoneda'
            }, {
                name: 'deb', mapping: 'deb'
            }, {
                name: 'cred', mapping: 'cred'
            }, {
                name: 'anexo', mapping: 'anexo'
            }, {
                name: 'td', mapping: 'td'
            }, {
                name: 'th', mapping: 'th'
            }
        ])
    });

    var storeGridR = new Ext.data.Store({
        url: 'cargargridanexo',
        reader: new Ext.data.JsonReader({
            id: 'sctrl'
        }, [
            {
                name: 'id', mapping: 'id'
            }, {
                name: 'idcc', mapping: 'idcc'
            }, {
                name: 'idog', mapping: 'idog'
            }, {
                name: 'cc', mapping: 'cc'
            }, {
                name: 'og', mapping: 'og'
            }, {
                name: 'imp', mapping: 'imp'
            }
        ])
    });

    var gridregistroanexo = new Ext.grid.GridPanel({
        region: 'center',
        frame: true,
        iconCls: 'icon-grid',
        autoExpandColumn: 'cc',
        store: storeGridR,
        loadMask: {storeGridR: storeGridR},
        sm: smr,
        columns: [
            {
                id: 'cc',
                header: "Centro de costo",
                sortable: true,
                dataIndex: 'cc',
                width: 120
            }, {
                id: 'subelem',
                header: "SubElem",
                sortable: true,
                dataIndex: 'og',
                width: 120
            }, {
                id: 'importe',
                header: "Importe",
                align: 'right',
                sortable: true,
                dataIndex: 'imp',
                width: 120
            }
        ]
    });

    sm.on('beforerowselect', function(smodel, rowIndex, keepExisting, record) {
        btnregistroanexo.disable();
        if (record.data.anexo == '*')
            btnregistroanexo.enable();

    }, this);
    store.on('load', function(e, o) {
        nfsumacdebe.setValue(store.getAt(store.getCount() - 1).data.td);
        nfsumachaber.setValue(store.getAt(store.getCount() - 1).data.th);
    }, this);
    function winForm(opcion) {
        switch (opcion) {
            case 'Reg':
                {
                    if (!winReg) {
                        winReg = new Ext.Window({
                            modal: true,
                            closeAction: 'hide',
                            maximizable: true,
                            layout: 'fit',
                            constrain: true,
                            defaultButton: 0,
                            title: 'Registro anexo al pase', width: 500, height: 450
                        });
                    }
                    winReg.show();
                    winReg.add(gridregistroanexo);
                    winReg.doLayout();
                }
                break;
        }
    }

    if (window.params)
    {
        parametros = window.params;
        store.load({params: {idcmp: parametros.idcmp}});
    }

    if (windowParent)
        Ext.UCID.integraInterfaz(tpArbolEstructurae, windowParent);
}// Endof cargarInterfaz
cargarInterfaz();

function mostrarVAyuda()
{
    winayuda = new Ext.UCID.WinIframe({
        id: 'iframeayuda',
        idIframe: 'idWinIframeAyuda',
        url: 'abrirAyuda',
        maximized: true,
        modal: true,
        doAction: function() {
        }
    });
    winayuda.show();
    winayuda.doLayout();
}



