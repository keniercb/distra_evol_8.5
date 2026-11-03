Ext.define('ConfigFormatoNumContrato.controller.Main', {
    extend: 'CRM.core.controller.Base',
    confEnt: null,
    refs: [
        {ref: 'MainView', selector: 'configformatonumcontrato_view'},
        {ref: 'FpFormatoNumContrato', selector: 'fpformatonumcontrato'},
        {ref: 'GpElementosIncrementales', selector: 'gpelementosincrementales'},
    ],
    init: function () {
        var me = this;

        me.getLang();

        this.formatos = null;

        me.listen({
            component: {
                "configformatonumcontrato_view": {
                    show: this.winShow,
                    beforeshow: this.loadConfEntidadFormato
                },
                "configformatonumcontrato_view button[action=cancel]": {
                    click: this.cerrarVentana
                },
                "configformatonumcontrato_view button[action=acept],configformatonumcontrato_view button[action=apply]": {
                    click: this.guardarValores
                },
                "fpformatonumcontrato combo[name=idformatonumcontrato]": {
                    change: this.changeCbFormato
                },
                "fpformatonumcontrato combo[name=contratodestino]": {
                    change: this.changeCbContratoDestino
                },
                "gpelementosincrementales": {
                    grideditorvalidate: this.formatValoresElemIncrementales
                },
                "gpelementosincrementales button[action=reset]": {
                    click: this.resetearValoresIniciales
                }
            }
        });
    },
    winShow: function () {
        this.getFpFormatoNumContrato().cmbFormato.getStore().load();
        // this.getFpFormatoNumContrato().getStore();
    },
    loadConfEntidadFormato: function () {

        Ext.Ajax.request({
            url: (function () {
                var nomModule = ModuleMgr.get('Nomencladores').moduleCfg;
                return '/' + nomModule.getBasePath() + 'index.php/configurarformatonumcontrato/cargarFormatoNumContratoEntidad';
            })(),
            scope: this,
            callback: function (options, success, response) {
                var data = Ext.decode(response.responseText),
                    confEnt = this.formatos = (Ext.isEmpty(data)) ? null : data;
                if (confEnt) {
                    var cmbformato = this.getFpFormatoNumContrato().cmbFormato,
                        hfidentidad = this.getFpFormatoNumContrato().hfIdentidad,
                        cmbdestino = this.getFpFormatoNumContrato().cmbDestino,
                        ejemplo = this.getFpFormatoNumContrato().ejemplo;
                    // console.log(' ----- ',confEnt[0], confEnt[0]['idformatonumcontrato'])
                    // this.getFpFormatoNumContrato().cmbFormato.getStore().load({
                    //     callback: function(records, operation, success) {
                    //         console.log('loaddddd', confEnt[0]['idformatonumcontrato'], cmbformato)
                    //         cmbformato.setValue(confEnt[0]['idformatonumcontrato']);
                    //     }
                    // });
                    hfidentidad.setValue(confEnt[0]['identidadformatonumcontrato']);
                    cmbdestino.setValue(confEnt[0]['contratodestino']);
                    // cmbformato.setValue(confEnt[0]['idformatonumcontrato']);
                    // cmbformato.fireEvent('change', cmbformato, cmbformato.getValue());
                }
            },
            scope: this
        })
    },
    changeCbFormato: function (elem, newValue) {
        // console.log('change', newValue, ':::',elem.getValue())
        if (newValue) {
            var idformato = this.getFpFormatoNumContrato().cmbFormato.getValue(),
                identformat = this.getFpFormatoNumContrato().hfIdentidad.getValue(),
                contratodestino = this.getFpFormatoNumContrato().cmbDestino.getValue();
            var record=this.getFpFormatoNumContrato().cmbFormato.findRecord('idformatonumcontrato', idformato);
            // console.log('record', record)
            if(record)
                this.getFpFormatoNumContrato().ejemplo.setValue(record.get('preview'));
            if (identformat && contratodestino) {
                this.getGpElementosIncrementales().getStore().load({
                    params: {idformato: idformato, identidadformato: identformat, contratodestino: contratodestino}
                });
            }
        }
    },
    changeCbContratoDestino: function (combo, value) {
        var form = this.getFpFormatoNumContrato();
        form.cmbFormato.setValue();
        form.hfIdentidad.setValue(0);
        this.getFpFormatoNumContrato().ejemplo.setValue('');
        this.getGpElementosIncrementales().getStore().removeAll();
        if (this.formatos && Ext.isArray(this.formatos)) {
            Ext.each(this.formatos, function (formato) {
                if (formato['contratodestino'] == value) {
                    form.hfIdentidad.setValue(formato['identidadformatonumcontrato']);
                    // console.log('idformatonumcontrato', parseInt(formato['idformatonumcontrato']));
                    form.cmbFormato.setValue(parseInt(formato['idformatonumcontrato']));
                    form.cmbFormato.fireEvent('change', form.cmbFormato, form.cmbFormato.getValue())
                }
            }, this);
        }
    },
    formatValoresElemIncrementales: function (editor, context) {
        var maxLength = context['record'].get('info')['longitud'],
            incluirCerosIzq = (context['record'].get('info')['incluircerosizquierda'] == "1") ? true : false,
            value = context['value'];

        value = value.substring(0, maxLength);
        if (incluirCerosIzq)
            value = Ext.String.leftPad(value, maxLength, '0');

        context.cancel = true;
        context['record'].set(context['field'], value);
    },
    guardarValores: function (btn) {
        var elemIncremStore = this.getGpElementosIncrementales().getStore(),
            elemIncr = new Array();

        elemIncremStore.each(function (record) {
            elemIncr.push({
                idformato: record.get('idformatonumcontratoelemento'),
                identidadformato: record.get('identidadformatonumcontrato'),
                identidadincremento: record.get('identidadformatonumcontratoincremento'),
                valor: record.get('valor'),
                valorinicial: record.get('valorinicial'),
            });
        }, this);

        var result = Ext.apply(
            this.getFpFormatoNumContrato().getForm().getValues(),
            {elemIncrem: Ext.encode(elemIncr)}
        );

        this.senDataToServer(result, btn.action == 'acept');
    },
    senDataToServer: function (values, close) {
        var me = this;

        Ext.MessageBox.show({
            msg: me.etiquetas.msgGuardandoConfig,
            title: me.etiquetas.lbPorFavorEspere,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });

        Ext.Ajax.request({
            url: (function () {
                var nomModule = ModuleMgr.get('Nomencladores').moduleCfg;
                return '/' + nomModule.getBasePath() + 'index.php/configurarformatonumcontrato/guardarConfiguracion';
            })(),
            params: values,
            scope: this,
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                var data = Ext.decode(response.responseText);
                if (data['success']) {
                    mostrarMensaje(1, me.etiquetas.msgSuccessSaveConfig);
                    if (close) {
                        this.getMainView().close();
                    }
                    this.formatos = data['formatos'] && data['formatos'].length ? data['formatos'] : null;
                    this.setIdEntidad();
                }
            },
            scope: this
        })
    },
    cerrarVentana: function () {
        this.getMainView().close();
    },
    resetearValoresIniciales: function () {
        var elemIncremStore = this.getGpElementosIncrementales().getStore();

        elemIncremStore.each(function (record) {
            record.set('valor', record.get('valorinicial'));
        }, this);
    },
    setIdEntidad: function () {
        var cmbformato = this.getFpFormatoNumContrato().cmbFormato,
            hfidentidad = this.getFpFormatoNumContrato().hfIdentidad,
            cmbdestino = this.getFpFormatoNumContrato().cmbDestino;

        Ext.each(this.formatos, function (formato) {
            if(formato['idformatonumcontrato'] = cmbformato.getValue() && formato['contratodestino'] == cmbdestino.getValue()){
                hfidentidad.setValue(formato['identidadformatonumcontrato']);
            }
        });
    }

});