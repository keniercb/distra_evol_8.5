Ext.namespace('Contabilidad.Reporte.VentanaReporte');

Contabilidad.Reporte.VentanaReporte.View = Ext.extend(Contabilidad.Reporte.Ventana.View, {
    layout: 'border',
    maximized: true,
    initComponent: function () {
        this.concepto = 'Estado financiero';
        this.title = this.accion == 'adicionar' ? 'Adicionar' : 'Modificar';
        this.title = this.title + ' ' + this.concepto.toLowerCase();

        this.controller = new Contabilidad.Reporte.VentanaReporte.Controller({
            view: this,
            etiquetas: this.etiquetas
        });

        Contabilidad.Reporte.VentanaReporte.View.superclass.initComponent.call(this);

        this.controller.inicializarEventos();
    },

    crearCuerpo: function () {
        this.crearForm();
        this.gridfila = new Contabilidad.Reporte.VentanaReporte.GridFila({
            etiquetas: this.etiquetas
        });
        this.gridcolumna = new Contabilidad.Reporte.VentanaReporte.GridColumna({
            etiquetas: this.etiquetas
        });
        this.gridcuerpo = new Contabilidad.Reporte.VentanaReporte.GridCuerpo({
            etiquetas: this.etiquetas
        });
        this.items = [this.form, {
            xtype: 'tabpanel',
            activeItem: 0,
            region: 'center',
            items: [this.gridcolumna, this.gridfila, this.gridcuerpo]
        }];
    },

    crearForm: function () {
        this.idreporte = new Ext.form.Hidden({
            name: 'idreportefinanciero'
        });

        this.firstElement = this.primercampo = this.codigo = new Ext.form.TextField({
            fieldLabel: this.etiquetas.lbCodigo,
            allowBlank: false,
            name: 'codigo',
            anchor: '98%',
            maxLength: 30
        });

        this.denominacion = new Ext.form.TextField({
            fieldLabel: this.etiquetas.lbDenominacion,
            allowBlank: false,
            name: 'denominacion',
            anchor: '100%',
            maxLength: 255
        });

        this.form = new Ext.form.FormPanel({
            region: 'north',
            title: this.etiquetas.lbInformacion,
            layout: 'column',
            frame: true,
            border: false,
            labelAlign: 'top',
            collapsible: true,
            split: true,
            height: 100,
            trackResetOnLoad: true,
            items: [
                this.idreporte,
                {
                    layout: 'form',
                    columnWidth: .3,
                    items: [this.codigo]
                },
                {
                    layout: 'form',
                    columnWidth: .7,
                    items: [this.denominacion]
                }
            ]
        })
    },

    esValida: function () {
        var form = this.form.getForm(),
            gridfila = this.gridfila,
            gridcolumna = this.gridcolumna,
            gridcuerpo = this.gridcuerpo;

        if (form.isValid() && gridfila.esValido() && gridcolumna.esValido() && gridcuerpo.esValido()
            && (form.isDirty() || gridfila.cambiado() || gridcolumna.cambiado() || gridcuerpo.cambiado())) {
            return true;
        }
        return false;
    }

});

