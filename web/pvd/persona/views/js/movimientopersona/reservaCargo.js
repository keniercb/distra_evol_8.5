Ext.ns('Ext.Persona');

Ext.Persona.reservaCargoLang = {
    title: 'Reserva',
    gpTitle: 'Listado de reservas',
    lb_add_reserva: 'Adicionado reserva',
    lb_mod_reserva: 'Modificando reserva',
    pEstructura:'Estructura',

    /**
     * Columnas del Grid Listado de persona
     */
    colNoIdentidad: 'No identidad',
    colNombreyApellidos: 'Nombre y apellidos',
    colFechaDesde: 'Desde',
    colFechaHasta: 'Hasta',
    col_Sustituto: 'Sustituto',

    /**
     * Botones
     */
    tlpGuardar: 'Guadar y cerrar',
    btnGuardar: 'Guardar',
    btnAceptar: 'Aceptar',
    tlpAceptar: 'Guadar datos y cerrar ventana <b>(Enter)</b>',
    btnAplicar: 'Aplicar',
    tlpAplicar: 'Guadar y limpiar el formulario',
    btnCancelar: 'Cancelar',
    tlpCancelar: 'Cerrar ventana sin guardar datos <b>(Alt + X)</b>',

    btnAdicionar: 'Adicionar',
    tlpAdicionar: 'Adicionar reserva de cargo',
    btnModificar: 'Modificar',
    tlpModificar: 'Modificar reserva',
    btnEliminar: 'Eliminar',
    tlpEliminar: 'Eliminar reserva',

    lbMsgWait: 'Por favor espere...',
    lbMsgSendData: 'Guardando datos...',
    lbMsgRemoving: 'Eliminado datos...',
    lb_ConfirRemove: '¿Est&aacute; seguro que quiere eliminar la(s) reserva(s) de cargo seleccionada(s)?',
    lb_MsgRemoveOK: 'La(s) reserva(s) de cargo ha(n) sido eliminada(s) satisfactoriamente.'
};

