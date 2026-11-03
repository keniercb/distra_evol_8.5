<?php

class DatControldivisadocumentomodelo extends BaseDatControldivisadocumentomodelo {

    public function setUp() {
        parent::setUp();
    }

    public function dameentidadmodelodadomodelo($datosdocumento) {
        $query = "SELECT
  mod_planificacion.dat_entidadmodelo.identidadmodelo
FROM
  mod_planificacion.dat_entidadmodelo
WHERE
  mod_planificacion.dat_entidadmodelo.idmodelo=$datosdocumento";
        $conex = Doctrine_Manager:: connection();
        return $conex->execute($query)->fetchAll();
    }

}
