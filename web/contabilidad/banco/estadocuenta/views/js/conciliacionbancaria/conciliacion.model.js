//Empaquetando el componente conciliacion.
Ext.ns('Banco.Conciliacion');

//Model del componente conciliacion.
Banco.Conciliacion.Model = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        //redefiniendo GroupingStore
        this.GroupingStore = Ext.extend(Ext.data.GroupingStore, {
            applySort: function() {
                Ext.data.GroupingStore.superclass.applySort.call(this);
                if (!this.groupOnSort && !this.remoteGroup) {
                    var A = this.getGroupState();
                    if (A && A != this.sortInfo.field) {
                        this.sortData('idcuentabancaria')
                    }
                }
            }
        });

        //listado de las conciliaciones
        this.stConciliaciones = new this.GroupingStore({
            url: 'cargarconciliaciones',
            reader: new Ext.data.JsonReader({
                root: 'result',
                id: 'idconciliacionbancaria',
                totalProperty: 'cant_filas'
            }, [
                {
                    name: 'idconciliacionbancaria'
                },
                {
                    name: 'idcuentabancaria'
                },
                {
                    name: 'fecha',
                    type: 'date',
                    dateFormat: 'd/m/Y'
                },
                {
                    name: 'saldoactuallibro'
                },
                {
                    name: 'saldoactualbanco'
                },
                {
                    name: 'saldoajustadolibro'
                },
                {
                    name: 'conciliado'
                },
                {
                    name: 'nomcta'
                },
                {
                    name: 'text'
                }]),
            groupField: 'text',
            sortInfo: {
                field: 'fecha',
                direction: 'ASC'
            }
        });

        //store del Combo Cuenta Bancaria
        this.stCuentaBancaria = new Ext.data.Store({
            url: 'cargarctasbancarias',
            id: 'stcomboCuenta',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idcuenta'
            }, [{
                    name: 'idcuenta',
                    type: 'string'
                }, {
                    name: 'nombre'
                }, {
                    name: 'numero'
                }, {
                    name: 'nombrecuentabancaria',
                    type: 'string'
                }, {
                    name: 'moneda'
                }, {
                    name: 'codigoiso'
                }, {
                    name: 'banco'
                }, {
                    name: 'nombanco'
                }, {
                    name: 'sucursal'
                }, {
                    name: 'nomsucursal'
                }
            ]),
            sortInfo: {
                field: 'nombrecuentabancaria',
                direction: 'ASC'
            }
        });
        //record para los store de banco
        this.recBanco = Ext.data.Record.create([
            'iddiferencia',
            'nroestado',
            'diferenciamo'
        ]);
        //store del grid Crédito en banco
        this.stCreditoBanco = new Ext.data.Store({
            reader: new Ext.data.ArrayReader({
                root: 'datos',
                totalProperty: 'cant'
            }, this.recBanco)
        });
        //store del grid Débito en banco
        this.stDebitoBanco = new Ext.data.Store({
            reader: new Ext.data.ArrayReader({
                root: 'datos',
                totalProperty: 'cant'
            }, this.recBanco)
        });
        //record para los store de libro
        this.recLibro = Ext.data.Record.create([
            'iddocumento',
            'idtipodocumento',
            'numerodocumento',
            'idestructuracomun',
            'fecha',
            'importemo',
            'registrado',
            'denomtipodoc',
            'origen'
        ]);
        //store del grid Crédito en libro
        this.stCreditoLibro = new Ext.data.Store({
            reader: new Ext.data.ArrayReader({
                root: 'datos',
                totalProperty: 'cant'
            }, this.recbanco)
        });
        //store del grid Débito en libro
        this.stDebitoLibro = new Ext.data.Store({
            reader: new Ext.data.ArrayReader({
                root: 'datos',
                totalProperty: 'cant'
            }, this.recLibro)
        });
        //store del grid Cuenta contable
        this.stCtaContable = new Ext.data.Store({
            //url : 'cargarctascontables',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{
                    name: 'idcuentacontable'
                }, {
                    name: 'importe'
                }, {
                    name: 'nombrecuentacontable'
                }
            ]),
            sortInfo: {
                field: 'nombrecuentacontable',
                direction: 'ASC'
            }
        });

    }
};