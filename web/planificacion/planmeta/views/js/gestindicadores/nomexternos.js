
var fpupindext;
/***	Panel	***/
pIndExt = new Ext.Panel({
    title: 'Indicadores externos',
    id: 'pindext',
    region: 'east',
    width: 200,
    listeners: {show: function() {
            if (!fpupindext) {
                Ext.getBody().mask(perfil.etiquetas.lbEspere);
                Ext.Ajax.request({
                    url: 'cargarconfexternos',
                    callback: function(op, success, resp) {
                        Ext.getBody().unmask();
                        resp = Ext.decode(resp.responseText);
                        fpupindext = new Ext.FormPanel({
                            id: 'fpupindext',
                            frame: true,
                            labelAlign: 'top',
                            items: [{
                                    layout: 'column',
                                    items: getColumns(resp)
                                }]
                        });
                        pIndExt.add(fpupindext);
                        pIndExt.doLayout();
                    }
                });
            }
        }},
    hidden: true,
    split: true,
    layout: 'fit'
});

function getColumns(resp) {
    var arrcol = [];
    for (var i = 0; i < resp.length; i++) {
        arrcol.push({
            columnWidth: .8,
            layout: 'form',
            style: 'margin-top:9px;',
            html: resp[i].denom
        });
        arrcol.push({
            columnWidth: .2,
            layout: 'form',
            style: 'margin-top:5px;',
            items: new Ext.Button({icon: aperfil.dirImg + 'actualizar.png', iconCls: 'btn', tooltip: 'Actualizar nomenclador de:<br><b>' + resp[i].denom + '</b>', id: resp[i].id,
                handler: function(btn) {
                    upnomencladorexterno(btn.id);
                }
            })
        });
    }
    return arrcol;
}

function upnomencladorexterno(id) {
    Ext.getBody().mask(perfil.etiquetas.lbEspere);
    Ext.Ajax.request({
        url: 'upnomencladorexterno',
        params: {id: id},
        callback: function(op, success, resp) {
            Ext.getBody().unmask();
        }
    });
}