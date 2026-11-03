<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatCriteriomedidaModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatCriteriomedida $datCriteriomedida)
    {
        $datCriteriomedida->save();
    }

    public function Actualizar(DatCriteriomedida $datCriteriomedida)
    {
        $datCriteriomedida->save();
    }

    public function Eliminar($datCriteriomedida)
    {
        $datCriteriomedida->delete();
    }

    public function VerificarExistencia($idcriteriomedida)
    {
        //obtengo el objetivo
        $objetocriteriomedida = DatCriteriomedida::Buscar($idcriteriomedida);
        //envio a la controladora	   
        return $objetocriteriomedida;
    }

    public function existeNomencladorSegunId($idNom)
    {
        $result = DatCriteriomedida::existeNomencladorSegunId($idNom);
        return $result;
    }

}

