Ext.ns('Ext.Persona');

Ext.Persona.trayectoriaLaboralLang = {
    pListPersonasHist: 'Hist&oacute;rico',
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

    lb_FechaDesde: 'Desde',
    lb_FechaFin: 'Hasta',
    lb_FechaAlta: 'Fecha alta',
    lb_FechaBaja: 'Fecha baja',
    lb_fs_MotivoBaja: 'Motivo de baja'
};

Ext.Persona.trayectoriaLaboral = Ext.extend(Ext.Panel, {
    idioma: Ext.apply(Ext.Persona.trayectoriaLaboralLang, this.idioma || {}),
    layout: 'border',
    border: false,
    nodeSelected: {
        id: null
    },
    nodeEntidadSeleted: {
        id: null
    },
    initComponent: function () {
        this.advancedSearch();
        this.title = this.idioma.pListPersonasHist;

        this.items = [this.initGrid(), this.initForm({region: 'south'}), this.fpAdvancedSearch];
        Ext.Persona.trayectoriaLaboral.superclass.initComponent.call(this);
        this.bindStore(this.getGrid().getStore());
        this.on('show', function () {
            this.getGrid().getStore().reload();
        }, this)
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
                name: 'idsituacionlaboralp', type: 'int', mapping: 'dme_idsituacionlaboralp'
            },
            {
                name: 'idpersonaentidad', type: 'int', mapping: 'dpen_idpersonaentidad'
            },
            {
                name: 'idpersona', type: 'int', mapping: 'dp_idpersona'
            },
            {
                name: 'identidad', type: 'int', mapping: 'dpen_identidad'
            },
            {
                name: 'idcargo', type: 'int', mapping: 'dme_idcargo'
            },
            {
                name: 'idarea', type: 'int', mapping: 'dme_idarea'
            },
            {
                name: 'denomentidad', mapping: 'dpen_entidad'
            },
            {
                name: 'denomarea', mapping: 'dme_area'
            },
            {
                name: 'denomcargo', mapping: 'dme_cargo'
            },
            {
                name: 'falta', mapping: 'dpen_fdesde'
            },
            {
                name: 'fbaja', mapping: 'dpen_fhasta'
            },
            {
                name: 'fdesde', mapping: 'dme_fdesde'
            },
            {
                name: 'fhasta', mapping: 'dme_fhasta'
            },
            {
                name: 'numid', mapping: 'dpident_numid'
            },
            {
                name: 'nombreapellidos', mapping: 'dp_nombreapellidos'
            },
            {
                name: 'sexo', type: 'int', mapping: 'dp_sexo'
            },
            {
                name: 'foto', mapping: 'dpfot_foto'
            },
            {
                name: 'idsituacion', type: 'int'
            },
            {
                name: 'denomsituacion', mapping: 'ns_denominacion'
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
                name: 'denommotivobaja', mapping: 'nmb_denominacion'
            }
        ], map);

        this.st = new Ext.data.GroupingStore({
            url: 'getHistorico',
            baseParams: {
                limit: 15,
                start: 0
            },
            reader: new Ext.data.JsonReader({
                totalProperty: "quantity",
                root: "data"
            }, mapping),
            sortInfo: {field: 'idpersona', direction: "DESC"},
            groupField: 'idpersona'
        });

        return this.st;
    },
    initTypeofSelectionModel: function () {
        this.smListPersonaHist = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        /*this.smListadoPersonaAlta.on('selectionchange', this.onSelectChange, this);
         this.smListadoPersonaAlta.on('beforerowselect', function () {
         if (this.fpGest.isVisible()) {
         return false;
         }
         }, this);*/
    },
    initColumnModel: function (cols) {
        this.initTypeofSelectionModel();

        this.colModel = this.combine([new Ext.grid.RowNumberer(), this.smListPersonaHist,
            {
                header: this.idioma.colNoIdentidad,
                sortable: true,
                width: 100,
                dataIndex: 'numid'
            },
            {
                header: this.idioma.colNombreyApellidos,
                hidden: true,
                hideable: false,
                sortable: true,
                width: 250,
                dataIndex: 'nombreapellidos'
            },
            {
                header: this.idioma.colEntidad,
                sortable: true,
                width: 150,
                dataIndex: 'denomentidad'
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
                width: 120,
                dataIndex: 'denomsituacion'
            },
            {
                id: this.id + 'colfdesde',
                header: this.idioma.lb_FechaDesde,
                sortable: true,
                width: 100,
                dataIndex: 'fdesde'
            },
            {
                header: this.idioma.lb_FechaFin,
                sortable: true,
                width: 100,
                dataIndex: 'fhasta'
            },
            {
                header: this.idioma.lb_FechaAlta,
                sortable: true,
                hidden: true,
                width: 100,
                dataIndex: 'falta'
            },
            {
                header: this.idioma.lb_FechaBaja,
                hidden: true,
                sortable: true,
                width: 100,
                dataIndex: 'fbaja'
            },
            {
                header: this.idioma.lb_fs_MotivoBaja,
                hidden: true,
                sortable: true,
                width: 180,
                dataIndex: 'denommotivobaja'
            },
            {
                hidden: true,
                hideable: false,
                sortable: true,
                width: 180,
                dataIndex: 'idpersona',
                renderer: function (v, meta, rec) {
                    var gText = rec.get('nombreapellidos') + '---<span style="color:green;">Fecha alta: ' + rec.get('falta') + '</span>';
                    if (!Ext.isEmpty(rec.get('fbaja'))) {
                        gText = gText + '---<span style="color:red;">Fecha baja: ' + rec.get('fbaja') + '</span>';
                    }
                    if (!Ext.isEmpty(rec.get('denommotivobaja'))) {
                        gText = gText + '---<span style="color:red;">Motivo baja: ' + rec.get('denommotivobaja') + '</span>';
                    }
                    return gText;
                }
            }
        ], cols);
        return this.colModel;
    },
    initGrid: function (grid) {
        var store = this.initStore();
        var colModel = this.initColumnModel();

        /**
         * View del Grid de ListPersona
         * @type {Ext.grid.GroupingView}
         */
        this.viewListPersonaHist = new Ext.grid.GroupingView({
            enableRowBody: true,
            groupTextTpl: '{group}'
        });

        var gridConfig = {
            store: store,
            region: 'center',
            loadMask: {
                store: store
            },
            margins: '0 0 5 0',
            columns: colModel,
            view: this.viewListPersonaHist,
            sm: this.smListPersonaHist,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: store,
                displayInfo: true
            })
        };

        gridConfig.tbar = this.fpAdvancedSearch.getFastSearch([]);

        if (!Ext.isEmpty(grid)) {
            Ext.apply(gridConfig, grid);
        }

        this.gpListPersonaHist = new Ext.grid.GridPanel(gridConfig);

        return this.gpListPersonaHist;
    },
    getGrid: function () {
        return this.gpListPersonaHist;
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
                columnWidth: .5,
                layout: 'form',
                items: [this.fields.cbProcedenciaSocial]
            }
        ], i);

        var buttons = this.combine([this.btnCancelar, this.btnGuardar], b);

        var config = {
            frame: true,
            hidden: true,
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
        this.fpGest.on('show', this.doLayout, this);
        this.fpGest.on('beforeshow', function () {
            this.btnDarAlta.setDisabled(true);
            return this.updateAreayCargo();
        }, this);

        return this.fpGest;
    },
    loadForm: function (record) {
        var rec = (record instanceof Ext.data.Record)
            ? record
            : new Ext.data.Record(record);
        this.fpGest.getForm().loadRecord(rec);

        /*this.vista.tfEntidad.ownerCt.setVisible(!Ext.isEmpty(rec.get('identidad')));
         this.vista.tfArea.ownerCt.setVisible(!Ext.isEmpty(rec.get('idarea')));
         this.vista.tfCargo.ownerCt.setVisible(!Ext.isEmpty(rec.get('idcargo')));*/

        //this.vista.cbProcedenciaSocial.setValue(rec.get('idprocedenciasocial'));
        //this.vista.cbProcedenciaSocial.setRawValue(rec.get('denomprocedenciasocial'));
    },
    hideForm: function () {
        this.fpGest.hide();
        this.resetForm();
        this.btnDarAlta.setDisabled(false);
        this.doLayout();
    },
    resetForm: function () {
        this.fpGest.getForm().reset();
        this.fpGest.getForm().findField(this.fields.dfDesde.name).setMaxValue(new Date());
    },
    validarForm: function () {
        return this.fpGest.getForm().isValid();
    },

    updateListado: function (nodeSel, nodeEntidad) {
        if (nodeSel instanceof Ext.tree.TreeNode) {
            if (this.nodeSelected.id === nodeSel.id) {
                return false;
            }
            this.nodeSelected = nodeSel;
        }
        this.nodeEntidadSeleted = nodeEntidad instanceof Ext.tree.TreeNode ? nodeEntidad : this.nodeEntidadSeleted;
        this.loadTrayectoria(this.nodeSelected.id, this.nodeEntidadSeleted.id);
    },
    loadTrayectoria: function (idCargo, idEntidad, reload) {

        this.getGrid().getStore().baseParams.idestructura = idCargo || null;
        this.getGrid().getStore().baseParams.identidad = idEntidad || null;
        if (reload === true) {
            this.getGrid().getStore().reload({
                scope: this
            });
        } else {
            this.getGrid().getStore().load({
                params: {limit: 15, start: 0},
                scope: this
            });
        }
    }
});