Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.SeleccionarElemento = Ext.extend(Ext.Window, {
    $extend: Ext.Panel,
    layout: 'border',
    width: 215,
    height: 300,
    initComponent: function() {
        var me = this;
        var check = false;
        me.idfuente = false;
        me.fuente = '';
        me.idproyecto = (me.idproyecto) ? me.idproyecto : false;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.FmpeirmatrizController();
        me.etiquetas = me.controller._getLabel('Fmpeir');
        me.directorioImagenes = me.controller._getGlobals('dirImg');

        me.btnMarcar = new Ext.Button({
            text: 'Marcar todos',
            tooltip: 'Marcar todos los elementos',
            handler: function() {
                check = true;
                me.recorrer(check);
            }
        });

        me.btnDesmarcar = new Ext.Button({
            text: 'Desmarcar todos',
            tooltip: 'Desmarcar todos los elementos',
            handler: function() {
                check = false;
                me.recorrer(check);
            }
        });
        me.btnAceptar = new comps.buttons.btnAceptar({
            tooltip: 'Aceptar seleccion de elementos y carrar ventana',
            handler: function() {
                me.disparaEvento();
                me.destroy();
            }
        });
        me.btnCancelar = new comps.buttons.btnCancelar({
            text: 'Cancelar',
            tooltip: 'Cancelar seleccion de elementos y cerrar ventana',
            handler: function() {
                me.destroy();
            }
        });


        me.elemento = new Ext.form.FieldSet({
            autoHeigth: true,
            title: 'Denominación del elemento',
            defaultType: 'checkbox',
            items: [{
                    hideLabel: true,
                    boxLabel: 'Agua',
                    name: 'Agua'
                },
                {
                    hideLabel: true,
                    boxLabel: 'Aire',
                    name: 'Aire'
                },
                {
                    hideLabel: true,
                    boxLabel: 'Suelo',
                    name: 'Suelo'
                },
                {
                    hideLabel: true,
                    boxLabel: 'Biodiversidad Flora/Fauna',
                    name: 'Biodiversidad'
                },
                {
                    hideLabel: true,
                    boxLabel: 'Ambiente construido',
                    name: 'Ambiente'
                }],
        });

        me.panel = new Ext.Panel({
            id: 'panel',
            layout: 'fit',
            frame: true,
            title: 'Seleccionar elementos',
            region: 'center',
            tbar: ['Lista de elementos'],
            items: [me.elemento],
            bbar: [me.btnMarcar, "", me.btnDesmarcar]
        });



        me.items = [me.panel];
        me.bbar = ['->', me.btnCancelar, me.btnAceptar];

        me.keys = [
            {
                key: 'x',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function() {
                    me.btnCancelar.handler.call();
                }
            },
            {
                key: Ext.EventObject.ENTER,
                scope: me,
                stopEvent: true,
                fn: function() {
                    me.btnAceptar.handler.call();
                }
            }
        ];


        Planificacion.Integracion.SeleccionarElemento.superclass.initComponent.call(me);
    },
    recorrer: function(check) {
        var me = this;
        Ext.each(me.elemento.items.items, function(item) {
            if (check == true) {
                item.setValue(check);
            }
            else {
                item.setValue(check);
            }
        });
    },
    disparaEvento: function() {
        var me = this;
        var i = 0;
        var elementos = new Array(5);
        Ext.each(me.elemento.items.items, function(item) {
            if (item.checked) {
                i++;
                elementos[i] = 1;
            }
            else {
                i++;
                elementos[i] = 0;
            }
        });
        this.fireEvent('elementoseleccionado', elementos);
    }
});
Ext.reg('Planificacion.Integracion.SeleccionarElemento', Planificacion.Integracion.SeleccionarElemento);


