var perfil = window.parent.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.labels = Object();
UCID.portal.cargarEtiquetas('cuentabancaria', cargarInterfaz);

function cargarInterfaz() {
    perfil.labels = arguments[1];

    var accion = 0;
    var identidad = -1;

    var stExportarcuenta = new Ext.data.SimpleStore({
        fields: [
            {name: 'idpersona'},
            {name: 'cod_tipid'},
            {name: 'cod_paexid'},
            {name: 'numid'},
            {name: 'papel'},
            {name: 'sapel'},
            {name: 'nombrecompleto'},
            {name: 'nombreyapellidos'},
            {name: 'dir_perso1'},
            {name: 'dir_perso2'},
            {name: 'dir_perso3'},
            {name: 'est_mlc'},
            {name: 'nom_mnac'},
            {name: 'num_ideben'},
            {name: 'ap1_benef'},
            {name: 'ap2_benef'},
            {name: 'nombre_b'},
            {name: 'cta_mnac'},
            {name: 'cta_mlc'}
        ]
    });

    var tplCuentaBancaria = new Ext.data.Record.create(
        {name: 'idpersona'},
        {name: 'cod_tipid'},
        {name: 'cod_paexid'},
        {name: 'numid'},
        {name: 'papel'},
        {name: 'sapel'},
        {name: 'nombrecompleto'},
        {name: 'nombreyapellidos'},
        {name: 'dir_perso1'},
        {name: 'dir_perso2'},
        {name: 'dir_perso3'},
        {name: 'est_mlc'},
        {name: 'nom_mnac'},
        {name: 'num_ideben'},
        {name: 'ap1_benef'},
        {name: 'ap2_benef'},
        {name: 'nombre_b'},
        {name: 'cta_mnac'},
        {name: 'cta_mlc'}
    );

    var btnAyuda = new Ext.Button({
        iconCls: 'ayuda',
        text: 'Ayuda',
        tooltip: 'Ayuda',
    });

    var btnSearchPerson = new Ext.Button({
        iconCls: 'buscar',
        text: 'Buscar persona',
        tooltip: 'Buscar persona sin n&uacute;mero de cuenta',
        handler: CargarVentana
    });

    var btnExportarCuenta = new Ext.Toolbar.MenuButton({
        id: 'btnExportarCuenta',
        text: 'Exportar',
        tooltip: '',
        iconCls: 'exportar',
        menu: {
            items: [
                {
                    id: 'cup',
                    //disabled: true,
                    text: 'Moneda CUP'
                }, {
                    id: 'cuc',
                    //disabled: true,
                    text: 'Moneda CUC'
                }
            ]
        }
    });

    var gpExportarcuenta = new Ext.grid.EditorGridPanel({
        store: stExportarcuenta,
        region: 'center',
        border: false,
        width: 200,
        autoScroll: true,
        columns: [{header: 'idpersona', dataIndex: 'idpersona', width: 100, hidden: true, hideable: false},
            new Ext.grid.RowNumberer(),
            {
                dataIndex: 'cod_tipid',
                header: 'COD_TIPID',
                width: 80,
                hideable: false,
                renderer: this.fnRenderExportar,
                sortable: true
            },
            {
                dataIndex: 'cod_paexid',
                header: 'COD_PAEXID',
                width: 80,
                hideable: false,
                renderer: this.fnRenderExportar,
                sortable: true
            },
            {
                dataIndex: 'numid',
                header: 'NUM_IDEPER',
                width: 100,
                hideable: false,
                renderer: this.fnRenderExportar,
                sortable: true
            },
            {
                dataIndex: 'papel',
                header: 'APELLIDO_1',
                width: 100,
                hideable: false,
                renderer: this.fnRenderExportar,
                sortable: true
            },
            {
                dataIndex: 'sapel',
                header: 'APELLIDO_2',
                width: 100,
                hideable: false,
                renderer: this.fnRenderExportar,
                sortable: true
            },
            {
                dataIndex: 'nombrecompleto',
                header: 'NOMBRE',
                width: 100,
                hideable: false,
                renderer: this.fnRenderExportar,
                sortable: true
            },
            {
                dataIndex: 'nombreyapellidos',
                header: 'NOMBRE_APELL',
                width: 100,
                hideable: false,
                renderer: this.fnRenderExportar,
                sortable: true
            },
            {
                dataIndex: 'dir_perso1',
                header: 'DIR_PERSO 1',
                width: 100,
                hideable: false,
                renderer: this.fnRenderExportar,
                sortable: true
            },
            {
                dataIndex: 'dir_perso2',
                header: 'DIR_PERSO 2',
                width: 100,
                hideable: false,
                renderer: this.fnRenderExportar,
                sortable: true
            },
            {
                dataIndex: 'dir_perso3',
                header: 'DIR_PERSO 3',
                width: 100,
                hideable: false,
                renderer: this.fnRenderExportar,
                sortable: true
            },
            {
                dataIndex: 'est_mlc',
                header: 'EST_MLC',
                width: 100,
                hideable: false,
                renderer: this.fnRenderExportar,
                sortable: true
            },
            {
                dataIndex: 'nom_mnac',
                header: 'NOM_MNAC',
                width: 100,
                hideable: false,
                renderer: this.fnRenderExportar,
                sortable: true
            },
            {
                dataIndex: 'num_ideben',
                header: 'NUM_IDEBEN',
                width: 100,
                hideable: false,
                renderer: this.fnRenderExportar,
                sortable: true
            },
            {
                dataIndex: 'ap1_benef',
                header: 'AP1_BENEF',
                width: 100,
                hideable: false,
                renderer: this.fnRenderExportar,
                sortable: true
            },
            {
                dataIndex: 'ap2_benef',
                header: 'AP2_BENEF',
                width: 100,
                hideable: false,
                renderer: this.fnRenderExportar,
                sortable: true
            },
            {
                dataIndex: 'nombre_b',
                header: 'NOMBRE_B',
                width: 100,
                hideable: false,
                renderer: this.fnRenderExportar,
                sortable: true
            },
            {
                dataIndex: 'cta_mnac',
                header: 'CTA_MNAC',
                width: 100,
                hideable: false,
                renderer: this.fnRenderExportar,
                sortable: true
            },
            {
                dataIndex: 'cta_mlc',
                header: 'CTA_MLC',
                width: 100,
                hideable: false,
                renderer: this.fnRenderExportar,
                sortable: true
            }
        ],
        tbar: [btnSearchPerson, btnExportarCuenta],
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    //Menu button del exportar .dbf al banco
    btnExportarCuenta.menu.items.get('cup').setHandler(function () {
        ExportarDBF(1);
    });

    btnExportarCuenta.menu.items.get('cuc').setHandler(function () {
        ExportarDBF(2);
    });

    //Panel de estructura y composición que cargo hasta el nivel de entidades.
    var pEstEntidades = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
        layout: 'border',
        nivel: 5
    });
    var btnAceptarEntidades = new Ext.Button({
        id: 'btnAceptarEntidades',
        text: 'Aceptar',
        tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
        disabled: true,
        iconCls: 'aceptar'
    });
    var winEstEntidades = new Ext.Window({
        title: 'Entidades',
        modal: true,
        height: 350,
        width: '30%',
        constrain: true,
        closable: false,
        resizable: false,
        layout: 'fit',
        items: [pEstEntidades],
        buttons: [btnAceptarEntidades],
        keys: [
            {
                key: Ext.EventObject.ENTER,
                stopEvent: true,
                fn: function () {
                    btnAceptarEntidades.handler();
                }
            }
        ]
    });

    function CargarVentana() {
        winEstEntidades.show();//Eventos del objeto del árbol de entidades.

        pEstEntidades.on('estructuraselecionada', function (o, nodo) {
            identidad = nodo.id;
            btnAceptarEntidades.enable();
        });

        btnAceptarEntidades.setHandler(function () {
            var objbuscarpersona = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
                heigth: '50%',
                width: '100%',
                region: 'center',
                modulo: 'NOMINA',
                identidad: identidad,
                singleSelect: false,
                funcionalidad: 'ACB',
                cantidadPorPaginas: 15
            });

            var win = new Ext.Window({
                title: 'Buscar persona',
                modal: true,
                height: 200,
                constrain: true,
                width: 800,
                closable: true,
                layout: 'border',
                items: [objbuscarpersona],
                buttons: [{
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    tooltip: 'Cerrar ventana',
                    handler: function () {
                        win.close();
                    }
                }, {
                    iconCls: 'seleccion',
                    text: 'Seleccionar',
                    tooltip: 'Seleccionar personas',
                    handler: function () {
                        var seleccion = objbuscarpersona.getSelectedRows();

                        if (seleccion.length > 0) {
                            var idpersons = new Array();

                            Ext.each(seleccion, function (rec) {
                                idpersons.push(rec.get('idpersona'));
                            });

                            stExportarcuenta.each(function (record) {
                                if (stExportarcuenta.getCount() > 0) {
                                    idpersons.push(record.get('idpersona'));
                                }

                            });


                            PVD.mostrarMascara('msgLoadPersons', 'Por favor espere...', 'Cargando personas');
                            Ext.Ajax.request({
                                url: 'getDataToExport',
                                method: 'POST',
                                params: {
                                    personas: Ext.encode(idpersons)
                                },
                                callback: function (options, success, response) {
                                    var rpt = Ext.decode(response.responseText);
                                    if (rpt.error != 'ok') {
                                        mostrarMensaje(3, 'Las personas <b>' + rpt.error + '</b> no tienen una direcci&oacute;n particular asignada en el <b>Registro de personas</b>.');
                                    }

                                    Ext.each(rpt.datos, function (datos) {
                                        var flag = true;
                                        stExportarcuenta.findBy(function (record, id) {

                                            if (datos.idpersona == record.get('idpersona')) {
                                                flag = false;
                                            }
                                        });
                                        if (flag) {
                                            var record = new tplCuentaBancaria(datos);
                                            stExportarcuenta.add(record);
                                        }
                                    });
                                    PVD.ocultarMascara('msgLoadPersons');
                                    win.close();
                                }
                            });
                        }
                    }
                }]
            });

            objbuscarpersona.CambiarEntidad(identidad);
            objbuscarpersona.Buscar();

            objbuscarpersona.on('personaselecionada', function (sel) {
                btnAceptarBuscarPersona.enable();
            }.createDelegate(this));

            var btnAceptarBuscarPersona = new Ext.Button({
                id: 'btnAceptarBuscarPersona',
                iconCls: 'aceptar',
                text: 'Aceptar',
                disabled: true,
                tooltip: 'Aceptar'
            });
            win.show();
            win.maximize();
            winEstEntidades.hide();
        });
    }

    function ExportarDBF(moneda) {
        var idpersona = new Array();
        stExportarcuenta.each(function (record) {
            if (stExportarcuenta.getCount() > 0) {
                idpersona.push(record.get('idpersona'));
            }
        });

        if (stExportarcuenta.getCount() == 0) {
            mostrarMensaje(3, 'No se puede generar el archivo <b>.DBF</b>, debe haber al menos una persona para la personalización.');
            return;
        }
        Ext.Ajax.request({
            url: 'ExportDbf',
            method: 'POST',
            params: {
                datadbf: Ext.encode(idpersona),
                moneda: moneda
            },
            callback: function (options, success, response) {
                var respuesta = Ext.decode(response.responseText);
                if (respuesta.codigo == 'OK') {
                    window.open(respuesta.url);
                } else if (respuesta.codigo == 'NOCREADBF') {
                    mostrarMensaje(3, 'No se pudo exportar a formato .DBF.');
                } else if (respuesta.codigo == 'NODIRECCION') {
                    mostrarMensaje(3, 'Las personas <b>' + respuesta.error +
                        '</b> no tienen una direcci&oacute;n particular asignada en el <b>Registro de personas</b>.');
                } else {
                    mostrarMensaje(3, 'Error en el momento de exportar a formato .DBF.');
                }
            }.createDelegate(this)
        });
    }

    var v = new Ext.Viewport({
        layout: 'border',
        items: [gpExportarcuenta]
    });
}

