<?php

/**
 * Modelo de negocio para gestionar los nomencladores de nómina.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @copyright UCID
 * @version 1.0
 */
class NomNomencladoresModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function NomNomencladoresModel() {
        parent::ZendExt_Model();
    }

    /**
     * Función para obtener el árbol de nomencladores y estblecerle a cada nodo su url.
     * 
     * @param string $dir_root Url del directorio actual.
     */
    public function obtenerArbolNomencladores($dir_root) {
        //Obteniendo el listado de nomencladores.
        $listadoNomencladores = NomNomencladores::obtenerTodosNomencladores();

        //Se crea el array de salida.
        $arrArbol = array();

        //Se comprueba que el arreglo contenga valores.
        if(count($listadoNomencladores) > 0){
            //Se establece la url de cada nomenclador.
            foreach($listadoNomencladores as $v){
                $arrArbol[] = array(  'id' => $v['idnomenclador'], 
                                      'text' => $v['denom'],
									  'referencia' => $v['referencia'],								  
                                      'leaf' => true, 
                                      'src' => $dir_root.'views/js/'.$v['referencia']."/".$v['referencia'],
                                      'clase' => $v['clase'], 

                );
            }
        }  
            
        //Devolviendo el arreglo de nomencladores.
        return $arrArbol;
    }

}