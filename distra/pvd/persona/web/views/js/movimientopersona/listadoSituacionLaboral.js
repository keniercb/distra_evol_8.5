Ext.ns('Ext.Persona');

Ext.Persona.listadoSituacionLaboralLang = {
    lb_cb_ProcedenciaSocial: 'Procedencia social',
    pListPersonas: 'Listado de personas',
    pListPersonasMov: 'Listado de personas en: ',

    /**
     * Columnas del Grid Listado de persona
     */
    colNoIdentidad: 'No identidad',
    colNombreyApellidos: 'Nombre y apellidos',
    colHistorico: 'Hist&oacute;rico',
    colEntidad: 'Entidad',
    colArea: '&Aacute;rea',
    colCargo: 'Cargo',
    colRuta: 'Ruta',
    colSalario: 'Salario',
    colSituacionLab: 'Situaci&oacute;n laboral',
    colEscala: 'Grupo Escala',
    colFnacimiento: 'Edad',
    lbNombre: 'Nombre',
    lbSnombre: 'Segundo nombre',
    lbPapellido: 'Primer apellido',
    lbSapellido: 'Segundo apellido',
    lbSexo: 'Sexo',
    lbCategoria: 'Categor&iacute;a ocupacional',
    colFechaDesde: 'Desde',
    colFechaHasta: 'Hasta',
    colFalta: 'Fecha alta',
    colFechaBaja: 'Fecha baja',
    colMBaja: 'Motivo baja',

    tlpAceptar: 'Guadar y cerrar',
    btnGuardar: 'Guardar',
    btnAceptar: 'Aceptar',
    tlpAceptar: 'Guadar y cerrar',
    btnCancelar: 'Cancelar',
    tlpCancelar: 'Cerrar formulario',
    btnBaja: 'Baja',
    tlpBaja: 'Dar baja de la entidad',
    btnMovimiento: 'Movimiento',
    tlpMovimiento: 'Hacer un movimiento',

    btnModificar: 'Modificar',
    tlpModificar: 'Modificar situaci&oacute;n',
    btnEliminar: 'Eliminar',
    tlpEliminar: 'Eliminar situaci&oacute;n',
    btnEliminarAll: 'Eliminar todo',
    tlpEliminarAll: 'Eliminar todos los registros',

    lbMsgRemoving: 'Eliminado datos...',
    lbMsgSendData: 'Guardando datos...',
    lbMsgWait: 'Por favor espere...',
    lbMsgBaja: 'Tramitando baja...',
    lbMsgSync: 'Syncronizando datos...',

    lb_ConfirRemove: '¿Est&aacute; seguro que quiere eliminar los registros de la(s) persona(s) seleccionada(s)?',
    lb_ConfirBaja: '¿Est&aacute; seguro que quiere dar baja a la(s) persona(s) seleccionada(s)?',

    lb_CargoCompleto: 'El cargo selecionado no cuenta con capacidad disponible, desea forzar la realizaci&oacute;n de la asociaci&oacute;n',

    lb_MsgBajaOK: 'La(s) persona(s) ha(n) sido dado(s) de baja satisfactoriamente.',

    pListPersonasMov: 'Listado de personas en: '
};

