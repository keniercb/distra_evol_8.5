<?php

class ConfCondicionesRetenciones extends BaseConfCondicionesRetenciones {

    public function obtenerConfiguracionCondicionesRetenciones() {

        //Devolviendo el listado de la configuracion de las condiciones de las retenciones
        return Doctrine_Query::create()
                ->from('ConfCondicionesRetenciones')
                ->fetchArray();
    }
    
    public function obtenerCondicionesRetencionesPorTipoNomina($idtiponomina) {

        return Doctrine_Query::create()
                ->from('ConfCondicionesRetenciones')
                ->where('idtiponomina = ?', array($idtiponomina))
                ->fetchArray();
    }

    public static function obtenerObjConfigCondicionesRetenciones($idconfig) {
        return Doctrine::getTable('ConfCondicionesRetenciones')->find($idconfig);
    }

}
