Ext.ns('LOG.lb.nomdinamicos');

LOG.lb.nomdinamicos.VentanaAddNomDinamicos = Ext.extend(LOG.util.Window, {
    width: 350,
    height: 155,
    resizable: false,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        config.idioma = LOG.util.UIManager.apply(config.idioma, LOG.lb.nomdinamicos.Idioma);
        config.title = config.idioma.tlAddNomDinamicos,
        LOG.lb.nomdinamicos.VentanaAddNomDinamicos.superclass.constructor.call(this, config);
    },
    /**
     * Inicializa los componentes de la ventana.
     * @returns {undefined}
     */
    initComponent: function() {
        LOG.lb.nomdinamicos.VentanaAddNomDinamicos.superclass.initComponent.call(this);
        this.basicFormulario = LOG.util.UIManager.initForm({
            frame: true,
            region: 'center',
            labelAlign: 'top'
        });
        this.basicFormulario.add(LOG.util.Prototipos.inputTexto({
            fieldLabel: this.idioma.lbDenominacion,
            allowBlank: false,
            name: 'denominacion',
            anchor: '100%'
        }));
        this.chxColor = new Ext.form.Checkbox({
            hideLabel: true,
            boxLabel: 'Color',
            name: 'referencia'
        });
        this.basicFormulario.add(this.chxColor);
        this.modelo.bindForm(this.basicFormulario);
        this.add(this.basicFormulario);
        this.modelo.addActionButton(this.listaBotones.getItem(1));
        this.modelo.addActionButton(this.listaBotones.getItem(2));
    },
    /**
     * Guarda los datos del formulario.
     * @returns {undefined}
     */
    aceptarFn: function() {
        this.modelo.propiedades = null;
        if (this.chxColor.getValue()) {
            this.modelo.propiedades = Ext.encode('{"color": true, "nombre": "Color"}');
        }
        this.modelo.salvar();
    },
    closeFn: function() {
        this.modelo.reset();
    },
    /**
     * Carga los datos del record en el formulario.
     * @param {Ext.data.Record} d
     * @returns {undefined}
     */
    cargarDatos: function(d) {
        if (this.basicFormulario) {
            this.modelo.bindForm(this.basicFormulario);
            if (Ext.decode(d.get('propiedades'))) {
                d.set('referencia', true);
            }
            this.basicFormulario.getForm().loadRecord(d);
            this.modelo.loadRecord();
        }
    }
});






