<?php

class DatEjerciciotarea extends BaseDatEjerciciotarea
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatCalculoduracion', array('local' => 'idejerciciotarea', 'foreign' => 'idejerciciotarea')
        );
        $this->hasMany(
            'DatEjercicio', array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
    }

    /**
     * Accion para eliminar tareas del ejercicio
     */
    public function eliminarTareasEjercicioArray($idejercicio, $idtareas)
    {
        $cadenaQuery = "DELETE FROM mod_planifproyecto.dat_ejerciciotarea
                          WHERE idejercicio = $idejercicio AND
                          idtarea NOT IN ($idtareas)";
        $conn = Doctrine_Manager:: connection();
        $conn->execute($cadenaQuery);
    }
    /**
     * Accion para listar las tareas del ejercicio
     */
    public function getTareasEjercicio($idejercicio)
    {
        $cadenaQuery = "SELECT t.idtarea, e.denelemento, e.idelemento,  t.duracionestimada
                          FROM mod_planifproyecto.dat_ejerciciotarea et
                          INNER JOIN  mod_planifproyecto.dat_tarea t ON(t.idtarea=et.idtarea)
                          INNER JOIN mod_objetivos.dat_elementos e ON(t.idtarea=e.idelemento)
                          WHERE et.idejercicio = $idejercicio";
        $conn = Doctrine_Manager:: connection();
        $result = $conn->execute($cadenaQuery )->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

}
