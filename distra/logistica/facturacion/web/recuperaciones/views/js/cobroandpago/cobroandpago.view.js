Ext.ns('Ext.erp.cobroandpago');
Ext.erp.cobroandpago = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    idioma: undefined,

    constructor: function (config) {
        var _this =this;
        this.frame = true;
        this.idioma = LOG.util.UIManager.apply(LOG.fac.Recuperaciones.Idioma, log.fac.cobroandpago.Idioma);
        this.dirController = '/logistica/facturacion/facturacion/recuperaciones/index.php/recuperaciones/';

        /*------------Barra con botones---------------*/
        this.listaBotonesVentanaToolbar = new LOG.util.List();
        this.listaBotonesDeposito = new LOG.util.List();
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonImprimir({
            tooltip: _this.idioma.ttBtnImprimir,
            text: _this.idioma.btnImprimir,
            handler: function () {
                _this.getReportes(_this)
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('RB')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonLimpiar({
            tooltip: _this.idioma.ttBtnLimpiar,
            text: _this.idioma.btnLimpiar,
            handler: function () {
                _this.btnLimpiar();
            }
        }));
        this.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    alt: true,
                    key: 'l',
                    fn: function () {
                        _this.btnLimpiar();
                    }
                },
                {
                    alt: true,
                    key: 'p',
                    fn: function () {
                        _this.getReportes(_this)

                    }
                }
            ]);
        this.addToolbarButtonPanel('->');
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonAyuda({id:'idCobroAndPago'}));

        this.addToolbarButtonDeposito('->');
        this.addToolbarButtonDeposito(new Ext.form.Label({
            text: _this.idioma.cbDepositos
        }));
        this.comboDepositos = new LOG.util.ComboBox({ //---combobox Tipo de producto
            valueField: 'iddeposito',
            displayField: 'deposito',
            hiddenName: 'deposito',
            editable: false,
            url: _this.dirController + 'cargardepositos'
        });
        /*--------------Fieldset RangoFecha-----------------*/

        this.dfDesde = new Ext.form.DateField({ //---datefield Desde
            fieldLabel: _this.idioma.dfDesdeDoc,
            name: 'enddoc',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'startCobroAndPago',
            endDateField: 'endCobroAndPago',
            editable: false
        });
        this.dfHasta = new Ext.form.DateField({ //---datefield Hasta
            fieldLabel: _this.idioma.dfHastaDoc,
            name: 'enddoc',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'endCobroAndPago',
            startDateField: 'startCobroAndPago',
            editable: false
        });
        this.dfDesde.endDateField = this.dfHasta.id; //-------validacion de fecha
        this.dfHasta.startDateField = this.dfDesde.id;

        this.clsFecha = LOG.util.UIManager.initColumnForm({ //columnForm de la fecha
            columnas: 2
        });
        this.clsFecha.addComponent(this.dfDesde);
        this.clsFecha.addComponent(this.dfHasta);

        this.fsRangoFecha = new Ext.form.FieldSet({ //fieldset Seleccionar cliente
            title: _this.idioma.fsRangoFecha,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            autoHeight:true,
            items: [this.clsFecha]
        });

        /*--------------Fieldset Usuario/EstadoDocumento---------------*/

        this.clsCriterioBusqueda = LOG.util.UIManager.initColumnForm({ //columnForm General
            columnas: 2
        });
        var data = [
            [ 1,LOG.lb.documento.Estado[1]],
            [ 2,LOG.lb.documento.Estado[2]],
            //[ 3,LOG.lb.documento.Estado[3]],
            //[ 4,LOG.lb.documento.Estado[4]],
            //[ 7,LOG.lb.documento.Estado[7]],
            [ 10,LOG.lb.documento.Estado[10]],
        ];

        this.cmbEstado = new LOG.util.ComboBox({
            name: 'estado',
            fieldLabel: this.idioma.lbCbEstado,
            mode: 'local',
            forceSelection:true,
            emptyText:this.idioma.emptyTextCmb,
            valueField: 'idestado',
            displayField: 'estado',
            store:  new Ext.data.SimpleStore({
                fields: ['idestado','estado'],
                data: data
            }),
            width: 200
        });
        this.cmbUsuarios = new LOG.lb.documento.ComboUsuarios({
            fieldLabel: this.idioma.lbCbCreadoPor,
            campo: 'idusuario',
            emptyText:this.idioma.emptyTextCmb,
            alias: 'aperturaLog',
            subsistema: 10,
            hiddenName: 'idusuario'
        });
        this.clsCriterioBusqueda.addComponent(this.cmbUsuarios);
        this.clsCriterioBusqueda.addComponent(this.cmbEstado);

        this.fsCriterioBusqueda = new Ext.form.FieldSet({ //fieldset Seleccionar cliente
            title: _this.idioma.fsCriterioBusqueda,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            autoHeight:true
        });
        this.fsCriterioBusqueda.add(this.clsCriterioBusqueda);

        this.clsGeneral = LOG.util.UIManager.initColumnForm({ //columnForm General
            columnas: 2
        });
        this.clsGeneral.addComponent(this.fsRangoFecha);
        this.clsGeneral.addComponent(this.fsCriterioBusqueda);

        this.clsGeneral.getColumn(0).columnWidth = 0.4;
        this.clsGeneral.getColumn(1).columnWidth = 0.6;
        this.clsGeneral.anchor = '101.3%';

        this.fpCentral = LOG.util.UIManager.initForm({ //formulario General
          //  id:'formularioCentralOfertas',
            region: 'center',
            style: '-moz-border-radius:20px',
            items: [this.clsGeneral]
        });
        /* -------configuracion de la vista---------*/
        config.layout = 'border';
        config.items = [
            {
                region: 'north',
                tbar: [this.listaBotonesVentanaToolbar.getArray()],
                bbar: [this.listaBotonesDeposito.getArray()]
            },
            this.fpCentral
        ];
        Ext.erp.cobroandpago.superclass.constructor.call(this, config);
    },
    addToolbarButtonPanel: function (b, f) {
        this.listaBotonesVentanaToolbar.add(LOG.util.UIManager.reconfigureButton(b));
    },
    addToolbarButtonDeposito: function (b, f) {
        this.listaBotonesDeposito.add(LOG.util.UIManager.reconfigureButton(b));
    },
    getReportes: function (_this) {
        if (_this.operacion != 10) {
            _this.deposito = null;
        }
        this.tipoReportes = new LOG.util.Report({
            idioma: this.idioma,
            reports: [
                {
                    dirReport: '/distra/logistica/facturacion/recuperaciones/CobroAndPago',
                    isList: true,
                    params: {
                        fechainicio: (_this.dfDesde.getValue()) ? _this.dfDesde.getValue().format('d-m-Y') : null,
                        fechafin: (_this.dfHasta.getValue()) ? _this.dfHasta.getValue().format('d-m-Y') : null,
                        identidad: null,
                        idcliente: null,
                        idcuentabancaria: null,
                        idcondicionpago: null
                    }

                }
            ]
        });
        this.tipoReportes.view();

    },
    btnLimpiar: function(){
        var _this=this;
        _this.dfDesde.setValue(null);
        _this.dfHasta.setValue(null);
        _this.dfDesde.setMaxValue(null);
        _this.dfHasta.setMinValue(null);
        _this.cmbEstado.clearValue();
        _this.comboOperaciones.clearValue();
        _this.cmbUsuarios.clearValue();
    },
    addRecords: function (store, records) {
        var _this = this;
        Ext.each(records, function (record, index) {
            if (!_this.existsRecord(store, record)) {
                var recordType;
                if (store.idItem === 'producto') {
                    recordType = new store.recordType({
                        idproducto: record.get('idproducto'),
                        codigoproveedor: record.get('codigoproveedor'),
                        codigo: record.get('codigo'),
                        denominacion: record.get('denominacion')
                    });
                } else if (store.idItem === 'cliente') {
                    recordType = new store.recordType({
                        idclientesproveedores: record.get('idclientesproveedores'),
                        nombre: record.get('nombre')
                    });
                }
                store.add(recordType);
            }
        });

    },
    existsRecord: function (store, record) {

        var flags = false;
        Ext.each(store.data.items, function (nRecord, index) {
            if (store.idItem === 'producto') {
                if ( nRecord.get('idproducto') === record.get('idproducto')) {
                    flags = true;
                }
            } else if (store.idItem === 'cliente') {
                if (nRecord.get('idclientesproveedores') === record.get('idclientesproveedores')) {
                    flags = true;
                }
            }
        });
        return flags;
    }
});

