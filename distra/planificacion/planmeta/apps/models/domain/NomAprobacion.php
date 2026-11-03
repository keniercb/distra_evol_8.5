<?php

class NomAprobacion extends BaseNomAprobacion {

    public function setUp() {
        parent::setUp();
        $this->hasMany(
                'NomTipomodelo', array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );
        $this->hasMany(
                'DatPlanificacion', array('local' => 'idaprobacion', 'foreign' => 'idaprobaciondemanda')
        );
        $this->hasMany(
                'NomIndicador', array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );
        $this->hasMany(
                'DatActividadentidad', array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );
        $this->hasMany(
                'DatActividadnivelproduccion', array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );
        $this->hasMany(
                'DatCartatecnologica', array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );
        $this->hasMany(
                'DatAplicacioncartatec', array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );
        $this->hasMany(
                'DatAjusteexistencia', array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );
        $this->hasMany(
                'DatAjusteexistenciacb', array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );
        $this->hasMany(
                'DatAjusteexistenciaod', array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );
        $this->hasMany(
                'DatDesgviaadquisorgsat', array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );
        $this->hasMany(
                'DatAnteproyecto', array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );
        $this->hasMany(
                'DatControldivisaindicadormodelo', array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );
        $this->hasMany(
                'DatMovimiento', array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );
        $this->hasMany(
                'DatLiberacion', array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );
        $this->hasMany(
                'DatIncremento', array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );
    }

    public function getNomAprobacion() {
        $con = Doctrine_Manager::connection();
        $query = "SELECT idaprobacion FROM mod_planificacion.nom_aprobacion;";
        $con->execute($query);
        $arrayAprob = $con->fetchAssoc($query);
        $arrayAprobClean = array();
        foreach ($arrayAprob as $aprob) {
            $arrayAprobClean[$aprob['idaprobacion']] = $aprob['idaprobacion'];
        }
        return $arrayAprobClean;
    }
        public function getIdAprob() {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT idaprobacion, denominacion FROM mod_planificacion.nom_aprobacion;";
        $arrayAprob =$conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        
        $result = array();
        foreach ($arrayAprob as $aprob) {
            $result[$aprob['denominacion']] = $aprob['idaprobacion'];
        }
        return $result;
    }

}

//fin clase 
