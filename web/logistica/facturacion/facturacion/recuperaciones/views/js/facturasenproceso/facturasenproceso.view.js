Ext.ns('Ext.erp.facturasenproceso');
Ext.erp.facturasenproceso = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        config.idioma = LOG.util.UIManager.apply(LOG.fac.Recuperaciones.Idioma, log.fac.facturasenproceso.Idioma);
        config.dirController = '/logistica/facturacion/facturacion/recuperaciones/index.php/facturasenproceso';
        config.urlBusquedaGridPrincipal = 'getFacturas';
        config.modoSeleccion = 1;
        config.busquedaBasica = true;
        config.autoLoad = false;
        config.formaVisualizacion = 'panel';
        config.busquedaAvanzada=true;
        config.concepto = config.idioma.documentos;
        config.textBusquedaSimple = config.idioma.txtBusquedaSimple;
        Ext.erp.facturasenproceso.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({dataIndex: 'iddocumento'});
        this.addGridColumn({
            header: this.idioma.cgTipo,
            width: 200,
            dataIndex: 'tipodocumento',
            default: true,
            autoExpand: true
        });
        this.addGridColumn({
            header: this.idioma.cgNumDocumento,
            width: 120,
            dataIndex: 'nrodoc',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgNoContrato,
            width: 90,
            dataIndex: 'contrato',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgEstado,
            width: 90,
            dataIndex: 'estado',
            default: true,
            renderer: function(v) {
                return LOG.lb.documento.Estado[v];
            }
        });
        this.addGridColumn({
            header: this.idioma.cgFechaCreacion,
            width: 120,
            dataIndex: 'fechacontable',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCreadoPor,
            width: 120,
            dataIndex: 'usuario',
            default: true
        });
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(new LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            handler: function() {
                _this.getReportes(_this);
            }
        }));
        this.addToolbarButton("->");
        this.addToolbarButton(new LOG.util.Prototipos.botonAyuda({id:'idDocEnProceso'}));
    },
    view:function() {
        var _this= this;
        _this.getPanelBusqueda().setColumns(1);
        var clsGeneral = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        var cls = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.cmbUsuarios = new LOG.lb.documento.ComboUsuarios({
            fieldLabel: this.idioma.lbCbCreadoPor,
            campo: 'idusuario',
            alias: 'aperturaLog',
            subsistema: 10,
            hiddenName: 'idusuario'
        });
        this.cmbEstado = new LOG.util.ComboBox({
            name: 'estado',
            fieldLabel: this.idioma.lbCbEstado,
            mode: 'local',
            forceSelection:true,
            valueField: 'idestado',
            displayField: 'estado',
            store:  new Ext.data.SimpleStore({
                fields: ['idestado','estado'],
                data: [
                    [ 1,this.idioma.textCbEdicion],
                    [ 2,this.idioma.textCbPendiente]
                ]}),
            width: 200
        });
        this.cmbTipoDocumento = new LOG.lb.documento.ComboTipoDocumento({
            fieldLabel: this.idioma.lbCbTipo,
            subsistema: 13,
            hiddenName: 'iddoc'
        });
        var fsRangoFecha = new Ext.form.FieldSet({
            title: this.idioma.fsRangoFecha
        });
        var clsRangoFecha = LOG.util.UIManager.initColumnForm(2);
        this.dfDesde = new Ext.form.DateField({
            fieldLabel: this.idioma.dfDesdeDoc,
            name: 'initialDate',
            xtype: 'datefield',
            vtype: 'daterange',
            endDateField: 'endDate',
            editable: false
        });
        this.dfHasta = new Ext.form.DateField({
            fieldLabel: this.idioma.dfHastaDoc,
            name: 'endDate',
            xtype: 'datefield',
            vtype: 'daterange',
            startDateField: 'initialDate',
            editable: false
        });
        this.dfDesde.endDateField = this.dfHasta.id;
        this.dfHasta.startDateField = this.dfDesde.id;
        cls.addComponent(this.cmbUsuarios);
        cls.addComponent(this.cmbEstado);
        clsGeneral.addComponent(cls);
        clsGeneral.addComponent(this.cmbTipoDocumento);
        clsRangoFecha.addComponent(this.dfDesde);
        clsRangoFecha.addComponent(this.dfHasta);
        fsRangoFecha.add(clsRangoFecha);
        clsGeneral.addComponent(fsRangoFecha);
        _this.addFilterComponent(clsGeneral);
        return Ext.erp.facturasenproceso.superclass.view.call(this);
    },
    render: function(){
        var p = Ext.erp.facturasenproceso.superclass.render.call(this), me = this;
        this.cmbDepositos = new LOG.util.ComboBox({
            width: 250,
            autoSelect: true,
            disabled: true,
            url: '/logistica/utiles/plugin/index.php/plugincombodeposito/cargardepositos',
            valueField: 'iddeposito',
            displayField: 'deposito'
        });
        this.cmbSubsistemas = new LOG.util.ComboBox({
            autoSelect: true,
            url: '/logistica/facturacion/facturacion/recuperaciones/index.php/facturasenproceso/getSubsistemas',
            width: 250,
            valueField: 'idsubsistema',
            displayField: 'denominacion',
            listeners:{
                select: function(cmb, rd){
                    console.info(rd)
                    me.getStorePrincipal().load();
                },
                change: function(){
                    me.getStorePrincipal().load();
                }
            }
        });
        LOG.util.UIManager.encadenaFn(this.getPanelSuperior(),'onRender', function(){
            me.getPanelSuperior().add({
                border:false,
                tbar: ['->', LOG.fac.Recuperaciones.Idioma.cbDepositos, me.cmbDepositos]
            });
            me.getPanelSuperior().doLayout();
        },'ADDCMB');
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(),'fireEvent', function(e, st){
            if(e === 'beforeload'){
                me.getStorePrincipal().baseParams.estado = Ext.encode([1, 2]);
                me.getStorePrincipal().baseParams.solofacturas = true;
                if(me.cmbSubsistemas.isDirty() && me.cmbSubsistemas.isValid()){
                    me.getStorePrincipal().baseParams.idsubsistema = me.cmbSubsistemas.getValue();
                }
                if(!me.cmbDepositos.disabled && me.cmbDepositos.isDirty() && me.cmbDepositos.isValid()){
                    me.getStorePrincipal().baseParams.iddeposito = me.cmbDepositos.getValue();
                }
            }
        },'CARGAINICIAL');
        me.getPanelSuperior().add(LOG.util.UIManager.initPanel({
            tbar: ['->', log.fac.facturasenproceso.Idioma.lbCmbSubsistemas, this.cmbSubsistemas]
        }));
        return p;
    },
    getReportes: function (data) {
        this.tipoReportes =  new LOG.util.Report({
            reports: [
                {
                    isList: true,
                    dirReport: '/distra/logistica/facturacion/recuperaciones/Facturas',
                    name: 'Facturas',
                    params: {}
                }
            ]
        }).view();
    }

});