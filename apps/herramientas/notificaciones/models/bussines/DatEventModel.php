<?php

class DatEventModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardat_evento(DatEvent $datEvento)
    {
        $datEvento->save();
    }

    public function modificardat_evento(DatEvent $datEvento)
    {
        $datEvento->save();
    }

    public function eliminardat_evento(DatEvent $datEvento)
    {
        $datEvento->delete();
    }

    public function listar_eventos($start, $limit)
    {
        return DatEvent::listarEventos($start, $limit);
    }

    public function getIdByName($name)
    {
        $evento = new DatEvent();

        return $evento->getIdByName($name);
    }

    public function getNotificationsInfoByEvent($nombre)
    {
        return DatEvent::getNotificationsInfoByEvent($nombre);
    }
} 