Ext.Persona.reservaCargo = Ext.extend(Ext.Panel, {
    idioma: Ext.apply(Ext.Persona.reservaCargoLang, this.idioma || {}),
    layout: 'border',
    border: false,
    nodeSelected: {
        id: null
    },
    nodeEntidadSeleted: {
        id: null
    },
    nodeSelChange: true,
    editando: false,

    initComponent: function () {
        this.title = this.idioma.title;
        this.advancedSearch();

        this.items = [{
            border: false,
            region: 'center',
            layout: 'border',
            items: [this.initGrid({region: 'center'}), this.initForm({region: 'south'})]
        }, this.fpAdvancedSearch];

        Ext.Persona.reservaCargo.superclass.initComponent.call(this);
        this.on('show', function () {
            this.hideForm();
            this.loadReserva();
        }, this, {buffer: 100});
    },
    advancedSearch: function () {
        try {
            this.fpAdvancedSearch = new Ext.Persona.busquedaAvanzadaPersona({
                region: 'east',
                hidden: false,
                margins: '0 0 5 5'
            });
        } catch (Error) {
            this.fpAdvancedSearch = null;
        }

    },
    bindStore: function (st) {
        if (!Ext.isEmpty(this.fpAdvancedSearch)) {
            this.fpAdvancedSearch.bindStore(st);
        }
    },
    initButtons: function () {

        this.btnAdicionar = new Ext.Button({
            disabled: true,
            iconCls: 'btn',
            icon: perfil.dirImg + 'adicionar.png',
            text: this.idioma.btnAdicionar,
            tooltip: this.idioma.tlpAdicionar,
            scope: this,
            handler: this.addReserva
        });

        this.btnModificar = new Ext.Button({
            disabled: true,
            text: this.idioma.btnModificar,
            tooltip: this.idioma.btnModificar,
            iconCls: 'btn',
            icon: perfil.dirImg + 'modificar.png',
            scope: this,
            handler: this.modReserva
        });

        this.btnEliminar = new Ext.Button({
            disabled: true,
            text: this.idioma.btnEliminar,
            tooltip: this.idioma.tlpEliminar,
            iconCls: 'btn',
            icon: perfil.dirImg + 'eliminar.png',
            scope: this,
            handler: this.eliminarRegistros
        });
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

    initStore: function (map) {

        var mapping = this.combine([
            {
                name: 'idreservacargo', type: 'int'
            },
            {
                name: 'identidad', type: 'int'
            },
            {
                name: 'idcargo', type: 'int'
            },
            {
                name: 'idpersonaentidad', type: 'int'
            },
            {
                name: 'denomentidad'
            },
            {
                name: 'denomarea'
            },
            {
                name: 'denomcargo'
            },
            {
                name: 'idpersona', type: 'int'
            },
            {
                name: 'sustituto'
            },
            {
                name: 'ruta'
            },
            {
                name: 'falta'
            },
            {
                name: 'fdesde'
            },
            {
                name: 'fhasta'
            },
            {
                name: 'numid'
            },
            {
                name: 'nombreapellidos'
            },
            {
                name: 'sexo', type: 'int'
            },
            {
                name: 'foto'
            }
        ], map);

        var st = new Ext.data.GroupingStore({
            url: 'getReservaCargo',
            reader: new Ext.data.JsonReader({
                totalProperty: "quantity",
                root: "data"
            }, mapping),
            sortInfo: {field: 'nombreapellidos', direction: "ASC"},
            groupField: 'ruta'
        });
        st.on('beforeload', function () {
            if (this.editando)
                return false;
            this.smReservaCargo.clearSelections();
        }, this)
        return st;
    },
    initTypeofSelectionModel: function () {
        this.smReservaCargo = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        this.smReservaCargo.on('selectionchange', this.onSelectChange, this);
    },
    initColumnModel: function (cols) {
        this.initTypeofSelectionModel();

        var colModel = this.combine([new Ext.grid.RowNumberer(), this.smReservaCargo,
            {
                header: this.idioma.colNoIdentidad,
                sortable: true,
                width: 100,
                dataIndex: 'numid'
            },
            {
                header: this.idioma.colNombreyApellidos,
                sortable: true,
                width: 250,
                dataIndex: 'nombreapellidos'
            },
            {
                header: this.idioma.colCargo,
                sortable: true,
                width: 150,
                dataIndex: 'denomcargo'
            },
            {
                header: this.idioma.colFechaDesde,
                sortable: true,
                width: 100,
                dataIndex: 'fdesde'
            },
            {
                header: this.idioma.colFechaHasta,
                sortable: true,
                width: 100,
                dataIndex: 'fhasta'
            },
            {
                header: this.idioma.col_Sustituto,
                sortable: true,
                width: 80,
                dataIndex: 'sustituto',
                renderer: function (val, metadata) {
                    if (val == true) {
                        return "<center class='checked' style='width: 16px; height: 16px;'></center>";
                    }
                    return '';
                }
            },
            {
                hidden: true,
                hideable: false,
                sortable: true,
                dataIndex: "ruta"
            }], cols);
        return colModel;
    },
    initGrid: function (grid) {
        var store = this.initStore();
        var colModel = this.initColumnModel();

        this.initButtons();

        this.viewReservaCargo = new Ext.grid.GroupingView({
            enableRowBody: true,
            groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
        });

        var gridConfig = {
            //title: this.idioma.gpTitle,
            margins: '0 0 5 0',
            columns: colModel,
            stripeRows: true,
            view: this.viewReservaCargo,
            store: store,
            loadMask: {
                store: store
            },
            sm: this.smReservaCargo,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: store,
                displayInfo: true
            })
        };

        gridConfig.tbar = this.fpAdvancedSearch.getFastSearch([this.btnAdicionar, this.btnModificar, this.btnEliminar]);
        this.bindStore(store);

        if (!Ext.isEmpty(grid)) {
            Ext.apply(gridConfig, grid);
        }
        this.gpReservaCargo = new Ext.grid.GridPanel(gridConfig);

        return this.gpReservaCargo;
    },
    getGrid: function () {
        return this.gpReservaCargo;
    },
    onSelectChange: function (sm) {
        this.btnEliminar.setDisabled(sm.getCount() < 1);
        this.btnModificar.setDisabled(sm.getCount() !== 1);
    },

    initFormFields: function (arg) {

        this.fields = {
            tfEntidad: {
                xtype: 'textfield',
                fieldLabel: 'Entidad',
                name: 'denomentidad',
                anchor: '90%',
                readOnly: true,
                hideParent: true
            },
            tfArea: {
                xtype: 'textfield',
                allowBlank: true,
                fieldLabel: '&Aacute;rea',
                name: 'denomarea',
                readOnly: false,
                anchor: '90%',
                hideParent: true
            },
            tfCargo: {
                xtype: 'trigger',
                allowBlank: false,
                fieldLabel: 'Cargo',
                name: 'denomcargo',
                readOnly: false,
                anchor: '90%',
                triggerClass: 'x-form-search-trigger',
                hideParent: true
            },
            dfDesde: new Ext.form.DateField({
                id: 'fdesde' + id,
                name: 'fdesde',
                fieldLabel: 'Desde',
                anchor: '90%',
                format: 'd/m/Y',
                editable: true,
                readOnly: false,
                allowBlank: false,
                anchor: '90%',
                maxValue: new Date().format('d/m/Y'),
                vtype: 'daterange',
                endDateField: 'fhasta' + id
            }),
            dfHasta: new Ext.form.DateField({
                id: 'fhasta' + id,
                name: 'fhasta',
                fieldLabel: 'Hasta',
                anchor: '100%',
                format: 'd/m/Y',
                editable: true,
                hideParent: true,
                readOnly: false,
                anchor: '90%',
                vtype: 'daterange',
                startDateField: 'fdesde' + id
            })
        };

        this.fields.chbSustituto = new Ext.form.Checkbox({
            hideLabel: true,
            boxLabel: '¿Es sustituto?',
            name: 'sustituto'
        });

        this.stPersonas = new Ext.data.GroupingStore({
            url: 'getPersonaToReserva',
            reader: new Ext.data.JsonReader({
                totalProperty: 'quantity',
                root: 'data',
                id: 'idpersonaentidad'
            }, [
                {name: 'idpersona'},
                {name: 'denompropuesta'},
                {name: 'nombreapellidos'},
                {name: 'foto'},
                {name: 'nombre'},
                {name: 'snombre'},
                {name: 'papel'},
                {name: 'sapel'},
                {name: 'numid'},
                {name: 'identidad'},
                {name: 'idpersonaentidad'},
                {name: 'idcargo'},
                {name: 'area'},
                {name: 'cargo'}
            ]),
            sortInfo: {field: 'denompropuesta', direction: "DESC"},
            groupField: 'area'
        });

        this.fields.cbPersonas = new Ext.ux.form.GroupComboBox({
            fieldLabel: 'Persona',
            mode: 'remote',
            disabled: true,
            store: this.stPersonas,
            typeAhead: false,
            name: 'idpersonaentidad',
            triggerAction: 'all',
            displayField: 'nombreapellidos',
            hiddenName: 'idpersonaentidad',
            valueField: 'idpersonaentidad',
            minChars: 3,
            anchor: '97%',
            pageSize: 10,
            allowBlank: false,
            triggerClass: 'x-form-search-trigger',
            loadingText: 'Cargando...',
            emptyText: 'Criterio a buscar...',
            tpl: '<tpl for=".">' +
            '<div ext:qtip="<b>{cargo}</b>" class="x-combo-list-item">' +
            '<img width="35" height="35" src="data:image/png;base64,{foto}">  ' +
            '{nombreapellidos} ' +
            '(<b>No. identidad: {numid}</b>)' +
            '</div>' +
            '</tpl>',
            groupTextTpl: '{gvalue} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})',
            startCollapsed: false
        });

        this.initPanelEstructura();

        this.fields.tfCargo.onTriggerClick = function () {
            this.showWinEstructura(this.fpGest.getForm().findField('identidad').getValue());
        }.createDelegate(this);

        this.fields.tfCargo.listeners = {
            focus: function (field) {
                if (Ext.isEmpty(field.getValue())) {
                    this.showWinEstructura();
                }
            }.createDelegate(this)
        }
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

        this.btnAplicar = new Ext.Button({
            icon: perfil.dirImg + 'aplicar.png',
            iconCls: 'btn',
            text: this.idioma.btnAplicar,
            tooltip: this.idioma.tlpAplicar,
            scope: this,
            handler: this.handlerGuardar
        });

        this.btnCancelar = new Ext.Button({
            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'btn',
            scope: this,
            text: this.idioma.btnCancelar,
            tooltip: this.idioma.tlpCancelar,
            handler: this.hideForm
        });
    },
    initForm: function (c, i, b) {

        this.initFormButtons();

        this.initFormFields();

        var items = this.combine([
            {
                xtype: 'hidden', name: 'idreservacargo'
            },
            {xtype: 'hidden', name: 'identidad'},
            {xtype: 'hidden', name: 'idcargo'},
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
                columnWidth: .98,
                layout: 'form',
                items: [this.fields.cbPersonas]
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
                columnWidth: .25,
                layout: 'form',
                items: [this.fields.chbSustituto]
            }
        ], i);

        var buttons = this.combine([this.btnCancelar, this.btnAplicar, this.btnGuardar], b);

        var config = {
            title: 'undefined',
            frame: true,
            //hidden: true,
            border: false,
            bodyStyle: 'padding: 5px 5px 0',
            height: 225,
            labelWidth: 90, //Con esto hacemos mas pequeñas las etiquetas
            labelAlign: 'top',
            buttonAlign: 'right',
            layout: 'column',
            trackResetOnLoad: true,
            items: items,
            buttons: buttons
        };

        Ext.apply(config, c);

        this.fpGest = new Ext.FormPanel(config);
        this.fpGest.on('show', function () {
            this.resetForm();
            this.doLayout();
            this.editando = true;
            if (this.fpAdvancedSearch.isVisible()) {
                this.fpAdvancedSearch.toggleAdvanceSearch();
            }
        }, this);

        this.fpGest.on('hide', function () {
            this.editando = false;
        }, this);

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
        this.doLayout();
    },
    resetForm: function () {
        this.loadForm({
            'idreservacargo': '',
            'denomentidad': '',
            'identidad': '',
            'denomarea': '',
            'denomcargo': '',
            'idcargo': '',
            'idpersonaentidad': '',
            'fdesde': '',
            'fhasta': '',
            'sustituto': false
        });
        this.fpGest.getForm().clearInvalid();
        this.fpGest.getForm().findField(this.fields.tfEntidad.name).ownerCt.setVisible(false);
        this.fpGest.getForm().findField(this.fields.tfArea.name).ownerCt.setVisible(false);
        this.fpGest.getForm().findField(this.fields.dfDesde.name).setValue(new Date().format('d/m/Y'));
        this.fields.cbPersonas.disable();
    },
    validarForm: function () {
        return this.fpGest.getForm().isValid();
    },

    initButtonsWinEstructura: function () {

        this.btnCancelWin = new Ext.Button({
            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'btn',
            text: this.idioma.btnCancelar,
            tooltip: this.idioma.tlpCancelar,
            scope: this,
            handler: this.handlerCancelarWin
        });

        this.btnAceptarWin = new Ext.Button({
            disabled: true,
            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'btn',
            text: this.idioma.btnAceptar,
            tooltip: this.idioma.tlpAceptar,
            scope: this,
            handler: this.handlerAceptarWin
        });
    },
    initPanelEstructura: function () {
        this.initButtonsWinEstructura();

        this.pEstructura = new Ext.estructura.panel.PanelEstructura({
            title: this.idioma.pEstructura
        });
        this.pEstructura.tree.getSelectionModel().on('beforeselect', function (selModel, node) {
            this.btnAceptarWin.setDisabled(!this.nodeIsCargo(node));
        }, this);

        this.winEstructura = new Ext.Window({
            title: this.idioma.pEstructura,
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            items: [this.pEstructura],
            buttons: [this.btnCancelWin, this.btnAceptarWin],
            keys:[
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        this.btnAceptarWin.handler();
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!this.btnCancelWin.disabled) {
                            this.btnCancelWin.handler();
                        }
                    }
                }
            ]
        });
    },
    loadEstructura: function (id) {
        if (this.pEstructura.inicial === id) {
            this.pEstructura.tree.getSelectionModel().clearSelections();
            return;
        }

        this.pEstructura.inicial = id || null;
        this.pEstructura.tree.getLoader().load(this.pEstructura.tree.getRootNode(), function () {
            this.pEstructura.tree.getRootNode().expand(false, true, function (root) {
                this.pEstructura.tree.getSelectionModel().select(root.firstChild);
            }.createDelegate(this));
        }.createDelegate(this));
    },
    showWinEstructura: function (id) {
        this.winEstructura.show();
        this.loadEstructura(id || this.nodeEntidadSeleted.id);
    },
    handlerCancelarWin: function () {
        this.winEstructura.hide();
    },
    handlerAceptarWin: function () {
        var node = this.pEstructura.tree.getSelectionModel().getSelectedNode();

        var area = this.getAreaByCargo(node);
        var entidad = this.getEntidadByEstructuraNode(node);
        this.loadForm({
            identidad: entidad.id,
            denomentidad: entidad.attributes.denominacion,
            idcargo: node.id,
            idarea: area ? area.id : '',
            denomarea: area ? area.attributes.denominacion : ''
        });

        this.loadPersonaToReserva(node.id, true);

        this.fpGest.getForm().findField(this.fields.tfEntidad.name).ownerCt.setVisible(true);
        this.fpGest.getForm().findField(this.fields.tfCargo.name).setValue(node.attributes.denominacion);
        if (area) {
            this.fpGest.getForm().findField(this.fields.tfArea.name).ownerCt.setVisible(true);
        }
        this.handlerCancelarWin();
    },
    nodeIsCargo: function (n) {
        if (n instanceof Ext.tree.TreeNode) {
            var node = n;

            return parseInt(node.attributes.idconcepto) === 7 || parseInt(node.attributes.idconcepto) === 10 ? true : false;
        } else {
            return false;
        }
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
            //  return false;
            //});
        }
        return organo;
    },
    nodeIsEntidad: function (n) {
        var node = n instanceof Ext.tree.TreeNode ? n : this.vista.pEstructura.tree.getNodeById(n);

        if (Ext.isEmpty(node)) {
            return false;
        }

        if (parseInt(n.attributes.idconcepto) === 3 || parseInt(n.attributes.idtipo) === 3)
            return true;
        else
            return false;
    },
    getEntidadByEstructuraNode: function (n) {
        var identidad = false;
        if (n instanceof Ext.tree.TreeNode) {
            if (this.nodeIsEntidad(n)) {
                return n;
            }
            n.bubble(function (n) {
                if (parseInt(n.attributes.idconcepto) === 3 || parseInt(n.attributes.idtipo) === 3) {
                    identidad = n;
                    return false;
                }
            });
        }
        return identidad;
    },

    loadPersonaToReserva: function (id, force) {
        if (this.stPersonas.baseParams.idestructura !== id || force === true) {
            this.stPersonas.baseParams.idestructura = id;
            this.stPersonas.baseParams.identidad = this.nodeEntidadSeleted.id;
            this.stPersonas.reload();
            this.fields.cbPersonas.enable();
            this.fields.cbPersonas.reset();
        }
    },

    setDatosEstructura: function (nodeSel, isCargo, nodeEntidad) {
        if (nodeSel instanceof Ext.tree.TreeNode) {
            if (this.nodeSelected.id === nodeSel.id) {
                return false;
            }
            this.nodeSelected = nodeSel;
            this.nodeSelChange = true;
        }
        this.nodeEntidadSeleted = nodeEntidad instanceof Ext.tree.TreeNode ? nodeEntidad : this.nodeEntidadSeleted;
        this.btnAdicionar.setDisabled(!nodeEntidad);
    },
    updateListado: function (nodeSel, nodeEntidad) {
        this.loadReserva(this.nodeSelected.id, this.nodeEntidadSeleted.id);
    },
    loadReserva: function (idCargo, idEntidad, reload) {
        if (reload === true) {
            this.nodeSelChange = true;
        }
        if (!this.nodeSelChange)return;

        this.getGrid().getStore().baseParams.idestructura = idCargo || this.nodeSelected.id;
        this.getGrid().getStore().baseParams.identidad = idEntidad || this.nodeEntidadSeleted.id;
        if (reload === true) {
            this.getGrid().getStore().reload({
                scope: this,
                callback: callback
            });
        } else {
            this.getGrid().getStore().load({
                params: {limit: 15, start: 0},
                scope: this,
                callback: callback
            });
        }
        function callback() {
            this.nodeSelChange = false;
        }
    },

    addReserva: function () {
        this.fpGest.show();
        this.btnAplicar.show();
        this.fpGest.setTitle(this.idioma.lb_add_reserva);
    },
    modReserva: function () {
        this.fpGest.show();
        this.btnAplicar.hide();
        this.fpGest.setTitle(this.idioma.lb_mod_reserva);

        var rec = this.smReservaCargo.getSelected();

        this.loadPersonaToReserva(rec.get('idcargo'));

        this.loadForm(rec);
        this.fields.cbPersonas.setRawValue(rec.get('nombreapellidos'));

        this.fpGest.getForm().findField(this.fields.tfEntidad.name).ownerCt.setVisible(true);
        if (rec.get('denomarea')) {
            this.fpGest.getForm().findField(this.fields.tfArea.name).ownerCt.setVisible(true);
        }
    },

    getDataToSend: function () {
        var values = this.fpGest.getForm().getValues();
        var params = {};
        for (var k in values) {
            switch (k) {
                case 'idreservacargo':
                case 'idpersonaentidad':
                case 'fdesde':
                case 'fhasta':
                case 'idcargo':
                    params[k] = values[k];
                    break;
                default :
                    continue;
                    break;
            }
        }
        params.sustituto = values.sustituto == 'on' ? 1 : 0;
        return params;
    },

    handlerGuardar: function (btnPress) {
        if (!this.validarForm())return;
        if (this.fpGest.getForm().isDirty()) {
            var data = this.getDataToSend();
            PVD.mostrarMascara(this.id + 'saveData', this.idioma.lbMsgWait, this.idioma.lbMsgSendData);
            Ext.Ajax.request({
                url: data.idreservacargo ? 'modReservaCargo' : 'addReservaCargo',
                method: 'POST',
                scope: this,
                params: data,
                callback: function (options, success, response) {
                    PVD.ocultarMascara(this.id + 'saveData');
                    var responseData = Ext.decode(response.responseText);
                    this.editando = false;
                    if (responseData.success === true) {
                        var msg = data.idreservacargo == ''
                            ? this.fields.cbPersonas.getRawValue() + ' ha sido asignado como reserva del cargo ' +
                        this.fpGest.getForm().findField(this.fields.tfCargo.name).getValue() + '.'
                            :
                            'La reserva de cargo ha sido modificada satisfactoriamente.';
                        mostrarMensaje(1, msg);
                        if (btnPress.id === this.btnAplicar.id) {
                            this.resetForm();
                            this.loadReserva(null, null, true);
                            this.editando = true;
                        } else {
                            this.hideForm();
                            this.loadReserva(null, null, true);
                        }
                    } else {
                        mostrarMensaje(1, 'Ha ocurrido un error interno.');
                    }
                }
            });
        } else {
            this.hideForm();
        }
    },

    eliminarRegistros: function () {
        mostrarMensaje(2, this.idioma.lb_ConfirRemove, function (btn) {
            if (btn == "ok") {
                var arr = new Array();
                Ext.each(this.smReservaCargo.getSelections(), function (rec) {
                    arr.push(rec.get('idreservacargo'));
                }, this);

                PVD.mostrarMascara(this.id + 'removeData', this.idioma.lbMsgWait, this.idioma.lbMsgRemoving);
                Ext.Ajax.request({
                    url: 'removeReservaCargo',
                    method: 'POST',
                    scope: this,
                    params: {
                        arrIds: Ext.encode(arr)
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara(this.id + 'removeData');
                        responseData = Ext.decode(response.responseText);
                        if (responseData.success === true) {
                            mostrarMensaje(1, this.idioma.lb_MsgRemoveOK);
                            this.getGrid().getStore().reload();
                        }
                    }
                });
            }
        }.createDelegate(this));
    }
});