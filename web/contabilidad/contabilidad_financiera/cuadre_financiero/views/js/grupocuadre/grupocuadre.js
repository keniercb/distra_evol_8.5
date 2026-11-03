Ext.QuickTips.init();
var perfil = window.parent.perfil;
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('grupocuadre', function() {
    cargarInterfaz(perfil.etiquetas);
});
var cerrar = false;
var windowopen = false; //indica que se abrio una ventana
var idgrupo;//almacena el id del grupo que se va a modificar
var adimod = false;//indica accion que se esta haciendo (false = adicionar)
var idgrupos;//almacena los grupos de cuadres a eliminar
var ventanagrupocuadre;
function cargarInterfaz(idioma) {
    MostrarEtiquetas(idioma.msgCargando);
    var btnadicionar = new Ext.Button({
        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'btn',
        text: idioma.btnadicionar,
        tooltip: idioma.ttadicionar,
        handler: function() {
            mostrarventanagrupocuadre(1, idioma.ttwdadigrupocuadre);
        }
    });

    var btnmodificar = new Ext.Button({
        disabled: true,
        icon: perfil.dirImg + 'modificar.png',
        iconCls: 'btn',
        text: idioma.btnmodificar,
        tooltip: idioma.ttmodificar,
        handler: function() {
            EventoModificar();
            cerrar = true;
        }
    });

    var btneliminar = new Ext.Button({
        disabled: true,
        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'btn',
        text: idioma.btneliminar,
        tooltip: idioma.tteliminar,
        handler: function() {
            EventoEliminar();
        }
    });

    var btnayuda = new Ext.Button({
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn',
        text: idioma.btnayuda,
        tooltip: idioma.ttayuda,
        handler: function() {

            var title = 'Mostrar ayuda de la funcionalidad';
            var referencia = 'confin/analisisE/cuadreF/grupoC';
            help.show(title, referencia);

        }
    });
    var btnaceptar = new Ext.Button({
        disabled: true,
        icon: perfil.dirImg + 'aceptar.png',
        iconCls: 'btn',
        text: idioma.btnaceptar,
        tooltip: idioma.ttaceptar,
        handler: function() {
            if (adimod == false)
                adicionargrupocuadre();
            else
                modificargrupocuadre();
            btnadicionar.focus();
        }
    });
    var btnaplicar = new Ext.Button({
        disabled: true,
        icon: perfil.dirImg + 'aceptar.png',
        iconCls: 'btn',
        text: idioma.btnaplicar,
        tooltip: idioma.ttaplicar,
        handler: function() {
            if (adimod == false)
                adicionargrupocuadre(1);
            btnadicionar.focus();
        }
    });
    var btncancelar = new Ext.Button({
        icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'btn',
        text: idioma.btncancelar,
        tooltip: idioma.ttcancelar,
        handler: function() {
            Ext.getCmp('denominacion').reset();
            Ext.getCmp('observacion').reset();
            btnaceptar.disable();
            btnaplicar.disable();
            adimod = false;
            cerrar = false;
            ventanagrupocuadre.hide();
            btnadicionar.focus();
        }
    });
    //teclas calientes
    new Ext.KeyMap(Ext.getBody(), [{
            // ADICIONAR
            key: 'i',
            alt: true,
            fn: function() {
                if (!windowopen)
                    btnadicionar.handler();
            }
        }, {
            // Modificar
            key: 'm',
            alt: true,
            fn: function() {
                if (!windowopen && !btnmodificar.disabled) {
                    btnmodificar.handler();
                }
            }
        }, {
            // Eliminar 
            key: Ext.EventObject.DELETE,
            fn: function() {
                if (!windowopen && !btneliminar.disabled) {
                    btneliminar.handler();
                }
            }
        }, {
            // Ayuda
            key: 'h',
            alt: true,
            fn: function() {

                var title = 'Mostrar ayuda de la funcionalidad';
                var referencia = 'confin/analisisE/cuadreF/grupoC';
                help.show(title, referencia);
            }
        }
    ]);

    var tfdenominacion = new Ext.form.TextField({
        id: 'denominacion',
        fieldLabel: idioma.lbDenominacion,
        //maskRe: /^[ 0-9A-Z\-\xC1\xC9\xCD\xD3\xDA]+$/,
        regex: /^[ 0-9a-zA-Z\-\xE1\xE9\xED\xF3\xFA\xC1\xC9\xCD\xD3\xDA]+$/,
        regexText: idioma.regexTextlbDenominacion,
        enableKeyEvents: true,
        allowBlank: false,
        anchor: '98%',
        maxLength: 255,
        maxLengthText: idioma.lbMaxLengthText
    });
    tfdenominacion.on('keyup', function(t, e) {
        if (t.getValue().length == 0 || Ext.getCmp('observacion').getValue().length == 0)
        {
            btnaceptar.disable();
            btnaplicar.disable();
        }
        else if (t.getValue() != ' ' && Ext.getCmp('observacion').getValue().length > 0)
        {
            btnaceptar.enable();
            btnaplicar.enable();
        }
    }, this);

//    var tfobservacion = new Ext.form.TextField({
    var tfobservacion = new Ext.form.TextArea({
        id: 'observacion',
        fieldLabel: idioma.lbObservacion,
        //maskRe: /^[ 0-9A-Z\-\xC1\xC9\xCD\xD3\xDA]+$/,
        regex: /^[ 0-9a-zA-Z\-\xE1\xE9\xED\xF3\xFA\xC1\xC9\xCD\xD3\xDA]+$/,
        regexText: idioma.regexTextlbObservacion,
        allowBlank: false,
        enableKeyEvents: true,
        anchor: '98%',
        maxLength: 255,
        maxLengthText: idioma.lbMaxLengthText
    });
    tfobservacion.on('keyup', function(t, e) {
        if (t.getValue().length == 0 || Ext.getCmp('denominacion').getValue().length == 0)
        {
            btnaceptar.disable();
            btnaplicar.disable();
        }
        else if (t.getValue() != ' ' && Ext.getCmp('denominacion').getValue().length > 0)
        {
            btnaceptar.enable();
            btnaplicar.enable();
        }
    }, this);

    var panelgrupocuadre = new Ext.FormPanel({
        id: 'idform',
        frame: true,
        layout: 'form',
        labelAlign: 'top',
        items: [tfdenominacion, tfobservacion]
    });


    function mostrarventanagrupocuadre(adi, title) {
        if (!ventanagrupocuadre) {
            ventanagrupocuadre = new Ext.Window({
                id: 'wgestCuadre',
                width: 310,
                height: 200,
                layout: 'fit',
                resizable: false,
                modal: true,
                closeAction: 'hide',
                items: panelgrupocuadre,
                buttons: [btncancelar, btnaplicar, btnaceptar],
                listeners: {
                    hide: function() {
                        windowopen = false;
                        Ext.getCmp('denominacion').reset();
                        Ext.getCmp('observacion').reset();
                    },
                    show: function() {
                        windowopen = true;
                    }
                }
            });
            ventanagrupocuadre.show();
        } else {
            ventanagrupocuadre.show();
        }
        if (adi) {
            Ext.getCmp('denominacion').reset();
            Ext.getCmp('observacion').reset();
            btnaplicar.show();
        } else {
            btnaplicar.hide();
        }
        ventanagrupocuadre.setTitle(title);
    }

    var stgrupo = new Ext.data.Store({
        url: 'cargargruposcuadre',
        reader: new Ext.data.JsonReader({
            id: 'idgrupo',
            root: 'campos',
            totalProperty: 'totalrecords'
        }, [{
                name: 'idgrupocuadre'
            }, {
                name: 'denominacion'
            }, {
                name: 'observacion'
            }, {
                name: 'idestructurae'
            }
        ]),
        listeners: {
            load: function(e)
            {
                if (stgrupo.getCount() > 0) {
                    smgrupo.selectFirstRow();
                } else {
                    btnmodificar.disable();
                    btneliminar.disable();
                }
                lMask.hide();
            }
        }
    });
    stgrupo.load({
        params: {
            start: 0,
            limit: 20
        }
    });

    var smgrupo = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });
