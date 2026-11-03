/**
 * User: adrian
 * Date: 10/09/13
 * Time: 10:34
 * Info del componente: En el grid se crean las columnas y los records dinamicamente, segun las columnas que se le pasen por parametros.
 *                      Los componente editables de que contienen las columnas tambien son creados dinamicamente.
 *                      Para adicionar una nueva columna: (Teoricamente)
 *                          1- Ir a la modelo DatRegNumericoModel y en el metodo devolverColumnas agregar la columna.
 *                          2- En caso de que la columna sea de tipo combo porque los datos los carga de un nomenclador ya definido:
 *                              2.1- Ir a la misma modelo y en el metodo cargarCombo agregar la columna en el switch.
 *
 *                      Ojo: El guardar, el modificar etc, lo hace dinamicamente, lo que quiere decir que no se deberian tocar.
 */

Ext.ns('Ext.aft');
Ext.grid.CheckColumn = function (config) {
    Ext.apply(this, config);
    if (!this.id) {
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};
Ext.grid.CheckColumn.prototype = {
    init: function (grid) {
        this.grid = grid;
        if (typeof (this.grid.editable) == 'undefined' || this.grid.editable) {
            this.grid.on('render', function () {
                var view = this.grid.getView();
                view.mainBody.on('mousedown', this.onMouseDown, this);
            }, this);
        }

    },
    onMouseDown: function (e, t) {
        if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
            this.grid.getSelectionModel().selectRow(index);
            record.set(this.dataIndex, !record.data[this.dataIndex]);
        }
    },
    renderer: function (v, p, record) {
        p.css += ' x-grid3-check-col-td';
        return '<div class="x-grid3-check-col' + ((v == true || v == 1) ? '-on' : '') + ' x-grid3-cc-' + this.id + '">&#160;</div>';
    }
};
if (!Ext.aft.regNumerico) {
    Ext.ns('Ext.aft.regNumerico');
}

Ext.aft.regNumerico.panelBuscarResponsable = Ext.extend(Ext.Panel, {
    layout: 'fit',
    singleSelect: true,

    initComponent: function() {
        var _this = this;
        this.addEvents('personaselecionada', 'personadeselecionada');

        this.stPersonas = new Ext.data.JsonStore({
            url: '/logistica/activos_fijos/utiles/index.php/gestregnumerico/getresponsablesueb',
            baseParams: { start: 0, limit: 25 },
            root: 'datos',
            totalProperty: 'cantidad',
            idProperty: 'idpersona',
            fields: ['idpersona', 'numid', 'nombreyapellidos', 'sexo'],
            listeners: {
                beforeload: function(store) {
                    store.baseParams.identidad = Ext.encode(_this.identidad);
                }
            }
        });

        var sexoRenderer = function (val) {
            if (val === 'Femenino' || val === '0') {
                return '<center><img ext:qtip="<b>Femenina</b> "src="data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHgSURBVDjLjZLNbtNAFIXrJ8mL+QVQoVUWICFEFZCAbrJCAdpFWCC1i1QgVLEoZYFAgrY0rhPHTmwnThP/BKetU9vxT7I5zHWEhEBuWBxpFnO+c+6dWQGw8qfUisQNdnR+tD+ojQ9txz2wHPvdea1f7fDtssj9ff8fs7VnlCbCJRIzwsxNMfuZIuoGuPriwtjqlOSndS4XQMlkJuPcm2F+yXSxUGrHcD9YUDcbfC6AalMyGaNuiIvDEdx9C0FjwqAJfMGD/qRZywXQvFk6SxwfOOhvdwpGRSnYb/pslASxMYX6UHRuaDB0aGYCuO9N9J4rhW65VTC39AWgN0XnnpAPMHeN2lT1F3XrHqzXBsxXOq4+u0idGN7XMeTiaf4IvRcKP/5oIxlEWSKJjCTayeClhubaUf4SlWcCp5el0ujtEGHrOtt8asUIxQmGzCzdOS6JxW/5z5hBHguc9qjJdzekfqQGSM4jdFaFsHX7hG+sf7/5I5HaG2dV7UFD0+6K2lTxs8W1b536yuoPTVo72lwKUO+Lc6pP5nQYZ/uIeyGCMw+shbYUoBTrGYBE9UmhdI1A9CD/D0BaP6nKrC6rrZGRRGc5G+H401LAb5HBZ7WpOp3z7uUC2HtXqDKJJe/k3fsF8TkmWq5zP6gAAAAASUVORK5CYII=" /></center>';
            } else {
                return '<center><img ext:qtip="<b>Maculino</b>" src="data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIHSURBVDjLpVNNaxNRFH0fgzNxRlNIm6QVsSRQ1IUiVCSCS8FF4kokO/9BF7oUstBll4IuunBpl61RNy4suhgF21WhJVU0WiHUksmQr2bex/TeMJEoxog+uMzjzT3nnXPmDg3DkPzPMsY1PHrpdaWUZFBCDJ6C3L91NjaWAAH5SwkLhaJaTfBJyOOnmwf4no0lkIJUqg2hAKUAqKMKQMFfEdy5PhN7X/Ge1L22QqACCUFPhCIIvv6UwdJaiyopi1KqAnjMRZ5dUDBzbta5fDxuc99vafuYw9SQgj7B0qsmBeDdTJKXUhMWi5mcaRKSVrt30uCcHrFMtrv7Xb5wq8+uzp/Ip1MJLoYJ4KZiZsoozU5bBqWM9r8slO0c5bjvdrr6uVt9B6CF1dcfrgm5JVHhDwJIuoA3QyS0tteUGzueEtBwIRvnyXTC6HR76PnLw9tX0HdsOCMWJZ0zLZANt63v1NV+ozO377Xn3M2a0hCabdsMPOdGDhL60dFASthjQHgmOOufK/Az8PzrYhGB22wdaGw+n5ngjkkrjsUqF88kOZ75dV9jz2gFgSh/+ubfOJ012VR60sinJg0UhGApgnDrYw0IZHkkAUheXt/ey/aCoHRqOs4cx+7n4TcaehvAbzY+34PUl39HQAd/48KDtxT8FyH9ghQyhyOMgwRVRvDK4s3wjwT/ug4BPyZOkZTlSM0AAAAASUVORK5CYII=" /></center>';
            }
        };

        var cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            {header: 'No Identidad', dataIndex: 'numid', width: 120, sortable: true},
            {header: 'Nombre y apellidos', dataIndex: 'nombreyapellidos', width: 350, sortable: true},
            {header: 'Sexo', dataIndex: 'sexo', width: 50, align: 'center', renderer: sexoRenderer}
        ]);

        this.tfbuscar = new Ext.form.TextField({
            id: 'tfbuscar',
            enableKeyEvents: true,
            name: 'tfbuscar',
            emptyText: 'Buscar responsable...',
            listeners: {
                specialkey: function(field, e){
                    if (e.getKey() == e.ENTER) {
                        this.searchFieldHandler();
                    }
                }.createDelegate(this)
            }
        });

        this.btnLimpiarBusqueda = new Ext.Button({
            id: 'btnLimpiarBusqueda',
            tooltip: 'Limpiar búsqueda',
            iconCls: 'limpiar',
            listeners: {
                'click': () => {
                    this.cleanSearch();
                }
            }
        });

        this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
            tooltip: 'Buscar persona',
            iconCls: 'buscar',
            listeners: {
                'click': () => {
                    this.searchFieldHandler();
                }
            }
        });

        this.pagingToolbar = new Ext.PagingToolbar({
            pageSize: 25,
            store: this.stPersonas,
            displayInfo: true,
            displayMsg: 'Mostrando {0} - {1} de {2}',
            emptyMsg: "Sin resultados",
        });

        this.gpPersonas = new Ext.grid.GridPanel({
            border: false,
            store: this.stPersonas,
            colModel: cm,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: this.singleSelect,
                listeners: {
                    selectionchange: function(sm) {
                        if (sm.getCount() > 0) {
                            _this.fireEvent('personaselecionada', _this, sm.getSelected());
                        } else {
                            _this.fireEvent('personadeselecionada', _this);
                        }
                    }
                }
            }),
            viewConfig: { forceFit: true },
            tbar: [
                this.tfbuscar, 
                this.btnBuscar,
                this.btnLimpiarBusqueda
            ],
            bbar: this.pagingToolbar
        });

        this.items = [this.gpPersonas];
        
        Ext.aft.regNumerico.panelBuscarResponsable.superclass.initComponent.call(this);
        
        this.stPersonas.load({params: {start: 0, limit: 25}});
    },

    getSeleccion: function() {
        return this.gpPersonas.getSelectionModel().getSelected();
    },

    searchFieldHandler: function() {
        this.stPersonas.baseParams.criterio = this.tfbuscar.getValue();
        this.stPersonas.load({params: {start: 0, limit: this.pagingToolbar.pageSize}});
    },

    cleanSearch: function() {
        this.tfbuscar.reset();
        delete this.stPersonas.baseParams.criterio;
        this.stPersonas.load({params: {start: 0, limit: this.pagingToolbar.pageSize}});
    }
});
   
/**
 * Grid generico
 */
