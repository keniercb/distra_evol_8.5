//Cb Ejercicio y periodo---------------
Ext.ns('Caja.Componentes');
Caja.Componentes.stEjercicio = new Ext.data.Store({
    // url: '',
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

Caja.Componentes.cbEjercicio = new Ext.form.ComboBox({
    disabledClass: 'disabled-component',
    id: 'idCbEjercicio',
    fieldLabel: 'Ejercicio',
    mode: 'local',
    resizable: true,
    selectOnFocus: true,
    store: Caja.Componentes.stEjercicio,
    valueField: 'idejercicio',
    displayField: 'nombre',
    width: 60,
    triggerAction: 'all',
    editable: false,
    emptyText: 'Seleccione...',
    tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
    enableKeyEvents: true
});
//----------------------------
Caja.Componentes.stPeriodo = new Ext.data.Store({
    // url: 'loadDataPeriodo',
    id: 'idperiodo',
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

Caja.Componentes.cbPeriodo = new Ext.form.ComboBox({
    disabledClass: 'disabled-component',
    id: 'idCbPeriodo',
    fieldLabel: 'Per&iacute;odo',
    mode: 'local',
    resizable: true,
    selectOnFocus: true,
    store: Caja.Componentes.stPeriodo,
    valueField: 'idperiodo',
    displayField: 'nombre',
    width: 100,
    editable: false,
    allowBlank: false,
    emptyText: 'Seleccione...',
    triggerAction: 'all',
    tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
    enableKeyEvents: true
});

Caja.Componentes.cbEjercicio.on('select', function (combo, record, index) {
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
                Caja.Componentes.stEjercicio.loadData(respuesta.ejercicios);
                Caja.Componentes.stPeriodo.loadData(respuesta.periodos);
                Caja.Componentes.cbEjercicio.setValue(respuesta.ejercicioActual);
            } else {
                Caja.Componentes.stPeriodo.loadData(respuesta.periodos);
            }
            Caja.Componentes.cbPeriodo.setValue(respuesta.periodoActual);
            Caja.Componentes.cbPeriodo.fireEvent('select', Caja.Componentes.cbPeriodo, respuesta.periodos[0], respuesta.periodoActual);
            Ext.MessageBox.hide();
        }
    });
}

loadEjercicioPeriodo();
