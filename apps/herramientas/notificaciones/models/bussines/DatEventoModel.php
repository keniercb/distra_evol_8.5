<?php

class DatEventoModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardat_evento(DatEvento $datEvento)
    {
        $datEvento->save();
    }

    public function modificardat_evento(DatEvento $datEvento)
    {
        $datEvento->save();
    }

    public function eliminardat_evento(DatEvento $datEvento)
    {
        $datEvento->delete();
    }

    public function listar_eventos($start, $limit)
    {
        return DatEvento::listarEventos($start, $limit);
    }

    public function getIdByName($name)
    {
        $evento = new DatEvento();

        return $evento->getIdByName($name);
    }

    public function getNotificationsInfoByEvent($nombre)
    {
        return DatEvento::getNotificationsInfoByEvent($nombre);
    }
} 