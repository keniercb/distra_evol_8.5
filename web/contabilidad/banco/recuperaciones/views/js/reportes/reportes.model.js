/* 
 * @autor Alejandro Mengana Perez
 * Grupo de desarrolladores de CONFIN
 */

Ext.namespace('Banco.Recuperaciones.Reportes');

Banco.Recuperaciones.Reportes.Model = {
    inicio: function() {
        this.espacios = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        
        this.sttipocuenta = new Ext.data.Store({
            //url: 'cargartipocuenta',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'sttipocuenta',
                totalProperty: 'cant'
            },
            [{
                    name: 'idtipocuenta',
                    mapping: 'idtipocuentabancaria'
                }, {
                    name: 'denom',
                    mapping: 'descripcion'
                }]),
            sortInfo: {
                field: 'denom',
                direction: 'ASC'
            }
        });

        this.stperiodo = new Ext.data.Store({
            url: 'cargarperiodos',
            id: 'stperiodo',
            reader: new Ext.data.JsonReader({
                id: 'periodo'
            },
            [{
                    name: 'idperiodo'
                }, {
                    name: 'nombre'
                }, {
                    name: 'inicio'
                }, {
                    name: 'fin'
                }])
        });

        this.stejercicio = new Ext.data.Store({
            //url: 'cargarejercicios',
            id: 'stejercicio',
            reader: new Ext.data.JsonReader({
                id: 'ejercicio'
            },
            [{
                    name: 'idejercicio'
                }, {
                    name: 'nombre'
                }, {
                    name: 'inicio'
                }, {
                    name: 'fin'
                }])
        });
        
        //store del combo cuenta bancaria
        this.stCuentaBancaria = new Ext.data.Store({
            //url : 'cargarCuentasBancarias',
            reader : new Ext.data.JsonReader({
                root : 'datos',
                id : 'idcuentabancaria'
            }, [{
                name : 'idcuentabancaria'
            }, 
            {
                name : 'nombrecuentabancaria'
            },
            {
                name : 'text'
            },
            {
                name : 'saldoinicialmb'
            },
            {
                name : 'idmoneda'
            },
            {
                name : 'saldoenbancomo'
            },
            {
                name : 'nrocuenta'
            }
            ]),
            sortInfo :{
                field: 'text',
                direction: 'ASC'
            } 
        });
        
        //Reader para cargar las cuentas bancarias por tipo cuenta
        this.jrCuentaTipo = new Ext.data.JsonReader({
            id: 'idcuentabancaria',
            root: 'datos'
        }, [{
                name: '_parent',
                mapping: 'padre'
            }, {
                name: '_is_leaf',
                mapping: 'leaf'
            }, {
                name: 'idcuentabancaria'
            }, {
                name: 'text'
            }, {
                name: 'saldoinicialmb'
            }, {
                name: 'codigo',
                mapping: 'text'
            }, {
                name: 'nombrecuentabancaria'
            },{
                name: 'idmoneda'
            }, {
                name: 'saldoenbancomo'
            }, {
                name: 'nrocuenta'
            }]);

        //Arreglo para los tipos de reportes
        this.arrtipoReporte = [
            ['1', 'cuenta', 'LISTADO DE LOS CHEQUES RECIBIDOS'],
            ['2', 'cuenta', 'LISTADO DE LOS CHEQUES EMITIDOS'],
            ['3', 'tipocuenta', 'CONCILIACIÓN BANCARIA SEGÚN BANCO'],
            ['4', 'tipocuenta', 'CONCILIACIÓN BANCARIA SEGÚN LIBRO'],
            ['5', 'tipocuenta', 'CONCILIACIÓN BANCARIA SEGÚN SALDO AJUSTADO']
        ];

        //store para los tipos de reportes
        this.sttipoReporte = new Ext.data.SimpleStore({
            fields: ['idReporte', 'identificador', 'nombreReporte'],
            data: this.arrtipoReporte
        });

        //Reader para el combo de las estructuras economicas
        this.jrEntidad = new Ext.data.JsonReader({
            id: 'idestructurae',
            root: 'datos'
        }, [{
                name: '_parent',
                mapping: 'idestructuraepadre'
            }, {
                name: '_is_leaf',
                mapping: 'leaf'
            }, {
                name: 'text'
            }, {
                name: 'idestructurae'
            }, {
                name: 'idestructuraepadre'
            }, {
                name: 'codigo',
                mapping: 'codigoestructura'
            }, {
                name: 'ordenizq'
            }, {
                name: 'ordender'
            }, {
                name: 'idestructuracomun'
            }]);
        
        //store para el grid de mostrar el reporte listado de cheques
        this.stCargarChequesReporte = new Ext.data.GroupingStore({
            url : 'cargarCheques',
            groupField: 'agrupador',
            sortInfo:{field: 'fechacreacion', direction: "ASC"},
            reader : new Ext.data.JsonReader({
                root : 'datos',
                id : 'iddocumento'
            }, 
            [{
                name : 'iddocumento'
            },{
                name : 'fechacreacion'
            },{
                name : 'idtipodocumento'
            },{
                name : 'numerodocumento'
            },{
                name : 'tipooperacion'
            },{
                name : 'importemo'
            },{
                name : 'importeor'
            },{
                name : 'importemb'
            },{
                name : 'cuentabancaria'
            },{
                name : 'denominacion'
            },{
                name : 'beneficiario'
            },{
                name : 'estado'
            },{
                name: 'agrupador',
                mapping: 'identidad'
            },{
                name: 'agrupadornombre',
                mapping: 'denominacionentidad'
            }
            ]) 
        });
        
        //Arreglo para mostrar los datos del reporte conciliacion saldo segun libro
        this.arrsaldoLibro = [
            ['<b>Saldo según libro de la empresa</b>', '', '$200', '1000', 'CB - 1', 1],
            ['<b>MÁS:</b>', '', '', '1000', 'CB - 1', 2],
            [this.espacios+'Cobros realizados por el banco', '$100', '', '1000', 'CB - 1', 3],
            [this.espacios+'Intereses ganados s/ saldo en banco', 100, '', '1000', 'CB - 1', 4],
            [this.espacios+'Corrección de un error en libros', 300, '', '1000', 'CB - 1', 5],
            [this.espacios+'Otras diferencias', 100, 50, '1000', 'CB - 1', 6],
            ['<b>SUBTOTAL</b>', '', 600, '1000', 'CB - 1', 7],
            ['<b>MENOS:</b>', '', '', '1000', 'CB - 1', 8],
            [this.espacios+'Cargos por servicios', 100, '', '1000', 'CB - 1', 9],
            [this.espacios+'Cheques sin fondos', 200, '', '1000', 'CB - 1', 10],
            [this.espacios+'Costo de los cheques impresos', 100, '', '1000', 'CB - 1', 11],
            [this.espacios+'Otros cargos realizados por el banco', 200, 100, '1000', 'CB - 1', 12],
            ['<b>Saldo correcto en día-mes-año<b>', '', 300, '1000', 'CB - 1', 13]
        ];
        
        //Arreglo para mostrar los datos del reporte conciliacion saldo segun banco
        this.arrsaldoBanco = [
            ['<b>Saldo según Estado de Cuenta del  Banco</b>', '', '$200', '1001', 'CB - 2', 1],
            ['<b>MÁS:</b>', '', '', '1001', 'CB - 2', 2],
            [this.espacios+'Depósitos en tránsitos', '$200', '', '1001', 'CB - 2', 3],
            [this.espacios+'Corrección de errores', 100, 300, '1001', 'CB - 2', 4],
            ['<b>SUBTOTAL</b>', '', 200, '1001', 'CB - 2', 5],
            ['<b>MENOS:</b>', '', '', '1001', 'CB - 2', 6],
            [this.espacios+'Cheques pendientes o en tránsito', 200, '', '1001', 'CB - 2', 7],
            [this.espacios+'Corrección de errores', 100, 200, '1001', 'CB - 2', 8],
            ['<b>Saldo correcto en día-mes-año</b>', '', 200, '1001', 'CB - 2', 9]
        ];
        
        //Arreglo para mostrar los datos del reporte conciliacion saldo ajustado
        this.arrsaldoAjustado = [
            ['<b>Saldo según libro de la empresa</b>', '', '$100', '1002', 'CB - 3', 1],            
            ['<b>MÁS:</b>', '', '', '1002', 'CB - 3', 2],            
            [this.espacios+'Cobros realizados por el banco', '$200', '', '1002', 'CB - 3', 3],            
            [this.espacios+'Intereses ganados s/ saldo en banco', 100, '', '1002', 'CB - 3', 4],            
            [this.espacios+'Corrección de un error en libros', 200, '', '1002', 'CB - 3', 5],            
            [this.espacios+'Otras diferencias', 100, 100, '1002', 'CB - 3', 6],            
            ['<b>SUBTOTAL</b>', '', 300, '1002', 'CB - 3', 7],            
            ['<b>MENOS:</b>', '', '', '1002', 'CB - 3', 8],            
            [this.espacios+'Cargos por servicios', 100, '', '1002', 'CB - 3', 9],            
            [this.espacios+'Cheques sin fondos', 200, '', '1002', 'CB - 3', 10],            
            [this.espacios+'Costo de los cheques impresos', 100, '', '1002', 'CB - 3', 11],            
            [this.espacios+'Otros cargos realizados por el banco', 200, 100, '1002', 'CB - 3', 12],            
            ['', '', '', '1002', 'CB - 3', 13],            
            ['<b>Saldo correcto</b>', '', 200, '1002', 'CB - 3', 14],            
            ['', '', '', '1002', 'CB - 3', 15],            
            ['<b>Partidas no consideradas por el banco</b>', '', '', '1002', 'CB - 3', 16],            
            ['<b>MÁS:</b>', '', '', '1002', 'CB - 3', 17],            
            [this.espacios+'Cheques pendientes o en tránsito', 200, '', '1002', 'CB - 3', 18],            
            [this.espacios+'Créditos efectuados por el banco incorrectamente', 100, '', '1002', 'CB - 3', 19],            
            [this.espacios+'Corrección de errores', 100, 300, '1002', 'CB - 3', 20],            
            ['<b>MENOS:</b>', '', '', '1002', 'CB - 3', 21],            
            [this.espacios+'Depósitos en tránsitos', 200, '', '1002', 'CB - 3', 22],            
            [this.espacios+'Débitos efectuados por el banco incorrectamente', 200, '', '1002', 'CB - 3', 23],            
            [this.espacios+'Corrección de errores', 100, 200, '1002', 'CB - 3', 24],            
            ['<b>Saldo según Estado de Cuenta del Banco</b>', '', 800, '1002', 'CB - 3', 25]
        ];
        
        //store para la carga de los datos del grid para el reporte de la conciliacion
        this.streporteConciliacion = new Ext.data.GroupingStore({
            groupField: 'agrupador',
            sortInfo:{field: 'orden', direction: "ASC"},
            reader: new Ext.data.ArrayReader({
                id: 'readerRepConciliacion'
            },
            [{
                    name: 'nombreCampo'
                },
                {
                    name: 'saldo1'
                },
                {
                    name: 'saldo2'
                },
                {
                    name: 'agrupador'//idcuentabancaria
                },
                {
                    name: 'agrupadornombre'//nombre cuenta bancaria
                },
                {
                    name: 'orden'
                }
            ])
        });
    }
};