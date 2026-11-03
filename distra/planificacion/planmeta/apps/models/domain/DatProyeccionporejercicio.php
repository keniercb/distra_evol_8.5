<?php

class DatProyeccionporejercicio extends BaseDatProyeccionporejercicio {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'NomEjercicioplanificacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
        $this->hasOne(
                'DatProyeccion', array('local' => 'idproyeccion', 'foreign' => 'idproyeccion')
        );
    }

    //Listar grid de proyecciones x ejercicio
    public function listarProyeccionporejercicio($params) {
        if ($params['total'] == FALSE) {
            $select = "SELECT e.ejercicio as ejercicioproyectado,
                     rank() OVER (PARTITION BY pe.idproyeccion ORDER BY idproyeccionporejercicio ASC) as numero,
                     (select case when split_part(pe.porciento::varchar,'.',2) = '' then pe.porciento::varchar else split_part(pe.porciento::varchar,'.',1)||'.'|| rtrim(split_part(pe.porciento::varchar,'.',2), '0') end )::numeric as porciento,
                     (select case when split_part(pe.importegasto::varchar,'.',2) = '' then pe.importegasto::varchar else split_part(pe.importegasto::varchar,'.',1)||'.'|| rtrim(split_part(pe.importegasto::varchar,'.',2), '0') end )::numeric as importegasto, 
                     (select case when split_part(pe.importeingreso::varchar,'.',2) = '' then pe.importeingreso::varchar else split_part(pe.importeingreso::varchar,'.',1)||'.'|| rtrim(split_part(pe.importeingreso::varchar,'.',2), '0') end )::numeric as importeingreso,
                     pe.idproyeccionporejercicio, e.idejercicio, pe.orden";
            $limit = "OFFSET {$params ['start'] } LIMIT {$params ['limit'] }";
        } else {
            $select = "SELECT count(idproyeccionporejercicio)";
            $limit = "";
        }
        $sqlQuery = "$select 
                FROM mod_planificacion.dat_proyeccion p
                INNER JOIN mod_planificacion.dat_proyeccionporejercicio pe 
                ON p.idproyeccion = pe.idproyeccion
                INNER JOIN mod_planificacion.nom_ejercicioplanificacion e 
                ON pe.idejercicioproyectado=e.idejercicio
                where pe.idproyeccion = {$params ['idproyeccion'] } "
                . "{$params['where']} $limit";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Adicionar una proyeccion x ejercicio
    public function adicionarProyeccionxejercicio($params) {
        $proyeccion = new DatProyeccionporejercicio();
        $proyeccion->idproyeccion = $params['idproyeccion'];
        $proyeccion->orden = $params['orden'];
        $proyeccion->idejercicioproyectado = $params['idejercicio'];
        $proyeccion->porciento = $params['porciento'];
        $proyeccion->importegasto = $params['importegasto'];
        $proyeccion->importeingreso = $params['importeingreso'];
        $proyeccion->save();
    }

    //Modificar una proyeccion x ejercicio
    public function modificarProyeccionxejercicio($params) {
        $params['proyxejercicio']->save();
    }

    //Eliminar proyecciones x ejercicio
    public function eliminarProyeccionxejercicio($idproyeccionporejercicio) {
        $query = "DELETE FROM mod_planificacion.dat_proyeccionporejercicio 
                  WHERE idproyeccionporejercicio in($idproyeccionporejercicio)";
        $conn = Doctrine_Manager::connection();
        $conn->execute($query);
    }

    //Eliminar proyecciones x ejercicio todos
    public function eliminarProyeccionxejercicioTodos($idproyeccion) {
        $query = "DELETE FROM mod_planificacion.dat_proyeccionporejercicio 
                  WHERE idproyeccion = $idproyeccion";
        $conn = Doctrine_Manager::connection();
        $conn->execute($query);
    }

    /************Metodos auxiliares******************/

    //Verificar existencia de la proyeccion x ejercicio (ejercicio)
    public function verificarExistetciaEjercicio($params) {
        $query = new Doctrine_Query();
        if ($params['idproyeccionxejercicio']) {
            $columna = Doctrine::getTable('DatProyeccionporejercicio')->find($params['idproyeccionxejercicio']);
            $idp = $query->from('DatProyeccionporejercicio p')
                            ->where("p.idejercicioproyectado = ?", $params['idejercicio'])
                            ->addWhere("p.idproyeccion = ?", $params['idproyeccion'])
                            ->execute()->toArray();

            if ($params['idejercicio'] != $columna->idejercicioproyectado) {
                if ($params['idproyeccionxejercicio'] == $idp['idproyeccionxejercicio']) {
                    return array();
                } else {
                    return $idp;
                }
            } else {
                return array();
            }
        }
        return $query->from('DatProyeccionporejercicio p')
                        ->where("p.idejercicioproyectado = ?", $params['idejercicio'])
                        ->addWhere("p.idproyeccion = ?", $params['idproyeccion'])
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
    }

    //Obtener el orden de los ejercicios proyectados para una proyeccion
    public function obtenerOrden($params) {
        $query = new Doctrine_Query();
        $idp = $query->from('DatProyeccionporejercicio p')
                        ->where("p.idproyeccion = ?", $params['idproyeccion'])
                        ->orderBy("p.orden DESC")
                        ->execute()->toArray();
        if ($idp) {
            return $idp[0]['orden'] + 1;
        } else {
            return 1;
        }
    }

    //Obtener el ultimo porciento de los ejercicios proyectados para una proyeccion
    public function obtenerPorcientoUltimo($params) {
        $query = new Doctrine_Query();
        $idp = $query->from('DatProyeccionporejercicio p')
                        ->where("p.idproyeccion = ?", $params['idproyeccion'])
                        ->orderBy("p.orden DESC")
                        ->limit(1)
                        ->execute()->toArray();
        if ($idp) {
            return $idp[0]['porciento'];
        } else {
            return -1;
        }
    }

    //Obtener el porciento anteriror de un ejercicio proyectado para una proyeccion
    public function obtenerPorcientoAnterior($orden, $params) {
        $sqlQuery = "SELECT pe.porciento
                FROM mod_planificacion.dat_proyeccionporejercicio pe 
                where pe.idproyeccion = {$params ['idproyeccion'] }  
                and pe.orden = $orden 
                order by pe.orden";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    //Obtener el los ejercicios proyectados para una proyeccion
    public function obtenerEjerciciosProyeccion($params) {
        $sqlQuery = "SELECT pe.idproyeccionporejercicio
                FROM mod_planificacion.dat_proyeccion p
                INNER JOIN mod_planificacion.dat_proyeccionporejercicio pe 
                ON p.idproyeccion = pe.idproyeccion
                INNER JOIN mod_planificacion.nom_ejercicioplanificacion e 
                ON pe.idejercicioproyectado=e.idejercicio
                where pe.idproyeccion = {$params ['idproyeccion'] }   
                ORDER BY idproyeccionporejercicio ASC";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    //Listar grid de proyecciones x ejercicio
    public function listarEjerciciosPorProyeccion($params) {
        $sqlQuery = "SELECT e.ejercicio as ejercicio, e.idejercicio, pe.porciento
                FROM mod_planificacion.dat_proyeccion p
                INNER JOIN mod_planificacion.dat_proyeccionporejercicio pe 
                ON p.idproyeccion = pe.idproyeccion
                INNER JOIN mod_planificacion.nom_ejercicioplanificacion e 
                ON pe.idejercicioproyectado=e.idejercicio
                where pe.idproyeccion = {$params ['idproyeccion'] } 
                order by pe.orden";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}
