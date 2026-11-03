<?php

class DatProyeccion extends BaseDatProyeccion {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'NomEjercicioplanificacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
        $this->hasMany(
                'DatProyeccionporejercicio', array('local' => 'idproyeccion', 'foreign' => 'idproyeccion')
        );
    }

    //Listar grid de proyecciones

    public function listarProyeccion($params) {
        if ($params['total'] == FALSE) {
            $select = "SELECT idproyeccion, denominacion,
                     descripcion,fecha, componente,
                     e.ejercicio as ejerciciobase,e.idejercicio,
                     (SELECT list(m.denominacion) FROM mod_planificacion.dat_modelo m where m.idmodelo = ANY (p.planes) )as planes, 
                     lineal as tipo, porciento,
                     rank() OVER (PARTITION BY identidad ORDER BY idproyeccion ASC) as numero,
                     (select case when split_part(importegasto::varchar,'.',2) = '' then importegasto::varchar else split_part(importegasto::varchar,'.',1)||'.'|| rtrim(split_part(importegasto::varchar,'.',2), '0') end )::numeric as importegasto, 
                     (select case when split_part(importeingreso::varchar,'.',2) = '' then importeingreso::varchar else split_part(importeingreso::varchar,'.',1)||'.'|| rtrim(split_part(importeingreso::varchar,'.',2), '0') end )::numeric as importeingreso";
            $limit = "OFFSET {$params ['start'] } LIMIT {$params ['limit'] }";
        } else {
            $select = "SELECT count(idproyeccion)";
            $limit = "";
        }
        $sqlQuery = "$select 
                FROM mod_planificacion.dat_proyeccion p
                INNER JOIN mod_planificacion.nom_ejercicioplanificacion e 
                ON p.idejerciciobase=e.idejercicio
                where p.identidad = {$params ['identidad'] }"
                . " {$params['where']} $limit";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Adicionar una proyeccion
    public function adicionarProyeccion($params) {
        $proyeccion = new DatProyeccion();
        $proyeccion->idejerciciobase = $params['idejercicio'];
        $proyeccion->componente = $params['componente'];
        $proyeccion->denominacion = $params['denominacion'];
        $proyeccion->descripcion = $params['descripcion'];
        $proyeccion->lineal = $params['tipo'];
        $proyeccion->identidad = $params['identidad'];
        $proyeccion->planes = "{" . $params['planes'] . "}";
        $proyeccion->fecha = $params['fecha'];
        $proyeccion->porciento = $params['porciento'];
        $proyeccion->importegasto = $params['importegasto'];
        $proyeccion->importeingreso = $params['importeingreso'];
        $proyeccion->save();
    }

    //Modificar una proyeccion
    public function modificarProyeccion($params) {
        $params['proyeccion']->denominacion = $params['denominacion'];
        $params['proyeccion']->descripcion = $params['descripcion'];
        $params['proyeccion']->save();

        if ($params['cambiarXejercicio'] = 1) {
            $ejerciciosproyectados = DatProyeccionporejercicio::obtenerEjerciciosProyeccion($params);
            foreach ($ejerciciosproyectados as $key => $value) {
                $proyxejercicio = Doctrine::getTable('DatProyeccionporejercicio')
                        ->findByDql("idproyeccionporejercicio = $value");
                if ($params['tipo'] == 1) {
                    $proyxejercicio[0]->importegasto = $proyxejercicio[0]->porciento * $params['proyeccion']->importegasto / 100;
                    $proyxejercicio[0]->importeingreso = $proyxejercicio[0]->porciento * $params['proyeccion']->importeingreso / 100;
                } else {
                    if ($params['cambiarPorciento'] == 1) {
                        if ($key == 0) {
                            $auxporciento = $params['porciento'];
                        } else {
                            $ultporciento = DatProyeccionporejercicio::obtenerPorcientoAnterior($proyxejercicio[0]->orden - 1, $params);
                            $auxporciento = $ultporciento[0] * $params['porciento'] / 100;
                        }
                        $proyxejercicio[0]->importegasto = $auxporciento * $params['proyeccion']->importegasto / 100;
                        $proyxejercicio[0]->importeingreso = $auxporciento * $params['proyeccion']->importeingreso / 100;

                        $proyxejercicio[0]->porciento = $auxporciento;
                    } else {
                        $proyxejercicio[0]->importegasto = $proyxejercicio[0]->porciento * $params['proyeccion']->importegasto / 100;
                        $proyxejercicio[0]->importeingreso = $proyxejercicio[0]->porciento * $params['proyeccion']->importeingreso / 100;
                    }
                }
                $params['proyxejercicio'] = $proyxejercicio[0];
                DatProyeccionporejercicio::modificarProyeccionxejercicio($params);
            }
        }
    }

    //Eliminar proyecciones
    public function eliminarProyeccion($idproyecciones) {
        $query = "DELETE FROM mod_planificacion.dat_proyeccion 
                  WHERE idproyeccion in($idproyecciones)";
        $conn = Doctrine_Manager::connection();
        $conn->execute($query);
    }

}
