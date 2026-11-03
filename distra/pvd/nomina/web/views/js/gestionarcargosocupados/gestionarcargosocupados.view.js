Ext.ns('Pvd.Nomina.Pagos.GestionarCargosOcupados');
//Tipo de layout auxiliar
Ext.ns('Ext.ux.layout');
Ext.ux.layout.RowLayout = Ext.extend(Ext.layout.ContainerLayout, {
    // private
    monitorResize: true,

    // private
    isValidParent: function (c, target) {
        return c.getEl().dom.parentNode == this.innerCt.dom;
    },

    // private
    onLayout: function (ct, target) {
        var rs = ct.items.items, len = rs.length, r, i;

        if (!this.innerCt) {
            target.addClass('ux-row-layout-ct');
            this.innerCt = target.createChild({cls: 'x-row-inner'});
        }
        this.renderAll(ct, this.innerCt);

        var size = target.getViewSize();

        if (size.width < 1 && size.height < 1) { // display none?
            return;
        }

        var h = size.height - target.getPadding('tb'),
            ph = h;

        this.innerCt.setSize({height: h});

        // some rows can be percentages while others are fixed
        // so we need to make 2 passes

        for (i = 0; i < len; i++) {
            r = rs[i];
            if (!r.rowHeight) {
                ph -= (r.getSize().height + r.getEl().getMargins('tb'));
            }
        }

        ph = ph < 0 ? 0 : ph;

        for (i = 0; i < len; i++) {
            r = rs[i];
            if (r.rowHeight) {
                r.setSize({height: Math.floor(r.rowHeight * ph) - r.getEl().getMargins('tb')});
            }
        }
    }

    /**
     * @property activeItem
     * @hide
     */
});
Ext.Container.LAYOUTS['ux.row'] = Ext.ux.layout.RowLayout;
Ext.QuickTips.init();

