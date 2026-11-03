var perfil = window.parent.UCID.portal.perfil
Ext.QuickTips.init();
var win, winop;
var tabestado;
// stores
var arrSub = new Array();
var arrEst = new Array();
var stTDoc, stEstasoc, stEstsasoc, stSub, stSubmod,vpGestionarDoc;
// grid
var gpTDoc, gpEstasoc, gpEstsasoc, gpSub, gpSubmod;
// sm
var smTDoc, smEstasoc, smEstsasoc, smSub, smSubmod;
// Botones tdoc,est
var addtdoc, modtdoc, deltdoc, gestesta, modinicial;
var addest, asoest;
// textfield
var dentdoc, denmest, denmestaso;
// form
var formtdoc;
// index para el modificar
var idtdoc, apltdoc;
function CargarInterfaz() {

    // Estado Asociado
    modinicial = new Ext.Button({
        text : 'Inicial',
        tooltip : 'Modificar estado inicial',
        id : 'modinicial',
        iconCls : 'btn',
        icon : perfil.dirImg + 'modificar.png',
        handler : function() {
            if (smEstasoc.getSelected().data.inicial != 1) {
                Ext.Ajax.request({
                    url : 'modificarestadoinicial',
                    params : {
                        idestado : smEstasoc.getSelected().data.idestado,
                        idtdoc : idtdoc
                    },
                    callback : function(options, success, response) {
                        responseData = Ext
                        .decode(response.responseText);
                        mostrarMensaje(
                            responseData.codMsg,
                            'El estado inicial'
                            + ((responseData.codMsg == 1)
                                ? ' se ha modificado'
                                : ' no se ha modificado')
                            + ' correctamente.');
                        stEstasoc.reload();
                        stEstsasoc.reload();
                    }
                });
            }
        }
    });
    smEstasoc = new Ext.grid.CheckboxSelectionModel({
        singleSelect : true
    });
    stEstasoc = new Ext.data.Store({
        url : 'cargarestadoasoc',
        reader : new Ext.data.JsonReader({
            root : "data",
            totalProperty : "cant",
            id : "idestado"
        }, [{
            name : 'denomestado',
            mapping : 'denominacion'
        }, {
            name : 'idestado',
            mapping : 'idestado'
        }, {
            name : 'idtdoc',
            mapping : 'ConfDocDatEstado[0].idtipodoc'
        }, {
            name : 'inicial',
            mapping : 'ConfDocDatEstado[0].inicial'
        }])
    });

    stEstasoc.on('beforeload', function() {
        stEstasoc.baseParams = {
            idtdoc : idtdoc,
            limit : 13,
            start : 0
        }
    }, this);

    this.action = new Ext.ux.grid.RowActions({
        header : 'btn',
        width : 80,
        actions : [{
            iconCls : 'eliminar',
            tooltip : 'Eliminar'
        }]
    });

    this.action.on({
        action : function(grid, record, action, row, col) {
            eliminarasoc(record);
        }
    });

    gpEstasoc = new Ext.grid.GridPanel({
        id : 'gpEstasoc',
        autoExpandColumn : 'denomestado',
        store : stEstasoc,
        plugins : [this.action],
        viewConfig : {
            forceFit : true
        },
        margins : '2 2 2 -4',
        sm : smEstasoc,
        tbar : [modinicial],
        columns : [smEstasoc, {
            hidden : true,
            hideable : false,
            dataIndex : 'idtdoc'
        }, {
            header : "Denominaci&oacute;n",
            dataIndex : 'denomestado',
            id : 'denomestado'
        }, this.action],
        loadMask : {
            msg : "Por favor espere..."
        }/*,
        bbar : new Ext.PagingToolbar({
            pageSize : 13,
            store : stEstasoc,
            displayInfo : true
        })*/
    });

    gpEstasoc.getView().getRowClass = function(record, index, rowParams, store) {
        if (record.data.inicial == 1)
            gpEstasoc.getSelectionModel().selectRow(index);
    };

    // Estado sin Asociar
    asoest = new Ext.Button({
        text : 'Adicionar',
        tooltip : 'Asociar estado',
        id : 'asoest',
        iconCls : 'btn',
        icon : perfil.dirImg + 'adicionar.png',
        handler : function() {
            arrEst = new Array();
            var data = smEstsasoc.getSelections();
            Ext.each(data, function(item, index, intemall) {
                arrEst.push(item.data);
            });
            Ext.Ajax.request({
                url : 'asociarestadotdoc',
                params : {
                    idtdoc : idtdoc,
                    arrEst : Ext.encode(arrEst)
                },
                callback : function(options, success, response) {
                    responseData = Ext
                    .decode(response.responseText);
                    mostrarMensaje(
                        responseData.codMsg,
                        'El estado'
                        + ((responseData.codMsg == 1)
                            ? ' se ha asociado'
                            : ' no se ha asociado')
                        + ' correctamente.');
                    stEstasoc.reload();
                    stEstsasoc.reload();
                }
            });
        }
    });
    smEstsasoc = new Ext.grid.CheckboxSelectionModel();
    stEstsasoc = new Ext.data.Store({
        url : 'cargarestadosasoc',
        reader : new Ext.data.JsonReader({
            root : "data",
            totalProperty : "cant",
            id : "idestado"
        }, [{
            name : 'denomestado',
            mapping : 'denominacion'
        }, {
            name : 'idestado',
            mapping : 'idestado'
        }])
    });
    stEstsasoc.on('beforeload', function() {
        stEstsasoc.baseParams = {
            idtdoc : idtdoc,
            limit : 10,
            start : 0
        }
    }, this);
    gpEstsasoc = new Ext.grid.GridPanel({
        id : 'gpEstsasoc',
        tbar : [asoest],
        autoExpandColumn : 'denomestado',
        store : stEstsasoc,
        margins : '2 2 2 -4',
        sm : smEstsasoc,
        columns : [smEstasoc, {
            header : "Denominaci&oacute;n",
            dataIndex : 'denomestado',
            id : 'denomestado'
        }],
        loadMask : {
            msg : "Por favor espere..."
        }/*,
        bbar : new Ext.PagingToolbar({
            pageSize : 10,
            store : stEstsasoc,
            displayInfo : true
        })*/
    });

    tabestado = new Ext.TabPanel({
        frame : true,
        activeTab : 0,
        items : [{
            title : 'Estados asociados al documento',
            layout : 'fit',
            items : gpEstasoc
        }, {
            title : 'Asociar estados al documento',
            layout : 'fit',
            items : gpEstsasoc
        }]
    });
    // Subsistemas

    smSub = new Ext.grid.CheckboxSelectionModel();

    stSub = new Ext.data.Store({
        url : 'cargarsub',
        reader : new Ext.data.JsonReader({
            root : "data",
            totalProperty : "cant",
            id : "idsub"
        }, [{
            name : 'idsub',
            mapping : 'idsubsistema'
        }, {
            name : 'denomsub',
            mapping : 'densubsistema'
        }])
    });
    stSub.load({
        params : {
            limit : 10,
            start : 0
        }
    });
    gpSub = new Ext.grid.GridPanel({
        id : 'gpsub',
        region : 'center',
        autoExpandColumn : 'denomsub',
        store : stSub,
        height : 280,
        margins : '2 2 2 -4',
        sm : smSub,
        columns : [smSub, {
            hidden : true,
            hideable : false,
            dataIndex : 'idsub'
        }, {
            header : "Denominaci&oacute;n",
            dataIndex : 'denomsub',
            id : 'denomsub'
        }],
        loadMask : {
            msg : "Por favor espere..."
        },
        bbar : new Ext.PagingToolbar({
            pageSize : 10,
            store : stSub,
            displayInfo : true
        })
    });
    // Subsistema win modificar
    smSubmod = new Ext.grid.CheckColumn({
        header : 'Subsistemas',
        dataIndex : 'marcado',
        sortable : true,
        width : 80
    });
    // sm = new Ext.grid.RowSelectionModel();
    stSubmod = new Ext.data.Store({
        url : 'cargarsubmod',
        reader : new Ext.data.JsonReader({
            root : "data",
            totalProperty : "cant",
            id : "idsubmod"
        }, [{
            name : 'idsubmod',
            mapping : 'idsubsistema'
        }, {
            name : 'denomsub',
            mapping : 'densubsistema'
        }, {
            name : 'marcado'
        }])
    });
    gpSubmod = new Ext.grid.GridPanel({
        id : 'gpSubmod',
        region : 'center',
        autoExpandColumn : 'denomsub',
        store : stSubmod,
        height : 280,
        plugins:smSubmod,
        margins : '2 2 2 -4',
        columns : [smSubmod, {
            hidden : true,
            hideable : false,
            dataIndex : 'idsubmod'
        }, {
            header : "Denominaci&oacute;n",
            dataIndex : 'denomsub',
            id : 'denomsub'
        }],
        loadMask : {
            msg : "Por favor espere..."
        },
        bbar : new Ext.PagingToolbar({
            pageSize : 10,
            store : stSubmod,
            displayInfo : true
        })
    });

    // Tipo Documento
    dentdoc = new Ext.form.TextField({
        fieldLabel : 'Denominaci&oacute;n',
        id : 'dentdoc',
        width : 270,
        name : 'denomtdoc',
        allowBlank : false
    });
    formtdoc = new Ext.FormPanel({
        frame : true,
        labelWidth : 90,
        region : 'north',
        items : [dentdoc]
    });
    gestesta = new Ext.Button({
        //text : 'Gestionar estado',
		text : 'Asociar estados',
        tooltip : 'Asociar estados a los tipos de documentos',
        id : 'gestesta',
        disabled : true,
        iconCls : 'btn',
        icon : perfil.dirImg + 'aplicar.png',
        handler : function() {
            stEstasoc.load({
                params : {
                    limit : 10,
                    start : 0,
                    idtdoc : idtdoc
                }
            });
            stEstsasoc.load({
                params : {
                    limit : 10,
                    start : 0,
                    idtdoc : idtdoc
                }
            });
            Winop('winest');

        }
    });
    addtdoc = new Ext.Button({
        text : 'Adicionar',
        tooltip : 'Adicionar tipo documento',
        id : 'addtdoc',
        iconCls : 'btn',
        icon : perfil.dirImg + 'adicionar.png',
        handler : function() {
            stSub.reload();
            formtdoc.getForm().reset();
            Winop('addtdoc');
        }
    });
    deltdoc = new Ext.Button({
        text : 'Eliminar',
        tooltip : 'Eliminar tipo documento',
        disabled : true,
        iconCls : 'btn',
        icon : perfil.dirImg + 'eliminar.png',
        id : 'deltdoc',
        handler : function() {
            Ext.MessageBox.show({
                title : 'Informaci&oacute;n',
                msg : 'Seguro que desea elimnar el tipo documento '
                + smTDoc.getSelected().data.denom + '?',
                buttons : Ext.MessageBox.YESNO,
                fn : eliminartdoc,
                icon : Ext.MessageBox.QUESTION
            });
        }
    });
    modtdoc = new Ext.Button({
        text : 'Modificar',
        tooltip : 'Modificar subsistema',
        iconCls : 'btn',
        disabled : true,
        icon : perfil.dirImg + 'modificar.png',
        id : 'modtdoc',
        handler : function() {
            Winop('modtdoc');
        }
    });
    smTDoc = new Ext.grid.RowSelectionModel({
        singleSelect : true
    });
    smTDoc.on('rowselect', function(smodel, rowIndex, record) {
        idtdoc = smTDoc.getSelected().data.idtdoc;
        modtdoc.enable();
        deltdoc.enable();
        gestesta.enable();
        stSubmod.load({
            params : {
                limit : 10,
                idtdoc : smTDoc.getSelected().data.idtdoc,
                start : 0
            }
        });
    }, this);
    stTDoc = new Ext.data.Store({
		autoLoad:true,
	   url : 'cargartdoc',
        reader : new Ext.data.JsonReader({
            root : "data",
            totalProperty : "cant",
            id : "idtdoc"
        }, [{
            name : 'idtdoc',
            mapping : 'idtipodoc'
        }, {
            name : 'denomtdoc',
            mapping : 'denominacion'
        }])
    });

    stTDoc.on('beforeload', function() {
        modtdoc.disable();
        deltdoc.disable();
        gestesta.disable();
    }, this);
    gpTDoc = new Ext.grid.GridPanel({
        id : 'gpTDoc',
        autoExpandColumn : 'denomtdoc',
        store : stTDoc,
		stripeRows:true,
        margins : '2 2 2 -4',
        sm : smTDoc,
        columns : [{hidden : true,hideable : false,dataIndex : 'idtdoc'},
					{header : "Denominaci&oacute;n",dataIndex : 'denomtdoc',id : 'denomtdoc',renderer:MostrarImagenTipoElemento}
		],
        loadMask : {
            msg : "Cargando tipos de documentos..."
        },
        tbar : [gestesta]
    });

   /* win = new Ext.Window({
        layout : 'fit',
        width : 600,
        height : 350,
        closeAction : 'hide',
        title : 'Asociar estados a tipos de documentos',
        items : gpTDoc
    });
    win.show();*/
	win = new Ext.Panel({
        layout : 'fit',
        title : '<center>Registro de tipos de documentos</center>',
        items : gpTDoc
    });
	//viewport de la vista
	vpGestionarDoc = new Ext.Viewport({
		layout:'fit',
		items:win
	});
	
	function MostrarImagenTipoElemento(valor)
	{
	 var icon = 'plan';
	 if(valor)
	 {
		var arrayvalor = valor.split("*");
		if(arrayvalor[1] == 1)
		{
			icon = 'obj_ejec';
		}
		if(arrayvalor[1] == 3)
		{
			icon = 'act_ejec';
		}
	 }
	 return '<span><img src="../../../../../planificacion/pdo/comun/recursos/images/fam/'+icon+'.png" >'+' '+arrayvalor[0]+'</span>';
	}
	
}
CargarInterfaz();
// Ventanas
function Winop(op) {
    switch (op) {
        case 'addtdoc' : {
            winop = new Ext.Window({
                width : 400,
                modal : true,
                closeAction : 'hide',
                height : 390,
                title : 'Insertar tipo documento',
                items : [formtdoc, gpSub],
                buttons : [{
                    text : 'Cancelar',
                    iconCls : 'btn',
                    handler : function() {
                        formtdoc.getForm().reset();
                        winop.hide();
                    },
                    icon : perfil.dirImg + 'cancelar.png'
                }, {
                    text : 'Aplicar',
                    iconCls : 'btn',
                    handler : function() {
                        adicionartdoc('apl');
                    },
                    icon : perfil.dirImg + 'aplicar.png'
                }, {
                    text : 'Aceptar',
                    iconCls : 'btn',
                    handler : function() {
                        adicionartdoc('add');
                    },
                    icon : perfil.dirImg + 'aceptar.png'
                }]
            });
            winop.show();
        }
        break;
        case 'modtdoc' : {
            winop = new Ext.Window({
                width : 400,
                modal : true,
                // layout:'border',
                closeAction : 'hide',
                height : 350,
                title : 'Modificar tipo documento',
                items : [formtdoc, gpSubmod],
                buttons : [{
                    text : 'Cancelar',
                    iconCls : 'btn',
                    handler : function() {
                        formtdoc.getForm().reset()
                        winop.hide();
                    },
                    icon : perfil.dirImg + 'cancelar.png'
                }, {
                    text : 'Aceptar',
                    iconCls : 'btn',
                    handler : function() {
                        apltdoc = true;
                        modificartdoc('mod');
                    },
                    icon : perfil.dirImg + 'aceptar.png'
                }]
            });
            winop.show();
            formtdoc.getForm().loadRecord(smTDoc.getSelected());
        }
        break;
        case 'winest' : {
            winop = new Ext.Window({
                layout : 'fit',
                width : 500,
                modal : true,
                closeAction : 'hide',
                height : 500,
                title : 'Gestionar estado',
                items : tabestado
            });
            winop.show();
        }
        break;
    }
}