Ext.aft.regNumerico.grid = Ext.extend(Ext.grid.EditorGridPanel, {
    filaSeleccionada: false,
    idEstadoUno: false,
    denomEstadoUno: false,
    constructor: function (config) {
        Ext.applyIf(this, config);
        var _this = this;
        this.datos = config.datos;
        this.idioma = config.idioma;
        this.clicksToEdit = 1;
        this.crearSelectionModel();
        // this.editable = ()?config.editable:false;
        this.tipo = config.scope.tipo;
        //this.enableColumnMove =  false,

        this.array_columnas = new Array();
        this.array_plugins = new Array();
        this.array_pNivel = new Array();
        this.array_records = new Array();
        this.array_tbar = new Array();
        this.pluginsCMPS = new Array();
        this.modifyMonedas = false;
        for (var i = 0; i < arrCampos.length; i++) {
            this.attatchPlugin(arrCampos[i]);
        }
        this.campos = LOG.aft.RegOperativo.Campos;
        Ext.each(this.pluginsCMPS, function (plugin) {
            plugin.init(_this);
        });
        if (_this.contandoTodavia()) {
            this.array_columnas.push(_this.sm);
        }
        /* this.array_columnas.push(new Ext.grid.RowNumberer({
         header: 'N\xBA.',
         width: 30
         }));*/
        /* this.array_pNivel.push({
         'header': _this.array_columnas[0].header
         });*/
        // this.array_columnas[0].header = '';
        /*this.array_records.push({
         name: 'nro'
         });*/
        this.array_regnumeicos = new Array();
        if (_this.datos.inventario) {
            this.array_records.push({
                name: 'color'
            });
        }

        this.plugins = this.checkColumn;
        this.forzado = false;
        this.monedasVisibles = undefined;
        this.RellenarColumModel();
        /*var group = new Ext.ux.grid.ColumnHeaderGroup({
         rows: [_this.array_pNivel]
         });
         this.array_plugins.push(group);*/
        this.plugins = this.array_plugins;

        this.cm = new Ext.grid.ColumnModel(this.array_columnas);
        this.crearStore();
        /**
         * Componente de la busqueda basica
         */
        if (this.array_tbar.length > 0) {
            this.limpiarBtn = new Ext.Button({
                id: 'idLimpiarBtn',
                iconCls: 'limpiar',
                text: _this.idioma.lbBtnLimpiar
            });
            this.limpiarBtn.on('click', function () {
                var items = _this.array_tbar;
                for (var i = 0; i < items.length; i++) {
                    if (items[i].identificador) {
                        if (items[i].getValue() != '') {
                            items[i].reset();
                        }
                    }
                }
                _this.getStore().load();
            });
            this.buscarBtn = new Ext.Button({
                id: 'idBuscarBtn',
                iconCls: 'buscar',
                text: this.idioma.lbBtnbuscar
            });
            this.buscarAvanzBtn = new Ext.Button({
                id: 'idBuscarAvanzBtn',
                iconCls: 'buscaravanzada',
                text: _this.idioma.lbBtnbuscarAvanz,
                tooltip: _this.idioma.lbTtBtnbuscarAvanz
            });
            this.buscarAvanzBtn.on('click', function () {
                _this.crearWinBsuquedaAvanzada();
            });
            this.buscarBtn.on('click', function () {
                _this.getStore().reload();
            });
            this.array_tbar.push(this.buscarBtn);
            this.array_tbar.push(this.buscarAvanzBtn);
            this.array_tbar.push(this.limpiarBtn);
            this.tbar = this.array_tbar;
        }
        if (_this.scope.datos.tipo_interfaz == 'no_entrada') {

            _this.btnBusAvanz = new Ext.Button({
                //id: 'btnBuscar',
                id: _this.url + 3,
                iconCls: 'buscaravanzada',
                disabled: false,
                text: 'B&uacute;squeda avanzada',
                tooltip: 'Buscar registro num&eacute;rico',
                handler: function () {
                    if (!_this.busqueda) {
                        _this.busqueda = new Ext.aft.regNumerico.BusquedaEstatica({
                            idioma: _this.idioma,
                            scope: _this,
                            cerrarAceptar: false,
                            tipo: 1
                        });
                    }

                    _this.busqueda.show();
                    _this.busqueda.center()
                    var tempPrimario = _this.busqueda.arrayAlturas[0];
                    var tempSecundario = 0;
                    Ext.each(_this.busqueda.arrayAlturas, function (o, p) {
                        tempSecundario = _this.busqueda.arrayAlturas[p + 1];
                        if (tempPrimario < tempSecundario)
                            tempPrimario = tempSecundario;
                    });

                    _this.busqueda.setHeight(tempPrimario + 115);
                    _this.busqueda.heitghInicial = tempPrimario + 115;
                    Ext.each(_this.busqueda.tabpanel.items.items, function (o, p) {
                        o.setHeight(tempPrimario);
                    });
                    //_this.busqueda.panelDatosG.setHeight(tempPrimario);
                    //_this.busqueda.panelDatosG.doLayout();
                    _this.busqueda.panelGeneral.doLayout();
                }
            });
            this.tbar = ['->', _this.btnBusAvanz];
        }

        this.bbar = new Ext.PagingToolbar({
            store: _this.store,
            pageSize: 30,
            displayInfo: true
        });
        this.clicksToEdit = 1;
        this.loadMask = {
            store: _this.store
        };
        this.listeners = {
            'rowdblclick': function (g, rowIndex, e) {
                /* if (_this.datos.inventario) {
                 if(_this.validarColorStore() != -1){
                 mostrarMensaje(1, "Debe guardar el listado antede de iniciar el conteo.");
                 return;
                 }
                 var recordGrid = _this.store.getAt(rowIndex);
                 var add = true;
                 if (_this.validarColorFaltantes(recordGrid)) {
                 for (var i = 0; i < _this.negros; i++) {
                 if (_this.negros[i] == recordGrid.data.idregnumerico) {
                 add = false;
                 break;
                 }
                 }
                 
                 if (add) {
                 _this.negros.push(recordGrid.data.idregnumerico);
                 var nuevos = new Array();
                 for (var j = 0; j < _this.rojos.length; j++) {
                 
                 if (_this.rojos[j] != recordGrid.data.idregnumerico) {
                 nuevos.push(_this.rojos[j]);
                 }
                 }
                 
                 _this.rojos = nuevos;
                 }
                 } else if (recordGrid.data.color == 'negro') {
                 var add2 = true;
                 for (var i = 0; i < _this.negros; i++) {
                 if (_this.rojos[i] == recordGrid.data.idregnumerico) {
                 add2 = false;
                 break;
                 }
                 }
                 
                 if (add2) {
                 _this.rojos.push(recordGrid.data.idregnumerico);
                 var nuevos2 = new Array();
                 for (var l = 0; l < _this.negros.length; l++) {
                 
                 if (_this.negros[l] != recordGrid.data.idregnumerico) {
                 nuevos2.push(_this.negros[l]);
                 }
                 }
                 
                 _this.negros = nuevos2;
                 }
                 }
                 
                 if (_this.array_regnumeicos.length > 0 && recordGrid.data.idregnumerico) {
                 var banderaN = true;
                 for (var k = 0; k < _this.array_regnumeicos.length; k++) {
                 
                 if (_this.array_regnumeicos[k] == recordGrid.data.idregnumerico) {
                 banderaN = false;
                 break;
                 }
                 }
                 
                 if (banderaN) {
                 _this.array_regnumeicos.push(recordGrid.data.idregnumerico);
                 }
                 
                 
                 } else {
                 
                 _this.array_regnumeicos.push(recordGrid.data.idregnumerico);
                 }
                 
                 
                 _this.first = 3;
                 if (recordGrid.data.color != "verde") {
                 _this.store.reload();
                 }
                 
                 
                 }*/
            },
            'render': function () {
                if (_this.autoCargar) {
                    _this.getStore().load();
                }
            },
            'beforeedit': function (e) {
                if (_this.datos.inventario) {
                    if (e.record.data.color != "verde") {
                        e.cancel = true;
                    }
                }
            }
        };
        this.crearBotonesPropios();
        Ext.aft.regNumerico.grid.superclass.constructor.apply(this, arguments);
        this.on({
            'render': function () {

            }
        });

        _this.fireEvent = _this.fireEvent.createSequence(function (e, obj) {
            if (e == 'afteredit') {
                var rec = obj.record;
                if (obj.field == 'fechaexpini' && rec.data.vidautil && rec.data.fechaexpfin != 'undefined') {
                    //_this.store.getAt(_this.store.indexOf(_this.getSelectionModel().getSelected())).set('id' + columna.dataIndex, null);
                    var fecha = obj.value;
                    if (fecha) {
                        var dia = fecha.getDate();
                        var mes = fecha.getMonth() + 1;
                        var anio = fecha.getFullYear();
                        var calculo = (parseInt(anio) + parseInt(rec.data.vidautil));
                        var nuevafecha = new Date(calculo, mes, dia);
                        dia = (dia < 10) ? '0' + dia : dia;
                        mes = (mes < 10) ? '0' + mes : mes;
                        //var total = dia + '/' + mes + '/' + calculo;
                        rec.data.fechaexpfin = nuevafecha.format('d/m/Y');
                        _this.getView().refresh();
                    }
                } else if (obj.field == 'fechaexpfin' && rec.data.vidautil && rec.data.fechaexpini != 'undefined') {
                    var fecha = obj.value;
                    var dia = fecha.getDate();
                    var mes = fecha.getMonth() + 1;
                    var anio = fecha.getFullYear();
                    if (_this.datos.vidautil < anio) {
                        var calculo = (parseInt(anio) - parseInt(rec.data.vidautil));
                        dia = (dia < 10) ? '0' + dia : dia;
                        mes = (mes < 10) ? '0' + mes : mes;
                        var total = dia + '/' + mes + '/' + calculo;
                        rec.data.fechaexpini = total;
                        _this.getView().refresh();
                    }
                } else if (obj.field == 'vidautil' && rec.data.fechaexpini != 'undefined' && rec.data.fechaexpfin != 'undefined') {
                    if (rec.data.fechaexpini) {
                        var fecha = rec.data.fechaexpini;
                        var dia = fecha.getDate();
                        var mes = fecha.getMonth() + 1;
                        var anio = fecha.getFullYear();
                        var calculo = (parseInt(anio) + parseInt(obj.value));
                        dia = (dia < 10) ? '0' + dia : dia;
                        mes = (mes < 10) ? '0' + mes : mes;
                        var total = dia + '/' + mes + '/' + calculo;
                        rec.data.fechaexpfin = total;
                        _this.getView().refresh();
                    } else if (rec.data.fechaexpfin) {
                        var fecha = rec.data.fechaexpfin;
                        var dia = fecha.getDate();
                        var mes = fecha.getMonth() + 1;
                        var anio = fecha.getFullYear();
                        if (_this.datos.vidautil < anio) {
                            var calculo = (parseInt(anio) - parseInt(obj.value));
                            dia = (dia < 10) ? '0' + dia : dia;
                            mes = (mes < 10) ? '0' + mes : mes;
                            var total = dia + '/' + mes + '/' + calculo;
                            rec.data.fechaexpini = total;
                            _this.getView().refresh();
                        }
                    }
                } else if (obj.field == 'ficav' && rec.data.vencimientoficav != 'undefined') {
                    var fecha = obj.value;
                    if (fecha) {
                        var dia = fecha.getDate();
                        var mes = fecha.getMonth() + 1;
                        var anio = fecha.getFullYear();
                        var calculo = (parseInt(anio) + 1);
                        dia = (dia < 10) ? '0' + dia : dia;
                        mes = (mes < 10) ? '0' + mes : mes;
                        var total = dia + '/' + mes + '/' + calculo;
                        rec.data.vencimientoficav = total;
                        _this.getView().refresh();
                    }
                } else if (obj.field == 'lot' && rec.data.vencimientolot != 'undefined') {
                    var fecha = obj.value;
                    if (fecha) {
                        var dia = fecha.getDate();
                        var mes = fecha.getMonth() + 1;
                        var anio = fecha.getFullYear();
                        var calculo = (parseInt(anio) + 3);
                        dia = (dia < 10) ? '0' + dia : dia;
                        mes = (mes < 10) ? '0' + mes : mes;
                        var total = dia + '/' + mes + '/' + calculo;
                        rec.data.vencimientolot = total;
                        _this.getView().refresh();
                    }
                } else if (obj.field == 'expedicioncirculacion' && rec.data.vencimientocirculacion != 'undefined') {
                    var fecha = obj.value;
                    var matr = (rec.data.nromatricula && rec.data.nromatricula[0].toLowerCase() == "t");

                    if (fecha && !matr) {
                        var dia = fecha.getDate();
                        var mes = fecha.getMonth() + 1;
                        var anio = fecha.getFullYear();
                        var calculo = (parseInt(anio) + 5);
                        dia = (dia < 10) ? '0' + dia : dia;
                        mes = (mes < 10) ? '0' + mes : mes;
                        var total = dia + '/' + mes + '/' + calculo;
                        rec.data.vencimientocirculacion = total;
                        _this.getView().refresh();
                    }
                }

            }
        });
    },
    attatchPlugin: function (plugin) {
        this.pluginsCMPS.push(plugin);
    },
    contandoTodavia: function () {
        var _this = this;
        return (_this.datos.inventario && _this.datos.idestado == 2 && !_this.marcarDesdeStore);
    },
    crearSelectionModel: function () {
        var _this = this;
        if (_this.contandoTodavia()) {
            var sm = new Ext.grid.CheckboxSelectionModel({
                singleSelect: false
            });
        } else {
            var sm = new Ext.grid.RowSelectionModel({
                singleSelect: false
            });
        }
        sm.on({
            'rowselect': function (sm, rowIndex, r) {
                Ext.Ajax.abort();
                if (_this.filaSeleccionada != rowIndex || !_this.filaSeleccionada) {
                    _this.filaSeleccionada = rowIndex;
                }

                if (_this.datos.inventario) {
                    if (r.data.color != 'verde') {
                        _this.btnEliminar.disable();
                    } else {
                        _this.btnEliminar.enable();
                    }
                }

                _this.modificarValorConteo(r);

            },
            'rowdeselect': function (sm, rowIndex, r) {
                _this.filaSeleccionada = false;
                _this.modificarValorConteo(r);
            }

        });
        sm.rowspan = 2;
        this.sm = sm;
    },
    modificarValorConteo: function (r) {
        var _this = this;
        if (!_this.contandoTodavia())
            return;
        if (_this.validarColorFaltantes(r)) {
            r.data.color = 'negro';
        } else if (r.data.color == 'negro') {
            r.data.color = 'rojo';
        }
        _this.getView().refresh();
    },
    crearStore: function () {

        var _this = this;
        _this.first = 3;
        var prueba = true;
        var Record = Ext.data.Record.create(_this.array_records);
        //_this.verdes = new Array();
        //_this.negros = new Array();
        //_this.rojos = new Array();
        _this.marcarDesdeStore = false;
        this.store = new Ext.data.Store({
            url: _this.url,
            reader: new Ext.data.JsonReader({
                totalProperty: "total",
                root: "datos",
                id: "idnumerosseriesalida"
            }, Record),
            listeners: {
                'beforeLoad': function (store, obj) {

                    var params = new Object();
                    params.idmovimiento = _this.datos.idmovimiento;
                    params.idproducto = _this.datos.idproducto;
                    params.idoperacion = _this.datos.idoperacion;
                    params.tipo_interfaz = _this.datos.tipo_interfaz;
                    params.codigooperacion = _this.datos.codigooperacion;
                    params.idestructuraop = _this.datos.idarearesp;
                    params.idestructurapadre = _this.datos.idestructurapadre;
                    if (_this.datos.inventario) {
                        if (_this.datos.idestado != "1") {
                            params.seriesdisponibles = 2;
                        } else {
                            params.seriesdisponibles = "";
                        }
                        params.inventario = 2;
                        //params.verdes = _this.verdes;
                        //params.negros = _this.negros;
                        //params.rojos = _this.rojos;
                        //params.first = _this.first;
                    }

                    var items = _this.array_tbar;
                    //Para las busquedas
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].identificador) {
                            if (items[i].getValue() != '') {
                                params[items[i].identificador] = items[i].getValue();
                            }
                        }
                    }
                    store.baseParams.parametros = Ext.encode(params);
                    store.baseParams.tipo = _this.tipo;
                    _this.mascara = new Ext.LoadMask(_this.getEl(), {msg: "Cargando..."});
                    _this.mascara.show();
                },
                'load': function (st, records, opt) {
                    _this.mascara.hide();
                    if (records.length > 0) {
                        var filasMarcadas = new Array();
                        for (var i = 0; i < records.length; i++) {
                            _this.array_regnumeicos.push(records[i].data.idregnumerico);
                            if (records[i].data.color == -1) {
                                _this.first = "";
                            }
                            if (records[i].data.color == "negro") {
                                filasMarcadas.push(records[i]);
                            }
                        }
                        if (_this.datos.inventario && filasMarcadas.length > 0) {
                            _this.marcarDesdeStore = true;
                            _this.getSelectionModel().selectRecords(filasMarcadas);
                            _this.marcarDesdeStore = false;
                        }

                        /*if (_this.validarSiGuardoInventario()) {
                         for (var i = 0; i < records.length; i++) {
                         if (_this.validarColorFaltantes(records[i])) {
                         _this.rojos.push(records[i].data.idregnumerico);
                         _this.array_regnumeicos.push(records[i].data.idregnumerico);
                         //records[i].data.color = 'rojo';
                         }
                         }
                         
                         }*/

                    } else {
                        var flag = false;
                        var params = Ext.decode(st.baseParams.parametros);
                        for (var i = 0; i < _this.array_columnas.length; i++) {


                            for (var property in params) {
                                if (property == _this.array_columnas[i].dataIndex) {
                                    flag = true;
                                    break;
                                }
                            }
                            if (flag) {
                                break;
                            }
                        }
                        if (flag) {
                            mostrarMensaje(1, _this.idioma.lbMsgNoHayDatosBusqueda);
                        }
                    }
                }
            }
        });
    },
    validarColorFaltantes: function (record) {
        return (!record.data.color || record.data.color == -1 || record.data.color == 'rojo');
    },
    validarSiGuardoInventario: function () {
        var _this = this;
        return (_this.datos.inventario && !_this.first);
    },
    RellenarColumModel: function () {
        var _this = this;



        //  Poniendo records necesarios obligatorios en el grid
        _this.arrayColMonedas = Array();
        this.array_records.push({
            name: 'idregnumerico'
        });
        this.array_records.push({
            name: 'idmovregnumerico'
        });
        this.array_records.push({
            name: 'idtabla'
        });
        this.array_records.push({
            name: 'arridtablas'
        });
        this.array_records.push({
            name: 'iddenomestadotecnico'
        });
        this.array_records.push({
            name: 'modify'
        });

        for (var i = 0; i < this.datos.columnas.length; i++) {

            var col = this.datos.columnas[i];
            var columna = _this.campos[col.name];
            if (columna) {
                columna.editable = col.editable;
                columna.renderer = function (value, dos, record) {
                    if (value != null) {
                        if (_this.datos.inventario) {
                            if (record.data.color == 'verde') {
                                return '<span style="color:#5fd419;">' + value + '</span>';
                            } else if (record.data.color == 'negro') {
                                return value;
                            } else {
                                return '<span style="color:#ff0800;">' + value + '</span>';
                            }
                        }
                        return value;
                    }
                };
                if (_this.datos.iddocinventario != false) {
                    _this.campos.denominacion.editable = false;
                }
                if (columna.xtype == 'textfield') {
                    var cmpEditable = (this.editable == true) ? this.getCmp(columna) : null;
                    this.adicinarColumna(columna, cmpEditable);
                }
                if (columna.xtype == 'numberfield') {
                    var cmpEditable = (this.editable == true) ? this.getCmp(columna) : null;
                    if (alternativa) {
                        if (columna.name === 'diferenciavalor' || columna.name === 'diferenciadepreciacion') {
                            _this.crearColumnasModiicacionValor(columna, cmpEditable, col);
                        } else
                            _this.crearColumnasContables(columna, cmpEditable, col);
                    } else {
                        if (columna.dataIndex == 'valorcontable') {
                            // Restando el valor contable a la depreciacion acumulada del medio
                            Ext.apply(columna, {
                                renderer: function (_v, _mD, _r) {
                                    /*_r.data.depreciacionacumulada = (_r.data.depreciacionacumulada == null) ? 0 : _r.data.depreciacionacumulada;
                                     if (parseFloat(_r.data.valorcontable) == parseFloat(_r.data.valoradquisicion))
                                     _v = parseFloat(_r.data.valoradquisicion - _r.data.depreciacionacumulada).toFixed(6);
                                     else
                                     _v = parseFloat(_r.data.valorcontable - _r.data.depreciacionacumulada).toFixed(6);*/
                                    if (_v != null) {
                                        if (_this.datos.inventario) {
                                            if (record.data.color == 'verde') {
                                                return '<span style="color:#5fd419;">' + _v + '</span>';
                                            } else if (record.data.color == 'negro') {
                                                return _v;
                                            } else {
                                                return '<span style="color:#ff0800;">' + _v + '</span>';
                                            }
                                        }
                                        return _v;
                                    }
                                }
                            });
                        }

                        this.adicinarColumna(columna, cmpEditable);

                    }

                } else if (columna.xtype == 'datefield') {

                    var cmpEditable = (this.editable == true) ? this.getCmp(columna) : null;
                    columna.obligatorio = (col.obligatorio) ? col.obligatorio : columna.obligatorio;
                    Ext.apply(columna, {
                        renderer: function (value, opt, record) {
                            if (value && typeof (value) == 'object') {
                                value = value.format('d-m-Y');
                            }
                            if (value != null) {
                                if (_this.datos.inventario) {
                                    if (record.data.color == 'verde') {
                                        return '<span style="color:#5fd419;">' + value + '</span>';
                                    } else if (record.data.color == 'negro') {
                                        return value;
                                    } else {
                                        return '<span style="color:#ff0800;">' + value + '</span>';
                                    }
                                }
                            }
                            return value;
                        }
                    });
                    this.adicinarColumna(columna, cmpEditable);
                } else if (columna.xtype == 'combobox' || columna.xtype == 'combustible') {
                    var cmpEditable = (this.editable == true) ? this.getCmp(columna) : null;
                    columna.obligatorio = (col.obligatorio) ? col.obligatorio : columna.obligatorio;
                    this.array_records.push({
                        name: 'id' + columna.dataIndex
                    });
                    this.adicinarColumna(columna, cmpEditable);
                } else if (columna.xtype == 'check') {
                    this.getCheck(columna);
                }

                //Columnas de tratamiento diferenciado
                else if (columna.xtype == 'win_ubicacion') {
                    this.crearColEditableWinUbicacion(columna);
                } else if (columna.xtype == 'win_responsable') {
                    this.crearColEditableWinResponsable(columna, false);
                }
            }
        }
    },
    getCmp: function (columna) {
        var _this = this;
        var vidaUtil = '';
        switch (columna.xtype) {
            case 'textfield':
                return this.getTextField(columna, 'text');
            case 'numberfield':
                return this.getTextField(columna, 'nro');
            case 'datefield':
                return this.getDateField(columna);
            case 'combobox':
                return this.getCombo(columna);
            case 'combustible':
                return this.getTreeCobustible(columna);
        }
    },
    getTextField: function (columna, tipo) {
        var errormsgmax = this.idioma.lbCantMaxCaracteres.replace('_A_', (tipo == 'text') ? 'caracteres' : 'cifras');
        var errormsgmin = this.idioma.lbCantMinCaracteres.replace('_A_', (tipo == 'text') ? 'caracteres' : 'cifras');
        var cmp = (tipo == 'text') ? (new Ext.form.TextField()) : (new Ext.form.NumberField());
        Ext.apply(cmp, columna[1]);

        if (LOG.aft.RegOperativo.Campos[cmp.name]) {
            Ext.apply(cmp, LOG.aft.RegOperativo.Campos[cmp.nombre]);
        }

        if (cmp.readOnly != null && cmp.readOnly == true) {
            cmp.readOnly = true;
        }

        if (cmp.maskRe) {
            cmp.maskRe = Ext.decode(cmp.maskRe);
        }

        if (cmp.regex) {
            cmp.regex = Ext.decode(cmp.maskRe);
        }

        if (cmp.maxLength)
            cmp.maxLengthText = errormsgmax.replace('_C_', cmp.maxLength);
        if (cmp.minLengthText)
            cmp.minLengthText = errormsgmax.replace('_C_', cmp.minLengthText);
        /*if(this.datos.inventario)
         {
         cmp.editable = false;
         }*/
        if (columna.name == 'vidautil') {
            cmp.maxLength = columna.maxLength;
        }
        return cmp;
    },
    getDateField: function (columna) {
        var _this = this;
        var cmpExpandidoFecha = Ext.extend(Ext.form.DateField, {
            constructor: function (config) {
                Ext.apply(this, config);
                this.ordenCronologico = config.ordenCronologico;
                cmpExpandidoFecha.superclass.constructor.call(this, arguments);
            },
            getOrdenCronologico: function () {
                return this.ordenCronologico;
            }
        });

        function setDateNull(cmp) {
            var record = _this.getSelectionModel().getSelected();
            record.set(cmp.id, null);
        }

        var cmpEditable = new cmpExpandidoFecha({
            format: 'd/m/Y',
            enableKeyEvents: true,
            ordenCronologico: columna.ordencronologico,
            name: columna.name,
            listeners: {
                'change': function (cmp, newValue, oldValue) {
                    setDateNull(cmp);
                },

                'blur': function () {
                    (this.getValue()) ? this.getValue().format('d-m-Y') : "";
                }
            }
        });
        return cmpEditable;
    },
    getCombo: function (columna) {

        var _this = this;
        var propiedad_id = 'id';
        var propiedad_descripcion = 'denominacion';
        var propiedad_informacion = 'info';
//        var combo = new LOG.util.ComboBox(columna);
//        combo.url = '/logistica/activos_fijos/configuracion/index.php/nomactividad/' + columna.url,
        var combo = new LOG.util.ComboBox({
            valueField: 'denominacion',
            displayField: 'denominacion',
            triggerAction: 'all',
            selectOnFocus: true,
            minChars: 0,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            resizable: true,
            listWidth: 300,
            store: new Ext.data.Store({
                url: _this.datos.urlControladora + 'cargarcombogrideditable',
                autoLoad: true,
                listeners: {
                    'beforeload': function (store) {
                        store.baseParams.tipocombo = columna.dataIndex;
                        store.baseParams.nombreid = propiedad_id;
                        store.baseParams.nombredenominacion = propiedad_descripcion;
                        store.baseParams.info = propiedad_informacion;
                        var parametros = new Object();
                        if (columna.dataIndex == 'denomestadotecnico') {
                            parametros.idoperacion = _this.datos.idoperacion;
                            if (_this.datos.tipo_interfaz == "no_entrada") {
                                if (_this.getSelectionModel().hasSelection()) {
                                    var idregnumerico = _this.getSelectionModel().getSelected().data.idregnumerico;
                                    parametros.idregnumerico = idregnumerico;
                                }
                            }
                        }
                        parametros.idestructura = _this.datos.idestructurapadre;
                        store.baseParams.parametros = Ext.encode(parametros);
                    },
                    'load': function (st, records, options) {
                        if (records.length == 0) {
                            var tipo_combo = (columna.dataIndex == 'denomestadotecnico') ? _this.idioma.lbEstados : (columna.dataIndex == 'colorprim' || columna.dataIndex == 'colorsec') ? _this.idioma.lbColores : (columna.dataIndex == 'tipomotor') ? _this.idioma.lbTiposMotores : (columna.dataIndex == 'metododepreciacion') ? _this.idioma.lbMedodosDepreciacion : 'datos';
                            var msg = _this.idioma.lbMsgNoExistenDatos.replace('_replace_', tipo_combo);
                            //mostrarMensaje(3, msg);
                        }

                        if (columna.dataIndex == 'denomestadotecnico') {
                            _this.idEstadoUno = records[0].get('idestatustecnico');
                            _this.denomEstadoUno = records[0].get('denominacion');
                        }
                    }
                },
                reader: new Ext.data.JsonReader({
                    id: 'idcmb' + columna.dataIndex,
                    root: 'datos'
                }, [
                    {
                        name: propiedad_id
                    },
                    {
                        name: propiedad_descripcion
                    },
                    {
                        name: propiedad_informacion
                    },
                    {
                        name: "id" + columna.dataIndex
                    },
                    {
                        name: columna.name
                    }
                ])
            }),
            listeners: {
                'select': function (cmb, record, index) {
                    _this.getSelectionModel().getSelected().data['id' + columna.dataIndex] = (record.data.id) ? record.data.id : record.get(columna.name);

                    if (columna.dataIndex == "gruposubgrupo") {
                        _this.getSelectionModel().getSelected().data['tasafiscal'] = record.json.tasafiscalmax
                    }
                }
            }
        });
        Ext.applyIf(combo, columna);
        return combo;
    },
    getCheck: function (columna) {

        this.array_records.push({
            name: columna[1].dataIndex
        });
        var cmp = new Ext.grid.CheckColumn({
            id: columna[1].dataIndex,
            align: 'center'
        });
        Ext.applyIf(cmp, columna[1])

        this.array_columnas.push(cmp);
        this.array_plugins.push(cmp);
        this.array_pNivel.push({
            'header': this.idioma[columna[0].header]
        });
    },
    getTreeCobustible: function (columna) {
        var _this = this;


        var cmp = new Ext.erp.comboTipoCombustible({
            textRootNode: 'Tipos de combustible', // Texto del nodo padre  (obligatorio)
            modeTree: 'remote',
            fnDbClick: function (idtipocombustible) {
                _this.getSelectionModel().getSelected().set('idtipocombustible', idtipocombustible);
            },
            params: {}
        });

        Ext.applyIf(cmp, columna);
        return cmp;
    },
    crearColEditableWinUbicacion: function (columna) {

        var _this = this;
        var cmpEditable = (this.editable == true) ? new Ext.form.TextField({
            allowBlank: true,
            readOnly: true,
            editable: false,
            emptyText: 'lbSeleccione',
            listeners: {
                'focus': function (combo) {

                    Ext.getBody().mask(_this.idioma.lbLoad, 'x-mask-loading');
                    if (!_this.Ubicacion) {
                        var objParams = new Object();
                        if (_this.datos.tipoubicacion == 'activos') {
                            objParams.tipoestructura = 2;
                            objParams.idubicacion = _this.datos.idarearesp;
                            objParams.arearesp = _this.datos.arearesp;
                        }
                        objParams.doAction = function (obj_nodoSeleccionado) {
                            if (obj_nodoSeleccionado.getDepth() != 0) {
                                _this.store.getAt(_this.store.indexOf(_this.getSelectionModel().getSelected())).set('id' + columna.dataIndex, obj_nodoSeleccionado.id);
                            } else {
                                _this.store.getAt(_this.store.indexOf(_this.getSelectionModel().getSelected())).set('id' + columna.dataIndex, null);
                            }
                            _this.store.getAt(_this.store.indexOf(_this.getSelectionModel().getSelected())).set(columna.dataIndex, obj_nodoSeleccionado.text);
                            _this.Ubicacion.hide();
                            Ext.aft.regNumerico.fn.gestionarBotones({gridNorte: _this, datos: _this.datos});
                        }
                        objParams.listeners = {
                            'beforeshow': function () {
                                Ext.getBody().unmask();
                            }
                        }
                        // Ext.aft.regNumerico.fn.gestionarBotones(_this);
                        _this.Ubicacion = new Ext.Log.Treestructuraubicacion.ventana(objParams);
                    } else {
                        _this.Ubicacion.show();
                    }
                }
            }
        }) : null;
        this.array_records.push({
            name: 'id' + columna.dataIndex
        });
        columna.renderer = function (value, dos, record) {
            var respuesta = "";
            if (value == null) {
                respuesta = _this.datos.arearesp;
            } else {
                respuesta = value;
            }

            if (_this.datos.inventario) {
                if (record.data.color == 'verde') {
                    return '<span style="color:#5fd419;">' + respuesta + '</span>';
                } else if (record.data.color == 'negro') {
                    return value;
                } else {
                    return '<span style="color:#ff0800;">' + respuesta + '</span>';
                }
            }
            return respuesta;
        };
        this.adicinarColumna(columna, cmpEditable);
    },
    crearColEditableWinResponsable: function (columna, busqueda) {

        var _this = this;
        var edit = (busqueda) ? true : this.editable;
        var cmpEditable = (edit) ? new Ext.form.TextField({
            allowBlank: true,
            readOnly: true,
            editable: false,
            emptyText: 'lbSeleccione',
            listeners: {
                'focus': function (field) {

                     var panelBusPer = new Ext.aft.regNumerico.panelBuscarResponsable({
                        region: 'center',
                        id: 'panelBusPer',
                        singleSelect: true,
                        identidad: perfil.idestructuracomun,
                        showBtnAdicionar: true,
                        modulo: 'LOGISTICA',
                        showBtnAyuda: false,
                        seguridad: 0,
                        limit: 30,
                        start: 0,
                        height: 100,
                        listeners: {
                            'personaselecionada': function () {
                                winBuscarPersona.listaBotones.getItem(2).enable();
                            },
                            'personadeselecionada': function () {
                                winBuscarPersona.listaBotones.getItem(2).disable();
                            }
                        }
                    });

                    panelBusPer.runSearch = function (condiciones) {
                        if (condiciones && condiciones.length > 0 && condiciones[0] != " ") {
                            condiciones[condiciones.length - 1].logico = '';
                            panelBusPer.hasSearch = true;
                        } else {
                            panelBusPer.hasSearch = false;
                        }
                        panelBusPer.stPersonas.baseParams.condiciones = condiciones;
                        panelBusPer.stPersonas.load({params: {start: 0, limit: _this.panelBusPer.pagingToolbar.pageSize}});
                    };
                    
                    panelBusPer.cleanSearch = function () {
                        panelBusPer.tfbuscar.reset();
                        
                        delete panelBusPer.stPersonas.baseParams.condiciones;
                        delete panelBusPer.stPersonas.baseParams.criterio;
                        
                        panelBusPer.stPersonas.baseParams.start = 0;
                        panelBusPer.stPersonas.baseParams.limit = 25;
                        panelBusPer.stPersonas.load({params: {start: 0, limit: 25}});
                    };

                    var winBuscarPersona = new LOG.aft.documento.winResponsable({
                        title: 'Personas',
                        layout: 'fit',
                        initComponent: function (config) {
                            LOG.aft.documento.winResponsable.superclass.initComponent.call(this);
                            LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
                                handler: function () {
                                    winBuscarPersona.destroy();
                                }
                            });
                            LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
                                disabled: true,
                                handler: function () {
                                    var seleccion = panelBusPer.getSeleccion();
                                    var selectedRecord = _this.getSelectionModel().getSelected();
                                    var textoBusqueda = panelBusPer.tfbuscar.getValue().trim();
                                    if (seleccion && selectedRecord) {
                                        selectedRecord.set('id' + columna.dataIndex, seleccion.get('idpersona'));
                                        selectedRecord.set(columna.dataIndex, seleccion.get('nombreyapellidos'));
                                        field.setValue(seleccion.get('nombreyapellidos'));
                                        Ext.getCmp('idbtnGuardarReg').enable();
                                        winBuscarPersona.close();
                                    } 
                                    else if (textoBusqueda !== '') {
                                        panelBusPer.searchFieldHandler();
                                    }
                                }
                            });
                        }
                    });
                    winBuscarPersona.add(panelBusPer);
                    winBuscarPersona.show();
                }
            }
        }) : null;
        this.array_records.push({
            name: 'id' + columna.dataIndex
        });
        columna.renderer = function (value, dos, record) {        

            var respuesta = "";
            if (value == null) {
                var responsable;
                if (_this.datos.PersonaResponsable && _this.datos.PersonaResponsable.datosPersona) {
                    responsable = _this.datos.PersonaResponsable.datosPersona;
                    respuesta = ((responsable.nombre) ? responsable.nombre : '') + ((responsable.papel) ? responsable.papel : '') + ((responsable.sapel) ? responsable.sapel : '');
                } else {
                    respuesta = '';
                }
            } else {
                respuesta = value;
            }

            if (_this.datos.inventario) {
                if (record.data.color == 'verde') {
                    return '<span style="color:#5fd419;">' + respuesta + '</span>';
                } else if (record.data.color == 'negro') {
                    return value;
                } else {
                    return '<span style="color:#ff0800;">' + respuesta + '</span>';
                }
            }
            return respuesta;
        };
        if (busqueda) {
            return cmpEditable;
        } else {
            this.adicinarColumna(columna, cmpEditable);
        }


    },
    adicinarColumna: function (col, cmpEditable) {

        var columna = {};
        Ext.applyIf(columna, col);

        var _this = this;
        columna.xtype = null;
        var c = new Object();
        Ext.applyIf(c, columna);
        if (typeof (columna.obligatorio) != 'undefined' && columna.obligatorio) {
            if (cmpEditable)
                cmpEditable.allowBlank = false;
        }

        if (columna.regex && cmpEditable) {
            var regExp = new RegExp(columna.regex);
            cmpEditable.regex = regExp;
        }
        c.editor = (cmpEditable) ? cmpEditable : null;
        if (!c.id)
            c.id = columna.dataIndex;
        _this.array_columnas.push(c);

        if (columna) {
            var pNivel = new Object();
            Ext.applyIf(pNivel, columna);
            if (pNivel.header) {
                pNivel.header = _this.idioma[pNivel.header];
            }

            if (pNivel.tooltip)
                pNivel.tooltip = _this.idioma[pNivel.tooltip];
            _this.array_pNivel.push(pNivel);
        }
        _this.array_records.push({
            name: c.dataIndex
        });

        _this.buscarPor(columna);
    },
    buscarPor: function (columna) {
        var _this = this;
        //Aqui es donde se construye el TBAR de la busqueda.
        if (columna.dataIndex == 'nroinventario') {
            this.array_tbar.push(' ', {
                xtype: 'label',
                text: columna.fieldLabel + ':',
                novalor: true
            }, ' ');
            var field1 = new Ext.form.TextField({
                xtype: 'textfield',
                regex: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
                maskRe: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
                fieldLabel: columna.fieldLabel,
                identificador: columna.dataIndex
            });
            this.array_tbar.push(field1);
        } else if (columna.dataIndex == 'nroserie') {
            this.array_tbar.push(' ', {
                xtype: 'label',
                text: columna.fieldLabel + ':',
                novalor: true
            }, ' ');
            var field2 = new Ext.form.TextField({
                xtype: 'textfield',
                regex: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
                maskRe: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
                fieldLabel: columna.fieldLabel,
                identificador: columna.dataIndex
            });
            this.array_tbar.push(field2);
        }
    },
    crearBotonesPropios: function () {
        var _this = this;
        this.btnAdicionar = new Ext.Button({
            text: _this.idioma.lbBtnAdicionar,
            iconCls: 'adicionar',
            hidden: !_this._parent._parent.grantedAction('btnAdicionarRegistro'),
            disabled: true
        });
        this.btnEliminar = new Ext.Button({
            text: _this.idioma.lbBtnEliminar,
            iconCls: 'eliminar',
            hidden: !_this._parent._parent.grantedAction('btnEliminarRegistro'),
            disabled: true
        });
        this.btnGuardar = new Ext.Button({
            text: _this.idioma.lbBtnGuardar,
            iconCls: 'guardar',
            id: 'idbtnGuardarReg',
            hidden: !_this._parent._parent.grantedAction('btnAdicionarRegistro'),
            disabled: true
        });
        this.btnReplicar = new Ext.Button({
            text: "Replicar",
            iconCls: 'duplicar',
            id: 'idbtnReplicarReg',
            hidden: !_this._parent._parent.grantedAction('btnAdicionarRegistro'),
            disabled: true
        });

        this.btnMonedas = new Ext.Button({
            text: _this.idioma.lbBtnMonedas,
            iconCls: 'deposito',
            id: 'idbtnMonedReg',
            hidden: !_this._parent._parent.grantedAction('btnAdicionarRegistro') && _this.alternativa,
            disabled: true
        });
        this.btnAyuda = new Ext.Button({
            text: _this.idioma.lbBtnAyuda,
            tooltip: _this.idioma.lbTtBtnAyuda,
            iconCls: 'ayuda'
        });
    },
    adicionarFila: function () {
        var _this = this;
        if (_this.getStore().getCount() == 0) {
            var dataRecord = {};
            for (var i = 0, length = _this.array_columnas.length; i < length; i++) {
                if (_this.datos.inventario) {
                    _this.array_columnas[i].editable = true;
                }
                if (_this.array_columnas[i].value != null) {
                    dataRecord[_this.array_columnas[i].dataIndex] = _this.array_columnas[i].value;
                } else {
                    dataRecord[_this.array_columnas[i].dataIndex] = null;
                }
            }
            if (_this.datos.inventario) {
                dataRecord.color = 'verde';
            }
            var Record = Ext.data.Record.create(_this.array_records);
            var tupla = new Record(dataRecord);
            tupla.set('iddenomestadotecnico', _this.idEstadoUno);
            tupla.set('denomestadotecnico', _this.denomEstadoUno);
            tupla.set('porcientorecuperacion', (this.datos.porcientorecuperacion) ? this.datos.porcientorecuperacion : "");
            tupla.set('vidautil', (this.datos.vidautil) ? this.datos.vidautil : "");
            tupla.set('coeficiente', (this.datos.coeficiente) ? this.datos.coeficiente : "");
            tupla.set('tasafiscal', (this.datos.tasafiscal) ? this.datos.tasafiscal : "");
            tupla.set('responsable', (this.datos.denomresponsable) ? this.datos.denomresponsable : null);
            tupla.set('idresponsable', (this.datos.idresponsable) ? this.datos.idresponsable : null);
            tupla.set('idgruposubgrupo', (this.datos.idgruposubgrupo) ? this.datos.idgruposubgrupo : null);
            tupla.set('gruposubgrupo', (this.datos.descripciongrupo) ? this.datos.descripciongrupo : "");
            tupla.set('idnaturaleza', (this.datos.idnaturaleza) ? this.datos.idnaturaleza : null);
            tupla.set('naturaleza', (this.datos.naturaleza) ? this.datos.naturaleza : "");
            tupla.set('denominacion', (this.datos.denominacion) ? this.datos.denominacion : "");
            tupla.set('actividad', (this.datos.grupoexplotacion) ? this.datos.grupoexplotacion : "");
            tupla.set('idactividad', (this.datos.idactividad) ? this.datos.idactividad : null);

            this.stopEditing();
            this.getStore().insert(0, tupla);
            this.startEditing(0, 1);
            this.getSelectionModel().selectFirstRow();
        } else {
            //if (_this.getStore().getAt(0).get('idregnumerico')) {

            var dataRecord = {};
            var primera_fila = _this.getStore().getAt(0);
            for (var i = 0; i < _this.array_columnas.length; i++) {

                if (_this.array_columnas[i].duplicar == true) {

                    if (primera_fila.get('id' + _this.array_columnas[i].dataIndex) || _this.array_columnas[i].dataIndex == 'iddenomestadotecnico') {
                        dataRecord['id' + _this.array_columnas[i].dataIndex] = primera_fila.get('id' + _this.array_columnas[i].dataIndex);
                    }
                    dataRecord[_this.array_columnas[i].dataIndex] = primera_fila.get(_this.array_columnas[i].dataIndex);
                } else {
                    dataRecord[_this.array_columnas[i].dataIndex] = null;
                }
            }

            if (_this.datos.inventario) {
                if (!_this.first) {
                    mostrarMensaje(1, "Debe guardar el conteo antes de adicionar el(los) sobrante(s).");
                    return;
                }
                dataRecord.color = 'verde';
            }

            var Record = Ext.data.Record.create(_this.array_records);
            var tupla = new Record(dataRecord);
            this.stopEditing();
            this.getStore().insert(0, tupla);
            if (_this.datos.inventario) {
                for (var i = 0; i < _this.array_columnas.length; i++) {
                    _this.getColumnModel().setEditable(i, true);
                }
                _this.first = 3;
            }

            this.startEditing(0, 1);
            this.getSelectionModel().selectFirstRow();
            //}
        }

    },
    validarColorStore: function () {
        var _this = this;
        var pos = _this.getStore().find("color", -1);
        return pos;
    },
    verificarDatos: function (r) {


        var _this = this;
        var camposVacios = false;
        var cm = _this.getColumnModel();
        _this.validarCampos(r.data);
        if (r.data.iddenomestadotecnico == false) {
            mostrarMensaje(3, "Debe configurar los estados técnicos para la entidad logueada");
        }
        for (var i = 1; i < cm.getColumnCount(); i++) {
            var idColumn = cm.getColumnId(i);
            var c = cm.getColumnById(idColumn);

            if (typeof (c.obligatorio) != 'undefined' && c.editable && c.obligatorio && (r.get(idColumn) == null/* || (r.get(idColumn).toString().replace(' ', '').length) == 0*/)) {

                camposVacios = true;
                var rowIndex = _this.getStore().indexOf(r);
                _this.startEditing(rowIndex, i);
                break;
            }
        }
        return camposVacios;
    },
    guardarFila: function () {
        var _this = this;
        var records = _this.getStore().getModifiedRecords();
        var obligatorios = false;
        if (_this.datos.inventario) {

            for (var i = 0; i < _this.array_regnumeicos.length; i++) {

                var existeRnEnPos = records.findIndex(_el => {
                    if (_el)
                        return _el.data.idregnumerico === _this.array_regnumeicos[i]
                    else
                        return true;
                });

                if (existeRnEnPos >= 0) {
                    records[existeRnEnPos] = _this.getStore().getAt(
                            _this.getStore().find("idregnumerico", _this.array_regnumeicos[i]));
                } else {
                    records.push(
                            _this.getStore().getAt(
                            _this.getStore().find("idregnumerico", _this.array_regnumeicos[i])));
                }

                //records.push(_this.getStore().getAt(_this.getStore().find("idregnumerico", _this.array_regnumeicos[i])));
            }
        }

        var cm = _this.getColumnModel();
        for (var h = 0; h < records.length; h++) {
            var r = records[h];
            if (r) {
                for (var i = 1; i < cm.getColumnCount(); i++) {
                    var idColumn = cm.getColumnId(i);
                    var c = cm.getColumnById(idColumn);
                    if (typeof (c.obligatorio) != 'undefined' && c.obligatorio && (r.get(idColumn) == null)) {
                        obligatorios = true;
                        break;
                    }
                }
            }
        }
        if (records.length > 0 || obligatorios) {
            var camposObligatoriosVacios = false;
//            if (!_this.datos.inventario) {
//                var r = _this.getSelectionModel().getSelected();
//
//                if (r) {
//                    camposObligatoriosVacios = _this.verificarDatos(r);
//                } else {
//                    alert('Tiene que seleccionar la fila que se va a guardar');
//                }
//
//            } else {
            var arrayDatos = new Array();

            for (var j = 0; j < records.length; j++) {
                if (records[j]) {
                    if (!_this.datos.inventario || (records[j].data.color && records[j].data.color == 'verde' && _this.datos.inventario)) {
                        camposObligatoriosVacios = _this.verificarDatos(records[j]);
                    }
                    if (camposObligatoriosVacios && !_this.modifyMonedas) {
                        break;
                    }
                    records[j].data.idarearesp = _this.datos.idarearesp;
                    records[j].data.idcentrocosto = _this.datos.idcentrocosto;
                    records[j].data.idmovimiento = _this.datos.idmovimiento;
                    // records[j].data.idnaturaleza = _this.datos.idnaturaleza;
                    records[j].data.idprod = _this.datos.idprod;
                    records[j].data.monedas = _this.datos.monedas;
                    records[j].data.idproducto = _this.datos.idproducto;
                    records[j].data.forzado = _this.forzado;
                    records[j].data.color = (records[j].data.color == -1) ? "rojo" : records[j].data.color;
                    if (records[j].data.tasafiscal == null)
                        records[j].data.tasafiscal = 0;
                    if (_this.datos.tipo_interfaz == 'entrada') {
                        let valorcontable = (records[j].data.valorcontable > 0) ?
                                records[j].data.valorcontable : records[j].data.valoradquisicion;
                        records[j].data.valorcontable = valorcontable;
                    }
                    arrayDatos.push(records[j].data);


                }
            }
            //}
            if (!camposObligatoriosVacios) {
                // Ext.getBody().mask(_this.idioma.lbMASkGuardando, 'x-mask-loading');
                Ext.MessageBox.wait("Guardando datos", "Por favor espere...");
                var param = {};
                if (_this.datos.inventario) {
                    param['inventario'] = 2;
                }
                param['datos'] = Ext.encode(arrayDatos);
                Ext.Ajax.request({
                    url: this.datos.urlControladora + 'guardarserieentrada',
                    method: 'POST',
                    params: param,
                    callback: function (options, success, response) {
                        //  Ext.getBody().unmask();
                        Ext.MessageBox.hide();
                        _this.modifyMonedas = false;
                        var rd = Ext.decode(response.responseText);
                        _this.forzado = false;
                        if (_this.datos.inventario) {
                            _this.array_regnumeicos = new Array();
                            _this.rojos = new Array();
                            for (var i = 1; i < _this.array_columnas.length; i++) {
                                _this.getColumnModel().setEditable(i, false);
                            }
                            _this.first = 3;
                        }

                        if (rd.failure == true) {

                            if (rd.repetidos) {
                                if (rd.repetidos.length > 1) {
                                    mostrarMensaje(1, "Los campos  " + rd.repetidos[1] + " y " + rd.repetidos[0] + " ya existen en el sistema");
                                } else {
                                    mostrarMensaje(1, "El campo " + rd.repetidos[0] + " ya existe en el sistema");
                                }

                            } else {
                                var nrsoSeries = "";
                                for (var i = 0; i < rd.datos.length; i++) {
                                    nrsoSeries += ' <li>' + rd.datos[i] + '</li> ';
                                }
                                var msg = _this.idioma.lbMsgExisteOk + '<div style="margin-left: 50px !Important;"><b>Los siguientes n&uacute;meros de series ya est&aacute;n registrados en el sistema:</b></br>' + nrsoSeries;
                                msg += '</br>';
                                msg += '<div style="margin-left: 50px !Important;">\xbfQuiere adicionarlo de todas maneras?</div>';
                                Ext.Msg.show({
                                    title: _this.idioma.lbTitleConfirmacion,
                                    msg: msg,
                                    width: 350,
                                    buttons: Ext.Msg.OKCANCEL,
                                    fn: function (btn) {
                                        if (btn == 'ok') {
                                            _this.forzado = true;
                                            _this.guardarFila();
                                        }
                                    },
                                    animEl: 'mb3',
                                    icon: Ext.MessageBox.QUESTION
                                });
                            }

                        }
                        if (rd.success) {
                            if (_this.datos.inventario) {
                                mostrarMensaje(1, 'Los datos han sido modificado satisfactoriamente.');
                            } else {
                                mostrarMensaje(1, _this.idioma.lbMsgGuardarOk);
                            }
                            _this.getStore().reload();
                            _this.getStore().rejectChanges();
                        }
                    }
                });
            }
        }
    },
    replicarDatos: function () {
        Ext.getBody().mask("Replicando datos.");
        var _this = this;
        var idmovregnumerico = _this.getSelectionModel().getSelected().data.idmovregnumerico;
        Ext.Ajax.request({
            url: this.datos.urlControladora + 'replicardatosmovimiento',
            method: 'POST',
            params: {'idmovregnumerico': idmovregnumerico},
            callback: function (options, success, response) {
                Ext.getBody().unmask();

                var rd = Ext.decode(response.responseText);
                if (rd.success) {
                    mostrarMensaje(1, 'Los datos han sido modificado satisfactoriamente.');
                    _this.getStore().reload();
                    _this.getStore().rejectChanges();
                }
            }
        });
    },
    validarCampos: function (obj) {
        for (var i in obj) {
            if (typeof (obj[i]) == 'string' && obj[i].length == 0) {
                obj[i] = null;
            }
        }
    },
    ejecutaAccion: function (hotKey, grid) {

        if (!this.Ubicacion || !this.Ubicacion.isVisible() || !this.Responsable || this.Responsable.isVisible()) {
            switch (hotKey) {
                case 'Alt+I':
                    {
                        if (this.btnAdicionar) {
                            if (this.btnAdicionar.isVisible() && this.btnAdicionar.disabled == false) {
                                this.btnAdicionar.fireEvent('click');
                            }
                        }
                    }
                    break;
                case 'DEL':
                    {
                        if (this.btnEliminar) {
                            if (this.btnEliminar.isVisible() && this.btnEliminar.disabled == false) {
                                this.btnEliminar.fireEvent('click');
                            }
                        }
                    }
                    break;
                case 'Alt+G':
                    {

                        if (this.btnGuardar) {
                            if (this.btnGuardar.isVisible() && this.btnGuardar.disabled == false) {
                                this.btnGuardar.fireEvent('click');
                            }
                        }
                    }
                    break;
                case 'Alt+L':
                    {
                        if (this.limpiarBtn) {
                            if (this.limpiarBtn.isVisible() && this.limpiarBtn.disabled == false) {
                                this.limpiarBtn.fireEvent('click');
                            }
                        }
                    }
                    break;
                case 'Alt+L+R':
                    {
                        if (grid.limpiarBtn) {
                            if (grid.limpiarBtn.isVisible() && grid.limpiarBtn.disabled == false) {
                                grid.limpiarBtn.fireEvent('click');
                            }
                        }
                    }
                    break;
                case 'Alt+B':
                    {
                        if (this.buscarBtn) {
                            if (this.buscarBtn.isVisible() && this.buscarBtn.disabled == false) {
                                this.buscarBtn.fireEvent('click');
                            }
                        }
                    }
                    break;
                case 'Alt+B+R':
                    {
                        if (grid.buscarBtn) {
                            if (grid.buscarBtn.isVisible() && grid.buscarBtn.disabled == false) {
                                grid.buscarBtn.fireEvent('click');
                            }
                        }
                    }
                    break;
                case 'Alt+B+A':
                    {
                        if (this.buscarAvanzBtn) {
                            if (this.buscarAvanzBtn.isVisible() && this.buscarAvanzBtn.disabled == false) {
                                this.buscarAvanzBtn.fireEvent('click');
                            }
                        }
                    }
                    break;
                case 'Alt+H':
                    {
                        if (this.btnAyuda) {
                            if (this.btnAyuda.isVisible() && this.btnAyuda.disabled == false) {
                                this.btnAyuda.fireEvent('click');
                            }
                        }
                    }
                    break;
            }
        }
    },
    createPropertyGrid: function (params) {
        var _this = this;
        var propertyGrid = new Ext.erp.PropertyGrid({
            schema: 'mod_datosmaestrosmeta',
            globalDefault: true,
            editable: params.editable,
            listeners: {
                'show': function (propertyGrid) {

                    params.panel.add(propertyGrid);
                    params.panel.doLayout(true);
                }
            },
            preOperacion: function () {
                var record = _this.getSelectionModel().getSelected();
                if (record) {
                    this.llavesForaneas = Array();
                    this.llavesForaneas = _this.llavesForaneas;
                    this.idtabla = record.get('idtabla');
                    this.ar_where = _this.ar_where;
                } else {
                    throw 'Record no seleccionado'
                }
            }
        });
        this.propertyGridAtribDinamicos = propertyGrid;
    },
    crearWinBsuquedaAvanzada: function () {
        var _this = this;
        var columnasHeader = Array();
        var columnasTipo = Array();
        var arrayscombos = Array();
        var bandera = 1;
        var item1 = [];
        var item2 = [];
        var item3 = [];
        var camposJs = _this.array_columnas;
        var formColumn = new LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        for (var i = 0; i < _this.datos.columnas.length; i++) {
            var columna = _this.datos.columnas[i];
            var nam = columna.name;
            for (var j = 0; j < camposJs.length; j++) {
                if (camposJs[j].name == nam) {
                    columna.regex = (camposJs[j].regex) ? camposJs[j].regex : null;
                    columna.minLength = (camposJs[j].minLength) ? camposJs[j].minLength : null;
                    columna.maxLength = (camposJs[j].maxLength) ? camposJs[j].maxLength : null;
                }
            }
            if (columna.tipo != 'win_ubicacion' && columna.tipo != 'combustible') {
                columnasTipo.push(columna.tipo);
                if (columna.label && columna.tipo == 'date') {

                    columnasHeader.push(_this.idioma.label);
                    var obj = new Ext.form.DateField({
                        fieldLabel: columna.label,
                        name: columna.name,
                        format: 'd/m/Y'

                    });
                } else {
                    columnasHeader.push(_this.idioma.label);
                    if (columna.tipo == 'combo') {

                        arrayscombos.push(columna.name);
                        var tipoC = columna.name;
                        var propiedad_id = 'id';
                        var propiedad_descripcion = 'denominacion';
                        var propiedad_informacion = 'info';
                        var obj = new Ext.form.ComboBox({
                            fieldLabel: columna.label,
                            displayField: propiedad_descripcion,
                            valueField: columna.name,
                            hiddenName: columna.name,
                            triggerAction: 'all',
                            selectOnFocus: true,
                            id: "id" + columna.name,
                            minChars: 0,
                            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
                            resizable: true,
                            listWidth: 300,
                            store: new Ext.data.Store({
                                url: _this.datos.urlControladora + 'cargarcombogrideditable',
                                autoLoad: true,
                                baseParams: {
                                    tipocombo: tipoC,
                                    nombreid: propiedad_id + columna.name,
                                    nombredenominacion: propiedad_descripcion,
                                    info: propiedad_informacion
                                },
                                reader: new Ext.data.JsonReader({
                                    id: "id" + columna.name,
                                    root: 'datos'
                                }, [
                                    {
                                        name: propiedad_id
                                    },
                                    {
                                        name: propiedad_descripcion
                                    },
                                    {
                                        name: columna.name
                                    },
                                    {
                                        name: "id" + columna.name
                                    },
                                    {
                                        name: propiedad_informacion
                                    }
                                ])
                            })
                        });
                    } else if (columna.tipo == 'numberfield') {
                        var obj = new Ext.form.NumberField({
                            fieldLabel: columna.label,
                            name: columna.name,
                            minLength: columna.minLength,
                            maxLength: columna.maxLength,
                            regex: columna.regex,
                            maskRe: columna.regex

                        });
                    } else if (columna.tipo == 'win_responsable') {
                        var obj = this.crearColEditableWinResponsable(columna, true);
                        obj.fieldLabel = columna.label;
                        obj.name = columna.name;
                        obj.minLength = columna.minLength;
                        obj.maxLength = columna.maxLength;
                        obj.regex = columna.regex;
                        obj.maskRe = columna.regex;
                        obj.emptyText = ' ';
                    } else {
                        // var regExp = (columna.regex) ? new RegExp(columna.regex) : null;
                        var obj = new Ext.form.TextField({
                            fieldLabel: columna.label,
                            name: columna.name,
                            minLength: columna.minLength,
                            maxLength: columna.maxLength,
                            regex: columna.regex,
                            maskRe: columna.regex


                        });
                    }
                }
                formColumn.addComponent(obj);
                /* switch (bandera) {
                 case 1:
                 item1.push(obj);
                 bandera = 2;
                 break;
                 case 2:
                 item2.push(obj);
                 bandera = 3;
                 break;
                 case 3:
                 item3.push(obj);
                 bandera = 1;
                 break;
                 }*/
            }
        }
        /*  var form1 = new Ext.Panel({
         columnWidth: 0.33,
         labelAlign: 'top',
         layout: 'form',
         defaults: {
         anchor: '95%'
         },
         items: item1
         });
         var form2 = new Ext.Panel({
         columnWidth: 0.33,
         labelAlign: 'top',
         layout: 'form',
         defaults: {
         anchor: '95%'
         },
         items: item2
         });
         var form3 = new Ext.Panel({
         columnWidth: 0.33,
         labelAlign: 'top',
         layout: 'form',
         defaults: {
         anchor: '95%'
         },
         items: item3
         });*/

        var formP = LOG.util.UIManager.initForm({
            anchor: '100%',
            region: 'center',
            border: false,
            frame: true,
            // items: [_this.fieldD, _this.ocultoD]
            items: [formColumn]


        });
        _this.btnCancelarWinFiltrar = new Ext.Button({
            iconCls: 'cancelar',
            text: _this.idioma.lbBtnCancelar,
            tooltip: _this.idioma.lbTtBtnCancelarF,
            handler: function () {
                win.close();
                if (_this.getStore().getCount() == 0) {
                    _this.getStore().load();
                }
            }

        });
        _this.btnLimpiarWinFiltrar = new Ext.Button({
            iconCls: 'limpiar',
            text: _this.idioma.lbBtnLimpiarF,
            tooltip: _this.idioma.lbTtBtnLimpiarF,
            handler: function () {
                formP.getForm().reset();
                _this.getStore().load();
            }

        });
        _this.btnAceptarWinFiltrar = new Ext.Button({
            iconCls: 'aceptar',
            text: _this.idioma.lbBtnAceptar,
            tooltip: _this.idioma.lbTtBtnAceptarF,
            handler: function () {
                var valores = {};
                valores['start'] = 0;
                valores['limit'] = 10;
                if (formP.getForm().isValid()) {
                    var valores = formP.getForm().getValues();
                    for (var i = 0; i < arrayscombos.length; i++) {
                        valores[arrayscombos[i]] = Ext.getCmp("id" + arrayscombos[i]).getValue();
                    }

                    _this.getStore().load({
                        params: valores,
                        callback: function () {
                            if (_this.getStore().getTotalCount() == 0) {
                                mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de b&uacute;squeda especificados');
                            }
                        }
                    });
                    // win.close();
                } else {
                    mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
                }
            }
        });
        var win = new Ext.Window({
            width: 600,
            closeAction: 'close',
            title: _this.idioma.lbBtnbuscarAvanz,
            resizable: false,
            modal: true,
            frame: true,
            items: formP,
            buttons: [_this.btnCancelarWinFiltrar, _this.btnLimpiarWinFiltrar, _this.btnAceptarWinFiltrar]
        });
        win.show();
    },
    addPMonedas: function (p) {
        this.panelMonedas = p;
    },
    getPMonedas: function () {
        return this.panelMonedas;
    },
    getColMonedas: function () {
        return this.arrayColMonedas;
    },
    crearColumnasContables: function (columna, cmpEditable, col) {
        var _this = this;
        if (columna.contable) {
            if (columna.editable)
                _this.monedasVisibles = (_this.monedasVisibles === false) ? false : true;
            var colAux = {};
            colAux['header'] = columna.header.split(nommonedacontable)[0];
            colAux['dataIndex'] = columna.dataIndex;
            _this.arrayColMonedas.push(colAux);
            var headerCont = columna.header;
            Ext.apply(columna, {
                header: (headerCont.indexOf(nommonedacontable) == -1) ? headerCont + ' ' + nommonedacontable : headerCont,
                obligatorio: false,
                renderer: function (_v, _mD, _r) {
                    /*if (this.dataIndex == 'valorcontable') {
                     _r.data.depreciacionacumulada = (_r.data.depreciacionacumulada == null) ? 0 : _r.data.depreciacionacumulada;
                     if (parseFloat(_r.data.valorcontable) == parseFloat(_r.data.valoradquisicion))
                     _v = parseFloat(_r.data.valoradquisicion - _r.data.depreciacionacumulada).toFixed(6);
                     else
                     _v = parseFloat(_r.data.valorcontable - _r.data.depreciacionacumulada).toFixed(6);
                     }*/
                    if (_v != null) {
                        if (_this.datos.inventario) {
                            if (_r.data.color == 'verde') {
                                return '<span style="color:#5fd419;">' + _v + '</span>';
                            } else if (_r.data.color == 'negro') {
                                return _v;
                            } else {
                                return '<span style="color:#ff0800;">' + _v + '</span>';
                            }
                        }
                        return _v;
                    }
                }
            });
            this.adicinarColumna(columna, null);

            var columnaAlt = _this.campos[col.name + 'alternativo'];
            var headerAlt = columnaAlt.header;
            Ext.apply(columnaAlt, {
                header: (headerAlt.indexOf(nommonedaalternativa) == -1) ? headerAlt + ' ' + nommonedaalternativa : headerAlt,
                obligatorio: false,
                renderer: function (_v, _mD, _r) {
                    /*if (this.dataIndex == 'valorcontablealternativo') {
                     _r.data.depreciacionacumuladaalternativo = (_r.data.depreciacionacumuladaalternativo == null) ? 0 : _r.data.depreciacionacumuladaalternativo;
                     if (parseFloat(_r.data.valorcontablealternativo) == parseFloat(_r.data.valoradquisicionalternativo))
                     _v = parseFloat(_r.data.valoradquisicionalternativo - _r.data.depreciacionacumuladaalternativo).toFixed(6);
                     else
                     _v = parseFloat(_r.data.valorcontablealternativo - _r.data.depreciacionacumuladaalternativo).toFixed(6);
                     }*/
                    if (_v != null) {
                        if (_this.datos.inventario) {
                            if (_r.data.color == 'verde') {
                                return '<span style="color:#5fd419;">' + _v + '</span>';
                            } else if (_r.data.color == 'negro') {
                                return _v;
                            } else {
                                return '<span style="color:#ff0800;">' + _v + '</span>';
                            }
                        }
                        return _v;
                    }
                }
            });
            this.adicinarColumna(columnaAlt, null);
        } else {
            Ext.apply(columna, {
                header: columna.header.split(nommonedacontable)[0]
            });
            this.adicinarColumna(columna, cmpEditable);
        }
    },
    crearColumnasModiicacionValor: function (columna, cmpEditable, col) {

        var _this = this;
        if (columna.contable) {
            if (columna.editable)
                _this.monedasVisibles = false;
            var colAux = {};
            colAux['header'] = columna.header.split(nommonedacontable)[0];
            colAux['dataIndex'] = columna.dataIndex;
            var headerCont = columna.header;
            Ext.apply(columna, {
                header: (headerCont.indexOf(nommonedacontable) == -1) ? headerCont + ' ' + nommonedacontable : headerCont,
                obligatorio: false
            });
            this.adicinarColumna(columna, cmpEditable);


            var columnaAlt = _this.campos[col.name + 'alternativo'];
            var headerAlt = columnaAlt.header;
            Ext.apply(columnaAlt, {
                header: (headerAlt.indexOf(nommonedaalternativa) == -1) ? headerAlt + ' ' + nommonedaalternativa : headerAlt,
                obligatorio: false
            });
            this.adicinarColumna(columnaAlt, cmpEditable);
        }
    }
});
/**
 * Region(es) contenedora(s) del/los grid(s) y los atributos dinamicos
 */