//Vista del componente Gestionar cargos ocupados.
Pvd.Nomina.Pagos.GestionarCargosOcupados.Vista = {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Gestionar cargos ocupados (Tipo: Pvd.Nomina.Pagos.GestionarCargosOcupados.Modelo).
     */
    init: function (perfil, idioma, modelo, date) {
        this.idpersona = 0;
        this.identidad = null;
        this.idpersonacuentabancariamn = null;
        this.idpersonacuentabancariacuc = null;
        var self = this;
        //Panel de estructura y composición que cargo hasta el nivel de entidades.
        this.pEstEntidades = new Ext.pvd.persona.buscarestructura.panelBuscarestructura(
            {
                layout: 'border',
                nivel: 5
            });

        //Botón  para cargar las personas pertenecientes a la unidad selecionada.
        this.btnCargarPersonas = new Ext.Button({
            id: 'idbtnCargarEntidad',
            text: idioma.btnAceptar,
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            //icon: perfil.dirImg+'aceptar.png',
            iconCls: 'aceptar',
            prevTab: 'idbtnCargarEntidad',
            nextTab: 'idbtnCargarEntidad'
        });

        //Vista para el componente Buscar estructura 
        this.winEstEntidades = new Ext.Window({
            title: idioma.winEstructura,
            modal: true,
            height: 350,
            width: '30%',
            closable: false,
            constrain: true,
            resizable: false,
            layout: 'fit',
            items: [this.pEstEntidades],
            buttons: [this.btnCargarPersonas],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnCargarPersonas.handler();
                    }
                }
            ]
        });

        //Botón  para adicionar el cargo de la persona selecionada.
        this.btnAdicionar = new Ext.Button({
            id: 'idbtnAdicionar',
            text: 'Ad<u>i</u>cionar',
            tooltip: 'Ad<u>i</u>cionar cargos ocupados (<b>Alt+I</b>)',
            //icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            disabled: true,
            prevTab: 'idbtnEliminar',
            nextTab: 'idbtnModificar',
        });

        //Botón  para modificar el cargo de la persona selecionada.
        this.btnModificar = new Ext.Button({
            id: 'idbtnModificar',
            text: '<u>M</u>odificar',
            tooltip: '<u>M</u>odificar conceptos contables (<b>Alt+M</b>)',
            // icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            disabled: true,
            prevTab: 'idbtnAdicionar',
            nextTab: 'idbtnEliminar'
        });

        //Botón para eliminar el cargo de la persona selecionada.
        this.btnEliminar = new Ext.Button({
            id: 'idbtnEliminar',
            text: idioma.btnEliminar,
            tooltip: 'Eliminar conceptos contables (<b>DEL</b>)',
            // icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            disabled: true,
            prevTab: 'idbtnModificar',
            nextTab: 'idbtnAdicionar'
        });
        //Boton para actualizar las aperturas de las cuentas
       /* this.btnActualizarApt = new Ext.Button({
            id: 'idbtnActualizar',
            text: 'Actualizar',
            disabled: true,

            tooltip: 'Actulalizar aperturas de cuentas ',
            // icon: perfil.dirImg+'eliminar.png',
            iconCls: 'actualizar',
            //disabled: true,

        });*/


        this.btnExportar = new Ext.Toolbar.MenuButton({
            text: 'Exportar',
            tooltip: 'Exportar',
            iconCls: 'exportar',
            // disabled:true,
            menu: {
                items: [
                    {
                        text: 'Listado de Personas, Centros de Costo y Cuenta Bancaria.',
                        handler: function (items, p) {
                            var winload = new Ext.PVD.comun.window.winLoad({
                                title: 'Por favor espere...',
                                mensaje: 'Generando reporte'
                            });
                            winload.showMask();

                            window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/gestionarcargosocupados/exportarPdf?identidad=' + self.identidad);
                            winload.close();
                        }
                    }
                    /*    , {
                     text: 'Descuentos por persona',
                     handler:function(items,p){
                     var winload = new Ext.PVD.comun.window.winLoad({
                     title:'Por favor espere...',
                     mensaje:'Generando reporte'
                     });
                     winload.showMask();

                     window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/gestionarcargosocupados/exportarPdfdescuentos?identidad=' + self.identidad );
                     winload.close();

                     }
                     } */]
            }
        });


        //Boton para adicionar numero contable de la persona
        this.btnAdicionarNC = new Ext.Button({
            id: 'idbtnAdicionarNC',
            text: 'Ad<u>i</u>cionar',
            tooltip: 'Ad<u>i</u>cionar n&uacute;mero contable (<b>Alt+I</b>)',
            //icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            disabled: true,
            prevTab: 'idbtnEliminarNC',
            nextTab: 'idbtnModificarNC'
        });

        //Boton para modificar numero contable de la persona
        this.btnModificarNC = new Ext.Button({
            id: 'idbtnModificarNC',
            text: '<u>M</u>odificar',
            tooltip: '<u>M</u>odificar n&uacute;mero contable (<b>DEL</b>)',
            // icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            disabled: true,
            prevTab: 'idbtnAdicionarNC',
            nextTab: 'idbtnEliminarNC'
        });

        //Boton para eliminar numero contable de la persona
        this.btnEliminarNC = new Ext.Button({
            id: 'idbtnEliminarNC',
            text: idioma.btnEliminar,
            tooltip: 'Elimnar  n&uacute;mero contable (<b>DEL</b>)',
            // icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            disabled: true,
            prevTab: 'idbtnModificarNC',
            nextTab: 'idbtnAdicionarNC'
        });

        //Boton para obtener el SNC-225 de una persona.
        this.btnExportaSNC = new Ext.Button({
            id: 'idbtnbtnExportaSNC',
            disabled: true,
            text: 'SNC-225',
            iconCls: 'exportar',
            // icon : perfil.dirImg + 'exportar.png',
            tooltip: 'Exportar SNC-225'
        });

        //Botón para actualizar el cargo de las persona selecionada a partir de Movimientos Laborales.
        this.btnActualizarMovimientosPersonasCargos = new Ext.Button({
            id: 'btnActualizarMovimientosPersonasCargos',
            text: 'Actualizar Cargos',
            tooltip: 'Actualizar los Cargos de las Personas Seleccionadas desde Movimientos Laborales',
            // icon: perfil.dirImg+'eliminar.png',
            iconCls: 'actualizar',
            disabled: true,
        });

        this.btnActualizarCargos = new Ext.Toolbar.MenuButton({
            id: 'btnActualizarCargos',
            iconCls: 'actualizar',
            text: 'Sync Cargos',
            tooltip: 'Elimina los idcargos que no existen en Estructura en Plantilla Nominal, Conf. Pago por Resultados y Nomenclador de Areas',
            menu: {
                items: [
                    {
                        text: 'Entidad', handler: function (items, p) {
                    }
                    }, {
                        text: 'General', handler: function (items, p) {
                        }
                    }
                ]
            }
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            iconCls: 'ayuda',
            //icon: perfil.dirImg + 'ayuda.png',
            text: 'Ayuda',
            tooltip: 'Ayuda de la funcionalidad',

        });

        //Panel de buscar personas pertenecientes a una entidad.
        this.pPersonas = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
            height: 300,
            width: '45%',
            split: true,
            singleSelect: false,
            region: 'west',
            cantidadPorPaginas: 5000,
            modulo: 'NOMINA',
            funcionalidad: 'GCO',
            // cliente: 'MINFAR',
            campocolores: 'idcargosocupados'
        });

        this.expanderobservacionCargoActual = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;<b>Observaci&oacute;n:</b>&nbsp;{observaciones}</p><br/></div>'
            ), enableCaching: false
        });

        this.expanderobservacionCagoHistorico = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;<b>Observaci&oacute;n:</b>&nbsp;{observaciones}</p><br/></div>'
            ), enableCaching: false
        });

        this.expanderCargo = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Cargo:&nbsp;{caminocargo}</p><br/></div>'
            ), enableCaching: false
        });

        this.expanderCargoHistorico = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Cargo:&nbsp;{caminocargo}</p><br/></div>'
            ), enableCaching: false
        });

        //Colunmodel del grid de cargos ocupados.
        this.cmCargosPersona = [this.expanderCargo, {
            header: 'idcargosocupados',
            hideable: false,
            hidden: true,
            dataIndex: 'idcargosocupados'
        }, {
            header: 'idpersona',
            hideable: false,
            hidden: true,
            dataIndex: 'idpersona'
        }, {
            header: 'idcargo',
            hideable: false,
            hidden: true,
            dataIndex: 'idcargo'
        }, {
            header: 'identidad',
            hideable: false,
            hidden: true,
            dataIndex: 'identidad'
        }, {
            header: 'idcajacajero',
            hideable: false,
            hidden: true,
            dataIndex: 'idcajacajero'
        }, {
            header: 'idsituacionlaboral',
            hideable: false,
            hidden: true,
            dataIndex: 'idsituacionlaboral'
        }, {
            header: 'idplantillanominal',
            hideable: false,
            hidden: true,
            dataIndex: 'idplantillanominal'
        }, {
            header: 'idcentrocosto',
            hideable: false,
            hidden: true,
            dataIndex: 'idcentrocosto'
        }, {
            header: 'idpersonacuentabancariamn',
            hideable: false,
            hidden: true,
            dataIndex: 'idpersonacuentabancariamn'
        }, {
            header: 'cuentabancariamn',
            hideable: false,
            hidden: true,
            dataIndex: 'cuentabancariamn'
        }, {
            header: 'idpersonacuentabancariacuc',
            hideable: false,
            hidden: true,
            dataIndex: 'idpersonacuentabancariacuc'
        }, {
            header: 'cuentabancariacuc',
            hideable: false,
            hidden: true,
            dataIndex: 'cuentabancariacuc'
        }/*,{
         header: 'idcentrogrupo',
         hideable : false ,
         hidden: true,
         dataIndex: 'idcentrogrupo'
         }*/, {
            header: 'denomcentrocosto',
            hideable: false,
            hidden: true,
            dataIndex: 'denomcentrocosto'
        }, {
            //header: idioma.lbCargo,
            width: 150,
            hidden: true,
            dataIndex: 'denomcargo'
        }, {
            header: idioma.lbCargo,
            width: 150,
            dataIndex: 'denomcargoiconos'
        }, {
            header: idioma.lbSituacion,
            width: 50,
            dataIndex: 'denomsituacionlaboral'
        }, {
            header: 'Plantilla nominal',
            width: 80,
            dataIndex: 'plantilla'
        }, {
            header: 'Centro costo',
            width: 80,
            dataIndex: 'denomccosto'
        }, {
            header: 'N. contable',
            width: 50,
            dataIndex: 'numerocontable',
            hidden: true
        }, {
            header: idioma.lbFecharegistro,
            width: 80,
            type: 'date',
            dataIndex: 'fecharegistro'
        }, {
            header: idioma.lbFechaaplicacion,
            width: 80,
            type: 'date',
            dataIndex: 'fechaaplicacion'
        }/*, {
            header: idioma.lbFechavencimiento,
            width: 50,
            type: 'date',
            dataIndex: 'fechavencimiento'
        }*/
        ];

        //Colunmodel del grid de cargos ocupados historico.
        this.cmCargosPersonaHistorico = [this.expanderCargoHistorico, {
            header: 'idhiscargosocupados',
            hideable: false,
            hidden: true,
            dataIndex: 'idhiscargosocupados'
        }, {
            header: 'idpersona',
            hideable: false,
            hidden: true,
            dataIndex: 'idpersona'
        }, {
            header: 'idcargo',
            hideable: false,
            hidden: true,
            dataIndex: 'idcargo'
        }, {
            header: 'identidad',
            hideable: false,
            hidden: true,
            dataIndex: 'identidad'
        }, {
            header: 'idsituacionlaboral',
            hideable: false,
            hidden: true,
            dataIndex: 'idsituacionlaboral'
        }, {
            header: 'idpersonacuentabancaria',
            hideable: false,
            hidden: true,
            dataIndex: 'idpersonacuentabancaria'
        }, {
            header: 'idplantillanominal',
            hideable: false,
            hidden: true,
            dataIndex: 'idplantillanominal'
        }, {
            header: 'denomcentrocosto',
            hideable: false,
            hidden: true,
            dataIndex: 'denomcentrocosto'
        }, {
            header: idioma.lbCargo,
            width: 150,
            sortable: true,
            dataIndex: 'denomcargo'
        }, {
            header: idioma.lbSituacion,
            width: 50,
            sortable: true,
            dataIndex: 'denomsituacionlaboral'
        }, {
            header: idioma.lbFecharegistro,
            width: 80,
            type: 'date',
            sortable: true,
            dataIndex: 'fecharegistro'
        }, {
            header: idioma.lbFechaaplicacion,
            width: 80,
            type: 'date',
            sortable: true,
            dataIndex: 'fechaaplicacion'
        }/*, {
            header: idioma.lbFechavencimiento,
            width: 50,
            type: 'date',
            sortable: true,
            dataIndex: 'fechavencimiento'
        }*/
        ];

        //paginado del grid cargos ocupados
        this.ptbCargosOcupados = new Ext.PagingToolbar({
            pageSize: 25,
            store: modelo.stCargosOcupados,
            displayInfo: true,
            displayMsg: 'Resultados de {0} - {1} de {2}',
            emptyMsg: "No hay resultados para mostrar.",
            items: ['-']
        });

        //paginado del grid calificadores
        this.ptbCargosOcupadosHistorico = new Ext.PagingToolbar({
            pageSize: 25,
            store: modelo.stCargosOcupadosHistorico,
            displayInfo: true,
            displayMsg: 'Resultados de {0} - {1} de {2}',
            emptyMsg: "No hay resultados para mostrar.",
            items: ['-']
        });

        //Selector del grid Cargos ocupados.
        this.smCargosPersona = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        //Selector del grid Cargos ocupados historico.
        this.smCargosPersonaHistorico = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        //Grid de los cargos ocupados de la persona.
        this.gpCargosPersona = new Ext.grid.GridPanel({
            id: 'idgpCargoPersona',
            columns: this.cmCargosPersona,
            autoScroll: true,
            border: false,
            plugins: this.expanderCargo,
            sm: this.smCargosPersona,
            viewConfig: {
                forceFit: true
            },
            store: modelo.stCargosOcupados,
            iconCls: 'icon-grid',
            //bbar: this.ptbCargosOcupados,
            loadMask: {
                store: modelo.stCargosOcupados
            }
        });

        //Grid de los cargos ocupados de la persona.
        this.gpCargosPersonaHistorico = new Ext.grid.GridPanel({
            id: 'idgpCargosPersonaHistorico',
            columns: this.cmCargosPersonaHistorico,
            autoScroll: true,
            border: false,
            plugins: this.expanderCargoHistorico,
            sm: this.smCargosPersonaHistorico,
            viewConfig: {
                forceFit: true
            },
            store: modelo.stCargosOcupadosHistorico,
            iconCls: 'icon-grid',
            //bbar: this.ptbCargosOcupadosHistorico,
            loadMask: {
                store: modelo.stCargosOcupadosHistorico
            }
        });

        //Grid de cuentas bancarias
        /*this.btnActualizarApt = new Ext.Button({
            id: 'btnActualizar',
            text: 'Actualizar',
            tooltip: 'Actualizar cuentas bancarias',
            // icon: perfil.dirImg+'actualizar.png',
            iconCls: 'actualizar',
            disabled: true
        });*/

        this.btnSyncCentrosCostoPersonas = new Ext.Button({
            id: 'btnSincCentrosCosto',
            text: 'Sync Centros Costo',
            tooltip: 'Sincroniza los Centros de Costo de las Personas desde Plantilla Nominal',
            // icon: perfil.dirImg+'actualizar.png',
            iconCls: 'actualizar'
        });

        this.btnActualizar = new Ext.Toolbar.MenuButton({
            id: 'btnActualizar',
            text: 'Actualizar',
            tooltip: 'Actualizar cuentas bancarias',
            //icon: perfil.dirImg+'actualizar.png',
            iconCls: 'actualizar',
            disabled: true,
            menu: {
                items: [{
                    text: 'Cuentas de la persona',
                    handler: function (items, scope) {
                        this.actualizarCuentasBancarias(1);
                    }.createDelegate(this)
                }, {
                    text: 'Todas la cuentas',
                    handler: function (items, scope) {
                        this.actualizarCuentasBancarias(2);
                    }.createDelegate(this)
                }, {
                    text: 'C&oacute;digo de la cuenta',
                    handler: function (items, scope) {
                        this.actualizarCodigo(3);
                    }.createDelegate(this)
                }
                ]
            }
        });

        this.actualizarCuentasBancarias = function (tipo) {
            PVD.mostrarMascara('idmaskcuenta', 'Enviando datos', 'Por favor espere...');
            Ext.Ajax.request({
                url: 'actualizarCuentasBancarias',
                method: 'POST',
                params: {
                    tipo: tipo,
                    identidad: this.identidad,
                    idcargosocupados: this.gpCargosPersona.getSelectionModel().getSelected().get('idcargosocupados')
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    PVD.ocultarMascara('idmaskcuenta');
                    if (responseData == 'ok') {
                        mostrarMensaje(1, 'Las cuentas bancarias se actualizaron correctamente');
                    } else {
                        mostrarMensaje(3, 'No se pudieron actualizar las cuentas bancarias');
                    }
                    modelo.stCargosOcupados.reload();
                }.createDelegate(this)
            });

        }.createDelegate(this);


        this.actualizarCodigo = function (tipo) {
            PVD.mostrarMascara('idmaskcuenta', 'Enviando datos', 'Por favor espere...');

            Ext.Ajax.request({
                url: 'actualizarCodigo',
                method: 'POST',
                params: {
                    idcuentamn: this.gpCuentaBanc.getSelectionModel().getSelected().get('idpersonacuentabancaria'),
                    codtipoid: this.cbCodTipoId.getValue(),
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    PVD.ocultarMascara('idmaskcuenta');
                    if (responseData.Mensaje == 'ok') {
                        mostrarMensaje(1, 'El c&oacute;digo de la cuenta bancaria se actualiz&oacute; correctamente');
                    } else {
                        mostrarMensaje(3, 'No se pudieron actualizar las cuentas bancarias');
                    }
                    modelo.stCargosOcupados.reload();
                }.createDelegate(this)
            });

        }.createDelegate(this);

        this.btnEliminarCuentasBancarias = new Ext.Button({
            id: 'btnEliminarCuentasBancarias',
            text: 'Eliminar',
            tooltip: 'Eliminar cuenta bancaria (<b>DEL</b>)',
            // icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            disabled: true
        });

        this.expanderCuentaBanc = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.smCuentaBanc = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        function change(val) {

            if (val == 1)
                return 'CI';
            else if (val == 2)
                return 'CM';
            else
                return 'CP'
        }

        this.cbCodTipoId = new Ext.form.ComboBox({
            id: 'idcbAcumula',
            // name                                  : 'idcbAcumula',
            // tabIndex                              : 1,
            valueField: 'idtipoacreditacionsalario',
            displayField: 'denomcodtipoid',
            hiddenName: 'idtipoacreditacionsalario',
            mode: 'local',
            store: modelo.storeCodTipoId,
            emptyText: 'Seleccione...',
            readOnly: true,
            triggerAction: 'all',


        });

        this.gpCuentaBanc = new Ext.grid.EditorGridPanel({
            id: 'idgpCuentaBanc',
            title: 'Cuentas Bancarias',
            region: 'west',
            columns: [{
                header: 'Número cuenta',
                width: 100,
                sortable: true,
                dataIndex: 'numerocuenta',
                renderer: PonerleColorVerde,
                renderer: function(value){
                    return (value != null)?value:'';
                }
            }, {header: "Tipo moneda", hidden: true, hideable: false, dataIndex: 'denomtipomoneda',},
                {
                    header: "idpersonacuentabancaria",
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idpersonacuentabancaria'
                },
                {header: "idtipoacreditacionsalario", hidden: true, dataIndex: 'idtipoacreditacionsalario'},
                {
                    header: "C&oacute;digo",
                    dataIndex: 'denomcodtipoid',
                    renderer: function(value){
                        return (value != null)?value:'';
                    },
                    editor: this.cbCodTipoId
                }

            ],
            stripeRows: true,
            autoScroll: true,
            border: true,
            layout: 'fit',
            width: '50%',
            heigth: '20%',
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
            store: modelo.stCuentaBanc,
            sm: this.smCuentaBanc,
            plugins: this.expanderCuentaBanc,
            loadMask: {msg: idioma.lbMaskGridCargando},
            clicksToEdit: 1,
            tbar: [this.btnActualizar, this.btnEliminarCuentasBancarias],
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        self.btnEliminarCuentasBancarias.handler();
                    }
                }
            ]
        });
