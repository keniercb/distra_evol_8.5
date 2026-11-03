function PagingToolbarSelections(config){
    return Ext.apply(this, config);
}
PagingToolbarSelections.prototype = new Object;

PagingToolbarSelections.prototype.saveSelectionsOnPage = function(list)
{
    for(var i in list)
        if(list[i].page == this.activePage)
            return list[i].selections = this.selections;
    return list.push({
        'page':this.activePage, 
        'selections':this.selections
    });
};
PagingToolbarSelections.prototype.setSelectionsOnPage = function(list, gridPanel)
{ 
    for(var i = 0; i < list.length; i++) 
    {	
        if(list[i].page == this.activePage)
            gridPanel.getSelectionModel().selectRows(this.getIndexSelectionsOnPage(gridPanel.getStore(), list[i].selections));
    }		
};
PagingToolbarSelections.prototype.getIndexSelectionsOnPage = function(store, selections)
{
    indexRows= new Array();
    for(var i = 0; i < selections.length; i++) 
        indexRows.push(store.find("id",selections[i].data.id));	
    return indexRows;
};
PagingToolbarSelections.prototype.getSelectionsOnArray = function(list)
{
    selectionsOnArray= new Array();
    arrayList= new Array();
    arrayList= this.saveSelectionsOnPage(list);
    for(i=0; i<list.length; i++)//se recorren las paginas existentes
        for(j=0; j<list[i].selections.length; j++)//para cada pagina se recorren sus selecciones
            selectionsOnArray.push(list[i].selections[j].data);//se adicionan las filas previamente seleccionadas
    return selectionsOnArray;//se retorna un arreglo de filas
};