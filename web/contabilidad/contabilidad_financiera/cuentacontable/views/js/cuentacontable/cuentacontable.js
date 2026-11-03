Ext.QuickTips.init();
if (!Ext.Confin)
    Ext.ns('Ext.Confin.Cuenta');
var arrApertura;
var dataApertura;
var dataAperturaGeneral;
var idconfapertura;
var idcuentaSel;
var arrayNodosAperturados;
Ext.Confin.Cuenta.TgCuenta = Ext.extend(Ext.Cont.TreeGrid.GridPanel, {
    root_title: 'Cuentas',
    autoExpandColumn: 'expandir',
    master_column_id: 'master_column_id',
    perfil: new Object(),
    stripeRows: true,
    border: false,
    frame: false,
    loadMask: true,
    initAppCta: false,
    enableColumnMove: false,
    idcriterioe: -1,
    formatos: new Array(),
    initComponent: function () {
        var self = this;
        this.privado = true;
        this.contextMenu = new Ext.menu.Menu({
            id: 'contextMenuNomCta',
            items: [
                // {
                //     id: 'menuEliminarRama',
                //     iconCls: 'eliminar',
                //     text: 'Eliminar cuentas sin operaciones',
                //     handler: function () {
                //         self.eliminarCuentasSinOperaciones();
                //     }
                // },
                {
                    id: 'menuPublica',
                    iconCls: 'bandera verde',
                    text: self.perfil.etiquetas.lbPublica,
                    handler: function () {
                        self.privado = false;
                        self.vigenciaVisibilidad(false, '');
                    }
                },
                {
                    id: 'menuPrivada',
                    iconCls: 'bandera rojo',
                    text: self.perfil.etiquetas.lbPrivada,
                    handler: function () {
                        self.privado = true;
                        self.vigenciaVisibilidad(true, '');
                    }
                }, {
                    id: 'menuActiva',
                    iconCls: 'true verde',
                    text: self.perfil.etiquetas.lbActiva,
                    handler: function () {
                        self.privado = true;
                        self.vigenciaVisibilidad('', true);
                    }
                }, {
                    id: 'menuInactiva',
                    iconCls: 'false rojo',
                    text: self.perfil.etiquetas.lbInactiva,
                    handler: function () {
                        self.privado = true;
                        self.vigenciaVisibilidad('', false);
                    }
                }
                // , {
                //     id: 'recargarNodo',
                //     iconCls: 'recargar',
                //     text: 'Recargar nodo',
                //     handler: function () {
                //         self.store.baseParams = {
                //             node: nodo.id,
                //             idcuenta: nodo.id,
                //         };
                //         self.store.load({
                //             callback:function(){
                //                 nodo.data._is_leaf = false;
                //                 me.trpCuenta.getView().refresh();
                //                 me.trpCuenta.getStore().expandNode(nodo);
                //             }
                //         });
                //     }
                // }
            ]
        });
        this.store = new Ext.Cont.TreeGrid.AdjacencyListStore({
            autoLoad: true,
            url: 'obtenercuentas',
            listeners: {
                beforeexpandnode: function (st, record) {
                    st.baseParams.filtro = '';
                    st.baseParams.node = record.get('idcuenta');
                    st.baseParams.idcuenta = record.get('idcuenta');
                    st.baseParams.modo = self.cbxTbarVigencia.getValue();
                },
                beforeload: function (store, options) {
                    if (Ext.Msg.getDialog() || Ext.Msg.isVisible()) {
                        Ext.Msg.hide();
                    }
                },
                load: function (store, records, options) {
                    self.btnSalvar.setDisabled(true);
                    self.btnDescartar.setDisabled(true);
                    self.idcriterioe = store.reader.jsonData.idcriterioe;
                    self.formatos = store.reader.jsonData.formatos;
                    Ext.getCmp('btnAdicionar').enable();
                    var idcriterioe = parseInt(self.idcriterioe);
                    if (store.getTotalCount() <= 0) {
                        Ext.getCmp('btnVistaReporte').disable();
                        if (self.initAppCta == false) {
                            if (idcriterioe == 1) {
                                Ext.getCmp('btnPlanCta').enable();
                                Ext.getCmp('btnPlanCta').show();
                                Ext.getCmp('btnPlanCta').focus(true, 1000);
                            }
                        } else {
                            Ext.getCmp('btnAperturar').disable();
                            Ext.getCmp('btnModificar').disable();
                            Ext.getCmp('btnEliminar').disable();
                        }
                        if (store.baseParams.filtro && store.baseParams.filtro.length > 0) {
                            mostrarMensaje(1, self.perfil.etiquetas.lbMsgNoCriteria);
                        } else {
                            mostrarMensaje(1, self.perfil.etiquetas.lbMsgNoData);
                        }
                    } else {
                        if (self.initAppCta == false) {
                            self.initAppCta = true;
                        }
                        Ext.getCmp('btnPlanCta').disable();
                        Ext.getCmp('btnPlanCta').hide();
                        // Ext.getCmp('btnAperturar').enable();
                        // Ext.getCmp('btnModificar').enable();
                        // Ext.getCmp('btnEliminar').enable();
                        Ext.getCmp('btnVistaReporte').enable();
                        if (idcriterioe != 4) {
                            Ext.getCmp('btnAdicionar').focus(true, 1000);
                        } else {
                            Ext.getCmp('btnVistaReporte').focus(true, 1000);
                        }
                    }
                    switch (idcriterioe) {
                        case 1: {
                            Ext.getCmp('btnHeredar').disable();
                            Ext.getCmp('btnHeredar').hide();
                            Ext.getCmp('btnAperturar').show();
                            Ext.getCmp('btnAdicionar').enable();
                            Ext.getCmp('btnAdicionar').show();
                        }
                            break;
                        case 2: {
                            Ext.getCmp('btnHeredar').enable();
                            Ext.getCmp('btnHeredar').show();
                            Ext.getCmp('btnAperturar').show();
                            Ext.getCmp('btnAdicionar').disable();
                            Ext.getCmp('btnAdicionar').hide();
                            Ext.getCmp('btnPlanCta').disable();
                            Ext.getCmp('btnPlanCta').hide();
                        }
                            break;
                        case 3: {
                            Ext.getCmp('btnPlanCta').disable();
                            Ext.getCmp('btnPlanCta').hide();
                            Ext.getCmp('btnAdicionar').disable();
                            Ext.getCmp('btnAdicionar').hide();
                            Ext.getCmp('btnAperturar').disable();
                            Ext.getCmp('btnAperturar').hide();
                            Ext.getCmp('btnModificar').disable();
                            Ext.getCmp('btnModificar').hide();
                            //Ext.getCmp('btnEliminar').disable();
                            //Ext.getCmp('btnEliminar').hide();
                            Ext.getCmp('btnHeredar').enable();
                            Ext.getCmp('btnHeredar').show();
                            Ext.getCmp('btnPlanCta').disable();
                            Ext.getCmp('btnPlanCta').hide();
                        }
                            break;
                        default: {
                            Ext.getCmp('btnPlanCta').disable();
                            Ext.getCmp('btnPlanCta').hide();
                            Ext.getCmp('btnAdicionar').disable();
                            Ext.getCmp('btnAdicionar').hide();
                            Ext.getCmp('btnAperturar').disable();
                            Ext.getCmp('btnAperturar').hide();
                            Ext.getCmp('btnModificar').disable();
                            Ext.getCmp('btnModificar').hide();
                            Ext.getCmp('btnEliminar').disable();
                            Ext.getCmp('btnEliminar').hide();
                            Ext.getCmp('btnHeredar').disable();
                            Ext.getCmp('btnHeredar').hide();
                        }
                            break;
                    }
                },
                remove: function (store, record, index) {
                    if (!self.gridValid()) {
                        self.btnSalvar.setDisabled(true);
                        self.btnDescartar.setDisabled(true);
                    } else {
                        self.btnSalvar.setDisabled(false);
                        self.btnDescartar.setDisabled(false);
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                id: '_id',
                root: 'cuentas',
                successProperty: 'success'
            }, [{name: 'clavecuenta'},
                {name: 'descripcion'},
                {name: 'idmoneda'},
                {name: 'codigoiso'},
                {name: 'grupo'},
                {name: 'descripnaturaleza'},
                {name: 'vigente'},
                {name: 'visibilidad'},
                {name: 'privado'},
                {name: 'nombreformato'},
                {name: 'concatcta'},
                {name: 'concatctax'},
                {name: 'idgrupo'},
                {name: 'idnaturaleza'},
                {name: '_id'},
                {name: 'idcuenta'},
                {name: 'idcuentapadre'},
                // {name: 'ordenizq'},
                // {name: 'ordender'},
                {name: 'text'},
                {name: '_parent'},
                {name: '_is_leaf'},
                {name: 'fechainicio'},
                {name: 'fechafin'},
                {name: 'nivel'},
                {name: 'idestructurae'},
                {name: 'version'},
                {name: 'idparteformato'},
                {name: 'operacion'},
                {name: 'idconfapertura'},
                {name: 'idrefnomenclador'},
                {name: 'idtipocta'},
                {name: 'tipocuenta'},
                {name: 'codigocuenta'},
                {name: 'ctaheredada'},
                {name: 'heredada'}
            ])
        });
        this.sm = new Ext.grid.RowSelectionModel({
            id: 'smTreeGrid',
        });
        this.columns = [{
            id: 'master_column_id',
            dataIndex: 'clavecuenta',
            width: 300,
            sortable: true,
            header: self.perfil.etiquetas.lbCodigo,
            tooltip: self.perfil.etiquetas.lbTthCodigo
        }, {
            id: 'expandir',
            header: self.perfil.etiquetas.lbDescripcion,
            tooltip: self.perfil.etiquetas.lbTthDescripCtaAp,
            dataIndex: 'descripcion',
            width: 400,
            sortable: true
        }, {
            header: self.perfil.etiquetas.lbMoneda,
            tooltip: self.perfil.etiquetas.lbTthMoneda,
            dataIndex: 'codigoiso',
            width: 80,
            sortable: true
        }, {
            header: self.perfil.etiquetas.lbGrupoCont,
            tooltip: self.perfil.etiquetas.lbTthGrupoCont,
            dataIndex: 'grupo',
            width: 200,
            sortable: true
        }, {
            header: self.perfil.etiquetas.lbNaturaleza,
            tooltip: self.perfil.etiquetas.lbTthNaturaleza,
            dataIndex: 'descripnaturaleza',
            width: 80,
            fixed: true,
            sortable: true
        }, {
            header: self.perfil.etiquetas.lbVigencia,
            tooltip: self.perfil.etiquetas.lbTthVigencia,
            dataIndex: 'vigente',
            align: 'center',
            width: 65,
            // fixed: true,
            hidden: false,
            sortable: true,
            renderer: self.showFlagState
        }, {
            header: self.perfil.etiquetas.lbNivelFormato,
            tooltip: self.perfil.etiquetas.lbTthNivel,
            dataIndex: 'nombreformato',
            width: 125,
            sortable: true
        }, {
            header: self.perfil.etiquetas.lbVisibilidad,
            tooltip: self.perfil.etiquetas.lbTthhVisible,
            dataindex: 'visibilidad',
            align: 'center',
            width: 75,
            // fixed: true,
            hidden: true,
            sortable: true,
            renderer: self.showVisibility
        }, {
            header: self.perfil.etiquetas.lbCodigoFull,
            tooltip: self.perfil.etiquetas.lbTthCodFull,
            dataIndex: 'concatcta',
            width: 100,
            sortable: true,
            hidden: true
        }, {
            header: self.perfil.etiquetas.lbNomCtaContable,
            tooltip: self.perfil.etiquetas.lbTthCodDescp,
            dataIndex: 'text',
            width: 500,
            sortable: true,
            hidden: true
        }, {
            header: 'Tipo de cuenta',
            tooltip: 'Tipo de cuenta',
            dataIndex: 'tipocuenta',
            width: 150,
            hidden: true,
            sortable: true
        }, {
            header: 'Nivel',
            tooltip: 'Nivel de la cuenta',
            dataIndex: 'nivel',
            width: 50,
            hidden: true,
            sortable: true
        }, {
            header: self.perfil.etiquetas.lbHerencia,
            tooltip: self.perfil.etiquetas.lbTthHerencia,
            dataIndex: 'heredada',
            align: 'center',
            width: 65,
            hidden: true,
            sortable: true,
            renderer: self.mostrarHerencia
        }, {
            name: 'concatctax',
            hidden: true,
            hideable: false
        }, {
            name: 'idgrupo',
            hidden: true,
            hideable: false
        }, {
            name: 'idnaturaleza',
            hidden: true,
            hideable: false
        }, {
            name: 'ctaheredada',
            hidden: true,
            hideable: false
        }, {
            name: 'idtipocta',
            hidden: true,
            hideable: false
        }, {
            name: 'idconfapertura',
            hidden: true,
            hideable: false
        }, {
            name: 'idrefnomenclador',
            hidden: true,
            hideable: false
        }];
        this.rowEditorCtas = new Ext.Cont.RowEditor({
            id: 'rowEditorCtas',
            clicksToEdit: 2,
            iconCls: 'btn',
            cancelText: self.perfil.etiquetas.lbCancelar,
            saveText: self.perfil.etiquetas.lbBtnGuardar,
            iconClsSave: 'guardar',
            iconClsCancel: 'cancelar'
        });
        this.btnDescartar = new Ext.Button({
            disabled: true,
            hidden: true,
            id: 'btnDescartar',
            iconCls: 'btn',
            text: self.perfil.etiquetas.lbDeshacerCambios,
            tooltip: self.perfil.etiquetas.lbTtCancelarCambios,
            icon: '/contabilidad/comun/images/cancelarseleccion.png'
        });
        this.btnSalvar = new Ext.Button({
            id: 'btnSalvar',
            hidden: true,
            text: self.perfil.etiquetas.lbGuardar,
            tooltip: self.perfil.etiquetas.lbTtGuardarRowEdit,
            disabled: true,
            iconCls: 'guardar'
        });

        this.cbxTbarVigencia = new Ext.form.ComboBox({
            store: new Ext.data.SimpleStore({
                fields: ['id', 'privado', 'srcImg'],
                data: [
                    ['3', 'Todas', '/contabilidad/comun/images/seleccion.png'],
                    ['1', 'Activas', '/contabilidad/comun/images/checkgreen.png'],
                    ['2', 'Inactivas', '/contabilidad/comun/images/cierreno.png']
                ]
            }),
            id: 'cbxTbarVigencia',
            width: 100,
            tpl: '<tpl for="."><div ext:qtip="{privado}" class="x-combo-list-item"><img style="margin-right:5px;" src= {srcImg}>{privado}</div></tpl>',
            emptyText: self.perfil.etiquetas.lbSeleccionar,
            displayField: 'privado',
            triggerAction: 'all',
            value: '1',
            valueField: 'id',
            hiddenName: 'id',
            mode: 'local',
            typeAhead: true,
            editable: true,
            resizable: true,
            forceSelection: true,
            selectOnFocus: true
        });
        this.sfBuscarCta = new Ext.Cont.SearchField({
            id: 'sfBuscarCta', lbTtlElement: 'cuentas', width: 250, fnOnClear: function () {
                self.getStore().baseParams = {node: 0, idcuenta: 0, modo: self.cbxTbarVigencia.getValue(), filtro: ''};
                self.getStore().reload();
            }, fnOnSearch: function () {
                self.getStore().baseParams = {
                    node: 0,
                    idcuenta: 0,
                    // modo: self.cbxTbarVigencia.getValue(),
                    modo: 3,
                    filtro: this.getValue()
                };
                self.getStore().reload();
            }
        });
        this.btnActualizarTgCta = new Ext.Button({
            id: 'btnActualizarTgCta',
            iconCls: 'actualizar',
            tooltip: self.perfil.etiquetas.lbActualizar,
            handler: function () {
                self.store.rejectChanges();
                self.sfBuscarCta.reset();
                self.store.removeAll();
                // self.store.baseParams = {idcuenta: 0, modo: 1};
                // self.store.load({params: {idcuenta: 0, modo: 1}});
                self.store.baseParams = {idcuenta: 0, modo: self.cbxTbarVigencia.getValue()};
                self.store.load({params: {idcuenta: 0, modo: self.cbxTbarVigencia.getValue()}});
            }
        });
        this.createNodoLeyenda = function (accion, text) {
            var div = "<div class='animacionContenedor" + accion + " contenedorLeyenda'><div class='iconLeyenda " + accion + "Leyend rotateLeyend'></div><div class='textLeyenda " + accion + "LeyendColor'>" + text + "</div>";
            return div;
        };
        this.bbar = [this.sfBuscarCta, new Ext.Toolbar.Separator(), this.cbxTbarVigencia, new Ext.Toolbar.Separator(),
            this.btnActualizarTgCta, '->',
            {xtype: 'label', html: this.createNodoLeyenda('Verde', 'Operaciones registradas')},
            this.btnDescartar, this.btnSalvar];
        this.addEvents(
            /**
             * @event self.clickOnTreeGridCmp
             * Fires after the TreeGridCmp is clicked.
             * param {TGC.store}
             * param {Record} active Issue record
             */
            'self.clickOnTreeGridCmp'
        );
        this.on({
            scope: this,
            'gridvalid': function (state, grideditor) {
                this.btnSalvar.setDisabled(!state);
                this.btnDescartar.setDisabled(!state);
            },
            'dblclick': function () {
                self.flagAction = 'Modificar';
            },
            'rowcontextmenu': function (grid, rowIndex, eventObject) {
                this.getSelectionModel().selectRow(rowIndex);

                Ext.getCmp('menuPublica').setVisible(this.selModel.getSelected().data.privado);
                Ext.getCmp('menuPrivada').setVisible(!this.selModel.getSelected().data.privado);
                Ext.getCmp('menuActiva').setVisible(!this.selModel.getSelected().data.vigente);
                Ext.getCmp('menuInactiva').setVisible(this.selModel.getSelected().data.vigente);
                self.contextMenu.showAt(eventObject.getXY());
            },
            'click': this.onClickTreeGridCmp
        });
        this.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.get('operacion') == true) {
                rowParams.tstyle += "background-color: #dffbda;";
            } else {
                var style = rowParams.tstyle.split(';');
                if (style[0]) {
                    rowParams.tstyle = style[0] + ';';
                }
            }
        };
        self.root_title = this.perfil.etiquetas.lbCtasContables;

        Ext.Confin.Cuenta.TgCuenta.superclass.initComponent.call(this);
    },
    vigenciaVisibilidad: function (visibilidad, vigencia) {
        var me = this;
        var msg = '';
        var msg1 = '';
        var permitirConOperaciones = 0;
        var privado = (visibilidad !== '') ? visibilidad : -1;
        var activo = (vigencia !== '') ? vigencia : -1;
        if (activo === false) {
            msg = 'inactivar';
            msg1 = 'inactivadas';
        } else if (activo === true) {
            msg = 'activar';
            msg1 = 'activadas';
        }
        var arrIdCtas = new Array();
        var count = me.selModel.getCount();
        if (count > 0) {
            for (var i = 0; i < count; i++) {
                arrIdCtas.push(me.selModel.getSelections()[i].data.idcuenta);
            }
        }
        for (var i = 0; i < validate.accionesPermitidas.length; i++) {
            validate.accionesPermitidas[i].abreviatura
            if (validate.accionesPermitidas[i].abreviatura == 'pe') {
                permitirConOperaciones = 1;
            }
        }
        Ext.Msg.wait(me.perfil.etiquetas.lbWaitMsgReg, me.perfil.etiquetas.lbEsperar);
        Ext.Ajax.request({
            method: "POST",
            url: "vigenciaVisibilidad",
            params: {
                privado: privado,
                activo: activo,
                permitirconoperaciones: permitirConOperaciones,
                // idcuenta: me.selModel.getSelected().data.idcuenta,
                idcuentas: Ext.encode(arrIdCtas)
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                Ext.Msg.hide();
                if (responseData.cod == 1) {
                    mostrarMensaje(1, 'Las cuentas han sido ' + msg1 + ' satisfactoriamente.');
                    me.store.removeAll();
                    me.store.baseParams.node = '';
                    me.store.baseParams.idcuenta = '';
                    me.store.load({
                        params: {idcuenta: 0, modo: me.cbxTbarVigencia.getValue()},
                        callback: function () {
                        }
                    });
                } else if (responseData.cod == -1 && activo === false) {
                    mostrarMensaje(1, 'Las cuentas no se puede ' + msg + ' porque tienen saldo .');
                } else if (responseData.cod == -1 && activo === true) {
                    mostrarMensaje(1, 'Las cuentas no se pueden activar porque tiene saldo en el padre.');
                } else if (responseData.cod == -2) {
                    mostrarMensaje(1, 'Las cuentas no se pueden ' + msg + ' porque tienen peraciones pendientes.');
                } else if (responseData.cod == -3) {
                    mostrarMensaje(1, 'Las cuentas tienen operaciones registradas.');
                } else if (responseData.cod == -4) {
                    mostrarMensaje(1, 'Las cuentas tienen herencias.');
                }
            }
        });
    },
    eliminarCuentasSinOperaciones: function () {
        var me = this;
        var arrIdCtas = new Array();
        var count = me.selModel.getCount();
        if (count > 0) {
            for (var i = 0; i < count; i++) {
                arrIdCtas.push({idcuenta: parseInt(me.selModel.getSelections()[i].data.idcuenta)});
            }
        }
        Ext.Msg.wait(me.perfil.etiquetas.lbWaitMsgReg, me.perfil.etiquetas.lbEsperar);
        Ext.Ajax.request({
            method: "POST",
            url: "eliminarcuenta",
            params: {
                arrayIdCuentas: Ext.encode(arrIdCtas),
                eliminarSinOp: true
            },
            callback: function (options, success, response) {
                Ext.Msg.hide();
                var responseData = Ext.decode(response.responseText);
                switch (responseData.code) {
                    case -1: {
                        var selDelCtas = me.trpCuenta.getSelectionModel().getSelections();
                        for (var i = 0; i < selDelCtas.length; i++) {
                            arrayIdNodoPadre.push(selDelCtas[i].data._parent);
                            me.trpCuenta.getStore().remove(selDelCtas[i]);
                        }
                        me.trpCuenta.getView().refresh();
                        for (var j = 0; j < arrayIdNodoPadre.length; j++) {
                            if (me.trpCuenta.getStore().find('_parent', arrayIdNodoPadre[j]) < 0) {
                                if (me.trpCuenta.getStore().getAt(me.trpCuenta.getStore().find('idcuenta', arrayIdNodoPadre[j]))) {
                                    me.trpCuenta.getStore().getAt(me.trpCuenta.getStore().find('idcuenta', arrayIdNodoPadre[j])).data._is_leaf = true;
                                    // me.trpCuenta.getStore().getAt(me.trpCuenta.getStore().find('idcuenta', arrayIdNodoPadre[j])).data.idconfapertura = null;
                                    // me.trpCuenta.getStore().getAt(me.trpCuenta.getStore().find('idcuenta', arrayIdNodoPadre[j])).data.idrefnomenclador = null;
                                }
                            }
                        }
                        me.trpCuenta.getView().refresh();

                        if (selDelCtas.length == 1) {
                            mostrarMensaje(1, me.perfil.etiquetas.lbMsgDelOK);
                        } else {
                            mostrarMensaje(1, me.perfil.etiquetas.lbMsgDelManyOK);
                        }
                        Ext.Msg.hide();
                    }
                        break;
                    case -2: {
                        var mensaje = '', ctaDetalle = '';
                        if (responseData.errors.length > 1) {
                            for (var i = 0; i < responseData.errors.length; i++) {
                                ctaDetalle += '<br>';
                                ctaDetalle += responseData.errors[i].concatctax + " " + responseData.errors[i].descripcion;
                            }
                        } else {
                            ctaDetalle += '<br>';
                            ctaDetalle += responseData.errors[0].concatctax + ' ' + responseData.errors[0].descripcion;
                        }
                        mensaje = me.perfil.etiquetas.lbMsgDelCtasOp + ctaDetalle;
                        mostrarMensaje(1, mensaje);
                    }
                        break;
                    case -3: {
                        // var mensaje = '', ctaDetalle = '';
                        // if (responseData.errors.length > 1) {
                        //     for (var i = 0; i < responseData.errors.length; i++) {
                        //         ctaDetalle += '<br>';
                        //         ctaDetalle += responseData.errors[i].concatctax + " " + responseData.errors[i].descripcion;
                        //     }
                        //     mensaje = me.perfil.etiquetas.lbMsgDelCtasUso + ctaDetalle;
                        // } else {
                        //     ctaDetalle += '<br>';
                        //     ctaDetalle += responseData.errors[0].concatctax + ' ' + responseData.errors[0].descripcion;
                        //     mensaje = String.format(me.perfil.etiquetas.lbMsgDelCtaUso, ctaDetalle);
                        // }
                        // mostrarMensaje(1, mensaje);
                        mostrarMensaje(1, 'La(s) cuenta(s) contable(s) no pueden ser eliminada(s) debido a que están en uso.');
                    }
                        break;
                    case -4: {
                        var mensaje = '', ctaDetalle = '', temp = '', tem1 = '';
                        for (var i = 0; i < responseData.errors.length; i++) {
                            ctaDetalle += '<br>';
                            tem1 = Ext.decode(responseData.errors[i].estructuras);
                            for (var j = 0; j < tem1.length; j++) {
                                temp += '<br> ' + tem1[j];
                            }
                            ctaDetalle += responseData.errors[i].concatcta + " :" + temp;
                        }
                        mensaje = 'La(s) cuenta(s) no pueden ser eliminada(s) debido a que están heredadas en las siguientes estructuras: ' + ctaDetalle;
                        mostrarMensaje(1, mensaje);
                    }
                        break;
                    default:
                        mostrarMensaje(responseData.codMsg, responseData.mensaje);
                        break;
                }
            }
        });
    },
    showFlagState: function (value, metaData, record, rowIndex, colIndex, store) {
        if (record.data.vigente) {
            metaData.attr = 'ext:qtip="' + '<b>' + self.perfil.etiquetas.lbActiva + '</b>"';
            metaData.css = 'icondistra-true verde';
        } else {
            metaData.attr = 'ext:qtip="' + '<b>' + self.perfil.etiquetas.lbInactiva + '</b>"';
            metaData.css = 'icondistra-false rojo';
        }
    },
    mostrarHerencia: function (value, metaData, record, rowIndex, colIndex, store) {
        if (record.data.heredada) {
            metaData.attr = 'ext:qtip="' + '<b>' + self.perfil.etiquetas.lbTthHerencia + '</b>"';
            metaData.css = 'icondistra-true verde';
        }
    },
    showVisibility: function (value, metaData, record, rowIndex, colIndex, store) {
        if (record.data.visibilidad) {
            metaData.attr = 'ext:qtip="' + '<b>' + self.perfil.etiquetas.lbPrivada + '</b>"';
            // metaData.css = 'icondistra-seleccion rojo';
            metaData.css = 'icondistra-bandera rojo';
        } else {
            metaData.attr = 'ext:qtip="' + '<b>' + self.perfil.etiquetas.lbPublica + '</b>"';
            metaData.css = 'icondistra-bandera verde';
        }
    },
    gridValid: function () {
        return this.getStore().find('valid', 'false') === -1;
    },
    onClickTreeGridCmp: function () {
        var store = this.getStore();
        this.fireEvent('self.clickOnTreeGridCmp', store, store.getActiveNode());
    }
});

