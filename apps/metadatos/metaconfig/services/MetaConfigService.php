<?php

/**
 * Class NomencladorService
 * Descripción de la clase: Empleada a realizar una llamado de los servicios de los nomencladores
 *
 * @author    : Ing. Javier Limonta
 * @modify    : Ing. Pedro Alonso
 * @modify    : Ing. Daymel Machado
 * @modify    : Ing. Osvaldo M. Gonzalez
 * @copyright Copyright (c) 2013 xetid
 */
class MetaConfigService extends ZendExt_Model
{
    /**
     * @return array
     */
    function getConceptos()
    {
        return NomConcepto::dameTodos();
    }

    /**
     * @return mixed
     */
    function  obtenerConceptosIconos()
    {
        $con = new NomConceptoModel();

        return $con->obtenerConceptosIconos();
    }
}