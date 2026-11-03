<?php

/**
 * @author    Liermes Ferriol Mena
 * @author    Jany Coto García
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class NomCategActividadModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Adicionar(NomCategActividad $nomCategactividad)
    {
        $nomCategactividad->save();
    }

    public function Actualizar(NomCategActividad $nomCategactividad)
    {
        $nomCategactividad->save();
    }

    public function Eliminar($nomCategactividad)
    {
        $nomCategactividad->delete();
    }
}

