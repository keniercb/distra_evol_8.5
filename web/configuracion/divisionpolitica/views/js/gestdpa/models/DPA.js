function Pais(){
    this.superClass = ViewModel;
    this.superClass({
        fields:[
            {name:"Identificador del pais",type:"Number",index:"idpais",pk:true},
            {name:"Pais",type:"String",index:"denominacion",notNull:true},
            {name:"Alias",type:"Sring",index:"alias"},
            {name:"Codigo",type:"Number",index:"codigo"},
            {name:"Direcci&oacute;n",type:"String",index:"direccion"}
        ]
    });
};
function DPA(){
    this.superClass = ViewModel;
    this.superClass({
        fields:[
            {name:"Identificador del dpa",type:"Number",index:"iddpt",pk:true},
            {name:"Codigo",type:"Number",index:"codigo"},
            {name:"Nombre",type:"Sring",index:"denominacion",notNull:true},
            {name:"Alias",type:"Sring",index:"alias"},
            {name:"Nivel estructural",type:"String",index:"nivelestr"},
            {name:"Ruta de identificadores",type:"String",index:"ruta"},
            {name:"Ruta",type:"String",index:"rutaDenom"},
            {name:"Identificador del nivel estructural",type:"Number",index:"idnivelestr"},
            {name:"Pais",type:Pais,index:"Pais",fk:[{local:'idpais',foreing:'idpais'}]},
            {name:"Direcci&oacute;n",type:"String",index:"direccion"},
            {name:"Comuna",type:NomComuna,index:"NomComuna",fk:[{local:'idcomuna',foreing:'idcomuna'}]}
        ]
    });
};
function NomComuna(){
    this.superClass = ViewModel;
    this.superClass({
        fields:[
        {
            name:"Identificador de la comuna",
            type:"Number",
            pk:true,
            index:"idcomuna",
            notNull:true
        },

        {
            name:"Comuna",
            type:"String",
            index:"denominacion",
            notNull:true
        },

        //{name:"Descripcion",type:"String",index:"descripcion",notNull:false},

        {
            name:"Fecha Inicio",
            type:"Date",
            index:"fechaini"
        },

        {
            name:"Fecha Fin",
            type:"Date",
            index:"fechafin"
        }
        ],
        insUrl:"/std/std_ci/gestion_incidencias/nomencladores_incidencia/index.php/nomencladorincidencia/insertarcomuna",
        updUrl:"/std/std_ci/gestion_incidencias/nomencladores_incidencia/index.php/nomencladorincidencia/insertarcomuna",
        delUrl:"/std/std_ci/gestion_incidencias/nomencladores_incidencia/index.php/nomencladorincidencia/eliminarcomuna",
        findUrl:"/std/std_ci/gestion_incidencias/nomencladores_incidencia/index.php/nomencladorincidencia/getcomuna",
        findByUrl:""
    });
}