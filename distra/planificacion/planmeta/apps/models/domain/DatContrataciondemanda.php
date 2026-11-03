<?php

class DatContrataciondemanda extends BaseDatContrataciondemanda {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'DatPlanificacion', array('local' => 'idplanificacion', 'foreign' => 'idplanificacion')
        );
    }

    public function eliminarContratados($params) {
        $conn = Doctrine_Manager::connection();
        foreach ($params['modificados'] as $ejec) {
            if ($ejec->idcontrataciondemanda != null) {
                $sql = "DELETE FROM mod_planificacion.dat_contrataciondemanda dn
                WHERE dn.idcontrataciondemanda = {$ejec->idcontrataciondemanda}
  ";
                $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            }
        }
        return 1;
    }

    public function insertarContratacion($params) {
        // self::eliminarContratados($params);
        foreach ($params['modificados'] as $ejec) {
            if ($ejec->idcontrataciondemanda != null || $ejec->idcontrataciondemanda != "") {
                $objeto = Doctrine::getTable('DatContrataciondemanda')->find($ejec->idcontrataciondemanda);
                //modificar
                $objeto->cantidadcontratada = $ejec->cantcontratada;
                $objeto->preciocontratado = $ejec->preciocontratado;
                if ($params['codigo'] == 1)
                    $objeto->idplanificacion = $ejec->idplanificacion;
                $objeto->idindicador = $ejec->idindicador;
                $objeto->identidad = $ejec->identidad;
                $objeto->idejercicio = $ejec->idejercicio;
                $objeto->save();
            } else {
                //adicionar
                $objEjecPlan = new DatContrataciondemanda();
                $objEjecPlan->cantidadcontratada = $ejec->cantcontratada;
                $objEjecPlan->preciocontratado = $ejec->preciocontratado;
                if ($params['codigo'] == 1)
                    $objEjecPlan->idplanificacion = $ejec->idplanificacion;
                $objEjecPlan->idindicador = $ejec->idindicador;
                $objEjecPlan->identidad = $ejec->identidad;
                $objEjecPlan->idejercicio = $ejec->idejercicio;
                $objEjecPlan->save();
            }
        }



        return true;
    }

}