Ext.Persona.listadoSituacionLaboral = Ext.extend(Ext.Panel, {
    idioma: Ext.apply(Ext.Persona.listadoSituacionLaboralLang, this.idioma || {}),
    layout: 'border',
    border: false,
    doingBaja: false,
    doingMod: false,
    doingMov: false,
    forceMov: false,
    nodeSelected: {
        id: null
    },
    nodeEntidadSeleted: {
        id: null
    },

    initComponent: function () {
        this.addEvents('editando', 'baja', 'normal', 'mov');
        this.initGridSA();
        this.initGridMov();

        this.pList = new Ext.Panel({
            region: 'center',
            border: true,
            margins: '0 0 5 0',
            layout: 'card',
            activeItem: 0,
            border: false,
            items: [this.getGridSA(), this.getGridMov()]
        });

        this.items = [this.pList, this.initForm({region: 'south'})];

        Ext.Persona.listadoSituacionLaboral.superclass.initComponent.call(this);
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

    initStoreSA: function (map) {

        var mapping = this.combine([
            {
                name: 'idsituacionlaboralp', type: 'int'
            },
            {
                name: 'idpersonaentidad', type: 'int'
            },
            {
                name: 'idpersona', type: 'int'
            },
            {
                name: 'identidad', type: 'int'
            },
            {
                name: 'idcargo', type: 'int'
            },
            {
                name: 'idarea', type: 'int'
            },
            {
                name: 'denomentidad', mapping: 'entidad'
            },
            {
                name: 'denomarea', mapping: 'area'
            },
            {
                name: 'denomcargo', mapping: 'cargo'
            },
            {
                name: 'falta'
            },
            {
                name: 'fbaja'
            },
            {
                name: 'fdesde'
            },
            {
                name: 'fhasta'
            },
            {
                name: 'ruta'
            },
            {
                name: 'rutaids'
            },
            {
                name: 'salario'
            },
            {
                name: 'categoria'
            },
            {
                name: 'grupocomplejidad'
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
            },
            {
                name: 'idsituacion', type: 'int'
            },
            {
                name: 'asociadocargo', type: 'int'
            },
            {
                name: 'denomsituacion'
            },
            {
                name: 'color'
            },
            {
                name: 'idprocedenciasocial', type: 'int'
            },
            {
                name: 'denomprocedenciasocial'
            },
            {
                name: 'idmotivobaja', type: 'int'
            },
            {
                name: 'denommotivobaja'
            }
        ], map);

        var st = new Ext.data.GroupingStore({
            url: 'getPersonasInCargo',
            reader: new Ext.data.JsonReader({
                totalProperty: "quantity",
                root: "data"
            }, mapping),
            sortInfo: {field: 'idcargo', direction: "ASC"},
            groupField: 'ruta'
        });
        st.on('beforeload', function () {
            if (this.doingBaja || this.doingMod || this.doingMov)
                return false;
            this.smListPersona.clearSelections();
        }, this)
        return st;
    },
    initSATypeofSelectionModel: function () {
        this.smListPersona = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        this.smListPersona.on('selectionchange', this.onSelectChange, this);
        this.smListPersona.on('beforerowselect', function () {
            if (this.fpGest.isVisible()) {
                return false;
            }
        }, this);
    },
    initFieldsToColumns: function () {
        this.cbMotivoBaja = new Ext.ux.form.GroupComboBox({
            fieldLabel: PVD.Persona.NomMotivoBaja.Lang.label,
            mode: 'remote',
            store: new Ext.data.GroupingStore({
                url: '/pvd/persona/index.php/nommotivobaja/getAllLowMotive',
                reader: new Ext.data.JsonReader({
                    totalProperty: 'quantity',
                    root: 'data'
                }, [
                    {name: 'idnomenclador'},
                    {name: 'idmotivobaja'},
                    {name: 'denominacion'},
                    {name: 'agrupador'},

                ]),
                sortInfo: {field: 'denominacion', direction: "DESC"},
                groupField: 'agrupador'
            }),
            typeAhead: false,
            name: 'idmotivobaja',
            triggerAction: 'all',
            displayField: 'denominacion',
            hiddenName: 'idmotivobaja',
            valueField: 'idmotivobaja',
            minChars: 3,
            anchor: '97%',
            allowBlank: false,
            //triggerClass: 'x-form-search-trigger',
            loadingText: 'Cargando...',
            tpl: '<tpl for=".">' +
            '<div class="x-combo-list-item">' +
            '{denominacion} ' +
            '</div>' +
            '</tpl>',
            groupTextTpl: '{gvalue} ({[values.rs.length]} {[values.rs.length > 1 ? "Motivos" : "Motivo"]})',
            startCollapsed: false
        })
    },
    initSAColumnModel: function (cols) {
        this.initSATypeofSelectionModel();
        this.initFieldsToColumns();

        var colModel = this.combine([new Ext.grid.RowNumberer(), this.smListPersona,
            {
                id: this.id + 'colNoIdentidad',
                header: this.idioma.colNoIdentidad,
                sortable: true,
                width: 100,
                dataIndex: 'numid'
            },
            {
                id: this.id + 'colNyA',
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
                header: this.idioma.colSituacionLab,
                sortable: true,
                width: 100,
                dataIndex: 'denomsituacion'
            },
            {
                header: this.idioma.colSalario,
                sortable: true,
                width: 100,
                renderer: function (v) {
                    if (!Ext.isEmpty(v)) {
                        v = (Math.round((v - 0) * 100)) / 100;
                        v = (v == Math.floor(v)) ? v + ".00" : ((v * 10 == Math.floor(v * 10)) ? v + "0" : v);
                        v = String(v);
                        var ps = v.split('.');
                        var whole = ps[0];
                        var sub = ps[1] ? '.' + ps[1] : '.00';
                        var r = /(\d+)(\d{3})/;
                        while (r.test(whole)) {
                            whole = whole.replace(r, '$1' + ',' + '$2');
                        }
                        v = whole + sub;
                        if (v.charAt(0) == '-') {
                            return '-$' + v.substr(1);
                        }
                        return "$" + v;
                    }
                },
                dataIndex: 'salario'
            },
            {
                header: this.idioma.lbCategoria,
                sortable: true,
                width: 150,
                dataIndex: 'categoria'
            },
            {
                header: this.idioma.colEscala,
                sortable: true,
                width: 100,
                align: 'center',
                dataIndex: 'grupocomplejidad'
            },
            {
                id: this.id + 'colfdesde',
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
                id: this.id + 'colfbaja',
                header: this.idioma.colFechaBaja,
                hidden: true,
                hideable: false,
                sortable: true,
                width: 100,
                dataIndex: 'fbaja',
                renderer: Ext.util.Format.dateRenderer('d/m/Y'),
                editor: new Ext.form.DateField({
                    format: 'm/d/Y',
                    allowBlank: false
                })
            },
            {
                id: this.id + 'colMBaja',
                header: this.idioma.colMBaja,
                hidden: true,
                hideable: false,
                sortable: true,
                width: 180,
                dataIndex: 'denommotivobaja',
                editor: this.cbMotivoBaja
            },
            {
                id: this.id + 'colRuta',
                header: this.idioma.colRuta,
                hidden: true,
                hideable: false,
                sortable: true,
                dataIndex: "ruta"
            }
        ], cols);
        return colModel;
    },
    initGridSA: function (grid) {
        var store = this.initStoreSA();
        var colModel = this.initSAColumnModel();

        this.viewListPersona = new Ext.grid.GroupingView({
            enableRowBody: true,
            getRowClass: function (rec, index, rowParams) {
                if (!Ext.isEmpty(rec.get('color'))) {
                    rowParams.tstyle += "color:" + rec.get('color') + ';';
                }
            },
            groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
        });

        var gridConfig = {
            title: this.idioma.pListPersonas,
            columns: colModel,
            clicksToEdit: 1,
            stripeRows: true,
            view: this.viewListPersona,
            store: store,
            autoScroll: true,
            loadMask: {
                store: store
            },
            sm: this.smListPersona,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: store,
                displayInfo: true
            })
        };

        if (!Ext.isEmpty(grid)) {
            Ext.apply(gridConfig, grid);
        }

        this.gpListadoPersona = new Ext.grid.EditorGridPanel(gridConfig);
        this.gridSAEvents();
        return this.gpListadoPersona;
    },
    gridSAEvents: function () {

        this.gpListadoPersona.on('render', function (gp) {
            gp.getStore().load({
                params: {
                    start: 0,
                    limit: 15
                }
            });
        }, this, {delay: 10});

        this.gpListadoPersona.on('beforeedit', function (c) {
            if (c.field === 'fbaja') {
                var field = this.gpListadoPersona.getColumnModel().getCellEditor(c.column, c.row).field;
                field.setMinValue(Date.parseDate(c.record.get('fdesde'), 'd/m/Y'));
                field.setMaxValue(new Date());
            }
        }, this);
        this.gpListadoPersona.on('afteredit', function (c) {
            var field = this.gpListadoPersona.getColumnModel().getCellEditor(c.column, c.row).field;

            if (c.field === 'denommotivobaja') {
                Ext.each(this.smListPersona.getSelections(), function (rec) {
                    rec.set('idmotivobaja', field.getValue());
                    rec.set('denommotivobaja', field.getRawValue());
                }, this);
            } else {
                Ext.each(this.smListPersona.getSelections(), function (rec) {
                    if (new Date().between(Date.parseDate(rec.get('falta'), 'd/m/Y'), field.getValue())) {
                        rec.set('fbaja', field.getValue())
                    }
                }, this);
            }
        }, this);
    },
    getGridSA: function () {
        return this.gpListadoPersona;
    },

    initStoreMov: function (map) {

        var mapping = this.combine([
            {
                name: 'idsituacionlaboralp', type: 'int'
            },
            {
                name: 'idpersonaentidad', type: 'int'
            },
            {
                name: 'idpersona', type: 'int'
            },
            {
                name: 'denomentidad', mapping: 'entidad'
            },
            {
                name: 'denomarea', mapping: 'area'
            },
            {
                name: 'denomcargo', mapping: 'cargo'
            },
            {
                name: 'falta'
            },
            {
                name: 'fbaja'
            },
            {
                name: 'fdesde'
            },
            {
                name: 'fhasta'
            },
            {
                name: 'color'
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
            },
            {
                name: 'denomsituacion'
            },
            {
                name: 'idreservacargo'
            }
        ], map);

        var st = new Ext.data.GroupingStore({
            url: 'getPersonaToMov',
            reader: new Ext.data.JsonReader({
                totalProperty: "quantity",
                root: "data"
            }, mapping),
            sortInfo: {field: 'idreservacargo', direction: "ASC"},
            groupField: 'idreservacargo'
        });
        return st;
    },
    initMovTypeofSelectionModel: function () {
        this.smListPersonaMov = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        this.smListPersonaMov.on('selectionchange', function (sm) {
            var flag = this.validarDisponibilidad(this.nodeSelected, sm.getCount());
            if (sm.getCount() > 0) {
                if (this.forceMov && flag) {
                    this.forceMov = false;
                }
                this.btnGuardar.enable();
            } else {
                this.forceMov = false;
                this.btnGuardar.disable();
            }
        }, this);
    },
    initMovColumnModel: function (cols) {
        this.initMovTypeofSelectionModel();

        var colModel = this.combine([new Ext.grid.RowNumberer(), this.smListPersonaMov,
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
                header: this.idioma.colArea,
                sortable: true,
                width: 150,
                dataIndex: 'denomarea'
            },
            {
                header: this.idioma.colCargo,
                sortable: true,
                width: 150,
                dataIndex: 'denomcargo'
            },
            {
                header: this.idioma.colSituacionLab,
                sortable: true,
                width: 150,
                dataIndex: 'denomsituacion'
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
                header: this.idioma.colFalta,
                sortable: true,
                width: 100,
                dataIndex: 'falta'
            },
            {
                header: this.idioma.colRuta,
                hidden: true,
                hideable: false,
                sortable: true,
                dataIndex: "idreservacargo",
                renderer: function (v) {
                    return Ext.isEmpty(v) ? 'Personas de la entidad' : 'Reservas del cargo';
                }
            }], cols);
        return colModel;
    },
    initGridMov: function (grid) {
        var store = this.initStoreMov();
        var colModel = this.initMovColumnModel();

        this.viewListPersonaMov = new Ext.grid.GroupingView({
            enableRowBody: true,
            getRowClass: function (rec, index, rowParams) {
                if (!Ext.isEmpty(rec.get('color'))) {
                    rowParams.tstyle += "color:" + rec.get('color') + ';';
                }
            },
            groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
        });

        var gridConfig = {
            title: this.idioma.pListPersonasMov,
            columns: colModel,
            stripeRows: true,
            view: this.viewListPersonaMov,
            store: store,
            loadMask: {
                store: store
            },
            sm: this.smListPersonaMov,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: store,
                displayInfo: true
            })
        };

        if (!Ext.isEmpty(grid)) {
            Ext.apply(gridConfig, grid);
        }
        this.gpListadoPersonaMov = new Ext.grid.GridPanel(gridConfig);
        this.gridMovEvents();
        return this.gpListadoPersonaMov;
    },
    gridMovEvents: function () {
        this.smListPersonaMov.on('beforerowselect', function (sm) {
            if (this.validarDisponibilidad(this.nodeSelected, sm.getCount() + 1) || this.forceMov) {
                return true;
            } else {
                mostrarMensaje(2, this.idioma.lb_CargoCompleto, function (btn) {
                    this.forceMov = (btn == 'ok') ? true : false;
                }.createDelegate(this));
                return this.forceMov;
            }
        }, this);
    },
    getGridMov: function () {
        return this.gpListadoPersonaMov;
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

        this.fields.forceCargo = new Ext.form.Checkbox({
            hideLabel: true,
            hidden: true,
            boxLabel: 'Forzar asignaci&oacute;n',
            name: 'force'
        });

        this.fields.cbSituacionLaboral.listeners = {
            selectNode: function (node) {
                this.loadForm({
                    idsituacion: node.id,
                    asociadocargo: node.attributes.asociadocargo
                });
            }.createDelegate(this)
        };

        this.initPanelEstructura();

        this.fields.tfCargo.onTriggerClick = function () {
            this.showWinEstructura();
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

        this.btnCancelar = new Ext.Button({
            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'btn',
            scope: this,
            text: this.idioma.btnCancelar,
            tooltip: this.idioma.tlpCancelar,
            handler: this.cancelarHandler
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
                columnWidth: .5,
                layout: 'form',
                items: [this.fields.cbProcedenciaSocial]
            },
            {
                columnWidth: .5,
                layout: 'form',
                items: [this.fields.forceCargo]
            }
        ], i);

        var buttons = this.combine([this.btnCancelar, this.btnGuardar], b);

        var config = {
            title: 'undefined',
            frame: true,
            hidden: true,
            border: false,
            bodyStyle: 'padding: 5px 5px 0',
            height: 225,
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
            this.fields.cbProcedenciaSocial.ownerCt.setVisible(this.doingMod);
            this.resetForm();
            this.doLayout();
            this.fireEvent('editando', this.smListPersona.getSelections());
        }, this);

        return this.fpGest;
    },
    loadForm: function (record) {
        var rec = (record instanceof Ext.data.Record)
            ? record
            : new Ext.data.Record(record);
        this.fpGest.getForm().loadRecord(rec);

        var asociadocargo = this.fpGest.getForm().findField('asociadocargo').getValue();
        this.fields.forceCargo.setVisible(this.doingMov);
        this.fpGest.getForm().findField(this.fields.tfArea.name).ownerCt.setVisible(asociadocargo === '1');
        this.fpGest.getForm().findField(this.fields.tfCargo.name).ownerCt.setVisible(asociadocargo === '1');
        this.fpGest.getForm().findField(this.fields.tfCargo.name).allowBlank = (asociadocargo === '1') ? false : true;

        this.fpGest.doLayout();
    },
    hideForm: function () {
        this.btnGuardar.setDisabled(false);
        this.fpGest.hide();
        this.doLayout();

        this.doingBaja = false;
        this.doingMod = false;
        this.doingMov = false;
        this.forceMov = false;
    },
    resetForm: function () {
        this.fpGest.getForm().reset();

        this.fpGest.getForm().findField(this.fields.dfDesde.name).setMaxValue(new Date().format('d/m/Y'));

        this.fpGest.getForm().findField(this.fields.dfDesde.name).setMinValue(Date.parseDate('1959', 'd/m/Y'));
        this.fpGest.getForm().findField(this.fields.cbSituacionLaboral.name).baseParams = {asociadocargo: 0};
        this.fpGest.getForm().findField(this.fields.cbSituacionLaboral.name).onTrigger1Click();
        this.fpGest.getForm().findField(this.fields.tfCargo.name).trigger.show();
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
            if (this.nodeIsCargo(node)) {
                var flag = false;
                var record;
                var c = this.smListPersona.getCount();
                Ext.each(this.smListPersona.getSelections(), function (rec) {
                    if (rec.get('idcargo') == node.id) {
                        flag = true;
                        record = rec;
                        return false;
                    }
                }, this);
                if (flag && this.doingMov) {
                    var msgSexo = (record.get('sexo') === 0) ? 'nombrada' : 'nombrado';
                    mostrarMensaje(2, record.get('nombreapellidos') + ' ya est&aacute; ' + msgSexo + ' en el cargo seleccionado.');
                    return false;
                }
                if (this.validarDisponibilidad(node, c) || flag) {
                    this.btnAceptarWin.enable();
                } else {
                    mostrarMensaje(2, this.idioma.lb_CargoCompleto, function (btn) {
                        if (btn == 'ok') {
                            this.btnAceptarWin.enable();
                            return true;
                        } else {
                            this.btnAceptarWin.disable();
                            return false;
                        }
                    }.createDelegate(this));
                }
            }
        }, this);

        this.winEstructura = new Ext.Window({
            title: this.idioma.pEstructura,
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            items: [this.pEstructura],
            buttons: [this.btnCancelWin, this.btnAceptarWin]
        });
    },
    loadEstructura: function (id) {
        this.pEstructura.inicial = id || null;
        this.pEstructura.tree.getLoader().load(this.pEstructura.tree.getRootNode(), function () {
            this.pEstructura.tree.getRootNode().expand(false, true, function (root) {
                this.pEstructura.tree.getSelectionModel().select(root.firstChild);
            }.createDelegate(this));
        }.createDelegate(this));
    },
    showWinEstructura: function () {
        this.winEstructura.show();
        this.loadEstructura(this.fpGest.getForm().findField('identidad').getValue());
    },
    handlerCancelarWin: function () {
        this.winEstructura.hide();
    },
    handlerAceptarWin: function () {
        var node = this.pEstructura.tree.getSelectionModel().getSelectedNode();

        var area = this.getAreaByCargo(node);
        this.loadForm({
            idcargo: node.id,
            denomcargo: node.attributes.denominacion,
            idarea: area ? area.id : '',
            denomarea: area ? area.attributes.denominacion : ''
        });
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

    cancelarHandler: function () {
        this.hideForm();
        this.pList.getLayout().setActiveItem(0);
        this.fireEvent('normal', this.pList.getLayout().activeItem);
    },
    getButtons: function () {

        this.btnMovCargo = new Ext.menu.Item({
            disabled: true,
            text: 'al cargo',
            tooltip: this.idioma.tlpMovimiento,
            iconCls: 'btn',
            icon: perfil.dirImg + 'intercambiar.png',
            iconCls: 'btn',
            scope: this,
            handler: this.movCargosHandler
        });

        this.btnMovPersona = new Ext.menu.Item({
            disabled: true,
            text: 'a la persona',
            tooltip: this.idioma.tlpMovimiento,
            iconCls: 'btn',
            icon: perfil.dirImg + 'usuarioactivo.png',
            scope: this,
            handler: this.movPersonaHandler
        });

        this.Movimiento = new Ext.Button({
            iconCls: 'btn',
            icon: perfil.dirImg + 'cambiar.png',
            menu: new Ext.menu.Menu({
                items: [this.btnMovPersona, this.btnMovCargo]
            }),
            text: this.idioma.btnMovimiento
        });

        this.btnBaja = new Ext.Button({
            disabled: true,
            text: this.idioma.btnBaja,
            tooltip: this.idioma.tlpBaja,
            iconCls: 'btn',
            icon: perfil.dirImg + 'salir.png',
            scope: this,
            handler: this.bajaHandler
        });

        this.btnModificar = new Ext.Button({
            disabled: true,
            text: this.idioma.btnModificar,
            tooltip: this.idioma.tlpModificar,
            iconCls: 'btn',
            icon: perfil.dirImg + 'modificar.png',
            scope: this,
            handler: this.modificarHandler
        });

        this.btnEliminarAll = new Ext.menu.Item({
            text: this.idioma.btnEliminarAll,
            tooltip: this.idioma.tlpEliminarAll,
            iconCls: 'btn',
            scope: this,
            handler: this.eliminarRegistros
        });

        this.btnEliminar = new Ext.Toolbar.MenuButton({
            disabled: true,
            text: this.idioma.btnEliminar,
            tooltip: this.idioma.tlpEliminar,
            iconCls: 'btn',
            icon: perfil.dirImg + 'eliminar.png',
            menu: {items: [this.btnEliminarAll]},
            scope: this,
            handler: this.eliminarRegistros
        });

        this.btnCancelBaja = new Ext.Button({
            hidden: true,
            icon: perfil.dirImg + 'arriba.png',
            iconCls: 'btn',
            text: this.idioma.btnCancelar,
            tooltip: this.idioma.tlpCancelar,
            scope: this,
            handler: this.cancelarBajaHandler
        });

        this.btnSaveBaja = new Ext.Button({
            hidden: true,
            icon: perfil.dirImg + 'abajo.png',
            iconCls: 'btn',
            text: this.idioma.btnGuardar,
            tooltip: this.idioma.tlpGuardar,
            scope: this,
            handler: this.handlerSaveBaja
        });

        return {
            1: this.Movimiento,
            2: this.btnBaja,
            3: '-',
            4: this.btnModificar,
            5: this.btnEliminar,
            6: this.btnCancelBaja,
            7: this.btnSaveBaja
        };
    },
    setVisibleAllButtons: function (flag, clearSelect) {
        this.Movimiento.setVisible(flag);
        this.btnBaja.setVisible(flag);
        this.btnModificar.setVisible(flag);
        this.btnEliminar.setVisible(flag);
        var clear = clearSelect || false;
        if (clear)
            this.smListPersona.clearSelections();
    },

    onSelectChange: function (sm) {
        this.btnBaja.setDisabled(sm.getCount() < 1);
        this.btnEliminar.setDisabled(sm.getCount() < 1);
        this.btnEliminarAll.setDisabled(sm.getCount() < 1);
        if (sm.getCount() === 1) {
            this.btnModificar.setDisabled(Ext.isEmpty(sm.getSelected().get('idsituacionlaboralp')));
        } else {
            this.btnModificar.setDisabled(true);
        }
        //this.Movimiento.setDisabled(sm.getCount() < 1);
        this.activarBtnMovimiento();
    },

    eliminarRegistros: function (btnPress) {
        mostrarMensaje(2, this.idioma.lb_ConfirRemove, function (btn) {
            if (btn == "ok") {
                var flag = btnPress.id === this.btnEliminarAll.id ? true : false;
                var arr = new Array();
                Ext.each(this.smListPersona.getSelections(), function (rec) {
                    if (flag === true) {
                        arr.push(rec.get('idpersonaentidad'));
                    } else {
                        arr.push(rec.get('idsituacionlaboralp'));
                    }
                }, this);

                PVD.mostrarMascara(this.id + 'removeData', this.idioma.lbMsgWait, this.idioma.lbMsgRemoving);
                Ext.Ajax.request({
                    url: 'removeRegister',
                    method: 'POST',
                    scope: this,
                    params: {
                        arrIds: Ext.encode(arr),
                        all: flag
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara(this.id + 'removeData');
                        responseData = Ext.decode(response.responseText);
                        if (responseData.success === true) {
                            mostrarMensaje(1, this.idioma.lb_MsgRemoveOK);
                            this.getGridSA().getStore().reload();
                            if (this.nodeEntidadSeleted instanceof Ext.tree.TreeNode) {
                                if (Ext.isFunction(this.nodeEntidadSeleted.reload)) {
                                    this.nodeEntidadSeleted.reload();
                                } else {
                                    this.nodeEntidadSeleted.parentNode.reload();
                                }
                            }
                        }
                    }
                });
            }
        }.createDelegate(this));
    },
    loadData: function (idEstruc, idEntidad, reload) {
        if (this.doingBaja || this.doingMod || this.doingMov)
            return;

        this.nodeSelected = idEstruc instanceof Ext.tree.TreeNode ? idEstruc : this.nodeSelected;
        this.nodeEntidadSeleted = idEntidad instanceof Ext.tree.TreeNode ? idEntidad : this.nodeEntidadSeleted;
        this.getGridSA().getStore().baseParams.idestructura = this.nodeSelected.id || null;
        this.getGridSA().getStore().baseParams.identidad = this.nodeEntidadSeleted.id || null;

        this.activarBtnMovimiento();

        if (reload === true) {
            this.getGridSA().getStore().reload({
                scope: this
            });
        } else {
            this.getGridSA().getStore().load({
                params: {limit: 15, start: 0},
                scope: this
            });
        }
    },

    activarBtnMovimiento: function () {
        this.btnMovPersona.setDisabled(this.smListPersona.getCount() < 1);
        this.btnMovCargo.setDisabled(!this.nodeIsCargo(this.nodeSelected));
    },

    bajaHandler: function () {
        this.doingBaja = true;
        this.fireEvent('baja', this);
        var data = this.smListPersona.getSelections();

        this.gpListadoPersona.getBottomToolbar().hide();
        this.gpListadoPersona.getStore().filterBy(function (rec) {
            if ((data.indexOf(rec)) !== -1) {
                return true;
            }
        }, this);

        this.gpListadoPersona.getColumnModel().getColumnsBy(function (col, index) {
            switch (col.id) {
                case this.id + 'colNoIdentidad':
                case this.id + 'colNyA':
                case this.id + 'colfbaja':
                case this.id + 'colMBaja':
                case this.smListPersona.id:
                    this.gpListadoPersona.getColumnModel().setHidden(index, false);
                    break;
                default :
                    this.gpListadoPersona.getColumnModel().setHidden(index, true);
                    break;
            }
        }, this);

        this.gpListadoPersona.startEditing(0, this.gpListadoPersona.getColumnModel().findColumnIndex('fbaja'));

        this.btnCancelBaja.show();
        this.btnSaveBaja.show();
    },
    cancelarBajaHandler: function () {
        this.doingBaja = false;
        this.fireEvent('normal', this.pList.getLayout().activeItem);
        this.gpListadoPersona.getStore().clearFilter();
        this.gpListadoPersona.getStore().rejectChanges();
        this.gpListadoPersona.getBottomToolbar().show();

        this.gpListadoPersona.getColumnModel().getColumnsBy(function (col, index) {
            switch (col.id) {
                case this.id + 'colfbaja':
                case this.id + 'colMBaja':
                case this.id + 'colRuta':
                    this.gpListadoPersona.getColumnModel().setHidden(index, true);
                    break;
                default :
                    this.gpListadoPersona.getColumnModel().setHidden(index, false);
                    break;
            }
        }, this);
        this.btnCancelBaja.hide();
        this.btnSaveBaja.hide();
    },
    handlerSaveBaja: function () {
        mostrarMensaje(2, this.idioma.lb_ConfirBaja, function (btn) {
            if (btn == "ok") {
                var arr = new Array();
                Ext.each(this.gpListadoPersona.getStore().getRange(), function (rec) {
                    if (Ext.isEmpty(rec.get('fbaja')) || Ext.isEmpty(rec.get('idmotivobaja'))) {
                        arr = new Array();
                        return false;
                    }
                    arr.push({
                        idpersonaentidad: rec.get('idpersonaentidad'),
                        fbaja: rec.get('fbaja').format('d/m/Y'),
                        idmotivobaja: rec.get('idmotivobaja')
                    });
                }, this);
                if (arr.length > 0) {
                    PVD.mostrarMascara(this.id + 'baja', this.idioma.lbMsgWait, this.idioma.lbMsgBaja);
                    Ext.Ajax.request({
                        url: 'darBaja',
                        method: 'POST',
                        scope: this,
                        params: {
                            arrIds: Ext.encode(arr)
                        },
                        callback: function (options, success, response) {
                            PVD.ocultarMascara(this.id + 'baja');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.success === true) {
                                mostrarMensaje(1, this.idioma.lb_MsgBajaOK);
                                this.cancelarBajaHandler();
                                this.gpListadoPersona.getStore().reload();
                            }
                        }
                    });
                } else {
                    mostrarMensaje(3, this.idioma.lb_MsgBajaDataIncompleta);
                }
            }
        }.createDelegate(this));
    },

    modificarHandler: function () {
        this.doingMod = true;
        this.fpGest.show();
        this.fpGest.setTitle('Modificando');

        var rec = this.smListPersona.getSelected();
        this.loadForm(rec);
        this.fpGest.getForm().findField(this.fields.dfDesde.name).setMaxValue(new Date());
        this.fields.cbProcedenciaSocial.setValue(rec.get('idprocedenciasocial'));
        this.fields.cbProcedenciaSocial.setRawValue(rec.get('denomprocedenciasocial'));
        this.fields.forceCargo.setVisible(false);

        /*this.fpGest.getForm().findField(this.fields.dfDesde.name).setMinValue(rec.get('fhasta')
         ? Date.parseDate(rec.get('fhasta'), 'd/m/Y')
         : Date.parseDate(rec.get('fdesde'), 'd/m/Y'));*/

    },
    movPersonaHandler: function () {

        var records = this.smListPersona.getSelections();
        var identidad = records[0].get('identidad');

        var flagExit = false;
        Ext.each(records, function (rec) {
            if (identidad !== rec.get('identidad')) {
                flagExit = true;
                return false;
            }
        }, this);

        if (flagExit === true) {
            mostrarMensaje(3, 'Debe seleccionar personas de una misma entidad');
            return;
        } else {
            this.doingMov = true;
            this.fpGest.show();
            this.fpGest.setTitle('Gestionando movimiento');
        }
        this.loadForm({
            identidad: identidad,
            denomentidad: records[0].get('denomentidad')
        });

        this.fpGest.getForm().findField(this.fields.dfDesde.name).setValue(new Date().format('d/m/Y'));
        this.fpGest.getForm().findField(this.fields.dfDesde.name).setMinValue(records[0].get('fhasta')
            ? Date.parseDate(records[0].get('fhasta'), 'd/m/Y')
            : Date.parseDate(records[0].get('fdesde'), 'd/m/Y'));
    },
    movCargosHandler: function () {
        this.doingMov = true;
        this.fpGest.show();
        this.btnGuardar.setDisabled(true);
        this.fpGest.setTitle('Moviendo personas al cargo: ' + this.nodeSelected.attributes.denominacion + ' Vancantes: ' + this.getDisponibilidad(this.nodeSelected));
        this.pList.getLayout().setActiveItem(1);

        var area = this.getAreaByCargo(this.nodeSelected);

        this.loadForm({
            asociadocargo: 1,
            identidad: this.nodeEntidadSeleted.id,
            denomentidad: this.nodeEntidadSeleted.attributes.denominacion,
            idcargo: this.nodeSelected.id,
            denomcargo: this.nodeSelected.attributes.denominacion,
            idarea: area ? area.id : '',
            denomarea: area ? area.attributes.denominacion : ''
        });
        this.getGridMov().setTitle(this.idioma.pListPersonasMov + this.nodeEntidadSeleted.attributes.denominacion);

        this.getGridMov().getStore().baseParams.identidad = this.nodeEntidadSeleted.id;
        this.getGridMov().getStore().baseParams.idestructura = this.nodeSelected.id;
        this.getGridMov().getStore().load({
            params: {
                start: 0,
                limit: 15
            }
        });

        this.fpGest.getForm().findField(this.fields.cbSituacionLaboral.name).baseParams = {asociadocargo: 1};
        this.fpGest.getForm().findField(this.fields.cbSituacionLaboral.name).onTrigger1Click();
        this.fpGest.getForm().findField(this.fields.tfCargo.name).trigger.hide();
        this.fireEvent('mov', this.getGridMov());
    },

    getDataToSend: function () {
        var params = {
            idsituacionlaboralp: [],
            idpersonaentidad: []
        };

        var selection = this.pList.getLayout().activeItem.getSelectionModel().getSelections();
        var values = this.fpGest.getForm().getValues();
        var force = values.force == 'on' ? true : false;

        Ext.each(selection, function (rec) {
            if (!Ext.isEmpty(rec.get('idsituacionlaboralp')) && !force) {
                params.idsituacionlaboralp.push(rec.get('idsituacionlaboralp'));
            }
            params.idpersonaentidad.push(rec.get('idpersonaentidad'));
        }, this);
        params.idsituacionlaboralp = Ext.encode(params.idsituacionlaboralp);
        params.idpersonaentidad = Ext.encode(params.idpersonaentidad);

        for (var k in values) {
            switch (k) {
                case 'idsituacion':
                case 'fdesde':
                case 'fhasta':
                    params[k] = values[k];
                    break;
                case 'denomcargo':
                    params.cargo = (values['asociadocargo'] === '1') ? values[k] : null;
                    break;
                case 'idcargo':
                    params[k] = (values['asociadocargo'] === '1') ? values[k] : null;
                    break;
                case 'denomarea':
                    params.area = (values['asociadocargo'] === '1') ? values[k] : null;
                    break;
                case 'idarea':
                    params[k] = (values['asociadocargo'] === '1') ? values[k] : null;
                    break;
                case 'idprocedenciasocial':
                    if (this.doingMod)
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
                url: this.doingMov ? 'movimientoCargo' : 'modificarSituacionLaboralPersona',
                method: 'POST',
                scope: this,
                params: this.getDataToSend(),
                callback: function (options, success, response) {
                    PVD.ocultarMascara(this.id + 'saveData');
                    responseData = Ext.decode(response.responseText);
                    if (responseData.success === true) {
                        var msg = this.doingMov
                            ? 'La(s) persona(s) ha(n) sido movida(s) satisfactoriamente.'
                            : 'La persona seleccionada ha sido modificada satisfactoriamente.';
                        mostrarMensaje(1, msg);
                        this.cancelarHandler();
                        this.loadData(this.nodeEntidadSeleted.id, true);

                        if (this.nodeEntidadSeleted instanceof Ext.tree.TreeNode) {
                            if (Ext.isFunction(this.nodeEntidadSeleted.reload)) {
                                this.nodeEntidadSeleted.reload();
                            } else {
                                this.nodeEntidadSeleted.parentNode.reload();
                            }
                        }
                    }
                }
            });
        }
    }
});