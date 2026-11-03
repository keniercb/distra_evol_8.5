<?php
interface ZendExt_Nomencladores_Interfaces_IADT
{
    /**
     * Crea una tabla.
     *
     * @param String $pTable      Nombre de la tabla
     * @param string $pTree       True si es arbolica, False si no
     * @param string $pEnabled    True si esta activado, False si no
     * @param array  $pCategories Arreglo de enteros
     * @param string $pSchema     Esquema donde se creara el nomenclador
     *
     * @return bool.
     */
    function createTable($pTable, $pTree, $pEnabled, $pCategories, $pSchema = 'mod_datosmaestros');

}
