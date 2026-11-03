<?php
class ZendExt_CompExImp_Importacion_Importador
{
    function __construct()
    {
    }

    public function importar($ident, $clase)
    {
        $class = ( string )$clase ['claseimp'];
        $obj = new $class ();
        $metod = ( string )$clase ['metodoimp'];
        $dir = $ident;
        return $obj->$metod ($dir);
    }
}
