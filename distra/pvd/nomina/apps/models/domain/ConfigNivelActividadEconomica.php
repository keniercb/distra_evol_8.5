<?php

class ConfigNivelActividadEconomica extends BaseConfigNivelActividadEconomica
{

    public function setUp()
    {
        parent :: setUp ();
    }

    public static function obtenerListadoNivelesActividadEconomica($idestructura, $inicio, $limite) {
        //Devolviendo el listado de los niveles de actividades economicas.
        return Doctrine_Query::create()
            ->from('ConfigNivelActividadEconomica')
            ->where('idestructura = ?', array($idestructura))
            ->fetchArray();
    }

    public static function obtenerListadoNivelesActividadEconomicaDadoId($idconfiguracionnivelae) {
        return Doctrine::getTable('ConfigNivelActividadEconomica')->find($idconfiguracionnivelae);
    }

    public static function existeUnMismoIdTipoDeNomina($idestructura,$idtiponomina) {
        return Doctrine_Query::create()
            ->from('ConfigNivelActividadEconomica')
            ->where('idestructura = ? and idtiponomina = ?', array($idestructura, $idtiponomina))
            ->fetchArray();
    }
}