Ext.Confin.Cuenta.TgCtasHerencia = Ext.extend(Ext.Cont.TreeGrid.GridPanel, {
    perfil: new Object(),
    root_title: 'Cuentas',
    autoExpandColumn: 'expandir',
    master_column_id: 'expandir',
    stripeRows: true,
    border: false,
    frame: false,
    loadMask: true,
    initAppCta: false,
    enableColumnMove: false,
    initComponent: function () {
        var self = this;
        this.layout = 'fit';
        this.btnActualizarTgCtaHerencia = new Ext.Button({
            id: 'btnActualizarTgCtaHerencia',
            iconCls: 'actualizar',
            tooltip: self.perfil.etiquetas.lbActualizar,
            handler: function () {
                self.store.rejectChanges();
                self.sfBuscarCtaHerencia.reset();
                self.store.removeAll();
                self.store.baseParams = {idcuenta: 0, modo: 1};
                self.store.load({params: {idcuenta: 0, modo: 1}});
                // self.store.baseParams = {idcuenta: 0, modo: self.cbxTbarVigencia.getValue()};
                // self.store.load({params: {idcuenta: 0, modo: self.cbxTbarVigencia.getValue()}});
            }
        });
        this.sfBuscarCtaHerencia = new Ext.Cont.SearchField({
            id: 'sfBuscarCtaHerencia', lbTtlElement: 'cuentas', width: 250, fnOnClear: function () {
                self.getStore().baseParams = {node: 0, idcuenta: 0, filtro: ''};
                self.getStore().reload();
            }, fnOnSearch: function () {
                self.getStore().baseParams = {
                    node: 0,
                    idcuenta: 0,
                    filtro: this.getValue()
                };
                self.getStore().reload();
            }
        });
        this.bbar = [this.sfBuscarCtaHerencia, new Ext.Toolbar.Separator(), this.btnActualizarTgCtaHerencia];
        this.store = new Ext.Cont.TreeGrid.AdjacencyListStore({
            autoLoad: false,
            url: 'obtenercuentasherencia',
            baseParams: {idcuenta: 0},
            listeners: {
                scope: this,
                beforeexpandnode: function (st, record) {
                    idcuentaSel = record.get('idcuenta');
                    st.baseParams.idcuenta = record.get('idcuenta');
                    st.baseParams.node = record.get('idcuenta');
                    st.baseParams.filtro = '';
                    this.nloaded = record;
                },
                expandnode: function (record, ev) {
                    // var sm = self.TgCtasHerencia.getSelectionModel();
                    var rowIndex = record.find('idcuenta', idcuentaSel);
                    // sm.selectRow(rowIndex);
                    self.getView().focusRow(rowIndex);
                },
                load: function (store, records, options) {
                    var sm = this.getSelectionModel();
                    if (store.getTotalCount() <= 0) {
                        mostrarMensaje(1, self.perfil.etiquetas.lbMsgNoData);
                    } else if (this.nloaded) {
                        this.nloaded.set('excludechildren', 1);
                        if (sm.isIdSelected(this.nloaded.id))
                            sm.selectRecords(records, true);
                    }
                    if (store.getCount() > 0) {
                        store.active_node = null;
                        store.fireEvent('activenodechange', null, store.activeNode, null);
                        sm.selectRow(store.activeRow);
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                id: '_id',
                root: 'data',
                successProperty: 'success'
            }, [{name: '_id'},
                {name: 'idcuenta'},
                {name: 'idcuentapadre'},
                {name: 'heredada'},
                {name: 'vigente'},
                {name: 'clavecuenta'},
                // {name: 'ordenizq'},
                // {name: 'ordender'},
                {name: 'text'},
                {name: '_parent'},
                {name: '_is_leaf'},
                {name: 'fechainicio'},
                {name: 'fechafin'},
                {name: 'descripcion'},
                {name: 'nivel'},
                {name: 'concatcta'},
                {name: 'concatctax'},
                {name: 'idnaturaleza'},
                {name: 'idestructurae'},
                {name: 'version'},
                {name: 'privado'},
                {name: 'descripnaturaleza'},
                {name: 'idparteformato'},
                {name: 'nombreformato'},
                {name: 'idgrupo'},
                {name: 'grupo'},
                {name: 'idarbol'},
                {name: 'excludechildren'}
            ])
        });
        this.sm = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                scope: this,
                // 'selectionchange': function (smodel) {
                //     var heredada = false;
                //     for (var i = 0; i < smodel.getSelections().length; i++) {
                //         if(smodel.getSelections()[i].data.heredada == true && smodel.getSelections()[i].data._is_leaf == true) {
                //             heredada = true;
                //             break;
                //         }
                //     }
                //     if(heredada)
                //         Ext.getCmp('btnAceptarHerencia').setDisabled(true);
                //     else if(!heredada && smodel.getCount() != 0)
                //         Ext.getCmp('btnAceptarHerencia').setDisabled(false);
                //
                // },
                'selectionchange': function (smodel) {
                    // var heredada = true;
                    // for (var i = 0; i < smodel.getSelections().length; i++) {
                    //     if (smodel.getSelections()[i].data.heredada == false) {
                    //         heredada = false;
                    //         break;
                    //     }
                    // }
                    // if (heredada)
                    //     Ext.getCmp('btnAceptarHerencia').setDisabled(true);
                    // else if (!heredada && smodel.getCount() != 0)
                    //     Ext.getCmp('btnAceptarHerencia').setDisabled(false);
                    if (smodel.getSelections().length === 0) {
                        Ext.getCmp('btnAceptarHerencia').setDisabled(true);
                    } else {
                        Ext.getCmp('btnAceptarHerencia').setDisabled(false);
                    }

                },
                'rowdeselect': function (smodel, index, record) {
                    var data = record.data;
                    // if (data['ordender'] - data['ordenizq'] != 1) {
                    if (data['_is_leaf'] != 1) {
                        this.changeSelectionChildren(smodel, data, index, false);
                    }
                    if (smodel.getCount() == 0) {
                        Ext.getCmp('btnAceptarHerencia').setDisabled(true);
                    }
                },
                'rowselect': function (smodel, index, record) {
                    var data = record.data;
                    // if (data['ordender'] - data['ordenizq'] != 1) {
                    if (data['_is_leaf'] != 1) {
                        this.changeSelectionChildren(smodel, data, index, true);
                    }
                    if (data['idcuenta'] != data['idcuentapadre']) {
                        this.selectParents(smodel, data);
                    }

                }
            }

        });
        this.columns = [self.sm, {
            header: self.perfil.etiquetas.lbCodigo,
            tooltip: self.perfil.etiquetas.lbTthCodigo,
            dataIndex: 'clavecuenta',
            width: 125,
            sortable: true,
            id: 'expandir'
        }, {
            header: self.perfil.etiquetas.lbDescripcion,
            tooltip: self.perfil.etiquetas.lbTthDescripCtaAp,
            dataIndex: 'descripcion',
            width: 300,
            sortable: false
        }, {
            header: self.perfil.etiquetas.lbGrupoCont,
            tooltip: self.perfil.etiquetas.lbTthGrupoCont,
            dataIndex: 'grupo',
            width: 100,
            sortable: true
        }, {
            header: self.perfil.etiquetas.lbNaturaleza,
            tooltip: self.perfil.etiquetas.lbTthNaturaleza,
            dataIndex: 'descripnaturaleza',
            width: 80,
            sortable: true
        }, {
            header: self.perfil.etiquetas.lbNivelFormato,
            tooltip: self.perfil.etiquetas.lbTthNivel,
            dataIndex: 'nombreformato',
            align: 'left',
            width: 100,
            sortable: false
        }, {
            header: self.perfil.etiquetas.lbCodigoFull,
            tooltip: self.perfil.etiquetas.lbTthCodFull,
            dataIndex: 'concatcta',
            width: 120,
            sortable: true,
            hidden: true
        }, {
            header: self.perfil.etiquetas.lbNomCtaContable,
            tooltip: self.perfil.etiquetas.lbTthCodDescp,
            dataIndex: 'text',
            width: 200,
            sortable: true,
            hidden: true
        }, {
            name: 'concatctax',
            hidden: true,
            hideable: false
        }, {
            name: 'idgrupo',
            hidden: true,
            hideable: false
        }, {
            name: 'idnaturaleza',
            hidden: true,
            hideable: false
        }];
        this.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.get('heredada') == true) {
                rowParams.tstyle += "background-color: #dffbda;";
            } else {
                var style = rowParams.tstyle.split(';');
                if (style[0]) {
                    rowParams.tstyle = style[0] + ';';
                }
            }
        };
        self.root_title = this.perfil.etiquetas.lbCtasCentroRector;
        Ext.Confin.Cuenta.TgCtasHerencia.superclass.initComponent.call(this);
    },
    changeSelectionChildren: function (smodel, data, index, select) {
        var scope = this,
            count = this.store.getCount();
        if (this.onlyparent) {
            return;
        }
        for (var i = index + 1; i < count; i++) {
            var record = this.store.getAt(i);
            if (record && record.data['idcuentapadre'] == data['idcuenta']) {
                if (select) {
                    smodel.selectRow(i, true);
                } else {
                    smodel.deselectRow(i);
                }
            }
        }
    },
    selectParents: function (smodel, data) {
        var index = this.store.findBy(function (record) {
            if (data['idcuentapadre'] == record.data['idcuenta']) {
                return true;
            }
        });
        this.onlyparent = true;
        smodel.selectRow(index, true);
        this.onlyparent = false;
    },
});

Ext.Confin.Cuenta.TgNomApertura = Ext.extend(Ext.Cont.TreeGrid.GridPanel, {
    perfil: new Object(),
    trpCuenta: new Object(),
    root_title: 'Aperturas',
    autoExpandColumn: 'expandir',
    master_column_id: 'expandir',
    height: 500,
    stripeRows: true,
    border: false,
    frame: false,
    loadMask: false,
    initAppCta: false,
    enableColumnMove: false,
    initComponent: function () {
        var self = this;
        this.layout = 'fit';
        this.store = new Ext.Cont.TreeGrid.AdjacencyListStore({
            autoLoad: false,
            url: 'obtenernomtipoaperturas',
            baseParams: {'node': 0},
            listeners: {
                scope: this,
                beforeexpandnode: function (st, record) {
                    self.lMask.show();
                    Ext.getCmp('btnAceptarAps').disable();
                    st.baseParams.node = record.get('id');
                    st.baseParams.filtrando = dataApertura;

                    st.baseParams.idcuentapadre = self.trpCuenta.getSelectionModel().getSelected().data.idcuenta
                    this.nloaded = record;
                },
                load: function (store, records, options) {
                    var sm = this.getSelectionModel();
                    if (store.getTotalCount() <= 0) {
                        mostrarMensaje(1, self.perfil.etiquetas.lbMsgNoData);
                    } else if (this.nloaded) {
                        this.nloaded.set('excludechildren', 1);
                        if (sm.isIdSelected(this.nloaded.id))
                            sm.selectRecords(records, true);
                    }
                    // if (store.getCount() > 0) {
                    //     sm.selectAll();
                    //     var record = sm.getSelections();
                    //     for (var i = record.length-1; i >= 0; i--) {
                    //         if (record[i].data._is_leaf === 0){
                    //             store.expandNode(record[i]);
                    //             // store.setNodeExpanded(record[i], true);
                    //             // store.expandNodeCallback(null, {params:record[i].data.id}, true);
                    //             this.nloaded = undefined;
                    //             // break;
                    //         }
                    //     }
                    // }
                },
                beforeload: function (store, options) {
                    // self.lMask.show();
                    // store.removeAll();
                },
                expandnode: function () {
                    self.lMask.hide();
                    Ext.getCmp('btnAceptarAps').enable();
                }
            },
            reader: new Ext.data.JsonReader({
                id: '_id',
                root: 'data',
                successProperty: 'success'
            }, [{name: 'idconfapertura'},
                {name: 'id'},
                {name: '_id'},
                {name: '_is_leaf'},
                {name: '_parent'},
                {name: 'codigo'},
                {name: 'descripcion'},
                {name: 'text'},
                {name: 'excludechildren'},
                {name: 'concat'},
                {name: 'aperturado'}
            ])
        });
        this.sm = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                scope: this,
                'rowdeselect': function (smodel, index, record) {
                    if (smodel.getCount() == 0)
                        Ext.getCmp('btnAceptarAps').setDisabled(true);
                    var data = record.data;
                    this.changeSelectionChildrenNom(smodel, data, index, false);
                    this.selectParentsNom(smodel, data, false);
                },
                'rowselect': function (smodel, index, record) {
                    if (smodel.getCount() > 0 && Ext.getCmp('cbMonedaApertura').getValue())
                        Ext.getCmp('btnAceptarAps').setDisabled(false);
                    var data = record.data;
                    if (arrApertura.data.denominacion != 'NAE' && arrApertura.data.concepto != 'dat_estructurae') {
                        this.changeSelectionChildrenNom(smodel, data, index, true);
                        this.selectParentsNom(smodel, data, true);
                        if(data['_is_leaf'])
                            data['excludechildren'] = 1;
                    } else {
                        data['excludechildren'] = 1;
                    }
                }
            }

        });
        this.columns = [self.sm, {
            header: self.perfil.etiquetas.lbCodigo,
            tooltip: self.perfil.etiquetas.lbTthCodigo,
            dataIndex: 'codigo',
            width: 200,
            sortable: true,
            id: 'expandir'
        }, {
            header: self.perfil.etiquetas.lbDescripcion,
            tooltip: self.perfil.etiquetas.lbTthDescripCtaAp,
            dataIndex: 'descripcion',
            width: 200,
            sortable: false
        }];
        this.on({
            render:function(){
                self.lMask = new Ext.LoadMask(self.body, {
                    msg: 'Cargando...'
                });
            }
        });
        this.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.get('aperturado') == true) {
                rowParams.tstyle += "background-color: #dffbda;";
            } else {
                var style = rowParams.tstyle.split(';');
                if (style[0]) {
                    rowParams.tstyle = style[0] + ';';
                }
            }
        };
        Ext.Confin.Cuenta.TgCtasHerencia.superclass.initComponent.call(this);
    },
    changeSelectionChildrenNom: function (smodel, data, index, select) {
        var scope = this,
            count = this.store.getCount();
        if (this.onlyparent) {
            return;
        }
        for (var i = index + 1; i < count; i++) {
            var record = this.store.getAt(i);
            if (record && record.data['_parent'] == data['id']) {
                if (select) {
                    smodel.selectRow(i, true);
                } else {
                    smodel.deselectRow(i);
                }
            }
        }
    },
    selectParentsNom: function (smodel, data, select) {
        var index = this.store.findBy(function (record) {
            if (data['_parent'] == record.data['id']) {
                return select;
            }
        });
        this.onlyparent = true;
        smodel.selectRow(index, true);
        this.onlyparent = false;
    }
});