Ext.aft.regNumerico.Region = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        Ext.apply(this, config);
        var _this = this;
        this.items = config.items;
        this.layout = (config.layout) ? config.layout : 'border';
        this.region = (config.region) ? config.region : 'center';
        this.border = (config.border) ? config.border : false;
        Ext.aft.regNumerico.Region.superclass.constructor.apply(this, arguments);
    }
});
Ext.aft.regNumerico.Ventana = Ext.extend(Ext.Window, {
    constructor: function (config) {
        Ext.apply(this, config);
        var _this = this;
        this.datos = config.params;
        this.idioma = config.idioma;
        this.modal = true;
        this.maximized = true;
        this.layout = 'border';
        this.crearRegiones();
        this.initEventos();
        this.buttons = [
            {
                iconCls: 'cancelar',
                text: 'Cerrar',
                tooltip: 'Cerrar ventana',
                handler: function () {
                    _this.close();
                }
            }
        ];
        Ext.aft.regNumerico.fn.gestionarBotones(this);
        Ext.aft.regNumerico.Ventana.superclass.constructor.call(this, arguments);
    },
    crearRegiones: function () {
        var _this = this;
        this.array_items_norte = new Array();
        this.array_regiones = new Array();
        this.crearRegionNorte();
        if (this.datos.tipo_interfaz == 'no_entrada') {
            this.crearRegionSur();
        }

        this.regionGlobalNorte = new Ext.aft.regNumerico.Region({
            items: _this.array_items_norte,
            region: 'center'
        });
        this.array_regiones.push(this.regionGlobalNorte);
        if (this.datos.tipo_interfaz == 'no_entrada') {
            //this.crearCmpGestAtributosDinamicos();
        }
        this.items = this.array_regiones;
        this.initHotKeys();
    },
    crearRegionNorte: function () {

        var _this = this;
        var array_items = new Array();
        var array_items_entrada = new Array();
        this.idRegNumNorteSeleccionado = null;
        this.funciones = Ext.aft.regNumerico.fn;
        //Grid norte
        var metodo = "";
        if (this.datos.tipo_interfaz == 'no_entrada') {
            metodo = 'cargarseriesdisponibles';
        } else if (this.datos.tipo_interfaz == 'inventario_total') {
            metodo = 'getregnumericosinventariototal';
        } else {
            metodo = 'cargarseriesdemovimiento';
        }

        var editable = false;
        if ((this.datos.idestado == 1 || this.datos.idestado == '1') && this.datos.tipo_interfaz != 'no_entrada') {
            editable = true;
        }
        if (_this.datos.inventario) {
            editable = true;
        }

        this.gridNorte = new Ext.aft.regNumerico.grid({
            idioma: _this.idioma,
            autoCargar: (_this.datos.tipo_interfaz != 'no_entrada'),
            datos: _this.datos,
            _parent: _this._parent,
            region: 'center',
            scope: _this,
            editable: editable,
            url: _this.datos.urlControladora + metodo
        });
        if (_this.gridNorte.getColumnModel().getColumnById('importe')) {
            _this.gridNorte.getColumnModel().setHidden(
                    _this.gridNorte.getColumnModel().getIndexById('importe'), true
                    );
        }

        if (_this.gridNorte.getColumnModel().getColumnById('usufructo')) {
            _this.gridNorte.getColumnModel().setHidden(
                    _this.gridNorte.getColumnModel().getIndexById('usufructo'), true
                    );
        }

        this.funciones.definirComportamientoBotonesNorte(_this);

        // Componente de atributos dinamicos que tendra el grid norte
        this.atibutosDinamicosNorte = new Ext.Panel({
            region: 'east',
            width: 300,
            layout: 'fit',
            border: true,
            collapsible: true,
            split: true,
            collapseMode: 'mini',
            collapsed: true
        });
        this.gridNorte.createPropertyGrid({
            panel: this.atibutosDinamicosNorte,
            editable: editable
        });
        array_items.push(this.gridNorte, this.atibutosDinamicosNorte);
        //Componente de monedas
        if (this.datos.tipo_interfaz == 'entrada') {
            this.monedasNorte = new Ext.aft.regNumerico.Monedas({
                idioma: _this.idioma,
                columnas: _this.gridNorte.getColMonedas()
            });
            this.monedasNorte.init();
            this.panelMonedasNorte = new Ext.Panel({
                title: this.idioma.tlPanelMonedas,
                titleCollapse: true,
                animCollapse: false,
                collapsible: true,
                region: 'south',
                layout: 'fit',
                height: 200,
                minSize: 200,
                maxSize: 400,
                split: true,
                hidden: true,
                items: [this.monedasNorte.view()],
                listeners: {
                    expand: function (_p) {
                        _p.show();
                        _this.monedasNorte.listaBotones.each(function (b) {
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(this, [b, this]).call();
                            }
                        }.createDelegate(_this.monedasNorte));
                        _this.doLayout();
                        _this.monedasNorte.getStorePrincipal().load();
                    },
                    collapse: function (_p) {
                        _p.hide();
                        _this.doLayout();
                    }
                }
            });
            this.monedasNorte.on({
                'dirtyMonedas': function (record) {
                    _this.gridNorte.getSelectionModel().getSelected().markDirty();
                    _this.gridNorte.getSelectionModel().getSelected().set('modify', true);
                    Ext.aft.regNumerico.fn.gestionarBotones(_this);
                    _this.datos['monedas'] = _this.monedasNorte.listaMonedas.getArray();
                },
                'recargarGrid': function () {
                    _this.gridNorte.getStore().load();
                }
            });
            this.gridNorte.addPMonedas(this.panelMonedasNorte);
            array_items_entrada.push(this.gridNorte, this.atibutosDinamicosNorte, this.panelMonedasNorte);
        }
        array_items.push(this.gridNorte, this.atibutosDinamicosNorte);

        var propiedades = {};
        if (this.datos.tipo_interfaz == 'entrada') {
            propiedades = {
                items: array_items_entrada,
                region: 'center',
                height: 300,
                tbar: _this.funciones.getBotonesNorte(_this.gridNorte),
                id: 'idregionentrada'
            };
        } else {
            propiedades = {
                items: array_items,
                region: 'north',
                height: 300,
                // collapsible: true,
                split: true,
                collapseMode: 'mini',
                tbar: ['->', _this.gridNorte.btnAyuda],
                id: 'idregionentrada'
            };
        }
        propiedades.scope = this;
        this.regionNorte = new Ext.aft.regNumerico.Region(propiedades);
        this.array_items_norte.push(this.regionNorte);
    },
    crearRegionSur: function () {
        var _this = this;
        var array_items = new Array();
        this.idRegNumSurSeleccionado = null;
        var editable = false;
        if (this.datos.idestado == 1 || this.datos.idestado == '1') {
            if (this.datos.tipo_interfaz == 'no_entrada') {
                editable = true;
            }
        }

        this.gridSur = new Ext.aft.regNumerico.grid({
            region: 'center',
            idioma: _this.idioma,
            autoCargar: true,
            datos: _this.datos,
            scope: _this,
            _parent: _this._parent,
            editable: editable,
            url: _this.datos.urlControladora + 'cargarseriesdemovimiento'
        });

        this.gridSur.on({
            'beforeedit': function (e) {
                if (_this.datos.codigooperacion == 'OPER_MOD_PROPIEDAD' && e.field == 'nroserie'  ) {
                   return;

                }
            }
        });

        this.funciones.definirComportamientoBotonesSur(_this);

        if (_this.gridSur.getColumnModel().getColumnById('nroserie')) {
            _this.gridSur.getColumnModel().setEditable(_this.gridSur.getColumnModel().getIndexById('nroserie'), true);
        }

        // Componente de atributos dinamicos que tendra el grid del sur
        this.atibutosDinamicosSur = new Ext.Panel({
            region: 'east',
            width: 300,
            layout: 'fit',
            border: true,
            collapsible: true,
            split: true,
            collapseMode: 'mini',
            collapsed: true
        });
        this.gridSur.createPropertyGrid({
            panel: this.atibutosDinamicosSur,
            editable: editable
        });
        //Componente de monedas
        this.monedasSur = new Ext.aft.regNumerico.Monedas({
            idioma: _this.idioma,
            columnas: _this.gridSur.getColMonedas(),
            valorEditable: true,
            interfaz: 'no_entrada'
        });
        this.monedasSur.init();
        this.panelMonedasSur = new Ext.Panel({
            title: this.idioma.tlPanelMonedas,
            titleCollapse: true,
            animCollapse: false,
            collapsible: true,
            region: 'south',
            layout: 'fit',
            height: 200,
            minSize: 200,
            maxSize: 400,
            split: true,
            hidden: true,
            items: [this.monedasSur.view()],
            listeners: {
                expand: function (_p) {
                    _p.show();
                    _this.monedasSur.listaBotones.each(function (b) {
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(this, [b, this]).call();
                        }
                    }.createDelegate(_this.monedasSur));
                    _this.doLayout();
                    _this.monedasSur.getStorePrincipal().load();
                },
                collapse: function (_p) {
                    _p.hide();
                    _this.doLayout();
                }
            }
        });
        this.monedasSur.on({
            'dirtyMonedas': function (record) {
                _this.gridSur.getSelectionModel().getSelected().markDirty();
                _this.gridSur.getSelectionModel().getSelected().set('modify', true);
                _this.gridSur.modifyMonedas = true;
                Ext.aft.regNumerico.fn.gestionarBotones(_this);
                _this.datos['monedas'] = _this.monedasSur.listaMonedas.getArray();

            },
            'recargarGrid': function () {
                _this.gridSur.getStore().load();
            }
        });

        array_items.push(this.gridSur, this.atibutosDinamicosSur, _this.panelMonedasSur);
        this.gridSur.addPMonedas(this.panelMonedasSur);
        var btns_salida = (this.datos.tipo_interfaz == 'no_entrada') ? _this.funciones.getBotonesSur(_this.gridSur) : null;
        this.regionSur = new Ext.aft.regNumerico.Region({
            items: array_items,
            region: 'center',
            tbar: btns_salida,
            id: 'idregionsalida'
        });
        this.array_items_norte.push(this.regionSur);
    },
    crearCmpGestAtributosDinamicos: function () {
        this.regionGlobalSur = new Ext.aft.regNumerico.Region({
            region: 'south',
            height: 100,
            layout: 'fit',
            border: true,
            collapsible: true,
            collapsed: true,
            collapseMode: 'mini',
            split: true
        });
        this.array_regiones.push(this.regionGlobalSur);
    },
    initHotKeys: function () {
        var _this = this;
        var grid = (this.datos.tipo_interfaz == 'entrada') ? _this.gridNorte : _this.gridSur;
        var tempHotKeysDocument = [];

        function callkeydownhandler(evnt) {
            var ev = (evnt) ? evnt : event;
            var code = (ev.which) ? ev.which : event.keyCode;
            var busquedaAvanzada = '18|66|65'; // Alt|b|a
            var busquedaNormal = '18|66'; // Alt|b

            var limpiarGridSur = '18|76|82'; //Alt|L|R 

            var buscarGridSur = '18|66|82'; //Alt|B|R 

            if (code == 18) { // Alt
                tempHotKeysDocument = [18];
            } else if (code == 17) { //Ctrl
                tempHotKeysDocument = [17];
            } else {
                tempHotKeysDocument.push(code);
                if (tempHotKeysDocument.length == 3) {
                    if (tempHotKeysDocument.join('|') == busquedaAvanzada) {
                        grid.ejecutaAccion('Alt+B+A');
                    }
                    if (tempHotKeysDocument.join('|') == limpiarGridSur) {
                        grid.ejecutaAccion('Alt+L+R', grid);
                    }
                    if (tempHotKeysDocument.join('|') == buscarGridSur) {
                        grid.ejecutaAccion('Alt+B+R', grid);
                    }

                } else if (tempHotKeysDocument.length == 2) {
                    if (tempHotKeysDocument.join('|') == busquedaNormal) {
                        grid.ejecutaAccion('Alt+B');
                    }
                }

            }
        }

        if (window.document.addEventListener) {
            window.document.addEventListener("keydown", callkeydownhandler, false);
        } else {
            window.document.attachEvent("onkeydown", callkeydownhandler);
        }
        document.onkeyup = function (e) {
            if (e.altKey) {
                if (e.which == Ext.EventObject.I) {
                    grid.ejecutaAccion('Alt+I');
                }
                if (e.which == Ext.EventObject.G) {
                    grid.ejecutaAccion('Alt+G');
                }
                if (e.which == Ext.EventObject.L) {
                    grid.ejecutaAccion('Alt+L');
                }

                if (e.which == Ext.EventObject.H) {
                    grid.ejecutaAccion('Alt+H');
                }

            }
            if (e.which == Ext.EventObject.DELETE) {
                grid.ejecutaAccion('DEL');
            }
        }


    },
    initEventos: function () {
        var _this = this;
        if (this.datos.tipo_interfaz == 'no_entrada') {
            this.gridSur.getStore().on('load', function (store, rd) {
                //_this.gridSur.propertyGridAtribDinamicos.setContenido(); no poner esto porque se tufa
                _this.atibutosDinamicosSur.collapse();
                _this.gridSur.getPMonedas().collapse();
                _this.idRegNumSurSeleccionado = null;
                _this.gridNorte.getStore().load();
            });
            this.gridNorte.getStore().on('beforeLoad', function (st, options) {
                if (_this.gridSur.getStore().getCount() > 0) {
                    st.baseParams.idregnumericos_quitar = Ext.encode(_this.gridSur.getStore().reader.jsonData.idregnumericos);
                }
            });
            this.gridNorte.getStore().on('load', function () {
                _this.gridNorte.getStore().baseParams.idregnumericos_quitar = new Array();
            });
            this.gridSur.getSelectionModel().on('rowdeselect', function (e) {
                _this.gridSur.propertyGridAtribDinamicos.setContenido();
                _this.gridSur.getPMonedas().collapse()
                window.setTimeout(function () {
                    if (!_this.gridNorte.getSelectionModel().hasSelection()) {
                        _this.atibutosDinamicosSur.collapse();
                    }
                }, 20);
                _this.idRegNumSurSeleccionado = null;
                Ext.aft.regNumerico.fn.gestionarBotones(_this);
            });
        }

        this.gridNorte.getSelectionModel().on('rowdeselect', function () {
            _this.gridNorte.propertyGridAtribDinamicos.setContenido();
            if (_this.datos.tipo_interfaz == 'entrada') {
                _this.gridNorte.getPMonedas().collapse()
            }

            window.setTimeout(function () {
                if (!_this.gridNorte.getSelectionModel().hasSelection()) {
                    _this.atibutosDinamicosNorte.collapse();
                }
            }, 20);
            _this.idRegNumNorteSeleccionado = null;
            Ext.aft.regNumerico.fn.gestionarBotones(_this);
        });
        this.gridNorte.getSelectionModel().on('rowselect', function () {
            Ext.aft.regNumerico.fn.gestionarBotones(_this);
        });
        this.gridNorte.on('afteredit', function () {
            Ext.aft.regNumerico.fn.gestionarBotones(_this);
        });
        this.gridNorte.getStore().on('load', function () {
            Ext.getBody().unmask();
            //_this.gridNorte.propertyGridAtribDinamicos.setContenido(); no poner esto porque se tufa
            _this.atibutosDinamicosNorte.collapse();
            if (_this.datos.tipo_interfaz == 'entrada')
                _this.gridNorte.getPMonedas().collapse();
            _this.idRegNumNorteSeleccionado = null;
            Ext.aft.regNumerico.fn.gestionarBotones(_this);
        });
        if (this.gridSur) {
            this.gridSur.getSelectionModel().on('rowdeselect', function () {
                Ext.aft.regNumerico.fn.gestionarBotones(_this);
            });
            this.gridSur.getSelectionModel().on('rowselect', function () {
                Ext.aft.regNumerico.fn.gestionarBotones(_this);
            });
            this.gridSur.on('afteredit', function () {
                Ext.aft.regNumerico.fn.gestionarBotones(_this);
            });
            this.gridSur.getStore().on('load', function () {
                Ext.aft.regNumerico.fn.gestionarBotones(_this);
            });
            this.gridSur.on({
                'rowclick': function (grid, rowIndex, e) {
                    if (grid.getSelectionModel().getCount() > 0) {
                        if (grid.getSelectionModel().getCount() == 1) {
                            _this.monedasSur.setMovRegnumerico(grid.getSelectionModel().getSelected().data.idmovregnumerico);
                        }
                        if (_this.idRegNumSurSeleccionado != grid.getSelectionModel().getSelected().get('idregnumerico')) {
                            var record = grid.getSelectionModel().getSelected();
                            if (_this.datos.arridtablas.replace(/[\,\-1]/ig, '').length > 0) {
                                var record = grid.getSelectionModel().getSelected();
                                if (record) {
                                    grid.llavesForaneas = Array();
                                    grid.llavesForaneas[0] = {
                                        key: 'idregnumerico',
                                        value: record.get('idregnumerico')
                                    };
                                    grid.llavesForaneas[1] = {
                                        key: 'idmovregnumerico',
                                        value: record.get('idmovregnumerico')
                                    };
                                    grid.ar_where = 'idregnumerico = ' + record.get('idregnumerico') + ' and idmovregnumerico = ' + record.get('idmovregnumerico');
                                } else {
                                    throw 'Record no seleccionado';
                                }
                                grid.propertyGridAtribDinamicos.setContenido(_this.datos.arridtablas);
                                _this.atibutosDinamicosSur.expand();
                            } else {
                                _this.atibutosDinamicosSur.collapse();
                            }
                            _this.idRegNumSurSeleccionado = record.get('idregnumerico');
                        }
                    }
                }
            });
        }

        this.gridNorte.on({
            'rowclick': function (grid, rowIndex, e) {
                if (grid.getSelectionModel().getCount() > 0) {
                    if (grid.getSelectionModel().getCount() == 1 && _this.datos.tipo_interfaz == 'entrada') {
                        _this.monedasNorte.setMovRegnumerico(grid.getSelectionModel().getSelected().data.idmovregnumerico);
                    }
                    if (_this.idRegNumNorteSeleccionado != grid.getSelectionModel().getSelected().get('idregnumerico')) {

                        var record = grid.getSelectionModel().getSelected();
                        if (_this.datos.arridtablas.replace(/[\,\-1]/ig, '').length > 0) {

                            if (this.datos.tipo_interfaz == 'no_entrada') {
                                Ext.getBody().mask(_this.idioma.lbLoad, 'x-mask-loading');
                                Ext.Ajax.request({
                                    method: 'POST',
                                    url: _this.datos.urlControladora + 'getultimoidmov',
                                    params: {
                                        idregnumerico: record.get('idregnumerico')
                                    },
                                    callback: function (options, success, response) {
                                        Ext.getBody().unmask();
                                        var rd = Ext.decode(response.responseText);
                                        grid.llavesForaneas = Array();
                                        grid.llavesForaneas[0] = {
                                            key: 'idregnumerico',
                                            value: record.get('idregnumerico')
                                        };
                                        grid.llavesForaneas[1] = {
                                            key: 'idmovregnumerico',
                                            value: record.get('idmovregnumerico')
                                        };
                                        grid.ar_where = 'idregnumerico = ' + record.get('idregnumerico') + ' and idmovregnumerico = ' + rd.idmovregnumerico;
                                        grid.propertyGridAtribDinamicos.setContenido(_this.datos.arridtablas);
                                        _this.atibutosDinamicosNorte.expand();
                                    }
                                });
                            } else {
                                var record = grid.getSelectionModel().getSelected();
                                if (record && record.get('idregnumerico') && record.get('idmovregnumerico')) {

                                    grid.llavesForaneas = Array();
                                    grid.llavesForaneas[0] = {
                                        key: 'idregnumerico',
                                        value: record.get('idregnumerico')
                                    };
                                    grid.llavesForaneas[1] = {
                                        key: 'idmovregnumerico',
                                        value: record.get('idmovregnumerico')
                                    };
                                    grid.ar_where = 'idregnumerico = ' + record.get('idregnumerico');
                                } else {
                                    throw 'Record no seleccionado';
                                }
                                grid.propertyGridAtribDinamicos.setContenido(_this.datos.arridtablas);
                                _this.atibutosDinamicosNorte.expand();
                            }
                        } else {
                            _this.atibutosDinamicosNorte.collapse();
                        }
                        _this.idRegNumNorteSeleccionado = record.get('idregnumerico');
                    }
                }
            }
        });
    },
    getPropertyGridAtributosDinamicos: function () {

    }
});

