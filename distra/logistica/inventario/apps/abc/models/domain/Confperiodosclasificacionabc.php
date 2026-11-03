<?php

class Confperiodosclasificacionabc extends BaseConfperiodosclasificacionabc
{

    public function setUp()
    {
        parent::setUp();
    }

    public function obtenerPeriodosClasificacionABC($idestructura)
    {
        $q = new Doctrine_Query();
        return $q
            ->from('Confperiodosclasificacionabc cdp')
            ->where('idestructura = ?', array($idestructura))
            ->orderBy('fechainicio DESC')->execute()->toArray();
    }

    public function existePeriodosClasificacionABC($fechainicio, $fechafin)
    {
        $q = new Doctrine_Query();
        $r = $q->select('cdp.idconfperiodosclasificacionabc')
            ->from('Confperiodosclasificacionabc cdp')
            ->where('fechainicio = ? and fechafin = ?', array($fechainicio, $fechafin))
            ->execute()->toArray();

        return count($r) > 0;

    }

    public function obtenerPeriodosClasificacionABCById($idconf)
    {
        $q = new Doctrine_Query();
        return $q
            ->from('Confperiodosclasificacionabc')
            ->where('idconfperiodosclasificacionabc = ?', array($idconf))
            ->execute()->toArray();
    }

    public function obtenerTodosPeriodosClasificacionABC($idestructura, $cerrados = 1)
    {
        $q = new Doctrine_Query();
        return $q
            ->from('Confperiodosclasificacionabc')
            ->where('idestructura = ? and cerrado = ?', array($idestructura, $cerrados))
            ->execute()->toArray();
    }


}
