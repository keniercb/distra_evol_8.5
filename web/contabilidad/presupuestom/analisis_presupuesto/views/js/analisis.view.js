Ext.namespace('Analisis.Presupuesto');
Ext.QuickTips.init();
Analisis.Presupuesto.stEjercicio = new Ext.data.Store({
    sortInfo: {
        field: 'idejercicio',
        direction: "DESC"
    },
    reader: new Ext.data.JsonReader({}, [{
        name: 'idejercicio', type: 'float'
    }, {
        name: 'nombre'
    }, {
        name: 'inicio'
    }, {
        name: 'fin'
    }
    ])
});

Analisis.Presupuesto.stPeriodo = new Ext.data.Store({
    sortInfo: {
        field: 'idperiodo',
        direction: "DESC"
    },
    reader: new Ext.data.JsonReader({}, [{
        name: 'idperiodo', type: 'float'
    }, {
        name: 'nombre'
    }, {
        name: 'inicio'
    }, {
        name: 'fin'
    }
    ])
});


Ext.Msg.wait('Cargando... porfavor espere!');
Ext.Ajax.request({
    method: "POST",
    url: "cargaretiquetas",
    callback: function (options, success, response) {
        new Analisis.Presupuesto.Viewport({
            idioma: Ext.decode(response.responseText),
            perfil: window.parent.perfil
        });
        Ext.Msg.hide();
    }
});


Analisis.Presupuesto.Viewport = Ext.extend(Ext.Viewport, {
    constructor: function (params) {
        var scope = this;
        this.model = Analisis.Store.Model;
        this.model.init();

        //****--------- Combobex-----------***********
        Analisis.Presupuesto.cbEjercicio = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'idCbEjercicio',
            fieldLabel: 'Ejercicio',
            mode: 'local',
            resizable: false,
            selectOnFocus: true,
            store: Analisis.Presupuesto.stEjercicio,
            valueField: 'idejercicio',
            displayField: 'nombre',
            triggerAction: 'all',
            editable: false,
            width:140,
            emptyText: 'Seleccione...',
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            enableKeyEvents: true
        });
        Analisis.Presupuesto.cbPeriodo = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'idCbPeriodo',
            fieldLabel: 'Periodo',
            mode: 'local',
            resizable: false,
            selectOnFocus: true,
            store: Analisis.Presupuesto.stPeriodo,
            valueField: 'idperiodo',
            displayField: 'nombre',
            triggerAction: 'all',
            editable: false,
            width:140,
            emptyText: 'Seleccione...',
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            enableKeyEvents: true
        });
        this.tipo_presupuesto = new Ext.data.SimpleStore({
            fields: ['operacion'],
            data:[['Presupuesto Gasto'],['Presupuesto Ingreso']]
        });
        this.combo_tipo= new Ext.form.ComboBox({
            displayField: 'operacion',
            store:this.tipo_presupuesto,
            valueField: 'operacion',
            forceSelection: true,
            readOnly: true,
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            anchor: '95%',
            width:140

        });
        this.combo_area= new Ext.form.ComboBox({
            displayField: 'descripcioncentrogrupo',
            store: this.model.store_analisis,
            valueField: 'descripcioncentrogrupo',
            forceSelection: true,
            readOnly: true,
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            anchor: '95%',
            width:140

        });
        this.combo_tipo_grafica= new Ext.form.ComboBox({
            displayField: 'grafica',
            valueField: 'grafica',
            forceSelection: true,
            readOnly: true,
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            anchor: '95%',
            width:140

        });

        //****--------- Combobex-----------***********
        //****--------- Botones-----------***********
        this.btnAceptar= new Ext.Button({
                text: 'Aceptar',
                disabled: false,
                iconCls: 'aceptar'
        });
        this.btnGraficar= new Ext.Button({
            text: 'Graficar',
            disabled: false,
            iconCls: 'grafica'
        });
        //****--------- Botones-----------***********
        //****--------- Paneles-----------***********
        this.bar = new Ext.Toolbar({
            hidden: false,
            items:[this.btnGraficar,'Tipo:',new Ext.Toolbar.Separator(),this.combo_tipo_grafica]
        });
        this.panelGraficar= new Ext.Panel({
            layout: 'border',
            region: 'center',
            layout:'fit',
            tbar: this.bar,
            collapsible: true
        });

        this.panelPrincipal= new Ext.Panel({
            layout: 'border',
            title: 'Análisis del Presupuesto',
            region: 'center',
            layout:'fit',
            tbar: ['Ejercicio:',Analisis.Presupuesto.cbEjercicio,'Periodos:',Analisis.Presupuesto.cbPeriodo,
            'Tipo:',this.combo_tipo,'Área:', this.combo_area,this.btnAceptar],
            items:[this.panelGraficar]
        });
        //****--------- Paneles-----------***********

        Analisis.Presupuesto.cbEjercicio.on('select', function (combo, record, index) {
            // Caja.Componentes.stPeriodo.removeAll();
            loadEjercicioPeriodo(combo.getValue());
            Ext.Msg.wait('Cargando...', 'Por favor espere...');
        });

        function loadEjercicioPeriodo(idEjercicio) {
            Ext.Ajax.request({
                url: '/contabilidad/caja/componentes/cajafondo/index.php/cajafondo/loadEjercicioPeriodo',
                params: {
                    idEjercicio: idEjercicio,
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    console.log(respuesta);

                    if (!idEjercicio) {
                        Analisis.Presupuesto.stEjercicio.loadData(respuesta.ejercicios);
                        Analisis.Presupuesto.stPeriodo.loadData(respuesta.periodos);
                        Analisis.Presupuesto.cbEjercicio.setValue(respuesta.ejercicioActual);
                    } else {
                        Analisis.Presupuesto.stPeriodo.loadData(respuesta.periodos);
                    }
                    Analisis.Presupuesto.cbPeriodo.setValue(respuesta.periodoActual);
                    Analisis.Presupuesto.cbPeriodo.fireEvent('select', Analisis.cbPeriodo, respuesta.periodos[0], respuesta.periodoActual);
                    Ext.MessageBox.hide();
                }
            });
        }

        loadEjercicioPeriodo();




        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            idioma: params.idioma,
            items: [this.panelPrincipal]
        });





        Analisis.Presupuesto.Viewport.superclass.constructor.call(this, params);

    }


});

