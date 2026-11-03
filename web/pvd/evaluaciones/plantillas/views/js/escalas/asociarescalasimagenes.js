/**
 * Interfaz para asociar las escalas cualitativas*
 *
 * @author Ing. Javier Rodríguez López*
 * @package PVD *
 * @subpackage Evaluaciones *
 */

Ext.ns("Ext.PVD.Evaluaciones.Plantilla");
Ext.PVD.Evaluaciones.Plantilla.AsociarEscalaImagen = Ext.extend(Ext.FormPanel,{
    labelAlign: 'left',
    frame:true,
    title: 'Escala imagen',

    initComponent: function(){
        var self = this;
        var rowIndexSelection = null;
        var btnAsociar = new Ext.Button({
            disabled:true,
            id:'btnAsociar'+self.id,
            style:'margin-left:18px;margin-top:110px',
            tooltip: self.labels.lbAsociarImagen,
            iconCls:'siguiente',
            handler: asociarValorImagen
        });

        var btnEliminar = new Ext.Button({
            disabled:true,
            id:'btnEliminar'+self.id,
            style:'margin-left:18px;margin-top:90px',
            tooltip: self.labels.lbDesasociarImagen,
            iconCls:'anterior',
            handler: elimAsocValorImagen
        });

        var btnSubirfila = new Ext.Button({
            iconCls:'arriba',
            disabled: true,
            tooltip:labels.ttpBtnSubirfila,
            handler: moverFilaArriba
        });

        var btnBajarfila = new Ext.Button({
            iconCls:'abajo',
            disabled: true,
            tooltip:labels.ttpBtnBajarFila,
            handler:moverFilaAbajo
        });

        var btnGuardarOrden = new Ext.Button({
            iconCls:'guardar',
            disabled: true,
            tooltip: 'Guardar orden de los valores im&aacute;genes (<b>Alt+G</b>)',//labels.ttpBtnGuardarOrdenImg,
            handler: guardarOrden
        });

        this.stValoresImagenes = new Ext.data.Store({
            url: 'cargarTodasImagenes',
            reader:new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idgpImagenes"
            },[
            {
                name: 'idvaloresimagenes'
            },
            {
                name: 'denom'
            },
            {
                name: 'extension'
            },
            {
                name: 'fechainicio'
            },
            {
                name: 'fechafin'
            },
            {
                name: 'descripcion'
            }
            ])
        });

        var smValoresImagenes = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function(sm, row, rec) {
                    btnAsociar.enable();
                    btnEliminar.disable();
                }
            }
        });

        var gpValoresImagenes = new Ext.grid.GridPanel({
            title: self.labels.titleImagenExistente,
            columns: [{
                id:'expandir',
                header: self.labels.lbImagen,
                width: 75,
                dataIndex: 'denom',
                renderer: representarImagen,
                sortable:false,
                menuDisabled:true,
            }
            ],
            frame: true,
            stripeRows: true,
            store: self.stValoresImagenes,
            autoExpandColumn:'expandir',
            loadMask:{
                msg:labels.cargando
            },
            minSize: 75,
            region:'center',
            padding:'5 0 5 5',
            margins: '5 0 5 5',
            width: '100%',
            height: 500,
            sm: smValoresImagenes,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: self.stValoresImagenes,
                displayInfo: false
            })
        });

        this.stValoresAsociados = new Ext.data.Store({
            url: 'cargarValoresEscalaImg',
            pruneModifiedRecords: true,
            reader:new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idevalescalavaloreimagene"
            },[
            {
                name: 'idvaloresimagenes'
            },
            {
                name: 'idevalescalavaloreimagene'
            },
            {
                name: 'denom'
            },
            {
                name: 'extension'
            },
            {
                name: 'fechainicio'
            },
            {
                name: 'fechafin'
            },
            {
                name: 'descripcion'
            },
            {
                name: 'orden'
            }
            ]),
            listeners:{
                load: function(store, records, options){
                    if(smValoresAsociados.hasSelection()){
                        btnEliminar.enable();
                    }else{
                        btnEliminar.disable();
                    }
                }
            }
        });

        var smValoresAsociados = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function(sm, rowIndex, rec) {
                    rowIndexSelection = rowIndex;
                    btnAsociar.disable();
                    btnEliminar.enable();
                    btnSubirfila.enable();
                    btnBajarfila.enable();
                    if(rowIndex == 0)
                        btnSubirfila.disable();
                    if(rowIndex+1  == self.stValoresAsociados.getCount())
                        btnBajarfila.disable();
                }
            }
        });

        var gpValoresAsociados = new Ext.grid.GridPanel({
            title: self.labels.titleImagenSelec,
            tbar:['->',btnSubirfila,btnBajarfila,btnGuardarOrden,' '],
            columns: [{
                id:'expandir',
                header: self.labels.lbImagen,
                width: 75,
                dataIndex: 'denom',
                renderer: representarImagen,
                sortable:false,
                menuDisabled:true
            },{
                header: self.labels.lbOrden,
                width: 60,
                dataIndex: 'orden'
            }],
            frame: true,
            stripeRows: true,
            store: self.stValoresAsociados,
            autoExpandColumn:'expandir',
            loadMask:{
                msg :labels.cargando
            },
            minSize: 75,
            region:'center',
            padding:'5 0 5 5',
            margins: '5 0 5 5',
            width: '100%',
            height: 500,
            sm: smValoresAsociados
        });

        this.items = [{
            layout:'column',
            items:[{
                columnWidth:.41,
                layout: 'form',
                items: [gpValoresImagenes]
            },
            {
                columnWidth:.10,
                layout: 'form',
                items: [btnAsociar,btnEliminar],
                anchor:'100%'
            },
            {
                columnWidth:.49,
                layout: 'form',
                padding:'5 5 5 5',
                items: [gpValoresAsociados]
            }]
        }];

        Ext.PVD.Evaluaciones.Plantilla.AsociarEscalaImagen.superclass.initComponent.call(this);
        function asociarValorImagen(){
            PVD.mostrarMascara('mskasociarvalor', labels.lbMsgWait, labels.lbMaskAsociandoValores);
            Ext.Ajax.request({
                url: 'asociarValorImagen',
                method: 'POST',
                params: {
                    idvaloresimagenes: gpValoresImagenes.getSelectionModel().getSelected().get('idvaloresimagenes'),
                    idescala: self.idescala
                },
                callback : function(options, success, response) {
                    PVD.ocultarMascara('mskasociarvalor');
                    self.loadStores(self.idescala);
                }
            });
        }

        function elimAsocValorImagen(){
            PVD.mostrarMascara('mskeliminarvalor', labels.lbMsgWait, labels.lbMaskEliminandoValores);
            Ext.Ajax.request({
                url : 'elimAsocValorImagen',
                method: 'POST',
                params: {
                    idevalescalavaloreimagene: gpValoresAsociados.getSelectionModel().getSelected().get('idevalescalavaloreimagene')
                },
                callback : function(options, success, response) {
                    PVD.ocultarMascara('mskeliminarvalor');
                    self.loadStores(self.idescala);
                }
            });
        }

        function moverFilaArriba(){
            var recordSeleccionado = smValoresAsociados.getSelected();
            var recordAnterior = self.stValoresAsociados.getAt(rowIndexSelection-1);
            var recordAux = recordSeleccionado;
            self.stValoresAsociados.remove(recordSeleccionado);
            self.stValoresAsociados.insert(rowIndexSelection-1, recordAux);
            recordSeleccionado.set('orden', rowIndexSelection);
            recordAnterior.set('orden',rowIndexSelection+1);
            smValoresAsociados.selectPrevious();
            if(btnGuardarOrden.disabled){
                btnGuardarOrden.enable();
            }
        }

        function moverFilaAbajo(){
            var recordSeleccionado = smValoresAsociados.getSelected();
            var ordenSelec =  recordSeleccionado.get('orden');
            var recordSiguiente = self.stValoresAsociados.getAt(rowIndexSelection+1);
            var recordAux = recordSeleccionado;
            self.stValoresAsociados.remove(recordSeleccionado);
            self.stValoresAsociados.insert(rowIndexSelection+1, recordAux);
            recordSeleccionado.set('orden',recordSiguiente.get('orden'));
            recordSiguiente.set('orden',ordenSelec);
            smValoresAsociados.selectNext();
            if(btnGuardarOrden.disabled){
                btnGuardarOrden.enable();
            }
        }

        function guardarOrden(){
            PVD.mostrarMascara('msksavingorden', labels.lbMsgWait, labels.lbMsgSaveOrdenImg);
            var arrRecord  = new Array();
            var arrayM = self.stValoresAsociados.getModifiedRecords();
            for(var i=0 ; i < arrayM.length; i++){
                var aux = {}
                aux.idevalescalavaloreimagene = arrayM[i].get('idevalescalavaloreimagene');
                aux.orden = arrayM[i].get('orden');
                arrRecord[i]= aux;
            }
            Ext.Ajax.request({
                url: 'actualizarordenvaloresimagenes',
                method:'POST',
                params: {
                    arrayVal: Ext.encode(arrRecord)
                },
                callback: function (options,success,response){
                    var responseData = Ext.decode(response.responseText);
                    btnGuardarOrden.disable();
                    PVD.ocultarMascara('msksavingorden');
                }
            });
        }

        function representarImagen(dirImagen) {
            if(dirImagen != ""){
                return "<img src="+dirImagen+" width='60' height='60' />";
            }
        }
    },
    loadStores:function(idescala){
        this.idescala = idescala;
        this.stValoresImagenes.load({
            params:{
                limit:15,
                start:0
            }
        });
        this.stValoresAsociados.load({
            params:{
                idescala: idescala
            }
        });
    }
});
