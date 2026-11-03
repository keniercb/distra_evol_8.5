<?php

class DatVariablesCondicionesRetenciones extends BaseDatVariablesCondicionesRetenciones {

    /**
     * Obtener todas las variables de condiciones de retenciones.
     * 
     * @return array    Listado de los datos de las variables de condiciones de retenciones.
     */
    public static function obtenerTodasVariables() {

        //Devolviendo el listado de las variables de vacaciones en forma de arreglo.
        return Doctrine_Query::create()
                ->from('DatVariablesCondicionesRetenciones')
                ->fetchArray();
    }
   
}
