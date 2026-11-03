<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class NomNivelinvolucradoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(NomNivelinvolucrado $nomNivelinvolucrado)
    {
        $nomNivelinvolucrado->save();
    }

    public function Actualizar(NomNivelinvolucrado $nomNivelinvolucrado)
    {
        $nomNivelinvolucrado->save();
    }

    public function Eliminar($nomNivelinvolucrado)
    {
        $nomNivelinvolucrado->delete();
    }
}

