<?php

class DatPeriodoDestajo extends BaseDatPeriodosDestajo
{

    public static function obtenerObjDatPeriodoDestajo($idperiodosdestajo) {
        return Doctrine::getTable('DatPeriodoDestajo')->find($idperiodosdestajo);
    }

    public static function obtenerPeriodosDestajo($idperiodosdestajo)
    {
        return Doctrine_Query::create()
            ->select('*')
            ->from('DatPeriodoDestajo')
            ->where('idperiodosdestajo = ?', array($idperiodosdestajo))
            ->fetchArray();
    }

    public static function obtenerPeriodoDestajoxIdentidadPagoResultado($identidad, $idpagoresultado)
    {
        return Doctrine_Query::create()
            ->select('*')
            ->from('DatPeriodoDestajo')
            ->where("identidad = ? and idpagoresultado = ?", array($identidad, $idpagoresultado))
            ->fetchArray();
    }

}
