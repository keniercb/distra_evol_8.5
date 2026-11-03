/*
 * clase XMetaSearchField
 * */
var valor,letra,contador,estado;
 XMetaSearchField = Ext.extend(Ext.app.SearchField,{

	initComponent : function(){
        contador = 0;
        estado = false;
        valor = Array(31);
        XMetaSearchField.superclass.initComponent.call(this); 
        this.on('specialkey', function(f, e){

                if(e.getKey() == e.ENTER){
                    this.onTrigger2Click();
                }
            this.focus();
        }, this); 
        /*
        * {A = 65 Z = 90}
        * {a = 97 z = 122}
        * {0 = 48 9 = 57}
        * {_ = 173}
        * {DELETE = 46}
        * {SUPRIMIR = 8}
        * {ENTER = 13}
        *
        *
        * */
        this.on('keypress', function(f,e){
             if(this.isValid()){
			     var key = e.getKey();
                 letra = String.fromCharCode(key).toLowerCase();
                 if((e.SHIFT  && (key >= 65 && key <= 90)) ||(e.CAPS_LOCK && (key >= 65 && key <= 90)) ) {
                     letra = String.fromCharCode(key).toUpperCase();
                 }
                 /*SI ESTA ESCRIBIENDO*/
                 if( ((key >= 65 && key <= 90) || (key >= 97 && key <= 122)
                     || (key >= 48 && key <= 57) ||  key == 173) && contador < 30){
                     valor[contador++] = this.getRawValue();
                     estado = true;
                 }/*SI ESTA BORRANDO*/
                 else if((key == 8 || key == 46) && contador > 0){
                     estado = false;
                     valor[contador--] = this.getRawValue();
                 }
			     if( (key >= 65 && key <= 90) || (key >= 97 && key <= 122)
                    || (key >= 48 && key <= 57) ||  key == 173 || key == 8 || key == 46  || key == 13){
                    this.onTrigger2Click();
			     }else{
                    this.focus();
                 }
             }
		},this);
    },
    
    enableKeyEvents: true,   
    
    limit : 10,
    
    onTrigger1Click : function(){
        if(this.isValid()){
            if(this.hasSearch){
                this.el.dom.value = '';
                var o = {start: 0, limit: this.limit};
                this.store.baseParams = this.store.baseParams || {};
                this.store.baseParams[this.paramName] = '';
                this.store.reload({params:o});
                this.triggers[0].hide();
                this.hasSearch = false;
            }
        }


    },

    onTrigger2Click : function(){
        if(this.isValid()){
            var valorBuscar = (estado)?valor[contador-1]+letra:valor[contador];

            if(valorBuscar != null && valorBuscar.length < 1){
               this.onTrigger1Click();
               return;
            }

            var o = {start: 0, limit: this.limit};
            this.store.baseParams = this.store.baseParams || {};
            this.store.baseParams[this.paramName] = valorBuscar;
            this.store.reload({params: o ,
                callback: function(response) {
                    if (response.length == 0) {
                        mostrarMensaje(7, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');

                }
            }});
            this.hasSearch = true;
            this.triggers[0].show();
        }else{
            mostrarMensaje(7,'Solo admite caracteres alfanuméricos y el caracter especial "_"');
            this.focus();
        }
    }
			
});
