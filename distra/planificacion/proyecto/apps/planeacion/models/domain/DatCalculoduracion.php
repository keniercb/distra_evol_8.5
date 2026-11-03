<?php

class DatCalculoduracion extends BaseDatCalculoduracion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatTarea', array('local' => 'idtarea', 'foreign' => 'idtarea')
        );
		$this->hasMany(
            'DatEjerciciotarea', array('local' => 'idejerciciotarea', 'foreign' => 'idejerciciotarea')
        );
      
    }
/*
 * GROUP BY DISPDATE1
ORDER BY DISPDATE1;
9000008710
 * */
    public function tareasByProyectoDat($parametros)  {
        $cadena = "
                SELECT t.denelemento, et.duracionestimada ,et.idtarea ,et.fechainicio,t.idelemento
                FROM mod_objetivos.dat_elementos_dat_elementos e
                INNER JOIN mod_objetivos.dat_elementos t ON(e.idelementohijo = t.idelemento)
                INNER JOIN mod_planifproyecto.dat_tarea et ON(e.idelementohijo = et.idtarea)
                WHERE idelementopadre = {$parametros->padre}
                GROUP BY et.fechainicio,t.denelemento, et.duracionestimada,et.idtarea,t.idelemento
		        ORDER BY et.fechainicio;
                ";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadena)->fetchAll();
        return $result;
    }

    public function eliminarRegistroDat($idcalc){

        //$eliminar = "DELETE FROM mod_planifproyecto.dat_calculoduracion WHERE idcalc = {$idcalc}";
        $eliminar = "DELETE
                            FROM
                              mod_planifproyecto.dat_calculoduracion
                            WHERE
                              mod_planifproyecto.dat_calculoduracion.idcalculoduracion = {$idcalc}";
        $connA = Doctrine_Manager:: connection();
        $connA->execute($eliminar);
    }

    public function guardarRegistroDat($idtarea,$elemen,$user)  {

        $fecha = date('d/m/Y');
        $cadena = "
        INSERT INTO mod_planifproyecto.dat_calculoduracion(idtarea,tiempo,fecha,idusuario)
                VALUES ({$idtarea},'{$elemen}','{$fecha}',{$user})";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadena);
        return 1;
    }

    public function registrobytareaDat($idtarea){
        $consult = "
          SELECT c.idcalculoduracion as idcalc, c.tiempo, c.fecha, u.nombreusuario as usuario
          FROM mod_planifproyecto.dat_calculoduracion c
          INNER JOIN mod_seguridad.seg_usuario u ON(u.idusuario = c.idusuario)
          WHERE idtarea = {$idtarea};
        ";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($consult)->fetchAll();
        return $result;
    }
    public function maxminprombytareaDat($idtarea){
        $consulta = "
          SELECT
	      MAX(tiempo) as pesimista,
          MIN(tiempo) as optimista,
          AVG(tiempo) as medio
          FROM mod_planifproyecto.dat_calculoduracion
	      WHERE idtarea = {$idtarea};
        ";

        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($consulta)->fetchAll();
        return $result;

    }
    public function modificarEstimacionDat($idtarea,$tiempo){
        $consulta = "
        UPDATE mod_planifproyecto.dat_tarea
        SET duracionestimada='{$tiempo}'
        WHERE idtarea = {$idtarea};
        ";

        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($consulta);
        return $result;

    }
    public function obtenerTEstimacionDat($idtarea){
        $consulta = "
            SELECT duracionestimada
            FROM mod_planifproyecto.dat_tarea
            WHERE idtarea = {$idtarea};
        ";

        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($consulta)->fetchObject();
        return $result;

    }

    public function adicionarejercicioDat($data,$padre){
        $consulta = "
                  INSERT INTO mod_planifproyecto.dat_ejercicio(denominacion, fecha, hora, idproyecto)
                  VALUES ('{$data->denominacion}','{$data->fecha}', '{$data->hora}',{$padre});";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($consulta)->fetchAll();
        return $result;

    }
    public function modificarejercicioDat($data){
        $consulta = "
                  UPDATE mod_planifproyecto.dat_ejercicio
                  SET denominacion='{$data->denominacion}', fecha='{$data->fecha}', hora='{$data->hora}'
                  WHERE idejercicio={$data->idejercicio};
                  ";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($consulta)->fetchAll();
        return $result;

    }
    public function eliminarjercicioDat($data){

        $consulta = "
                  DELETE FROM mod_planifproyecto.dat_ejercicio
                  WHERE idejercicio={$data->idejercicio};
                  ";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($consulta)->fetchAll();
        return $result;

    }
    public function getejerciciosDat($parametros){
        $consulta = "
  SELECT idejercicio, denominacion, fecha, hora,idproyecto
  FROM mod_planifproyecto.dat_ejercicio
  WHERE idproyecto = {$parametros->proyectopadre};
        ";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($consulta)->fetchAll();
        return $result;
    }
    public function resultadoLeerDat($parametros){
        $consulta = "
  SELECT c.idcalculoduracion as idcalc, c.idtarea, c.tiempo, c.fecha,e.denelemento as denominacion
  FROM mod_planifproyecto.dat_calculoduracion as c
  INNER JOIN mod_planifproyecto.dat_tarea as t ON(t.idtarea=c.idtarea)
  INNER JOIN mod_objetivos.dat_elementos e ON(t.idtarea = e.idelemento)
  WHERE idejercicio = {$parametros->idejercicio};
        ";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($consulta)->fetchAll();
        return $result;
    }
    public function resultadoAddDat($parametros){
        $consulta = "
        INSERT INTO mod_planifproyecto.dat_calculoduracion(idtarea, tiempo, fecha, idusuario,idejercicio)
        VALUES ({$parametros->data->idelemento},'{$parametros->data->tiempo}',
               '{$parametros->data->fecha}',{$parametros->idusuariocrea},{$parametros->idejercicio})
                returning idcalculoduracion as idcalc;
        ";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($consulta)->fetchAll();
        return $result;
    }
    public function resultadoQuitRelDat($parametros){
        $consulta = "
                  UPDATE mod_planifproyecto.dat_calculoduracion
                  SET idejercicio=null
                  WHERE idcalculoduracion={$parametros->data->idcalc};
                  ";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($consulta)->fetchAll();
        return $result;

    }


}

//fin clase 
