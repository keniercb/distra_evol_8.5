<?php

/**
 * Created by PhpStorm.
 * User: madrid
 * Date: 16/11/2016
 * Time: 14:23
 */
class NomConceptoAportesModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function listarConceptosAportes()
    {
        $result = NomConceptoaporte::listarConcepAporte();
        return $result;
    }

    public function adicionarConceptoAporte($parametros)
    {
        NomConceptoaporte::adicionarConcepAporte($parametros);
    }

    public function modificarConceptoAporte($parametros)
    {
        NomConceptoaporte::modificarConcepAporte($parametros);
    }

    public function eliminarConceptoAporte($parametros)
    {
        NomConceptoaporte::eliminarConcepAporte($parametros);
    }

}