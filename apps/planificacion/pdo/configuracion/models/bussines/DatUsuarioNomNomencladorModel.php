<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatUsuarioNomNomencladorModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Adicionar(
        DatUsuarioNomNomenclador $datUsuarioNomNomenclador
    ) 
    {
        $datUsuarioNomNomenclador->save();
    }

    public function Actualizar(
        DatUsuarioNomNomenclador $datUsuarioNomNomenclador
    ) 
    {
        $datUsuarioNomNomenclador->save();
    }

    public function Eliminar($datUsuarioNomNomenclador)
    {
        $datUsuarioNomNomenclador->delete();
    }
}

