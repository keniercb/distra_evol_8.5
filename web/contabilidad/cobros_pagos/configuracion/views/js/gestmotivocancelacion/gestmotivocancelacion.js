
Ext.QuickTips.init();
var perfil = window.parent.perfil;
UCID.portal.perfil = window.parent.perfil;
perfil.etiquetas = Object();
UCID.portal.cargarAcciones(window.parent.idFuncionalidad);

Ext.Ajax.request({
    method: "POST",
    url: "cargaretiquetas",
    callback: function(options, success, response)
    {
        var etiquetas = Ext.decode(response.responseText);
        cargarInterfaz(etiquetas);
    }
});
function cargarInterfaz(etiquetas) {
	var allowKeyMap = true;
    var cont = 0;
    var lMask = new Ext.LoadMask(Ext.getBody(), {
        msg: etiquetas.msgLoading
    });
    //lMask.show();
    Ext.Msg.wait('Cargando...', 'Por favor espere...');
    var kmTeclasCalientes = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'i',
            alt: true,
            fn: function() {
                if (!btnadicionar.disabled && allowKeyMap)
                    btnadicionar.handler.call();
            }
        },
        {
            key: 'm',
            alt: true,
            stopEvent: true,
            fn: function() {
                if (!btnmodificar.disabled && allowKeyMap)
                    btnmodificar.handler.call();
            }
        },
        {
            key: Ext.EventObject.DELETE,
            fn: function() {
                if (!btneliminar.disabled && allowKeyMap)
                    btneliminar.handler.call();
            }
        },
        {
            key: 'h',
            alt: true,
            fn: function() {
                if (allowKeyMap)
                    btnAyuda.handler.call();
            }
        }
        , {
            key: Ext.EventObject.TAB, //TAB
            fn: function() {
                if(document.activeElement.tabIndex == 5)
                    Ext.getCmp('descAdd').focus(true, 10);
            }
        }, {
            key: Ext.EventObject.TAB, //TAB
            shift: true,
            fn: function() {
                if(document.activeElement.tabIndex == 1)
                    Ext.getCmp('acep').focus(true, 10);
            }
        }
    ]);
    var cant_e = 0;
    var cont = 0;
    var value;
    var valororiginal; //para ver si se modifica o no, el evento change no pincha bien en el text area
    var valorcambio; //para ver si se modifica o no, el evento change no pincha bien en el text area
    //var win;



    var menuItemEliminar = new Ext.menu.Item({
        text: 'Eliminar',
        hidden: true,
//        icon: perfil.dirImg + 'eliminar.png'
        iconCls: 'eliminar'
    });
    var menuItemModificar = new Ext.menu.Item({
        text: 'Modificar',
        hidden: true,
//        icon: perfil.dirImg + 'modificar.png'
        iconCls: 'modificar'
    });
    this.menuContextual = new Ext.menu.Menu({
        floating: false,
        shadow: "drop",
        hideBorders: true,
        items: [menuItemModificar, menuItemEliminar]
    });

    function mostrarW() {
        var desc = new Ext.form.TextArea({
            fieldLabel: etiquetas.lbDescripcion,
            name: 'desci',
            id: 'descAdd',
            enableKeyEvents: true,
            //maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda _\-\.]*$/,
            regex: /^[0-9a-zA-Z\"\-\_\/\(\)\xf3\xf1\xe1\xe9\xed\xfa\xd1-]+ ?[0-9a-zA-Z\"\-\_\/\(\)\xf3\xf1\xe1\xe9\xed\xfa\xd1-\s]*$/,
            regexText: etiquetas.regexTextDescripcion,
            maxLength: 255,
            maxLengthText: etiquetas.maxLengthText.replace('<#>', '255'),
            anchor: '100%',
            tabIndex: 1,
            allowBlank: false,
            //blankText: etiquetas.blankText,
            listeners: {
                keypress: function(field, e) {
                    if (e.getKey() === e.ENTER && Ext.getCmp('formAdd').getForm().isValid()) {
                        adicionar();
                        //win.hide();
                    }
                },
                keyup: function(field, e) {
                    if ((this.getValue().length > 0 || !Ext.isEmpty(Ext.getCmp('no').getValue())) && Ext.getCmp('formAdd').getForm().isValid()) {
                        Ext.getCmp('acep').enable();
                        if (Ext.getCmp('apli').rendered)
                            Ext.getCmp('apli').enable();
                    } else {
                        Ext.getCmp('acep').disable();
                        if (Ext.getCmp('apli').rendered)
                            Ext.getCmp('apli').disable();
                    }

                    if (e.getKey() == 32 && cont == 0) {
                        value = '';
                        cont = 0;
                        this.reset();
                    } else if (e.getKey() != 32) {
                        cont = field.getValue().length;
                        value = field.getValue();
                    } else if (e.getKey() == 32 && cont != 0 && cant_e == 0) {
                        cant_e++;
                    } else if (e.getKey() == 32 && cont != 0 && cant_e == 1) {
                        cant_e = 0;
                        field.setValue(value + ' ');
                    }
                }
            }

        });

        /*desc.on('keyup', function(t, e) {
         if (e.getKey() == 32 && cont == 0) {
         value = '';
         cont = 0;
         desc.reset();
         } else if (e.getKey() != 32) {
         cont = t.getValue().length;
         value = t.getValue();
         } else if (e.getKey() == 32 && cont != 0 && cant_e == 0) {
         cant_e++;
         } else if (e.getKey() == 32 && cont != 0 && cant_e == 1) {
         cant_e = 0;
         t.setValue(value + ' ');
         }
         }, this);*/
        var no = new Ext.form.TextField({
            fieldLabel: etiquetas.lbNo,
            name: 'no',
            disabled: true,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            maskRe: /^[0-9]+$/,
            regex: /^[0-9]+$/,
            regexText: etiquetas.regexText,
            tabIndex: 2,
            id: 'no',
            anchor: '100%',
            allowBlank: false,
            blankText: etiquetas.blankText,
            enableKeyEvents: true
        });

        var form = new Ext.FormPanel({
            id: 'formAdd',
            labelWidth: 80,
            labelAlign: 'top',
            url: 'adicionar',
            frame: true,
            defaultType: 'textfield',
            monitorValid: true,
            buttonAlign: 'right',
            items: [no, desc]
        });

        form.getForm().reset();
        desc.focus();
        llenaId();
        form.addButton({
            id: 'btncanc',
            text: etiquetas.lbbtnCancelar,
            tooltip: etiquetas.tooltipCancelar,
            tabIndex: 3,
//            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            handler: function() {
                win.close();
            }
        });
        form.addButton({
            text: etiquetas.lbbtnAplicar,
            tooltip: etiquetas.tooltipAplicar,
            iconCls: 'aplicar',
            tabIndex: 4,
            id: 'apli',
            disabled: true,
            handler: function() {
                if (form.getForm().isValid()) {
                    adicionar(true);
                    Ext.getCmp('apli').disable();
                    Ext.getCmp('acep').disable();
                }
                else {
                    allowKeyMap = false;
                    mostrarMensaje(3, etiquetas.msgInvalidForm, function() {
                        allowKeyMap = true;
                    });
                }
            }
        });
        form.addButton({
            text: etiquetas.lbbtnaceptar,
            tooltip: etiquetas.tooltipAceptar,
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            id: 'acep',
            tabIndex: 5,
            disabled: true,
            handler: function() {
                if (form.getForm().isValid()) {
                    adicionar();
//                    win.close();
                } else {
                    allowKeyMap = false;
                    mostrarMensaje(3, etiquetas.msgInvalidForm, function() {
                        allowKeyMap = true;
                    });
                }
            }/*,
            listeners: {
                enable: function(cmp){
                    this.focus();
                }
            }*/
        });
        var win = new Ext.Window({
            id: 'winAdd',
            layout: 'fit',
            width: 330,
            constrain: true,
            title: etiquetas.lbtitwinadicionar,
            height: 220,
            defaultButton: 'btncanc',
            closeAction: 'close',
            //plain: true,
            modal: true,
            items: [form],
            listeners: {
                beforeshow: function() {
                    allowKeyMap = false;
                },
                close: function() {
                    allowKeyMap = true;
                    btnadicionar.focus();
                },
                hide: function() {
                    allowKeyMap = true;
                },
                show: function () {
                    form.getForm().isValid();
                }
            }
        });
        return win;
        //win.show();
    }
    var descrip;
    function actualizar() {
        var no1 = new Ext.form.TextField({
            fieldLabel: etiquetas.lbNo,
            name: 'nro',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            maskRe: /^[0-9]+$/,
            regex: /^[0-9]+$/,
            regexText: etiquetas.regexText,
            blankText: etiquetas.blankText,
            id: 'no1',
            anchor: '100%',
            disabled: true,
            allowBlank: false,
            enableKeyEvents: true
        });
        var desci = new Ext.form.TextArea({
            fieldLabel: etiquetas.lbDescripcion,
            name: 'desc',
            id: 'desc',
            enableKeyEvents: true,
            //maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            //regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+( -?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+)*)+$/,
            //regexText: etiquetas.regexText,
            regex: /^[0-9a-zA-Z\"\-\_\/\(\)\xf3\xf1\xe1\xe9\xed\xfa\xd1-]+ ?[0-9a-zA-Z\"\-\_\/\(\)\xf3\xf1\xe1\xe9\xed\xfa\xd1-\s]*$/,
            regexText: etiquetas.regexTextDescripcion,
            // blankText: etiquetas.blankText,
            anchor: '100%',
            allowBlank: false,
            maxLength: 255,
            maxLengthText: etiquetas.maxLengthText.replace('<#>', '255'),
            listeners: {
                keypress: function(field, e) {
                    if (e.getKey() === e.ENTER && Ext.getCmp('idform1').getForm().isValid()) {
                        modificar();
                    }
                },
                keyup: function(field, e) {
                    if ((this.getValue().length > 0 || !Ext.isEmpty(Ext.getCmp('no1').getValue())) && Ext.getCmp('idform1').getForm().isValid()) {
                        Ext.getCmp('aceptarUpdate').enable();

                    } else {
                        Ext.getCmp('aceptarUpdate').disable();
                    }
                },
                blur: function(textfield, e) {
                    valorcambio = desci.getValue().length;
                    if (parseInt(valorcambio) != parseInt(valororiginal))
                        Ext.getCmp('aceptarUpdate').setDisabled(false);
                }
            }
        });
        /*desci.on('blur', function() {
         valorcambio = desci.getValue().length;
         if (parseInt(valorcambio) != parseInt(valororiginal))
         Ext.getCmp('act').setDisabled(false);
         });*/
        var form1 = new Ext.FormPanel({
            labelWidth: 80,
            id: 'idform1',
            labelAlign: 'top',
            url: 'adicionar',
            frame: true,
            //title : etiquetas.lbtitwinmodificar,
            defaultType: 'textfield',
            monitorValid: true,
            buttonAlign: 'right',
            items: [no1, desci]
        });
        form1.addButton({
            id: 'btncanc1',
            text: etiquetas.lbbtnCancelar,
//            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            tooltip: etiquetas.tooltipCancelar,
            handler: function() {
                win1.destroy();
                //Ext.getCmp('act').setDisabled(true);
                valororiginal = -1;
                valorcambio = 0;
            }
        });
        form1.addButton({
            text: etiquetas.lbbtnaceptar,
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            disabled: true,
            tooltip: etiquetas.tooltipAceptar,
            id: 'aceptarUpdate',
            handler: function() {
                allowKeyMap = false;
                if (form1.getForm().isValid()) {
                    //mostrarMensaje(2, etiquetas.msgConfirmModify, modificar);
                    modificar();
                } else {
                    mostrarMensaje(3, etiquetas.msgInvalidForm, function() {
                        allowKeyMap = true;
                    });
                }
                ///Ext.getCmp('act').setDisabled(true);
            }/*,
            listeners: {
                enable: function() {
                    this.focus()
                }
            }*/

        });
        var win1 = new Ext.Window({
            layout: 'fit',
            id: 'win1',
            title: etiquetas.lbtitwinmodificar,
            width: 330,
            constrain: true,
            defaultButton: 'btncanc1',
            height: 220,
            closeAction: 'destroy',
            modal: true,
            items: [form1],
            listeners: {
                beforeshow: function() {
                    allowKeyMap = false;
                },
                close: function() {
                    allowKeyMap = true;
                },
                hide: function() {
                    allowKeyMap = true;
                },
                destroy: function() {
                    allowKeyMap = true;
                    btnadicionar.focus();
                }
            }
        });
        win1.show();
    }
//    var jsonmotivo = new Ext.data.JsonReader({
//        root: 'valor',
//        id: 'no'
//    }, [{
//            name: 'no', //no es el id del motivo
//            type: 'string',
//            mapping: 'idmotivocancelacion'
//        },
//        {
//            name: 'nro', //nro es el numero del motivo
//            type: 'int',
//            mapping: 'numero'
//        },
//        {
//            name: 'desc',
//            mapping: 'descripcion'
//        }]);
//    /** * Store ** */
//    var stmotivo = new Ext.data.Store({
//        url: 'cargarmotivocancelacion',
//        reader: jsonmotivo,
//        sortInfo: {
//            field: 'nro',
//            direction: "ASC"
//        }
//    });
    this.stmotivo = new Ext.data.JsonStore({
        url: 'cargarmotivocancelacion',
        root: 'data',
        totalProperty: "total",
        fields: [
            {
                name: 'no', //no es el id del motivo
                type: 'string',
                mapping: 'idmotivocancelacion'
            },
            {
                name: 'nro', //nro es el numero del motivo
                type: 'int',
                mapping: 'numero'
            },
            {
                name: 'desc',
                mapping: 'descripcion'
            }
        ],
        listeners: {
            beforeload: function() {
                if(cont !== 0)
                    lMask.show();
            },
            load: function() {
                cont++;
                lMask.hide();
            }
        }
    });
    stmotivo.load({
        callback: function(options, success, response) {
            Ext.Msg.hide();
            btnadicionar.focus();
        }
    });
    var smMotivo = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(sm, indiceFila, record) {
                if (!verificar()) {
                    btnmodificar.enable();
                    btneliminar.enable();
                } else {
                    btnmodificar.disable();
                    btneliminar.disable();
                }
            },
            rowdeselect: function(sm, indiceFila, record) {
                if (smMotivo.hasSelection()) {
                    if (!verificar()) {
                        btnmodificar.enable();
                        btneliminar.enable();
                    } else {
                        btnmodificar.disable();
                        btneliminar.disable();
                    }
                } else {
                    btnmodificar.disable();
                    btneliminar.disable();
                }

            }
        }
    });

    function verificar() {
        for (var i = 0; i < smMotivo.getSelections().length; i++)
            if(smMotivo.getSelections()[i].json.usado)
                return true;
        return false;
    }
    function On_RowClick(action) {
        if (action) {
            btnmodificar.enable();
            btneliminar.enable();
        } else {
            btnmodificar.disable();
            btneliminar.disable();
        }
    }

    var btnadicionar = new Ext.Button({
        text: etiquetas.lbbtnadicionar,
        tooltip: etiquetas.tooltipBtnAdicionar,
        id: 'btnAdic',
        hidden: false,
//        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'adicionar',
        disabled: false,
        handler: function() {
            var windows = mostrarW();
            windows.show();
            Ext.getCmp('descAdd').focus(true, 100);
        },
        abreviatura: 'add_motivocancelacion'

    });
    validate.addButton(btnadicionar);

    var btnmodificar = new Ext.Button({
        text: etiquetas.lbbtnmodifcar,
        id: 'btnModif',
        hidden: false,
//        icon: perfil.dirImg + 'modificar.png',
        iconCls: 'modificar',
        disabled: true,
        tooltip: etiquetas.tooltipBtnModificar,
        handler: function() {
            if (smMotivo.getSelected()) {
                actualizar();
                Ext.getCmp('idform1').getForm().loadRecord(smMotivo.getSelected());
                valororiginal = smMotivo.getSelected().data.desc.length;
            } else {
                allowKeyMap = false;
                mostrarMensaje(3, etiquetas.msgNoElementSelected, function() {
                    allowKeyMap = true;
                });
            }
        },
        abreviatura: 'add_motivocancelacion'

    });
    validate.addButton(btnmodificar);

    var btneliminar = new Ext.Button({
        text: etiquetas.lbbtneliminar,
        id: 'btnElim',
        hidden: false,
        disabled: true,
//        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'eliminar',
        tooltip: etiquetas.tooltipBtnEliminar,
        handler: function() {
            allowKeyMap = false;
            if (smMotivo.getSelections().length == 1) {
                mostrarMensaje(2, etiquetas.msgConfirmDel, eliminar);
            } else if (smMotivo.getSelections().length > 1) {
                mostrarMensaje(2, '¿Está seguro que quiere eliminar los motivos de cancelación seleccionados?', eliminar);
            } else {
                mostrarMensaje(3, etiquetas.msgNoElementSelected, function() {
                    allowKeyMap = true;
                });
            }
        },
        abreviatura: 'del_motivocancelacion'

    });
    validate.addButton(btneliminar);
    //Ocultando primero todos los botones
    //Validando permisos de acceso a los recurdos en los botones
    validate.checkPermisos();

    var btnAyuda = new Ext.Button({
        id: 'btnAyudaMotivoCancelacion',
//        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        text: etiquetas.lbBtnAyuda,
        tooltip: etiquetas.tooltipBtnAyuda
        /*handler: function() {
            var titulo = 'Mostrar ayuda de la funcionalidad';
            var direccion = 'copa/config/motivo_cancelacion';
            help.show(titulo, direccion);
        }*/
    });

    var gpMotivo = new Ext.grid.GridPanel({
        layout: 'fit',
        frame: false,
        border: false,
        //loadMask: Ext.Msg.wait('Cargando...', 'Por favor espere...'),//etiquetas.msgLoading,
//        width: 370,
//        height: 400,
        autoWidth: true,
        stripeRows: true,
        store: stmotivo,
        sm: smMotivo,
        clicksToEdit: 1,
        autoExpandColumn: 'desc',
        columns: [{
            id: 'no',
            header: etiquetas.lbNo,
            dataIndex: 'nro',
            width: 100,
            sortable: true
        }, {
            id: 'desc',
            header: etiquetas.lbDescripcion,
            width: 800,
            dataIndex: 'desc',
            sortable: true
        }],
        viewConfig: {
            forceFit: true
        },
        tbar: [btnadicionar, btnmodificar, btneliminar, '->', btnAyuda, '<p></p>'],
        bbar: new Ext.Cont.PagingToolbar({
            pageSize: 20,
            displayInfo: true,
            displayMsg: etiquetas.displayMsg,
            emptyMsg: etiquetas.emptyMsg,
            store: stmotivo
        }),
        listeners: {
            render: function () {
                btnadicionar.focus();
            }
        }
    });

    gpMotivo.on({
        rowcontextmenu: function(grid, rowIndex, eventObject) {
            eventObject.stopEvent();
            var record = stmotivo.getAt(rowIndex);
            //var showMenu = false;
            if (!record.json.usado) {
                menuItemModificar.show();
                menuItemEliminar.show();
            } else {
                menuItemModificar.hide();
                menuItemEliminar.hide();
            }
            if (!menuItemModificar.hidden || !menuItemEliminar.hidden) {
                this.getSelectionModel().clearSelections();
                this.getSelectionModel().selectRow(rowIndex);
                menuContextual.showAt(eventObject.getXY());
            } else {
                menuContextual.hide();
            }
        }
    });

    menuItemEliminar.on('click', function() {
        btneliminar.handler.call();
    });
    menuItemModificar.on('click', function() {
        btnmodificar.handler.call();
    });

    gpMotivo.getView().getRowClass = function(record, index, rowParams, store) {
        if (record.json.usado) {
            return 'FilaVerde';
        }
    };

    smMotivo.on({
            rowselect: function(smodel, rowIndex, record) {
                gpMotivo.getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function(smodel, rowIndex, record) {
                gpMotivo.getView().removeRowClass(rowIndex, "negrita");
            }
        });

    function eliminar(btn) {
        if (btn == 'ok') {
            var array = [];

            for (var i = 0; i < smMotivo.getSelections().length; i++)
                array.push(smMotivo.getSelections()[i].data.no);

            var msg = (smMotivo.getSelections().length > 0) ? 'Eliminando datos de los motivos de cancelaci\xF3n.' : 'Eliminando datos del motivo de cancelaci\xF3n.';
            Ext.Msg.wait(msg, 'Por favor espere...');
            Ext.Ajax.request({
                url: 'eliminarmotivocancelacion',
                method: 'POST',
                params: {
                    //num: smMotivo.getSelected().data.no
                    num: Ext.encode(array)
                },
                callback: function(options, success, response) {
                    //lMaskk.hide();
                    Ext.Msg.hide();
                    if (!response.responseText) {
                        allowKeyMap = false;
                        mostrarMensaje(3, etiquetas.msgDefaultError, function() {
                            allowKeyMap = true;
                            btnadicionar.focus();
                        });
                    } else {
                        var responseData = Ext.decode(response.responseText);
                        switch (responseData.code)
                        {
                            case 1:
                                stmotivo.reload({callback: function() {
                                        allowKeyMap = false;
                                        if (array.length == 1) {
                                            mostrarMensaje(1, etiquetas.msgDelOk);
                                        } else if (array.length > 1) {
                                            mostrarMensaje(1, 'Los motivos de cancelación ha sido eliminados satisfactoriamente.');
                                        }
                                        allowKeyMap = true;
                                        btnadicionar.focus();
                                       }});

                                break;
                            case 2:
                                allowKeyMap = false;
                                mostrarMensaje(1, etiquetas.msgInUseDelFailed, function() {
                                    allowKeyMap = true;
                                    btnadicionar.focus();
                                });
                                break;
                            case 3:
                                allowKeyMap = false;
                                mostrarMensaje(3, etiquetas.msgDefaultDelFailed, function() {
                                    allowKeyMap = true;
                                    btnadicionar.focus();
                                });
                                break;
                            default:
                                allowKeyMap = false;
                                mostrarMensaje(3, etiquetas.msgDefaultError, function() {
                                    allowKeyMap = true;
                                    btnadicionar.focus();
                                });
                                break;
                        }
                        btnadicionar.focus();
                    }
                }
            });
            allowKeyMap = true;
        } else {
            allowKeyMap = true;
        }
        btnadicionar.focus();
    }

    var vp = new Ext.Viewport({
        layout: 'fit',
        items: [gpMotivo]
    });

    function val() {
        var flag = false;
        for (var i = 0; i < stmotivo.getCount(); i++) {
            if (Ext.getCmp('descAdd').getValue() == stmotivo.getAt(i).data.desc || Ext.getCmp('descAdd').getValue() == stmotivo.getAt(i).data.desc) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    function valM() {
        for (var i = 0; i < stmotivo.getCount(); i++)
            if (eval('stmotivo.getRange(0,stmotivo.getCount()-1)[i].data.desc') == Ext.getCmp('desc').getValue())
                return true;
        return false;
    }

    function adicionar(aplaying) {
        if (val() === false) {
            /*lMaskk = new Ext.LoadMask(Ext.getBody(), {
                msg: etiquetas.msgSaving
            });
            lMaskk.show();*/
            Ext.Msg.wait('Guardando datos del motivo de cancelaci\xF3n.', 'Por favor espere...');
            Ext.Ajax.request({
                url: 'adicionar',
                method: 'POST',
                params: {
                    no: Ext.getCmp('no').getValue(),
                    desc: Ext.getCmp('descAdd').getValue()
                },
                callback: function(options, success, response) {
                    Ext.Msg.hide();
                    if (!response.responseText) {
                        allowKeyMap = false;
                        mostrarMensaje(3, etiquetas.msgDefaultError, function() {
                            allowKeyMap = true;
                            btnadicionar.focus();
                        });
                    } else {
                        var responseData = Ext.decode(response.responseText);
                        switch (responseData.code)
                        {
                            case 1:
                                stmotivo.reload({callback: function() {
                                        if (!aplaying) {
                                            Ext.getCmp('winAdd').close();
                                        }else{
                                            llenaId();
                                        }
                                        allowKeyMap = false;
                                        mostrarMensaje(1, etiquetas.msgAddOk);
                                            allowKeyMap = true;
                                            btnadicionar.focus();
                                    }});
                                break;
                            case 2:
                                allowKeyMap = false;
                                mostrarMensaje(3, etiquetas.msgDefaultAddFailed, function() {
                                    allowKeyMap = true;
                                    btnadicionar.focus();
                                });
                                break;
                            default:
                                allowKeyMap = false;
                                mostrarMensaje(3, etiquetas.msgDefaultError, function() {
                                    allowKeyMap = true;
                                    btnadicionar.focus();
                                });
                                break;
                        }
                    }
                    Ext.getCmp('descAdd').reset();
                }
            });
        } else {
            allowKeyMap = false;
            mostrarMensaje(1, etiquetas.msgAlreadyExist);
                allowKeyMap = true;
                btnadicionar.focus();
        }
    }

    Ext.getCmp('desc').on('keyup', function(t, e) {
        if (e.getKey() == 32 && cont == 0) {
            cont = 0;
            value = '';
            Ext.getCmp('desc').reset();
        } else if (e.getKey() != 32) {
            cont = t.getValue().length;
            value = t.getValue();
        } else if (e.getKey() == 32 && cont != 0 && cant_e == 0) {
            cant_e++;
        } else if (e.getKey() == 32 && cont != 0 && cant_e == 1) {
            cant_e = 0;
            t.setValue(value + ' ');
        }
    }, this);
    function loadMask(message) {
        lMask = new Ext.LoadMask(Ext.getBody(), {
            msg: message
        });
        lMask.show();
    }
    ;
    function modificar(btn) {
        //if (btn == 'ok') {
        if (valM() == false) {
            Ext.Msg.wait('Guardando datos del motivo de cancelaci\xF3n.', 'Por favor espere...');
            Ext.Ajax.request({
                url: 'modificar',
                method: 'POST',
                /*success: function(response) {
                 stmotivo.reload();
                 Ext.getCmp('win1').destroy();
                 },*/
                params: {
                    no: smMotivo.getSelected().data.no,
                    desc: Ext.getCmp('desc').getValue()
                },
                callback: function(options, success, response) {
                    //lMaskk.hide();
                    Ext.Msg.hide();
                    if (!response.responseText) {
                        allowKeyMap = false;
                        mostrarMensaje(3, etiquetas.msgDefaultError, function() {
                            allowKeyMap = true;
                            btnadicionar.focus();
                        });
                    } else {
                        var responseData = Ext.decode(response.responseText);
                        switch (responseData.code)
                        {
                            case 1:
                                Ext.getCmp('win1').close();
                                stmotivo.reload({callback: function() {
                                        allowKeyMap = false;
                                        mostrarMensaje(1, etiquetas.msgModifyOk);
                                            allowKeyMap = true;
                                            btnadicionar.focus();

                                    }});
                                break;
                            case 2:
                                allowKeyMap = false;
                                mostrarMensaje(3, etiquetas.msgDefaultModFailed, function() {
                                    allowKeyMap = true;
                                    btnadicionar.focus();
                                });
                                break;
                            case 3:
                                allowKeyMap = false;
                                mostrarMensaje(1, etiquetas.msgInUseModFailed, function() {
                                    allowKeyMap = true;
                                    btnadicionar.focus();
                                });
                                break;
                            default:
                                allowKeyMap = false;
                                mostrarMensaje(3, etiquetas.msgDefaultError, function() {
                                    allowKeyMap = true;
                                    btnadicionar.focus();
                                });
                                break;
                        }
                    }
                }

            });
        } else {
            allowKeyMap = false;
            mostrarMensaje(1, etiquetas.msgAlreadyExist);
                allowKeyMap = true;
                btnadicionar.focus();
           }
        /*} else {
         Ext.getCmp('win1').destroy();
         }*/
        allowKeyMap = true;
    }

    function arrayrecord(valor) {
        var records = new Array();
        for (var i = 0; i < stmotivo.getCount(); i++) {
            records[i] = stmotivo.getAt(i).data.no;
        }
        if (valor)
            records[stmotivo.getCount()] = valor;
        return records;
    }

    function llenaId(valor) {
        loadMask(etiquetas.lbWait);
        Ext.Ajax.request({
            url: 'generarid',
            method: 'POST',
            params: {
                select: Ext.encode(arrayrecord(valor))
            },
            success: function(response) {
                responseData = Ext.decode(response.responseText);
                Ext.getCmp('no').setValue(responseData.id);
                lMask.hide();
            }
        });
    }

    stmotivo.on('load', marca);
    function marca() {
        if (stmotivo.getCount() != 0)
            smMotivo.selectFirstRow();
        else
        {
            btneliminar.disable();
            btnmodificar.disable();
        }
    }
}
//cargarInterfaz();
