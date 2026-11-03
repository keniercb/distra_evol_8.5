<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatCriterioDatInvolucradosModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(
        DatCriterioDatInvolucrados $datCriterioDatInvolucrados
    ) {
        $datCriterioDatInvolucrados->save();
    }

    public function Actualizar(
        DatCriterioDatInvolucrados $datCriterioDatInvolucrados
    ) {
        $datCriterioDatInvolucrados->save();
    }

    public function Eliminar($datCriterioDatInvolucrados)
    {
        $datCriterioDatInvolucrados->delete();
    }
}

