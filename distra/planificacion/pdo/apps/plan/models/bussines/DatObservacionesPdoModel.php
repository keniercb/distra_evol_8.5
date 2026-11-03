<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatObservacionesPdoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatObservacionesPdo $datObservacionesPdo)
    {
        $datObservacionesPdo->save();
    }

    public function Actualizar(DatObservacionesPdo $datObservacionesPdo)
    {
        $datObservacionesPdo->save();
    }

    public function Eliminar(DatObservacionesPdo $datObservacionesPdo)
    {
        $datObservacionesPdo->delete();
    }

    function VerificarExistencia($idElemento)
    {
        //obtengo la observacion
        $observacion = DatObservacionesPdo::Buscar($idElemento);
        //envio a la controladora
        return $observacion;
    }
}

