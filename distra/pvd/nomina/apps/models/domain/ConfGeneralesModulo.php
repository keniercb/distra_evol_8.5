<?php

class ConfGeneralesModulo extends BaseConfGeneralesModulo {

    public static function obtenerConfGeneralesModulolDadoId($idconfgeneralesmodulo) {
        return Doctrine::getTable('ConfGeneralesModulo')->find($idconfgeneralesmodulo);
    }

    public static function obtenerConfGeneralesModulolDadoIdModulo($idmodulo) {
        return Doctrine_Query::create()
            ->from('ConfGeneralesModulo')
            ->where('idmodulo = ?', array($idmodulo))
            ->fetchArray();
    }

    public static function obtenerIdConfGeneralesModulolDadoIdModulo($idmodulo) {
        return Doctrine_Query::create()
            ->select('idconfgeneralesmodulo')
            ->from('ConfGeneralesModulo')
            ->where('idmodulo = ?', array($idmodulo))
            ->fetchOne()->idconfgeneralesmodulo;
    }

    public static function obtenerOperacionDadoIdModulo($idmodulo, $idestructura) {
        return Doctrine_Query::create()
            ->select('idoperacionretencion')
            ->from('ConfGeneralesModulo')
            //->where('idmodulo = ? and identidad = ?', array($idmodulo, $idestructura))
            ->where('idmodulo = ?', array($idmodulo))
            ->fetchOne()->idoperacionretencion;
    }
}
