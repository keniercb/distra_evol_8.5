<?php

class ConfigContabilizacion extends BaseConfigContabilizacion {

       public static function obtenerConfigContabilizacionlDadoId($idcontabilizacion) {
        return Doctrine::getTable('ConfigContabilizacion')->find($idcontabilizacion);
    }
}