/**Gestion de Monedas
 */
Ext.aft.regNumerico.Monedas = Ext.extend(LOG.util.UITemplate, {
    valorEditable: false,
    interfaz: 'entrada',
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.dirController = '/logistica/activos_fijos/utiles/index.php/gestregnumerico';
        this.urlBusquedaGridPrincipal = 'cargarMonedas';
        this.gridEditable = true;
        this.modoSeleccion = 1;
        this.bbarVisible = false;
        this.columnas = config.columnas;
        this.listaMonedas = new LOG.util.List();
        Ext.aft.regNumerico.Monedas.superclass.constructor.call(this, config);
        this.addEvents('dirtyMonedas');
        this.addEvents('recargarGrid');
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            tooltip: this.idioma.ttBtnAdicionarMoneda,
            btn: 1,
            handler: function () {
                var record = {};
                Ext.each(_this.columnas, function (col) {
                    record[col.dataIndex] = 0;
                });// idmovimiento: _this.idmovimiento,
                _this.getStorePrincipal().add(new Ext.data.Record(record));
            }
            /*controlFn: function(b, _caller) {
             if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
             b.show();
             LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function(e) {
             switch (e) {
             case 'load' :
             b.setDisabled(this.getCount() >= _this.monedas.cantidad);
             break;
             case 'add' :
             b.setDisabled(this.getCount() >= _this.monedas.cantidad);
             break;
             case 'remove' :
             b.enable();
             break;
             }
             }, 'addMoneda');
             } else {
             b.hide();
             }
             }*/
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            tooltip: this.idioma.ttBtnEliminarMoneda,
            disabled: true,
            btn: 2,
            handler: function () {
                if (_this.getSmPrincipal().getSelected().data.idmovregnumericomoneda) {
                    _this.eliminarMonedas(_this.getSmPrincipal().getSelected().data);
                } else {
                    _this.editarMonedas(_this.getStorePrincipal(), _this.getSmPrincipal().getSelected(), true);
                    _this.getStorePrincipal().remove(_this.getSmPrincipal().getSelected());

                }
            },
            controlFn: function (b, _caller) {
                LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() > 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'eliminarMoneda');
            }
        }));
        Ext.apply(this.listaBotones.getBy('btn', 1), {key: null});
        Ext.apply(this.listaBotones.getBy('btn', 2), {key: null});
    },
    initDefaultColumns: function () {
        var _this = this;
        this.monedas = new LOG.util.ComboBox({
            name: 'idmoneda',
            valueField: 'idmoneda',
            displayField: 'codigoiso',
            url: '/logistica/activos_fijos/utiles/index.php/gestregnumerico/cargarTipoMonedas',
            allowBlank: false,
            editable: false,
            mode: 'remote',
            resizable: true,
            listeners: {
                focus: function (_cb) {
                    _cb.getStore().filterBy(function (item) {
                        return _this.getStorePrincipal().find('idmoneda', item.data.idmoneda) == -1;
                    });
                }
            }
        });
        this.monedas.getStore().on({
            load: function (_st) {
                _this.monedas.cantidad = _st.getCount();
                _st.filterBy(function (item) {
                    return _this.getStorePrincipal().find('idmoneda', item.data.idmoneda) == -1;
                });
            }
        });
        this.addGridColumn({
            header: this.idioma.gcTipoMoneda,
            width: 120,
            dataIndex: 'idmoneda',
            editor: this.monedas,
            renderer: function (_v, _mD, _r) {
                var moneda = this.editor.getStore().getById(_v);
                if (moneda) {
                    moneda = moneda.data.codigoiso;
                }
                return moneda;
            },
            default: true
        });
        this.addGridColumn({dataIndex: 'idmovregnumericomoneda'});
        this.addGridColumn({dataIndex: 'idmovregnumerico'});
        var array = _this.sortColumnas();
        if (_this.valorEditable) {
            Ext.each(_this.columnas, function (col) {
                if (col.dataIndex == 'valoradquisicion')
                    var text = _this.idioma.msgRangoMaxV;
                if (col.dataIndex == 'depreciacionacumulada')
                    var text = _this.idioma.msgRangoMinV;
                _this.addGridColumn({
                    header: col.header,
                    width: 180,
                    align: 'right',
                    dataIndex: col.dataIndex,
                    editor: new LOG.util.Prototipos.inputDecimal({
                        allowBlank: false,
                        invalidText: text,
                        validator: function (value) {
                            return _this.validarCampos(value, col)
                        }
                    }),
                    renderer: function (_v, _mD, _r) {
                        _r.data[col.dataIndex] = _v || 0;
                        return _r.data[col.dataIndex];
                    },
                    default: true
                });
            });
        } else {
            Ext.each(array, function (col) {
                if (col) {
                    if (col.dataIndex == 'valoradquisicion')
                        var text = _this.idioma.msgRangoMax;
                    if (col.dataIndex == 'depreciacionacumulada')
                        var text = _this.idioma.msgRangoMin;
                    var editor = new LOG.util.Prototipos.inputDecimal({
                        invalidText: text,
                        allowBlank: false,
                        validator: function (value) {
                            return _this.validarCampos(value, col)
                        }
                    });
                    _this.addGridColumn({
                        header: col.header,
                        width: 180,
                        align: 'right',
                        dataIndex: col.dataIndex,
                        editor: (col.dataIndex == 'valorcontable') ? null : editor,
                        renderer: function (_v, _mD, _r) {
                            _r.data[col.dataIndex] = _v || 0;
                            return _r.data[col.dataIndex];
                        },
                        default: true
                    });
                }
            });
        }


    },
    sortColumnas: function () {
        var _this = this;
        var array = Array();
        array.length = _this.columnas.length;
        Ext.each(_this.columnas, function (col, p) {
            if (col.dataIndex == 'valorcontable')
                array[2] = col;
            else if (col.dataIndex == 'valoradquisicion')
                array[0] = col;
            else if (col.dataIndex == 'depreciacionacumulada')
                array[1] = col;
            else
                array.push(col);
        });
        return array;
    },
    validarCampos: function (value, col) {
        var _this = this;
        var valor = parseFloat(value);

        if (_this.valorEditable) {
            if (col.dataIndex == 'valorcontable') {
                var recordSel = _this.getSmPrincipal().getSelected();
                var dep = 0;
                if (typeof (recordSel.data.depreciacionacumulada) != 'undefined')
                    dep = parseFloat(recordSel.data.depreciacionacumulada);
                if (valor >= dep)
                    return true;
                else
                    return false;
            }

            if (col.dataIndex == 'depreciacionacumulada') {
                var recordSel = _this.getSmPrincipal().getSelected();
                var cont = parseFloat(recordSel.data.valorcontable);
                if (valor <= cont)
                    return true;
                else
                    return false;
            }
        } else {
            if (col.dataIndex == 'valoradquisicion') {
                var recordSel = _this.getSmPrincipal().getSelected();
                var dep = 0;
                if (typeof (recordSel.data.depreciacionacumulada) != 'undefined')
                    dep = parseFloat(recordSel.data.depreciacionacumulada);
                if (valor >= dep)
                    return true;
                else
                    return false;
            }

            if (col.dataIndex == 'depreciacionacumulada') {
                var recordSel = _this.getSmPrincipal().getSelected();
                var adq = parseFloat(recordSel.data.valoradquisicion);
                if (valor <= adq)
                    return true;
                else
                    return false;
            }
        }
    },
    render: function () {
        var render = Ext.aft.regNumerico.Monedas.superclass.render.call(this);
        var _this = this;
        this.getStorePrincipal().on({
            'update': function (st, r) {
                _this.editarMonedas(st, r);
                _this.fireEvent('dirtyMonedas', r);
            }
        });
        this.getStorePrincipal().on({
            beforeload: function () {
                this.removeAll();
                _this.listaMonedas = new LOG.util.List();
                this.initBaseParams.idmovregnumerico = _this.idmovregnumerico;
            }
        });
        return render;
    },
    setMovRegnumerico: function (idmovregnumerico) {
        this.idmovregnumerico = idmovregnumerico;
    },
    editarMonedas: function (store, record, borrar) {
        var _this = this;
        store.each(function (item) {
            if (record.data.idmoneda && (!borrar || (borrar && record.data.idmoneda != item.data.idmoneda))) {
                var index = -1;
                var moneda = item.data;
                _this.listaMonedas.each(function (_m, _i) {
                    if ((moneda.idmovmoneda && _m.idmovmoneda == moneda.idmovmoneda) || (!moneda.idmovmoneda && _m.idmoneda == moneda.idmoneda)) {
                        index = _i;
                    }
                });
                if (_this.interfaz == 'entrada') {
                    moneda.valorcontable = 0
                }
                if (index == -1) {
                    _this.listaMonedas.add(moneda);
                } else {
                    _this.listaMonedas.setItem(moneda, index);
                }
            }
        });
    },
    eliminarMonedas: function (parametros, _fn, _fnFail) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgDeleteMoneda, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgEliminandoMoneda, this.idioma.msgEspere || '...');
                Ext.Ajax.request({
                    url: '/logistica/activos_fijos/utiles/index.php/gestregnumerico/eliminarMoneda',
                    method: 'POST',
                    params: parametros,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            mostrarMensaje(1, _this.idioma.msgMonedaEliminada);
                            _this.getStorePrincipal().load();
                            _this.fireEvent('recargarGrid');
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)
                });
            }
        }.createDelegate(this));
    }

});

