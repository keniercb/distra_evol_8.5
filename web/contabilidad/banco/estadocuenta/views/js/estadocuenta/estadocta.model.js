//Empaquetando el componente estado de cuenta.
Ext.ns('Banco.Estadocta');

//Model del componente estado de cuenta.
Banco.Estadocta.Model = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {
               
        //redefiniendo GroupingStore
        this.GroupingStore = Ext.extend(Ext.data.GroupingStore, {
            applySort:function(){
                Ext.data.GroupingStore.superclass.applySort.call(this);
                if(!this.groupOnSort&&!this.remoteGroup){
                    var A=this.getGroupState();                
                    if(A&&A!=this.sortInfo.field){
                        this.sortData('idcuentabancaria')
                    }
                }
            }
        });
        
        //stlistadocuenta = new Ext.data.GroupingStore({
        this.stEstadocuenta = new this.GroupingStore({
            url : 'cargarGridEstadoCta',
            reader : new Ext.data.JsonReader({
                root : 'datos',
                id : 'idestadodecuenta',
                totalProperty : 'cant'
            }, [{
                name : 'idcuentabancaria',
                type : 'string'
            },
            {
                name : 'idestadodecuenta',
                type : 'string'
            },
            {
                name : 'saldoinical'
            },
            {
                name : 'saldofinal'
            },
            {
                name : 'fecha',
                type : 'date',
                dateFormat : 'd/m/Y'
            },
            {
                name : 'version'
            },
            {
                name : 'nroestado',
                type : 'string'
            },
            {
                name : 'nrocuenta'
            }, {
                name : 'nombrecuentab',
                type : 'string'
            },
            {
                name : 'diferencia'
            },
            {
                name : 'correccion'
            },
            {
                name : 'conciliado'
            },
            {
                name : 'imgconciliado'
            }
            ]),
            sortInfo:{
                field:'fecha'
            },
            groupField:'nrocuenta'
        });
        
        //store del gris operaciones cargadas por el banco
        this.stOperCargadas = new Ext.data.GroupingStore({
            url: 'cargarGridOperaciones',
            reader: new Ext.data.JsonReader({
                root : 'datos',
                totalProperty : 'cant'
            },
            [{
                name : 'nodocumento'
            },
            {
                name : 'tipoinstrumento'
            },
            {
                name : 'debito',
				 type:'float'
            },
            {
                name : 'credito',
				 type:'float'
            },	
            {
                name : 'origen',
                type: 'string'
            },
            {
                name : 'descripcion'
            }]),
            groupField:'tipoinstrumento',            
            sortInfo :{
                field: 'nodocumento',
                direction: 'ASC'
            }
        });
        
        //grid diferencias y correcciones
        this.stCorrecBanco = new Ext.data.GroupingStore({
            url: 'cargarCorrecDifEstadoCta',
            sortInfo : {
                field: 'grupingfield', 
                direction: 'DESC'
            },
            reader : new Ext.data.JsonReader({
                root : 'datos',
                totalProperty : 'cant'
            }, [{
                name : 'importeinicialmo',
                type:'float'
            },{
                name : 'importemo',
                type:'float'
            }, {
                name : 'diferencia',
                type:'float'
            },{
                name : 'descripcion'
            },{
                name : 'grupingfield'
            },{
                name : 'id'
            }]),
            groupField:'grupingfield'
        });
        
        //store del grid operaciones del estado cta
        this.stOperaciones = new Ext.data.Store({
            reader : new Ext.data.JsonReader({
                root : 'datos',
                id : 'idinstrumentobancario',
                totalProperty : 'cant'
            }, [{
                name : 'idinstrumentobancario',
                type : 'string'
            }, {
                name : 'nodocumento'
            }, {
                name : 'tipoinstrumento'
            }, {
                name : 'credito',
				type:'float'
            }, {
                name : 'debito',
				type:'float'
            }, {
                name : 'importemb'
            }, {
                name : 'fecha'
            }, {
                name : 'origen'
            }, {
                name : 'descripcion'
            }])
        });
        
        //store del grid depósitos del estado cta
        this.stDepositos = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'iddeposito',
                totalProperty: 'cant'
            }, [{
                    name: 'iddeposito',
                    mapping: 'idmovimiento'
                }, {
                    name: 'nodocumento',
                    mapping: 'numerodocumento'
                }, {
                    name: 'tipodoc',
                    mapping: 'denominacion'
                }, {
                    name: 'importe',
                    mapping: 'importemo'
                }, {
                    name: 'fecha'
                }, {
                    name: 'descripcion',
                    mapping: 'comentario'
                }, {
                    name: 'idestadocuenta'
                }
            ])
        });
        
        //store del grid depósitos del estado cta en el tab para mostrar detalles
        this.stTabDepositos = new Ext.data.Store({
            url: 'cargarDepositosByEstadocuenta',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'iddeposito',
                totalProperty: 'cant'
            }, [{
                    name: 'iddeposito',
                    mapping: 'idmovimiento'
                }, {
                    name: 'nodocumento',
                    mapping: 'numerodocumento'
                }, {
                    name: 'tipodoc',
                    mapping: 'denominacion'
                }, {
                    name: 'importe',
                    mapping: 'importemo'
                }, {
                    name: 'fecha'
                }, {
                    name: 'descripcion',
                    mapping: 'comentario'
                }, {
                    name: 'idestadocuenta'
                }
            ])
        });
        
        //st del combo cuenta bancaria
        this.stCuentaBanc = new Ext.data.Store({
            url : 'cargarCtaBancaria',
            reader : new Ext.data.JsonReader({
                root : 'datos',
                id : 'idcuentabancaria',
                totalProperty : 'totalRecords'
            }, [{
                name : 'idcuentabancaria',
                type : 'string'
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
        
        //store de las operaciones a adicionar
        this.staddoper = new Ext.data.Store({
            url : 'cargarGridOperaciones',
            reader : new Ext.data.JsonReader({
                root : 'datos',
                id : 'idinstrumentobancario',
                totalProperty : 'cant'
            }, [{
                name : 'id'//para el paginado
            },{
                name : 'idinstrumentobancario',
                type : 'string'
            }, {
                name : 'nodocumento'
            }, {
                name : 'tipoinstrumento'
            }, {
                name : 'credito',
				type:'float'
            }, {
                name : 'debito',
				type:'float'
            }, {
                name : 'importemb'
            }, {
                name : 'fecha'
            }, {
                name : 'origen'
            }, {
                name : 'descripcion'
            }])
        });
        
        //store de las diferencias        
        this.stDiferencias = new Ext.data.GroupingStore({
            url : 'cargarGridDiferencias',
            sortInfo : {
                field: 'iddiferencia', 
                direction: 'ASC'
            },
            reader : new Ext.data.JsonReader({
                root : 'datos',
                id : 'iddiferencia',
                totalProperty : 'cant'
            }, [{
                name : 'iddiferencia',
                type : 'string'
            }, {
                name : 'debito',
                type : 'float'
            }, {
                name : 'credito',
                type : 'float'
            }, {
                name : 'descripcion'
            }, {
                name : 'correccion'
            }, {
                name : 'debitocredito'
            },{
                name : 'nuevo'
            }, {
                name : 'gruopfield'
            }]),
            groupField:'gruopfield'
        });
        
    }
};