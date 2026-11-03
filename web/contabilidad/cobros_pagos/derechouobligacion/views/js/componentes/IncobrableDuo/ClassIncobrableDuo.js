Ext.namespace('Ext.ClassIncobrableDuo');
Ext.ClassIncobrableDuo = Ext.extend(Ext.Component, {
    etiquetas: undefined,
    cInicial: undefined,
    numeros: undefined,
    tipoDuo: undefined,
    arrayIdDuo: undefined,
    estadoDoc: undefined,
    url: undefined,
    constructor: function(etiquetas, params)
    {
        this.cInicial = params.cInicial;
        this.arrayIdDuo = params.arrayIdDuo;
        this.numeros = params.arrayNumDoc;
        this.tipoDuo = params.tipoDuo;
        this.estadoDoc = params.estadoDoc;
        this.tipoDuo = params.tipoDuo;
        this.url = params.url;

        this.etiquetas = etiquetas;
        scope = this;

        this.stIncobrableOperacion = new Ext.data.Store({
            url: this.url + 'loadDataOperacion',
            sortInfo: {
                field: 'denominacion',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                id: 'idopera'
            }, [{
                    name: 'idoperacion',
                    mapping: 'idoperacion'
                }, {
                    name: 'denominacion',
                    mapping: 'denominacion'
                }, {
                    name: 'codigoCuenta',
                    mapping: 'codigoCuenta'
                }, {
                    name: 'debitocredito',
                    mapping: 'debitocredito'
                }, {
                    name: 'idtipocuenta',
                    mapping: 'idtipocuenta'
                }, {
                    name: 'idcuenta',
                    mapping: 'idcuenta'
                }, {
                    name: 'nombrecuenta',
                    mapping: 'nombrecuenta'
                }
            ]),
            listeners: {
                load: {
                    scope: this,
                    fn: function(st) {
                        if (st.getCount() == 0) {
                            this.cbIncobrableOperacion.disable();
                            mostrarMensaje(1, scope.etiquetas.lbMsgNoExisteOperaciones);
                        }
                        else if (st.getCount() == 1) {
                            this.fLoadOneData(this.cbIncobrableOperacion, st, 'idoperacion', 'denominacion');
                            this.opCuentaGasto = st.getAt(0).get('cuentagasto');
                        }
                        else if (st.getCount() > 1)
                            this.cbIncobrableOperacion.enable();
                    }
                }
            }
        });

        this.wIncobrableDuo = new Ext.UIIncobrableDuo(this);
        this.initializeEvents(this);
        this.initializeFunctions(this);

        Ext.Ajax.request({
            url: scope.url + 'loadDataOperacion',
            method: 'POST',
            params: {
                tipoduo: this.tipoDuo,
                concepto: 29
            },
            callback: function(options, success, response)
            {
                responseData = Ext.decode(response.responseText);

                scope.loadDataComponent(responseData, this.action);
            }
        });

        return Ext.ClassIncobrableDuo.superclass.constructor.call(this);
    },
    loadDataComponent: function(data, action)
    {
        scope.fShowWindow();

        this.stIncobrableOperacion.loadData(data);

        if (this.stIncobrableOperacion.getCount() == 1) {
            scope.cbIncobrableOperacion.disable();
            scope.cbIncobrableOperacion.setValue(this.stIncobrableOperacion.getAt(0).get('idoperacion'));
            scope.cbIncobrableOperacion.setRawValue(this.stIncobrableOperacion.getAt(0).get('denominacion'));
        }
        else
            scope.cbIncobrableOperacion.enable();
    },
    loadMessageBox: function(msg)
    {
        Ext.MessageBox.show({
            title: scope.etiquetas.lbMsgEspere,
            msg: msg,
            width: 300,
            progress: true,
            closable: false
        });
        var f = function(v) {
            return function() {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i);
            };
        };
        for (var i = 1; i < 12; i++)
            setTimeout(f(i), i * 500);
    },
    initializeEvents: function(scope)
    {
        this.addEvents('closeIncobrable');
        this.btnIncobrableCerrar.on('click', function(component)
        {
            scope.wIncobrableDuo.close();
            scope.fireEvent('closeIncobrable', true);
        });

        this.addEvents('incobrableDuo');
        this.btnIncobrableAceptar.on('click', function(component)
        {
            if (scope.cbIncobrableOperacion.isValid())
                scope.fIncobrableDuo();
            else
                mostrarMensaje(1, scope.etiquetas.lbValIncorrectos);
        });
    },
    initializeFunctions: function(scope)
    {
        this.fIncobrableDuo = function()
        {
            scope.wIncobrableDuo.close();

            parametros = {
                url: "addIncobrableDuo",
                tipoDuo: scope.tipoDuo,
                arrayIdDuo: scope.arrayIdDuo,
                idOpContable: scope.cbIncobrableOperacion.getValue()
            };
            tipoContabilizacion = 2;
            actionContabiliza = 'incobrable';
            scope.fireEvent('incobrableDuo', parametros);
        };

        this.fShowWindow = function()
        {
            scope.wIncobrableDuo.show(Ext.getBody(), function()
            {
                scope.wIncobrableDuo.doLayout(true);
                if (Ext.MessageBox)
                    Ext.MessageBox.hide();
            });
        };

        this.fLoadOneData = function(combo, store, id, name)
        {
            combo.disable();
            combo.setValue(store.getAt(0).get(id));
            combo.setRawValue(store.getAt(0).get(name));
        };
    }
});