Ext.aft.regNumerico.BusquedaEstatica = Ext.extend(LOG.util.Window, {
    grid: undefined,
    arearesp: undefined,
    idarearesp: undefined,
    cerrarAceptar: false,
    heitghInicial: 0,
    arrayAlturas: Array(),
    tipo: 1,
    constructor: function (config) {
        var _this = this;
        this.idioma = config.idioma;
        this.title = this.idioma.lbBtnbuscarAvanz;
        this.tipo = config.tipo;
        this.resizable = true;
        //this.width = 700;
        this.scope = config.scope;
        this.x = 50;
        this.y = 50;
        // this.model = config.model;
        this.plugins = new LOG.util.List();
        this.corePlugins = {};
        this.closeAction = 'close';
        Ext.aft.regNumerico.BusquedaEstatica.superclass.constructor.call(this, config);
        this.addEvents('clean');
        this.addEvents('find');
        this.listaBotones.getItem(2).disable();
        this.setWidth(900);
        this.on({
            'resize': function (win, width, height) {

                if (_this.getHeight() != _this.heitghInicial && _this.heitghInicial > 0) {
                    Ext.each(_this.tabpanel.items.items, function (o) {
                        o.setHeight(_this.getHeight() - 110);
                    });
                    //_this.panelDatosG.setHeight(_this.getHeight() - 115);
                    _this.panelGeneral.doLayout();
                }
            },
            'show': function (cmp) {
                // _this.codigo.focus(false, 500);
                // _this.codigoReg.focus(false, 500);
                _this.tabpanel.setActiveTab(1);
                _this.tabpanel.setActiveTab(0);
            }
        })
        this.documentKeyMap = new Ext.KeyMap(document,
                [
                    {
                        key: Ext.EventObject.ENTER,
                        fn: function () {
                            if (_this.btnAvaible) {
                                _this.listaBotones.getItem(2).handler(_this.listaBotones.getItem(2));
                            }
                        }
                    }

                ]);

    },
    initComponent: function () {
        var _this = this;
        this.listaBotones.deleteAll();
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonCancelar({
            text: _this.idioma.btnCerrar,
            handler: function () {
                this.scope.hide();
            },
            scope: this
        })));
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonLimpiar({
            tooltip: _this.idioma.ttBtnLimpiar,
            handler: function () {
                _this.LimpiarVRegNume();


            }
        })));
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonBuscar({
            disabled: false,
            handler: function () {
                _this.buscar();
            }
        })));

        Ext.aft.regNumerico.BusquedaEstatica.superclass.initComponent.call(this);
        //Añadiendo vistas        
        this.panelGeneral = new LOG.util.Panel({
            frame: true,
            region: 'center',
            layout: 'card',
            activeItem: 0,
            items: [_this.camposBusquedaVistaRegNum()]
        });
        //Añadiendo plugins
        this.addPlugins();
        this.add(this.panelGeneral);
    },
    buscar: function () {
        var _this = this;
        var form = _this.formDatosMedioR.getForm();
        var arrayParametros = new Array();

        form.items.each(function (field, pos) {
            if (field.getValue()) {
                arrayParametros[pos] = {field: field.name, value: field.getValue()};
            }
        });
        _this.scope.store.on({
            'beforeload': function (st, obj) {
                obj.params.filter = Ext.encode(arrayParametros);
            }
        });
        _this.scope.store.load();
        _this.hide();
    },
    /**
     * Campos estáticos de la búsqueda para la vista de los regnumericos
     * **/
    camposBusquedaVistaRegNum: function () {
        var _this = this;
        _this.initPlugin();
        this.camposGenerales = LOG.aft.RegOperativo.Campos;
        this.generalesModif = Array();
        for (var prop in this.camposGenerales) {
            var cmp = this.camposGenerales[prop];
            if (cmp.nameplugin == 'Datos generales')
                this.generalesModif.push(cmp);
        }
        var cls = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });
        var numerics = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        var array = Array();
        this.tabpanel = new Ext.TabPanel({
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true
        });
        _this.formDatosMedioR = LOG.util.UIManager.initForm({
            items: [_this.tabpanel]
        });
        _this.crearCamposPlugins(_this.generalesModif, _this.scope.array_pNivel);
        return _this.formDatosMedioR;
    },
    /**
     * Campos dinámicos de la búsqueda para la vista de los regnumericos
     * **/
    crearCamposPlugins: function (campos, columnas) {
        var _this = this;
        var cls = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });
        var columnFechas = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        var arrCampos = _this.prepararCamposDin(campos, columnas);
        if (arrCampos.length > 0) {
            var title = '';

            for (var prop in arrCampos) {
                var cmp = arrCampos[prop];
                title = cmp.nameplugin;
                break;
            }
            var panelPlugin = new LOG.util.Panel({
                frame: true,
                region: 'center',
                title: title,
                height: 512,
                autoScroll: true,
                items: [cls/*, columnFechas*/]
            });
            var camposnull = Array();
            var fechas = Array();
            for (var prop in arrCampos) {
                var cmp = arrCampos[prop];
                if (cmp.name && cmp.xtype != 'datefield')
                    camposnull.push([cmp.fieldLabel, cmp.name]);
                if (cmp.xtype == 'datefield') {
                    fechas.push(cmp);
                } else {
                    _this.definirComponente(cmp, cls);
                }

            }

            var storeCampos = new Ext.data.SimpleStore({
                fields: [
                    {
                        name: 'denominacion'
                    },
                    {
                        name: 'id'
                    }
                ]
            });
            storeCampos.loadData(camposnull);
            var comboCampos = new LOG.util.LovCombo({
                fieldLabel: this.idioma.labelCamposNull,
                name: 'camposnullPlg',
                width: 360,
                nameplugin: title,
                store: storeCampos,
                resizable: true,
                minListWidth: 300,
                emptyText: this.idioma.lbSeleccione,
                displayField: 'denominacion',
                valueField: 'id',
                listeners: {
                    'select': function (cb, e) {
                        if (e.data.checked && cb.getValue()) {
                            _this.findById(e.data.id).reset();
                            _this.findById(e.data.id).disable();
                            _this.condicionButtons(true)
                        } else {
                            _this.model.listaCamposNull.each(function (o, p) {
                                if (o.valor == e.data.id && o.name == cb.nameplugin)
                                    this.delete(p)
                            });
                            if (!e.data.checked && !cb.getValue())
                                _this.condicionButtons(false)
                        }
                    },
                    'keyup': function (cb, e) {
                        if (e.getKey() != 9 && e.getKey() != 13) {
                            if (this.isDirty()) {
                                _this.listaBotones.getItem(2).disable();
                            }
                        }
                    }
                }
            });
            _this.elementosFechas(fechas, columnFechas);
            panelPlugin.add(cls);
            panelPlugin.doLayout();
            _this.tabpanel.add(panelPlugin);
            _this.tabpanel.doLayout();
            _this.arrayAlturas.push(250);
        }

    },
    /**
     * Auxiliar para rango de los elementos de fechas
     * **/
    elementosFechas: function (array, fechas) {
        var _this = this;
        Ext.each(array, function (o) {
            var columns = LOG.util.UIManager.initColumnForm({
                columnas: 2
            });
            var minvalor = new Ext.form.DateField({
                fieldLabel: _this.idioma.labelMinFecha,
                name: 'min_' + o.name,
                allowBlank: true,
                vtype: 'daterange',
                format: 'm/d/Y',
                editable: false,
                validarEnFormBasico: true,
                listeners: {
                    'select': function (campo) {
                        maxvalor.setMinValue(campo.getValue());
                        _this.condicionButtons();
                    }
                }
            });
            columns.addComponent(minvalor);
            var maxvalor = new Ext.form.DateField({
                name: 'max_' + o.name,
                fieldLabel: _this.idioma.labelMaxFech,
                startDateField: minvalor,
                editable: false,
                format: 'm/d/Y',
                vtype: 'daterange',
                validarEnFormBasico: true,
                allowBlank: true,
                listeners: {
                    select: function (campo) {
                        minvalor.setMaxValue(campo.getValue());
                        _this.condicionButtons();
                    }
                }
            });
            columns.addComponent(maxvalor);
            var fieldValor = new Ext.form.FieldSet({
                title: o.fieldLabel,
                items: [columns]
            });
            fechas.addComponent(fieldValor);

        });
    },
    /**
     * Auxiliar para crear campos de los datos generales y plugins
     * **/
    definirComponente: function (cmp, cls) {
        var _this = this;
        switch (cmp.xtype) {
            case 'textfield':
                var field = new Ext.form.TextField(cmp);
                Ext.apply(field, {
                    allowBlank: true,
                    // id: cmp.name,
                    enableKeyEvents: true,
                    fieldLabel: cmp.fieldLabel
                });
                field.on({
                    'keyup': function (cb, e) {
                        _this.condicionButtons()

                    }
                });
                cls.addComponent(field)
                break;
            case 'numberfield':
                var field = new Ext.form.NumberField(cmp);
                Ext.apply(field, {
                    allowBlank: true,
                    // id: cmp.name,
                    enableKeyEvents: true,
                    fieldLabel: cmp.fieldLabel,
                    maxLength: 30,
                    regexText: _this.idioma.ttnanTextEntero
                });
                field.on({
                    'keyup': function (cb, e) {
                        _this.condicionButtons()

                    }
                });
                cls.addComponent(field)
                break;
            case 'combobox':
                if (cmp.nameInRecord != 'idarearesp') {
                    var arrURL = cmp.url.split('/');
                    if (arrURL.length == 1) {
                        cmp.url = '/logistica/activos_fijos/regoperativo/index.php/gestregoperativo/' + arrURL[0];
                    }
                    var comboAux = new LOG.util.ComboBox(cmp);
                    var field = new Ext.form.ComboBox(cmp);
                    Ext.apply(field, {
                        allowBlank: true,
                        // id: cmp.valorEnviar,
                        name: cmp.valorEnviar,
                        resizable: true,
                        minListWidth: 300,
                        queryParam: 'criterio',
                        mode: 'remote',
                        enableKeyEvents: true,
                        emptyText: this.idioma.lbSeleccione,
                        url: comboAux.url,
                        store: comboAux.store,
                        fieldLabel: cmp.fieldLabel
                    });
                    if (cmp.nameInRecord == 'denomcolorprim') {
                        field.store.baseParams.colorPrimario = 1;
                    }
                }
                if (cmp.nameInRecord == 'idarearesp') {
                    var field = new Ext.aft.regNumerico.ComboDepositos({
                        allowBlank: true,
                        fieldLabel: cmp.fieldLabel,
                        valueField: cmp.valueField,
                        name: cmp.valorEnviar,
                        //  id: cmp.valorEnviar,
                        autoCreate: true,
                        typeAhead: true,
                        triggerAction: 'all',
                        resizable: true,
                        enableKeyEvents: true,
                        forceSelection: true,
                        idioma: _this.idioma,
                        width: 216,
                        editable: false,
                        emptyText: _this.idioma.lbCbVacio
                    });
                }
                field.on({
                    'select': function (cb, re) {
                        _this.arearesp = re.data.deposito;
                        _this.idarearesp = re.data.iddeposito;
                        //_this.findById('idubicacion').enable();
                        _this.condicionButtons()
                    },
                    'keyup': function (cb, e) {
                        if (e.getKey() != 9 && e.getKey() != 13) {
                            if (this.isDirty()) {
                                _this.listaBotones.getItem(2).disable();
                            }
                        }
                    }
                });
                cls.addComponent(field)
                break;
            case 'datefield':
                var field = new Ext.form.DateField(cmp);
                Ext.apply(field, {
                    allowBlank: true,
                    //id: cmp.name,
                    fieldLabel: cmp.fieldLabel
                });
                field.on({
                    'select': function (cb, e) {
                        _this.condicionButtons()
                    }
                });
                cls.addComponent(field)
                break;

            case 'win_responsable':
                var field = new Ext.form.TextField(cmp);
                Ext.apply(field, {
                    allowBlank: true,
                    idresponsable: undefined,
                    //id: 'idresponsable',
                    name: 'idresponsable',
                    fieldLabel: cmp.fieldLabel
                });
                field.on({
                    'focus': function (field) {
                        // Ext.getBody().mask(_this.idioma.lbLoad, 'x-mask-loading');
                        if (!_this.Responsable) {
                            var panelBusPer = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
                                region: 'center',
                                id: 'panelBusPer',
                                singleSelect: true,
                                identidad: perfil.idestructuracomun,
                                showBtnAdicionar: true,
                                modulo: 'LOGISTICA',
                                showBtnAyuda: false,
                                seguridad: 0,
                                limit: 30,
                                start: 0,
                                height: 100,
                                listeners: {
                                    'personaselecionada': function () {
                                        winBuscarPersona.listaBotones.getItem(2).enable();
                                    },
                                    'personadeselecionada': function () {
                                        winBuscarPersona.listaBotones.getItem(2).disable();
                                    }
                                }
                            });

                            // Se agrega esto porque sino el boton limpiar del componente de persona no funciona
                            // -----------------------------------------------
                            panelBusPer.runSearch = function (condiciones) {
                                if (condiciones && condiciones.length > 0 && condiciones[0] != " ") {
                                    condiciones[condiciones.length - 1].logico = '';
                                    panelBusPer.hasSearch = true;
                                } else {
                                    panelBusPer.hasSearch = false;
                                }
                                panelBusPer.stPersonas.baseParams.condiciones = condiciones;
                                panelBusPer.stPersonas.load();
                            };
                            panelBusPer.cleanSearch = function () {
                                panelBusPer.tfbuscar.reset();
                                panelBusPer.stPersonas.baseParams.condiciones = '';
                                panelBusPer.stPersonas.baseParams.start = 0;
                                panelBusPer.stPersonas.baseParams.limit = 25;
                                panelBusPer.stPersonas.reload();
                            };

                            var winBuscarPersona = new LOG.aft.documento.winResponsable({
                                title: 'Personas',
                                layout: 'fit',
                                initComponent: function (config) {
                                    LOG.aft.documento.winResponsable.superclass.initComponent.call(this);
                                    LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
                                        handler: function () {
                                            winBuscarPersona.destroy();
                                        }
                                    });
                                    LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
                                        disabled: true,
                                        handler: function () {
                                            if (panelBusPer.getSeleccion()) {
                                                field.idresponsable = panelBusPer.getSeleccion().get('idpersona');
                                                var nombre = panelBusPer.getSeleccion().get('nombre') + ' ' + panelBusPer.getSeleccion().get('papel') +
                                                        ' ' + panelBusPer.getSeleccion().get('sapel');
                                                field.setValue(nombre);
                                                field.fireEvent('blur');
                                            }
                                            _this.condicionButtons();
                                            winBuscarPersona.close();
                                        }
                                    });
                                }
                            });
                            winBuscarPersona.add(panelBusPer);
                            winBuscarPersona.show();
                        }
                    }
                });
                cls.addComponent(field)
                break;

            case 'win_ubicacion':
                var field = new Ext.form.TextField(cmp);
                Ext.apply(field, {
                    allowBlank: true,
                    disabled: true,
                    idubicacion: undefined,
                    //id: 'idubicacion',
                    name: 'idubicacion',
                    fieldLabel: cmp.fieldLabel
                });
                field.on({
                    'focus': function (field) {
                        Ext.getBody().mask(_this.idioma.lbLoad, 'x-mask-loading');
                        var objParams = new Object();
                        objParams.tipoestructura = 2;
                        objParams.arearesp = _this.arearesp;
                        objParams.idubicacion = _this.idarearesp;
                        objParams.doAction = function (obj_nodoSeleccionado) {
                            if (obj_nodoSeleccionado.getDepth() != 0) {
                                _this.Ubicacion.btnAceptar.enable()
                            } else {
                                _this.Ubicacion.btnAceptar.disable()
                            }
                            field.idubicacion = obj_nodoSeleccionado.id;
                            field.setValue(obj_nodoSeleccionado.text);
                            field.fireEvent('blur');
                            _this.Ubicacion.hide();
                        }
                        objParams.listeners = {
                            'beforeshow': function () {
                                _this.Ubicacion.idioma.lbMsgNoEstructuras = _this.idioma.lbMsgNoEstructuras;
                                _this.Ubicacion.tpEstructurae.on({
                                    'click': function (node, e) {
                                        _this.Ubicacion.btnAceptar.setDisabled(node.getDepth() == 0)
                                    }
                                });
                                Ext.getBody().unmask(_this.Ubicacion);
                                _this.Ubicacion.btnAceptar.disable()
                            }
                        }

                        _this.Ubicacion = new Ext.Log.Treestructuraubicacion.ventana(objParams);
                    }
                });
                cls.addComponent(field)
                break;
        }
    },
    /**
     * Auxiliar para preparar los campos dinámicos a crear
     * **/
    prepararCamposDin: function (obj1, obj2) {
        var array = Array();
        for (var prop1 in obj1) {
            Ext.each(obj2, function (prop2) {
                if (obj1[prop1].dataIndex == prop2.dataIndex) {
                    array.push(obj1[prop1]);
                }
            });
        }
        return array;
    },
    /**
     * Auxiliares para limpiar las vistas
     **/
    LimpiarVRegNume: function (cerrar) {
        var _this = this;

        var form = _this.formDatosMedioR.getForm();
        form.items.each(function (field) {
            if (field.isFormField) {
                field.reset();
                field.enable();
                field.originalValue = field.getValue();
            }
        });
        /*_this.model.limpiarLista();
         _this.model.reset();*/
        //_this.findById('idubicacion').disable();
        /* var param = {};
         param['idmarca'] = null;
         _this.modeloReg.store.load({params: param});*/
        _this.listaBotones.getItem(2).disable();
        _this.scope.store.on({
            'beforeload': function (st, obj) {
                obj.params.filter = [];
            }
        });
        _this.scope.store.load();
        if (!cerrar)
            _this.fireEvent('clean');
    },
    LimpiarTabPanel: function () {
        var _this = this;
        _this.tabpanel.items.each(function (o, p) {
            if (p > 1)
                _this.tabpanel.remove(o);
        });
    },
    /**
     * Auxiliar para validar boton buscar
     **/
    condicionButtons: function (check) {
        var _this = this;
        var form = _this.formDatosMedioR.getForm();

        if (check && form.isValid() && form.isDirty()) {
            _this.btnAvaible = true;
            _this.listaBotones.getItem(2).enable();
        } else {
            if (!check && form.isValid() && form.isDirty()) {
                _this.listaBotones.getItem(2).enable();
                _this.btnAvaible = true;
            } else {
                _this.listaBotones.getItem(2).disable();
                _this.btnAvaible = false;
            }

        }
    },
    /**
     * Tratamiento de plugins
     **/
    addPlugins: function () {
        for (var i = 0; i < arrCampos.length; i++) {
            this.attatchPlugin(arrCampos[i]);
        }
        this.arrayColumns = Array();

        for (var i = 0; i < arrElementosGridCodigoNew.length; i++) {
            this.arrayColumns.push(arrElementosGridCodigoNew[i]);
        }
    },
    attatchPlugin: function (plugin) {
        this.plugins.add(plugin);
    },
    initPlugin: function () {
        var _this = this;
        _this.corePlugins['campos'] = {};

        _this.plugins.each(function (plugin, pos) {
            plugin.init(_this.corePlugins);
            if (!_this.isEmpty(_this.corePlugins.campos)) {
                _this.crearCamposPlugins(_this.corePlugins.campos, _this.scope.array_pNivel);//_this.array_pNivel
            }
        });
    },
    isEmpty: function (obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    }

});

Ext.aft.regNumerico.ComboDepositos = Ext.extend(LOG.util.ComboBox, {
    dirUrl: '/logistica/activos_fijos/utiles/index.php/gestarearesponsabilidad/',
    constructor: function (config) {
        Ext.apply(this, config);
        var _this = this;
        _this.url = _this.dirUrl + 'cargarareas';
        _this.valueField = 'iddeposito';
        _this.displayField = 'deposito';
        _this.name = 'idestructuracomun';
        _this.allowBlank = true;
        //_this.fieldLabel = config.idioma.lbCbDepositoBuscar;

        Ext.aft.regNumerico.ComboDepositos.superclass.constructor.call(this, config);
    }
});