// Funcciones Tipo Documento
function eliminartdoc(btnPresionado) {
    if (btnPresionado == 'yes') {
        Ext.Ajax.request({
            url : 'eliminartdoc',
            params : {
                idtdoc : smTDoc.getSelected().data.idtdoc
            },
            callback : function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                mostrarMensaje(responseData.codMsg,responseData.mensaje);
                stTDoc.reload();
            }
        });
    }
}
function adicionartdoc(tipo) {
    arrSub = new Array();
    var data = smSub.getSelections();
    Ext.each(data, function(item, index, intemall) {
        arrSub.push(item.data);
    });
    if (formtdoc.getForm().isValid()) {
        formtdoc.getForm().submit({
            url : 'adicionartdoc',
            params : {
                arrSub : Ext.encode(arrSub)
            },
            // waitMsg : 'Adicionando tipo documento ...',
            failure : function(form, action) {
                if (action.result.codMsg == 1 || action.result.codMsg == 3) {
                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                    stTDoc.reload();
                    formtdoc.getForm().reset();
                    if (tipo == 'add')
                        winop.hide();
                }
            }
        });
    } else
        mostrarMensaje(1,
            'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s)');
}
function modificartdoc() {
    arrSub = new Array();
    arrSub = smSubmod.getSeleted()
    if (formtdoc.getForm().isValid()) {
        formtdoc.getForm().submit({
            url : 'modificartdoc',
            waitMsg : 'Actualizando tipo documento ...',
            params : {
                idtdoc : smTDoc.getSelected().data.idtdoc,
                arrSub : Ext.encode(arrSub)
            },
            failure : function(form, action) {
                if (action.result.codMsg == 1 || action.result.codMsg == 3) {
                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                    stTDoc.reload();
                    formtdoc.getForm().reset();
                    winop.hide();
                }
            }
        });
    } else
        mostrarMensaje(1,
            'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s)');
}
// Funciones Estado
function eliminarasoc(record) {
    Ext.Ajax.request({
        url : 'eliminarestaosoc',
        params : {
            idtdoc : record.data.idtdoc,
            idestado : record.data.idestado
        },
        callback : function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            mostrarMensaje(responseData.codMsg, 'La asociaci&oacute;n'
                + ((responseData.codMsg == 1)
                    ? ' se ha'
                    : ' no se ha') + ' eliminado correctamente');
            stEstasoc.reload();
            stEstsasoc.reload();
        }
    });
	
	
	
}