//evento para habilitar los btn al seleccionar una fila
    smgrupo.on({
        rowselect: function(selModel, rowIndex, record) {
            Ext.getCmp('gpGrupoCuadre').getView().addRowClass(rowIndex, "negrita");
            if (selModel.getSelections().length == 1) {
                btnmodificar.enable();
                btneliminar.enable();
            } else if (selModel.getSelections().length > 1) {
                btnmodificar.disable();
                btneliminar.enable();
            }
            else {
                btnmodificar.disable();
                btneliminar.disable();
            }
        },
        rowdeselect: function(selModel, rowIndex, record) {
            Ext.getCmp('gpGrupoCuadre').getView().removeRowClass(rowIndex, "negrita");
            if (selModel.getSelections().length == 1) {
                btnmodificar.enable();
                btneliminar.enable();
            } else if (selModel.getSelections().length > 1) {
                btnmodificar.disable();
                btneliminar.enable();
            }
            else {
                btnmodificar.disable();
                btneliminar.disable();
            }
        }
    });

    var gpgrupo = new Ext.grid.GridPanel({
        id: 'gpGrupoCuadre',
        layout: 'fit',
        autoExpandColumn: 'observacion',
        sm: smgrupo,
        store: stgrupo,
        border: false,
        autoScroll: true,
        stripeRows: true,
        viewConfig: {
            forceFit: true
        },
        loadMask: {
            store: stgrupo,
            msg: idioma.msgCargando
        },
        tbar: [btnadicionar, btnmodificar, btneliminar, '->', btnayuda],
        columns: [smgrupo,
            {
                id: 'idgrupocuadre',
                hidden: true,
                hideable: false,
                dataIndex: 'idgrupocuadre'
            },
            {
                header: idioma.lbDenominacion,
                sortable: true,
                width: 300,
                dataIndex: 'denominacion'
            },
            {
                id: 'observacion',
                header: idioma.lbObservacion,
                sortable: true,
                dataIndex: 'observacion'
            },
            {
                id: 'idestructurae',
                hidden: true,
                hideable: false,
                dataIndex: 'idestructurae'
            }
        ],
        bbar: new Ext.Cont.PagingToolbar({
            pageSize: 20,
            store: stgrupo,
            displayInfo: true,
            displayMsg: idioma.displayMsg,
            emptyMsg: idioma.emptyMsg
        })
    });

    Ext.getCmp('gpGrupoCuadre').on('render', function(t, r, re)
    {
        btnadicionar.focus();
    });

    new Ext.Viewport({
        layout: 'fit',
        border: false,
        items: gpgrupo
    });


    function EventoModificar() {
        if (smgrupo.getSelected()) {
            cargarDatos();
            mostrarventanagrupocuadre(0, idioma.ttwdmodgrupocuadre);
        }
    }

    function EventoEliminar() {
        if (smgrupo.getSelected()) {
            windowopen = true;
            mostrarMensaje(2, (smgrupo.getSelections().length <= 1) ? idioma.msgSingleDelcuadre : idioma.msgPluralDelcuadre, function(btn) {
                if (btn == 'ok') {
                    verificargrupocuadre();
                } else {
                    windowopen = false;
                }

            });
        }
    }
    function adicionargrupocuadre(apl) {
        if (Ext.getCmp('denominacion').isValid() && Ext.getCmp('observacion').isValid()) {
            progressBar(idioma.msgAdd);
            Ext.Ajax.request({
                url: 'adicionargrupocuadre',
                method: 'POST',
                params: {
                    denominacion: Ext.getCmp('denominacion').getValue(),
                    observacion: Ext.getCmp('observacion').getValue()
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    Ext.MessageBox.hide();
                    Ext.getCmp('denominacion').reset();
                    Ext.getCmp('observacion').reset();
                    btnaceptar.disable();
                    btnaplicar.disable();
                    stgrupo.reload();
                    if (!apl) {
                        ventanagrupocuadre.hide();
                    }
                    adimod = false;
                    if (responseData.codMsg == -1) {
                        mostrarMensaje(1, idioma.msgConfrAdd, Ext.emptyFn);
                    } else {
                        mostrarMensaje(1, idioma.msgExiste, Ext.emptyFn);
                    }
                }

            });
        }
    }

    function modificargrupocuadre() {
        if (Ext.getCmp('denominacion').isValid() && Ext.getCmp('observacion').isValid()) {
            progressBar(idioma.msgModf);
            Ext.Ajax.request({
                url: 'modificargrupocuadre',
                method: 'POST',
                params: {
                    denominacion: Ext.getCmp('denominacion').getValue(),
                    observacion: Ext.getCmp('observacion').getValue(),
                    idgrupo: idgrupo
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    Ext.MessageBox.hide();
                    Ext.getCmp('denominacion').reset();
                    Ext.getCmp('observacion').reset();
                    btnaceptar.disable();
                    stgrupo.reload();
                    ventanagrupocuadre.hide();
                    adimod = false;
                    switch (responseData.codMsg) {
                        case -1:
                            {
                                mostrarMensaje(1, idioma.msgConfrMod, Ext.emptyFn);
                            }
                            break;
                        case -2:
                            {
                                mostrarMensaje(1, idioma.lbInfoExisteDenominacion, Ext.emptyFn);
                            }
                            break;
                        case -3:
                            {
                                mostrarMensaje(1, idioma.msgExisteMod, Ext.emptyFn);
                            }
                            break;
                        case -4:
                            {
                                mostrarMensaje(1, idioma.lbNoChanges, Ext.emptyFn);
                            }
                            break;
                        default:
                            {
                                if (responseData.codMsg && responseData.mensaje) {
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                }
                            }
                            break;
                    }
//                      if(responseData.codMsg == -1) {
//                          mostrarMensaje(1, idioma.msgConfrMod, function(){});
//                      }
//                      else {
//                          mostrarMensaje(1, idioma.msgExisteMod);
//                      }
                }
            });
        }
    }

    function eliminar() {
        //MostrarEtiquetas(idioma.msgDel);
        Ext.Ajax.request({
            url: 'eliminargrupocuadre',
            method: 'POST',
            params: {
                arrayidgrupo: Ext.encode(idgrupos)
            },
            callback: function(options, success, response) {
                //lMask.hide();
                responseData = Ext.decode(response.responseText);
                btnmodificar.disable();
                btneliminar.disable();
                stgrupo.reload(idgrupos);
                if (responseData) {
                    mostrarMensaje(1, (idgrupos.length <= 1) ? idioma.msgConfrSingleDel : idioma.msgConfrPluralDel, function() {
                    });
                }
                windowopen = false;
            }
        });
    }
    function verificargrupocuadre() {
        //MostrarEtiquetas(idioma.msgVerificando);
        Ext.Msg.wait("Eliminando datos del grupo de cuadre", "Por favor espere...");
        var seleccionados = smgrupo.getSelections();
        idgrupos = new Array();
        for (var i = 0; i < seleccionados.length; i++) {
            idgrupos.push(parseFloat(seleccionados[i].data.idgrupocuadre));
        }
        Ext.Ajax.request({
            url: 'verificarcuadreasociado',
            method: 'POST',
            params: {
                arrayidgrupo: Ext.encode(idgrupos)
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                Ext.Msg.hide();
                //lMask.hide();
                if (responseData) {
                    mostrarMensaje(2, idioma.msgVerifAsociados + String.fromCharCode(191) + idioma.msgVerifAsociados1, confirmar);
                }
                else {
                    eliminar();
                }
            }
        });
    }

    function cargarDatos() {
        tfdenominacion.setValue(smgrupo.getSelected().data.denominacion);
        tfobservacion.setValue(smgrupo.getSelected().data.observacion);
        idgrupo = smgrupo.getSelected().data.idgrupocuadre;
        adimod = true;
    }

    function MostrarEtiquetas(mensaje) {
        lMask = new Ext.LoadMask(Ext.getBody(), {
            msg: mensaje
        });
        lMask.show();
    }

    function confirmar(btn) {
        if (btn == 'ok') {
            eliminar();
        } else {
            windowopen = false;
        }

    }

    function progressBar(msg) {
        Ext.MessageBox.show({
            title: idioma.msgEspere,
            msg: msg,
            width: 300,
            progress: true,
            closable: false
        });
        var f = function(v) {
            return function() {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i);
            };
        };
        for (var i = 1; i < 12; i++) {
            setTimeout(f(i), i * 500);
        }
    }

   /* function aqui va ..(animateTarget, title, msg, icon, time, callback) {
        var notification = new Ext.Cont.Notification({
            animateTarget: animateTarget,
            fnc: (callback) ? callback : Ext.emptyFn,
            iconbox: icon,
            iconCls: "icon-waiting",
            title: title,
            html: msg,
            hideDelay: (time) ? time : 5000
        });
        notification.box();
    }*/

    function isDirtyForm(idForm, smodel, decimalPrecision) {
        var objValuesForm = Ext.getCmp(idForm).getForm().getValues(false);
        var smodelData = smodel.getSelected().data;
        decimalPrecision = decimalPrecision || 2;
        var arrValuesForm = new Array();
        for (var name in objValuesForm) {
            arrValuesForm[name] = objValuesForm[name];
        }

        var arrValuesRecord = new Array();
        for (var valueRecord in smodelData) {
            arrValuesRecord[valueRecord] = smodelData[valueRecord];
        }

        for (var propValuesForm in arrValuesForm) {
            for (var propValuesRecord in arrValuesRecord) {
                if (propValuesForm == propValuesRecord) {
                    var valuef = arrValuesForm[propValuesForm];
                    var valuer = arrValuesRecord[propValuesRecord];
                    if ((!isNaN(valuef)) && !isNaN(valuer)) {
                        if (parseFloat(valuef).toFixed(decimalPrecision) != parseFloat(valuer).toFixed(decimalPrecision)) {
                            return true;
                        }
                        if (parseInt(valuef, 10) != (parseInt(valuer, 10))) {
                            return true;
                        }
                    }
                    else {
                        if (valuef != valuer) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

}