//numero contable grid
        this.smNumerocontable = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        this.expanderNumerocontable = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.gpNumerocontable = new Ext.grid.GridPanel({
            id: 'idgpgpNumerocontable',
            title: 'N&uacute;mero contable',
            region: 'center',
            columns: [
                {
                    header: 'Número contable',
                    width: 100,
                    sortable: true,
                    dataIndex: 'cdgocontable' /*renderer:PonerleColorVerde*/
                },
                {
                    header: 'dd',
                    width: 100,
                    sortable: true,
                    dataIndex: 'idpersonacdgocontable',
                    hidden: true /*renderer:PonerleColorVerde*/
                }
            ],
            stripeRows: true,
            autoScroll: true,
            border: true,
            //layout: 'fit',
            width: '50%',
            heigth: '20%',
            // viewConfig: {forceFit: true},
            /* view: new Ext.grid.GroupingView({
             forceFit:true,
             groupTextTpl: '{text}'
             }),*/
            store: modelo.stNumerocontable,
            sm: this.smNumerocontable,
            // plugins:this.expanderNumerocontable,
            loadMask: {msg: idioma.lbMaskGridCargando},
            tbar: [this.btnAdicionarNC/*,this.btnModificarNC*/, this.btnEliminarNC],
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        self.btnEliminarNC.handler();
                    }
                }, {
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAdicionarNC.handler();
                    }
                }, {
                    key: 'm',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnModificarNC.handler();
                    }
                }
            ]
        });

        //fin numero contable grid
        this.expanderTipoPago = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.smTipoPago = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.gpTipopago = new Ext.grid.GridPanel({
            id: 'Tipopago',
            title: 'Tipos de nómina',
            layout: 'fit',
            region: 'south',
            columns: [this.expanderTipoPago, {
                header: 'Denominación',
                fixed: true,
                width: '100%',
                sortable: true,
                dataIndex: 'denominacion',
                renderer: PonerleColorVerde
            }
            ],
            stripeRows: true,
            autoScroll: true,
            border: true,
            width: '50%',
            heigth: '80%',
            viewConfig: {forceFit: true},
            store: modelo.storeTipoPago,
            sm: this.smTipoPago,
            plugins: this.expanderTipoPago,
            loadMask: {msg: idioma.lbMaskGridCargando},
        });

        function PonerleColorVerde(val) {
            return '<span style="color:green;">' + val + '</span>';
        }

        //TabPanel de Configurar variables globales.
        this.tpCargosOcupados = new Ext.TabPanel({
            id: 'idtpCargosOcupados',
            enableTabScroll: true,
            defaults: {
                autoScroll: true
            },
            resizeTabs: true,
            border: false,
            region: 'center',
            width: '50%',
            height: 30,
            activeTab: 0,
            frame: true,
            items: [{
                id: 'idtpactual',
                layout: 'fit',
                title: idioma.tpActual,
                tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, '|', this.btnExportar, '|', '->', '|', this.btnActualizarMovimientosPersonasCargos, '|',this.btnSyncCentrosCostoPersonas, '|',this.btnActualizarCargos, '|', this.btnAyuda],
                items: [this.gpCargosPersona],
                keys: [
                    {
                        key: Ext.EventObject.DELETE,
                        stopEvent: true,
                        fn: function () {
                            self.btnEliminar.handler();
                        }
                    }, {
                        key: 'i',
                        alt: true,
                        stopEvent: true,
                        fn: function () {
                            self.btnAdicionar.handler();
                        }
                    }, {
                        key: 'm',
                        alt: true,
                        stopEvent: true,
                        fn: function () {
                            self.btnModificar.handler();
                        }
                    }, {
                        key: 'h',
                        alt: true,
                        stopEvent: true,
                        fn: function () {
                            self.btnAyuda.handler();
                        }
                    }
                ]
            }, {
                id: 'idtphistorico',
                layout: 'fit',
                title: idioma.tpHistorial,
                items: [this.gpCargosPersonaHistorico]
            }]
        });

        this.pfichadelapersona = new Ext.pvd.persona.fichapersona.panelFichapersona({
            id: 'pfichadelapersona',
            region: 'north',
            idficha: 'pfichadelapers',
            height: 160,
            width: '50%',
            border: true,
            split: true,
            idCmp: 'pfichadelapersona'
        });

        this.pEastFichaGpCargos = new Ext.Panel({
            region: 'center',
            layout: 'border',
            width: '50%',
            border: false,
            split: true,
            layout: 'ux.row',
            items: [{
                rowHeight: .25,
                width: '100%',
                border: false,
                split: true,
                layout: 'fit',
                items: [this.pfichadelapersona]
            }, {
                rowHeight: .25,
                width: '100%',
                border: false,
                split: true,
                layout: 'fit',
                items: [this.tpCargosOcupados]
            }, {
                rowHeight: .20,
                width: '100%',
                border: false,
                split: true,
                collapsible: true,
                layout: 'border',
                items: [this.gpCuentaBanc, this.gpNumerocontable]
            }, {
                rowHeight: .30,
                width: '100%',
                border: false,
                split: true,
                collapsible: true,
                layout: 'fit',
                items: [this.gpTipopago]
            }]
        });

        //Vista para gestionar cargos ocupados
        this.winCargosOcupados = new Ext.Window({
            //title: idioma.wCargosOcup,
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'border',
            items: [this.pPersonas, this.pEastFichaGpCargos]
        });

        //Trigger Field para cargar el cargo de la persona.
        this.trfCargo = new Ext.form.TriggerField({
            fieldLabel: idioma.trfCargo,
            nextTab: 'idcbSituacionLaboral',
            prevTab: 'cbBuscarcategoria',
            name: 'cargo',
            id: 'idtrfCargo',
            typeAhead: true,
            triggerAction: 'all',
            forceSelection: true,
            editable: false,
            readOnly: true,
            selectOnFocus: true,
            enableKeyEvents: true,
            allowBlank: true,
            anchor: '90%',
            allowBlank: false
        });

        //ComboBox para cargar la situacion laboral de la persona.
        this.cbSituacionLaboral = new Ext.form.ComboBox({
            id: 'idcbSituacionLaboral',
            extendField: 'descripcion',
            msgTarget: 'qtip',
            enableQtip: true,
            nextTab: 'idcbCajaCajero',
            prevTab: 'idtrfCargo',
            store: modelo.stSituacionLaboral,
            fieldLabel: idioma.cbsituacionLaboralL,
            mode: 'local',
            displayField: 'denominacion',
            hiddenName: 'idsituacionlaboral',
            valueField: 'idsituacionlaboral',
            typeAhead: true,
            triggerAction: 'all',
            forceSelection: true,
            emptyText: 'Seleccione...',
            anchor: '99%',
            allowBlank: true,
            //disabled: true
        });

        this.checkPersonasPlantillas = new Ext.form.Checkbox({
            id: 'checkbox',
            fieldLabel: 'Personas',
            anchor: '99%',
            name: 'personaspalntillas'
        });

        this.cbCajaCajero = new Ext.form.ComboBox({
            id: 'idcbCajaCajero',
            msgTarget: 'qtip',
            enableQtip: true,
            nextTab: 'idcbCuenta',
            prevTab: 'idcbSituacionLaboral',
            store: modelo.stcbCajaCajero,
            fieldLabel: idioma.cbCajaCajero,
            mode: 'local',
            displayField: 'denominacion',
            hiddenName: 'idcajacajero',
            valueField: 'idcajacajero',
            typeAhead: true,
            triggerAction: 'all',
            forceSelection: true,
            emptyTex: 'Seleccione...',
            anchor: '90%',
            allowBlank: true
        });

        this.cbPlantillaNominal = new Ext.form.ComboBox({
            id: 'cbPlantillaNominal',
            msgTarget: 'qtip',
            enableQtip: true,
            nextTab: 'idcbCuenta',
            prevTab: 'idcbSituacionLaboral',
            store: modelo.stcbPlantillaNominal,
            fieldLabel: 'Plantilla nominal',
            mode: 'local',
            displayField: 'denomcentrocosto',
            hiddenName: 'idplantillanominal',
            valueField: 'idplantillanominal',
            typeAhead: true,
            disabled: true,
            triggerAction: 'all',
            forceSelection: true,
            emptyText: 'Seleccione...',
            anchor: '90%',
            //allowBlank:false
            /*id: 'idcbPlantillaNominal',
             name: 'idplantillanominal',
             tabIndex: 3, valueField: 'idplantillanominal',
             displayField: 'denomcentrocosto', hiddenName: 'idplantillanominal',
             allowBlank: true, mode: 'local',
             emptyText: 'Seleccione',
             triggerAction: 'all', anchor: '99%',
             store: modelo.stcbPlantillaNominal,
             fieldLabel: 'Centro de costo'*/

        });

        this.cbCentroCosto = new Ext.form.ComboBox({
            id: 'cbCentroCosto',
            msgTarget: 'qtip',
            enableQtip: true,
            store: modelo.stcbCentroCosto,
            fieldLabel: 'Centro de costo',
            mode: 'local',
            displayField: 'denomccosto',
            hiddenName: 'idcentrocosto',
            valueField: 'idcentrocosto',
            typeAhead: true,
            // disabled: true,
            triggerAction: 'all',
            forceSelection: true,
            //emptyText: 'Seleccione...',
            anchor: '98%',
            allowBlank: false

        });

        this.cbCuenta = new Ext.form.TriggerField({
            fieldLabel: 'Cuenta bancaria',
            name: 'cuenta',
            id: 'cbCuenta',
            typeAhead: true,
            triggerAction: 'all',
            forceSelection: true,
            editable: false,
            readOnly: true,
            selectOnFocus: true,
            enableKeyEvents: true,
            anchor: '80%'
        });

        this.nfNumeroContable = new Ext.form.TextField({
            id: 'idnumerocontable',
            fieldLabel: 'N. contable',
            name: 'numerocontable',
            anchor: '99%',
            allowBlank: false
        });

        //DateField para cargar la fecha de registro de la asignacion del cargo a la persona.
        this.dfFechaRegistro = new Ext.form.DateField({
            fieldLabel: idioma.dfFregistro,
            anchor: '90%',
            name: 'fecharegistro',
            id: 'fecharegistro',
            value: date,
            format: 'd/m/Y',
            maxValue:new Date(),
            allowBlank: false,
            invalidText: idioma.lbBtnFecha,
            blankText: idioma.lbCampoVacio,
            prevTab: 'cbSituacionLaboral',
            nextTab: 'dfFechaAplicacion'
        });

        //DateField para cargar la fecha de apliacion.
        this.dfFechaAplicacion = new Ext.form.DateField({
            fieldLabel: idioma.dfFaplicacion,
            anchor: '97%',
            name: 'fechaaplicacion',
            id: 'fechaaplicacion',
            value: date,
            format: 'd/m/Y',
            //vtype: 'daterange',
            endDateField: 'fecharegistro',
            allowBlank: false,
            invalidText: idioma.lbBtnFecha,
            blankText: idioma.lbCampoVacio,
            prevTab: 'cbSituacionLaboral',
            nextTab: 'dfFechaAplicacion'
        });

        //DateField para cargar la fecha de vencimiento.
        this.dfFechaVencimiento = new Ext.form.DateField({
            fieldLabel: idioma.dfFvencimiento,
            anchor: '98%',
            name: 'fechafin',
            id: 'fechafin',
            format: 'd/m/Y',
            //vtype: 'daterange',
            startDateField: 'fecharegistro',
            endDateField: 'fecharegistro',
            invalidText: idioma.lbBtnFecha,
            prevTab: 'cbSituacionLaboral',
            nextTab: 'dfFechaAplicacion'
        });

        //Text Area para la descripcion de la asignacion del cargo.
        this.taObservaciones = new Ext.form.TextArea({
            anchor: '100%',
            id: 'descripcion',
            fieldLabel: idioma.taObservaciones,
            name: 'descripcion',
            height: 120,
            maxLength: 250,
            prevTab: 'fechafin',
            nextTab: 'trfCargo'
            /*listeners: {
             change: function(){
             cambio = 1;
             }
             }*/
        });

        //Panel del formulario adicionar y modificar cargo.
        this.fpAsignarCargo = new Ext.FormPanel({
            id: 'idfpAsignarCargo',
            labelAlign: 'top',
            autoHeight: true,
            frame: true,
            items: [{
                //layout : 'column',
                border: true,
                items: [{
                    layout: 'column',
                    items: [{
                        columnWidth: .5,
                        layout: 'form',
                        items: [this.trfCargo]
                    }, {
                        columnWidth: .3,
                        layout: 'form',
                        items: [this.cbSituacionLaboral]
                    }, {
                        columnWidth: .2,
                        layout: 'form',
                        items: [this.cbPlantillaNominal]
                    }]
                }, {
                    layout: 'column',
                    items: [ {
                        columnWidth: .9999999,
                        layout: 'form',
                        items: [this.cbCentroCosto]
                    }]
                }, {
                    layout: 'column',
                    items: [{
                        columnWidth: .5,
                        layout: 'form',
                        items: [this.dfFechaRegistro]
                    }, {
                        columnWidth: .5,
                        layout: 'form',
                        items: [this.dfFechaAplicacion]
                    }/*, {
                        columnWidth: .33,
                        layout: 'form',
                        items: [this.dfFechaVencimiento]
                    }*/]
                }]
            }, this.taObservaciones]
        });

        //Boton para calcular número contable
        this.btnCalcularNC = new Ext.Button({
            text: 'Calcular',
            iconCls: 'calcular',
            // icon : perfil.dirImg + 'aplicar.png',
            tooltip: 'Calcular nuemero contable',
            //nextTab : 'btnAceptarBusqueda',
            //prevTab : 'btncancelar',
            id: 'idbtnCalcularNC'
        });


        //formulario adicionar y modificar numero contable.
        this.fpNumerocontable = new Ext.FormPanel({
            id: 'idfpNumerocontable',
            labelAlign: 'left',
            height: 300,
            frame: true,
            items: [{
                layout: 'column',
                items: [{
                    labelAlign: 'top',
                    columnWidth: 1,
                    layout: 'form',
                    items: [this.nfNumeroContable]
                }/*, {
                 columnWidth: 1,
                 text:'   ',
                 layout: 'form',
                 items: [this.btnCalcularNC]
                 }*/]
            }]
            //items: [this.nfNumeroContable]
        });

        //Boton para cancelar la accion y cerrar la ventana.
        this.btnCancelar = new Ext.Button({
            text: idioma.btnCancelar,
            id: 'idbtnCancelar',
            iconCls: 'cancelar',
            //icon : perfil.dirImg + 'cancelar.png',
            nextTab: 'btnLimpiarBusqueda',
            prevTab: 'btnAplicar',
            tooltip: idioma.btncancelartooltip
        });

        //Boton para guardar y resetar el formulario
        this.btnAplicar = new Ext.Button({
            text: idioma.btnAplicar,
            iconCls: 'aplicar',
            //icon : perfil.dirImg + 'aplicar.png',
            tooltip: idioma.btnAplicartooltip,
            //nextTab : 'btnAceptarBusqueda',
            prevTab: 'btncancelar',
            id: 'idbtnAplicar'
        });

        //Boton para guardar los datos y cerrar la ventana.
        this.btnAceptar = new Ext.Button({
            text: idioma.btnAceptar,
            iconCls: 'aceptar',
            // icon : perfil.dirImg + 'aceptar.png',
            tooltip: idioma.btnGuardartooltip,
            nextTab: 'tfCargo',
            prevTab: 'btncancelar',
            id: 'idbtnAceptar'
        });

        //Vista para adicionar y modificar los cargos
        this.winAdicionarCargos = new Ext.Window({
            plain: true,
            title: idioma.winAdicionarCargos,
            closeAction: 'hide',
            modal: true,
            frame: true,
            constrain: true,
            resizable: true,
            width: 500,
            height: 350,
            items: [this.fpAsignarCargo],
            buttons: [this.btnCancelar, this.btnAplicar, this.btnAceptar],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptar.handler();
                    }
                }, {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelar.handler();
                    }
                }, {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicar.handler();
                    }
                }
            ]
        });

        //Boton para cancelar la accion y cerrar la ventana.
        this.btnCancelarNC = new Ext.Button({
            text: idioma.btnCancelar,
            id: 'idbtnCancelarNC',
            iconCls: 'cancelar',
            //icon : perfil.dirImg + 'cancelar.png',
            //nextTab : 'btnLimpiarBusqueda',
            // prevTab : 'btnAplicar',
            tooltip: idioma.btncancelartooltip
        });

        //Boton para guardar y resetar el formulario
        this.btnAplicarNC = new Ext.Button({
            text: idioma.btnAplicar,
            iconCls: 'aplicar',
            // icon : perfil.dirImg + 'aplicar.png',
            tooltip: idioma.btnAplicartooltip,
            //nextTab : 'btnAceptarBusqueda',
            //prevTab : 'btncancelar',
            id: 'idbtnAplicarNC'
        });

        //Boton para guardar los datos y cerrar la ventana.
        this.btnAceptarNC = new Ext.Button({
            text: idioma.btnAceptar,
            iconCls: 'aceptar',
            // icon : perfil.dirImg + 'aceptar.png',
            tooltip: idioma.btnGuardartooltip,
            // nextTab : 'tfCargo',
            //prevTab : 'btnCancelarNC',
            id: 'idbtnAceptarNC'
        });


        //ventana para adicionar y modificar los numeros contables
        this.winAdicionarNumerocontable = new Ext.Window({
            plain: true,
            title: idioma.winAdicionarCargos,
            closeAction: 'hide',
            modal: true,
            frame: true,
            constrain: true,
            resizable: true,
            width: 200,
            height: 150,
            items: [this.fpNumerocontable],
            tbar: [/*'->',*/this.btnCalcularNC],
            buttons: [this.btnCancelarNC, this.btnAceptarNC],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarNC.handler();
                    }
                }, {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarNC.handler();
                    }
                }
            ]
            /*listeners: {
             show: function(){
             if(this.cbCuenta.tree.rendered){
             this.cbCuenta.tree.getLoader().load(this.cbCuenta.tree.getRootNode());
             }

             }.createDelegate(this)
             }*/
        });

        this.smCuentasBancarias = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
        });

        //Grid de cuentas bancarias
        this.gpCuentasBancarias = new Ext.grid.GridPanel({
            id: 'gpCuentasBancarias',
            title: 'Listado de cuentas bancarias',
            region: 'center',
            // layout:'fit',
            columns: [
                {header: 'No. cuenta', width: 200, sortable: true, dataIndex: 'numerocuenta', renderer: activarColor},
                this.smCuentasBancarias
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.stcbCuenta,
            sm: this.smCuentasBancarias,
            //plugins:this.expanderTipoNomina,
            loadMask: {msg: 'Cargando...'},
        });

        function activarColor(val, metaData, record, rowIndex, colIndex, store) {
            if (record.get('checked') == true) {
                return '<span style="color:green;">' + val + '</span>';
            } else {
                return '<span style="color:red;">' + val + '</span>';
            }

        }

        //Boton para cancelar la accion y cerrar la ventana.
        this.btnCancelarCuenta = new Ext.Button({
            text: 'Cancelar',
            id: 'btnCancelarCuenta',
            iconCls: 'cancelar',
            // icon : perfil.dirImg + 'cancelar.png',
            tooltip: 'Cancelar'
        });

        //Boton para guardar los datos y cerrar la ventana.
        this.btnAceptarCuenta = new Ext.Button({
            text: 'Aceptar',
            iconCls: 'aceptar',
            //icon : perfil.dirImg + 'aceptar.png',
            tooltip: 'Aceptar',
            id: 'btnAceptarCuenta'
        });

        //Vista para adicionar y modificar las cuentas
        this.winAdicionarCuenta = new Ext.Window({
            plain: true,
            title: 'Adicionar cuentas bancarias',
            closeAction: 'hide',
            layout: 'border',
            modal: true,
            frame: true,
            constrain: true,
            resizable: true,
            width: 250,
            height: 300,
            items: [this.gpCuentasBancarias],
            buttons: [this.btnCancelarCuenta, this.btnAceptarCuenta],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarCuenta.handler();
                    }
                }, {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarCuenta.handler();
                    }
                }
            ]
        });

        //Componentes de las plantillas y las personas por plantillas
        this.smPlantillasNominales = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
        });

        //Grid de cuentas bancarias
        this.gplantillasNominales = new Ext.grid.GridPanel({
            id: 'gplantillasNominales',
            title: 'Listado plantillas nominales',
            region: 'center',
            layout: 'fit',
            columns: [this.smPlantillasNominales,
                {
                    header: 'Plantillas nominales',
                    width: 200,
                    sortable: true,
                    dataIndex: 'denominacion'/*, renderer: activarColorPlantilla*/
                },
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            height: 600,
            viewConfig: {forceFit: true},
            store: modelo.stcbPlantillasNominales,
            sm: this.smPlantillasNominales,
            //plugins:this.expanderTipoNomina,
            loadMask: {msg: 'Cargando...'},
        });

        this.smPersonasPlantillasNominales = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
        });

        //Grid de personas de las plantillas
        this.editorsNumerosContables = new Ext.form.TextField({
            id: 'editorsNumerosContables', name: 'numerocontablepersona',
            allowBlank: false,
            invalidText: 'El formato es #.',
            /*maskRe: /[0-9.]/i,
             regex: /^\d+(\.\d{1,2})?$/i,*/
            regexText: 'Este valor es incorrecto'
        });

        this.gpPersonasPlantillasNominales = new Ext.grid.EditorGridPanel({
            id: 'gpPersonasPlantillasNominales',
            title: 'Listado personas',
            region: 'center',
            layout: 'fit',
            columns: [this.smPersonasPlantillasNominales,
                {
                    header: 'Nombre y apellidos',
                    width: 200,
                    sortable: true,
                    dataIndex: 'nombreyapellidos'/*, renderer: activarColorPlantilla*/
                },
                {
                    header: 'No. contable',
                    width: 80,
                    sortable: true,
                    dataIndex: 'numerocontablepersona',
                    editor: this.editorsNumerosContables
                },
                {
                    header: 'Plantilla',
                    width: 200,
                    hidden: true,
                    sortable: true,
                    dataIndex: 'denominacionplantilla'/*, renderer: activarColorPlantilla*/
                }
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            height: 600,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
            store: modelo.stcbPersonasPlantillasNominales,
            sm: this.smPersonasPlantillasNominales,
            //plugins:this.expanderTipoNomina,
            loadMask: {msg: 'Cargando...'}
        });

        this.btnAddGridExportarVarios = new Ext.Button({
            disabled: true,
            style: 'margin-left:10px;margin-top:170px',
            id: 'idbtnAddGridExportarVarios'
        });

        //Panel del formulario adicionar y modificar cargo.
        this.fpPlantillasPersonas = new Ext.FormPanel({
            id: 'fpPlantillasPersonas',
            labelAlign: 'top',
            frame: true,
            region: 'center',
            height: 450,
            width: 800,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .47,
                    layout: 'form',
                    items: [{
                        xtype: 'panel',
                        border: false,
                        layout: 'fit',
                        items: [this.gplantillasNominales]
                    }
                    ]
                }, {
                    columnWidth: .06,
                    layout: 'form',
                    items: [this.btnAddGridExportarVarios],
                    anchor: '100%'
                }, {
                    columnWidth: .47,
                    layout: 'form',
                    items: [{
                        xtype: 'panel',
                        border: true,
                        frame: false,
                        layout: 'fit',
                        items: [this.gpPersonasPlantillasNominales]
                    }]
                }]
            }]
        });

        //Boton para cancelar la accion y cerrar la ventana.
        this.btnCancelarPlantilla = new Ext.Button({
            text: 'Cancelar',
            id: 'btnCancelarPlantilla',
            iconCls: 'cancelar',
            // icon : perfil.dirImg + 'cancelar.png',
            tooltip: 'Cancelar'
        });

        //Boton para guardar los datos y cerrar la ventana.
        this.btnAceptarPlantilla = new Ext.Button({
            text: 'Aceptar',
            iconCls: 'aceptar',
            //icon : perfil.dirImg + 'aceptar.png',
            tooltip: 'Aceptar',
            id: 'btnAceptarPlantilla'
        });

        //Vista para adicionar y modificar las plantillas
        this.winAdicionarPlantilla = new Ext.Window({
            plain: true,
            title: 'Plantillas nominales',
            closeAction: 'hide',
            layout: 'border',
            modal: true,
            constrain: true,
            frame: true,
            resizable: true,
            width: 900,
            height: 600,
            items: [this.fpPlantillasPersonas],
            buttons: [this.btnCancelarPlantilla, this.btnAceptarPlantilla],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarPlantilla.handler();
                    }
                }, {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarPlantilla.handler();
                    }
                }
            ]
        });

        //Panel de estructura y composición que cargo hasta el nivel de cargos.
        this.pEstCargo = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border'
        });

        //Botón para selecionar el cargo.
        this.btnAceptarCargo = new Ext.Button({
            id: 'idbtnAceptarCargo',
            text: idioma.btnAceptar,
            tooltip: idioma.textToolTipGuardarNSist,
            // icon: perfil.dirImg+'aceptar.png',
            iconCls: 'aceptar',
            prevTab: 'idbtnCargarEntidad',
            nextTab: 'idbtnCargarEntidad'
        });

        //Botón para cerrar la ventana de cargo.
        this.btnCancelarCargo = new Ext.Button({
            id: 'idbtnCancelarCargo',
            text: idioma.btnCancelar,
            tooltip: idioma.textToolTipGuardarNSist,
            // icon: perfil.dirImg+'cancelar.png',
            iconCls: 'cancelar',
            prevTab: 'idbtnCargarEntidad',
            nextTab: 'idbtnCargarEntidad'
        });

        //Vista para el componente Buscar estructura hasta nivel de cargo
        this.winEstCargo = new Ext.Window({
            title: idioma.winEstructura,
            modal: true,
            height: 350,
            width: '30%',
            constrain: true,
            closable: false,
            resizable: false,
            layout: 'fit',
            items: [this.pEstCargo],
            buttons: [this.btnCancelarCargo, this.btnAceptarCargo],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarCargo.handler();
                    }
                }, {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarCargo.handler();
                    }
                }
            ]
        });
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('gestionarcargosocupados', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];

    PVD.mostrarMascara('idmaskcargardatosconfreportescertificaciones', idioma.lbMsgEspera, idioma.lbMsgEsperaEnviarDatos);
    Ext.Ajax.request({
        url: 'obtenercargainicial',
        method: 'POST',
        callback: function (options, success, response) {
            PVD.ocultarMascara('idmaskcargardatosconfreportescertificaciones');
            responseData = Ext.decode(response.responseText);
            //Inicializando el modelo.
            var modelo = Pvd.Nomina.Pagos.GestionarCargosOcupados.Modelo;
            modelo.init();
            modelo.cargarModelo(responseData.situacion);
            var date = responseData.hora;

            //Inicializando la vista.
            var vista = Pvd.Nomina.Pagos.GestionarCargosOcupados.Vista;
            vista.init(perfil, idioma, modelo, date);

            //Inicializar controlador.
            Pvd.Nomina.Pagos.GestionarCargosOcupados.Controlador.init(idioma, vista, modelo);
        }
    });

});
