Utilidades.Cmp.Cmpexportarimportar = function () {
    var _this = this;
    this.stEscenarioActivo = null;
    this.escenario = null; //Tnteger que identifica el escenario activo.
    this.elemNewInsert = null;//arreglo de elementos nuevos insertados en la BD.
    this.elemRepetidos = null;//arreglo de elementos repetidos.
    this.tipoelemselec = null;//tipo de elemento seleccionado en el grid TGElemCoincidentes
    this.idimportacion = null;//id de importacion del elemento seleccionado en el grid TGElemCoincidentes
    this.cmpEscenarioActivo = null;
    this.fallos = null;
    var relacion = 0;
    var descendencia = 0;
    var repeticiones = 0;
    var sincronizar = 0;

    this.arrayDatosElementosExistentes = [];

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    /**
     * Nombre de la función ventanaExportarElemento
     * Descripcion  Permite Mostrar una ventana de confirmación.
     * @author Rodolfo Molinet
     * @param Ext.grid.RowSelectionModel sm - objeto que gestiona la selección de los elementos del escenario activo.
     * @param Integer tipo - tipo de elemento que se desea exportar.
     */
    this.ventanaExportarElemento = function (gp, sm, tipo, escenario) {
        descendencia = 0;
        relacion = 0;

        this.stcbformatos = new Ext.data.SimpleStore({
            id: 'stcbformato',
            fields: ['idformato', 'denominacion'],
            data: [
                ['.sipac', 'Formato de intercambio SIPAC'],
                //['.excel', 'Modelo de intercambio Excel (XLS-XLSX)']
                //['.vcs', 'Estándar internacional Calendario(vCal)'],
                ['.ics', 'Estándar internacional Calendario(iCal)']
            ]
        });

        this.stcbformatoexcel = new Ext.data.SimpleStore({
            id: 'stcbformatoexcel',
            fields: ['idformatoexcel', 'denominacion'],
            data: [
                ['.xls', 'Libro excel 97-2003(*.xls)'],
                ['.xlsx', 'Libro excel (*.xlsx)']
            ]
        });
        this.cbexportar = new Ext.form.ComboBox({
            fieldLabel: 'Forma de intercambio',
            store: _this.stcbformatos,
            valueField: 'idformato',
            hiddenName: 'idformato',
            displayField: 'denominacion',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            allowBlank: false,
            emptyText: 'Seleccione formato...',
            anchor: '100%',
            listeners: {
                select: function (combo, record, index) {
                    switch (record.data.idformato) {
                        case '.sipac':
                            Ext.getCmp('checksirelaciones').enable();
                            relacion = 0;

                            Ext.getCmp('checkdescendencia').disable();
                            Ext.getCmp('checkdescendencia').setValue(false);
                            descendencia = 0;

                            Ext.getCmp('checkrepeticiones').disable();
                            Ext.getCmp('checkrepeticiones').setValue(false);
                            repeticiones = 0;

                            Ext.getCmp('checksincronizar').disable();
                            Ext.getCmp('checksincronizar').setValue(false);
                            Ext.getCmp('tfsincronizar').disable();
                            Ext.getCmp('tfsincronizar').reset();
                            sincronizar = 0;
                            break;
                        case '.ics':
                            Ext.getCmp('checksirelaciones').disable();
                            Ext.getCmp('checksirelaciones').setValue(false);
                            relacion = 0;

                            Ext.getCmp('checkdescendencia').enable();
                            descendencia = 0;
                            Ext.getCmp('checkrepeticiones').enable();
                            descendencia = 0;
                            Ext.getCmp('checksincronizar').enable();
                            /*Ext.getCmp('tfsincronizar').enable();*/
                            sincronizar = 0;
                            break;
                    }

                }
            }
        });
        this.cbformatoexcel = new Ext.form.ComboBox({
            fieldLabel: 'Opción formato Excel',
            store: _this.stcbformatoexcel,
            valueField: 'idformatoexcel',
            hiddenName: 'idformatoexcel',
            displayField: 'denominacion',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            allowBlank: false,
            disabled: true,
            emptyText: 'Seleccione formato excel...',
            anchor: '100%'
        });
        this.fieldsetrelaciones = new Ext.form.FieldSet({
            title: 'Otros datos a exportar',
            autoHeight: true,
            defaults: {
                width: 100
            },
            layout: 'form',
            items: [{
                hideLabel: true,
                disabled: true,
                xtype: 'checkbox',
                id: 'checksirelaciones',
                boxLabel: "Incluir relaciones",
                bodyStyle: 'padding: 2px 2px 2px 2px;',
                anchor: '95%',
                listeners: {
                    check: function (checkbox, checked) {
                        if (checked)
                            relacion = 1;
                        else
                            relacion = 0;
                    }
                }
            }, {
                hideLabel: true,
                disabled: true,
                xtype: 'checkbox',
                id: 'checkdescendencia',
                boxLabel: "Incluir descendencia",
                bodyStyle: 'padding: 2px 2px 2px 2px;',
                anchor: '95%',
                listeners: {
                    check: function (checkbox, checked) {
                        if (checked)
                            descendencia = 1;
                        else
                            descendencia = 0;
                    }
                }
            }, {
                hideLabel: true,
                disabled: true,
                xtype: 'checkbox',
                id: 'checkrepeticiones',
                boxLabel: "Incluir repeticiones",
                bodyStyle: 'padding: 2px 2px 2px 2px;',
                anchor: '95%',
                listeners: {
                    check: function (checkbox, checked) {
                        if (checked)
                            repeticiones = 1;
                        else
                            repeticiones = 0;
                    }
                }
            }, {
                hideLabel: true,
                disabled: true,
                xtype: 'checkbox',
                id: 'checksincronizar',
                boxLabel: "Sincronizar con el dominio:",
                bodyStyle: 'padding: 2px 2px 2px 2px;',
                anchor: '95%',
                listeners: {
                    check: function (checkbox, checked) {
                        if (checked) {
                            sincronizar = 1;
                            Ext.getCmp('tfsincronizar').enable();
                        } else {
                            sincronizar = 0;
                            Ext.getCmp('tfsincronizar').disable();
                            Ext.getCmp('tfsincronizar').reset();
                        }
                    }
                }
            }, {
                hideLabel: true,
                disabled: true,
                xtype: 'textfield',
                maxLength: 255,
                maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
                id: 'tfsincronizar',
                allowBlank: false,
                vtype: 'validarEspaciosEnBlanco',
                bodyStyle: 'padding: 2px 2px 2px 2px;',
                anchor: '65%'
            }]
        });

        _this.fpExportar = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1,
                        layout: 'form',
                        items: [_this.cbexportar]
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: [_this.fieldsetrelaciones]
                    }]
            }]
        });

        if (_this.winExportar) {
            _this.winExportar.destroy();
        }
        _this.winExportar = new Ext.Window({
            modal: true,
            constrain: true,
            closeAction: 'hide',
            layout: 'fit',
            title: SetTitleMensaje(tipo),
            width: 320,
            height: 340,
            resizable: false,
            keys: [{
                key: Ext.EventObject.ENTER,
                fn: function () {
                    if (_this.fpExportar.getForm().isValid()) {
                        var idformato = _this.cbexportar.getValue();
                        if (_this.cbexportar.getValue() == '.excel')
                            idformato = _this.cbformatoexcel.getValue();
                        _this.exportarelemento(sm, tipo, relacion, descendencia, idformato, escenario);
                        _this.winExportar.destroy();
                    } else {
                        mostrarMensaje(1, 'Existe(n) algún(os) campo(s) con valor(es) incorrecto(s) o vacío(s).');
                        return;
                    }
                },
                scope: this
            }],
            listeners: {
                hide: function (win) {
                    sm.clearSelections();
                    gp.getView().refresh(true);
                    _this.fpExportar.getForm().reset();
                }
            },
            buttons: [{
                iconCls: 'cancelar',
                text: 'Cancelar',
                tooltip: 'Cerrar ventana',
                handler: function () {
                    _this.winExportar.hide();
                }
            }, {
                iconCls: 'aceptar',
                text: 'Aceptar',
                cls: 'btn-wrap x-btn x-btn-text-icon  x-btn-focus',
                tooltip: 'Continuar exportaci&oacute;n y cerrar ventana',
                handler: function () {
                    if (_this.fpExportar.getForm().isValid()) {
                        var idformato = _this.cbexportar.getValue();
                        if (_this.cbexportar.getValue() == '.excel')
                            idformato = _this.cbformatoexcel.getValue();
                        _this.exportarelemento(sm, tipo, relacion, descendencia, idformato, escenario);

                    } else {
                        mostrarMensaje(1, 'Existe(n) algún(os) campo(s) con valor(es) incorrecto(s) o vacío(s).');
                    }
                }
            }],
            items: [_this.fpExportar]
        });
        _this.winExportar.doLayout();
        _this.winExportar.show();

        function SetTitleMensaje(tipo) {
            if (tipo != 5) {
                if (sm.getSelections().length > 1)
                    return title = 'Exportar elementos';
                else
                    return title = 'Exportar elemento';
            } else {
                if (sm.getSelections().length > 1)
                    return title = 'Exportar Arcs';
                else
                    return title = 'Exportar Arc';
            }
        }

        function SetMensaje(tipo) {
            /*if(tipo !=5){
             if(sm.getSelections().length > 1)
             return title = 'Exportar relaciones';
             else
             return title = 'Exportar relaciones';
             } else {
             if(sm.getSelections().length > 1)
             return title = 'Exportar relaciones';
             else
             return title = 'Exportar relaciones';
             }*/
            return title = 'Exportar relaciones';
        }
    };

    /**
     * Nombre de la función DevolverActivImport
     * Descripcion  Permite exportar elementos de planificación dependiendo del escenario activo..
     * @author Ariadna Rendón Artola, Rodolfo Molinet
     * @param Ext.grid.RowSelectionModel sm - objeto que gestiona la selección de los elementos del escenario activo.
     * @param Integer tipo - tipo de elemento que se desea exportar.
     */
    this.exportarelemento = function (sm, tipo, relacion, descendencia, idformato, escenario) {

        var procede = 1;
        var dominioSincronizar = Ext.getCmp('tfsincronizar').getValue();
        if (sincronizar == 1 && (dominioSincronizar == undefined || dominioSincronizar == null || dominioSincronizar == '')) {
            procede = 0;
        }
        if (procede == 1) {
            var arrayID = [], rows = sm.getSelections();
            Ext.each(rows, function (rec) {
                if (tipo != 5)
                    arrayID.push(rec.data.idelemento);
                else
                    arrayID.push(rec.data.idarc);
            });
            var wCfg = 'titlebar=yes,status=yes,resizable=yes,width=' + screen.width + ',height=' + screen.height + ',scrollbars=' + 1;
            var ventana = window.open('/planificacion/pdo/plan/index.php/cmpexportarimportar/exportar?arrayidelementos=' + Ext.encode(arrayID) + "&tipoelemento=" + tipo + "&relacion=" + relacion + "&descendencia=" + descendencia + "&repeticiones=" + repeticiones + "&sincronizar=" + sincronizar + "&dominioSincronizar=" + dominioSincronizar + "&opcionformato=" + idformato + "&escenario=" + escenario);

            sm.clearSelections();
            _this.winExportar.hide();
        } else {
            Ext.getCmp('tfsincronizar').markInvalid('Este campo es obligatorio.');
        }
    };
    /**
     * Nombre de la función showPagTBEscenarioActivo.
     * Descripcion  Permite modificar el pagingtoolbar dependiendo del escenario activo. Solo se muestra el boton de actualizar.
     * @author Ariadna Rendón Artola
     */
    this.showPagTBEscenarioActivo = function () {
        _this.paginado.items[4].show();
        _this.paginado.items[0].hide();
        _this.paginado.items[1].hide();
        _this.paginado.items[2].hide();
        _this.paginado.items[3].hide();
    };
    /**
     * Nombre de la función DevolverActivImport.
     * Descripcion  Permite importar elementos de planificación dependiendo del escenario activo.
     * @author Ariadna Rendón Artola
     * @param Integer tipoelem - tipo de elemento que se desea exportar.
     * @param Ext.data.Store st - objeto gestiona los elementos que se muestran en el escenario activo.
     * @param Ext.*(contenedor) cmp - objeto contenedor del escenario activo.(Se utiliza para indicar que se mostrará solo elementos importados cambiando el título del escenario.)
     */
    this.showCmpImportar = function (tipoelem, gp, cmp) {
        _this.escenario = tipoelem;
        _this.gpEscenarioActivo = gp;
        _this.stEscenarioActivo = gp.getStore();
        _this.smEscenarioActivo = gp.getSelectionModel();
        _this.cmpEscenarioActivo = cmp;
        _this.paginado = gp.getBottomToolbar().items;

        if (!this.winImportar) {
            this.winImportar = new Ext.Window({
                modal: true,
                constrain: true,
                closeAction: 'hide',
                layout: 'fit',
                title: 'Importar archivo',
                width: 510,
                height: 'auto',
                border: false,
                resizable: false,
                keys: [{
                    key: Ext.EventObject.ENTER,
                    fn: function () {
                        importarDatos();
                    },
                    scope: this
                }],
                items: [{
                    xtype: 'form',
                    id: 'fpimportar',
                    fileUpload: true,
                    width: 500,
                    frame: true,
                    autoHeight: true,
                    border: true,
                    margin: '2 2 2 2',
                    margins: '2 2 2 2',
                    bodyStyle: 'padding: 10px 5px 0px 10px;',
                    labelWidth: 60,
                    defaults: {
                        anchor: '96%',
                        allowBlank: false,
                        msgTarget: 'side'
                    },
                    items: [{
                        xtype: 'panel',
                        border: true,
                        margin: '5 5 5 5',
                        cmargin: '5 5 5 5',
                        frame: true,
                        html: '<div style = "text-align:justify text-format: 3px">' +
                        '<img align = "left" src="../../../comun/recursos/images/default/window/icon-info.gif" style="width:40px;height:40px;">' +
                        '<h4>Tenga en cuenta que pueden ocurrir fallos asociados a los nomencladores al realizar la operación ' +
                        'de importación. En el caso de que importe elementos que ya existan en el sistema deber&aacute; ' +
                        'de escoger cual de ellos se reemplazan o se mantienen.</h4>' +
                        '</div>'
                    }, {
                        html: '<br>'
                    }, {
                        xtype: 'fileuploadfield',
                        id: 'fileuploadfield',
                        emptyText: 'Seleccione archivo',
                        prevTab: 'btnAceptar',
                        fieldLabel: 'Direcci&oacute;n',
                        regex: /^.+\.(ics|sipac)$/i,//|ics|vcs
                        regexText: 'Solo archivos de formato SIPAC ó ICAL (ics).',//est&aacute;ndar internacional de Calendario(vCal-iCal)
                        name: 'file',
                        type: 'file',
                        buttonCfg: {
                            text: '',
                            iconCls: 'abrir'
                        }
                    }]
                }],
                buttons: [{
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    id: 'btnCancelar',
                    nextTab: 'btnAceptar',
                    tooltip: 'Cerrar ventana y terminar importaci&oacute;n',
                    handler: function () {
                        Ext.getCmp('fpimportar').getForm().reset();
                        _this.winImportar.hide();
                        _this.smEscenarioActivo.clearSelections();
                    }
                }, {
                    iconCls: 'aceptar',
                    id: 'btnAceptar',
                    prevTab: 'btnCancelar',
                    text: 'Aceptar',
                    nextTab: 'fileuploadfield',
                    tooltip: 'Continuar importaci&oacute;n y cerrar ventana',
                    handler: function () {
                        importarDatos();
                    }
                }]
            });
        }
        _this.winImportar.on('beforeshow', function () {
            Ext.getCmp('fileuploadfield').focus(true, 700);
        });
        _this.winImportar.doLayout();
        _this.winImportar.show();
        Ext.getCmp('fileuploadfield').focus(false, 1024);
    };
    /**
     * Nombre de la función showElemCoincidentes
     * Descripcion  Permite mostrar los elementos a importar que coinciden con la información persistente.
     * @author Ariadna Rendón Artola
     * @param Integer tipoelem - tipo de elemento que se desea exportar.
     * @param Ext.data.Store st - objeto gestiona los elementos que se muestran en el escenario activo.
     * @param Ext.*(contenedor) cmp - objeto contenedor del escenario activo.(Se utiliza para indicar que se mostrará solo elementos importados cambiando el título del escenario.)
     */
    this.showElemCoincidentes = function (activo, datos, fallos) {
        var control = true;
        /** COMPONENTES:  VISTA ELEMENTOS COINCIDENTES */
        this.stTGElemCoincidentes = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
            url: '/planificacion/pdo/plan/index.php/cmpexportarimportar/devolverDatosElementosHijos',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.importacion = _this.idimportacion;
                    st.baseParams.tipo = _this.tipoelemselec
                },
                load: function (st) {
                    _this.smTGElemCoincidentes.selectFirstRow();
                }
            },
            reader: new Ext.data.JsonReader({
                id: 'idelemento',
                root: "infhijos"
            }, [{
                name: 'idelemento'
            }, {
                name: 'denominacion'
            }, {
                name: '_parent'
            }, {
                name: '_is_leaf'
            }, {
                name: 'nombreautor'
            }, {
                name: 'tipoelem'
            }, {
                name: 'idimportacion'
            }
            ])
        });
        //permite cargar el store  stTGElemCoincidentes con los datos devueltos en importarDatos
        getArrayRecord(6, _this.stTGElemCoincidentes, datos);

        //para ordenar los datos que s e muestran en dependencia del tipo de elemento
        _this.stTGElemCoincidentes.sort("tipoelem", "ASC");

        this.smTGElemCoincidentes = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    if (control) {
                        Ext.getCmp('fset').expand(true);
                    }
                    var r = record.data;
                    _this.tipoelemselec = r.tipoelem;
                    getDatosElemCmp(r.tipoelem, r.idelemento);
                }
            }
        });


        this.TGElemCoincidentes = new Ext.ux.maximgb.treegrid.GridPanel({
            id: 'tg',
            store: _this.stTGElemCoincidentes,
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            stripeRows: true,
            bodyStyle: {
                padding: '1px'
            },
            region: 'center',
            monitorResize: true,
            border: false,
            height: 250,
            sm: _this.smTGElemCoincidentes,
            margins: '3 3 3 3',
            loadMask: {
                msg: 'Cargando elementos a importar'
            },
            root_title: 'Registro de elementos a importar',
            columns: [{
                header: '<center>CAR</center>',
                dataIndex: 'idelemento',
                width: 80,
                renderer: function (val) {
                    return "<center>" + val + "</center>";
                },
                sortable: true
            }, {
                header: '<center>' + "Denominaci&oacute;n" + '</center>',
                id: 'expandir',
                dataIndex: 'denominacion',
                sortable: true,
                renderer: MostrarImagenTipoElemento
            }, {
                header: '<center>' + "Autor" + '</center>',
                dataIndex: 'nombreautor',
                width: 90,
                sortable: true,
                renderer: function (val) {
                    return "<center>" + val + "</center>";
                }
            }, {
                hidden: true,
                dataIndex: 'tipoelem',
                sortable: true
            }],
            bbar: ['-', 'Leyenda: ', ' ',
                {
                    text: 'Plan',
                    iconCls: 'plan',
                    handler: function () {
                        filtraXTipo('0')
                    }
                }, ' ', ' ', ' ', ' ',
                {
                    text: 'ARC',
                    iconCls: 'arc',
                    handler: function () {
                        filtraXTipo('5')
                    }
                }, ' ', ' ', ' ', ' ',
                {
                    text: 'Objetivo',
                    iconCls: 'objetivo',
                    handler: function () {
                        filtraXTipo('1')
                    }
                }, ' ', ' ', ' ', ' ',
                //{text:'Criterio',iconCls:'criterio'},' ',' ',' ',' ',
                {
                    text: 'Actividad',
                    iconCls: 'actividad',
                    handler: function () {
                        filtraXTipo('3')
                    }
                }, ' ', ' ', ' ', ' ',
                {
                    text: 'FIP',
                    iconCls: 'fip',
                    handler: function () {
                        filtraXTipo('2')
                    }
                }, '-', '->',
                {
                    text: '',
                    iconCls: 'limpiar',
                    tooltip: 'Limpiar',
                    handler: function () {
                        filtraXTipo('', '', true);
                    }
                }
            ]
        });

        this.pVerComparacion = new Ext.Panel({
            frame: true,
            bodyStyle: {
                padding: '2px'
            },
            labelWidth: 6,
            layout: 'fit',
            monitorResize: true,
            items: [{
                xtype: 'fieldset',
                collapsible: true,
                id: 'fset',
                title: 'Ver comparaci&oacute;n',
                autoHeight: true,
                collapsed: true,
                layout: 'column',
                defaultType: 'panel',
                listeners: {
                    beforeexpand: function () {
                        control = false;
                        _this.winElemCoincidentes.setPagePosition(257, 5);
                        _this.winElemCoincidentes.setHeight(595);
                        _this.GPFallos.setHeight(419);
                    },
                    beforecollapse: function () {
                        control = true;
                        _this.winElemCoincidentes.setPagePosition(257, 41);
                        _this.winElemCoincidentes.setHeight(407);
                        _this.GPFallos.setHeight(234);
                    }
                },
                bbar: [{
                    xtype: 'checkbox',
                    boxLabel: 'Sobrescribir toda la informaci&oacute;n.',
                    labelSeparator: '',
                    id: 'chboxSobreescribir',
                    listeners: {
                        check: function (chb, checked) {
                            /* if(checked)
                             Ext.getCmp('btnImportar').enable();
                             else Ext.getCmp('btnImportar').disable();*/
                        }
                    }
                }],
                items: [{
                    columnWidth: .50,
                    height: 155,
                    items: [{
                        xtype: 'label',
                        html: '<b>Información a importar</b><br/>'
                    }, {
                        id: 'datosImport',
                        width: 268,
                        height: 140,
                        autoScroll: true,
                        bodyStyle: {
                            background: '#ffffff',
                            padding: '7px'
                        }
                    }]
                }, {
                    columnWidth: .50,
                    height: 155,
                    items: [{
                        xtype: 'label',
                        html: '<b>Información existente</b><br/>'
                    }, {
                        id: 'datosPersist',
                        width: 270,
                        height: 140,
                        autoScroll: true,
                        bodyStyle: {
                            background: '#ffffff',
                            padding: '7px'
                        }
                    }]
                }]
            }]
        });
        /* FIN COMPONENTES:  VISTA ELEMENTOS COINCIDENTES */

        /**  COMPONENTES:  VISTA FALLOS DE IMPORTACION */
        this.stGPFallos = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                id: 'idelemento',
                root: "infhijos"
            }, [{
                name: 'denominacion'
            }, {
                name: 'nomencladores'
            }, {
                name: 'tipoelem'
            }
            ])
        });

        //permite cargar el store  stGPFallos con los datos devueltos en importarDatos
        if (fallos) getFallos(fallos);

        //para ordenar los datos que s e muestran en dependencia del tipo de elemento y su denominacion
        _this.stGPFallos.sort("tipoelem", "ASC");
        // _this.stGPFallos.sort( "denominacion", "ASC");

        this.GPFallos = new Ext.grid.GridPanel({
            height: 234,
            store: _this.stGPFallos,
            trackMouseOver: false,
            disableSelection: true,
            loadMask: true,
            border: false,
            autoExpandColumn: 'den',
            viewConfig: {
                forceFit: true
            },
            columns: [new Ext.grid.RowNumberer(), {
                id: 'den', // id assigned so we can apply custom css (e.g. .x-grid-col-topic b { color:#333 })
                header: "Denominación",
                dataIndex: 'denominacion',
                width: 420,
                renderer: ObtenerFallos,
                sortable: true
            }],
            bbar: ['-', 'Leyenda: ', ' ',
                {
                    text: 'Plan',
                    iconCls: 'plan',
                    handler: function () {
                        filtraXTipo('0', _this.stGPFallos)
                    }
                }, ' ', ' ', ' ', ' ',
                {
                    text: 'ARC',
                    iconCls: 'arc',
                    handler: function () {
                        filtraXTipo('5', _this.stGPFallos)
                    }
                }, ' ', ' ', ' ', ' ',
                {
                    text: 'Objetivo',
                    iconCls: 'objetivo',
                    handler: function () {
                        filtraXTipo('1', _this.stGPFallos)
                    }
                }, ' ', ' ', ' ', ' ',
                //{text:'Criterio',iconCls:'criterio'},' ',' ',' ',' ',
                {
                    text: 'Actividad',
                    iconCls: 'actividad',
                    handler: function () {
                        filtraXTipo('3', _this.stGPFallos)
                    }
                }, ' ', ' ', ' ', ' ',

                {
                    text: 'FIP',
                    iconCls: 'fip',
                    handler: function () {
                        filtraXTipo('2', _this.stGPFallos)
                    }
                }, '-', '->',
                {
                    text: '',
                    //icon:perfil.dirImg+'limpiar.png',
                    iconCls: 'limpiar',
                    tooltip: 'Limpiar filtro.',
                    handler: function () {
                        filtraXTipo('', _this.stGPFallos, true);
                    }
                }]
        });

        this.pFallosImp = new Ext.Panel({
            title: 'Fallos de importación.',
            frame: true,
            bodyStyle: {
                padding: '2px'
            },
            layout: 'fit',
            monitorResize: true,
            items: [{
                xtype: 'fieldset',
                id: 'fsFallos',
                title: 'Nomencladores no definidos para los siguientes elementos.',
                autoHeight: true,
                defaults: {
                    width: 210
                },
                collapsed: false,
                layout: 'fit',
                items: [_this.GPFallos]
            }]
        });
        /*FIN COMPONENTES:  VISTA FALLOS DE IMPORTACION */
        this.tbElemCoincidentes = new Ext.TabPanel({
            activeTab: activo,
            height: 'auto',
            border: false,
            items: [
                {
                    title: 'Elementos que coinciden con la información existente.',
                    layout: 'anchor',
                    disabled: (activo == 1) ? true : false,
                    frame: true,
                    border: false,
                    autoHeight: true,
                    items: [_this.TGElemCoincidentes, _this.pVerComparacion]
                },
                _this.pFallosImp
            ]
        });
        this.winElemCoincidentes = new Ext.Window({
            modal: true,
            constrain: true,
            frame: true,
            shadow: false,
            closeAction: 'close',
            resizable: false,
            layout: 'fit',
            title: 'Detalles de importación.',
            width: 605,
            height: 407,
            border: false,
            items: [_this.tbElemCoincidentes],
            keys: [{
                key: Ext.EventObject.ENTER,
                fn: function () {
                    sobrescribirDatos();
                    _this.winElemCoincidentes.close();
                },
                scope: this
            }],
            buttons: [{
                iconCls: 'cancelar',
                text: 'Cancelar',
                tooltip: 'Cerrar ventana sin importar datos',
                hidden: (activo == 1) ? true : false,
                handler: function () {
                    //sobrescribirDatos();
                    cancelarImportacion();
                    _this.winElemCoincidentes.close();
                }
            }, {
                iconCls: 'aceptar',
                text: (activo != 1) ? 'Importar' : 'Aceptar',
                tooltip: 'Importar datos y cerrar ventana',
                id: 'btnImportar',
                cls: 'btn-wrap x-btn x-btn-text-icon  x-btn-focus',
                disabled: false,//(activo!=1)?true:false,
                handler: function () {
                    sobrescribirDatos();
                    _this.winElemCoincidentes.close();
                }
            }]
        });
        this.winElemCoincidentes.show();
    };
    /**
     * Nombre de la función MostrarImagenTipoElemento
     * Descripcion  Permite mostrar los iconos asociados a los elementos a importar que coinciden con la información persistente.
     * @author Ariadna Rendón Artola
     * @param Mixed volor - valor de la columna que se renderiza.
     */
    MostrarImagenTipoElemento = function (valor) {
        if (valor) {
            var length = valor.length;
            var temptipo = valor.charAt(length - 1);
            var tipo = parseInt(temptipo);
            var den = valor.substring(0, length - 1);
            switch (tipo) {
                case 0:
                    return '<span><img src="../../../comun/recursos/images/fam/plan.png" >' + ' ' + den + '</span>';

                case 1:
                    return '<span><img src="../../../comun/recursos/images/fam/obj_ejec.png" >' + ' ' + den + '</span>';

                case 2:
                    return '<span><img src="../../../comun/recursos/images/fam/books_open.gif" >' + ' ' + den + '</span>';

                case 3:
                    return '<span><img src="../../../comun/recursos/images/fam/act_ejec.png" >' + ' ' + den + '</span>';

                case 5:
                    return '<span><img src="../../../comun/recursos/images/fam/arc_ejec.png" >' + ' ' + den + '</span>';
            }
        }
    };
    /**
     * Nombre de la función ObtenerFallos
     * Descripcion  Permite mostrar los iconos asociados a los elementos a importar que presentan fallos en los nomencladores.
     * @author Ariadna Rendón Artola
     * @param Mixed valor - valor de la columna que se renderiza.
     * @param ClassCss p - es obligado pasarle este parametro pero no es utilizado en esta funcion.
     * @param Ext.data.Record r - record correspondiente al valor de la columna que se renderiza.
     */
    ObtenerFallos = function (val, p, r) {
        var titulo = '<b>' + MostrarImagenTipoElemento(val) + '</b>:';

        Ext.each(r.data['nomencladores'], function (t) {
            titulo += '<span> ' + t + '</span>, ';
        });
        titulo += '.';
        fallo = titulo.replace('>, .', '>');
        return fallo;
    };

    /** Nombre de la función filtraXTipo
     * Descripcion  Permite permite filtar los elementos de un store, si no se define un store por defecto trabaja con stTGElemCoincidentes definido en esta clase. .
     * @author Ariadna Rendón Artola
     * @param Integer tipo - tipo de elemento por el cual de filtrara.
     * @param Boolean  clear - True para limpiar el filtro.
     * @param Ext.data.Store st - Store que se pretende filtrar.
     */
    filtraXTipo = function (tipo, st, clear) {
        if (!st) st = _this.stTGElemCoincidentes;
        if (!clear && tipo)
            st.filter('tipoelem', tipo);
        else
            st.clearFilter(false);
    };

    /**
     * Nombre de la función showTemplate
     * Descripcion  Permite mostrar detalles los elementos señalados en el TreeGrid.
     * @author Ariadna Rendón Artola
     * @param Integer tipoelem - tipo de elemento que se desea importar.
     * @param Object datosAImport - objeto que recoge los datos del elemento a importar señalado.
     * @param Object datosPersistentes  - objeto que recoge los datos persistentes del elemento a importar señalado.
     */
    showTemplatesCmp = function (tipo, datosAImport, datosPersistentes) {
        var tplMarkup = [
            '<b>Denominación:</b> {denelemento}<br/>',
            '<b>Descripción:</b> {descelemento}<br/>',
            '<b>Fecha de inicio:</b> {fechainicio}<br/>',
            '<b>Fecha de fin:</b> {fechafin}<br/>',
            '<b>Estado de cumplimiento:</b> {estadocumplimiento}<br/>',
            '<b>Porciento de cumplimiento:</b> {gradocumplimiento}<br/>',
            '<b>Participantes:</b> {participante}<br/>',
            '<b>Dirigentes:</b> {dirigente}<br/>'
            //   '<b>Relaciones:</b> {relaciones}<br/>'
        ];
        tipo = tipo.toString();
        switch (tipo) {
            case '0':
            {//Plan
                tplMarkup.remove('<b>Dirigentes:</b> {dirigente}<br/>');
                tplMarkup.remove('<b>Participantes:</b> {participante}<br/>');
                // tplMarkup.remove( '<b>Relaciones:</b> {relaciones}<br/>');
                // tplMarkup.push( '<b>Categoría:</b> {categoria}<br/>');
            }
                break;
            case '1':
            {
            }
                break;//Objetivo
            case '2':
            {//FIP
                tplMarkup.remove('<b>Fecha de inicio:</b> {fechainicio}<br/>');
                tplMarkup.remove('<b>Fecha de fin:</b> {fechafin}<br/>');
                //  tplMarkup.remove( '<b>Relaciones:</b> {relaciones}<br/>');
                tplMarkup.push('<b>Fecha de emisión:</b> {fechaemision}<br/>',
                    '<b>Fecha de cumplimiento:</b> {fechacumplimiento}<br/>',
                    '<b>Fecha en que se cumplió:</b> {fechacumplio}<br/>',
                    '<b>Emite:</b> {emite}<br/>',
                    '<b>No. del FIP:</b> {numfip}<br/>');
            }
                break;
            case '3':
            {//Actividad
                tplMarkup.push('<b>Lugar:</b> {lugar}<br/>',
                    //'<b>Categoría:</b> {categoria}<br/>',
                    //'<b>Tipo de actividad:</b> {tipoact}<br/>',
                    '<b>Principal:</b> {esprincipal}<br/>',
                    '<b>Extraplan:</b> {extraplan}<br/>');
            }
                break;
            case '5':
            {//ARC
                tplMarkup.remove('<b>Estado de cumplimiento:</b> {estadocumplimiento}<br/>');
                tplMarkup.remove('<b>Porciento de cumplimiento:</b> {gradocumplimiento}<br/>');
                tplMarkup.remove('<b>Dirigentes:</b> {dirigente}<br/>');
                tplMarkup.remove('<b>Participantes:</b> {participante}<br/>');
                tplMarkup.push('<b>Fecha de creación:</b> {fechacreacion}<br/>'/*,'<b>Capítulo:</b> {numcapitulo}<br/>'*/);
            }
                break;
            default:
                break;
        }

        var tplElem = new Ext.Template(tplMarkup);
        var datosImport = Ext.getCmp('datosImport');
        var datosPersist = Ext.getCmp('datosPersist');

        tplElem.overwrite(datosImport.body, datosAImport/*{denominacion:'asdsdas',categoria:'dfsf',tipoact:'sdasdas',descrip:'sadasd',lugar:'cc', f_inicio:'sds',f_fin:'sdasd',principal:'zczc',estado:'zcz',porciento:'zcccc',participantes:'vvv',dirigentes:'sdda',relaciones:'asas'}*/);
        tplElem.overwrite(datosPersist.body, datosPersistentes/*{denominacion:'asdsdas',categoria:'dfsf',tipoact:'sdasdas',descrip:'sadasd',lugar:'cc', f_inicio:'sds',f_fin:'sdasd',principal:'zczc',estado:'zcz',porciento:'zcccc',participantes:'vvv',dirigentes:'sdda',relaciones:'asas'}*/);

    };
    /**
     * Nombre de la función getDatosElem
     * Descripcion  Permite obtener los datos del elemento señalado en el TreeGrid.
     * @author Ariadna Rendón Artola
     * @param Integer tipo - tipo de elemento que se desea importar.
     * @param Integer idelem - identificador del elemento.
     */
    getDatosElemCmp = function (tipo, idelem) {
        Ext.getCmp('fset').getEl().mask('Cargando');
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpexportarimportar/datosElementoComparacion',
            params: {
                tipoelemento: tipo,
                idelemento: idelem,
                importacion: _this.idimportacion
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                showTemplatesCmp(tipo, responseData.datosAImport, responseData.datosPersistentes);
                Ext.getCmp('fset').getEl().unmask();
            }
        });
    };
    /**
     * Nombre de la función cancelarImportacion
     * Descripcion  Eliminar fihero temporar creado durante el proceso de importación  .
     * @author Ariadna Rendón Artola
     */
    cancelarImportacion = function () {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpexportarimportar/cancelar',
            params: {
                idimportacion: _this.idimportacion
            }
        });
    };
    /**
     * Nombre de la función importarDatos
     * Descripcion  Permite importar nuevos los elementos del fichero a la BD. .
     * @author Ariadna Rendón Artola
     */
    importarDatos = function () {
        var fpimpotar = Ext.getCmp('fpimportar');
        if (fpimpotar.getForm().isValid()) {
            _this.winImportar.hide();
            fpimpotar.getForm().submit({
                url: '/planificacion/pdo/plan/index.php/cmpexportarimportar/importar',
                method: 'POST',
                waitMsg: 'Importando elementos...',
                params: {
                    escenario: _this.escenario
                },
                success: function (fp, accion) {
                    fpimpotar.getForm().reset();
                    var mensaje = "Los elementos han sido importados satisfactoriamente.";

                    if (accion.result.existenCoincidencias == 1) {
                        _this.arrayElementosExistentes = accion.result.arrayElementosExistentes;
                        _this.arrayElementosOriginales = accion.result.arrayElementosOriginales;
                        MostrarDatosExistentes();
                    } else {
                        switch (_this.escenario) {
                            case 3:
                                mensaje = "Las actividades han sido importadas satisfactoriamente.";
                                break;
                        }
                        mostrarMensaje(1, mensaje);
                        _this.stEscenarioActivo.reload();
                    }
                },
                failure: function (fp, accion) {
                    var respuesta = accion.result.respuesta;
                    if (respuesta != 0) {
                        mostrarMensaje(1, 'Ha ocurrido un error. La importaci&oacute;n no ha sido ejecutada correctamente.');
                    }
                }
            });
        }
    };
    /**
     * Nombre de la función sobrescribirDatos
     * Descripcion  Permite realizar una peticion asincrona enviado o no la información de sobrescribir la información persistente.Carga en el escenario activo los elementos que fueron finalmente importados.
     * @author Ariadna Rendón Artola
     * @param Integer tipo - tipo de elemento que se desea importar.
     */
    sobrescribirDatos = function () {
        var sobreesc;
        if (Ext.getCmp('chboxSobreescribir'))
            sobreesc = Ext.getCmp('chboxSobreescribir').getValue();
        _this.smEscenarioActivo.clearSelections();
        _this.cmpEscenarioActivo.getEl().mask("Cargando elementos importados");
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpexportarimportar/insertarInformacion',
            params: {
                tipoelemento: _this.escenario,
                sobrescribir: (sobreesc) ? sobreesc : false,
                idimportacion: _this.idimportacion
                //arrayIdElemInsert: Ext.encode(getIdElemByTipo())
            },
            callback: function (options, success, response) {
                var result = Ext.decode(response.responseText);
                if (result.codMsg != 3) {
                    var cantElem = result.campos.length;

                    if (_this.stEscenarioActivo && cantElem != 0) {
                        getArrayRecord(_this.escenario, _this.stEscenarioActivo, result.campos);   //forma un array de Ext.data.Record segun arreglo de datos y lo inserta en el store del escenario activo.
                        // _this.showPagTBEscenarioActivo();
                    }
                    _this.cmpEscenarioActivo.getEl().unmask();
                    //informa sobre los elementos que han sido importados segun el escenario activo.
                    getMSGImportado(cantElem);
                }
            }
        });
    };
    /**
     * Nombre de la función getMSGImportado
     * Descripcion  Permite mostrar msg-div informando sobre elementos importados relacionados con el escenario activo.
     * @author Ariadna Rendón Artola
     * @param Integer cantDatos - cantidad total de elementos importados.
     */
    getMSGImportado = function (cantDatos) {
        switch (_this.escenario) {
            case 0:
            {
                if (cantDatos > 0)
                    mostrarMensaje(1, 'Se ha(n) importado ' + cantDatos + ' Plan(es).');
                else
                    mostrarMensaje(1, 'No se han importado Planes.');
            }
                break;
            case 1:
                if (cantDatos > 0)
                    mostrarMensaje(1, 'Se ha(n) importado ' + cantDatos + ' Objetivo(s).');
                else
                    mostrarMensaje(1, 'No se han importado Objetivos.');
                break;
            case 2:
                if (cantDatos > 0)
                    mostrarMensaje(1, 'Se ha(n) importado ' + cantDatos + ' FIP(s).');
                else
                    mostrarMensaje(1, 'No se han importado FIPs.');
                break;
            case 3:
                if (cantDatos > 0)
                    mostrarMensaje(1, 'Se ha(n) importado ' + cantDatos + ' Actividad(es).');
                else
                    mostrarMensaje(1, 'No se han importado Actividades.');
                break;
            case 5:
                if (cantDatos > 0)
                    mostrarMensaje(1, 'Se ha(n) importado ' + cantDatos + ' ARC(s).');
                else
                    mostrarMensaje(1, 'No se han importado ARCs.');
                break;
        }
    };
    /**
     * Nombre de la función getArrayRecord
     * Descripcion  Permite obtener un arreglo de objetos Ext.data.Record y agrarlos en el store del escenario activo.
     * @author Ariadna Rendón Artola
     * @param Integer tipo - tipo de elemento que se desea importar.
     * @param Ext.data.Store st - store del escenario activo.
     * @param Array arraydatos - arreglo que contiene los elemento que han sido importados.
     */
    getArrayRecord = function (tipo, st, arraydatos) {

        var arrayCamp = [];
        switch (tipo) {
            case 0:
            {
                arrayCamp = [
                    {
                        name: 'idelemento'
                    }, {
                        name: 'denominacion'
                    }, {
                        name: 'categoria'
                    }, {
                        name: 'activo'
                    }, {
                        name: 'fechainicio'
                    }, {
                        name: 'fechafin'
                    }, {
                        name: 'desc'
                    }, {
                        name: '_parent'
                    }, {
                        name: '_is_leaf'
                    }, {
                        name: 'idestadoaprob'
                    }, {
                        name: 'nombreestadoaprob'
                    }, {
                        name: 'estadocumplimiento'
                    }, {
                        name: 'idusuariocrea'
                    }, {
                        name: 'nombreautor'
                    }, {
                        name: 'subordinado'
                    }, {
                        name: 'superior'
                    }, {
                        name: 'observaciones'
                    }, {
                        name: 'tipoelemento'
                    }
                ];
            }
                break;
            case 1:
            {
                arrayCamp = [
                    {
                        name: 'idelemento'
                    }, {
                        name: 'denominacion'
                    }, {
                        name: 'activo'
                    }, {
                        name: 'fechainicio'
                    }, {
                        name: 'fechafin'
                    }, {
                        name: '_parent'
                    }, {
                        name: '_is_leaf'
                    }, {
                        name: 'idestadoaprob'
                    }, {
                        name: 'nombreestadoaprob'
                    }, {
                        name: 'estadocumplimiento'
                    }, {
                        name: 'nombreautor'
                    }, {
                        name: 'subordinado'
                    }, {
                        name: 'superior'
                    }, {
                        name: 'observaciones'
                    }, {
                        name: 'criterios'
                    }, {
                        name: 'tipoelemento'
                    }, {
                        name: 'modificar'
                    }, {
                        name: 'eliminar'
                    }, {
                        name: 'idautor'
                    }
                ];
            }
                break;
            case 2:
            {
                arrayCamp = [
                    {
                        name: 'idelemento'
                    }, {
                        name: 'denominacion'
                    }, {
                        name: 'activo'
                    }, {
                        name: 'fechainicio'
                    }, {
                        name: 'fechafin'
                    }, {
                        name: '_parent'
                    }, {
                        name: '_is_leaf'
                    }, {
                        name: 'estadocumplimiento'
                    }, {
                        name: 'nombreautor'
                    }, {
                        name: 'subordinado'
                    }, {
                        name: 'superior'
                    }, {
                        name: 'observaciones'
                    }, {
                        name: 'tipoelemento'
                    }, {
                        name: 'modificar'
                    }, {
                        name: 'eliminar'
                    }, {
                        name: 'idautor'
                    }];
            }
                break;
            case 3:
            {
                arrayCamp = [
                    {
                        name: 'idelemento'
                    }, {
                        name: 'denominacion'
                    }, {
                        name: 'activo'
                    }, {
                        name: 'fechainicio'
                    }, {
                        name: 'fechafin'
                    }, {
                        name: '_parent'
                    }, {
                        name: '_is_leaf'
                    }, {
                        name: 'idestadoaprob'
                    }, {
                        name: 'nombreestadoaprob'
                    }, {
                        name: 'estadocumplimiento'
                    }, {
                        name: 'nombreautor'
                    }, {
                        name: 'subordinado'
                    }, {
                        name: 'superior'
                    }, {
                        name: 'observaciones'
                    }, {
                        name: 'modificar'
                    }, {
                        name: 'eliminar'
                    }, {
                        name: 'idautor'
                    }];
            }
                break;
            case 5:
            {
                arrayCamp = [
                    {
                        name: 'denom'
                    }, {
                        name: 'idarc'
                    }, {
                        name: 'fdesde'
                    }, {
                        name: 'fhasta'
                    }, {
                        name: 'activo'
                    }, {
                        name: 'autor'
                    }, {
                        name: 'idautor'
                    }, {
                        name: 'idarea'
                    }, {
                        name: 'descrip'
                    }, {
                        name: 'superior'
                    }, {
                        name: 'mod'
                    }, {
                        name: 'del'
                    }, {
                        name: '_parent'
                    }, {
                        name: '_is_leaf'
                    }
                ]
            }
                break;
            case 6:
            {
                arrayCamp = [
                    {
                        name: 'idelemento'
                    }, {
                        name: 'denominacion'
                    }, {
                        name: '_parent'
                    }, {
                        name: '_is_leaf'
                    }, {
                        name: 'nombreautor'
                    }, {
                        name: 'tipoelem'
                    }, {
                        name: 'idimportacion'
                    }
                ]
            }
                break;
        }

        var NewRecord = new Ext.data.Record.create(arrayCamp);
        var ArrayRecords = [];
        Ext.each(arraydatos, function (datos) {
            var newRecord = new NewRecord(datos);
            newRecord.id = (tipo != 5) ? datos['idelemento'] : datos['idarc'];
            ArrayRecords.push(newRecord);
        });
        st.removeAll();
        st.add(ArrayRecords);
        st.reload();
        /*if(tipo!=6)
         st.sort( (tipo!=5)?"idelemento":"idarc", "ASC");*/
    };
    /**
     * Nombre de la función getIdElemByTipo().
     * Descripcion  Permite obtener un arreglo con los id elementos del escenario activo.
     * @author Ariadna Rendón Artola
     */
    getIdElemByTipo = function () {
        var arrayIdElemByTipo = [];
        Ext.each(_this.elemNewInsert, function (e) {
            arrayIdElemByTipo.push(e.id)
        });
        return arrayIdElemByTipo;
    };
    /**
     * Nombre de la función getFallos().
     * Descripcion  Permite agregar record al store stGPFallos.
     * @author Ariadna Rendón Artola
     */
    getFallos = function (fallos) {
        if (fallos) {
            var NewRecord = new Ext.data.Record.create([
                {
                    name: 'idelemento'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'nomencladores'
                }, {
                    name: 'tipoelem'
                }]);
            for (indexfallo in fallos) {
                var cantRecIguales = _this.stGPFallos.find('denominacion', fallos[indexfallo].denominacion, null, true);
                if (cantRecIguales == -1) {
                    var datos = {};
                    datos.idelemento = parseInt(indexfallo);
                    datos.denominacion = fallos[indexfallo].denominacion;
                    datos.nomencladores = fallos[indexfallo].nomencladores;
                    datos.tipoelem = fallos[indexfallo].tipoelem;
                    var newRecord = new NewRecord(datos);
                    newRecord.id = parseInt(indexfallo);
                    _this.stGPFallos.add([newRecord]);
                }
            }
        }
    };

    function MostrarDatosExistentes() {
        //botones para el manejo de los datos existentes
        _this.btnIgnorarDatos = new Ext.Button({
            disabled: true,
            iconCls: 'desaprobar',
            tooltip: 'Ignorar coincidencia y mantener datos originales.',
            handler: function () {
                var accion = 'ignorar';
                DefinirElementosFinales(accion);
            }
        });
        _this.btnSobreescribirDatos = new Ext.Button({
            disabled: true,
            iconCls: 'aprobar',
            tooltip: 'Actualizar datos existentes con los datos importados.',
            handler: function () {
                var accion = 'actualizar';
                DefinirElementosFinales(accion);
            }
        });

        //store del grid para cargar los datos existentes
        _this.stDatosExistentes = new Ext.data.SimpleStore({
            fields: [
                {name: 'idelemento'},
                {name: 'denelemento'},
                {name: 'fechainicio'},
                {name: 'fechafin'},
                {name: 'horainicio'},
                {name: 'horafin'},
                {name: 'lugar'},
                {name: 'descelemento'},
                {name: 'dirigentes'},
                {name: 'participantes'}
            ]
        });
        //selection-mode del grid para cargar los datos existentes
        _this.smDatosExistentes = new Ext.grid.CheckboxSelectionModel({
            listeners: {
                rowselect: function (sm, rowIndex, record) {
                    ActualizarEstadoBarraHerramientas();
                },
                rowdeselect: function (sm, rowIndex, record) {
                    ActualizarEstadoBarraHerramientas();
                }
            }
        });
        //grid para cargar los datos existentes
        _this.gridDatosExistentes = new Ext.grid.GridPanel({
            title: "Listado de elementos coincidentes",
            store: _this.stDatosExistentes,
            sm: _this.smDatosExistentes,
            columns: [
                _this.smDatosExistentes,
                {header: "CAR", sortable: true, dataIndex: 'idelemento', width: 100},
                {header: "Denominaci&oacute;n", sortable: true, dataIndex: 'denelemento', id: 'denelemento'}
            ],
            stripeRows: true,
            autoExpandColumn: 'denelemento'
        });

        CargarDatosGridElementosExistentes(_this.gridDatosExistentes);

        //plantilla para mostrar los datos existentes en comparacion
        _this.htmlTpl = [
            '<div style="width: 100%;height: 100%;float:left;display:block;">',
            '<div style="width: 47%;height:auto;float:left;display:block; padding:7px 7px 7px 7px;">',
            '<div style="width: 100%;height: auto;float:left;display:block;background-color:#99bbe8;border-radius:5px;font-weight:bold;font-size:13px;padding-top:2px;padding-bottom:2px;text-align:center;">',
            'Existente',
            '</div>',
            '</div>',
            '<div style="width: 47%;height: auto;float:left;display:block;border-left: 1px solid #99bbe8;padding:7px 7px 7px 7px;">',
            '<div style="width: 100%;height: auto;float:left;display:block;background-color:#99bbe8;border-radius:5px;font-weight:bold;font-size:13px;padding-top:2px;padding-bottom:2px;text-align:center;">',
            'Importado',
            '</div>',
            '</div>',
            '<div style="width: 100%;height: auto;float:left;display:block;">',
            '<div style="background-color:#dfe8f6;width: 47%;height: auto;float:left;display:block;font-size:12px;padding:7px;border-right:1px solid #99bbe8">',
            '<div style="float:left;font-weight:bold;display:block;width:auto;text-decoration:underline;">Denominaci&oacute;n : </div> {denelementoOrig}',
            '</div>',
            '<div style="width: 47%;height: auto;float:left;display:block;font-size:12px;padding:7px;background-color:{colorDenominacionExist} ">',
            '<div style="float:left;font-weight:bold;display:block;width:auto;text-decoration:underline;">Denominaci&oacute;n : </div> {denelementoExist}',
            '</div>',
            '</div>',
            '<div style="width: 100%;height: auto;float:left;display:block;">',
            '<div style="background-color:#dfe8f6;width: 47%;height: auto;float:left;display:block;font-size:12px;padding:7px;border-right:1px solid #99bbe8">',
            '<div style="float:left;font-weight:bold;display:block;width:auto;text-decoration:underline;">Descripci&oacute;n : </div> {descelementoOrig}',
            '</div>',
            '<div style="width: 47%;height: auto;float:left;display:block;font-size:12px;padding:7px;background-color:{colorDescripcionExist}">',
            '<div style="float:left;font-weight:bold;display:block;width:auto;text-decoration:underline;">Descripci&oacute;n : </div> {descelementoExist}',
            '</div>',
            '</div>',
            '<div style="width: 100%;height: auto;float:left;display:block;">',
            '<div style="background-color:#dfe8f6;width: 47%;height: auto;float:left;display:block;font-size:12px;padding:7px;border-right:1px solid #99bbe8">',
            '<div style="float:left;font-weight:bold;display:block;width:auto;text-decoration:underline;">Fecha de inicio : </div> {fechainicioOrig}',
            '</div>',
            '<div style="width: 47%;height: auto;float:left;display:block;font-size:12px;padding:7px;background-color:{colorFechaInicioExist}" >',
            '<div style="float:left;font-weight:bold;display:block;width:auto;text-decoration:underline;">Fecha de inicio : </div> {fechainicioExist}',
            '</div>',
            '</div>',
            '<div style="width: 100%;height: auto;float:left;display:block;">',
            '<div style="background-color:#dfe8f6;width: 47%;height: auto;float:left;display:block;font-size:12px;padding:7px;border-right:1px solid #99bbe8">',
            '<div style="float:left;font-weight:bold;display:block;width:auto;text-decoration:underline;">Fecha fin : </div> {fechafinOrig}',
            '</div>',
            '<div style="width: 47%;height: auto;float:left;display:block;font-size:12px;padding:7px;background-color:{colorFechaFinExist} ">',
            '<div style="float:left;font-weight:bold;display:block;width:auto;text-decoration:underline;">Fecha fin : </div> {fechafinExist}',
            '</div>',
            '</div>',
            '<div style="width: 100%;height: auto;float:left;display:block;">',
            '<div style="background-color:#dfe8f6;width: 47%;height: auto;float:left;display:block;font-size:12px;padding:7px;border-right:1px solid #99bbe8">',
            '<div style="float:left;font-weight:bold;display:block;width:auto;text-decoration:underline;">Hora inicio : </div> {horainicioOrig}',
            '</div>',
            '<div style="width: 47%;height: auto;float:left;display:block;font-size:12px;padding:7px;background-color:{colorHoraInicioExist} ">',
            '<div style="float:left;font-weight:bold;display:block;width:auto;text-decoration:underline;">Hora inicio : </div> {horainicioExist}',
            '</div>',
            '</div>',
            '<div style="width: 100%;height: auto;float:left;display:block;">',
            '<div style="background-color:#dfe8f6;width: 47%;height: auto;float:left;display:block;font-size:12px;padding:7px;border-right:1px solid #99bbe8">',
            '<div style="float:left;font-weight:bold;display:block;width:auto;text-decoration:underline;">Hora fin : </div> {horafinOrig}',
            '</div>',
            '<div style="width: 47%;height: auto;float:left;display:block;font-size:12px;padding:7px;background-color:{colorHoraFinExist} ">',
            '<div style="float:left;font-weight:bold;display:block;width:auto;text-decoration:underline;">Hora fin : </div> {horafinExist}',
            '</div>',
            '</div>',
            '<div style="width: 100%;height: auto;float:left;display:block;">',
            '<div style="background-color:#dfe8f6;width: 47%;height: auto;float:left;display:block;font-size:12px;padding:7px;border-right:1px solid #99bbe8">',
            '<div style="float:left;font-weight:bold;display:block;width:auto;text-decoration:underline;">Lugar : </div> {lugarOrig}',
            '</div>',
            '<div style="width: 47%;height: auto;float:left;display:block;font-size:12px;padding:7px;background-color:{colorLugarExist} ">',
            '<div style="float:left;font-weight:bold;display:block;width:auto;text-decoration:underline;">Lugar : </div> {lugarExist}',
            '</div>',
            '</div>',
            '<div style="width: 100%;height: auto;float:left;display:block;">',
            '<div style="background-color:#dfe8f6;width: 47%;height: auto;float:left;display:block;font-size:12px;padding:7px;border-right:1px solid #99bbe8">',
            '<div style="float:left;font-weight:bold;display:block;width:auto;text-decoration:underline;">Dirigentes : </div> {dirigentesOrig}',
            '</div>',
            '<div style="width: 47%;height: auto;float:left;display:block;font-size:12px;padding:7px;background-color:{colorDirigentesExist} ">',
            '<div style="float:left;font-weight:bold;display:block;width:auto;text-decoration:underline;">Dirigentes : </div> {dirigentesExist}',
            '</div>',
            '</div>',
            '<div style="width: 100%;height: auto;float:left;display:block;">',
            '<div style="background-color:#dfe8f6;width: 47%;height: auto;float:left;display:block;font-size:12px;padding:7px;border-right:1px solid #99bbe8">',
            '<div style="float:left;font-weight:bold;display:block;width:auto;text-decoration:underline;">Participantes : </div> {participantesOrig}',
            '</div>',
            '<div style="width: 47%;height: auto;float:left;display:block;font-size:12px;padding:7px;background-color:{colorParticipantesExist} ">',
            '<div style="float:left;font-weight:bold;display:block;width:auto;text-decoration:underline;">Participantes : </div> {participantesExist}',
            '</div>',
            '</div>',
            '</div>'
        ];
        _this.comparacionTpl = new Ext.Template(_this.htmlTpl);

        //ventana para mostrar los datos existentes
        _this.winDatosExistentes = new Ext.Window({
            title: 'Coincidencias en la importaci&oacute;n',
            width: 800,
            height: 600,
            layout: 'border',
            draggable: true,
            resizable: false,
            modal: true,
            frame: true,
            tbar: [_this.btnSobreescribirDatos, ' ', _this.btnIgnorarDatos],
            items: [
                {
                    xtype: 'panel',
                    region: 'north',
                    height: 200,
                    collapsable: true,
                    collapsed: false,
                    layout: 'fit',
                    items: [_this.gridDatosExistentes]
                }, {
                    region: 'center',
                    id: 'detallesComparacion',
                    bodyStyle: {
                        background: '#ffffff'
                    },
                    html: '<div style="text-align:center;padding:20px;width: 100%;float:left;display:block;">Por favor seleccione una coincidencia para comparar sus datos</div>'
                }
            ],
            buttons: [{
                iconCls: 'salir',
                text: 'Cerrar',
                tooltip: 'Cerrar ventana',
                handler: function () {
                    CerrarVentanaComparacion();
                }
            }]
        });
        _this.winDatosExistentes.show();
    }


    function CargarDatosGridElementosExistentes(storeGrid) {

        var elementoExistenteDataRecord = Ext.data.Record.create([
            {name: 'idelemento'},
            {name: 'denelemento'},
            {name: 'descelemento'},
            {name: 'fechainicio'},
            {name: 'fechafin'},
            {name: 'horainicio'},
            {name: 'horafin'},
            {name: 'lugar'},
            {name: 'dirigentes'},
            {name: 'participantes'}
        ]);

        if (_this.arrayElementosExistentes.length > 0) {
            for (var i = 0; i < _this.arrayElementosExistentes.length; i++) {
                var elementoExistenteRecord = new elementoExistenteDataRecord({
                    idelemento: _this.arrayElementosExistentes[i].idelemento,
                    denelemento: _this.arrayElementosExistentes[i].denelemento,
                    descelemento: _this.arrayElementosExistentes[i].descelemento,
                    fechainicio: _this.arrayElementosExistentes[i].fechainicio,
                    fechafin: _this.arrayElementosExistentes[i].fechafin,
                    horainicio: _this.arrayElementosExistentes[i].horainicio,
                    horafin: _this.arrayElementosExistentes[i].horafin,
                    lugar: _this.arrayElementosExistentes[i].lugar,
                    dirigentes: _this.arrayElementosExistentes[i].dirigentes,
                    participantes: _this.arrayElementosExistentes[i].participantes
                });
                _this.stDatosExistentes.add(elementoExistenteRecord);
            }
        }
    }

    function ActualizarEstadoBarraHerramientas() {
        _this.btnIgnorarDatos.disable();
        _this.btnSobreescribirDatos.disable();
        _this.arrayDatosElementosExistentes = [];
        var seleccionados = 0;
        if (_this.smDatosExistentes.hasSelection()) {
            var arrayrecords = _this.smDatosExistentes.getSelections();
            var totalrecords = arrayrecords.length;
            if (totalrecords > 0) {
                seleccionados = 1;
                _this.btnIgnorarDatos.enable();
                _this.btnSobreescribirDatos.enable();

                for (var i = 0; i < totalrecords; i++) {
                    var elementoseleccionado = {};
                    var indiceRecord = _this.stDatosExistentes.indexOf(arrayrecords[i]);
                    elementoseleccionado = {
                        idelemento: arrayrecords[i].data.idelemento,
                        denelemento: arrayrecords[i].data.denelemento,
                        tipoelemento: 3,
                        fechainicio: arrayrecords[i].data.fechainicio,
                        horainicio: arrayrecords[i].data.horainicio,
                        fechafin: arrayrecords[i].data.fechafin,
                        horafin: arrayrecords[i].data.horafin,
                        descelemento: arrayrecords[i].data.descelemento,
                        dirigentes: arrayrecords[i].data.dirigentes,
                        participantes: arrayrecords[i].data.participantes,
                        lugar: arrayrecords[i].data.lugar,
                        indiceRecord: indiceRecord

                    };
                    _this.arrayDatosElementosExistentes.push(elementoseleccionado);
                    if (totalrecords == 1) {
                        CompararDatosElementosExistentes(_this.arrayDatosElementosExistentes[0].indiceRecord);
                    } else {
                        seleccionados = totalrecords;
                    }
                }
            }
        }
        if (seleccionados != 1) {
            MostrarTplInicial();
        }
    }


    function CompararDatosElementosExistentes(indice) {
        var colorDenominacionExist = "#dfe8f6";
        if (_this.arrayDatosElementosExistentes[0].denelemento != _this.arrayElementosOriginales[indice].denelemento) {
            colorDenominacionExist = "#F6CECE";
        }
        var colorDescripcionExist = "#dfe8f6";
        if (_this.arrayDatosElementosExistentes[0].descelemento != _this.arrayElementosOriginales[indice].descelemento) {
            colorDescripcionExist = "#F6CECE";
        }
        var colorFechaInicioExist = "#dfe8f6";
        if (_this.arrayDatosElementosExistentes[0].fechainicio != _this.arrayElementosOriginales[indice].fechainicio) {
            colorFechaInicioExist = "#F6CECE";
        }
        var colorFechaFinExist = "#dfe8f6";
        if (_this.arrayDatosElementosExistentes[0].fechafin != _this.arrayElementosOriginales[indice].fechafin) {
            colorFechaFinExist = "#F6CECE";
        }
        var colorHoraInicioExist = "#dfe8f6";
        if (_this.arrayDatosElementosExistentes[0].horainicio != _this.arrayElementosOriginales[indice].horainicio) {
            colorHoraInicioExist = "#F6CECE";
        }
        var colorHoraFinExist = "#dfe8f6";
        if (_this.arrayDatosElementosExistentes[0].horafin != _this.arrayElementosOriginales[indice].horafin) {
            colorHoraFinExist = "#F6CECE";
        }
        if (_this.arrayElementosOriginales[indice].lugar == null) {
            _this.arrayElementosOriginales[indice].lugar = "";
        }
        if (_this.arrayDatosElementosExistentes[0].lugar == null) {
            _this.arrayDatosElementosExistentes[0].lugar = "";
        }
        var colorLugarExist = "#dfe8f6";
        if (_this.arrayDatosElementosExistentes[0].lugar != _this.arrayElementosOriginales[indice].lugar) {
            colorLugarExist = "#F6CECE";
        }
        if (_this.arrayElementosOriginales[indice].participantes == null) {
            _this.arrayElementosOriginales[indice].participantes = "";
        }
        if (_this.arrayDatosElementosExistentes[0].participantes == null) {
            _this.arrayDatosElementosExistentes[0].participantes = "";
        }
        var colorParticipantesExist = "#dfe8f6";
        if (_this.arrayDatosElementosExistentes[0].participantes != _this.arrayElementosOriginales[indice].participantes) {
            colorParticipantesExist = "#F6CECE";
        }
        if (_this.arrayElementosOriginales[indice].dirigentes == null) {
            _this.arrayElementosOriginales[indice].dirigentes = "";
        }
        if (_this.arrayDatosElementosExistentes[0].dirigentes == null) {
            _this.arrayDatosElementosExistentes[0].dirigentes = "";
        }
        var colorDirigentesExist = "#dfe8f6";
        if (_this.arrayDatosElementosExistentes[0].dirigentes != _this.arrayElementosOriginales[indice].dirigentes) {
            colorDirigentesExist = "#F6CECE";
        }
        var data = {};
        data = {
            'denelementoExist': _this.arrayDatosElementosExistentes[0].denelemento,
            'descelementoExist': _this.arrayDatosElementosExistentes[0].descelemento,
            'fechainicioExist': _this.arrayDatosElementosExistentes[0].fechainicio,
            'fechafinExist': _this.arrayDatosElementosExistentes[0].fechafin,
            'horainicioExist': _this.arrayDatosElementosExistentes[0].horainicio,
            'horafinExist': _this.arrayDatosElementosExistentes[0].horafin,
            'lugarExist': _this.arrayDatosElementosExistentes[0].lugar,
            'dirigentesExist': _this.arrayDatosElementosExistentes[0].dirigentes,
            'participantesExist': _this.arrayDatosElementosExistentes[0].participantes,

            'denelementoOrig': _this.arrayElementosOriginales[indice].denelemento,
            'descelementoOrig': _this.arrayElementosOriginales[indice].descelemento,
            'fechainicioOrig': _this.arrayElementosOriginales[indice].fechainicio,
            'fechafinOrig': _this.arrayElementosOriginales[indice].fechafin,
            'horainicioOrig': _this.arrayElementosOriginales[indice].horainicio,
            'horafinOrig': _this.arrayElementosOriginales[indice].horafin,
            'lugarOrig': _this.arrayElementosOriginales[indice].lugar,
            'dirigentesOrig': _this.arrayElementosOriginales[indice].dirigentes,
            'participantesOrig': _this.arrayElementosOriginales[indice].participantes,

            'colorDenominacionExist': colorDenominacionExist,
            'colorDescripcionExist': colorDescripcionExist,
            'colorFechaInicioExist': colorFechaInicioExist,
            'colorFechaFinExist': colorFechaFinExist,
            'colorHoraInicioExist': colorHoraInicioExist,
            'colorHoraFinExist': colorHoraFinExist,
            'colorLugarExist': colorLugarExist,
            'colorDirigentesExist': colorDirigentesExist,
            'colorParticipantesExist': colorParticipantesExist
        };
        var panelDetallesComparacion = Ext.getCmp('detallesComparacion');
        _this.comparacionTpl.overwrite(panelDetallesComparacion.body, data);
    }

    function DefinirElementosFinales(accion) {
        var mensajeEspera = 'Actualizando datos existentes.';
        if (accion == 'ignorar') {
            mensajeEspera = 'Ignorando coincidencias.';
        }
        _this.BarraProgreso.show(mensajeEspera);

        var arrayIdElementosExistentes = [];
        var arrayIdElementosOriginales = [];
        for (var i = 0; i < _this.arrayDatosElementosExistentes.length; i++) {
            var indice = _this.arrayDatosElementosExistentes[i].indiceRecord;
            var idElementoOriginal = _this.arrayElementosOriginales[indice].idelemento;
            arrayIdElementosOriginales[i] = idElementoOriginal;
        }
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpexportarimportar/definirElementosFinales',
            params: {
                arrayElementosExistentes: Ext.encode(_this.arrayDatosElementosExistentes),
                arrayIdElementosOriginales: Ext.encode(arrayIdElementosOriginales),
                accion: accion
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                var mensaje = '';
                var icono = 1;
                if (responseData.respuesta == 1) {
                    if (accion == 'ignorar') {
                        mensaje = 'La acci&oacute;n ha sido ejecutada satisfactoriamente.';
                    } else {
                        mensaje = 'Los datos existentes han sido actualizados satisfactoriamente.';
                    }
                }
                if (responseData.respuesta == 2) {
                    mensaje = 'Las actividades que usted trata de ' + accion + ' ya no existen.';
                }
                mostrarMensaje(icono, mensaje);
                if (_this.arrayDatosElementosExistentes.length == _this.arrayElementosExistentes.length) {
                    _this.arrayElementosExistentes = [];
                    _this.arrayElementosOriginales = [];

                    _this.winDatosExistentes.destroy();
                    _this.stEscenarioActivo.reload();
                } else {
                    for (var i = 0; i < _this.arrayDatosElementosExistentes.length; i++) {
                        var indiceRecord = _this.arrayDatosElementosExistentes[i].indiceRecord;
                        var record = _this.stDatosExistentes.getAt(indiceRecord);
                        _this.stDatosExistentes.remove(record);
                        _this.smDatosExistentes.clearSelections();
                        _this.arrayElementosExistentes.splice(indiceRecord, 1);
                        _this.arrayElementosOriginales.splice(indiceRecord, 1);
                    }
                    MostrarTplInicial();
                }
                _this.arrayDatosElementosExistentes = [];
            }
        });
    }

    function CerrarVentanaComparacion() {
        _this.arrayElementosExistentes = [];
        _this.arrayElementosOriginales = [];
        _this.arrayDatosElementosExistentes = [];
        _this.winDatosExistentes.destroy();
        _this.stEscenarioActivo.reload();
    }

    function MostrarTplInicial() {
        var data = {};
        var originalHtmlTpl = [
            '<div style="text-align:center;padding:20px;width: 100%;float:left;display:block;">Por favor seleccione una coincidencia para comparar sus datos</div>'
        ];
        var originalTpl = new Ext.Template(originalHtmlTpl);
        var panelDetallesComparacion = Ext.getCmp('detallesComparacion');
        originalTpl.overwrite(panelDetallesComparacion.body, data);
    }

};

