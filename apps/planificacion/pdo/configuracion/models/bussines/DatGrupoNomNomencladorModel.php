<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatGrupoNomNomencladorModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Adicionar(DatGrupoNomNomenclador $datGrupoNomNomenclador)
    {
        $datGrupoNomNomenclador->save();
    }

    public function Actualizar(DatGrupoNomNomenclador $datGrupoNomNomenclador)
    {
        $datGrupoNomNomenclador->save();
    }

    public function Eliminar($datGrupoNomNomenclador)
    {
        $datGrupoNomNomenclador->delete();
    }
}

