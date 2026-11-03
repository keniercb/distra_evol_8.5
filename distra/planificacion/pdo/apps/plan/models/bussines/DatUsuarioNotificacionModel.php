<?php

class DatUsuarioNotificacionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatUsuarioNotificacion $datUsuarioNotificacion)
    {
        $datUsuarioNotificacion->save();
    }

    public function Actualizar(DatUsuarioNotificacion $datUsuarioNotificacion)
    {
        $datUsuarioNotificacion->save();
    }

    public function Eliminar($datUsuarioNotificacion)
    {
        $datUsuarioNotificacion->delete();
    }


}

