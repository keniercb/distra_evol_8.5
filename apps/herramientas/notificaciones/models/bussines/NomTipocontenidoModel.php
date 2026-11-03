<?php

class NomTipocontenidoModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertarnom_tipocontenido($nomTipocontenido)
    {
        $nomTipocontenido->save();
    }

    public function modificarnom_tipocontenido($nomTipocontenido)
    {
        $nomTipocontenido->save();
    }

    public function eliminarnom_tipocontenido($nomTipocontenido)
    {
        $nomTipocontenido->delete();
    }

    public static function getByIdVia($idvia)
    {
        $info = Doctrine:: getTable('NomTipocontenido')->createQuery()
            ->where('viaenvio = ?', $idvia)
            ->execute()->toArray();

        return $info[0]['denominacion'];
    }

}