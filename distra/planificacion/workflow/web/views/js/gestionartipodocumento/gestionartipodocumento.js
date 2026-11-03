var perfil = window.parent.UCID.portal.perfil
Ext.QuickTips.init();

var winasocestados, stGEstadosAsociados, smGEstadosAsociados, GEstadosAsociados, pEstadosAsociados;
var smGEstadosSinAsociar, stGEstadosSinAsociar, GEstadosSinAsociar, pasociar, btnAsociarEstado,
        btnDesAsociarEstado, btnEstadoInicial, btnQuitarEstadoInicial;
var idtdoc;
var arrayidestadosparaasoc = [];
var arrayidestadoparadesasoc = [];


function CargarInterfaz() {

    gestesta = new Ext.Button({
        text: 'Asociar estados',
        tooltip: 'Asociar estados a los tipos de documentos',
        disabled: true,
        iconCls: 'aplicar',
        //icon : perfil.dirImg + 'aplicar.png',
        handler: function() {
            CrearWinAsociarEstados();
        }
    });

    smTDoc = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    smTDoc.on('rowselect', function(smodel, rowIndex, record) {
        idtdoc = smTDoc.getSelected().data.idtdoc;
        gestesta.enable();

    }, this);
    stTDoc = new Ext.data.Store({
        autoLoad: true,
        url: 'cargartdoc',
        listeners: {
            beforeload: function(st)
            {
                gestesta.disable();
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            totalProperty: "cant",
            id: "idtdoc"
        }, [{
                name: 'idtdoc',
                mapping: 'idtipodoc'
            }, {
                name: 'denomtdoc',
                mapping: 'denominacion'
            }, {
                name: 'nombretipodocumento'
            }
        ])
    });

    gpTDoc = new Ext.grid.GridPanel({
        id: 'gpTDoc',
        autoExpandColumn: 'denomtdoc',
        store: stTDoc,
        stripeRows: true,
        margins: '2 2 2 -4',
        sm: smTDoc,
        columns: [{
                hidden: true,
                hideable: false,
                dataIndex: 'idtdoc'
            },
            {
                header: "Denominaci&oacute;n",
                dataIndex: 'denomtdoc',
                id: 'denomtdoc',
                renderer: MostrarImagenTipoElemento
            }
        ],
        loadMask: {
            msg: "Cargando tipos de documentos..."
        },
        tbar: [gestesta]
    });

    win = new Ext.Panel({
        layout: 'fit',
        title: '<center>Registro de tipos de documentos</center>',
        items: gpTDoc,
        anchor: '100% 100%'
    });
    //viewport de la vista
    vpGestionarDoc = new Ext.Viewport({
        layout: 'anchor',
        items: win
    });

    function MostrarImagenTipoElemento(valor)
    {
        var icon = 'plan';
        if (valor)
        {
            var arrayvalor = valor.split("*");
            if (arrayvalor[1] == 1)
            {
                icon = 'obj_ejec';
            }
            if (arrayvalor[1] == 3)
            {
                icon = 'act_ejec';
            }
        }
        return '<span><img src="../../../../../planificacion/pdo/comun/recursos/images/fam/' + icon + '.png" >' + ' ' + arrayvalor[0] + '</span>';
    }
    function MostrarImagenT(val)
    {
        if (val == 0) {
            return ' ';
        }
        if (val > 0) {
            return '<center><span><img src="../../../../../planificacion/pdo/comun/recursos/images/fam/tick.png" ></span></center>';
        }
        return ' ';
    }

    function CrearWinAsociarEstados()
    {
        if (winasocestados) {
            winasocestados.destroy();
        }

        btnEstadoInicial = new Ext.Button({
            text: 'Estado inicial',
            tooltip: 'Seleccionar estado inicial',
            disabled: true,
            iconCls: 'iniciodeanno',
            //icon : perfil.dirImg + 'iniciodeanno.png',
            handler: function()
            {
                PonerEstadoComoInicial(1);
            }
        });

        btnQuitarEstadoInicial = new Ext.Button({
            text: 'Quitar estado inicial',
            tooltip: 'Quitar estado inicial',
            disabled: true,
            iconCls: 'btn',
            icon: perfil.dirImg + 'finanno.png',
            handler: function()
            {
                PonerEstadoComoInicial(0);
            }
        });

        stGEstadosAsociados = new Ext.data.Store({
            url: 'cargarestadoasoc',
            listeners: {
                beforeload: function(st)
                {
                    st.baseParams.idtdoc = idtdoc;
                }
            },
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "total",
                id: "idestado"
            }, [{
                    name: 'denominacion'
                }, {
                    name: 'idestado'
                }, {
                    name: 'idtdoc'
                }, {
                    name: 'inicial'
                }])
        });
        smGEstadosAsociados = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function() {
                    ActualizarBotonesDesAsociar();
                },
                rowdeselect: function() {
                    ActualizarBotonesDesAsociar();
                }
            }
        });
        GEstadosAsociados = new Ext.grid.GridPanel({
            title: '<center>Estados asociados</center>',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            stripeRows: true,
            autoScroll: true,
            width: 450,
            store: stGEstadosAsociados,
            sm: smGEstadosAsociados,
            region: 'east',
            tbar: ['-', btnEstadoInicial, '-', btnQuitarEstadoInicial, '-'],
            columns: [smGEstadosAsociados,
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idtdoc'
                }, {
                    header: "Denominaci&oacute;n",
                    dataIndex: 'denominacion',
                    id: 'expandir'
                }, {
                    header: "Estado inicial",
                    dataIndex: 'inicial',
                    width: 80,
                    renderer: MostrarImagenT
                }],
            loadMask: {
                msg: "Cargando estados asociados..."
            },
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: stGEstadosAsociados,
                displayInfo: true
            })
        });

        smGEstadosSinAsociar = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function()
                {
                    ActualizarBotonesAsociar();
                },
                rowdeselect: function()
                {
                    ActualizarBotonesAsociar();
                }
            }
        });
        stGEstadosSinAsociar = new Ext.data.Store({
            url: 'cargarestadosasoc',
            listeners: {
                beforeload: function(st)
                {
                    st.baseParams.idtdoc = idtdoc;
                }
            },
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "total",
                id: "idestado"
            }, [{
                    name: 'denominacion'
                }, {
                    name: 'idestado'
                }])
        });

        GEstadosSinAsociar = new Ext.grid.GridPanel({
            title: '<center>Estados sin asociar</center>',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            region: 'west',
            width: 400,
            stripeRows: true,
            autoScroll: true,
            store: stGEstadosSinAsociar,
            sm: smGEstadosSinAsociar,
            columns: [
                smGEstadosSinAsociar,
                {
                    header: "Denominaci&oacute;n",
                    dataIndex: 'denominacion',
                    id: 'expandir'
                }],
            loadMask: {
                msg: "Cargando estado sin asociar..."
            },
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: stGEstadosSinAsociar,
                displayInfo: true
            })
        });

        btnAsociarEstado = new Ext.Button({
            tooltip: 'Asociar estados',
            disabled: true,
            iconCls: 'siguiente',
            //icon : perfil.dirImg + 'siguiente.png',
            handler: function()
            {
                AsociarEstados();
                GEstadosSinAsociar.getView().refresh(true);

            }
        });

        btnDesAsociarEstado = new Ext.Button({
            tooltip: 'Eliminar asociaci&oacute;n',
            disabled: true,
            iconCls: 'anterior',
            //icon : perfil.dirImg + 'anterior.png',
            handler: function()
            {
                DesAsociarEstados();
                GEstadosAsociados.getView().refresh(true);
            }
        });

        pasociar = new Ext.Panel({
            region: 'center',
            bodyStyle: 'padding:170px 30px',
            items: [btnAsociarEstado, btnDesAsociarEstado]
        });


        pEstadosAsociados = new Ext.Panel({
            layout: 'border',
            items: [GEstadosAsociados, pasociar, GEstadosSinAsociar]
        });

        winasocestados = new Ext.Window({
            title: '<center>Asociar estados al tipo de documento "' + smTDoc.getSelected().data.nombretipodocumento + '"</center>',
            height: 450,
            width: 950,
            layout: 'fit',
            resizable: false,
            draggable: true,
            modal: true,
            items: [pEstadosAsociados],
            buttons: [
                {
                    text: 'Cerrar',
                    iconCls: 'cerrar',
                    //icon : perfil.dirImg + 'cerrar.png',
                    handler: function() {
                        if (smTDoc.hasSelection())
                            smTDoc.clearSelections();
                        winasocestados.destroy();
                    }
                }
            ],
            listeners: {
                show: function(win)
                {
                    stGEstadosAsociados.reload({
                        params: {
                            idtdoc: idtdoc,
                            start: 0,
                            // limit:10
                        }
                    });
                    stGEstadosSinAsociar.reload({
                        params: {
                            idtdoc: idtdoc,
                            start: 0,
                            // limit:10
                        },
                        callback: function(r, option, success) {
                            /*var checkheader = Ext.get(GEstadosSinAsociar.getView().getHeaderCell(0)).child('div',false);                          
                             checkheader.show();
                             if(r.length == 0)
                             checkheader.hide();
                             winasocestados.render();*/
                        }
                    });
                }
            }
        });
        winasocestados.show();
    }
    // Ventanas
    function Winop(op) {
        switch (op) {
            case 'addtdoc' :
                {
                    winop = new Ext.Window({
                        width: 400,
                        modal: true,
                        closeAction: 'hide',
                        height: 390,
                        title: 'Insertar tipo documento',
                        items: [formtdoc, gpSub],
                        buttons: [{
                                text: 'Cancelar',
                                iconCls: 'cancelar',
                                handler: function() {
                                    formtdoc.getForm().reset();
                                    winop.hide();
                                }
                                //icon : perfil.dirImg + 'cancelar.png'
                            }, {
                                text: 'Aplicar',
                                iconCls: 'aplicar',
                                handler: function() {
                                    adicionartdoc('apl');
                                }
                                //icon : perfil.dirImg + 'aplicar.png'
                            }, {
                                text: 'Aceptar',
                                iconCls: 'aceptar',
                                handler: function() {
                                    adicionartdoc('add');
                                }
                                //icon : perfil.dirImg + 'aceptar.png'
                            }]
                    });
                    winop.show();
                }
                break;
            case 'modtdoc' :
                {
                    winop = new Ext.Window({
                        width: 400,
                        modal: true,
                        // layout:'border',
                        closeAction: 'hide',
                        height: 350,
                        title: 'Modificar tipo documento',
                        items: [formtdoc, gpSubmod],
                        buttons: [{
                                text: 'Cancelar',
                                iconCls: 'cancelar',
                                handler: function() {
                                    formtdoc.getForm().reset()
                                    winop.hide();
                                }
                                //icon : perfil.dirImg + 'cancelar.png'
                            }, {
                                text: 'Aceptar',
                                iconCls: 'aceptar',
                                handler: function() {
                                    apltdoc = true;
                                    modificartdoc('mod');
                                }
                                //icon : perfil.dirImg + 'aceptar.png'
                            }]
                    });
                    winop.show();
                    formtdoc.getForm().loadRecord(smTDoc.getSelected());
                }
                break;
            case 'winest' :
                {
                    winop = new Ext.Window({
                        layout: 'fit',
                        width: 500,
                        modal: true,
                        closeAction: 'hide',
                        height: 500,
                        title: 'Gestionar estado',
                        items: tabestado
                    });
                    winop.show();
                }
                break;
        }
    }
    // Funcciones Tipo Documento
    function eliminartdoc(btnPresionado) {
        if (btnPresionado == 'yes') {
            Ext.Ajax.request({
                url: 'eliminartdoc',
                params: {
                    idtdoc: smTDoc.getSelected().data.idtdoc
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                    stTDoc.reload();
                }
            });
        }
    }
    function adicionartdoc(tipo) {
        arrSub = new Array();
        var data = smSub.getSelections();
        Ext.each(data, function(item, index, intemall) {
            arrSub.push(item.data);
        });
        if (formtdoc.getForm().isValid()) {
            formtdoc.getForm().submit({
                url: 'adicionartdoc',
                params: {
                    arrSub: Ext.encode(arrSub)
                },
                // waitMsg : 'Adicionando tipo documento ...',
                failure: function(form, action) {
                    if (action.result.codMsg == 1 || action.result.codMsg == 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        stTDoc.reload();
                        formtdoc.getForm().reset();
                        if (tipo == 'add')
                            winop.hide();
                    }
                }
            });
        } else
            mostrarMensaje(1,
                    'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s)');
    }
    function modificartdoc() {
        arrSub = new Array();
        arrSub = smSubmod.getSeleted()
        if (formtdoc.getForm().isValid()) {
            formtdoc.getForm().submit({
                url: 'modificartdoc',
                waitMsg: 'Actualizando tipo documento ...',
                params: {
                    idtdoc: smTDoc.getSelected().data.idtdoc,
                    arrSub: Ext.encode(arrSub)
                },
                failure: function(form, action) {
                    if (action.result.codMsg == 1 || action.result.codMsg == 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        stTDoc.reload();
                        formtdoc.getForm().reset();
                        winop.hide();
                    }
                }
            });
        } else
            mostrarMensaje(1,
                    'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
    }
    // Funciones Estado
    function eliminarasoc(record) {
        Ext.Ajax.request({
            url: 'eliminarestaosoc',
            params: {
                idtdoc: record.data.idtdoc,
                idestado: record.data.idestado
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                mostrarMensaje(responseData.codMsg, 'La asociaci&oacute;n'
                        + ((responseData.codMsg == 1)
                        ? ' ha sido'
                        : ' no se ha') + ' eliminado satisfactoriamente.');
                stEstasoc.reload({
                    params: {
                        idtdoc: idtdoc
                    }
                });
                stEstsasoc.reload({
                    params: {
                        idtdoc: idtdoc
                    }
                });
            }
        });
    }
    function ActualizarBotonesAsociar()
    {
        arrayidestadosparaasoc = [];
        btnAsociarEstado.disable();
        if (smGEstadosSinAsociar.hasSelection())
        {
            arrayrecords = smGEstadosSinAsociar.getSelections();
            totalrecords = arrayrecords.length;
            if (totalrecords > 0)
            {
                for (var i = 0; i < totalrecords; i++)
                {
                    arrayidestadosparaasoc[i] = arrayrecords[i].data.idestado;
                }
                btnAsociarEstado.enable();
            }
        }
    }
    function ActualizarBotonesDesAsociar()
    {
        btnDesAsociarEstado.disable();
        btnEstadoInicial.disable();
        btnQuitarEstadoInicial.disable();
        arrayidestadoparadesasoc = [];
        var inicialseleccionado = 0;
        if (smGEstadosAsociados.hasSelection())
        {
            arrayrecords = smGEstadosAsociados.getSelections();
            totalrecords = arrayrecords.length;
            if (totalrecords > 0)
            {
                for (var i = 0; i < totalrecords; i++)
                {
                    if (arrayrecords[i].data.inicial == 1)
                    {
                        inicialseleccionado = 1;
                    }
                    arrayidestadoparadesasoc[i] = arrayrecords[i].data.idestado;
                }
                if (totalrecords == 1 && arrayrecords[0].data.inicial == 0) {
                    btnEstadoInicial.enable();
                }
                if (totalrecords == 1 && arrayrecords[0].data.inicial == 1) {
                    btnQuitarEstadoInicial.enable();
                }
                if (inicialseleccionado == 0)
                {
                    btnDesAsociarEstado.enable();
                }
            }
        }
    }

    function PonerEstadoComoInicial(valor)
    {
        var accionprogreso = 'Estableciendo';
        var accionfinal = 'establecido';
        if (valor == 0) {
            accionprogreso = 'Quitando';
            accionfinal = 'quitado';
            mostrarMensaje(2, '¿Est&aacute; seguro que desea cambiar el comportamiento de este estado?', PonerEstadoInicial);
        } else {
            mostrarMensaje(2, '¿Est&aacute; seguro que desea cambiar el comportamiento de este estado?', PonerEstadoInicial);
        }
        function PonerEstadoInicial(btn)
        {
            if (btn == 'ok') {
                Ext.getBody().mask(accionprogreso + ' estado inicial..');
                Ext.Ajax.request({
                    url: 'modificarestadoinicial',
                    params: {
                        idestado: arrayidestadoparadesasoc[0],
                        idtdoc: idtdoc,
                        valor: valor
                    },
                    callback: function(options, success, response) {
                        Ext.getBody().unmask();
                        responseData = Ext.decode(response.responseText);
                        mostrarMensaje(
                                responseData.codMsg,
                                'El comportamiento del estado seleccionado' + ((responseData.codMsg == 1) ? ' ha sido cambiado satisfactoriamente.' : ' no se ha podido cambiar.'));
                        smGEstadosAsociados.clearSelections();
                        stGEstadosAsociados.reload();
                    }
                });
            } else {
                if (smGEstadosAsociados.hasSelection())
                    smGEstadosAsociados.clearSelections();
            }
        }
    }

    function AsociarEstados()
    {
        Ext.getBody().mask('Asociando estados..');
        Ext.Ajax.request({
            url: 'asociarestadotdoc',
            params: {
                idtdoc: idtdoc,
                arrEst: Ext.encode(arrayidestadosparaasoc)
            },
            callback: function(options, success, response) {
                Ext.getBody().unmask();
                responseData = Ext.decode(response.responseText);
                mostrarMensaje(
                        responseData.codMsg,
                        'El(los) estado(s)' + ((responseData.codMsg == 1) ? ' ha(n) sido asociado' : ' no se ha asociado') + ' satisfactoriamente.',
                        function() {
                            stGEstadosSinAsociar.removeAll();
                            stGEstadosSinAsociar.reload();
                            stGEstadosAsociados.removeAll();
                            stGEstadosAsociados.reload();
                            ActualizarBotonesAsociar();
                            ActualizarBotonesDesAsociar();
                        });
            }
        });
    }

    function DesAsociarEstados()
    {
        Ext.getBody().mask('Eliminando asociaci&oacute;n');
        Ext.Ajax.request({
            url: 'desasociarestadotdoc',
            params: {
                idtdoc: idtdoc,
                arrEst: Ext.encode(arrayidestadoparadesasoc)
            },
            callback: function(options, success, response) {
                Ext.getBody().unmask();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 2) {
                    mostrarMensaje(3, 'La(s) asociaci&oacute;n(es) no puede(n) ser eliminada(s) debido a que se encuentra(n) siendo utilizada(s) en transiciones existentes.');
                } else {
                    mostrarMensaje(
                            responseData.codMsg,
                            'Asociaci&oacute;n(es) eliminada(s)' + ((responseData.codMsg == 1) ? ' correctamte.' : ' incorrectamente.'),
                            function() {
                                stGEstadosSinAsociar.removeAll();
                                stGEstadosSinAsociar.reload();
                                stGEstadosAsociados.removeAll();
                                stGEstadosAsociados.reload();
                                ActualizarBotonesAsociar();
                                ActualizarBotonesDesAsociar();
                            });
                }
            }
        });
    }
}
CargarInterfaz();