Ext.Confin.Cuenta.NomCuenta = Ext.extend(Ext.Component, {
    perfil: window.parent.UCID.portal.perfil,
    etiquetas: window.parent.UCID.portal.perfil.etiquetas,
    initApp: false,
    flagAction: '',
    lMask: new Object(),
    longMaxApertura: 0,
    nivelAperturar: 0,
    idcriterioe: -1,
    activeNode: undefined,
    activeRow: undefined,
    formatos: new Array(),
    constructor: function () {
        var me = this;
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        Ext.Ajax.request({
            method: "POST",
            url: "cargaretiquetas",
            params: {vista: 'cuentacontable'},
            callback: function (options, success, response) {
                me.perfil.etiquetas = Ext.decode(response.responseText) || me.etiquetas;
                me.cargarInterfaz(this.perfil, this.perfil.etiquetas);
                me.initEvents();
            }
        });
    },
    onloadMessageBox: function (agTtl, agMsg) {
        Ext.MessageBox.show({
            title: agTtl || this.perfil.etiquetas.lbEsperando,
            msg: agMsg || this.perfil.etiquetas.lbCargando,
            width: 300,
            progress: true,
            closable: false
        });
        var f = function (v) {
            return function () {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i);
            };
        };
        for (var i = 1; i < 12; i++) {
            setTimeout(f(i), i * 500);
        }
    },
    loadMask: function (agMsg, agStore) {
        this.lMask = new Ext.LoadMask(Ext.getBody(), {
            msg: agMsg || this.perfil.etiquetas.lbCargando,
            agStore: agStore || null
        });
        this.lMask.show();
    },
    cargarInterfaz: function (perfil, etiquetas) {
        var me = this;
        this.trpCuenta = new Ext.Confin.Cuenta.TgCuenta({perfil: perfil});

        this.btnPlanCta = new Ext.Button({
            id: 'btnPlanCta',
            tabIndex: 1,
            iconCls: 'importar',
            hidden: true,
            text: etiquetas.lbBtnPlanCta,
            tooltip: etiquetas.lbTtPlanCta,
            scope: this,
            handler: function () {
                me.cargarPlanCtas();
            }
        });

        this.btnAdicionar = new Ext.Button({
            id: 'btnAdicionar',
            tabIndex: 2,
            iconCls: 'adicionar',
            disabled: true,
            hidden: true,
            text: etiquetas.lbBtnAdicionar,
            tooltip: etiquetas.lbTtAdicionar,
            scope: this,
            handler: function () {
                this.flagAction = 'Adicionar';
                this.registrarCuenta(this.flagAction);
            }
        });

        this.btnAperturar = new Ext.Button({
            id: 'btnAperturar',
            tabIndex: 3,
            disabled: true,
            hidden: true,
            iconCls: 'apertura',
            text: etiquetas.lbBtnAperturar,
            tooltip: etiquetas.lbTtAperturar,
            scope: this,
            handler: function () {
                this.flagAction = 'Aperturar';
                this.registrarCuenta(this.flagAction);
            }
        });

        this.btnModificar = new Ext.Button({
            id: 'btnModificar',
            tabIndex: 4,
            disabled: true,
            iconCls: 'modificar',
            text: etiquetas.lbBtnModificar,
            tooltip: etiquetas.lbTtModificar,
            scope: this,
            handler: function () {
                this.flagAction = 'Modificar';
                this.registrarCuenta(this.flagAction);
            }
        });

        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            tabIndex: 5,
            disabled: true,
            iconCls: 'eliminar',
            text: etiquetas.lbBtnEliminar,
            tooltip: etiquetas.lbTtEliminar,
            scope: this,
            handler: this.eliminarCuenta
        });

        this.btnHeredar = new Ext.Button({
            id: 'btnHeredar',
            tabIndex: 6,
            disabled: true,
            hidden: true,
            iconCls: 'heredar',
            text: etiquetas.lbBtnHeredar,
            tooltip: etiquetas.lbTtHeredar,
            scope: this,
            handler: function () {
                this.flagAction = 'Heredar';
                this.registrarCuenta(this.flagAction);
            }
        });

        this.btnVistaReporte = new Ext.Button({
            id: 'btnVistaReporte',
            tabIndex: 7,
            iconCls: 'vistareporte',
            hidden: false,
            text: etiquetas.lbBtnVistaReporte,
            tooltip: etiquetas.lbTtVistaReporte,
            scope: this,
            handler: this.obtenerDatosReporte
            /*handler: function(){
                var entidad = me.inforeporte.entidad,
                idestructurae = me.inforeporte.idestructurae,
                fecha = me.inforeporte.fechacontable;
                me.control = new LOG.util.Report({
                    reports: [
                        {
                            name: 'Plan de cuentas',
                            isList: true,
                            params: {
                                entidad: utf8_encode(entidad),
                                idestructurae: idestructurae,
                                modo:1,
                                fechacontable: new Date(fecha)
                            },
                            dirReport: "/distra/contabilidad/PlanCuentasListado"
                        }
                    ]
                });
                me.control.view();
            }*/
        });

        this.lfEntidad = new Ext.form.Label({
            text: 'Entidad',
            style: 'font-weight:bold;color:#0E5CBE'
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnHelpCuentaContable',
            tabIndex: 8,
            iconCls: 'ayuda',
            text: etiquetas.lbBtnAyuda,
            tooltip: me.perfil.etiquetas.lbTtAyuda
        });

        this.btnAdicionarAp = new Ext.Button({
            tabIndex: 3,
            id: 'btnAdicionarAp',
            iconCls: 'adicionar',
            text: etiquetas.lbBtnAdicionar,
            tooltip: etiquetas.lbTtAdicionarAp,
            scope: this,
            handler: function () {
                if (Ext.getCmp('cbNivelFormatoCta').isValid()) {
                    this.flagAction = 'Aperturar';
                    me.registrarCuenta('AddRecordApertura');
                } else {
                    Ext.getCmp('cbNivelFormatoCta').markInvalid(etiquetas.mgsObligatorio);
                }

                me.cbMonedaAperturaRec.setValue(me.stMonedaApertura.getAt(me.stMonedaApertura.find('idmoneda', me.trpCuenta.getSelectionModel().getSelected().data.idmoneda)).data.idmoneda);
                me.cbMonedaAperturaRec.setRawValue(me.stMonedaApertura.getAt(me.stMonedaApertura.find('idmoneda', me.trpCuenta.getSelectionModel().getSelected().data.idmoneda)).data.codigoiso);

                me.btnAdicionarAp.disable();
                me.btnEliminarAp.disable();
            }
        });

        this.btnEliminarAp = new Ext.Button({
            tabIndex: 4,
            id: 'btnEliminarAp',
            iconCls: 'eliminar',
            disabled: true,
            text: etiquetas.lbBtnEliminar,
            tooltip: etiquetas.lbTtEliminarAp,
            scope: this,
            handler: function () {
                me.registrarCuenta('DelRecordApertura');
                me.btnAdicionarAp.enable();
            }
        });

        this.stFormatoCta = new Ext.data.Store({
            url: 'cargarparteformato',
            reader: new Ext.data.JsonReader({
                root: 'data',
                id: 'idcomboparteformato',
                totalProperty: 'cant'
            }, [{name: 'idparteformato'},
                {name: 'nivel'},
                {name: 'nombre'},
                {name: 'longitud'},
                {name: 'idconfapertura'}
            ]),
            listeners: {
                load: function (st, records, index) {
                    //Para seleccionar los datos por los que se aperturo la cuenta.
                    var idconfapertura = records[0].data.idconfapertura;
                    me.cbxNomApertura.disable()
                    if (idconfapertura != -1) {
                        Ext.getCmp('cbNivelFormatoCta').setValue(records[0].data.idparteformato);
                        Ext.getCmp('cbNivelFormatoCta').enable();
                    } else {
                        Ext.getCmp('cbNivelFormatoCta').enable();
                    }

                    Ext.getCmp('fpAperturas').getForm().reset();

                    //Si viene un solo parte formato lo selecciona
                    if (records.length == 1) {
                        Ext.getCmp('cbNivelFormatoCta').setValue(records[0].data.idparteformato);
                        Ext.getCmp('cbNivelFormatoCta').setRawValue(records[0].data.nombre);
                        Ext.getCmp('cbNivelFormatoCta').fireEvent('select', Ext.getCmp('cbNivelFormatoCta'), records[0], 0);
                        me.longFormatAperturar = records[0].data.longitud;
                    }
                }
            }
        });

        this.stFormatoCtaAux = new Ext.data.Store({
            url: 'cargarparteformato',
            reader: new Ext.data.JsonReader({
                root: 'dataAux',
                id: 'idcomboparteformato',
                totalProperty: 'cant'
            }, [{name: 'idparteformato'},
                {name: 'nivel'},
                {name: 'nombre'},
                {name: 'longitud'},
                {name: 'idconfapertura'}
            ]),
            // listeners: {
            //     load: function (st, records, index) {
            //         //Para seleccionar los datos por los que se aperturo la cuenta.
            //         var idconfapertura = records[0].data.idconfapertura;
            //         me.cbxNomApertura.disable()
            //         if (idconfapertura != -1) {
            //             Ext.getCmp('cbNivelFormatoCta').setValue(records[0].data.idparteformato);
            //             Ext.getCmp('cbNivelFormatoCta').enable();
            //         } else {
            //             Ext.getCmp('cbNivelFormatoCta').enable();
            //         }
            //
            //         Ext.getCmp('fpAperturas').getForm().reset();
            //
            //         //Si viene un solo parte formato lo selecciona
            //         if (records.length == 1) {
            //             Ext.getCmp('cbNivelFormatoCta').setValue(records[0].data.idparteformato);
            //             Ext.getCmp('cbNivelFormatoCta').setRawValue(records[0].data.nombre);
            //             Ext.getCmp('cbNivelFormatoCta').fireEvent('select', Ext.getCmp('cbNivelFormatoCta'), records[0], 0);
            //             me.longFormatAperturar = records[0].data.longitud;
            //         }
            //     }
            // }
        });

        this.stNomencladoresCta = new Ext.data.Store({
            url: 'cargarnomsapert',
            reader: new Ext.data.JsonReader({
                    root: "nomencladores"
                },
                [
                    {name: 'idconfapertura'},
                    {name: 'denominacion'},
                    {name: 'identificador'},
                    {name: 'codigo'},
                    {name: 'descripcion'},
                    {name: 'concepto'},
                    {name: 'identificadorpadre'},
                    {name: 'nomesquema'}
                ]
            )
        });

        this.stNaturalezaCta = new Ext.data.Store({
            url: '/contabilidad/comun/xml/naturalezas.xml',
            reader: new Ext.data.XmlReader({
                record: 'row',
                id: 'idnaturaleza',
                totalRecords: '@cant'
            }, [{name: 'descripnaturaleza', mapping: 'naturaleza'}, 'idnaturaleza'])
        });

        this.stNomApLineal = new Ext.data.Store({
            url: 'cargardetailsnomapert',
            sortInfo: {field: 'codigo', direccion: 'asc'},
            reader: new Ext.data.JsonReader({
                totalProperty: "totalProperty",
                root: "fieldValues"
            }, [{name: 'identificador'}, {name: 'concat'}, {name: 'codigo'}, {name: 'descripcion'}, {name: 'idconfapertura'}, {name: 'nomesquema'}])
        });

        this.cbNivelFormatoCta = new Ext.form.ComboBox({
            tabIndex: 1,
            id: 'cbNivelFormatoCta',
            anchor: '100%',
            valueField: 'idparteformato',
            displayField: 'nombre',
            triggerAction: 'all',
            mode: 'local',
            editable: true,
            forceSelection: true,
            typeAhead: true,
            allowBlank: false,
            resizable: true,
            store: me.stFormatoCta,
            tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{nombre}</div></tpl>',
            fieldLabel: this.perfil.etiquetas.lbNivelFormato,
            listeners: {
                'select': function (combo, record, index) {
                    Ext.getCmp('btnAceptarAps').setDisabled(true);
                    Ext.getCmp('gpApertura').getStore().removeAll();
                    if (record.data.idconfapertura == null || record.data.idconfapertura == -1 || record.data.idconfapertura == '') {
                        me.gpApertura.show();
                        me.TgNomApertura.hide();
                        me.cbMonedaApertura.setDisabled(true);
                    } else {
                        me.cbMonedaApertura.setDisabled(false);
                        me.gpApertura.hide();
                        me.TgNomApertura.show();

                        me.stNomencladoresCta.load({
                            params: {
                                idconfapertura: record.data.idconfapertura,
                            }, callback: function (options, success, response) {
                                var idconfapertura = record.data.idconfapertura;
                                arrApertura = me.stNomencladoresCta.getAt(me.stNomencladoresCta.find('idconfapertura', idconfapertura));
                                dataApertura = Ext.encode(me.filtrarValoresNomApertura(me.stNomencladoresCta.find('idconfapertura', idconfapertura)));
                                dataAperturaGeneral = me.filtrarValoresNomApertura(me.stNomencladoresCta.find('idconfapertura', idconfapertura));
                                Ext.Ajax.request({
                                    method: "POST",
                                    url: "obtenernomtipoaperturas",
                                    params: {
                                        anode: 1,
                                        node: (me.trpCuenta.getSelectionModel().getSelected().data.idconfapertura == idconfapertura)
                                            ? me.trpCuenta.getSelectionModel().getSelected().data.idrefnomenclador : 0,
                                        filtrando: dataApertura,
                                        idcuentapadre: me.trpCuenta.getSelectionModel().getSelected().data.idcuenta
                                    },
                                    callback: function (options, success, response) {
                                        var responseData = Ext.decode(response.responseText);
                                        me.TgNomApertura.getStore().removeAll();
                                        me.TgNomApertura.getStore().loadData(responseData);
                                    }
                                });
                            }
                        });
                    }
                    me.nivelAperturar = parseInt(record.data.nivel);
                    me.longFormatAperturar = parseInt(record.data.longitud);
                    me.loadMask(etiquetas.lbCargando);
                    Ext.getCmp('tfRowEditCodCta').maxLength = me.longFormatAperturar;
                    Ext.getCmp('tfRowEditCodCta').maxLengthText = String.format(me.perfil.etiquetas.lbMaxLengthChar, me.longFormatAperturar);
                    me.rowEditorAp.stopEditing();
                    me.gpApertura.getView().refresh();
                    me.lMask.hide();
                },
                'invalid': function () {
                    Ext.getCmp('btnAdicionarAp').disable();
                    Ext.getCmp('btnAdicionarAp').focus(true, 500);
                },
                'valid': function () {
                    Ext.getCmp('btnAdicionarAp').enable();
                }
            }
        });

        this.cbNaturalezaAp = new Ext.form.ComboBox({
            id: 'cbNaturalezaAp',
            disabled: false,
            editable: false,
            typeAhead: true,
            allowBlank: false,
            resizable: true,
            valueField: 'idnaturaleza',
            displayField: 'descripnaturaleza',
            triggerAction: 'all',
            mode: 'local',
            anchor: '100%',
            store: me.stNaturalezaCta,
            fieldLabel: this.perfil.etiquetas.lbNaturaleza
        });

        this.stMonedaApertura = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                id: 'idmoneda',
            }, [{name: 'codigoiso'}, {name: 'idmoneda'}, {name: 'tipomoneda'}])
        });

        this.stTipoCuenta = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                    id: 'idtipocuenta',
                }, [{name: 'idtipocuenta'},
                    {name: 'descripcion'}
                ]
            )
        });

        Ext.Ajax.request({
            url: 'obtenerTipoCuenta',
            method: 'POST',
            scope: this,
            callback: function (options, success, response) {
                this.responseDataTipoCta = Ext.decode(response.responseText);
                this.stTipoCuenta.loadData(this.responseDataTipoCta);
            }
        });

        Ext.Ajax.request({
            url: 'loadDataMoneda',
            method: 'POST',
            scope: this,
            callback: function (options, success, response) {
                Ext.getBody().unmask();
                this.responseDataMoneda = Ext.decode(response.responseText);
                this.stMonedaApertura.loadData(this.responseDataMoneda);
            }
        });

        this.cbMonedaApertura = new Ext.form.ComboBox({
            id: 'cbMonedaApertura',
            disabled: false,
            editable: false,
            typeAhead: true,
            allowBlank: false,
            resizable: true,
            valueField: 'idmoneda',
            displayField: 'codigoiso',
            triggerAction: 'all',
            mode: 'local',
            anchor: '100%',
            store: this.stMonedaApertura,
            fieldLabel: 'Moneda',
            listeners: {
                'select': function (combo, record, index) {
                    if (Ext.getCmp('cbMonedaApertura').getValue()) {
                        if (me.TgNomApertura.getSelectionModel().getCount() > 0 || me.gpApertura.getStore().getCount() > 0) {
                            Ext.getCmp('btnAceptarAps').setDisabled(false);
                        }
                    }
                }
            }
        });

        this.cbNomTipoAperturas = new Ext.form.ComboBox({
            id: 'cbNomTipoAperturas',
            anchor: '100%',
            mode: 'local',
            triggerAction: 'all',
            valueField: 'idconfapertura',
            hiddenName: 'idconfapertura',
            displayField: 'denominacion',
            editable: false,
            typeAhead: true,
            resizable: true,
            allowBlank: false,
            forceSelection: true,
            store: me.stNomencladoresCta,
            emptyText: me.perfil.etiquetas.lbSeleccione,
            fieldLabel: etiquetas.lbNombreNomenclador,
            listeners: {
                'select': function (combo, record, index) {
                    var labelNomAp = record.data.denominacion;
                    me.loadMask(String.format(me.perfil.etiquetas.lbCargandoConceptos, Ext.util.Format.capitalize(labelNomAp)));
                    me.cbxNomApertura.valuesLoaded = new Array();
                    Ext.getCmp('gpNomApertura').getStore().removeAll();
                    me.cbxNomApertura.enable();
                    me.cbxNomApertura.reset();
                    me.cbxNomApertura.clearValue();
                    if (record.data.identificadorpadre != null) {

                    } else {
                        Ext.getCmp('gpNomApertura').getStore().baseParams.filtrando = Ext.encode(me.filtrarValoresNomApertura(index));
                        Ext.getCmp('gpNomApertura').getStore().load({
                            params: {}, callback: function () {
                                me.lMask.hide();
                            }
                        });
                    }
                }
            }
        });

        this.cbxNomApertura = new Ext.CONT.UIXCombo({
            emptyText: etiquetas.lbSeleccione,
            width: (Ext.lib.Dom.getViewWidth() / 3) - 30,
            allowBlank: true,
            disabled: true,
            resizable: true,
            fieldLabel: 'Aperturas'
        }, {
            url: 'obtenernomtipoaperturas',
            identificador: 'NomApertura',
            displayText: 'Apertura',
            id: 'cbxNomApertura',
            autoLoad: false,
            singleSelect: false,
            baseParams: {'node': 0},
            reader: this.jrNomApertura = new Ext.data.JsonReader({
                id: '_id',
                root: 'data'
            }, [{name: 'idconfapertura'},
                {name: 'id'},
                {name: '_id'},
                {name: '_is_leaf'},
                {name: '_parent'},
                {name: 'codigo'},
                {name: 'descripcion'},
                {name: 'text'},
                {name: 'concat'}
            ])
        });

        this.tfCodigoAp = new Ext.form.TextField({
            id: 'tfCodigoAp',
            fieldLabel: this.perfil.etiquetas.lbCodigo,
            anchor: '100%',
            allowBlank: false,
            disabled: true,
            maskRe: /^[0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]*$/,
            regex: /^0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]*$/,
            regexText: this.perfil.etiquetas.lbAlphaNum,
            invalidText: this.perfil.etiquetas.lbAlphaNum
        });

        this.taDescripcionAp = new Ext.form.TextArea({
            id: 'taDescripcionAp',
            fieldLabel: this.perfil.etiquetas.lbDescripcion,
            maxLength: 255,
            anchor: '100%',
            disabled: true,
            allowBlank: false,
            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s %\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s %\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]*)+$/,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s %\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s %\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]*)+$/,
            regexText: me.perfil.etiquetas.lbRegexText,
            invalidText: me.perfil.etiquetas.lbRegexText
        });

        this.rowEditorAp = new Ext.Cont.RowEditor({
            id: 'rowEditorAp',
            clicksToEdit: 2,
            cancelText: etiquetas.lbCancelar,
            saveText: etiquetas.lbBtnGuardar,
            iconClsCancel: 'cancelar',
            iconClsSave: 'guardar'
        });

        this.gpApertura = new Ext.grid.EditorGridPanel({
            id: 'gpApertura',
            frame: false,
            border: false,
            height: 350,
            hidden: true,
            autoExpandColumn: 'expandir',
            viewConfig: {forceFit: true},
            cm: new Ext.grid.ColumnModel([{
                width: 150,
                dataIndex: 'clavecuenta',
                header: etiquetas.lbCodigo,
                renderer: me.verificoCodigo,
                editor: me.tfRowEditCodCta = new Ext.form.TextField({
                    id: 'tfRowEditCodCta',
                    allowBlank: false,
                    savedisplayField: true,
                    maskRe: /^[0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]*$/,
                    regex: /^[0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]*$/,
                    regexText: me.perfil.etiquetas.lbAlphaNum,
                    invalidText: me.perfil.etiquetas.lbAlphaNum
                })
            }, {
                id: 'expandir',
                width: 275,
                dataIndex: 'descripcion',
                header: etiquetas.lbDescripcion,
                editor: me.tfRowEditDescripCta = new Ext.form.TextField({
                    id: 'tfRowEditDescripCta',
                    maxLength: 255,
                    allowBlank: false,
                    savedisplayField: true,
                    // maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s %\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s %\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]*)+$/,
                    // regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s %\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s %\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]*)+$/,
                    regexText: me.perfil.etiquetas.lbRegexText,
                    invalidText: me.perfil.etiquetas.lbRegexText,
                    maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&\%]+?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&\%]*)+$/,
                    regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&\%]+(\s{1})?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&\%]*)+$/,
                    // regexText: me.perfil.etiquetas.lbRegexText,
                    listeners: {
                        'keyup': function () {
                            me.verificarCampos();
                        },
                        'invalid': function (cmp, msg) {
                            if (cmp.getValue().length > 0) {
                                var vtext = cmp.getValue().trim();
                                cmp.setValue(vtext);
                            }
                        },
                        'blur': function (cmp) {
                            if (cmp.getValue().length > 0) {
                                var vtext = cmp.getValue().trim();
                                cmp.setValue(vtext);
                            }
                        }
                    }
                })
            }, {
                width: 275,
                dataIndex: 'idmoneda',
                header: 'Moneda',
                editor: me.cbMonedaAperturaRec = new Ext.form.ComboBox({
                    id: 'cbMonedaAperturaRec',
                    disabled: false,
                    editable: false,
                    typeAhead: true,
                    allowBlank: false,
                    resizable: true,
                    valueField: 'idmoneda',
                    displayField: 'codigoiso',
                    triggerAction: 'all',
                    mode: 'local',
                    anchor: '100%',
                    store: this.stMonedaApertura,
                    fieldLabel: 'Moneda'
                }),
                renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                    if (!Ext.isEmpty(value)) {
                        var store = this.stMonedaApertura;
                        if (store) {
                            var index = store.find('idmoneda', value);
                            if (index >= 0) {
                                var newValue = store.getAt(index).data.codigoiso;
                                return newValue;
                            }
                        }
                    }
                }.bind(this)
            }]),
            store: new Ext.data.Store({
                reader: new Ext.data.JsonReader({
                    totalProperty: 'cant',
                    root: 'data'
                }, [{
                    name: 'clavecuenta'
                }, {
                    name: 'descripcion'
                }, {
                    name: 'idmoneda'
                }, {
                    name: 'codigoiso'
                }])
            }),
            sm: new Ext.grid.RowSelectionModel({singleSelect: false}),
            tbar: [me.btnAdicionarAp, me.btnEliminarAp],
            plugins: [me.rowEditorAp]
        });

        this.TgNomApertura = new Ext.Confin.Cuenta.TgNomApertura({perfil: me.perfil, trpCuenta: me.trpCuenta});

        this.items = [{
            labelAlign: 'top',
            anchor: '100%',
            layout: 'form',
            items: [{
                layout: 'column',
                anchor: '100%',
                items: [{
                    columnWidth: .7,
                    layout: 'form',
                    labelAlign: 'top',
                    items: [this.cbNivelFormatoCta]
                }, {
                    style: 'margin:0 0 0 10',
                    columnWidth: .3,
                    layout: 'form',
                    labelAlign: 'top',
                    items: [this.cbMonedaApertura]
                }]
            }, this.TgNomApertura, this.gpApertura]
        }];

        this.fpAperturas = new Ext.form.FormPanel({
            id: 'fpAperturas',
            frame: true,
            border: false,
            items: this.items,
            buttons: [{
                tabIndex: 6,
                id: 'btnCancelarAps',
                text: etiquetas.lbCancelar,
                tooltip: etiquetas.lbTtCancelarAp,
                iconCls: 'cancelar',
                handler: function () {
                    me.kmCta.enable();
                    me.kmAperturas.disable();
                    me.rowEditorAp.stopEditing();
                    me.gpApertura.getView().refresh();
                    Ext.getCmp('fpAperturas').getForm().reset();
                    Ext.getCmp('gpApertura').getStore().removeAll();
                    Ext.getCmp('fpAperturas').collapse(true);
                    Ext.getCmp('pnlAperturas').hide();
                    Ext.getCmp('pnlAperturas').collapse(true);
                    Ext.getCmp('pnlAperturas').doLayout();
                    me.trpCuenta.getSelectionModel().unlock();
                    me.pnlNomCuenta.getTopToolbar().enable();
                    me.trpCuenta.getBottomToolbar().enable();
                    me.btnAdicionarAp.enable();
                }
            }, {
                tabIndex: 5,
                id: 'btnAceptarAps',
                text: etiquetas.lbGuardar,
                tooltip: etiquetas.lbTtGuardarAp,
                iconCls: 'guardar',
                disabled: true,
                handler: function () {
                    if (me.cbMonedaApertura.getValue()) {
                        me.salvarCambios('Aperturar');
                        Ext.getCmp('fpAperturas').getForm().reset();
                        Ext.getCmp('gpApertura').getStore().removeAll();
                        Ext.getCmp('fpAperturas').collapse(true);
                        Ext.getCmp('pnlAperturas').hide();
                        Ext.getCmp('pnlAperturas').collapse(true);
                        Ext.getCmp('pnlAperturas').doLayout();
                        me.trpCuenta.getSelectionModel().unlock();
                        me.pnlNomCuenta.getTopToolbar().enable();
                        me.trpCuenta.getBottomToolbar().enable();
                        me.btnAdicionarAp.enable();
                    } else {
                        me.cbMonedaApertura.markInvalid();
                    }
                }
            }],
            keys: this.kmAperturas = new Ext.KeyMap(Ext.getBody(), [
                {
                    alt: true,
                    key: 'x',
                    fn: function () {
                        if (!Ext.getCmp('btnCancelarAps').disabled)
                            Ext.getCmp('btnCancelarAps').handler.call();
                    },
                    scope: me
                }, {
                    alt: true,
                    key: 'g',
                    fn: function () {
                        if (!Ext.getCmp('btnAceptarAps').disabled)
                            Ext.getCmp('btnAceptarAps').handler.call();
                    },
                    scope: this
                }, {
                    alt: true,
                    key: 'i',
                    fn: function () {
                        if (!Ext.getCmp('btnAdicionarAp').disabled)
                            Ext.getCmp('btnAdicionarAp').handler.call();
                    },
                    scope: this
                }, {
                    key: Ext.EventObject.DELETE,
                    fn: function () {
                        if (!Ext.getCmp('btnEliminarAp').disabled)
                            Ext.getCmp('btnEliminarAp').handler.call();
                    },
                    scope: this
                }, {
                    key: "b",
                    alt: true,
                    scope: this,
                    fn: function () {
                        var filter = Ext.getCmp('sfBuscarCta');
                        if (filter.getValue()) {
                            filter.onTrigger2Click();
                        } else {
                            filter.focus();
                        }
                    }
                }, {
                    key: "l",
                    alt: true,
                    scope: this,
                    fn: function () {
                        var filter = Ext.getCmp('sfBuscarCta');
                        if (filter.getValue()) {
                            filter.onTrigger1Click();
                        }
                    }
                }
            ])
        });

        this.pnlNomCuenta = new Ext.Panel({
            id: 'pnlNomCuenta',
            layout: 'border',
            border: false,
            items: [{
                layout: 'fit',
                region: 'center',
                items: this.trpCuenta
            }, {
                title: etiquetas.lbTtlApCta,
                iconCls: '',
                id: 'pnlAperturas',
                layout: 'fit',
                region: 'east',
                width: (Ext.lib.Dom.getViewWidth() / 3),
                hidden: true,
                split: true,
                collapseFirst: true,
                animCollapse: true,
                collapsed: true,
                titleCollapse: true,
                collapsible: true,
                border: false,
                items: [this.fpAperturas]
            }],
            tbar: [this.btnPlanCta, this.btnAdicionar, this.btnAperturar, this.btnModificar, this.btnEliminar, this.btnHeredar, this.btnVistaReporte,'->', this.btnAyuda, this.lfEntidad],
            keys: this.kmCta = new Ext.KeyMap(Ext.getBody(), [
                {
                    ctrl: true,
                    alt: true,
                    key: 'p',
                    fn: function () {
                        if (!Ext.getCmp('btnPlanCta').disabled)
                            Ext.getCmp('btnPlanCta').handler.call(me);
                    }
                }, {
                    alt: true,
                    key: 'i',
                    fn: function () {
                        if (!Ext.getCmp('btnAdicionar').disabled)
                            Ext.getCmp('btnAdicionar').handler.call(me);
                    }
                }, {
                    alt: true,
                    key: 'a',
                    fn: function () {
                        if (!Ext.getCmp('btnAperturar').disabled)
                            Ext.getCmp('btnAperturar').handler.call(me);
                    }
                }, {
                    alt: true,
                    key: 'm',
                    fn: function () {
                        if (!Ext.getCmp('btnModificar').disabled)
                            Ext.getCmp('btnModificar').handler.call(me);
                    }
                }, {
                    key: Ext.EventObject.DELETE,
                    fn: function () {
                        if (!Ext.getCmp('btnEliminar').disabled)
                            Ext.getCmp('btnEliminar').handler.call(me);
                    }
                }, {
                    ctrl: true,
                    alt: true,
                    key: 'h',
                    fn: function () {
                        if (!Ext.getCmp('btnHeredar').disabled)
                            Ext.getCmp('btnHeredar').handler.call(me);
                    }
                }, {
                    alt: true,
                    key: 'r',
                    fn: function () {
                        if (!Ext.getCmp('btnVistaReporte').disabled)
                            Ext.getCmp('btnVistaReporte').handler.call(me);
                    }
                }
            ])
        });
        new Ext.Viewport({layout: 'fit', items: this.pnlNomCuenta});
    },
    clearFormManual: function () {
        Ext.getCmp('tfCodigoAp').reset();
        Ext.getCmp('cbNaturalezaAp').reset();
        Ext.getCmp('taDescripcionAp').reset();
    },
    disableFormManual: function () {
        Ext.getCmp('tfCodigoAp').disable();
        Ext.getCmp('cbNaturalezaAp').disable();
        Ext.getCmp('taDescripcionAp').disable();
    },
    enableFormManual: function () {
        Ext.getCmp('tfCodigoAp').enable();
        Ext.getCmp('cbNaturalezaAp').enable();
        Ext.getCmp('taDescripcionAp').enable();
    },
    registrarCuenta: function (opt) {
        var me = this;
        me.kmCta.disable();
        me.arrayNodosAperturados = me.trpCuenta.getSelectionModel().getSelections();
        arrayNodosAperturados = me.trpCuenta.getSelectionModel().getSelections();
        switch (opt) {
            case 'Adicionar': {
                this.adicionarCtasCentroRector('add');
            }
                break;
            case 'Modificar': {
                if (me.trpCuenta.getSelectionModel().getSelected()) {
                    this.adicionarCtasCentroRector('mod');
                    selecction = this.trpCuenta.selModel.getSelected();
                    me.formAdicionarCtas.getForm().loadRecord(selecction);

                    // if(selecction.data.ctaheredada == null && !selecction.data.operacion && selecction.data.idrefnomenclador != null)
                    if (!selecction.data.ctaheredada && !selecction.data.operacion && !selecction.data.idrefnomenclador)
                        Ext.getCmp('tfieldCodigo').enable();
                    else
                        Ext.getCmp('tfieldCodigo').disable();

                    var prueba = selecction.data.clavecuenta.split('<span style="background-color: rgb(255, 255, 0)";>');
                    if (prueba.length > 1) {
                        var cuentaValue = prueba[1].split('</span>');
                        me.tfieldCodigo.setValue(cuentaValue[0]);
                    }
                    else {
                        me.tfieldCodigo.setValue(selecction.data.clavecuenta);
                    }

                    me.tfieldDescripcion.setValue(selecction.data.descripcion);
                    me.cbGrupoCont.setValue(selecction.data.idgrupo, selecction.data.grupo);
                    me.cbNaturaleza.setValue(selecction.data.idnaturaleza);
                    me.cbNaturaleza.setRawValue(selecction.data.descripnaturaleza);
                    me.cbTipoCuenta.setValue(selecction.data.idtipocuenta);
                    me.cbTipoCuenta.setRawValue(selecction.data.tipocuenta);

                    if (selecction.data.nivel == 1 && selecction.data._is_leaf == true && selecction.data.ctaheredada == null)
                        me.cbTipoCuenta.enable();
                    else
                        me.cbTipoCuenta.disable();

                    // me.cbVisible.disable();
                    me.cbVisible.setValue(selecction.data.visibilidad);

                    var valMod = (selecction.data.operacion == true
                        || selecction.data.heredada == true
                        || selecction.data._is_leaf == false) ? true : false;

                    if (valMod) {
                        // me.tfieldDescripcion.setDisabled(valMod);
                        me.tfieldCodigo.setDisabled(valMod);
                        me.cbGrupoCont.setDisabled(valMod);
                        me.cbNaturaleza.setDisabled(valMod);
                        me.cbTipoCuenta.setDisabled(valMod);
                        me.cbVisible.setDisabled(valMod);
                        me.cbMoneda.setDisabled(valMod);
                    }
                    me.tfieldDescripcion.enable();
                } else {
                    mostrarMensaje(1, me.perfil.etiquetas.lbMsgSelectCta);
                }
            }
                break;
            case 'Aperturar': {
                me.TgNomApertura.getStore().removeAll();
                me.nodoAperturado = me.trpCuenta.getSelectionModel().getSelected();
                // me.arrayNodosAperturados = me.trpCuenta.getSelectionModel().getSelections();
                if (arrayNodosAperturados[0]) {
                    // if (me.arrayNodosAperturados[0]) {
                    // if (me.nodoAperturado) {
                    me.checkApertura();
                } else {
                    mostrarMensaje(1, me.perfil.etiquetas.lbMsgSelectCta);
                }
            }
                break;
            case 'Heredar': {
                Ext.Msg.wait(me.perfil.etiquetas.lbCargando, me.perfil.etiquetas.lbEsperar);
                Ext.Ajax.request({
                    method: "POST",
                    url: "obtenercuentasherencia",
                    callback: function (options, success, response) {
                        Ext.Msg.hide();
                        var responseData = Ext.decode(response.responseText);
                        switch (responseData.clave) {
                            case -1:
                                me.heredarCtasCentroRector();
                                me.tgCtasHerencia.getStore().baseParams = {idcuenta: 0};
                                me.tgCtasHerencia.getStore().removeAll();
                                me.tgCtasHerencia.getStore().loadData(responseData);
                                me.flagHeredarCtas++;
                                break;
                            case -2:
                                mostrarMensaje(1, me.perfil.etiquetas.lbMsgNoAction);
                                break;
                            case -3:
                                mostrarMensaje(1, me.perfil.etiquetas.lbMsgNoRector);
                                break;
                            default:
                                if (responseData.codMsg && responseData.mensaje) {
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                }
                                break;
                        }
                    }
                });
            }
                break;
            case 'AddRecordApertura': {
                me.btnEliminarAp.setDisabled(true);
                var arrdinamico = new Array();
                var objdinamico = {};
                for (var i = 0; i < me.gpApertura.getStore().fields.keys.length; i++) {
                    arrdinamico.push({name: me.gpApertura.getStore().fields.keys[i]});
                    objdinamico[me.gpApertura.getStore().fields.keys[i]] = '';
                }
                objdinamico.valid = false;
                var Recdinamico = Ext.data.Record.create(arrdinamico);
                var total = me.gpApertura.getStore().getCount();
                me.rowEditorAp.stopEditing();
                var recdinamico = new Recdinamico(objdinamico);
                me.gpApertura.getStore().insert(total, recdinamico);
                me.gpApertura.getView().refresh();
                me.gpApertura.getSelectionModel().selectRow(total);
                me.rowEditorAp.startEditing(total, 0);
                me.tfRowEditCodCta.focus(false, 100);
            }
                break;
            case 'DelRecordApertura': {
                var seleccionados = me.gpApertura.getSelectionModel().getSelections();
                var cantseleccionados = seleccionados.length;
                if (cantseleccionados > 0) {
                    for (var i = 0; i < cantseleccionados; i++) {
                        seleccionados[i].commit();
                        me.gpApertura.getStore().remove(seleccionados[i]);
                    }

                    if (me.gpApertura.getSelectionModel().getCount() == 0) {
                        me.btnEliminarAp.setDisabled(true);
                    }

                    if (me.gpApertura.getStore().getCount() == 0) {
                        Ext.getCmp('btnAceptarAps').setDisabled(true);
                    }
                } else {
                    mostrarMensaje(1, String.format(me.perfil.etiquetas.lbMsgNoSel, me.perfil.etiquetas.lbAperturas));
                }
            }
                break;
            case 'VistaReporte': {

            }
                break;
        }
    },
    eliminarCuenta: function () {
        var me = this;
        me.kmCta.disable();
        if (me.trpCuenta.getSelectionModel().getCount() != 0) {
            var msgDel = me.perfil.etiquetas.lbConfirmDelCta;
            if (me.trpCuenta.getSelectionModel().getCount() > 1) {
                msgDel = me.perfil.etiquetas.lbConfirmDelCtas;
            }
            mostrarMensaje(2, msgDel, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    var paramsDel = new Object();
                    var arrayIdCuentas = new Array();
                    var arrayIdNodoPadre = new Array();
                    if (me.trpCuenta.getSelectionModel().getCount() > 1) {
                        var selDelCtas = me.trpCuenta.getSelectionModel().getSelections();
                        for (var i = 0; i < me.trpCuenta.getSelectionModel().getCount(); i++) {
                            arrayIdCuentas.push({idcuenta: parseInt(selDelCtas[i].data.idcuenta)});
                        }
                        paramsDel = {arrayIdCuentas: Ext.encode(arrayIdCuentas)};
                    } else {
                        paramsDel = {idcuenta: me.trpCuenta.getSelectionModel().getSelected().data.idcuenta};
                    }
                    var selDelCtas = me.trpCuenta.getSelectionModel().getSelections();
                    Ext.Msg.wait(me.perfil.etiquetas.lbWaitMsgDel, me.perfil.etiquetas.lbEsperar);
                    Ext.Ajax.request({
                        url: 'eliminarcuenta',
                        method: 'POST',
                        params: paramsDel,
                        callback: function (options, success, response) {
                            Ext.Msg.hide();
                            var responseData = Ext.decode(response.responseText);
                            switch (responseData.code) {
                                case -1: {
                                    var selDelCtas = me.trpCuenta.getSelectionModel().getSelections();
                                    for (var i = 0; i < selDelCtas.length; i++) {
                                        // flagArray = false;
                                        // for (var k = 0; k < arrayIdNodoPadre.length; k++) {
                                        //     if(arrayIdNodoPadre[k] = selDelCtas[i].data._parent){
                                        //         flagArray = true;
                                        //         break;
                                        //     }
                                        // }
                                        //
                                        // if(!flagArray){
                                        //     arrayIdNodoPadre.push(selDelCtas[i].data._parent);
                                        // }
                                        arrayIdNodoPadre.push(selDelCtas[i].data._parent);
                                        me.trpCuenta.getStore().remove(selDelCtas[i]);
                                    }
                                    me.trpCuenta.getView().refresh();
                                    for (var j = 0; j < arrayIdNodoPadre.length; j++) {
                                        if (me.trpCuenta.getStore().find('_parent', arrayIdNodoPadre[j]) < 0) {
                                            if (me.trpCuenta.getStore().getAt(me.trpCuenta.getStore().find('idcuenta', arrayIdNodoPadre[j]))) {
                                                me.trpCuenta.getStore().getAt(me.trpCuenta.getStore().find('idcuenta', arrayIdNodoPadre[j])).data._is_leaf = true;
                                                // me.trpCuenta.getStore().getAt(me.trpCuenta.getStore().find('idcuenta', arrayIdNodoPadre[j])).data.idconfapertura = null;
                                                // me.trpCuenta.getStore().getAt(me.trpCuenta.getStore().find('idcuenta', arrayIdNodoPadre[j])).data.idrefnomenclador = null;
                                            }
                                        }
                                    }
                                    me.trpCuenta.getView().refresh();

                                    if (selDelCtas.length == 1) {
                                        mostrarMensaje(1, me.perfil.etiquetas.lbMsgDelOK);
                                    } else {
                                        mostrarMensaje(1, me.perfil.etiquetas.lbMsgDelManyOK);
                                    }
                                    Ext.Msg.hide();
                                }
                                    break;
                                case -2: {
                                    var mensaje = '', ctaDetalle = '';
                                    if (responseData.errors.length > 1) {
                                        for (var i = 0; i < responseData.errors.length; i++) {
                                            ctaDetalle += "<li>" + "<i>" + responseData.errors[i].concatctax + " " + responseData.errors[i].descripcion + ".</i></li>";
                                        }
                                        mensaje = me.perfil.etiquetas.lbMsgDelCtasOp + ctaDetalle;
                                    } else {
                                        ctaDetalle += responseData.errors[0].concatctax + ' ' + responseData.errors[0].descripcion;
                                        mensaje = String.format(me.perfil.etiquetas.lbMsgDelCtaOp, ctaDetalle);
                                    }
                                    mostrarMensaje(1, mensaje);
                                }
                                    break;
                                case -3: {
                                    // var mensaje = '', ctaDetalle = '';
                                    // if (responseData.errors.length > 1) {
                                    //     for (var i = 0; i < responseData.errors.length; i++) {
                                    //         ctaDetalle += "<li>" + "<i>" + responseData.errors[i].concatctax + " " + responseData.errors[i].descripcion + ".</i></li>";
                                    //     }
                                    //     mensaje = me.perfil.etiquetas.lbMsgDelCtasUso + ctaDetalle;
                                    // } else {
                                    //     ctaDetalle += responseData.errors[0].concatctax + ' ' + responseData.errors[0].descripcion;
                                    //     mensaje = String.format(me.perfil.etiquetas.lbMsgDelCtaUso, ctaDetalle);
                                    // }

                                    mostrarMensaje(1, 'La(s) cuenta(s) contable(s) no pueden ser eliminada(s) debido a que están en uso.');
                                }
                                    break;
                                case -4: {
                                    var mensaje = '', ctaDetalle = '', temp = '', tem1 = '';
                                        for (var i = 0; i < responseData.errors.length; i++) {
                                            ctaDetalle += '<br>';
                                            tem1 = Ext.decode(responseData.errors[i].estructuras);
                                            for (var j = 0; j < tem1.length; j++) {
                                                temp += '<br> ' + tem1[j];
                                            }
                                            ctaDetalle += responseData.errors[i].concatcta + " :" + temp;
                                        }
                                        mensaje = 'La(s) cuenta(s) no pueden ser eliminada(s) debido a que están heredadas en las siguientes estructuras: ' + ctaDetalle;
                                    mostrarMensaje(1, mensaje);
                                }
                                    break;
                                default:
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                    break;
                            }
                        }
                    });
                }
                me.kmCta.enable();
            });
        } else {
            mostrarMensaje(1, String.format(me.perfil.etiquetas.lbMsgNoSel, me.perfil.etiquetas.lbCuentas));
            me.kmCta.enable();
        }
    },
    heredarCuentas: function () {
        var me = this;
        if (me.tgCtasHerencia.getSelectionModel().getCount() > 1) {
            Ext.Msg.wait(me.perfil.etiquetas.lbWaitRegHerSimple, me.perfil.etiquetas.lbEsperar);
        } else {
            Ext.Msg.wait(me.perfil.etiquetas.lbWaitRegHerMultiple, me.perfil.etiquetas.lbEsperar);
        }
        var permitirConOperaciones = 0;
        for (var i = 0; i < validate.accionesPermitidas.length; i++) {
            validate.accionesPermitidas[i].abreviatura
            if (validate.accionesPermitidas[i].abreviatura == 'pe') {
                permitirConOperaciones = 1;
            }
        }
        Ext.Ajax.request({
            method: "POST",
            url: "heredarcuentas",
            params: {
                arrayIdCtas: Ext.encode(me.dameCtasSelectionModelHeredar(me.tgCtasHerencia.getSelectionModel())),
                permitirconoperaciones: permitirConOperaciones
                // arrayIdCtas: Ext.encode(me.dameCtasSelectionModel(me.tgCtasHerencia.getSelectionModel()))
            },
            callback: function (options, success, response) {
                Ext.Msg.hide();
                var responseData = Ext.decode(response.responseText);
                switch (responseData.clave) {
                    case -1:
                        if (me.tgCtasHerencia.getSelectionModel().getCount() > 1) {
                            mostrarMensaje(1, me.perfil.etiquetas.lbAddCtaHerMultiple);
                        } else {
                            mostrarMensaje(1, me.perfil.etiquetas.lbAddCtaHerSimple);
                        }
                        me.tgCtasHerencia.getStore().removeAll();
                        me.tgCtasHerencia.getStore().baseParams = {idcuenta: 0, modo: 1};
                        me.tgCtasHerencia.getStore().load({params: {idcuenta: 0, modo: 1}});
                        me.trpCuenta.getStore().removeAll();
                        me.trpCuenta.getStore().baseParams = {idcuenta: 0, modo: 1};
                        me.trpCuenta.getStore().load({params: {idcuenta: 0, modo: 1}});
                        break;
                    case -2:
                        mostrarMensaje(1, me.perfil.etiquetas.lbMsgNoAction);
                        break;
                    case -3:
                        mostrarMensaje(1, responseData.data);
                        break;
                    case -4:
                        mostrarMensaje(1, 'Las cuentas seleccionadas ya han sido heredadas.');
                        break;
                    default:
                        if (responseData.codMsg && responseData.mensaje) {
                            mostrarMensaje(responseData.codMsg, responseData.mensaje);
                        }
                        break;
                }
            }
        });
    },
    savePlanCuentas: function () {
        var me = this;
        Ext.Msg.wait(me.perfil.etiquetas.lbCargando, me.perfil.etiquetas.lbEsperar);
        Ext.Ajax.request({
            method: "POST",
            url: "savePlanCuentas",
            params: {
                idPlanCtas: me.winPlanCtas.items.items[0].idclasificadorplancuenta
            },
            callback: function (options, success, response) {
                var result = Ext.decode(response.responseText);
                Ext.Msg.hide();
                switch (result.clave) {
                    case -1: {
                        mostrarMensaje(1, me.perfil.etiquetas.lbPlanCtaAddOk);
                        me.trpCuenta.getStore().removeAll();
                        me.trpCuenta.getStore().baseParams = {idcuenta: 0, modo: 1};
                        me.trpCuenta.getStore().load({params: {idcuenta: 0, modo: 1}});
                    }
                        break;
                    case -2: {
                        mostrarMensaje(1, me.perfil.etiquetas.lbInvFormatPlanCta, Ext.emptyFn);
                    }
                        break;
                }
            }
        });
    },
    updateTreeGridCtas: function (reload, arrayNodo) {
        var me = this;
        var node = 0;
        if (arrayNodo) {
            // me.trpCuenta.getStore().baseParams = {
            //     node: arrayNodo[0].id,
            //     idcuenta: arrayNodo[0].id,
            //     modo: me.trpCuenta.cbxTbarVigencia.getValue()
            // };
            // me.trpCuenta.getStore().load({
            //     callback: function () {
            //         if (!reload) {
            //             arrayNodo[0].data._is_leaf = false;
            //             me.trpCuenta.getView().refresh();
            //             me.trpCuenta.getStore().expandNode(arrayNodo[0]);
            //             arrayNodo.shift();
            //             if (arrayNodo[0]) {
            //                 me.updateTreeGridCtas('', arrayNodo);
            //             }
            //         }
            //     }
            // });
            // arrayNodo.forEach(function (element, arr, index) {
            //     element.data._is_leaf = false;
            // });
            // me.trpCuenta.getStore().commitChanges();
            // me.trpCuenta.getView().refresh();
            // me.trpCuenta.getSelectionModel().clearSelections();
        } else if (!reload) {
            me.trpCuenta.getStore().commitChanges();
            me.trpCuenta.getStore().removeAll();
            me.trpCuenta.getStore().baseParams = {
                node: node,
                idcuenta: 0,
                modo: me.trpCuenta.cbxTbarVigencia.getValue()
            };
            me.trpCuenta.getStore().load({
                params: {
                    node: node,
                    idcuenta: 0,
                    modo: me.trpCuenta.cbxTbarVigencia.getValue()
                }
            });
            me.trpCuenta.getView().refresh();
        } else {
            me.trpCuenta.getStore().reload();
            me.trpCuenta.getView().refresh();
        }
    },
    // updateTreeGridCtas: function (reload,nodo) {
    //     var me = this,
    //         node = 0;
    //     if(nodo){
    //         me.trpCuenta.getStore().baseParams = {
    //             node: nodo.id,
    //             idcuenta: nodo.id,
    //             modo: me.trpCuenta.cbxTbarVigencia.getValue()
    //         };
    //         me.trpCuenta.getStore().load({
    //             callback:function(){
    //                 if(!reload){
    //                     nodo.data._is_leaf = false;
    //                     me.trpCuenta.getView().refresh();
    //                     me.trpCuenta.getStore().expandNode(nodo);
    //                 }
    //             }
    //         });
    //     } else if (!reload) {
    //         me.trpCuenta.getStore().commitChanges();
    //         me.trpCuenta.getStore().removeAll();
    //         me.trpCuenta.getStore().baseParams = {node: node, idcuenta: 0, modo: me.trpCuenta.cbxTbarVigencia.getValue()};
    //         me.trpCuenta.getStore().load({
    //             params: {
    //                 node: node,
    //                 idcuenta: 0,
    //                 modo: me.trpCuenta.cbxTbarVigencia.getValue()
    //             }
    //         });
    //         me.trpCuenta.getView().refresh();
    //     } else {
    //         me.trpCuenta.getStore().reload();
    //         me.trpCuenta.getView().refresh();
    //     }
    // },
    updateTgCtasHerencia: function () {
        var me = this;
        me.trpCuenta.getStore().rejectChanges();
        me.tgCtasHerencia.getStore().removeAll();
        me.tgCtasHerencia.getStore().baseParams = {idcuenta: 0, modo: 1};
        me.tgCtasHerencia.getStore().load();
        me.tgCtasHerencia.getView().refresh();
    },
    // obtenerDatosReporte: function () {
    //     var me = this;
    //     me.kmCta.disable();
    //     Ext.Msg.wait(this.perfil.etiquetas.lbCargando, this.perfil.etiquetas.lbEsperar);
    //     Ext.Ajax.request({
    //         url: 'obtenerDatosImprimirReporte',
    //         params: {modo: me.trpCuenta.cbxTbarVigencia.getValue()},
    //         callback: function (options, success, response) {
    //             var responseData = Ext.decode(response.responseText);
    //             Ext.Msg.hide();
    //             if (responseData.datoCuerpo.length > 0) {
    //                 me.mostrarReporte(responseData);
    //             } else {
    //                 mostrarMensaje(1, this.perfil.etiquetas.lbMsgNoData);
    //             }
    //             me.kmCta.enable();
    //         }
    //     });
    // },
    obtenerDatosReporte: function () {
        var me = this;
        //<Nuevo filtro>
        //<Botones>
        if (!me.ventanaFiltro) {
            me.btnCancelarFil = new Ext.Button({
                // tabIndex: 6,
                id: 'btnCancelarAps',
                text: 'Cancelar',
                tooltip: 'Cancelar',
                iconCls: 'cancelar',
                handler: function () {
                    me.ventanaFiltro.hide();
                }
            });
            me.btnAceptarFil = new Ext.Button({
                // tabIndex: 6,
                id: 'btnCancelarAps',
                text: 'Aceptar',
                tooltip: 'Aceptar',
                iconCls: 'aceptar',
                disabled: true,
                handler: function () {
                    var nivel;
                    var flag = Ext.getCmp('gpNivel').getSelectionModel().getSelections();
                    if (flag.length){
                        nivel = flag[0].data.nivel;
                    }
                    me.ventanaFiltro.hide();
                    me.mostrarReporte({
                        idreporte: '115-2',
                        nivel: nivel ? nivel : undefined,
                        idcuenta: me.ctaNivel.getValue(),
                        activo: me.trpCuenta.cbxTbarVigencia.getValue()
                    });
                }
            });
            //</Botones>

            //<Campos del formulario>

            //Nivel
            me.cbxNivel = new Ext.CONT.UIXCombo({
                // emptyText: scope.etiquetas.txtSeleccione,
                allowBlank: false,
                fieldLabel: 'Nivel',
                loaded: true,
                tabIndex: 1
            }, {
                identificador: 'Nivel',
                displayText: 'nombre',
                url: 'obtenerNivelesCuentas',
                autoLoad: true,
                singleSelect: true,
                reader: me.jrNiveles = new Ext.data.JsonReader({
                    id: 'id'
                    //root: 'datos'
                }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'idparteformato'
                }, {
                    name: 'codigo'
                }, {
                    name: 'text'
                }, {
                    name: 'nombre'
                }, {
                    name: 'id'
                }, {
                    name: 'nivel'
                }, {
                    name: 'abreviatura'
                }])
            });

            //Cuenta

            // me.ctaNivel = new Ext.CONT.UIXCombo({
            //     // emptyText: scope.etiquetas.txtSeleccione,
            //     invalidText: "Este campo es obligatorio.",
            //     allowBlank: true,
            //     loaded: true,
            //     fieldLabel: 'Cuenta',
            //     tabIndex: 2
            // }, {
            //     identificador: 'CtaNivel',
            //     displayText: 'text',
            //     url: 'obtenerCtaPorNivel',
            //     height: 200,
            //     autoLoad: false,
            //     singleSelect: false,
            //     reader: me.jrCuenta = new Ext.data.JsonReader({
            //         id: 'idcuenta',
            //         root: 'datos'
            //     }, [{
            //         name: '_parent'
            //     }, {
            //         name: '_is_leaf'
            //     }, {
            //         name: 'text'
            //     }, {
            //         name: 'idcuenta'
            //     }, {
            //         name: 'codigo',
            //         mapping: 'concatcta'
            //     }, {
            //         name: 'descripcion'
            //     }, {
            //         name: 'clavecuenta'
            //     }])
            // });

            me.stCuenta = new Ext.data.Store({
                url: 'obtenerCuentaPorNivel',
                autoLoad: false,
                // baseParams: {
                //     'arrayIdEstructurae': Ext.encode(scope.cbxEntidad.fSelect.values)
                // },
                reader: new Ext.data.JsonReader({
                    root: 'datos'
                }, [
                    {name: 'idcuenta'},
                    {name: 'text'},
                    {name: 'idmoneda'},
                    {name: 'codigo'},
                ])
            });

            me.ctaNivel = new Ext.contabilidad.util.linkedCombo({
                disabledClass: 'disabled-component',
                store: me.stCuenta,
                fieldLabel: 'Cuenta',
                loaded: true,
                allowBlank: true,
                singleSelection: false,
                leafSelect: false,
                qtip: 'text',
                displayField: 'text',
                valueField: 'idcuenta',
                selectField: 'codigo',
                listHeight: 300,
                anchor: '98%',
            });


            //</Campos del formulario >

            //<Ventana>
            me.ventanaFiltro = new Ext.Window({
                autoValidate: true,
                modal: true,
                title: 'Filtrar cuentas',
                frame: true,
                maskDisabled: true,
                border: false,
                constrain: true,
                // height: Ext.lib.Dom.getViewHeight() * 0.5,
                width: Ext.lib.Dom.getViewWidth() * 0.4,
                closeAction: 'close',
                closable: false,
                plain: false,
                items: [{
                    layout: 'column',
                    border: false,
                    frame: true,
                    items: [{
                        columnWidth: .30,
                        // style: 'margin:10',
                        layout: 'form',
                        labelAlign: 'top',
                        items: me.cbxNivel
                    }, {
                        columnWidth: .70,
                        style: 'margin: 0 5',
                        layout: 'form',
                        labelAlign: 'top',
                        items: me.ctaNivel
                    }]
                }
                ],
                resizable: false,
                buttons: [this.btnCancelarFil, this.btnAceptarFil],
                listeners: {
                    'render': function () {
                        me.ctaNivel.disable();
                    }
                },
            });

            Ext.getCmp('gpNivel').getSelectionModel().on('rowselect', function () {
                // me.ctaNivel.disable();
                me.ventanaFiltro.disable();
                me.btnAceptarFil.enable();

                // Ext.getCmp('gpCtaNivel').getStore().load({
                //     params: {
                //         'idparteformato': Ext.getCmp('gpNivel').getSelectionModel().getSelections()[0].data.idparteformato
                //     }, callback: function () {
                //         me.ventanaFiltro.enable();
                //         me.ctaNivel.enable();
                //         if (Ext.getCmp('gpCtaNivel').getSelectionModel().hasSelection()){
                //             Ext.getCmp('gpCtaNivel').getSelectionModel().clearSelections();
                //         }
                //     }
                // });

                var baseparam = {
                    nivel: Ext.getCmp('gpNivel').getSelectionModel().getSelections()[0].data.nivel,
                    activo: me.trpCuenta.cbxTbarVigencia.getValue()
                };
                var func = function () {
                    me.ventanaFiltro.enable();
                    me.ctaNivel.enable();
                };
                me.ctaNivel.reset();
                me.ctaNivel.reload('', false, baseparam, func);
            });
        }
        me.ventanaFiltro.show();
        Ext.getCmp('cbxNivel').isValid();
        //</Ventana>

        //</Nuevo filtro>
    },
    mostrarReporte: function (requestDataSources) {
        var printView = new SCFPrintView(requestDataSources, "/contabilidad/comun/SCFPrintView/", {
            paperSize: "FOLIO",
            orientation: "Horizontal",
            reportType: "HTML"
        });
        printView.show();
    },
    initEvents: function () {
        var me = this;
        me.gpApertura.getSelectionModel().on({
            'rowdeselect': function (smodel, rowIndex) {
                me.gpApertura.getView().removeRowClass(rowIndex, "negrita");
                switch (smodel.getCount()) {
                    case 0:
                        me.btnAdicionarAp.setDisabled(false);
                        me.btnEliminarAp.setDisabled(true);
                        break;
                    default:
                        me.btnAdicionarAp.setDisabled(false);
                        me.btnEliminarAp.setDisabled(false);
                        break;
                }
            },
            'rowselect': function (smodel, rowIndex) {
                me.gpApertura.getView().addRowClass(rowIndex, "negrita");
                switch (smodel.getCount()) {
                    case 0:
                        me.btnAdicionarAp.setDisabled(false);
                        me.btnEliminarAp.setDisabled(true);
                        break;
                    default:
                        me.btnAdicionarAp.setDisabled(false);
                        me.btnEliminarAp.setDisabled(false);
                        break;
                }
            }
        });
        me.gpApertura.gridValid = function () {
            return me.gpApertura.getStore().find('valid', 'false') === -1;
        };
        me.gpApertura.on({
            'gridvalid': function (state, grideditor) {
            }
        });
        me.rowEditorAp.on({
            scope: me.gpApertura,
            afteredit: function (editor, grid, changes, record, rowIndex) {
                flag = (me.gpApertura.getStore().getCount() > 0 && Ext.getCmp('cbMonedaApertura').getValue()) ? false : true;
                Ext.getCmp('btnAceptarAps').setDisabled(flag);

                me.btnAdicionarAp.setDisabled(false);
                record.data.valid = true;
                var gridvalid = me.gpApertura.gridValid();
                me.gpApertura.fireEvent("gridvalid", gridvalid, this, record);
            }
        });
        me.trpCuenta.on({
            'rowcontextmenu': function (gridPanel, rowIndex, e) {
                me.trpCuenta.contextMenu.showAt(e.getXY());
                e.stopEvent();
            },
        });
        me.trpCuenta.rowEditorCtas.on({
            scope: me.trpCuenta,
            beforeedit: function (editor, grid, record, rowIndex) {
                me.btnPlanCta.disable();
                me.btnAdicionar.disable();
                me.btnAperturar.disable();
                me.btnModificar.disable();
                me.btnEliminar.disable();
                me.btnHeredar.disable();
                me.btnVistaReporte.disable();
            },
            afteredit: function (roweditor, grid, changes, record, rowIndex) {
                record.data.valid = true;
                var gridvalid = me.trpCuenta.gridValid();
                me.trpCuenta.fireEvent("gridvalid", gridvalid, this, record);
                me.btnPlanCta.enable();
                me.btnAdicionar.enable();
                me.btnAperturar.enable();
                me.btnModificar.enable();
                me.btnEliminar.enable();
                me.btnHeredar.enable();
                me.btnVistaReporte.enable();
            },
            canceledit: function (roweditor, record, rowIndex) {
                me.btnAdicionar.enable();
                me.btnPlanCta.enable();
                me.btnAperturar.enable();
                me.btnModificar.enable();
                me.btnEliminar.enable();
                me.btnHeredar.enable();
                me.btnVistaReporte.enable();
            }
        });
        me.trpCuenta.getStore().on({
            'expandnode': function (record, ev) {
                var rowIndex = this.find('idcuenta', this.baseParams.idcuenta);
                me.trpCuenta.getSelectionModel().selectRow(rowIndex);
                me.trpCuenta.getView().focusRow(rowIndex + 10);
            },
            'load': function (store) {
                if (me.trpCuenta.initAppCta == false) {
                    if (store.reader.jsonData.idcriterioe) {
                        me.idcriterioe = store.reader.jsonData.idcriterioe;
                        me.formatos = store.reader.jsonData.formatos;
                    }
                }
                if (store.getCount() > 0) {
                    store.active_node = null;
                    store.fireEvent('activenodechange', null, me.activeNode, null);
                    me.trpCuenta.getSelectionModel().selectRow(me.activeRow);
                }
                me.inforeporte = store.reader.jsonData.inforeporte;
                me.lfEntidad.setText('Entidad: ' + me.inforeporte.entidad);
            }
        });
        me.trpCuenta.getSelectionModel().on({
            'rowdeselect': function (smodel, rowIndex) {
                me.trpCuenta.getView().removeRowClass(rowIndex, "negrita");
                mismoNivel = true;
                for (var i = 0; i < smodel.getSelections().length; i++) {
                    primerNivel = smodel.getSelections()[0].data.nivel;
                    if (smodel.getSelections()[i].data.nivel != primerNivel) {
                        mismoNivel = false;
                        break;
                    }
                }
                if (mismoNivel) {
                    switch (smodel.getCount()) {
                        case 0:
                            me.btnModificar.setDisabled(true);
                            me.btnEliminar.setDisabled(true);
                            me.btnAperturar.setDisabled(true);
                            break;
                        case 1:
                            var valModEliminar = (smodel.getSelected().data.operacion == true
                                || smodel.getSelected().data.heredada == true
                                || smodel.getSelected().data._is_leaf == false) ? true : false;
                            var valModApertura = (smodel.getSelected().data.vigente == false)
                            // me.btnModificar.setDisabled(valMod);
                            me.btnModificar.setDisabled(false);
                            me.btnEliminar.setDisabled(valModEliminar);
                            me.btnAperturar.setDisabled(valModApertura);
                            break;
                        default:
                            var val = false;
                            for (var i = 0; i < smodel.getSelections().length; i++) {
                                // if (smodel.getSelections()[i].data.operacion == true
                                //     || smodel.getSelections()[i].data.heredada == true
                                //     || smodel.getSelections()[i].data._is_leaf == false) {
                                //     val = true;
                                //     break;
                                // }
                                if (smodel.getSelections()[i].data.vigente == false) {
                                    val = true;
                                    break;
                                }
                            }
                            me.btnAperturar.setDisabled(val);
                            me.btnModificar.setDisabled(true);
                            me.btnEliminar.setDisabled(false);
                            break;
                    }
                }
            },
            'rowselect': function (smodel, rowIndex) {
                me.trpCuenta.getView().addRowClass(rowIndex, "negrita");
                mismoNivel = true;
                for (var i = 0; i < smodel.getSelections().length; i++) {
                    primerNivel = smodel.getSelections()[0].data.nivel;
                    if (smodel.getSelections()[i].data.nivel != primerNivel) {
                        mismoNivel = false;
                        break;
                    }
                }
                if (mismoNivel) {
                    switch (smodel.getCount()) {
                        case 0:
                            me.btnModificar.setDisabled(true);
                            me.btnEliminar.setDisabled(true);
                            me.btnAperturar.setDisabled(true);
                            break;
                        case 1:
                            var valMod = (smodel.getSelected().data.operacion == true
                                || smodel.getSelected().data.heredada == true
                                || smodel.getSelected().data._is_leaf == false) ? true : false;
                            var valModApertura = (smodel.getSelected().data.vigente == false)
                            // me.btnModificar.setDisabled(valMod);
                            me.btnModificar.setDisabled(false);
                            me.btnEliminar.setDisabled(false);
                            me.btnAperturar.setDisabled(valModApertura);

                            if (smodel.getSelected().data.ctaheredada)
                                me.btnModificar.setDisabled(true);

                            me.activeRow = rowIndex;
                            break;
                        default:
                            val = false;
                            for (var i = 0; i < smodel.getSelections().length; i++) {
                                // if (smodel.getSelections()[i].data.operacion == true
                                //     || smodel.getSelections()[i].data.heredada == true
                                //     || smodel.getSelections()[i].data._is_leaf == false) {
                                //     val = true;
                                //     break;
                                // }
                                if (smodel.getSelections()[i].data.vigente == false) {
                                    val = true;
                                    break;
                                }
                            }
                            me.btnAperturar.setDisabled(val);
                            me.btnModificar.setDisabled(true);
                            me.btnEliminar.setDisabled(false);
                            break;
                    }
                } else {
                    me.btnModificar.setDisabled(true);
                    me.btnEliminar.setDisabled(true);
                    me.btnAperturar.setDisabled(true);
                }
            }
        });
        me.trpCuenta.btnSalvar.on('click', function (button, e) {
            me.salvarCambios();
        }, this);
        me.trpCuenta.btnDescartar.on('click', function (button, e) {
            this.descartarCambios();
        }, this);
        me.trpCuenta.cbxTbarVigencia.on({
            scope: me.trpCuenta,
            'select': function (cb, rc, idx) {
                var cbValue = parseInt(cb.getValue());
                switch (cbValue) {
                    case 2:
                        me.trpCuenta.getStore().baseParams = {idcuenta: 0, node: 0, modo: 2};
                        break;
                    case 3:
                        me.trpCuenta.getStore().baseParams = {idcuenta: 0, node: 0, modo: 3};
                        break;
                    default:
                        me.trpCuenta.getStore().baseParams = {idcuenta: 0, node: 0, modo: 1};
                        break;
                }
                me.trpCuenta.getStore().reload();
            }
        });
        Ext.getCmp('gpNomApertura').getStore().on({
            'beforeexpandnode': function (stNomAp, recordNomAp) {
                stNomAp.baseParams.anode = recordNomAp.get('_id');
                stNomAp.baseParams.node = recordNomAp.get('_id');
            }
        });
        Ext.getCmp('gpNomApertura').getSelectionModel().on({
            'rowdeselect': function (smodel, rowIndex) {
                Ext.getCmp('gpNomApertura').getView().removeRowClass(rowIndex, "negrita");
                Ext.getCmp('cbxNomApertura').fSelect.valuesLoaded = new Array();
                for (var i = 0; i < smodel.getSelections().length; i++) {
                    Ext.getCmp('cbxNomApertura').fSelect.valuesLoaded.push(smodel.getSelections()[i].data);
                }
            },
            'rowselect': function (smodel, rowIndex) {
                Ext.getCmp('cbxNomApertura').fSelect.valuesLoaded = new Array();
                for (var i = 0; i < smodel.getSelections().length; i++) {
                    Ext.getCmp('cbxNomApertura').fSelect.valuesLoaded.push(smodel.getSelections()[i].data);
                }
                Ext.getCmp('gpNomApertura').getView().addRowClass(rowIndex, "negrita");
            }
        });
        Ext.getCmp('pnlAperturas').on({
            scope: this,
            expand: function (panel) {
                this.panelexpanded = true;
            },
            collapse: function (panel) {
                this.panelexpanded = false;
            },
            hide: function (panel) {
                this.panelexpanded = false;
            }
        })
    },
    validarCodigoLongitudFormato: function (me) {
        //Valida q la apertura por nomenclador sea igual a la longitud del formato
        var arrarValue = Ext.getCmp('cbxNomApertura').fSelect.display;
        Ext.each(arrarValue, function (item, index) {
            if (item.length != me.longFormatAperturar) {
                var lbLengthApertura = String.format(me.perfil.etiquetas.lbLengthApertura, '<b>' + me.cbNivelFormatoCta.getRawValue() + '</b>', me.longFormatAperturar);
                Ext.getCmp('cbxNomApertura').markInvalid();
                mostrarMensaje(1, lbLengthApertura);
                me.formaterror = true;
            } else {
                me.formaterror = false;
            }
        });
    },
    resetValuesXCombo: function (component) {
        component.reset();
        component.clearValue();
        component.fSelect.display = new Array();
        component.fSelect.index = new Array();
        component.fSelect.values = new Array();
        component.fSelect.valuesLoaded = new Array();
        component.disable();
    },
    setValuesXCombo: function (store, identificador, idActual) {
        cbxComponente = Ext.getCmp('cbx' + identificador);
        if (idActual && cbxComponente.fSelect.values.length == 0) {
            for (var i = 0; i < store.getCount(); i++) {
                if (store.getAt(i).id == idActual) {
                    cbxComponente.fSelect.display.push(store.getAt(i).data.codigo);
                    cbxComponente.fSelect.values.push(store.getAt(i).id);
                    cbxComponente.fSelect.index.push(i);
                }
            }
            cbxComponente.setValue(cbxComponente.fSelect.display.join(", "));
        }
    },
    descartarCambios: function () {
        var me = this;
        me.trpCuenta.getStore().rejectChanges();
        me.trpCuenta.getStore().commitChanges();
        me.trpCuenta.getStore().removeAll();
        me.trpCuenta.getStore().reload();
    },
    datosModificar: function () {
        var me = this;
        var data = new Array();
        var cuenta = Object();
        cuenta.clavecuenta = me.tfieldCodigo.getValue();
        cuenta.privado = Ext.getCmp('cbVisible').getValue();
        cuenta.concatcta = me.trpCuenta.selModel.getSelected().data.concatcta;
        cuenta.descripcion = me.tfieldDescripcion.getValue();
        cuenta.idgrupo = me.cbGrupoCont.getValue();
        cuenta.idmoneda = me.cbMoneda.getValue();
        cuenta.idtipocta = me.cbTipoCuenta.getValue();
        cuenta.idnaturaleza = me.cbNaturaleza.getValue();
        cuenta.text = me.trpCuenta.selModel.getSelected().data.text;
        cuenta.idcuentapadre = me.trpCuenta.selModel.getSelected().data.idcuentapadre;
        cuenta.fechafin = me.trpCuenta.selModel.getSelected().data.fechafin;
        cuenta.nivel = me.trpCuenta.selModel.getSelected().data.nivel;
        cuenta.idcuenta = me.trpCuenta.selModel.getSelected().data.idcuenta;
        data.push(cuenta);
        return data;
    },
    salvarCambios: function (winAction) {
        var me = this;
        switch (me.flagAction) {
            case 'Modificar':
            default: {
                var recordMods = me.trpCuenta.getStore().getModifiedRecords();
                Ext.Msg.wait(this.perfil.etiquetas.lbWaitMsgReg, this.perfil.etiquetas.lbEsperar);
                Ext.Ajax.request({
                    method: "POST",
                    url: "modificarcuenta",
                    params: {
                        data: Ext.encode(me.datosModificar()),
                        privado: me.trpCuenta.privado
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText),
                            nodo = me.trpCuenta.getSelectionModel().getSelections()[0];
                        Ext.Msg.hide();
                        switch (responseData.clave) {
                            case -1:
                                if (winAction) {
                                    me.winAdicionarCtas.destroy();
                                }
                                if (responseData.long) {
                                    mostrarMensaje(1, String.format(me.perfil.etiquetas.lbMsgAddFailedClaveLong, responseData.long));
                                } else if (responseData.failed) {
                                    mostrarMensaje(1, me.perfil.etiquetas.lbMsgAddFailedClave);
                                } else {
                                    mostrarMensaje(1, me.perfil.etiquetas.lbMsgSaveCtaOK);
                                    me.updateTreeGridCtas('reload', '');
                                    // me.updateTreeGridCtas('reload', me.arrayNodosAperturados);
                                }
                                break;
                            case -2:
                                mostrarMensaje(1, me.perfil.etiquetas.lbMsgAddFailedClave);
                                break;
                            case -3:
                                mostrarMensaje(1, me.perfil.etiquetas.lbMsgAddFailedDescrip);
                                break;
                            case -4:

                                break;
                            default:
                                if (responseData.codMsg && responseData.mensaje) {
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                }
                                break;
                        }
                    }
                });
            }
                break;
            case 'Adicionar': {
                if (me.formAdicionarCtas.getForm().isValid()) {
                    Ext.Msg.wait(this.perfil.etiquetas.lbWaitMsgReg, this.perfil.etiquetas.lbEsperar);
                    Ext.Ajax.request({
                        method: "POST",
                        url: "insertarcuenta",
                        params: {
                            clavecuenta: Ext.getCmp('tfieldCodigo').getValue(),
                            descripcion: Ext.getCmp('tfieldDescripcion').getValue(),
                            idtipocuenta: Ext.getCmp('cbTipoCuenta').getValue(),
                            idgrupo: Ext.getCmp('cbGrupoCont').getValue(),
                            idmoneda: Ext.getCmp('cbMoneda').getValue(),
                            idnaturaleza: Ext.getCmp('cbNaturaleza').getValue(),
                            vigente: Ext.getCmp('cbVigencia').getValue(),
                            privado: Ext.getCmp('cbVisible').getValue(),
                            nivel: 1,
                            concatcta: Ext.getCmp('tfieldCodigo').getValue(),
                            concatctax: Ext.getCmp('tfieldCodigo').getValue()
                        },
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            Ext.Msg.hide();
                            switch (responseData.clave) {
                                case -1:
                                    if (winAction) {
                                        me.winAdicionarCtas.destroy();
                                    } else {
                                        Ext.getCmp('btnAceptarAdicionar').disable();
                                        Ext.getCmp('btnAplicarAdicionar').disable();
                                        me.formAdicionarCtas.getForm().reset();
                                        me.tfieldCodigo.clearInvalid();
                                        me.tfieldCodigo.focus(false, 100);
                                    }
                                    mostrarMensaje(1, me.perfil.etiquetas.lbMsgSaveCtaOK);
                                    me.updateTreeGridCtas('', '');
                                    break;
                                case -2:
                                    mostrarMensaje(1, String.format(me.perfil.etiquetas.lbMsgAddFailedClaveLong, responseData.mensaje));
                                    break;
                                case -3:
                                    mostrarMensaje(1, me.perfil.etiquetas.lbMsgAddFailedDescrip);
                                    break;
                                case -4:
                                    mostrarMensaje(1, me.perfil.etiquetas.lbMsgAddFailedClave);
                                    break;
                                default:
                                    if (responseData.codMsg && responseData.mensaje) {
                                        mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                    }
                                    break;
                            }
                        }
                    });
                }
            }
                break;
            case 'Aperturar': {
                if (Ext.getCmp('cbNivelFormatoCta').isValid()) {
                    if (Ext.getCmp('gpApertura').getStore().getCount() > 0) {
                        var tipoAp = -1;
                        var apertCtas = me.dameAperturasStore(me.gpApertura.getStore());
                        var idconfapertura = me.stFormatoCta.getAt(me.stFormatoCta.find('idparteformato', me.cbNivelFormatoCta.getValue())).data.idconfapertura;
                        me.aperturarAnalisisCtas(tipoAp, apertCtas, me.cbMonedaApertura.getValue(), idconfapertura);
                    } else {
                        var tipoAp = 1;
                        var apertCtas = me.dameCtasSelectionModelAperturar(me.TgNomApertura.getSelectionModel());
                        // var apertCtas = me.dameCtasSelectionModel(me.TgNomApertura.getSelectionModel());
                        // var count = me.TgNomApertura.getStore().getCount();
                        // var arrData = new Array();
                        // for (var i = 0; i < count; i++) {
                        //     if (me.TgNomApertura.getSelectionModel().isSelected(i)) {
                        //         me.TgNomApertura.getStore().getAt(i).data.codigo = me.TgNomApertura.getStore().getAt(i).data.codigo.replace('.', '');
                        //         arrData.push(me.TgNomApertura.getStore().getAt(i).data);
                        //     }
                        // }

                        var idconfapertura = me.stFormatoCta.getAt(me.stFormatoCta.find('idparteformato', me.cbNivelFormatoCta.getValue())).data.idconfapertura;
                        me.aperturarAnalisisCtas(tipoAp, apertCtas, me.cbMonedaApertura.getValue(), idconfapertura);
                        // me.aperturarAnalisisCtas(tipoAp, arrData, me.cbMonedaApertura.getValue(), idconfapertura);
                    }
                } else {
                    mostrarMensaje(1, me.perfil.etiquetas.lbInvalidForm);
                }
            }
                break;
        }
    },
    /**
     * Aperturar los analisis de cuentas segun el tipo: manual o por nomenclador.
     * @param {Number} tipoAp Tipo de apertura 0 - Manual, 1 Por nomenclador.
     * @param {Array} apertCtas
     * @returns {Ext.Msg.alert}
     */
    aperturarAnalisisCtas: function (tipoAp, apertCtas, idmoneda, idconfapertura) {
        var me = this;
        Ext.Msg.wait(me.perfil.etiquetas.lbWaitMsgRegAp, me.perfil.etiquetas.lbEsperar);
        var dataCtas = me.dameCtasSelectionModelAperturar(me.trpCuenta.getSelectionModel());
        // me.arrayNodosAperturados =  me.trpCuenta.getSelectionModel().getSelections();
        Ext.Ajax.request({
            method: "POST",
            url: "adicionaraperturasctas",
            timeout: 7200000,
            params: {
                accion: 1,
                aperturasArray: Ext.encode(apertCtas),
                tipoAp: tipoAp,
                cuentaDatos: Ext.encode(dataCtas),
                idnaturaleza: me.trpCuenta.getSelectionModel().getSelected().data.idnaturaleza,
                nivelAp: me.nivelAperturar,
                privado: 0,
                // privado: 1,
                vigente: 1,
                filtrando: Ext.encode(me.filtrarValoresNomApertura(me.stNomencladoresCta.find('idconfapertura', idconfapertura))),
                idmoneda: idmoneda,
                idconfapertura: idconfapertura,
                concatCta: Ext.getCmp('sfBuscarCta').hasSearch ? me.trpCuenta.getSelectionModel().getSelected().data.codigocuenta : -1
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                Ext.Msg.hide();
                switch (responseData.clave) {
                    case -1: {
                        if (tipoAp == -1) {
                            me.gpApertura.getStore().removeAll();
                        } else {
                            me.TgNomApertura.getStore().removeAll();
                        }
                        if (apertCtas.length > 1) {
                            mostrarMensaje(1, me.perfil.etiquetas.lbMsgAddApsOK);
                        } else {
                            mostrarMensaje(1, me.perfil.etiquetas.lbMsgAddApOK);
                        }

                        if (Ext.getCmp('sfBuscarCta').hasSearch) {
                            me.trpCuenta.getStore().load({
                                params:  {
                                    node: 0,
                                    idcuenta: 0,
                                    modo: me.trpCuenta.cbxTbarVigencia.getValue(),
                                    filtro: Ext.getCmp('sfBuscarCta').getValue()
                                }
                            });
                        } else {
                            me.trpCuenta.getStore().reload();
                            me.trpCuenta.getView().refresh();
                        }
                        // me.updateTreeGridCtas('', me.arrayNodosAperturados);
                        // me.updateTreeGridCtas('', me.arrayNodosAperturados);
                        // me.updateTreeGridCtas(null,me.nodoAperturado);
                    }
                        break;
                    case -2:
                        mostrarMensaje(1, String.format(me.perfil.etiquetas.lbMsgAddFailedClaveLong, responseData.mensaje));
                        break;
                    case -3:
                        mostrarMensaje(1, me.perfil.etiquetas.lbMsgAddFailedDescrip);
                        break;
                    case -4:
                        cuentas = 'Ya existen las siguienes aperturas';
                        cuentas += '<br>';
                        for (var i = 0; i < responseData.existe.length; i++) {
                            cuentas += responseData.existe[i];
                            if (i < responseData.existe.length - 1)
                                cuentas += '<br>';
                        }
                        me.updateTreeGridCtas('', arrayNodosAperturados);
                        // me.updateTreeGridCtas(null,me.nodoAperturado);

                        mostrarMensaje(1, cuentas);
                        break;
                    default:
                        if (responseData.codMsg && responseData.mensaje) {
                            mostrarMensaje(responseData.codMsg, responseData.mensaje);
                        }
                        break;
                }
            }
        });
    },
    checkApertura: function () {
        var me = this;
        if (me.trpCuenta.getSelectionModel().getSelected()) {
            me.loadMask(me.perfil.etiquetas.lbCargando);
            var permitirConOperaciones = 0;
            for (var i = 0; i < validate.accionesPermitidas.length; i++) {
                validate.accionesPermitidas[i].abreviatura
                if (validate.accionesPermitidas[i].abreviatura == 'pe') {
                    permitirConOperaciones = 1;
                }
            }
            Ext.Ajax.request({
                url: 'pudetenerapertura',
                method: 'POST',
                params: {
                    idcuenta: me.trpCuenta.getSelectionModel().getSelected().data.idcuenta,
                    nivelpadre: me.trpCuenta.getSelectionModel().getSelected().data.nivel,
                    permitirconoperaciones: permitirConOperaciones
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    me.lMask.hide();
                    var clave = parseInt(responseData.clave);
                    switch (clave) {
                        case -1:
                            me.stFormatoCta.load({
                                params: {
                                    idcuenta: me.trpCuenta.getSelectionModel().getSelected().data.idcuenta,
                                    nivel: me.trpCuenta.getSelectionModel().getSelected().data.nivel
                                },
                                callback: function (options, success, response) {
                                    var responseDataFormato = Ext.decode(response.responseText);
                                    Ext.getCmp('btnAceptarAps').setDisabled(true);
                                    Ext.getCmp('pnlAperturas').expand(true);
                                    Ext.getCmp('pnlAperturas').show();
                                    Ext.getCmp('fpAperturas').expand(true);
                                    me.longMaxApertura = responseData.longNivel;
                                    me.trpCuenta.getSelectionModel().lock();
                                    me.pnlNomCuenta.getTopToolbar().disable();
                                    me.trpCuenta.getBottomToolbar().disable();
                                    me.kmCta.disable();
                                    me.kmAperturas.enable();
                                    if (me.trpCuenta.getSelectionModel().getSelected().data.idmoneda) {
                                        me.cbMonedaApertura.setValue(me.stMonedaApertura.getAt(me.stMonedaApertura.find('idmoneda', me.trpCuenta.getSelectionModel().getSelected().data.idmoneda)).data.idmoneda);
                                        me.cbMonedaApertura.setRawValue(me.stMonedaApertura.getAt(me.stMonedaApertura.find('idmoneda', me.trpCuenta.getSelectionModel().getSelected().data.idmoneda)).data.codigoiso);
                                    }
                                }
                            });
                            break;
                        case -2:
                            mostrarMensaje(1, String.format(me.perfil.etiquetas.lbMsgApFailedFormat, responseData.cant));
                            break;
                        case -3:
                            mostrarMensaje(1, me.perfil.etiquetas.lbMsgFailedOperReg);
                            break;
                        case -4:
                            mostrarMensaje(1, String.format(me.perfil.etiquetas.lbMsgNoAp, responseData.estructurae, responseData.criterioe), Ext.emptyFn);
                            break;
                        default:
                            if (responseData.codMsg && responseData.mensaje) {
                                mostrarMensaje(responseData.codMsg, responseData.mensaje, Ext.emptyFn);
                            }
                            break;
                    }
                }
            });
        } else {
            mostrarMensaje(1, me.perfil.etiquetas.lbMsgSelectCta);
        }
    },
    getDataChangesStore: function () {
        var me = this;
        var array = new Array();
        var count = me.trpCuenta.getStore().getModifiedRecords().length;
        if (count > 0) {
            for (var i = 0; i < count; i++) {
                array[i] = (me.trpCuenta.getStore().getModifiedRecords()[i].data);
            }
        }
        return array;
    },
    dameAperturasStore: function (store) {
        var me = this;
        var array = new Array();
        var count = store.getCount();
        if (count > 0) {
            for (var i = 0; i < count; i++) {
                store.getAt(i).data.nivel = me.nivelAperturar;
                array.push(store.getAt(i).data);
            }
        }
        return array;
    },
    dameCtasSelectionModel: function (smodel) {
        var array = new Array();
        var count = smodel.getCount();
        if (count > 0) {
            for (var i = 0; i < count; i++) {
                array.push(smodel.getSelections()[i].data);
            }
        }
        return array;
    },
    dameCtasSelectionModelHeredar: function (smodel) {
        var me = this;
        var array = new Array();
        var arrayDataSelected = new Array();
        var count = smodel.getCount();
        var nivelElemento;
        if (count > 0) {
            arrayNivelArbol = new Array();
            nivelApert = me.nivelAperturar;

            for (var i = 0; i < count; i++) {
                if(smodel.getSelected()) {
                    arrayDataSelected.push(smodel.getSelections()[i].data)
                }
            }

            arrayDataSelected.sort(function (a, b) {
                ax = parseInt(a._id);
                bx = parseInt(b._id);

                if (ax > bx) {
                    return 1;
                }
                if (ax < bx) {
                    return -1;
                }
                /*if (a._id > b._id) {
                    return 1;
                }
                if (a._id < b._id) {
                    return -1;
                }*/
                return 0;
            });
            // arrayDataSelected[0].proxNivel = nivelApert;

            // arrayNivelArbol.push({
            //     idpadre: arrayDataSelected[0].id,
            //     proxNivel:  nivelApert
            // });
            //
            // for (var i = 0; i < arrayDataSelected.length; i++) {
            //     arrayDataSelected[i].proxNivel =  me.nivelAperturar;
            // }
            //
            for (var i = 0; i < arrayDataSelected.length; i++) {
                // if(dataAperturaGeneral)//Revisar esto, de Furet
                // if(dataAperturaGeneral['2'] == 'dat_estructurae') {
                //     arrayDataSelected[i].proxNivel =  me.nivelAperturar;
                //     //Pongo el parent en null para q no exista arbol
                //     arrayDataSelected[i]._parent =  null;
                // } else {
                    existeEnArray = false;
                    for (var j = 0; j < arrayNivelArbol.length; j++) {
                        if(arrayDataSelected[i]._parent == arrayNivelArbol[j]['idpadre']) {
                            existeEnArray = true;
                            nivelElemento = arrayNivelArbol[j]['proxNivel'] + 1;
                            break;
                        }
                    }

                    arrayNivelArbol.push({
                        idpadre: arrayDataSelected[i].id,
                        proxNivel:  (!existeEnArray) ? nivelApert : nivelElemento
                    });

                    //buscar en arrayNivelArbol el elemento en [i] y ponerle el nivel en que va a aperturar
                    for (var k = 0; k < arrayNivelArbol.length; k++) {
                        if(arrayDataSelected[i]._parent == arrayNivelArbol[k]['idpadre']) {
                            arrayDataSelected[i].proxNivel = arrayNivelArbol[k]['proxNivel'] + 1;
                            break;
                        } else if(arrayDataSelected[i]._parent == null || arrayDataSelected[i]._parent == '') {
                            arrayDataSelected[i].proxNivel =  me.nivelAperturar;
                            break;
                        }
                    }
                // }
            }
        }

        return arrayDataSelected;
    },
    dameCtasSelectionModelAperturar: function (smodel) {
        var me = this;
        var array = new Array();
        var arrayDataSelected = new Array();
        var count = smodel.getCount();
        var nivelElemento;
        if (count > 0) {
            arrayNivelArbol = new Array();
            nivelApert = me.nivelAperturar;

            for (var i = 0; i < count; i++) {
                if (smodel.getSelected()) {
                    arrayDataSelected.push(smodel.getSelections()[i].data)
                }
            }
            arrayDataSelected.sort(function (a, b) {
                ax = parseInt(a._id);
                bx = parseInt(b._id);

                if (ax > bx) {
                    return 1;
                }
                if (ax < bx) {
                    return -1;
                }
                /*if (a._id > b._id) {
                    return 1;
                }
                if (a._id < b._id) {
                    return -1;
                }*/
                return 0;
            });

            arrayDataSelected[0].proxNivel = nivelApert;

            arrayNivelArbol.push({
                idpadre: arrayDataSelected[0].id,
                proxNivel: nivelApert
            });

            for (var i = 0; i < arrayDataSelected.length; i++) {
                arrayDataSelected[i].proxNivel = me.nivelAperturar;
            }

            for (var i = 0; i < arrayDataSelected.length; i++) {
                if (dataAperturaGeneral)//Revisar esto, de Furet
                    if (dataAperturaGeneral['2'] == 'dat_estructurae') {
                        arrayDataSelected[i].proxNivel = me.nivelAperturar;
                        //Pongo el parent en null para q no exista arbol
                        arrayDataSelected[i]._parent = null;
                    } else {
                        existeEnArray = false;
                        for (var j = 0; j < arrayNivelArbol.length; j++) {
                            if (arrayDataSelected[i]._parent == arrayNivelArbol[j]['idpadre']) {
                                existeEnArray = true;
                                nivelElemento = arrayNivelArbol[j]['proxNivel'] + 1;
                                break;
                            }
                        }

                        arrayNivelArbol.push({
                            idpadre: arrayDataSelected[i].id,
                            proxNivel: (!existeEnArray) ? nivelApert : nivelElemento
                        });

                        //buscar en arrayNivelArbol el elemento en [i] y ponerle el nivel en que va a aperturar
                        for (var k = 0; k < arrayNivelArbol.length; k++) {
                            if (arrayDataSelected[i]._parent == arrayNivelArbol[k]['idpadre']) {
                                arrayDataSelected[i].proxNivel = arrayNivelArbol[k]['proxNivel'] + 1;
                                break;
                            } else if (arrayDataSelected[i]._parent == null || arrayDataSelected[i]._parent == '') {
                                arrayDataSelected[i].proxNivel = me.nivelAperturar;
                                break;
                            }
                        }
                    }
            }
        }

        return arrayDataSelected;
    },

    // dameCtasSelectionModelAperturar: function (smodel) {
    //     var me = this;
    //     var array = new Array();
    //     var arrayDataSelected = new Array();
    //     var count = smodel.getCount();
    //     var nivelElemento;
    //     if (count > 0) {
    //         arrayNivelArbol = new Array();
    //         nivelApert = me.nivelAperturar;
    //
    //         for (var i = 0; i < count; i++) {
    //             if(smodel.getSelected()) {
    //                 arrayDataSelected.push(smodel.getSelections()[i].data)
    //             }
    //         }
    //         arrayDataSelected.sort(function (a, b) {
    //             if (a.id > b.id) {
    //                 return 1;
    //             }
    //             if (a.id < b.id) {
    //                 return -1;
    //             }
    //             return 0;
    //         });
    //
    //         arrayDataSelected[0].nivel = nivelApert;
    //
    //         arrayNivelArbol.push({
    //             idpadre: arrayDataSelected[0].id,
    //             nivel:  nivelApert
    //         });
    //
    //         for (var i = 0; i < arrayDataSelected.length; i++) {
    //             arrayDataSelected[i].nivel =  me.nivelAperturar;
    //         }
    //
    //         for (var i = 0; i < arrayDataSelected.length; i++) {
    //             if(dataAperturaGeneral['2'] == 'dat_estructurae') {
    //                 arrayDataSelected[i].nivel =  me.nivelAperturar;
    //                 //Pongo el parent en null para q no exista arbol
    //                 arrayDataSelected[i]._parent =  null;
    //             } else {
    //                 existeEnArray = false;
    //                 for (var j = 0; j < arrayNivelArbol.length; j++) {
    //                     if(arrayDataSelected[i]._parent == arrayNivelArbol[j]['idpadre']) {
    //                         existeEnArray = true;
    //                         nivelElemento = arrayNivelArbol[j]['nivel'] + 1;
    //                         break;
    //                     }
    //                 }
    //
    //                 arrayNivelArbol.push({
    //                     idpadre: arrayDataSelected[i].id,
    //                     nivel:  (!existeEnArray) ? nivelApert : nivelElemento
    //                 });
    //
    //                 //buscar en arrayNivelArbol el elemento en [i] y ponerle el nivel en que va a aperturar
    //                 for (var k = 0; k < arrayNivelArbol.length; k++) {
    //                     if(arrayDataSelected[i]._parent == arrayNivelArbol[k]['idpadre']) {
    //                         arrayDataSelected[i].nivel = arrayNivelArbol[k]['nivel'] + 1;
    //                         break;
    //                     } else if(arrayDataSelected[i]._parent == null || arrayDataSelected[i]._parent == '') {
    //                         arrayDataSelected[i].nivel =  me.nivelAperturar;
    //                         break;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //
    //     return arrayDataSelected;
    // },

    // dameCtasSelectionModel: function (smodel) {
    //     var me = this;
    //     var array = new Array();
    //     var arrayDataSelected = new Array();
    //     var count = smodel.getCount();
    //     var nivelElemento;
    //     if (count > 0) {
    //         arrayNivelArbol = new Array();
    //         nivelApert = me.nivelAperturar;
    //
    //         for (var i = 0; i < count; i++) {
    //             if(smodel.getSelected()) {
    //                 arrayDataSelected.push(smodel.getSelections()[i].data)
    //             }
    //         }
    //         arrayDataSelected.sort(function (a, b) {
    //             if (a.id > b.id) {
    //                 return 1;
    //             }
    //             if (a.id < b.id) {
    //                 return -1;
    //             }
    //             return 0;
    //         });
    //
    //         arrayDataSelected[0].nivel = nivelApert;
    //
    //         arrayNivelArbol.push({
    //             idpadre: arrayDataSelected[0].id,
    //             nivel:  nivelApert
    //         });
    //
    //         for (var i = 0; i < arrayDataSelected.length; i++) {
    //             if(dataAperturaGeneral['2'] == 'dat_estructurae') {
    //                 arrayDataSelected[i].nivel =  me.nivelAperturar;
    //                 arrayDataSelected[i]._parent =  null;
    //             } else {
    //                 existeEnArray = false;
    //                 for (var j = 0; j < arrayNivelArbol.length; j++) {
    //                     if(arrayDataSelected[i]._parent == arrayNivelArbol[j]['idpadre']) {
    //                         // if(smodel.getSelections()[i].data.id == arrayNivelArbol[j]['idpadre']) {
    //                         existeEnArray = true;
    //                         nivelElemento = arrayNivelArbol[j]['nivel'] + 1;
    //                         break;
    //                     }
    //                 }
    //
    //                 arrayNivelArbol.push({
    //                     idpadre: arrayDataSelected[i].id,
    //                     nivel:  (!existeEnArray) ? nivelApert : nivelElemento
    //                 });
    //
    //                 //buscar en arrayNivelArbol el elemento en [i] y ponerle el nivel en que va a aperturar
    //                 for (var k = 0; k < arrayNivelArbol.length; k++) {
    //                     if(arrayDataSelected[i]._parent == arrayNivelArbol[k]['idpadre']) {
    //                         arrayDataSelected[i].nivel = arrayNivelArbol[k]['nivel'] + 1;
    //                         break;
    //                     } else if(arrayDataSelected[i]._parent == null || arrayDataSelected[i]._parent == '') {
    //                         arrayDataSelected[i].nivel =  me.nivelAperturar;
    //                         break;
    //                         // } else {
    //                         //     arrayDataSelected[i].nivel =  me.nivelAperturar;
    //                         //     break;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //
    //     return arrayDataSelected;
    // },

    // dameAperturasStore: function (store) {
    //     var array = new Array();
    //     var count = store.getCount();
    //     if (count > 0) {
    //         arrayNivelArbol = new Array();
    //         nivelApert = me.nivelAperturar;
    //         for (var i = 0; i < count; i++) {
    //             if(!arrayNivelArbol[0]) {
    //                 arrayNivelArbol.push({
    //                     idpadre: store.getAt(i).data._parent,
    //                     nivel: me.nivelAperturar
    //                 });
    //             } else {
    //                 // for (var j = 0; j < arrayNivelArbol.length; j++) {
    //                 //     arrayNivelArbol.push({
    //                 //         idpadre: store.getAt(i).data._parent,
    //                 //         nivel:  nivelApert
    //                 //     });
    //                 // }
    //             }
    //
    //
    //             arrayNivelArbol[store.getAt(i).data._parent] = me.nivelAperturar;
    //
    //             store.getAt(i).data.nivelApertura = nivelApert;
    //
    //             array.push(store.getAt(i).data);
    //         }
    //     }
    //     return array;
    // },
    dameNodeCtaInfo: function () {
        var me = this;
        var result = new Array();
        var record = Ext.data.Record.create([
            {name: 'idcuenta'},
            {name: 'clave'},
            {name: 'claveAnterior'},
            {name: 'idnaturaleza'},
            {name: 'descripnaturaleza'},
            {name: 'grupo'},
            {name: 'idgrupo'},
            {name: 'descripcion1'},
            {name: 'fechainicio'},
            {name: 'fechafin'},
            {name: 'concatcta'},
            {name: 'concatctax'},
            {name: 'nivel'},
            {name: 'idestructura'},
            {version: 'version'}
        ]);
        if (me.trpCuenta.getSelectionModel().getCount() > 1) {
            result = me.dameCtasSelectionModelAperturar(me.trpCuenta.getSelectionModel());
            // result = me.dameCtasSelectionModel(me.trpCuenta.getSelectionModel());
        } else {
            var nodoSeleccionado = me.trpCuenta.getSelectionModel().getSelected();
            result = new record({
                idcuenta: nodoSeleccionado.data.idcuenta,
                clave: nodoSeleccionado.data.clavecuenta,
                claveAnterior: nodoSeleccionado.data.clavecuenta,
                idnaturaleza: nodoSeleccionado.data.idnaturaleza,
                descripnaturaleza: nodoSeleccionado.data.descripnaturaleza,
                grupo: nodoSeleccionado.data.grupo,
                idgrupo: nodoSeleccionado.data.idgrupo,
                descripcion1: nodoSeleccionado.data.descripcion,
                fechainicio: nodoSeleccionado.data.fechainicio,
                concatcta: nodoSeleccionado.data.concatcta,
                concatctax: nodoSeleccionado.data.concatctax,
                nivel: nodoSeleccionado.data.nivel,
                idestructura: nodoSeleccionado.data.idestructurae,
                version: nodoSeleccionado.data.version
            });
        }
        return result;
    },
    filtrarValoresNomApertura: function (index) {
        var me = this;
        var recordArray = new Array();
        recordArray.push(me.cbNomTipoAperturas.getValue());
        if (index >= 0) {
            recordArray.push(me.stNomencladoresCta.getAt(index).data.denominacion);
            recordArray.push(me.stNomencladoresCta.getAt(index).data.concepto);
            recordArray.push(me.stNomencladoresCta.getAt(index).data.identificador);
            recordArray.push(me.stNomencladoresCta.getAt(index).data.codigo);
            recordArray.push(me.stNomencladoresCta.getAt(index).data.descripcion);
            recordArray.push(me.stNomencladoresCta.getAt(index).data.identificadorpadre);
            recordArray.push(me.stNomencladoresCta.getAt(index).data.nomesquema);
        }
        return recordArray;
    },
    verificoCodigo: function (val) {
        var me = this;
        if (val) {
            if (val.length > me.longMaxApertura)
                return '<span style="color:red;">' + val + '</span>';
            return val;
        }
    },
    verificarCampos: function () {
        var me = this;
        if (me.formAdicionarCtas.getForm().isValid()) {
            if (Ext.getCmp('btnAplicarAdicionar'))
                Ext.getCmp('btnAplicarAdicionar').setDisabled(false);
            Ext.getCmp('btnAceptarAdicionar').setDisabled(false);
        } else {
            if (Ext.getCmp('btnAplicarAdicionar'))
                Ext.getCmp('btnAplicarAdicionar').setDisabled(true);
            Ext.getCmp('btnAceptarAdicionar').setDisabled(true);

        }
    },
    heredarCtasCentroRector: function () {
        var me = this;
        me.tgCtasHerencia = new Ext.Confin.Cuenta.TgCtasHerencia({perfil: me.perfil});
        me.winHeredarCtas = new Ext.Window({
            title: me.perfil.etiquetas.lbTtlHeredarCtas,
            id: 'winHeredarCtas',
            closeAction: 'hide',
            width: 900,
            height: 500,
            maximizable: true,
            constrain: true,
            defaultButton: 0,
            modal: true,
            layout: 'fit',
            items: me.tgCtasHerencia = new Ext.Confin.Cuenta.TgCtasHerencia({perfil: me.perfil}),
            listeners: {
                'hide': function () {
                    if (!Ext.getCmp('btnAdicionar').disabled)
                        Ext.getCmp('btnAdicionar').focus();
                }
            },
            buttons: [{
                id: 'btnCancelarHerencia',
                iconCls: 'cancelar',
                text: me.perfil.etiquetas.lbCancelar,
                tooltip: me.perfil.etiquetas.lbTtCancelar,
                scope: me,
                handler: function () {
                    me.tgCtasHerencia.getSelectionModel().clearSelections();
                    me.winHeredarCtas.close();
                }
            }, {
                id: 'btnAceptarHerencia',
                disabled: true,
                iconCls: 'aceptar',
                text: me.perfil.etiquetas.lbAceptar,
                tooltip: me.perfil.etiquetas.lbTtAceptar,
                handler: function () {
                    me.heredarCuentas();
                    me.winHeredarCtas.close();
                }
            }]
        });
        me.winHeredarCtas.add(me.tgCtasHerencia);
        me.winHeredarCtas.show();
        me.winHeredarCtas.doLayout();
    },
    adicionarCtasCentroRector: function (dime) {
        var me = this;
        var editOnly = true;
        var editOtherOnly = true;
        var longFormatCta = parseInt(me.trpCuenta.formatos[0].longitud);
        var ctaSel = me.trpCuenta.getSelectionModel().getSelected();
        me.activeNode = me.trpCuenta.getSelectionModel().getSelected();
        me.activeRow = me.trpCuenta.getSelectionModel().getSelected();
        if (dime !== 'add') {
            var nivelCta = parseInt(me.trpCuenta.getSelectionModel().getSelected().data.nivel);
            var nivelFormatCta = nivelCta - 1;
            longFormatCta = parseInt(me.trpCuenta.formatos[nivelFormatCta].longitud);
            if (ctaSel) {
                if (ctaSel.data.operacion == true) {
                    editOnly = true;
                    editOtherOnly = true;
                } else {
                    if (ctaSel.data._is_leaf == true) {
                        editOnly = (ctaSel.data.nivel > 1) ? true : false;
                        editOtherOnly = false;
                    } else {
                        editOnly = true;
                        editOtherOnly = (ctaSel.data.nivel > 1) ? true : false;
                    }
                }

            }
        } else {
            editOnly = false;
            editOtherOnly = false;
        }
        me.tfieldCodigo = new Ext.form.TextField({
            tabIndex: 11,
            id: 'tfieldCodigo',
            name: 'clavecuenta',
            fieldLabel: 'C&oacute;digo',
            maxLength: longFormatCta,
            anchor: '100%',
            allowBlank: false,
            enableKeyEvents: true,
            disabled: editOnly,
            selectOnFocus: true,
            maskRe: /^[0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]*$/,
            regex: /^[0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]*$/,
            regexText: me.perfil.etiquetas.lbAlphaNum,
            invalidText: me.perfil.etiquetas.lbAlphaNum,
            listeners: {
                'keyup': function () {
                    me.verificarCampos();
                }
            }
        });

        me.tfieldDescripcion = new Ext.form.TextField({
            tabIndex: 12,
            id: 'tfieldDescripcion',
            name: 'descripcion',
            fieldLabel: 'Descripci&oacute;n',
            maxLength: 255,
            anchor: '100%',
            allowBlank: false,
            enableKeyEvents: true,
            disabled: editOtherOnly,
            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&\%]+?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&\%]*)+$/,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&\%]+(\s{1})?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&\%]*)+$/,
            regexText: me.perfil.etiquetas.lbRegexText,
            listeners: {
                'keyup': function () {
                    me.verificarCampos();
                },
                'invalid': function (cmp, msg) {
                    if (cmp.getValue().length > 0) {
                        var vtext = cmp.getValue().trim();
                        cmp.setValue(vtext);
                    }
                },
                'blur': function (cmp) {
                    if (cmp.getValue().length > 0) {
                        var vtext = cmp.getValue().trim();
                        cmp.setValue(vtext);
                    }
                }
            }
        });

        me.stGrupoCont = new Ext.data.Store({
            autoLoad: false,
            url: 'obtenergruposcontables',
            reader: new Ext.data.JsonReader({
                root: 'data',
                id: 'idgrupo'
            }, [{
                name: '_parent',
                mapping: 'idgrupopadre'
            }, {
                name: '_is_leaf',
                mapping: 'leaf'
            }, {
                name: 'text'
            }, {
                name: 'rtext'
            }, {
                name: 'grupo',
                mapping: 'descripcion'
            }, {
                name: 'idnaturaleza'
            }, {
                name: 'naturaleza'
            }, {
                name: 'codigo'
            }, {
                name: 'idparteformato'
            }, {
                name: 'idgrupo'
            }, {
                name: 'idgrupopadre'
            }, {
                name: 'ordenizq'
            }, {
                name: 'ordender'
            }])
        });

        me.cbGrupoCont = new Ext.contabilidad.util.linkedCombo({
            tabIndex: 13,
            id: 'cbGrupoCont',
            disabled: editOnly,
            store: me.stGrupoCont,
            fieldLabel: 'Grupo contable',
            displayField: 'text',
            valueField: 'idgrupo',
            listHeight: 300,
            fnCreateNew: Ext.emptyFn,
            listeners: {
                'select': function (comboGrupo, recordGrupo, indexGrupo) {
                    me.cbNaturaleza.reset();
                    me.cbNaturaleza.setValue(recordGrupo.data.idnaturaleza);
                    me.cbNaturaleza.setRawValue(recordGrupo.data.naturaleza);
                    me.verificarCampos();
                    if (me.formAdicionarCtas.getForm().isValid())
                        Ext.getCmp('btnAceptarAdicionar').focus();
                }
            }
        });

        me.cbNaturaleza = new Ext.form.ComboBox({
            tabIndex: 14,
            id: 'cbNaturaleza',
            name: 'descripnaturaleza',
            fieldLabel: 'Naturaleza',
            emptyText: 'Seleccione...',
            tpl: '<tpl for="."><div ext:qtip="{descripnaturaleza}" class="x-combo-list-item">{descripnaturaleza}</div></tpl>',
            anchor: '100%',
            displayField: 'descripnaturaleza',
            valueField: 'idnaturaleza',
            hiddenName: 'idnaturaleza',
            disabled: editOtherOnly,
            typeAhead: true,
            editable: true,
            forceSelection: true,
            resizable: true,
            mode: 'local',
            triggerAction: 'all',
            allowBlank: false,
            store: new Ext.data.SimpleStore({
               fields: [
                   {name: 'descripnaturaleza'},
                   {name: 'idnaturaleza'}
               ],
                data: [
                    ['ACREEDORA', 8030],
                    ['DEUDORA', 8031],
                    ['MIXTA', 8032]
                ]
            }),
            // store: new Ext.data.Store({
            //     autoLoad: true,
            //     url: '/contabilidad/comun/xml/naturalezas.xml',
            //     reader: new Ext.data.XmlReader({
            //         record: 'row',
            //         id: 'idnaturaleza',
            //         totalRecords: '@cant'
            //     }, Ext.data.Record.create([
            //         {name: 'descripnaturaleza', mapping: '@naturaleza'},
            //         {name: 'idnaturaleza', mapping: '@idnaturaleza'}
            //     ])),
            //     listeners: {
            //         'load': function (st, record, opts) {
            //         }
            //     }
            // }),
            listeners: {
                'select': function () {
                    me.verificarCampos();
                }
            }
        });

        this.stMoneda = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                    id: 'idmoneda',
                }, [{name: 'codigoiso'},
                    {name: 'idmoneda'},
                    {name: 'tipomoneda'}
                ]
            )
        });

        me.cbMoneda = new Ext.form.ComboBox({
            tabIndex: 14,
            id: 'cbMoneda',
            name: 'codigoiso',
            fieldLabel: 'Moneda',
            emptyText: 'Seleccione...',
            tpl: '<tpl for="."><div ext:qtip="{codigoiso}" class="x-combo-list-item">{codigoiso}</div></tpl>',
            anchor: '100%',
            displayField: 'codigoiso',
            valueField: 'idmoneda',
            hiddenName: 'idmoneda',
            disabled: editOtherOnly,
            typeAhead: true,
            editable: true,
            forceSelection: true,
            resizable: true,
            mode: 'local',
            triggerAction: 'all',
            allowBlank: false,
            store: me.stMoneda,
            listeners: {
                'select': function () {
                    me.verificarCampos();
                }
            }
        });

        this.stMoneda.loadData(this.responseDataMoneda);

        me.cbVigencia = new Ext.form.ComboBox({
            tabIndex: 15,
            id: 'cbVigencia',
            name: 'vigente',
            fieldLabel: 'Vigencia',
            tpl: '<tpl for="."><div ext:qtip="{vigencia}" class="x-combo-list-item">{vigencia}</div></tpl>',
            emptyText: 'Seleccione...',
            anchor: '100%',
            displayField: 'vigencia',
            valueField: 'vigente',
            hiddenName: 'vigente',
            triggerAction: 'all',
            mode: 'local',
            resizable: true,
            allowBlank: false,
            forceSelection: true,
            editable: true,
            typeAhead: true,
            value: true,
            store: new Ext.data.SimpleStore({
                fields: ['vigente', 'vigencia'],
                data: [[false, 'Inactiva'], [true, 'Activa']]
            }),
            listeners: {
                'select': function () {
                    me.verificarCampos();
                }
            }
        });

        me.cbVisible = new Ext.form.ComboBox({
            tabIndex: 16,
            id: 'cbVisible',
            name: 'visibilidad',
            fieldLabel: 'Visibilidad',
            tpl: '<tpl for="."><div ext:qtip="{visibilidad}" class="x-combo-list-item">{visibilidad}</div></tpl>',
            emptyText: 'Seleccione...',
            anchor: '100%',
            displayField: 'visibilidad',
            valueField: 'privado',
            hiddenName: 'privado',
            triggerAction: 'all',
            mode: 'local',
            resizable: true,
            allowBlank: false,
            forceSelection: true,
            editable: true,
            typeAhead: true,
            value: false,
            store: new Ext.data.SimpleStore({
                fields: ['privado', 'visibilidad'],
                data: [[false, 'P\xFAblica'], [true, 'Privada']]
            }),
            listeners: {
                'select': function () {
                    me.verificarCampos();
                }
            }
        });

        this.cbTipoCuenta = new Ext.form.ComboBox({
            id: 'cbTipoCuenta',
            disabled: false,
            editable: false,
            typeAhead: true,
            resizable: true,
            valueField: 'idtipocuenta',
            displayField: 'descripcion',
            triggerAction: 'all',
            mode: 'local',
            anchor: '100%',
            store: this.stTipoCuenta,
            fieldLabel: 'Tipo de cuenta',
            listeners: {
                'select': function () {
                    me.verificarCampos();
                }
            }
        });

        me.formAdicionarCtas = new Ext.form.FormPanel({
            layout: 'form',
            labelAlign: 'top',
            frame: true,
            autoHeight: true,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .2,
                    layout: 'form',
                    items: me.tfieldCodigo
                }, {
                    style: 'margin:0 0 0 10',
                    columnWidth: .6,
                    layout: 'form',
                    items: me.tfieldDescripcion
                }, {
                    style: 'margin:0 0 0 10',
                    columnWidth: .2,
                    layout: 'form',
                    items: me.cbMoneda
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: .4,
                    layout: 'form',
                    items: me.cbGrupoCont
                }, {
                    style: 'margin:0 0 0 10',
                    columnWidth: .2,
                    layout: 'form',
                    items: me.cbNaturaleza
                }, {
                    style: 'margin:0 0 0 10',
                    columnWidth: .2,
                    layout: 'form',
                    items: me.cbVisible
                }, {
                    style: 'margin:0 0 0 10',
                    columnWidth: .2,
                    layout: 'form',
                    items: me.cbTipoCuenta
                }]
            }]
        });

        me.winAdicionarCtas = new Ext.Window({
            title: (dime === 'add') ? me.perfil.etiquetas.lbTtlAddCta : me.perfil.etiquetas.lbTtlModCta,
            defaultButton: 0,
            id: 'winAdicionarCtas',
            closeAction: 'destroy',
            width: 600,
            autoHeight: true,
            constrain: true,
            resizable: true,
            modal: true,
            layout: 'fit',
            items: [me.formAdicionarCtas],
            buttons: (dime === 'add') ? [{
                tabIndex: 17,
                id: 'btnCancelarAdicionar',
                iconCls: 'cancelar',
                text: me.perfil.etiquetas.lbCancelar,
                tooltip: me.perfil.etiquetas.lbTtCancelar,
                scope: me,
                handler: function () {
                    me.kmCta.enable();
                    me.winAdicionarCtas.destroy();
                }
            }, {
                tabIndex: 18,
                id: 'btnAplicarAdicionar',
                iconCls: 'aplicar',
                disabled: true,
                text: me.perfil.etiquetas.lbAplicar,
                tooltip: me.perfil.etiquetas.lbTtAplicar,
                handler: function () {
                    me.salvarCambios();
                }
            }, {
                tabIndex: 19,
                id: 'btnAceptarAdicionar',
                iconCls: 'aceptar',
                disabled: true,
                text: me.perfil.etiquetas.lbAceptar,
                tooltip: me.perfil.etiquetas.lbTtAceptar,
                handler: function () {
                    me.salvarCambios('aceptar');
                }
            }] : [{
                tabIndex: 18,
                id: 'btnCancelarAdicionar',
                iconCls: 'cancelar',
                text: me.perfil.etiquetas.lbCancelar,
                tooltip: me.perfil.etiquetas.lbTtCancelar,
                scope: me,
                handler: function () {
                    me.kmCta.enable();
                    me.winAdicionarCtas.destroy();
                }
            }, {
                tabIndex: 19,
                id: 'btnAceptarAdicionar',
                iconCls: 'aceptar',
                disabled: true,
                text: me.perfil.etiquetas.lbAceptar,
                tooltip: me.perfil.etiquetas.lbTtAceptar,
                handler: function () {
                    me.salvarCambios('aceptar');
                }
            }],
            keys: new Ext.KeyMap(Ext.getBody(), [{
                key: Ext.EventObject.ENTER,
                fn: function () {
                    Ext.getCmp('btnAceptarAdicionar').handler.call();
                },
                scope: me.winAdicionarCtas
            }, {
                key: Ext.EventObject.TAB,
                fn: function () {
                    if (document.activeElement.tabIndex == 19)
                        if (!Ext.getCmp('tfieldCodigo').disabled) {
                            Ext.getCmp('tfieldCodigo').focus(true, 10);
                        } else {
                            Ext.getCmp('tfieldDescripcion').focus(true, 10);
                        }
                }
            }, {
                key: Ext.EventObject.TAB, //SHIFT+TAB
                shift: true,
                fn: function () {
                    if (document.activeElement.tabIndex == 11) {
                        if (!Ext.getCmp('btnAceptarAdicionar').disabled) {
                            Ext.getCmp('btnAceptarAdicionar').focus();
                        } else {
                            Ext.getCmp('btnCancelarAdicionar').focus();
                        }
                    }
                    if (document.activeElement.tabIndex == 12 && Ext.getCmp('tfieldCodigo').disabled) {
                        if (!Ext.getCmp('btnAceptarAdicionar').disabled) {
                            Ext.getCmp('btnAceptarAdicionar').focus();
                        } else {
                            Ext.getCmp('btnCancelarAdicionar').focus();
                        }
                    }
                }
            }], "keydown"),
            listeners: {
                'show': function () {
                    Ext.getCmp('tfieldCodigo').focus(false, 100);
                },
                'destroy': function () {
                    me.kmCta.enable();
                }
            }
        });
        me.winAdicionarCtas.show();
        me.formAdicionarCtas.getForm().isValid();
        me.cbMoneda.setValue(me.stMoneda.getAt(me.stMoneda.find('tipomoneda', 0)).data.idmoneda);
        me.cbMoneda.setRawValue(me.stMoneda.getAt(me.stMoneda.find('tipomoneda', 0)).data.codigoiso);
    },
    cargarPlanCtas: function () {
        var me = this;
        me.winPlanCtas = new Ext.Window({
            id: 'winPlanCtas',
            title: me.perfil.etiquetas.lbNomPlanCta,
            width: 860,
            height: 480,
            modal: true,
            maximizable: true,
            constrain: true,
            defaultButton: 0,
            layout: 'fit',
            items: me.tgPlanCtas = new Ext.Confin.Cuenta.TgPlanCtas({perfil: me.perfil}),
            buttons: [{
                id: 'btnCancelarPlanCtas',
                iconCls: 'cancelar',
                text: me.perfil.etiquetas.lbCancelar,
                tooltip: me.perfil.etiquetas.lbTtCancelar,
                scope: me,
                handler: function () {
                    me.kmCta.enable();
                    me.tgPlanCtas.getSelectionModel().clearSelections();
                    me.winPlanCtas.close();
                }
            }, {
                id: 'btnAceptarPlanCtas',
                disabled: true,
                iconCls: 'aceptar',
                text: me.perfil.etiquetas.lbAceptar,
                tooltip: me.perfil.etiquetas.lbTtAceptar,
                handler: function () {
                    me.savePlanCuentas();
                    me.winPlanCtas.close();
                }
            }]
        });
        me.winPlanCtas.show();
        me.winPlanCtas.doLayout();
    },
    habilitarGuardarApertura: function () {
        var nomaperturas = Ext.getCmp('cbxNomApertura').fSelect.valuesLoaded.length,
            manualaperturas = this.gpApertura.getStore().getCount(),
            disable = false;
        if (!this.gpApertura.hidden && (!this.gpApertura.gridValid() || manualaperturas == 0)) {
            disable = true;
        } else if (this.gpApertura.hidden && (this.formaterror || nomaperturas == 0)) {
            disable = true;
        } else {
            disable = false;
        }
        Ext.getCmp('btnAceptarAps').setDisabled(disable);

    },
    initTask: function () {
        Ext.TaskMgr.start({
            run: function () {
                if (this.panelexpanded) {
                    this.habilitarGuardarApertura();
                } else {
                    return false;
                }
            },
            interval: 10000,
            scope: this
        });
    }
});

utf8_encode = function (argString) {
    if (argString === null || typeof argString === 'undefined') {
        return '';
    }

    var string = (argString + '');
    var utftext = '',
        start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode(
                (c1 >> 6) | 192, (c1 & 63) | 128
            );
        } else if ((c1 & 0xF800) != 0xD800) {
            enc = String.fromCharCode(
                (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            );
        } else { // surrogate pairs
            if ((c1 & 0xFC00) != 0xD800) {
                throw new RangeError('Unmatched trail surrogate at ' + n);
            }
            var c2 = string.charCodeAt(++n);
            if ((c2 & 0xFC00) != 0xDC00) {
                throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
            }
            c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
            enc = String.fromCharCode(
                (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            );
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.slice(start, stringl);
    }

    return utftext;
}

validate.cargarAcciones();
