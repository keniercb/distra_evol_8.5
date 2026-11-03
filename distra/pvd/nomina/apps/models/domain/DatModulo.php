<?php

class DatModulo extends BaseDatModulo {

    public static function obtenerDatModuloDadoId($idmodulo) {
        return Doctrine::getTable('DatModulo')->find($idmodulo);
    }

    public static function obtenerDatModuloDadoIdModulo($idmodulo) {
        return Doctrine_Query::create()
            ->from('DatModulo')
            ->where('idmodulo = ?', array($idmodulo))
            ->fetchArray();
    }
}