Contabilidad.Reporte.VentanaReporte.Toolbar = Ext.extend(Ext.Toolbar, {
    acciones: ['adicionar', 'modificar', 'eliminar', 'subir', 'bajar', 'massangria', 'menossangria'],
    concepto: 'concepto',
    initComponent: function () {
        this.etiquetas = this.etiquetas || {};
        this.crearCuerpo();
        Contabilidad.Reporte.VentanaReporte.Toolbar.superclass.initComponent.call(this);
    },
    crearCuerpo: function () {
        this.btnAdicionar = new Ext.Button({
            text: this.etiquetas.lbBtnAdicionar,
            tooltip: this.etiquetas.lbTtAdicionarConcepto.replace(/<#>/g, this.concepto),
            iconCls: 'adicionar',
            accion: 'adicionar',
            hidden: this.acciones.indexOf('adicionar') != -1 ? false : true
        });

        this.btnModificar = new Ext.Button({
            text: this.etiquetas.lbBtnModificar,
            tooltip: this.etiquetas.lbTtModificarConcepto.replace(/<#>/g, this.concepto),
            iconCls: 'modificar',
            accion: 'modificar',
            disabled: true,
            hidden: this.acciones.indexOf('modificar') != -1 ? false : true
        });

        this.btnEliminar = new Ext.Button({
            text: this.etiquetas.lbBtnEliminar,
            tooltip: this.etiquetas.lbTtEliminarConcepto.replace(/<#>/g, this.concepto),
            iconCls: 'eliminar',
            accion: 'eliminar',
            disabled: true,
            hidden: this.acciones.indexOf('eliminar') != -1 ? false : true
        });

        this.btnSubir = new Ext.Button({
            text: this.etiquetas.lbBtnSubir,
            tooltip: this.etiquetas.lbTtSubir.replace(/<#>/g, this.concepto),
            iconCls: 'subir',
            accion: 'subir',
            disabled: true,
            hidden: this.acciones.indexOf('subir') != -1 ? false : true
        });

        this.btnBajar = new Ext.Button({
            text: this.etiquetas.lbBtnBajar,
            tooltip: this.etiquetas.lbTtBajar.replace(/<#>/g, this.concepto),
            iconCls: 'bajar',
            accion: 'bajar',
            disabled: true,
            hidden: this.acciones.indexOf('bajar') != -1 ? false : true
        });

        this.btnSangriaMas = new Ext.Button({
            text: this.etiquetas.lbBtnSangriaMas,
            tooltip: this.etiquetas.lbTtSangriaMas.replace(/<#>/g, this.concepto),
            iconCls: 'derecha',
            accion: 'aumentar',
            disabled: true,
            hidden: this.acciones.indexOf('massangria') != -1 ? false : true
        });

        this.btnSangriaMenos = new Ext.Button({
            text: this.etiquetas.lbBtnSangriaMenos,
            tooltip: this.etiquetas.lbTtSangriaMenos.replace(/<#>/g, this.concepto),
            iconCls: 'izquierda',
            accion: 'disminuir',
            disabled: true,
            hidden: this.acciones.indexOf('massangria') != -1 ? false : true
        });

        this.items = [this.btnAdicionar, this.btnModificar, this.btnEliminar, '-', this.btnSubir, this.btnBajar, this.btnSangriaMas, this.btnSangriaMenos]
    }
});

Contabilidad.Reporte.VentanaReporte.GridFila = Ext.extend(Ext.grid.GridPanel, {
    allowBlank: false,
    name: 'gridfila',
    initComponent: function () {
        this.etiquetas = this.etiquetas || {};
        this.eliminados = new Array();
        this.crearCuerpo();
        Contabilidad.Reporte.VentanaReporte.GridFila.superclass.initComponent.call(this);
    },

    crearCuerpo: function () {
        this.toolbar = new Contabilidad.Reporte.VentanaReporte.Toolbar({
            etiquetas: this.etiquetas,
            concepto: this.etiquetas.lbFila.toLowerCase()
        });

        this.sm = new Ext.grid.CheckboxSelectionModel();

        this.store = new Ext.data.JsonStore({
            id: 'idconffila',
            url: 'obtenerFilas',
            fields: [
                {
                    name: 'idconffila'
                },
                {
                    name: 'idreportefinanciero'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'orden', type: 'int'
                },
                {
                    name: 'fila'
                },
                {
                    name: 'nrofila'
                },
                {
                    name: 'sangria'
                },
                {
                    name: 'formula'
                }

            ]
        });

        this.title = '<span style = "color: hsl(217, 74%, 31%);font: bold 11px tahoma,arial,verdana,sans-serif;">' + this.etiquetas.lbFilas + '</span>';

        var config = {
            tbar: this.toolbar,
            loadMask: this.etiquetas.lbCargando,
            frame: false,
            border: false,
            stripeRows: true,
            autoExpandColumn: 'expandir',
            autoScroll: true,
            store: this.store,
            sm: this.sm,
            viewConfig: {
                emptyText: this.etiquetas.lbNoResults,
                forceFit: true
            },
            columns: [
                {
                    header: this.etiquetas.lbDenominacion,
                    width: 400,
                    dataIndex: 'denominacion',
                    sortable: true,
                    id: 'expandir',
                    renderer: this.cambiarSangria
                },
                {
                    header: this.etiquetas.lbFila,
                    width: 100,
                    dataIndex: 'fila',
                    sortable: true,
                    fixed: true
                },
                {
                    header: this.etiquetas.lbFormula,
                    width: 500,
                    dataIndex: 'formula',
                    sortable: true,
                    fixed: true,
                    renderer: this.obtenerFormula
                }
            ]
        };

        Ext.apply(this, config);
    },

    obtenerFormula: function (value) {
        var formula = [];
        if (value && Ext.isArray(value)) {

            Ext.each(value, function (v) {
                formula.push(v.text)
            }, this);

        }
        return formula.join('');
    },

    cambiarSangria: function (valor, metaData, record) {
        if (record.data.sangria != 0) {
            var sangria = '';
            for (var k = 0; k <= record.data.sangria; k++) {
                sangria += '&nbsp;&nbsp;'
            }
            return sangria + valor;
        }
        return valor;
    },

    obtenerValor: function () {
        var rango = this.store.getRange(),
            valor = [];
        Ext.each(rango, function (record) {
            valor.push(record.data);
        });
        return valor;
    },

    obtenerValorModificado: function () {
        var rango = this.store.getModifiedRecords(),
            valor = [];
        Ext.each(rango, function (record) {
            valor.push(record.data);
        });
        return valor;
    },

    esValido: function () {
        var valor = this.obtenerValor();
        if (!this.allowBlank && valor.length != 0 || this.allowBlank) {
            return true;
        }
        return false;
    },

    cambiado: function () {
        var modificados = this.store.modified,
            modificados = modificados ? modificados.length != 0 : false,
            eliminados = this.eliminados.length != 0;
        if (modificados || eliminados) {
            return true;
        }
        return false;
    },

    setValor: function (valor) {
        valor = this.formatearValor(valor);
        this.getStore().loadData(valor);
        this.getStore().sort('orden', 'asc');
        if (!this.valorOriginal) {
            this.valorOriginal = Ext.encode(this.obtenerValor());
        }
    },

    resetear: function () {
        this.store.removeAll();
        this.store.modified = new Array();
        this.eliminados = new Array();
    },

    formatearValor: function (valor) {
        Ext.each(valor, function (v) {
            v.formula = Ext.decode(v.formula);
            v.nrofila = v.fila ? true : false;
        });
        return valor;
    }
});

Contabilidad.Reporte.VentanaReporte.GridColumna = Ext.extend(Ext.grid.GridPanel, {
    allowBlank: false,
    name: 'gridcolumna',
    initComponent: function () {
        this.etiquetas = this.etiquetas || {};
        this.eliminados = new Array();
        this.crearCuerpo();
        Contabilidad.Reporte.VentanaReporte.GridColumna.superclass.initComponent.call(this);
    },

    crearCuerpo: function () {
        this.toolbar = new Contabilidad.Reporte.VentanaReporte.Toolbar({
            etiquetas: this.etiquetas,
            acciones: ['adicionar', 'modificar', 'eliminar', 'subir', 'bajar'],
            concepto: this.etiquetas.lbColumna.toLowerCase()
        });

        this.sm = new Ext.grid.CheckboxSelectionModel();

        this.store = new Ext.data.JsonStore({
            id: 'idconfcolumna',
            fields: [
                {
                    name: 'idconfcolumna'
                },
                {
                    name: 'idreportefinanciero'
                },
                {
                    name: 'idcolumna'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'orden', type: 'int'
                },
                {
                    name: 'personalizada'
                },
                {
                    name: 'formula'
                }
            ]
        });

        this.title = '<span style = "color: hsl(217, 74%, 31%);font: bold 11px tahoma,arial,verdana,sans-serif;">' + this.etiquetas.lbColumnas + '</span>';

        var config = {
            tbar: this.toolbar,
            loadMask: this.etiquetas.lbCargando,
            frame: false,
            border: false,
            stripeRows: true,
            autoExpandColumn: 'expandir',
            autoScroll: true,
            store: this.store,
            sm: this.sm,
            viewConfig: {
                emptyText: this.etiquetas.lbNoResults,
                forceFit: true
            },
            columns: [
                {
                    header: this.etiquetas.lbDenominacion,
                    width: 400,
                    dataIndex: 'denominacion',
                    sortable: true,
                    id: 'expandir'
                },
                {
                    header: this.etiquetas.lbFormula,
                    width: 400,
                    dataIndex: 'formula',
                    sortable: true,
                    fixed: true,
                    renderer: this.obtenerFormula
                }
            ]
        };

        Ext.apply(this, config);
    },

    obtenerFormula: function (value, metadata, record) {
        var formula = [];
        if (value && Ext.isArray(value)) {
            Ext.each(value, function (v) {
                formula.push(v.text)
            }, this);

        }
        return formula.join('');
    },

    obtenerValor: function () {
        var rango = this.store.getRange(),
            valor = [];
        Ext.each(rango, function (record) {
            valor.push(record.data);
        });
        return valor;
    },

    obtenerValorModificado: function () {
        var rango = this.store.getModifiedRecords(),
            valor = [];
        Ext.each(rango, function (record) {
            valor.push(record.data);
        });
        return valor;
    },

    esValido: function () {
        var valor = this.obtenerValor();
        if (!this.allowBlank && valor.length != 0 || this.allowBlank) {
            return true;
        }
        return false;
    },

    cambiado: function () {
        var modificados = this.store.modified,
            modificados = modificados ? modificados.length != 0 : false,
            eliminados = this.eliminados.length != 0;
        if (modificados || eliminados) {
            return true;
        }
        return false;
    },

    setValor: function (valor) {
        valor = this.formatearValor(valor);
        this.getStore().loadData(valor);
        this.getStore().sort('orden', 'asc');
        if (!this.valorOriginal) {
            this.valorOriginal = Ext.encode(this.obtenerValor());
        }
    },

    resetear: function () {
        this.store.removeAll();
        this.store.modified = new Array();
        this.eliminados = new Array();
    },

    formatearValor: function (valor) {
        Ext.each(valor, function (v) {
            v.formula = Ext.decode(v.formula);
            v.personalizada = v.idcolumna ? false : true;
            v.denominacion = v.idcolumna ? v.NomColumna.denominacion : v.denominacion;
            v.idcolumna = v.idcolumna ? v.idcolumna : '';
        });
        return valor;
    }
});

Contabilidad.Reporte.VentanaReporte.GridCuerpo = Ext.extend(Ext.grid.EditorGridPanel, {
    allowBlank: true,
    name: 'gridcuerpo',
    clicksToEdit: 2,
    initComponent: function () {
        this.etiquetas = this.etiquetas || {};
        this.eliminados = new Array();
        this.crearCuerpo();
        Contabilidad.Reporte.VentanaReporte.GridColumna.superclass.initComponent.call(this);
    },

    crearCuerpo: function () {
        this.toolbar = new Contabilidad.Reporte.VentanaReporte.Toolbar({
            etiquetas: this.etiquetas,
            acciones: ['adicionar', 'eliminar'],
            concepto: this.etiquetas.lbValor.toLowerCase()
        });

        this.sm = new Ext.grid.CheckboxSelectionModel();

        Contabilidad.Reporte.VentanaReporte.GridCuerpo.Valor = Ext.data.Record.create([
            {name: 'nrofila'},
            {name: 'nombrecolumna'},
            {name: 'columna'},
            {name: 'valor'}
        ]);

        this.store = new Ext.data.JsonStore({
            reader: new Ext.data.ArrayReader({}, Contabilidad.Reporte.VentanaReporte.GridCuerpo.Valor)
        });

        this.title = '<span style = "color: hsl(217, 74%, 31%);font: bold 11px tahoma,arial,verdana,sans-serif;">' + this.etiquetas.lbValores + '</span>';

        this.nffila = new Ext.form.NumberField({
            allowBlank: false
        });

        this.stcolumna = new Ext.data.Store({
            url: 'cargarColumnas',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{name: 'idcolumna'}, {name: 'denominacion'}, {name: 'clasificacion'}])

        });

        this.cmbcolumna = new Ext.form.ComboBox({
            fieldLabel: 'Columna',
            anchor: '99%',
            valueField: 'denominacion',
            displayField: 'denominacion',
            name: 'denominacion',
            triggerAction: 'all',
            editable: true,
            forceSelection: true,
            typeAhead: true,
            allowBlank: false,
            store: this.stcolumna,
            emptyText: 'Seleccione...',
            loadingText: this.etiquetas.lbCargando
        });

        this.nfvalor = new Ext.form.NumberField({
            allowBlank: false
        });

        var config = {
            tbar: this.toolbar,
            loadMask: this.etiquetas.lbCargando,
            frame: false,
            border: false,
            stripeRows: true,
            autoExpandColumn: 'expandir',
            autoScroll: true,
            store: this.store,
            sm: this.sm,
            viewConfig: {
                emptyText: this.etiquetas.lbNoResults,
                forceFit: true
            },
            columns: [
                {
                    header: this.etiquetas.lbNroFilaValor,
                    width: 400,
                    dataIndex: 'nrofila',
                    sortable: true,
                    editor: this.nffila
                },
                {
                    header: this.etiquetas.lbColumna,
                    width: 300,
                    dataIndex: 'nombrecolumna',
                    sortable: true,
                    editor: this.cmbcolumna
                },
                {
                    header: this.etiquetas.lbValor,
                    width: 300,
                    dataIndex: 'valor',
                    sortable: true,
                    id: 'expandir',
                    editor: this.nfvalor
                }
            ]
        };

        Ext.apply(this, config);
    },

    obtenerValor: function () {
        var rango = this.store.getRange(),
            valor = [];
        Ext.each(rango, function (record) {
            valor.push(record.data);
        });
        return valor;
    },

    obtenerValorValido: function () {
        var rango = this.store.getRange(),
            valor = [];
        Ext.each(rango, function (record) {
            var valido = true;
            for (k in record.data) {
                if (record.data[k] == null) {
                    valido = false;
                    break;
                }
            }
            if (valido) {
                valor.push(record.data);
            }
        });
        return valor;
    },

    obtenerValorModificado: function () {
        var rango = this.store.getModifiedRecords(),
            valor = [];
        Ext.each(rango, function (record) {
            valor.push(record.data);
        });
        return valor;
    },

    esValido: function () {
        var valorvalido = this.obtenerValorValido(),
            valor = this.obtenerValor();
        if ((!this.allowBlank && valor.length != 0 || this.allowBlank) && valorvalido.length == valor.length) {
            return true;
        }
        return false;
    },

    cambiado: function () {
        var records = this.store.getRange(),
            modificados = new Array(),
            original = this.originalValue;
        Ext.each(records,function(record){
            modificados.push(record.data);
        });
        modificados = Ext.encode(modificados);
        if(original != modificados){
            return true;
        }
        return false;
    },

    setValor: function (valor) {
        var me = this,
            valor = this.formatearValor(valor);

        if(!this.originalValue){
            this.originalValue = new Array();
        }
        this.originalValue = Ext.encode(valor);
        //loaddata no funciona problema con el reader
        //revisar la definicion
        for (k in valor) {
            if (typeof valor[k] != 'function') {
                var r = new Contabilidad.Reporte.VentanaReporte.GridCuerpo.Valor(valor[k]);
                me.getStore().add(r);
            }
        }
    },

    resetear: function () {
        this.store.removeAll();
        this.store.modified = new Array();
        this.eliminados = new Array();
    },

    formatearValor: function (valor) {
        return valor ? Ext.decode(valor) : [];
    }
});

Contabilidad.Reporte.VentanaReporte.Controller = function (params) {

    Ext.apply(this, params);

    this.inicializarEventos = function () {
        var me = this,
            gridfila = this.view.gridfila,
            gridcolumna = this.view.gridcolumna,
            gridcuerpo = this.view.gridcuerpo;

        this.view.on({
            show: function () {
                if (this.accion == 'modificar') {
                    me.setValores(this, this.record);
                }
            }
        });

        this.view.btnAceptar.on({
            scope: this,
            click: this.salvarReporteFinanciero
        });

        this.view.btnAplicar.on({
            scope: this,
            click: this.salvarReporteFinanciero
        });

        gridfila.on({
            rowdblclick: function () {
                var btn = gridfila.toolbar.btnModificar;
                btn.fireEvent('click', btn);
            }
        });

        gridfila.toolbar.btnAdicionar.on({
            scope: this,
            click: this.crearVentanFila
        });

        gridfila.toolbar.btnModificar.on({
            scope: this,
            click: this.crearVentanFila
        });

        gridfila.toolbar.btnEliminar.on({
            scope: this,
            click: this.eliminarFila
        });

        gridfila.toolbar.btnSangriaMas.on({
            scope: this,
            click: this.aumentarSangria
        });

        gridfila.toolbar.btnSangriaMenos.on({
            scope: this,
            click: this.disminuirSangria
        });

        gridfila.toolbar.btnSubir.on({
            scope: this,
            click: function () {
                this.subirElemento(gridfila);
            }
        });

        gridfila.toolbar.btnBajar.on({
            scope: this,
            click: function () {
                this.bajarElemento(gridfila);
            }
        });

        gridfila.getSelectionModel().on({
            scope: this,
            selectionchange: this.onselectFila
        });

        gridcolumna.on({
            rowdblclick: function () {
                var btn = gridcolumna.toolbar.btnModificar;
                btn.fireEvent('click', btn);
            }
        });

        gridcolumna.getSelectionModel().on({
            scope: this,
            selectionchange: this.onselectColumna
        });

        gridcolumna.toolbar.btnAdicionar.on({
            scope: this,
            click: this.crearVentanColumna
        });

        gridcolumna.toolbar.btnModificar.on({
            scope: this,
            click: this.crearVentanColumna
        });

        gridcolumna.toolbar.btnEliminar.on({
            scope: this,
            click: this.eliminarColumna
        });

        gridcolumna.toolbar.btnSubir.on({
            scope: this,
            click: function () {
                this.subirElemento(gridcolumna);
            }
        });

        gridcolumna.toolbar.btnBajar.on({
            scope: this,
            click: function () {
                this.bajarElemento(gridcolumna);
            }
        });

        gridcuerpo.toolbar.btnAdicionar.on({
            scope: this,
            click: function () {
                this.AdicionarFilaCuerpo(gridcuerpo);
            }
        });

        gridcuerpo.toolbar.btnEliminar.on({
            scope: this,
            click: function () {
                this.EliminarFilaCuerpo(gridcuerpo);
            }
        });

        gridcuerpo.on({
            scope: this,
            validateedit: function (o) {
                if (o.field == 'nombrecolumna') {
                    o.record.data.columna = gridcuerpo.columnaseleccionada;
                }
            },
            afteredit: function (o) {
                gridcuerpo.columnaseleccionada = null;
            }
        });

        gridcuerpo.cmbcolumna.on({
            scope: this,
            select: function (combo, record) {
                gridcuerpo.columnaseleccionada = record.data;
            }
        })

        gridcuerpo.getSelectionModel().on({
            scope: this,
            selectionchange: this.onSelectFilaCuerpo
        });
    };

    this.crearVentanFila = function (btn) {
        if (btn.accion == 'modificar') {
            var record = this.view.gridfila.getSelectionModel().getSelected();
        }

        this.ventanafila = new Contabilidad.Reporte.VentanaFila.View({
                etiquetas: this.etiquetas,
                accion: btn.accion,
                record: record,
                idreporte: this.view.idreporte.getValue()
            }
        )
        ;

        this.ventanafila.on({
            scope: this,
            adicionarfila: this.adicionarFila,
            modificarfila: this.modificarFila,
            antesadicionarfilaformula: this.existeNroFila
        });

        this.ventanafila.show();
    };

    this.adicionarFila = function (ventana, valores) {
        var store = this.view.gridfila.store;
        valores.orden = store.getCount() + 1;
        valores.sangria = 0;
        if (valores.nrofila == 'on') {
            valores.nrofila = true;
            valores.fila = this.setUltimoNroFila();
        } else {
            valores.nrofila = false;
        }

        var record = this.crearRecord(store, valores);
        store.add(record);
        if (!store.modified) {
            store.modified = new Array();
        }
        store.modified.push(record);
        mostrarMensaje(1, 'La fila ha sido adicionada satisfactoriamente.');
    };

    this.modificarFila = function (ventana, valores) {
        var record = ventana.record,
            me = this;
        if (!valores['nrofila']) {
            valores['nrofila'] = false;
            valores['fila'] = '';
        } else {
            valores['nrofila'] = true;
        }
        for (var k in valores) {
            if (k != 'formula') {
                record.set(k, valores[k]);
            } else {
                var inicial = Ext.encode(record.data[k]),
                    actual = Ext.encode(valores[k]);
                record.data.formula = valores[k];
                if (inicial != actual) {
                    record.commit();
                    record.dirty = true;
                    if (!record.modified) {
                        record.modified = {}
                    }
                    record.modified[k] = valores[k];
                    me.view.gridfila.store.afterEdit(record);
                }
            }
        }
        this.reordenarNrosFila();
        mostrarMensaje(1, 'La fila ha sido modificada satisfactoriamente.');
    };

    this.eliminarFila = function (btn) {
        var cantidad = this.view.gridfila.getSelectionModel().getCount(),
            concepto = cantidad != 1 ? 'filas' : 'fila',
            plural = cantidad != 1 ? true : false;

        this.eliminarElemento(this.view.gridfila, concepto, plural);
    };

    this.setUltimoNroFila = function (nro) {
        if (!this.ultimonro) {
            this.ultimonro = 0
        }
        this.ultimonro++;
        if (nro >= 0) {
            this.ultimonro = nro;
        }
        return this.ultimonro
    };

    this.aumentarSangria = function (btn) {
        var records = this.view.gridfila.getSelectionModel().getSelections();

        Ext.each(records, function (record) {
            if (record.data.sangria != 6) {
                record.set('sangria', ++record.data.sangria);
                record.set('denominacion', record.data.denominacion + ' ');
                record.set('denominacion', String.trim(record.data.denominacion));
            }
        }, this);
    };

    this.disminuirSangria = function () {
        var records = this.view.gridfila.getSelectionModel().getSelections();

        Ext.each(records, function (record) {
            if (record.data.sangria != 0) {
                record.set('sangria', --record.data.sangria);
                record.set('denominacion', record.data.denominacion + ' ');
                record.set('denominacion', String.trim(record.data.denominacion));
            }
        }, this);
    };

    this.onselectFila = function (sm) {
        var cant = sm.getCount(),
            tbar = this.view.gridfila.toolbar;
        if (cant == 1) {
            tbar.btnModificar.enable();
            tbar.btnEliminar.enable();
            tbar.btnSangriaMas.enable();
            tbar.btnSangriaMenos.enable();
            tbar.btnSubir.enable();
            tbar.btnBajar.enable();
        } else if (cant > 1) {
            tbar.btnModificar.disable();
            tbar.btnEliminar.enable();
            tbar.btnSubir.disable();
            tbar.btnBajar.disable();
            tbar.btnSangriaMas.enable();
            tbar.btnSangriaMenos.enable();
        } else {
            tbar.btnModificar.disable();
            tbar.btnEliminar.disable();
            tbar.btnSubir.disable();
            tbar.btnBajar.disable();
            tbar.btnSangriaMas.disable();
            tbar.btnSangriaMenos.disable();
        }
    };

    this.reordenarNrosFila = function () {
        var records = this.view.gridfila.getStore().getRange(),
            fila = 1;
        Ext.each(records, function (rec, index) {
            rec.set('orden', index);
            if (rec.data.nrofila) {
                if (rec.data.fila != fila) {
                    rec.set('fila', fila);
                } else {
                    fila = rec.data.fila;
                }
                this.ultimonro = fila;
                fila++;
            }
        }, this);
    };

    this.reordenarColumnas = function () {
        var records = this.view.gridfila.getStore().getRange();
        Ext.each(records, function (rec, index) {
            rec.set('orden', index);
        }, this);
    };

    this.existeNroFila = function (ventana, nro) {
        if (nro > 0 && nro <= this.ultimonro) {
            return true;
        }
        return false;
    };

    this.crearVentanColumna = function (btn) {
        if (btn.accion == 'modificar') {
            var record = this.view.gridcolumna.getSelectionModel().getSelected();
        }

        this.ventanacolumna = new Contabilidad.Reporte.VentanaColumna.View({
            etiquetas: this.etiquetas,
            accion: btn.accion,
            record: record
        });

        this.ventanacolumna.on({
            scope: this,
            adicionarcolumna: this.adicionarColumna,
            modificarcolumna: this.modificarColumna
        });

        this.ventanacolumna.show();
    };

    this.eliminarColumna = function (btn) {
        var cantidad = this.view.gridcolumna.getSelectionModel().getCount(),
            concepto = cantidad != 1 ? 'columnas' : 'columna',
            plural = cantidad != 1 ? true : false;

        this.eliminarElemento(this.view.gridcolumna, concepto, plural);
    };

    this.adicionarColumna = function (ventana, valores) {
        var store = this.view.gridcolumna.store;
        valores.orden = store.getCount() + 1;
        if (valores.personalizada == 'on') {
            valores.personalizada = true;
        } else {
            valores.personalizada = false;
        }

        var record = this.crearRecord(store, valores);
        store.add(record);
        if (!store.modified) {
            store.modified = new Array();
        }
        mostrarMensaje(1, 'La columna ha sido adicionada satisfactoriamente.');
        store.modified.push(record);
    };

    this.modificarColumna = function (ventana, valores) {
        if (valores.personalizada == 'on') {
            valores.personalizada = true;
        } else {
            valores.personalizada = false;
        }
        for (k in valores) {
            ventana.record.set(k, valores[k]);
        }
        mostrarMensaje(1, 'La columna ha sido modificada satisfactoriamente.');
    };

    this.onselectColumna = function (sm) {
        var cant = sm.getCount(),
            tbar = this.view.gridcolumna.toolbar;
        if (cant == 1) {
            tbar.btnModificar.enable();
            tbar.btnEliminar.enable();
            tbar.btnSubir.enable();
            tbar.btnBajar.enable();
        } else if (cant > 1) {
            tbar.btnModificar.disable();
            tbar.btnEliminar.enable();
            tbar.btnSubir.disable();
            tbar.btnBajar.disable();
        } else {
            tbar.btnModificar.disable();
            tbar.btnEliminar.disable();
            tbar.btnSubir.disable();
            tbar.btnBajar.disable();
        }
    };

    this.subirElemento = function (grid) {
        var store = grid.getStore(),
            record = grid.getSelectionModel().getSelected(),
            index = store.findBy(function (r) {
                if (r.id == record.id) {
                    return true;
                }
            }),
            anterior = store.getAt(index - 1);

        if (index != -1 && index != 0) {
            if (anterior) {
                anterior.set('orden', anterior.data.orden + 1);
            }
            record.set('orden', record.data.orden - 1);
        }
        store.sort('orden', 'ASC');
        if (grid.name == 'gridfila') {
            this.reordenarNrosFila();
        }
    };

    this.bajarElemento = function (grid) {
        var store = grid.getStore(),
            record = grid.getSelectionModel().getSelected(),
            index = store.findBy(function (r) {
                if (r.id == record.id) {
                    return true;
                }
            }),
            posterior = store.getAt(index + 1);

        if (index != -1 && index != store.getCount() - 1) {
            record.set('orden', record.data.orden + 1);
            if (posterior) {
                posterior.set('orden', posterior.data.orden - 1);
            }
        }

        store.sort('orden', 'ASC');
        if (grid.name == 'gridfila') {
            this.reordenarNrosFila();
        }
    };

    this.crearRecord = function (store, values) {
        var arrTemp = [];
        var objTemp = {};
        Ext.each(store.fields.keys, function (key) {
            arrTemp.push({name: key});
            objTemp[key] = values[key];
        });
        var RecordDinamico = Ext.data.Record.create(arrTemp),
            record = new RecordDinamico(objTemp);
        return record;
    };

    this.eliminarElemento = function (grid, concepto, plural) {
        var me = this,
            mensaje = plural ? this.etiquetas.lbConfirmEliminarPluFem : this.etiquetas.lbConfirmEliminarSingFem,
            mensaje = mensaje.replace(/<#>/g, concepto),
            records = grid.getSelectionModel().getSelections();
        mostrarMensaje(2, mensaje, function (btn) {
            if (btn == 'ok') {
                Ext.each(records, function (record) {
                    var id = grid.getStore().id;
                    if (record.data[id]) {
                        grid.eliminados.push(record.data[id]);
                    } else {
                        record.commit();
                    }
                    grid.getStore().remove(record);
                });
                if (grid.name == "gridfila") {
                    me.reordenarNrosFila();
                } else {
                    me.reordenarColumnas()
                }
                mostrarMensaje(1, 'La ' + concepto + ' ha sido eliminada satisfactoriamente.');
            }
        });
    };

    this.salvarReporteFinanciero = function (btn) {
        var parametros = this.view.form.getForm().getValues(),
            text = this.etiquetas.msgGuardando,
            title = this.etiquetas.msgEspere,
            me = this;

        parametros.filas = Ext.encode({
            modificados: this.view.gridfila.obtenerValorModificado(),
            eliminados: this.view.gridfila.eliminados
        });
        parametros.columnas = Ext.encode({
            modificados: this.view.gridcolumna.obtenerValorModificado(),
            eliminados: this.view.gridcolumna.eliminados
        });
        parametros.cuerpo = Ext.encode(this.view.gridcuerpo.obtenerValor());
        this.mostrarMensajeEspera(title, text);

        Ext.Ajax.request({
            url: 'salvarReporteFinanciero',
            params: parametros,
            scope: this,
            callback: function (options, success, respuesta) {
                this.tratarRespuesta(respuesta);
                if (btn.accion == 'aceptar') {
                    this.view.destroy();
                } else {
                    this.resetearVentana();
                    this.view.primercampo.focus(false, 100);
                }
            }
        });
    };

    this.mostrarMensajeEspera = function (titulo, mensaje) {

        Ext.MessageBox.show({
            title: titulo,
            msg: mensaje,
            width: 300,
            wait: true,
            waitConfig: {interval: 300},
            progress: true,
            closable: false
        });
    };

    this.tratarRespuesta = function (respuesta) {
        var respuesta = Ext.decode(respuesta.responseText),
            mensaje = this.view.accion == 'adicionar' ? this.etiquetas.msgAdicionando : this.etiquetas.msgModificado;

        if (respuesta.codigo == 1) {
            mostrarMensaje(1, mensaje);
        } else {
            mostrarMensaje(3, 'Ocurrió un error durante la operacion.');
        }

        Ext.MessageBox.hide();
    };

    this.setValores = function (window, record) {
        var filas = record.data.filas,
            ultima = filas[filas.length - 1];
        window.form.getForm().loadRecord(record);
        window.gridfila.setValor(record.data.filas);
        window.gridcolumna.setValor(record.data.columnas);
        window.gridcuerpo.setValor(record.data.cuerpo);
        this.setUltimoNroFila(parseInt(ultima['fila']));
    };

    this.resetearVentana = function () {
        this.view.form.getForm().reset();
        this.view.gridfila.resetear();
        this.view.gridcolumna.resetear();
        this.setUltimoNroFila(0);
    };

    this.AdicionarFilaCuerpo = function (grid) {
        var store = grid.getStore(),
            r = new Contabilidad.Reporte.VentanaReporte.GridCuerpo.Valor({
                nrofila: null,
                nombrecolumna: null,
                columna: null,
                valor: null
            });

        grid.stopEditing();
        store.add(r);
        var pos = store.getCount() - 1;
        grid.startEditing(pos, 0);
    };

    this.EliminarFilaCuerpo = function (grid) {
        var records = grid.getSelectionModel().getSelections();
        records.forEach(function (record) {
            grid.getStore().remove(record);
        });
    };

    this.onSelectFilaCuerpo = function (sm) {
        var tbar = this.view.gridcuerpo.toolbar,
            cant = sm.getCount();
        if (cant != 0) {
            tbar.btnEliminar.enable();
        } else {
            tbar.btnEliminar.disable();
        }
    }
};