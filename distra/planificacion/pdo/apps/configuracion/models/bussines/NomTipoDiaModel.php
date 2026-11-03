<?php

/**
 * @author    Liermes Ferriol Mena
 * @author    Jany Coto García
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class NomTipoDiaModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Adicionar(NomTipoDia $nomTipoDia)
    {
        $nomTipoDia->save();
    }

    public function Actualizar(NomTipoDia $nomTipoDia)
    {
        $nomTipoDia->save();
    }

    public function Eliminar($nomTipoDia)
    {
        $nomTipoDia->delete();
    }
}

