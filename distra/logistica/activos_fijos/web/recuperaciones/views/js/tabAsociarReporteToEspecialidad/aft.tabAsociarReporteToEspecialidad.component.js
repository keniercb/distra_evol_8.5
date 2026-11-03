/**
 * Yadrian Aguila Ferran
 * Fichero encargado de Asociar reporte con la especialidad
 **/
Ext.ns('Ext.aft');
Ext.aft.TabAsociarReporteToEspecialidad = new Ext.extend(Ext.FormPanel, {    
    constructor: function (config) {	
		var _this = this;
		Ext.apply(this,config);	
        this.frame = true;
        this.bodyStyle = 'padding: 5px';        
		_this.urlControladora = '/logistica/activos_fijos/recuperaciones/index.php/reportetoespecialidad/';
		
        _this.stEspecialidad = new Ext.data.Store({
            url: _this.urlControladora + 'cargarEspecialidad', 
            autoLoad: true,			
            reader: new Ext.data.JsonReader({
                id: "idespecialidad",
                totalProperty: 'total',
                root: 'datos'
            }, [
                {
                    name: 'idespecialidad'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'rectora'
                }
            ]),
			listeners:{
			    'beforeload': function  ( store , options ) { 				  
				},
				'load': function ( store , records , options ) {
                    if ( store.getCount() > 0 ) {				
						_this.smEspecialidad.selectFirstRow(); 
					}
				}
			}
        });

        _this.stReportes = new Ext.data.Store({
            url: _this.urlControladora + 'cargarReportes',           
            reader: new Ext.data.JsonReader({
                id: "idreporte",
                totalProperty: 'total',
                root: 'datos'
            }, [
                {
                    name: 'idreporte'
                },
                {
                    name: 'denominacion'
                },				
                {
                    name: 'activo'
                }
            ]),
			listeners:{
			    'beforeload': function  ( store , options ) { 
				    store.baseParams.idespecialidad = _this.smEspecialidad.getSelected().get('idespecialidad');                  
				},
				'load': function ( store , records , options ) { 
				    var rows = new Array();
					var select = false;
				    for (var i = 0 ; i < records.length; i++ ) {
						if ( records[i].get('activo') ) { 
							rows.push(i);
							select = true;
						} 				
					}
					if ( select )
					_this.smReportes.selectRows( rows );                   					
				}
			}
        });
		_this.btnActivarProperties = {
            text: _this.etiquetas.btnActivarTransp,
            tooltip: _this.etiquetas.lbTtBtnActivarTransp,
            iconCls: 'aplicar',
			disabled:true,
            listeners: {
                'click': function () {
                    _this.activarEspecialidad();
                }
            }
        };
        _this.btnActivar = new Ext.Button( _this.btnActivarProperties );  
		
		_this.smEspecialidad = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
		_this.smEspecialidad.on(
		    'rowselect',function(sm, index,record ){
                if ( record.get('rectora') == 0  ) {			
					_this.btnActivar.enable();
				} else {
					_this.btnActivar.disable();
				}
				_this.stReportes.load();				
			}
		);		
		_this.smEspecialidad.on(
			'rowdeselect',function(sm, index,record ){		
				_this.btnActivar.disable();		
		});
		_this.cmEspecialidad = [new Ext.grid.RowNumberer({
            header: 'N\xBA.',
            width: 30
        }), {
                id: 'denominacion',
                header: _this.etiquetas.lbDenominacion,
                dataIndex: 'denominacion'
            }, {
                id: 'rectora',
				width:100,
                header: _this.etiquetas.lbRector,
                dataIndex: 'rectora',
				align:'center',
                renderer: function (value, metaData) {				  
                    if (value == 1) {
                        metaData.css = 'activo';
                    } else {
                        metaData.css = 'inactivo';
                    }					
                }
        }];
        _this.gridEspecialidad = new Ext.grid.GridPanel({
            height: 480,       
            autoExpandColumn: 'denominacion',
            loadMask: true,
            store: _this.stEspecialidad,
            sm: _this.smEspecialidad,
            columns: _this.cmEspecialidad
        });
		
		_this.contextMenu = new Ext.menu.Menu({
			items: [ _this.btnActivarProperties ]
		});			
		
		_this.gridEspecialidad.on({
			rowcontextmenu: function( grid , rowIndex, eventObj)  {						
				_this.contextMenu.showAt(eventObj.getXY());							
				eventObj.stopEvent();
				if ( _this.smEspecialidad.getSelected().get('rectora') == 0 ) {
				    _this.contextMenu.items.items[0].enable();
				} else {
					_this.contextMenu.items.items[0].disable()
				}	
				
		   },
			stopEvent: true
		});				
		
		_this.smReportes = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });		
		_this.smReportes.on(
		    'rowselect',function(sm,index,record ){		
				record.set('activo',true);				
			}
		);		
		_this.smReportes.on(
			'rowdeselect',function(sm,index,record ){		
			record.set('activo',false);		
		});
        _this.gridReportes = new Ext.grid.GridPanel({
            height: 480,				
            autoExpandColumn: 'denominacion',
            store: _this.stReportes,
            loadMask: true,
            sm: _this.smReportes,
            columns: [new Ext.grid.RowNumberer({
                header: 'N\xBA.',
                width: 30
            }),_this.smReportes, {
                id: 'denominacion',
                header: _this.etiquetas.lbDenominacion,
                dataIndex: 'denominacion'
            }],
			viewConfig: {
			    getRowClass: function(record, index, rowParams, ds) {
					rowParams.tstyle = 'width:' + this.getTotalWidth() + ';';
					var fgColor = 'green';								  				
					if ( record.get('activo') ) {                       				
						rowParams.tstyle += "color:" + fgColor + ';';
					}
			    }
		    }
        });
		this.layout = 'column',
        this.items = [            
                    {
                        columnWidth: .5,
                        layout: 'form',
						style: 'margin-left: 2px;',
                        items: [
                            {
                                xtype: 'fieldset',
                                anchor: '98%',
                                layout: 'fit',
                                style: '-moz-border-radius:5px',
                                title: _this.etiquetas.lbTEspecialidad,
								tbar: ['->',_this.btnActivar],
                                autoHeight: true,
                                items: [_this.gridEspecialidad]
                            }
                        ]
                    },
                    {
                        columnWidth: .5,
                        layout: 'form',
                        style: 'margin-left: 1px;',
                        items: [
                            {
                                xtype: 'fieldset',
                                anchor: '98%',
                                layout: 'fit',
                                style: '-moz-border-radius:5px;',
                                title: _this.etiquetas.lbTReportes,
								tbar: ['->',{text:'',disabled:true}],
                                autoHeight: true,
                                items: [_this.gridReportes]
                            }
                        ]

                    }
                
        ];
		_this.btnGuardarDatos = { 
		    text:_this.etiquetas.lbBtnGuardar, 
			icon:'btn',
			iconCls:'guardar', 
			handler:function(){
			    _this.fGuardarDatos( );
			}
		};
		this.bbar = [ '->' , _this.btnGuardarDatos ];

        Ext.aft.TabAsociarReporteToEspecialidad.superclass.constructor.apply(this, arguments);
    },
	fGuardarDatos: function ( ) { 
	    var _this = this;
		
	    var recEspecialidad = _this.gridEspecialidad.getSelectionModel().getSelected();
		var recReportes = new Array();
		recReportes = _this.gridReportes.getStore().getModifiedRecords();     
		if ( recReportes.length == 0 ) {
            mostrarMensaje(3, _this.etiquetas.msgNoChangeData);
        } else {
			var arrEspecialidad	 = new Array();		
			arrEspecialidad.push({
				idespecialidad : recEspecialidad.get('idespecialidad'),
				rectora : recEspecialidad.get('rectora')
			});
			var arrReportesAdd = new Array();	
			var arrReportesDel = new Array();		
			for ( var i = 0 ; i < recReportes.length; i++ ) {		 
				if ( !recReportes[i].get('activo') ) {		
					arrReportesDel.push({
						idreporte : recReportes[i].get('idreporte')				
					});
				} else if ( recReportes[i].get('activo') ){
					arrReportesAdd.push({
						idreporte : recReportes[i].get('idreporte')				
					});
				}
			}	
			Ext.Ajax.request({
				url: _this.urlControladora + 'guardarEspecialidadToReportes',
				method: 'POST',
				params: {
					recEspecialidad: Ext.encode( arrEspecialidad ),
					idreportsDel: Ext.encode( arrReportesDel ),
					idreportsAdd: Ext.encode( arrReportesAdd )

				},
				callback: function ( options, success, response ) {
					var responseText = Ext.decode(response.responseText);
					if ( responseText.success ) {
						mostrarMensaje(1, _this.etiquetas.msgFormatosGuardados);
						_this.gridReportes.getStore().reload();
					} else {
						 mostrarMensaje(3, _this.etiquetas.msgNoFormatosGuardados);
					}
				}
			});
		}
		
	},
    activarEspecialidad: function () {
        var _this = this;		
	    var recEspecialidad = _this.gridEspecialidad.getSelectionModel().getSelected();
		var arrEspecialidad	 = new Array();		
		arrEspecialidad.push({
		    idespecialidad : recEspecialidad.get('idespecialidad'),
			rectora : recEspecialidad.get('rectora')
		});
		Ext.Ajax.request({
            url: _this.urlControladora + 'activarEspecialidad',
            method: 'POST',
            params: {
                recEspecialidad: Ext.encode( arrEspecialidad )
            },
            callback: function (options, success, response) {
				var responseText = Ext.decode(response.responseText);
                if ( responseText.success ) {
                    mostrarMensaje(1, _this.etiquetas.msgFormatosGuardados);
                    _this.gridEspecialidad.getStore().reload();					
                } else if ( responseText.code == 1 ) {
                     mostrarMensaje(3, _this.etiquetas.msgNoExisteReports);
                } else if ( responseText.code == 2 ) {
                     mostrarMensaje(3, _this.etiquetas.msgExisteEspecialidadRectora);
                } else {
                     mostrarMensaje(3, _this.etiquetas.msgNoFormatosGuardados);
                }
            }
        });
	}
})
