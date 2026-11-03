<?php

class DatActividadnivelproduccion extends BaseDatActividadnivelproduccion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomActividad',
            array('local' => 'idactividad', 'foreign' => 'idactividad')
        );
        $this->hasOne(
            'NomEjercicioplanificacion',
            array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
    }

    public function buscarActNivProd($idactividad, $idejercicio = null)
    {
        if ($idejercicio == null) {
            $arrayIdejercicio
                = NomEjercicioplanificacion::listarEjercicioActual();
            $idejercicio = $arrayIdejercicio[0]['idejercicio'];
        }
        $queryBuscar = new Doctrine_Query();
        $queryBuscar->from('DatActividadnivelproduccion anp');
        $queryBuscar->where(
            'anp.idactividad = ? AND anp.idejercicio = ? ',
            array($idactividad, $idejercicio)
        );
        return $queryBuscar->execute();
    }


}

