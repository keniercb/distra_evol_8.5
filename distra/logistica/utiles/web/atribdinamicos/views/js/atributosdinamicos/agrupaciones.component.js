Ext.ns('LOG.lb.agrupaciones');

LOG.lb.agrupaciones.ventanaAddAgrupaciones = Ext.extend(LOG.util.Window, {
    record: undefined,
    width: 400,
    height: 140,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        config.idioma = Ext.apply(config.idioma, LOG.lb.agrupaciones.Idioma);
        config.title = config.idioma.tlAddAgrupacion;
        LOG.lb.agrupaciones.ventanaAddAgrupaciones.superclass.constructor.call(this, config);
        this.modelo.addActionButton(this.listaBotones.getItem(2));
        this.modelo.addActionButton(this.listaBotones.getItem(1));
    },
    /**
     * Inicializa los componentes de la ventana.
     * @returns {undefined}
     */
    initComponent: function() {
        LOG.lb.agrupaciones.ventanaAddAgrupaciones.superclass.initComponent.call(this);
        this.basicFormulario = LOG.util.UIManager.initForm({
            frame: true,
            region: 'center',
            labelAlign: 'top'
        });
        this.basicFormulario.add(LOG.util.Prototipos.inputTexto({
            fieldLabel: this.idioma.lbDenominacion,
            name: 'denominacion',
            allowBlank: false
        }));
        this.modelo.bindForm(this.basicFormulario);
        this.add(this.basicFormulario);
    },
    aceptarFn: function() {
        var _this = this;
        this.modelo.salvar({}, function() {
            _this.modelo.reset();
        });
    },
    closeFn: function() {
        this.modelo.reset();
    },
    /**
     * Carga los datos del record seleccionado en el formulario de la ventana.
     * @param {Ext.data.Record} d
     * @returns {undefined}
     */
    prepareForm: function(d) {
        if (this.basicFormulario) {
            this.record = d;
            this.basicFormulario.getForm().loadRecord(d);
            this.modelo.loadRecord();
            this.modelo.setDefaulFormValues();
        }
    }
});
