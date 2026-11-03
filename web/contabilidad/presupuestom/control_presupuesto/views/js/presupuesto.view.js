Ext.namespace('Control.Presupuesto');
Ext.QuickTips.init();
Control.Presupuesto.stEjercicio = new Ext.data.Store({
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

Control.Presupuesto.stPeriodo = new Ext.data.Store({
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
        new Control.Presupuesto.Viewport({
            idioma: Ext.decode(response.responseText),
            perfil: window.parent.perfil
        });
        Ext.Msg.hide();
    }
});


Control.Presupuesto.Viewport = Ext.extend(Ext.Viewport, {
    constructor: function (params) {
        var scope = this;
        this.model = Presupuesto.Store.Model;
        this.model.init();

        //Combo Box

        this.tipo_presupuesto = new Ext.data.SimpleStore({
            fields: ['operacion'],
            data:[['Presupuesto Gasto'],['Presupuesto Ingreso']]
        });

        Control.Presupuesto.comboejercicio = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'idCbEjercicio',
            fieldLabel: 'Ejercicio',
            mode: 'local',
            resizable: false,
            selectOnFocus: true,
            store: Control.Presupuesto.stEjercicio,
            valueField: 'idejercicio',
            displayField: 'nombre',
            triggerAction: 'all',
            editable: false,
            width:140,
            emptyText: 'Seleccione...',
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            enableKeyEvents: true
        });

        Control.Presupuesto.comboperiodo = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'idCbPeriodo',
            fieldLabel: 'Periodo',
            mode: 'local',
            resizable: false,
            selectOnFocus: true,
            store: Control.Presupuesto.stPeriodo,
            valueField: 'idperiodo',
            displayField: 'nombre',
            triggerAction: 'all',
            editable: false,
            width:140,
            emptyText: 'Seleccione...',
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            enableKeyEvents: true

        });
        this.combotipo = new Ext.form.ComboBox({
            store: this.tipo_presupuesto,
            resizable: false,
            displayField: 'operacion',
            tpl: '<tpl for="."><div ext:qtip="{operacion}" class="x-combo-list-item">{operacion}</div></tpl>',
            enableKeyEvents: true,
            selectOnFocus: true,
            valueField: 'operacion',
            forceSelection: true,
            readOnly: true,
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            anchor: '95%'

        });
        this.comboarea = new Ext.form.ComboBox({
            store: this.model.store_centro_costo,
            displayField: 'descripcioncentrogrupo',
            valueField: 'descripcioncentrogrupo',
            forceSelection: true,
            readOnly: true,
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            anchor: '95%'

        });
console.log(this.comboarea.store)
        this.combocuentas = new Ext.form.ComboBox({
            //store: tipo_presupuesto,
            displayField: 'tipo',
            valueField: 'tipo',
            forceSelection: true,
            readOnly: true,
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            anchor: '95%'

        });

        this.btnAceptarPPrincipal = new Ext.Button({
            text: 'Aceptar',
            disabled: false,
            iconCls: 'aceptar'
        });

        this.combo = new Ext.grid.CheckboxSelectionModel();
        //PARA CREAR EL PAGINADO
        this.pagingBar = new Ext.PagingToolbar({
            pageSize: 20,
            displayInfo: true,
            clearFilter: true,
            /*displayMsg: etiquetas.lbDisplayMsg,
             emptyMsg: etiquetas.lbEmptyMsg,*/
            store: this.model.store_centro_costo,
            toggleHandler: function(btn, pressed){
                var as = this.Grid.getView();
                as.showPreview = pressed;
                as.refresh();
            }
        });

        this.Grid = new Ext.grid.GridPanel({//Grid Panel que va dentro del primer panel
            bbar: this.pagingBar,
            region: 'center',
            cm: new Ext.grid.ColumnModel([
                {id: 'company', header: "Elementos de Gastos", width: 40, sortable: true, dataIndex: 'descripcioncentrogrupo'},
                {header: "Plan Anual", width: 20, sortable: true, renderer: Ext.util.Format.usMoney, },
                {header: "Plan periodos", width: 20, sortable: true, dataIndex: 'descripcioncentrogrupo'},
                {header: "Plan periodos real hasta la fecha", width: 20, sortable: true, },
            ]),
            layout:'fit',
            sm: this.combo,
            width: 500,
            store: this.model.store_centro_costo,
            viewConfig: {
                forceFit: true
            },
            tbar: [
                this.btnExportar = new Ext.Button({
                    text: 'Exportar',
                    disabled: false,
                    iconCls: 'exportar'
                }),
                this.btnReporte = new Ext.Button({
                    text: 'Vista reporte',
                    disabled: false,
                    iconCls: 'reporte'
                })

            ],


            width: 600,
            height: 300,
            frame: true

        });

        this.pPrincipal = new Ext.Panel({
            layout: 'border',
            title: 'Control de la ejecución del presupuesto',
            region: 'center',
            layout:'fit',
            items:[this.Grid],
            tbar:['Ejericio',Control.Presupuesto.comboejercicio,' ','Periodos', Control.Presupuesto.comboperiodo, ' ','Tipo', this.combotipo, '','Área',this.comboarea,'','Cuenta contable',this.combocuentas,'',this.btnAceptarPPrincipal]
        });

        Control.Presupuesto.comboejercicio.on('select', function (combo, record, index) {
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
                    if (!idEjercicio) {
                        Control.Presupuesto.stEjercicio.loadData(respuesta.ejercicios);
                        Control.Presupuesto.stPeriodo.loadData(respuesta.periodos);
                       // Control.Presupuesto.comboejercicio.setValue(respuesta.ejercicioActual);
                    } else {
                        Control.Presupuesto.stPeriodo.loadData(respuesta.periodos);
                    }
                    //Control.Presupuesto.comboperiodo.setValue(respuesta.periodoActual);
                    Control.Presupuesto.comboperiodo.fireEvent('select', Control.Presupuesto.comboperiodo, respuesta.periodos[0], respuesta.periodoActual);
                    Ext.MessageBox.hide();
                }
            });
        }

        loadEjercicioPeriodo();

        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            idioma: params.idioma,
            items: [this.pPrincipal]
        });

       // var controller = Control.Prueba.Controller;
       // controller.init(params.idioma, this, this.model);

        Control.Presupuesto.Viewport.superclass.constructor.call(this, params);

    }


});