///NO BORRAR***
// bbar:[_this.ptbTGElemCoincidentes,'->','Resultados por p&aacute;gina : ',_this.cbpaginado]
/*
 this.stcbpaginado = new Ext.data.SimpleStore({
 fields: ['idnumpag', 'dennumpag'],
 data :[
 [10, '10'],
 [20, '20'],
 [40, '40'],
 [80, '80']
 ]
 });
 //combo del modo donde muestro la cantidad de elementos por paginas del grid
 this.cbpaginado = new Ext.form.ComboBox({
 value:10,
 store: _this.stcbpaginado,
 displayField:'dennumpag',
 typeAhead: true,
 mode: 'local',
 forceSelection: true,
 triggerAction: 'all',
 selectOnFocus:true,
 hiddenName: 'idnumpag',
 valueField: 'idnumpag',
 width:50,
 emptyText:'Seleccionar',
 listeners:{
 select :function(cb,record,index)	{
 _this.stTGElemCoincidentes.removeAll();
 _this.stTGElemCoincidentes.reload({params:{anode:null}});
 _this.ptbTGElemCoincidentes.pageSize = record.data.idnumpag;
 _this.ptbTGElemCoincidentes.doLoad(_this.ptbTGElemCoincidentes.cursor);
 }
 }
 });
 this.ptbTGElemCoincidentes =  new Ext.ux.maximgb.treegrid.PagingToolbar({
 pageSize: _this.cbpaginado.getValue(),
 store: _this.stTGElemCoincidentes,
 width  :350,
 displayInfo: true
 });*/
/*,'-','->','Sobreescribir: ',' ',{
 xtype:'checkbox',
 //boxLabel: 'Sobreescribir',
 labelSeparator:'',
 id: 'chboxSobreescribir'
 }, '   '
 */
