Ext.ns('Ext.Persona');

Ext.Persona.altaEntidadLang = {
    btnAsociar: 'Alta',
    tlpAsociar: 'Asociar persona al cargo',
    lb_cb_ProcedenciaSocial: 'Procedencia social',
    lb_Contrato_Determinado: 'Contrato determinado',

    /**
     * Columnas del Grid Listado de persona
     */
    colNoIdentidad: 'No identidad',
    colNombreyApellidos: 'Nombre y apellidos',
    colFnacimiento: 'Edad',
    lbSexo: 'Sexo',

    tlpAceptar: 'Guadar y cerrar',
    btnGuardar: 'Contratar',
    btnCancelar: 'Cancelar',
    tlpCancelar: 'Cerrar formulario',

    lb_CargoCompleto: 'El cargo selecionado no cuenta con capacidad disponible, desea forzar la realizaci&oacute;n de la asociaci&oacute;n',
    lbMsgWait: 'Por favor espere...',
    lbMsgSendData: 'Guardando datos...'
};

Ext.Persona.altaEntidad = Ext.extend(Ext.Panel, {
    idioma: Ext.apply(Ext.Persona.altaEntidadLang, this.idioma || {}),
    fns: {
        asociarHandler: Ext.emptyFn(),
        asociarScope: this,
        cancelarHandler: Ext.emptyFn(),
        cancelarScope: this
    },
    entidad: {id: null},
    cargo: {id: null},
    chSelEntidad: false,
    editando: false,
    force: false,
    layout: 'border',
    border: false,
    initComponent: function () {
        this.addEvents('alta', 'cancelar', 'dandoAlta');
        this.on('alta', this.onAlta, this);
        this.on('cancelar', this.onCancelar, this);


        this.items = [this.initGrid(), this.initForm({region: 'south'})];
        Ext.Persona.altaEntidad.superclass.initComponent.call(this);
        this.on('show', function () {
            this.hideForm();
        }, this);
    },
    initStore: function (map) {

        var mapping = this.combine([
            {
                name: 'idpersona'
            },
            {
                name: 'nombreapellidos'
            },
            {
                name: 'sexo', type: 'int'
            },
            {
                name: 'denomsexo'
            },
            {
                name: 'numid'
            },
            {
                name: 'foto'
            },
            {
                name: 'fechanacimiento'
            },
            {
                name: 'annos', type: 'int'
            }
        ], map);

        this.st = new Ext.data.Store({
            url: '/pvd/persona/index.php/movimientopersona/getPersonasToAlta',
            reader: new Ext.data.JsonReader({
                totalProperty: "quantity",
                root: "data",
                id: "idpersona"
            }, mapping)
            //sortInfo: {field: 'idreservacargo', direction: "DESC"},
            //groupField: 'idreservacargo'
        });
        this.st.on('beforeload', function () {
            if (this.editando)
                return false;
            this.smListadoPersonaAlta.clearSelections();
        }, this)
        return this.st;
    },
    initTypeofSelectionModel: function () {
        this.smListadoPersonaAlta = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        this.smListadoPersonaAlta.on('selectionchange', this.onSelectChange, this);
        this.smListadoPersonaAlta.on('beforerowselect', function () {
            if (this.fpGest.isVisible()) {
                return false;
            }
        }, this);
    },
    initColumnModel: function (cols) {
        this.initTypeofSelectionModel();

        this.colModel = this.combine([new Ext.grid.RowNumberer(), this.smListadoPersonaAlta,
            {
                header: this.idioma.colNoIdentidad,
                sortable: true,
                width: 100,
                dataIndex: 'numid'
            },
            {
                header: this.idioma.colNombreyApellidos,
                sortable: true,
                width: 200,
                dataIndex: 'nombreapellidos'
            }, {
                header: this.idioma.lbSexo,
                sortable: true,
                width: 80,
                dataIndex: 'denomsexo'
            }, {
                header: this.idioma.colFnacimiento,
                sortable: true,
                width: 80,
                dataIndex: 'annos',
                renderer: function (v) {
                    if (Ext.isEmpty(v) || parseInt(v) < 1) {
                        return '';
                    }
                    return v > 1 ? v + ' años' : v + ' Año';
                }
            }
        ], cols);
        return this.colModel;
    },
    initGrid: function (grid) {
        var store = this.initStore();
        var colModel = this.initColumnModel();

        var gridConfig = {
            store: store,
            region: 'center',
            loadMask: {
                store: store
            },
            margins: '0 0 5 0',
            columns: colModel,
            viewConfig: {forceFit: true},
            sm: this.smListadoPersonaAlta,
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: store,
                displayInfo: true
            })
        };

        if (!Ext.isEmpty(grid)) {
            Ext.apply(gridConfig, grid);
        }

        this.gpListadoPersona = new Ext.grid.GridPanel(gridConfig);

        return this.gpListadoPersona;
    },
    getGrid: function () {
        return this.gpListadoPersona;
    },

    initFormFields: function (arg) {

        this.fields = {};
        Ext.apply(this.fields, arg, new Ext.Persona.factoryFieldsSituacionLaboral(true));

        this.fields.cbProcedenciaSocial = new PVD.Persona.NomProcedenciaSocial.ViewCombo({
            mode: 'remote',
            hideParent: true,
            name: 'idprocedenciasocial',
            valueField: 'idprocedenciasocial',
            hiddenName: 'idprocedenciasocial',
            fieldLabel: this.idioma.lb_cb_ProcedenciaSocial,
            anchor: '90%'
        });

        this.fields.dfDesde.maxValue = new Date();

        this.fields.cbSituacionLaboral.listeners = {
            selectNode: function (node) {
                this.fpGest.getForm().findField(this.fields.tfArea.name).ownerCt.setVisible(node.attributes.asociadocargo === '1');
                this.fpGest.getForm().findField(this.fields.tfCargo.name).ownerCt.setVisible(node.attributes.asociadocargo === '1');
                this.fpGest.getForm().findField(this.fields.tfCargo.name).allowBlank = (node.attributes.asociadocargo === '1') ? false : true;

                this.fpGest.doLayout();
                this.loadForm({
                    idsituacion: node.id,
                    asociadocargo: node.attributes.asociadocargo
                });
            }.createDelegate(this)
        };
    },
    initFormButtons: function () {
        this.btnGuardar = new Ext.Button({
            icon: perfil.dirImg + 'guardar.png',
            iconCls: 'btn',
            text: this.idioma.btnGuardar,
            tooltip: this.idioma.tlpGuardar,
            scope: this,
            handler: this.handlerGuardar
        });

        this.btnCancelar = new Ext.Button({
            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'btn',
            text: this.idioma.btnCancelar,
            tooltip: this.idioma.tlpCancelar,
            scope: this,
            handler: this.hideForm
        });
    },
    initForm: function (c, i, b) {

        this.initFormButtons();

        this.initFormFields();

        var items = this.combine([
            {
                xtype: 'hidden', name: 'id'
            },
            {xtype: 'hidden', name: 'idsituacion'},
            {xtype: 'hidden', name: 'asociadocargo'},
            {xtype: 'hidden', name: 'identidad'},
            {xtype: 'hidden', name: 'idarea'},
            {xtype: 'hidden', name: 'idcargo'},
            {xtype: 'hidden', name: 'idmotivobaja'},
            {xtype: 'hidden', name: 'idprocedenciasocial'},
            {
                columnWidth: .5,
                layout: 'form',
                items: [this.fields.cbSituacionLaboral]
            },
            {
                columnWidth: .25,
                layout: 'form',
                items: [this.fields.dfDesde]
            },
            {
                columnWidth: .25,
                layout: 'form',
                items: [this.fields.dfHasta]
            },
            {
                columnWidth: .33,
                layout: 'form',
                items: [this.fields.tfEntidad]
            },
            {
                columnWidth: .33,
                layout: 'form',
                items: [this.fields.tfArea]
            },
            {
                columnWidth: .33,
                layout: 'form',
                items: [this.fields.tfCargo]
            },
            {
                columnWidth: .45,
                layout: 'form',
                items: [this.fields.cbProcedenciaSocial]
            },
            {
                columnWidth: .25,
                layout: 'form',
                items: [this.fields.tfNoAlta]
            }
        ], i);

        var buttons = this.combine([this.btnCancelar, this.btnGuardar], b);

        var config = {
            frame: true,
            bodyStyle: 'padding: 5px 5px 0',
            height: 200,
            labelWidth: 90, //Con esto hacemos mas pequeñas las etiquetas
            labelAlign: 'top',
            buttonAlign: 'right',
            layout: 'column',
            //trackResetOnLoad: true,
            items: items,
            buttons: buttons
        };

        Ext.apply(config, c);

        this.fpGest = new Ext.FormPanel(config);
        this.fpGest.on('show', function () {
            this.doLayout();
            this.editando = true;
            this.updateAreayCargo();
        }, this);
        this.fpGest.on('beforeshow', function () {
            this.btnDarAlta.setDisabled(true);
        }, this);
        this.fpGest.on('hide', function(){
            this.editando = false;
        },this);

        return this.fpGest;
    },
    loadForm: function (record) {
        var rec = (record instanceof Ext.data.Record)
            ? record
            : new Ext.data.Record(record);
        this.fpGest.getForm().loadRecord(rec);
    },
    hideForm: function () {
        this.fpGest.hide();
        this.resetForm();
        this.btnDarAlta.setDisabled(this.smListadoPersonaAlta.getCount() < 1);
        this.doLayout();
    },
    resetForm: function () {
        this.fpGest.getForm().reset();
        this.fpGest.getForm().findField(this.fields.dfDesde.name).setMaxValue(new Date());

        this.fpGest.getForm().findField(this.fields.cbSituacionLaboral.name).baseParams = {asociadocargo: 0};
        this.fpGest.getForm().findField(this.fields.cbSituacionLaboral.name).onTrigger1Click();
        this.force = false;
    },
    validarForm: function () {
        return this.fpGest.getForm().isValid();
    },

    combine: function (arr, a) {
        if (!Ext.isArray(a)) {
            return arr;
        }
        Ext.each(a, function (v) {
            arr.push(v);
        });
        return arr;
    },
    getButtons: function () {

        this.Asociar = new Ext.Button({
            text: this.idioma.btnAsociar,
            tooltip: this.idioma.tlpAsociar,
            iconCls: 'btn',
            scope: this,
            icon: perfil.dirImg + 'asociar.png',
            handler: this.asociarHandler
        });
        this.btnDarAlta = new Ext.Button({
            hidden: true,
            disabled: true,
            icon: perfil.dirImg + 'abajo.png',
            scope: this,
            iconCls: 'btn',
            text: 'Dar alta',
            tooltip: 'Dar alta',
            handler: this.darAltaHandler
        });
        this.btnCancelarAlta = new Ext.Button({
            hidden: true,
            disabled: true,
            scope: this,
            icon: perfil.dirImg + 'arriba.png',
            iconCls: 'btn',
            text: 'Cancelar',
            tooltip: 'Cancelar acci&oacute;n de alta',
            handler: this.cancelarHandler
        });
        return {1: this.Asociar, 2: this.btnCancelarAlta, 3: this.btnDarAlta};
    },

    setHandlerAsociar: function (fn, scope) {
        if (Ext.isFunction(fn)) {
            this.fns.asociarHandler = fn;
            this.fns.asociarScope = scope || this;
        }
    },
    setHandlerCancelar: function (fn, scope) {
        if (Ext.isFunction(fn)) {
            this.fns.cancelarHandler = fn;
            this.fns.cancelarScope = scope || this;
        }
    },

    setDataEstructura: function (entidad, node) {
        this.setEntidad(entidad);
        this.setCargo(node);
        if (this.isVisible() && entidad.id === null) {
            this.cancelarHandler();
            return;
        }
        if (this.isVisible() && !this.fpGest.isVisible() && this.chSelEntidad) {
            this.loadData(this.entidad.id, true);
        } else if (this.cargo && this.isVisible() && this.fpGest.isVisible()) {
            this.updateAreayCargo();
        }
    },
    setEntidad: function (e) {
        if (e instanceof Ext.tree.TreeNode) {
            if (this.entidad.id !== e.id) {
                this.entidad = e;
                this.chSelEntidad = true;
            } else {
                this.chSelEntidad = false;
            }
        }
    },
    setCargo: function (c) {
        if (c instanceof Ext.tree.TreeNode) {
            if (this.cargo.id !== c.id) {
                this.cargo = c;
            }
        }
    },

    asociarHandler: function () {
        if (this.entidad.id === null) {
            mostrarMensaje(2, 'Por favor seleccione una entidad para dar alta');
            return;
        }

        this.loadData(this.entidad.id);
        this.fireEvent('alta');
        this.fns.asociarHandler.call(this.fns.asociarScope);
    },
    cancelarHandler: function () {
        this.fireEvent('cancelar');
        this.editando = false;
        this.hideForm();
        this.fns.cancelarHandler.call(this.fns.cancelarScope);
    },

    onAlta: function () {
        this.Asociar.hide();
        this.btnDarAlta.show();
        this.btnCancelarAlta.show();
        this.btnCancelarAlta.enable();
    },
    onCancelar: function () {
        this.Asociar.show();
        this.btnDarAlta.hide();
        this.btnCancelarAlta.hide();
        this.btnCancelarAlta.enable();
    },
    hideAsociarBtn: function (f) {
        this.Asociar.setVisible(f);
    },

    loadData: function (idEstruc, reload) {
        this.getGrid().getStore().baseParams.idestructura = idEstruc || null;

        if (reload === true) {
            this.getGrid().getStore().reload({
                scope: this
            });
        } else {
            this.getGrid().getStore().load({
                params: {limit: 25, start: 0},
                scope: this
            });
        }
        this.chSelEntidad = false;
    },

    onSelectChange: function (sm) {
        this.btnDarAlta.setDisabled(sm.getCount() < 1);
    },

    darAltaHandler: function () {
        this.fpGest.show();
        this.loadForm({
            identidad: this.entidad.id,
            denomentidad: this.entidad.text
        });
        this.fpGest.getForm().findField(this.fields.tfCargo.name).trigger.hide();
    },

    updateAreayCargo: function (force) {
        if (this.cargo instanceof Ext.tree.TreeNode) {
            if (this.validarDisponibilidad(this.cargo, this.smListadoPersonaAlta.getCount()) !== false || force === true) {
                var area = this.getAreaByCargo(this.cargo);
                this.force = force === true ? true : false;
                this.loadForm({
                    idcargo: this.cargo.id,
                    denomcargo: this.cargo.attributes.denominacion,
                    idarea: area ? area.id : '',
                    denomarea: area ? area.attributes.denominacion : ''
                });
            } else {
                mostrarMensaje(2, this.idioma.lb_CargoCompleto, function (btn) {
                    if (btn == 'ok') {
                        this.updateAreayCargo(true);
                    } else {
                        this.hideForm();
                    }
                }.createDelegate(this));
            }
        }
    },

    getAreaByCargo: function (n) {
        var organo = false;
        if (n instanceof Ext.tree.TreeNode) {
            var parentNode = n.parentNode;
            //n.bubble(function (n) {
            /*if (parseInt(n.attributes.idconcepto) === 5 || parseInt(n.attributes.idtipo) === 5) {
             organo = n;
             return false;
             }*/
            if (parseInt(parentNode.attributes.idconcepto) !== 3 || parseInt(parentNode.attributes.idtipo) !== 3) {
                organo = parentNode;
            }
            //return false;
            //});
        }
        return organo;
    },

    validarDisponibilidad: function (cargo, c) {
        var cant = !Ext.isEmpty(c) ? c : 0;

        var dispon = this.getDisponibilidad(cargo);
        if (dispon <= 0) {//No hay vacantes para el cargo seleccionado
            return false;
        }
        return (cant <= dispon) ? true : false;
    },

    getDisponibilidad: function (n) {
        return parseInt(n.attributes.cantidad) - parseInt(n.attributes.cantidad_real);
    },

    getDataToSend: function () {
        var params = {};
        var arrIp = [];
        Ext.each(this.smListadoPersonaAlta.getSelections(), function (rec) {
            arrIp.push(rec.get('idpersona'));
        }, this);
        params.idpersona = Ext.encode(arrIp);

        var values = this.fpGest.getForm().getValues();

        for (var k in values) {
            switch (k) {
                case 'idsituacion':
                case 'fdesde':
                case 'fhasta':
                case 'identidad':
                case 'noalta':
                    params[k] = values[k];
                    break;
                case 'denomcargo':
                    params.cargo = (values['asociadocargo'] === '1') ? values[k] : null;
                    break;
                case 'idcargo':
                    params[k] = (values['asociadocargo'] === '1') ? values[k] : null;
                    break;
                case 'denomentidad':
                    params.entidad = values[k];
                    break;
                case 'denomarea':
                    params.area = (values['asociadocargo'] === '1') ? values[k] : null;
                    break;
                case 'idarea':
                    params[k] = (values['asociadocargo'] === '1') ? values[k] : null;
                    break;
                case 'idprocedenciasocial':
                    params[k] = values[k][1];
                default :
                    continue;
                    break;
            }
        }

        return params;
    },

    handlerGuardar: function () {
        if (this.validarForm()) {
            PVD.mostrarMascara(this.id + 'saveData', this.idioma.lbMsgWait, this.idioma.lbMsgSendData);
            Ext.Ajax.request({
                url: 'darAlta',
                method: 'POST',
                scope: this,
                params: this.getDataToSend(),
                callback: function (options, success, response) {
                    PVD.ocultarMascara(this.id + 'saveData');
                    responseData = Ext.decode(response.responseText);
                    if (responseData.success === true) {
                        mostrarMensaje(1, 'La(s) persona(s) ha(n) sido dada de alta satisfactoriamente.');
                        this.editando = false;
                        this.loadData(this.entidad.id, true);
                        this.editando = true;
                        if (this.cargo instanceof Ext.tree.TreeNode) {
                            this.cargo.parentNode.reload();
                        }
                        this.hideForm();
                    }
                }
            });
        }
    }
});