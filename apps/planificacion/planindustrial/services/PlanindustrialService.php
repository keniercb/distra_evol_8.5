<?php

class PlanindustrialService {

    public function obtenerIndicadoresxCarta($params) {
        return DatCartatecindustrialactividad::obtenerIndicadoresxCarta($params);
    }

    public function obtenerIndicadorSalidaxCarta($alias, $query) {
        return DatCartatecindustrialactividad::obtenerIndicadorSalidaxCarta($alias, $query);
    }

}
