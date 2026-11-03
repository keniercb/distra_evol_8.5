<?php

class DatProyecto extends BaseDatProyecto {

    public function setUp() {
        parent::setUp();
        $this->hasMany(
                'DatEjercicio', array('local' => 'idproyecto', 'foreign' => 'idproyecto')
        );
    }

    public function cargarElementos($parametros) {
        //print_r($parametros );die;
        //query con sintaxis general a usar en todos los casos
        $cadebaOrderBy = "";
        $cadenaSelect
                = " SELECT e.idelemento, e.idtipoelemento, e.denelemento,
                e.descelemento, e.idusuariocrea, e.activo, e.fechacreacion,
                e.gradocumplimiento, e.peso, e.estadocumplimiento,
                es.denominacion AS denoestado, e.idestadoaprob,
                e.gennotificacion, e.cantobserv";
        $cadenaFrom
                = " FROM  mod_objetivos.dat_elementos e
                LEFT JOIN  mod_flujotrabajo.dat_estado es
                ON(e.idestadoaprob = es.idestado) ";

        //relacion con proyecto
        if ($parametros->padre == null || $parametros->tipoelemento == 8) {
            $cadenaSelect
                    .= " ,p.plantilla, p.duracionreal, p.duracionestimada,
                p.fechafin, p.fechainicio, p.identificador, p.idprioridad ";
            $cadenaFrom
                    .= " INNER JOIN  mod_planifproyecto.dat_proyecto p
                ON(e.idelemento = p.idproyecto)  ";
            $cadebaOrderBy .= " ORDER BY p.fechainicio";
        } else {
            //si tiene padre
            $cadenaSelect
                    .= " ,h.plantilla, h.duracionreal, h.duracionestimada,
                    h.fechafin, h.fechainicio,

                    t.plantilla AS plantillaT, t.duracionreal AS duracionrealT,
                    t.duracionestimada AS duracionestimadaT,
                    t.fechafin AS fechafinT, t.fechainicio AS fechainicioT,
                    t.horafin, t.horainicio,
                    t.unidadmedida,t.valorreal,t.valormeta,t.costo,
                    t.idevaluacion, t.lugar, t.esprincipal, t.esprincipal,
                    COALESCE(t.evento,'vacio') as evento, ee.origen  ";
            $cadenaFrom
                    .= " LEFT JOIN  mod_planifproyecto.dat_hito h
                    ON(e.idelemento = h.idhito)

                    LEFT JOIN  mod_planifproyecto.dat_tarea t
                    ON(e.idelemento = t.idtarea)

                    INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
                    ON (e.idelemento = ee.idelementohijo
                    AND ee.idelementopadre = {$parametros->padre[0]->id}
                    AND ee.origen IN (0,1,2,3))  ";
            $cadebaOrderBy
                    .= " ORDER BY h.fechainicio, h.fechafin,
                    t.fechainicio, t.horainicio, t.fechafin";
        }
        if ($parametros->idEstructura != '' && $parametros->anode == '') {
            $cadenaFrom
                    .= "INNER JOIN mod_objetivos.dat_elementoestructuracrea eec
            ON (eec.idelemento = e.idelemento AND eec.idestructuracrea = $parametros->idEstructura) ";
        }
        $cadenaWhere = " WHERE ";
        if ($parametros->idproyectoParaFiltro != '') {
            $cadenaWhere .= " e.idelemento =  $parametros->idproyectoParaFiltro AND ";
        }

        $cadenaWhere
                .= " (e.idusuariocrea = {$parametros->idusuariocrea}
                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuariocrea} )) ";
        if ($parametros->arrayautores != '') {
            $cadenaWhere
                    = "WHERE e.idusuariocrea IN ({$parametros->arrayautores})";
        }
        if ($parametros->arrayinvolucrados != '') {
            $cadenaWhere
                    .= " AND e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario IN ({$parametros->arrayinvolucrados}) )";
        }


        if ($parametros->incluProyecto == 'true' && $parametros->incluPlantilla == 'false'
        ) {
            if ($parametros->padre == null) {
                $cadenaWhere .= " AND p.plantilla = 0 ";
            } else {
                //si tiene padre
                $cadenaWhere .= " AND h.plantilla = 0 OR t.plantilla = 0 ";

                if ($parametros->incluRepeticiones == 'false') {
                    $cadenaWhere .= " AND (t.tiporepeticion IS NULL ) ";
                }
            }
        } elseif ($parametros->incluPlantilla == 'true' && $parametros->incluProyecto == 'false'
        ) {
            if ($parametros->padre == null) {
                $cadenaWhere .= " AND p.plantilla = 1 ";
            } else {
                //si tiene padre
                $cadenaWhere .= " AND h.plantilla = 1 OR t.plantilla = 1 ";
                if ($parametros->incluRepeticiones == 'false') {
                    $cadenaWhere .= " AND (t.tiporepeticion IS NULL ) ";
                }
            }
        }
        if ($parametros->tipoelemento == 8) {

            if ($parametros->inProyecto == 'true' && $parametros->inPlantilla == 'false'
            ) {
                $cadenaWhere
                        .= " AND p.plantilla = 0 ";
            } elseif ($parametros->inProyecto == 'false' && $parametros->inPlantilla == 'true'
            ) {
                $cadenaWhere
                        .= " AND p.plantilla = 1 ";
            }
        }

        if ($parametros->filtros) {
            foreach ($parametros->filtros as $datos) {
                if ($datos ['field'] == 'idelemento') {
                    $cadenaWhere = $cadenaWhere . "AND e.uriidelemento LIKE '%"
                            . $datos ['data'] ['value'] . "%'";
                } elseif ($datos ['field'] == 'denominacion') {
                    $cadenaWhere = $cadenaWhere
                            . " AND upper(e.denelemento) LIKE '%"
                            . strtoupper($datos ['data'] ['value']) . "%'";
                } elseif ($datos ['field'] == 'textocumplimiento') {
                    $cadenaWhere = $cadenaWhere
                            . " AND e.estadocumplimiento = '{$datos ['data'] ['value']}'";
                } elseif ($datos ['field'] == 'gradocumplimiento') {
                    $cond = " = ";
                    if ($datos ['data']['comparison'] == 'lt') {//menor
                        $cond = "<";
                    } else {
                        if ($datos ['data']['comparison'] == 'gt'
                        ) {//mayor
                            $cond = ">";
                        }
                    }
                    $cadenaWhere = $cadenaWhere
                            . " AND e.gradocumplimiento {$cond} "
                            . ($datos ['data'] ['value'] * 1);
                } elseif ($datos ['field'] == 'observaciones') {
                    if ($datos ['data'] ['value'] == 'Si') {
                        $cadenaWhere = $cadenaWhere
                                . " AND e.cantobserv > '0' ";
                    } else {
                        $cadenaWhere = $cadenaWhere
                                . " AND e.cantobserv = '0' ";
                    }
                }
            }
        }
        $cadenaQuery = $cadenaSelect . $cadenaFrom . $cadenaWhere .
                $cadebaOrderBy;
        ///print_r($cadenaQuery); die;
        $connA = Doctrine_Manager:: connection();
        $resultado['total'] = count(
                $connA->execute($cadenaQuery)->fetchAll(PDO::FETCH_ASSOC)
        );
        if ($resultado['total'] != 0) {
            $result = $connA->execute(
                            $cadenaQuery . " LIMIT(" . $parametros->limit . ") OFFSET("
                            . $parametros->start . ")"
                    )->fetchAll(PDO::FETCH_ASSOC);
            $resultado['resultado'] = $result;
        }
        return $resultado;
    }

    public function tieneHijos($parametros) {
        $cadenaSelect
                = " SELECT e.idelemento
                FROM  mod_objetivos.dat_elementos e
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
                ON (e.idelemento = ee.idelementohijo
                AND ee.idelementopadre = {$parametros->idelementopadre}
                AND ee.origen IN (0,1,2,3))";
        $connA = Doctrine_Manager:: connection();
        $resultado['total'] = count(
                $connA->execute($cadenaSelect)->fetchAll(PDO::FETCH_ASSOC)
        );
        $result = $connA->execute($cadenaSelect)->fetchAll(PDO::FETCH_ASSOC);
        $resultado['resultado'] = $result;
        return $resultado;
    }

    public function buscarNomencladorDadoId($idelemento, $tiponomenclador) {
        $cadena
                = "SELECT * FROM  mod_objetivos.dat_elementos_nom_nomenclador elemnom
        WHERE elemnom.idelemento=" . $idelemento . "
        And elemnom.tiponomenclador=" . $tiponomenclador;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function adicionarElemento($parametros) {
        $fecha = date('d/m/Y');
        $estadocumplimiento = self::actualizarEstadoCumplimiento($parametros->porcientocump);

        $estadoInicial = self::getEstadoInicial($parametros);
        $cadenaInsert
                = "INSERT INTO mod_objetivos.dat_elementos(
		    idtipoelemento, denelemento, descelemento, idusuariocrea,
		    fechacreacion";
        $cadenaValues
                = ") VALUES ( $parametros->tipo, '$parametros->denelemento',
            '$parametros->descelemento', $parametros->idusuariocrea,'$fecha'";
        if ($parametros->porcientocump != '') {
            $cadenaInsert .= ", estadocumplimiento, gradocumplimiento";
            $cadenaValues
                    .= ",'$estadocumplimiento', $parametros->porcientocump";
        }
        if ($parametros->peso != '') {
            $cadenaInsert .= ", peso";
            $cadenaValues .= ",$parametros->peso";
        }
        if (isset($estadoInicial[0])) {
            $cadenaInsert .= ", idestadoaprob";
            $cadenaValues .= ", {$estadoInicial[0]['idestado']}";
        }
        $cadenaValues .= ") returning idelemento";
        $connA = Doctrine_Manager:: connection();
        //print_r($cadenaInsert . $cadenaValues);die;
        $res = $connA->execute($cadenaInsert . $cadenaValues);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        $connA->commit();
        $connA->beginTransaction();
        return $result;
    }

    public function getEstadoInicial($parametros) {
        $cadena
                = "SELECT DISTINCT(e.idestado)
            FROM mod_flujotrabajo.dat_estado e
            INNER JOIN mod_planifplataforma.dat_moduloestado me
            ON (me.idestado = e.idestado AND me.idmodulo = 2)
            INNER JOIN mod_flujotrabajo.conf_doc_dat_estado de
            ON de.idestado = me.idmoduloestado
            WHERE e.idautor = '$parametros->idusuariocrea'
            AND (de.inicial = 1
            AND de.idautor = '$parametros->idusuariocrea'
            AND de.idtipodoc = '$parametros->tipo') ";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $resultado = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function buscarNomencladoridGenertarProyecto($idelemento) {
        $cadena
                = "SELECT * FROM  mod_objetivos.dat_elementos_nom_nomenclador elemnom
        WHERE elemnom.idelemento=$idelemento";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function adicionarNomenclador($parametros) {
        $cadena
                = "INSERT INTO mod_objetivos.dat_elementos_nom_nomenclador(
                idelemento,idnomenclador,tiponomenclador)
                VALUES ($parametros->idElemen,$parametros->idcategoria,
                $parametros->tiponomenclador)";
        Doctrine_Manager:: connection()->execute($cadena);
        return true;
    }

    public function adicionarRecurso($parametros) {
        $cadena
                = "INSERT INTO mod_objetivos.dat_elementos_nom_nomenclador(
        idelemento, idnomenclador, tiponomenclador, cantidad)
        VALUES ($parametros->idElemen ,$parametros->idcategoria,
        $parametros->tiponomenclador, $parametros->cantidad)";
//        print_r($cadena);die('llegooo');
        Doctrine_Manager:: connection()->execute($cadena);
        return true;
    }

    public function adicionarIndicador($parametros) {
        $cadena
                = "INSERT INTO mod_objetivos.dat_elementoindicador(
        idelemento, idindicador, cantidad)
        VALUES ($parametros->idElemen, $parametros->idcategoria,
        $parametros->cantidad)";
        Doctrine_Manager:: connection()->execute($cadena);
        return true;
    }

    public function eliminarNomenclador($parametros) {
        $cadena
                = "DELETE FROM mod_objetivos.dat_elementos_nom_nomenclador n
              WHERE n.tiponomenclador = {$parametros->tiponomenclador}
              AND n.idelemento = {$parametros->idElemen} ";
        Doctrine_Manager:: connection()->execute($cadena);
        return true;
    }

    public function eliminarIndicador($parametros) {
        $cadena
                = "DELETE FROM mod_objetivos.dat_elementoindicador ei
              WHERE ei.idelemento = {$parametros->idElemen} ";
        Doctrine_Manager:: connection()->execute($cadena);
        return true;
    }

    public function buscaridNoEvaluado() {
        $cadena
                = "SELECT nom.idnomenclador FROM  mod_objetivos.nom_nomenclador nom
        WHERE nom.dennomenclador LIKE ('NE')";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function modificarNomenclador($parametros) {
        $cadena
                = "DELETE FROM mod_objetivos.dat_elementos_nom_nomenclador n
              WHERE n.tiponomenclador=" . $parametros->tiponomenclador .
                " AND n.idelemento=" . $parametros->idElemen;
        Doctrine_Manager:: connection()->execute($cadena);
        self::adicionarNomenclador($parametros);
        return true;
    }

    public function adicionarElemenElemen($parametros) {
        //print_r($parametros);die;
        if (isset($parametros->origen)) {
            $origen = $parametros->origen;
        } else {//creados por el mismo usuario
            if ($parametros->idautorpadre == $parametros->idusuariocrea) {
                if ($parametros->tipopadre == $parametros->tipo) {
                    $origen = 0; //mismo tipo
                } else {
                    $origen = 1; //diferente tipo
                }
            } else {//creados por diferentes usuarios
                if ($parametros->tipopadre == $parametros->tipo) {
                    $origen = 2; //mismo tipo
                } else {
                    $origen = 3; //diferente tipo
                }
            }
        }
        $cadenaInsert
                = "INSERT INTO mod_objetivos.dat_elementos_dat_elementos(
            idelementopadre, idelementohijo, origen, idautor)";
        $cadenaValues
                = " VALUES ($parametros->idpadre,$parametros->idElemen, $origen
             ,$parametros->idusuariocrea )";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenaInsert . $cadenaValues);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function adicionarDependencias($parametros, $relacion) {
        $cadenaInsert
                = "INSERT INTO mod_objetivos.dat_elementos_dat_elementos(
            idelementopadre, idelementohijo, origen, idautor)";
        $cadenaValues
                = " VALUES ($relacion->idactividad,$parametros->idElemen,
            $relacion->origen, $parametros->idusuariocrea )";
        //Dependencia porcentual
        if ($relacion->origen == 7) {
            if ($relacion->porcientoinicio == '') {
                $relacion->porcientoinicio = 0;
            }
            $cadenaInsert
                    = "INSERT INTO mod_objetivos.dat_elementos_dat_elementos(
            idelementopadre, idelementohijo, origen, idautor, porcientoinicio)";
            $cadenaValues
                    = " VALUES ($relacion->idactividad,$parametros->idElemen,
                $relacion->origen, $parametros->idusuariocrea,
                $relacion->porcientoinicio)";
        }
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenaInsert . $cadenaValues);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function eliminarElemento($id) {
        $cadena
                = "DELETE FROM mod_objetivos.dat_elementos e
                WHERE e.idelemento = {$id}";
        $connA = Doctrine_Manager:: connection();
        $connA->execute($cadena);
        return 1;
    }

    public function modificarElemento($parametros) {
        $estadocumplimiento = self::actualizarEstadoCumplimiento(
                        $parametros->porcientocump
        );
        $cadenaUpdate
                = "UPDATE mod_objetivos.dat_elementos
              SET  denelemento = '{$parametros->denelemento}'";
        if ($parametros->descelemento != '') {
            $cadenaUpdate
                    .= ", descelemento = '{$parametros->descelemento}' ";
        }
        if ($parametros->porcientocump != '') {
            $cadenaUpdate
                    .= ", estadocumplimiento = '{$estadocumplimiento}',
                    gradocumplimiento = {$parametros->porcientocump}";
        }
        if ($parametros->peso != '') {
            $cadenaUpdate .= ", peso = {$parametros->peso}";
        }
        $connA = Doctrine_Manager:: connection();
        $connA->execute(
                $cadenaUpdate . " WHERE idelemento = {$parametros->idelemento}"
        );
        return 1;
    }

    public function actualizarGradoCump($gradoCumpPadre, $estadoCumpPadre, $idelemen
    ) {
        $cadenaUpdate
                = "UPDATE mod_objetivos.dat_elementos
              SET estadocumplimiento = '{$estadoCumpPadre}',
            gradocumplimiento = {$gradoCumpPadre}";
        $connA = Doctrine_Manager:: connection();
        $connA->execute(
                $cadenaUpdate . " WHERE idelemento = {$idelemen}"
        );
        return 1;
    }

    public function buscarElementoPorId($idelemento) {
        $cadena
                = " SELECT e.idelemento, e.idtipoelemento, e.denelemento,
                e.descelemento, e.idusuariocrea, e.activo, e.fechacreacion,
                e.gradocumplimiento, e.peso, e.estadocumplimiento,
                e.idestadoaprob, e.gennotificacion, e.cantobserv
                 FROM  mod_objetivos.dat_elementos e
                 WHERE e.idelemento = {$idelemento}";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function existeEsteIdentificador($identificacion) {
        $cadena
                = "SELECT p.idproyecto
            FROM mod_planifproyecto.dat_proyecto p
            WHERE  p.identificador = '$identificacion'";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
        if ($result[0]['idproyecto'] != '') {
            return true;
        } else {
            return false;
        }
    }

    function actualizarEstadoCumplimiento($porciento) {
        if ($porciento <= 0) {
            $estadocumplimiento = "Sin cumplir";
        }
        if ($porciento > 0 && $porciento < 95) {
            $estadocumplimiento = "Parcialmente cumplido";
        }
        if ($porciento >= 95 && $porciento <= 100) {
            $estadocumplimiento = "Cumplida";
        }
        if ($porciento > 100) {
            $estadocumplimiento = "Sobrecumplida";
        }
        return $estadocumplimiento;
    }

    public function obtenerRepeticionesTareasPaginado($parametros) {
//cadena sql con los estados en que puedo ver el documento
        $cadenaestados = " ";
        if (isset($parametros->arrayestados[0])) {
            $cadenaestados = " AND e.idestadoaprob IN("
                    . $parametros->arrayestados . ")";
        }
        //empiezo a construir query
        $cadenaA
                = "SELECT distinct(e.idelemento ),
            t.idtarea AS identificador,e.estadocumplimiento,
            e.gradocumplimiento, e.idusuariocrea,e.idestadoaprob,
            t.fechainicio AS fechaI,t.fechafin AS fechaF,t.lugar
            FROM mod_objetivos.dat_elementos e
            INNER JOIN mod_planifproyecto.dat_tarea t
            ON e.idelemento = t.idtarea
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
            ON e.idelemento = ee.idelementohijo
            WHERE ee.origen = '4'
            AND ee.idelementopadre = '$parametros->idelementopadre' "
                . $cadenaestados;
        $connA = Doctrine_Manager:: connection();
        $resultado['total'] = count($connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC));
        $result = $connA->execute(
                        $cadenaA . " LIMIT(" . $parametros->limit . ") OFFSET("
                        . $parametros->start . ")"
                )->fetchAll(PDO::FETCH_ASSOC);
        $resultado['resultado'] = $result;
        return $resultado;
    }


    public function getHijosInmediatos($idelemento) {
        $cadenaA
            = "
            SELECT ee.idelementohijo, ee.origen, e.idelemento,e.idtipoelemento, e.denelemento
            FROM mod_objetivos.dat_elementos_dat_elementos ee
            INNER JOIN mod_objetivos.dat_elementos e
            ON(ee.idelementohijo = e.idelemento)
            WHERE ee.origen IN (0,1,2,3)
            AND ee.idelementopadre = {$idelemento} ";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getHijosInmediatosEjercicio($idelemento) {
        $cadenaA
                = "
            SELECT e.idelemento,e.idtipoelemento as tipo
            FROM mod_objetivos.dat_elementos_dat_elementos ee
            INNER JOIN mod_objetivos.dat_elementos e
            ON(ee.idelementohijo = e.idelemento)
            WHERE ee.origen IN (0,1,2,3)
            AND ee.idelementopadre = {$idelemento} ";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getPadresInmediatos($idelemento) {
        $cadenaA
                = "SELECT ee.idelementopadre, ee.origen, e.idelemento,
                      e.idtipoelemento, e.denelemento
            FROM mod_objetivos.dat_elementos_dat_elementos ee
            INNER JOIN mod_objetivos.dat_elementos e
            ON(ee.idelementopadre = e.idelemento)
            WHERE ee.origen IN (0,1,2,3)
            AND ee.idelementohijo = {$idelemento}";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getDependenciasAnteriores($idelemento) {
        $cadenaA
                = "SELECT ee.idelementopadre, e.denelemento, e.gradocumplimiento
                FROM mod_objetivos.dat_elementos_dat_elementos ee
                INNER JOIN mod_objetivos.dat_elementos e
                ON(ee.idelementopadre = e.idelemento)
                WHERE ee.origen IN (6,7)
                AND ee.idelementohijo = {$idelemento}";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getDatosTarea($idelemento) {
        $cadenaA
                = "  SELECT t.duracionestimada, t.fechainicio, t.fechafin,
                t.horainicio, t.horafin ,e.gradocumplimiento, t.unidadmedida, e.denelemento,
                t.valorreal,t.valormeta,t.costo, t.tiempomedio, tiempopesimista, t.plantilla,
                t.fechainicio || ' ' ||t.horainicio as fh_i, t.duracionestimada, t.tiempooptimista, e.idelemento,
                t.fechafin || ' ' ||t.horafin as fh_f, t.fechacumplimiento || ' ' ||t.horacumplimiento as fh_c
                FROM mod_planifproyecto.dat_tarea t
                 INNER JOIN mod_objetivos.dat_elementos e
                ON(t.idtarea=e.idelemento)
                WHERE idtarea = $idelemento
                
                 ";


        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

  public function getDatosHito($idelemento) {
    $cadenaA
      = "  SELECT t.duracionestimada, t.fechainicio, t.fechafin,
                 e.gradocumplimiento, e.denelemento, t.plantilla, e.idelemento
                FROM mod_planifproyecto.dat_hito t
                 INNER JOIN mod_objetivos.dat_elementos e
                ON(t.idhito=e.idelemento)
                WHERE idhito = $idelemento";

    $connA = Doctrine_Manager:: connection();
    $result = $connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  public function getDatosProyecto($idelemento) {
    $cadenaA
      = "  SELECT t.duracionestimada, t.fechainicio, t.fechafin,
                 e.gradocumplimiento, e.denelemento, t.plantilla, e.idelemento
                FROM mod_planifproyecto.dat_proyecto t
                 INNER JOIN mod_objetivos.dat_elementos e
                ON(t.idproyecto=e.idelemento)
                WHERE idproyecto = $idelemento";

    $connA = Doctrine_Manager:: connection();
    $result = $connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }


    public function getDatosTareaCumplidasFueraRango($idelemento) {
        $cadenaA
                = "  SELECT t.duracionestimada, t.fechainicio, t.fechafin,
                t.horainicio, t.horafin ,e.gradocumplimiento, t.unidadmedida,
                t.valorreal,t.valormeta,t.costo,
                t.fechainicio || ' ' ||t.horainicio as fh_i,
                t.fechafin || ' ' ||t.horafin as fh_f, t.fechacumplimiento || ' ' ||t.horacumplimiento as fh_c
                FROM mod_planifproyecto.dat_tarea t
                 INNER JOIN mod_objetivos.dat_elementos e
                ON(t.idtarea=e.idelemento)
                WHERE idtarea = $idelemento  AND fechacumplimiento is not NULL AND t.fechacumplimiento > t.fechafin ";

        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function devolverFechasTareas($arrayIdTareas) {

        $cadenaA = "SELECT DISTINCT
                        dat_tarea.fechainicio,
                        dat_tarea.fechafin
                    FROM
                        mod_objetivos.dat_elementos,
                        mod_planifproyecto.dat_tarea
                    WHERE
                        dat_tarea.idtarea = dat_elementos.idelemento
                    and dat_tarea.fechainicio IS NOT NULL
                    and dat_tarea.fechafin IS NOT NULL
                    and dat_tarea.idtarea IN({$arrayIdTareas})
                    order by
                        dat_tarea.fechainicio,dat_tarea.fechafin";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getCantidadTareasXDias($arrayIdTareas, $dia) {
        $cadenaA = "SELECT Count(dat_tarea.idtarea)as cantidad
                    FROM
                      mod_objetivos.dat_elementos,
                      mod_planifproyecto.dat_tarea
                    WHERE
                       dat_tarea.idtarea = dat_elementos.idelemento
                    and dat_tarea.fechainicio IS NOT NULL
                    and dat_tarea.fechafin IS NOT NULL
                    and dat_tarea.idtarea IN({$arrayIdTareas})
                    AND (dat_tarea.fechainicio <= '{$dia}' AND dat_tarea.fechafin >='{$dia}')";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getCantidadTareasXDiasDenominacion($arrayIdTareas, $dia) {
        $cadenaB = "SELECT dat_elementos.denelemento, dat_elementos.gradocumplimiento
                    FROM
                      mod_objetivos.dat_elementos,
                      mod_planifproyecto.dat_tarea
                    WHERE
                       dat_tarea.idtarea = dat_elementos.idelemento
                    and dat_tarea.fechainicio IS NOT NULL
                    and dat_tarea.fechafin IS NOT NULL
                    and dat_tarea.idtarea IN({$arrayIdTareas})
                    AND (dat_tarea.fechainicio <= '{$dia}' AND dat_tarea.fechafin >='{$dia}')";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaB)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getDatosTareaEjercicio($idelemento) {
        $cadenaA
                = "  SELECT t.fechainicio, t.fechafin,
                t.horainicio, t.horafin, e.cantrelacdescorigen0 as hoja
                FROM mod_planifproyecto.dat_tarea t
                INNER JOIN mod_objetivos.dat_elementos e
                ON(t.idtarea=e.idelemento)
                WHERE idtarea = $idelemento";

        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getdependenciaSuperiores($idelemento) {
        $cadenaA
                = "SELECT ee.idelementopadre,ee.origen
            FROM mod_objetivos.dat_elementos_dat_elementos ee
            WHERE ee.origen >= 6 AND ee.idelementohijo ={$idelemento}";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getdependenciaSuperioresSoloId($idelemento) {
        $cadenaA
                = "SELECT ee.idelementopadre
            FROM mod_objetivos.dat_elementos_dat_elementos ee
            WHERE ee.origen >= 6 AND ee.idelementohijo ={$idelemento}";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaA)->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    public function buscarpadreorigen($idtareadepende) {
        $cadenaA
                = "SELECT t.idtarea
            FROM mod_planifproyecto.dat_tarea t
            WHERE t.idtareadepende ={$idtareadepende}";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function insertarDependencia($idtarea, $idpadre, $origen, $idusuariocrea
    ) {
        $cadenaInsert
                = "INSERT INTO mod_objetivos.dat_elementos_dat_elementos(
            idelementopadre, idelementohijo, origen, idautor)";
        $cadenaValues
                = " VALUES ($idpadre,$idtarea, $origen
             ,$idusuariocrea )";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenaInsert . $cadenaValues);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getInvolMatriz($arrayIdTareas) {
        $cadenaA
                = "SELECT DISTINCT(i.idusuario), ei.idinvolucrado
        FROM mod_objetivos.dat_elementos_dat_involucrados ei
        INNER JOIN mod_objetivos.dat_involucrados i
        ON (ei.idinvolucrado = i.idinvolucrado)
        WHERE ei.idelemento IN ($arrayIdTareas) ";
        $connA = Doctrine_Manager:: connection();
//        print_r($cadenaA);die;
        $result = $connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getRecursoTarea($idTarea) {
        $cadenaA
                = "SELECT  i.idindicador AS idnomenclador, i.denominacion,
        (ip.precio * ei.cantidad) AS valor,
        (ip.preciodivisa * ei.cantidad) AS valor1, ei.cantidad,
        um.abreviaturaunidadmedida AS um
        FROM mod_datosmaestros.nom_indicador i
        INNER JOIN mod_objetivos.dat_elementoindicador ei
        ON(i.idindicador = ei.idindicador)
        INNER JOIN mod_datosmaestros.nom_indicadorplanif ip
        ON(i.idindicador = ip.idindicador)
        INNER JOIN mod_datosmaestros.nom_unidadmedida um
        ON(i.idumedida = um.idunidadmedida)
        WHERE ei.idelemento = {$idTarea}
        UNION
        SELECT n.idnomenclador, n.dennomenclador AS denominacion,
        0 AS valor, 0 AS valor1, en.cantidad, um.abreviaturaunidadmedida AS um
        FROM mod_objetivos.dat_elementos_nom_nomenclador en
        INNER JOIN mod_objetivos.nom_nomenclador n
        ON(en.idnomenclador = n.idnomenclador)
        LEFT JOIN mod_objetivos.dat_nomencladorunidadmedida num
        ON(en.idnomenclador = num.idnomenclador)
        LEFT JOIN mod_datosmaestros.nom_unidadmedida um
        ON(num.idunidadmedida = um.idunidadmedida)
        WHERE en.idelemento = {$idTarea}
        AND en.tiponomenclador = 5 ";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getIdPadre($id) {
        $cadena
                = "SELECT ee.idelementopadre, e.idtipoelemento
              FROM mod_objetivos.dat_elementos_dat_elementos ee
              INNER JOIN mod_objetivos.dat_elementos e
              ON (ee.idelementopadre = e.idelemento)
              WHERE ee.origen IN (0,1,2,3)
              AND ee.idelementohijo = {$id}";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result[0];
    }

    public function getPadres($idhijo, $comparacion, $origen) {
        $cadena
                = "SELECT ee.idelementopadre, ee.idelementohijo,
              e.idtipoelemento AS tipopadre
              FROM mod_objetivos.dat_elementos_dat_elementos ee
              INNER JOIN mod_objetivos.dat_elementos e
              ON (ee.idelementopadre = e.idelemento)
              WHERE ee.origen {$comparacion} {$origen}
              AND ee.idelementohijo = {$idhijo}";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result[0];
    }

    public function returnIdNomenclador($idelemento, $tipoNomenclador) {
        $cadena
                = "SELECT n.idnomenclador
                FROM mod_objetivos.dat_elementos_nom_nomenclador n
                WHERE n.idelemento = {$idelemento}
                AND n.tiponomenclador = {$tipoNomenclador}";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result[0]['idnomenclador'];
    }

    public function obtenerTareasParaChequear($parametros) {
        $cadenaSelect
                = "  SELECT e.idelemento, e.idtipoelemento, e.denelemento,
                e.idusuariocrea, e.activo, e.fechacreacion,
                e.gradocumplimiento, e.estadocumplimiento,
                es.denominacion AS denoestado, e.idestadoaprob,
                t.plantilla, t.duracionreal, t.duracionestimada,
                t.fechafin, t.fechainicio, t.horainicio, t.horafin
                FROM  mod_objetivos.dat_elementos e
                LEFT JOIN  mod_flujotrabajo.dat_estado es
                ON(e.idestadoaprob = es.idestado)
                INNER JOIN  mod_planifproyecto.dat_tarea t
                ON(e.idelemento = t.idtarea)
                WHERE t.plantilla = 0
                AND e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuariosession})
                AND e.gradocumplimiento < 100
                ORDER BY
                t.fechainicio, t.horainicio, t.fechafin";
        $conn = Doctrine_Manager:: connection();
        $resultado['total'] = count(
                $conn->execute($cadenaSelect)->fetchAll(PDO::FETCH_ASSOC)
        );
        $cadenaSelect .= " LIMIT({$parametros->limit}) OFFSET({$parametros->start}) ";
        $resultado['resultado'] = $conn->execute($cadenaSelect)->fetchAll(
                PDO::FETCH_ASSOC
        );
        return $resultado;
    }

    public function obtenerPlanesParaFiltro($parametros) {
        
        $cadenaSoloProyectos = " ";
        if($parametros->soloProyectos){
            $cadenaSoloProyectos = " and p.plantilla = 0 ";
        }

        $cadenaQuery = " SELECT e.idelemento, e.idtipoelemento, e.denelemento,
                e.descelemento, e.idusuariocrea, e.activo, e.fechacreacion,
                e.gradocumplimiento, e.peso, e.estadocumplimiento,
                es.denominacion AS denoestado, e.idestadoaprob,
                e.gennotificacion, e.cantobserv ,p.plantilla, p.duracionreal, p.duracionestimada,
                p.fechafin, p.fechainicio, p.identificador, p.idprioridad  

          FROM  mod_objetivos.dat_elementos e
                
              LEFT JOIN  mod_flujotrabajo.dat_estado es
                   ON(e.idestadoaprob = es.idestado)  
                
                INNER JOIN  mod_planifproyecto.dat_proyecto p
                   ON(e.idelemento = p.idproyecto $cadenaSoloProyectos )  

                  INNER JOIN mod_objetivos.dat_elementoestructuracrea eec
                     ON (eec.idelemento = e.idelemento AND eec.idestructuracrea = $parametros->idEstructura) 

                    WHERE (e.idusuariocrea = $parametros->idusuariocrea OR e.idelemento IN 
                    (SELECT ei.idelemento
                         FROM mod_objetivos.dat_elementos_dat_involucrados ei
                             LEFT JOIN mod_objetivos.dat_involucrados i
                              ON (ei.idinvolucrado = i.idinvolucrado)
                                  WHERE i.idusuario = $parametros->idusuariocrea ))

                            ORDER BY p.fechainicio";

        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaQuery)->fetchAll(PDO::FETCH_ASSOC);
        $resultado['resultado'] = $result;

        return $resultado;
    }

    public function obtenerHitosParaFiltro($parametros) {

        $cadenaQuery = " SELECT e.idelemento, upper(e.denelemento) as denelemento, e.idtipoelemento as tipoelemento,
                                e.idusuariocrea as idautor

              FROM  mod_objetivos.dat_elementos e
              
                 LEFT JOIN  mod_planifproyecto.dat_hito h
                    ON(e.idelemento = h.idhito)

                    INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
                       ON (e.idelemento = ee.idelementohijo AND ee.idelementopadre = $parametros->idelementopadre AND ee.origen IN (0,1,2,3))   

                         WHERE e.idtipoelemento = 9 and (e.idusuariocrea = $parametros->idusuariocrea
                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = $parametros->idusuariocrea ))  

                ORDER BY h.fechainicio, h.fechafin";

        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaQuery)->fetchAll(PDO::FETCH_ASSOC);
        $resultado['resultado'] = $result;

        return $resultado;
    }

    public function obtenerHitosTareasDadoProyecto($idelemento) {

        $cadenaQuery = " SELECT e.idelemento, e.denelemento
            
                                    FROM mod_objetivos.dat_elementos e
                                    
                                        INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee1
                                           ON e.idelemento = ee1.idelementohijo

                                             inner JOIN mod_objetivos.dat_elementos e1
                                                    ON (e1.idelemento = ee1.idelementopadre)

                                                    left JOIN mod_objetivos.dat_elementos_dat_elementos ee2
                                                    ON e1.idelemento = ee2.idelementohijo


                                                    left JOIN mod_objetivos.dat_elementos e2
                                                    ON (e2.idelemento = ee2.idelementopadre)

                                                    WHERE (e2.idelemento = $idelemento or e1.idelemento = $idelemento)
                                                    AND (e.idtipoelemento = 9 or e.idtipoelemento = 10) ";
        //print_r($cadenaQuery);die;
        $connA = Doctrine_Manager:: connection();
        $resultado = $connA->execute($cadenaQuery)->fetchAll(PDO::FETCH_ASSOC);

        return $resultado;
    }

    public function obtenerTareasDadoProyecto($parametros) {

        $cadenaWhere = " ";
        if ($parametros->filtros) {
            foreach ($parametros->filtros as $datos) {
                if ($datos ['field'] == 'idelemento') {
                    $cadenaWhere = $cadenaWhere . " AND e.uriidelemento LIKE '%" . $datos ['data'] ['value'] . "%'";
                } elseif ($datos ['field'] == 'denominacion') {
                    $cadenaWhere = $cadenaWhere . " AND upper(e.denelemento) LIKE '%" . strtoupper($datos ['data'] ['value']) . "%'";
                } elseif ($datos ['field'] == 'unidadmedida') {
                    $cadenaWhere = $cadenaWhere . " AND upper(t.unidadmedida) LIKE '%" . strtoupper($datos ['data'] ['value']) . "%'";
                } elseif ($datos ['field'] == 'valorreal') {
                    $cond = " = ";
                    if ($datos ['data']['comparison'] == 'lt') {//menor
                        $cond = "<";
                    } else {
                        if ($datos ['data']['comparison'] == 'gt') {//mayor
                            $cond = ">";
                        }
                    }
                    $cadenaWhere = $cadenaWhere . " AND t.valorreal {$cond} " . ($datos ['data'] ['value'] * 1);
                } elseif ($datos ['field'] == 'valormeta') {
                    $cond = " = ";
                    if ($datos ['data']['comparison'] == 'lt') {//menor
                        $cond = "<";
                    } else {
                        if ($datos ['data']['comparison'] == 'gt') {//mayor
                            $cond = ">";
                        }
                    }
                    $cadenaWhere = $cadenaWhere . " AND t.valormeta {$cond} " . ($datos ['data'] ['value'] * 1);
                } elseif ($datos ['field'] == 'costo') {
                    $cond = " = ";
                    if ($datos ['data']['comparison'] == 'lt') {//menor
                        $cond = "<";
                    } else {
                        if ($datos ['data']['comparison'] == 'gt') {//mayor
                            $cond = ">";
                        }
                    }
                    $cadenaWhere = $cadenaWhere . " AND t.costo {$cond} " . ($datos ['data'] ['value'] * 1);
                }
            }
        }
        if($parametros->idtarea){
            $cadenaWhere = $cadenaWhere . " AND e.idelemento NOT IN ({$parametros->idtarea}) ";
        }

        $cadenaQuery = " SELECT  e.idelemento, e.denelemento as denominacion, count(*) OVER() as total,
                                        t.unidadmedida, t.valorreal, t.valormeta, t.costo, t.clave, t.dependencias,
                                        t.fechainicio, t.horainicio, t.fechafin
            
                                    FROM mod_objetivos.dat_elementos e
                                    
                                      INNER JOIN mod_planifproyecto.dat_tarea t
                                           ON e.idelemento = t.idtarea   
                                           
                                         INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee1
                                           ON (e.idelemento = ee1.idelementohijo AND ee1.origen = 1)
                                           
                                             INNER JOIN mod_objetivos.dat_elementos e1
                                                  ON (e1.idelemento = ee1.idelementopadre)
                                                  
                                               LEFT JOIN mod_objetivos.dat_elementos_dat_elementos ee2
                                                    ON e1.idelemento = ee2.idelementohijo
                                                    
                                                  LEFT JOIN mod_objetivos.dat_elementos e2
                                                      ON (e2.idelemento = ee2.idelementopadre)

                                                    WHERE (e2.idelemento = $parametros->idproyecto or e1.idelemento = $parametros->idproyecto)
                                                      AND e.idtipoelemento = 10  " . $cadenaWhere . " 
                                                       ORDER BY t.fechainicio, t.horainicio, t.fechafin
                                                        LIMIT(" . $parametros->limit . ") OFFSET(" . $parametros->start . ")";
        //print_r($cadenaQuery);die;
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaQuery)->fetchAll(PDO::FETCH_ASSOC);
        $resultado['resultado'] = $result;
        if (isset($resultado['resultado'])) {
            $resultado['total'] = $result[0]['total'];
        }
        return $resultado;
    }

    public function realPorFechaEjecutado($parametros) {

        $cadenaWhere = " ";
        if ($parametros->filtros) {
            foreach ($parametros->filtros as $datos) {
                if ($datos ['field'] == 'cantidad') {
                    $cond = " = ";
                    if ($datos ['data']['comparison'] == 'lt') {//menor
                        $cond = "<";
                    } else {
                        if ($datos ['data']['comparison'] == 'gt') {//mayor
                            $cond = ">";
                        }
                    }
                    $cadenaWhere = $cadenaWhere . " AND et.cantidad {$cond} " . ($datos ['data'] ['value'] * 1);
                } elseif ($datos ['field'] == 'fecha') {
                    $filtrofechas = 1;
                    $cond = " = ";
                    if ($datos ['data']['comparison'] == 'lt') {//antes
                        $cond = "<";
                    } else {
                        if ($datos ['data']['comparison'] == 'gt'
                        ) {//despues
                            $cond = ">";
                        }
                    }
                    //esto es necesario debido a que interpreta
                    //la fecha como un entero
                    $arrayfechainicio = explode(' ', $datos ['data'] ['value']);
                    $fechainicio = explode('-', $arrayfechainicio[0]);
                    $cadenaWhere = $cadenaWhere . " AND et.fecha {$cond} '" . $fechainicio[0] . '-' . $fechainicio[1] . '-' . $fechainicio[2] . "'";
                }
            }
        }

        $cadenaQuery = " SELECT  et.idtarea, et.fecha, et.cantidad, count(*) OVER() as total            
                                    FROM mod_planifproyecto.dat_controlejecuciontarea et                                    
                                        WHERE et.idtarea = $parametros->idtarea " . $cadenaWhere . " 
                                           ORDER BY et.fecha
                                             LIMIT(" . $parametros->limit . ") OFFSET(" . $parametros->start . ")";
        //print_r($cadenaQuery);die;
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaQuery)->fetchAll(PDO::FETCH_ASSOC);
        $resultado['resultado'] = $result;
        if (isset($resultado['resultado'])) {
            $resultado['total'] = $result[0]['total'];
        }
        return $resultado;
    }

    public function EliminarElemenElemen($parametros) {
        $consulta
                = "DELETE FROM mod_objetivos.dat_elementos_dat_elementos ee
		WHERE ee.idelementopadre = '$parametros->idexpadre' AND 
                ee.idelementohijo = '$parametros->idElemen'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($consulta);
        /* $result = */
        $res->fetchAll();
        return 1;
    }

    public function existeEjecutado($ejecutado) {
        $cadena = "SELECT et.* FROM mod_planifproyecto.dat_controlejecuciontarea et
                            WHERE et.idtarea = {$ejecutado->idtarea} AND et.fecha = '{$ejecutado->fecha}' ";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function eliminarEjecutado($ejecutado) {
        $cadena = "DELETE FROM mod_planifproyecto.dat_controlejecuciontarea et
                       WHERE et.idtarea = {$ejecutado->idtarea} AND et.fecha = '{$ejecutado->fecha}' ";
        Doctrine_Manager:: connection()->execute($cadena);
        //return true;
    }

    public function adicionarEjecutado($ejecutado) {
        $cadena = "INSERT INTO mod_planifproyecto.dat_controlejecuciontarea( idtarea, fecha, cantidad)
                VALUES ($ejecutado->idtarea, '{$ejecutado->fecha}', $ejecutado->cantidad)";
        Doctrine_Manager:: connection()->execute($cadena);
        //return true;
    }

    public function actualizarEjecutado($ejecutado) {
        $cadena = "UPDATE mod_planifproyecto.dat_controlejecuciontarea
                             SET cantidad = {$ejecutado->cantidad}
                               WHERE idtarea = {$ejecutado->idtarea} AND fecha = '{$ejecutado->fecha}' ";
        $connA = Doctrine_Manager:: connection();
        $connA->execute($cadena);
        //return 1;
    }

    public function obtenerHitosTareasGanttDadoProyecto($parametros) {
        
        $cadenaWhere = " ";
        if ($parametros->denominacion) {
            $cadenaWhere = " AND upper(e.denelemento) LIKE '%" . strtoupper($parametros->denominacion) . "%' ";
        }

        $cadenaQuery = " SELECT e.idtipoelemento, e.idelemento, e.denelemento, e.gradocumplimiento,
                                e1.idelemento as parent, e1.denelemento as name_parent,
                                coalesce (tt.fechainicio,tt1.fechainicio) as fechainicio,
                                coalesce (tt.fechafin,tt1.fechafin) as fechafin,
                                coalesce (tt.duracionestimada,tt1.duracionestimada) as duracionestimada
            
                                   FROM mod_objetivos.dat_elementos e
                                    
                                        INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee1
                                           ON e.idelemento = ee1.idelementohijo

                                             inner JOIN mod_objetivos.dat_elementos e1
                                                ON (e1.idelemento = ee1.idelementopadre)

                                                 left JOIN mod_objetivos.dat_elementos_dat_elementos ee2
                                                    ON e1.idelemento = ee2.idelementohijo

                                                      left JOIN mod_objetivos.dat_elementos e2
                                                       ON (e2.idelemento = ee2.idelementopadre)                                                    
                                                    
                                                        left join mod_planifproyecto.dat_tarea tt
                                                         on (tt.idtarea = e.idelemento)
                                                    
                                                             left join mod_planifproyecto.dat_hito tt1
                                                                on (tt1.idhito = e.idelemento)

                                                    WHERE (e2.idelemento = $parametros->idproyecto or e1.idelemento = $parametros->idproyecto)
                                                    AND (e.idtipoelemento = 9 or e.idtipoelemento = 10) " . $cadenaWhere;

        $cadenaQuery .= " and ((coalesce (tt.fechainicio,tt1.fechainicio) >= '$parametros->fechainicio' and coalesce (tt.fechainicio,tt1.fechainicio) <= '$parametros->fechafin') OR 
                                   (coalesce (tt.fechafin,tt1.fechafin) >= '$parametros->fechainicio' and coalesce (tt.fechafin,tt1.fechafin) <= '$parametros->fechafin') OR 
                                   (coalesce (tt.fechainicio,tt1.fechainicio) <= '$parametros->fechainicio' and coalesce (tt.fechafin,tt1.fechafin) >= '$parametros->fechafin'))  ";

        //print_r($cadenaQuery);die;
        $connA = Doctrine_Manager:: connection();
        $resultado = $connA->execute($cadenaQuery)->fetchAll(PDO::FETCH_ASSOC);

        return $resultado;
    }
    
    public function obtenerDependenciasTareasGantt($parametros) {

        $cadenaQuery = " SELECT  ee.idelementopadre, 
                             ee.idelementohijo, ee.origen, 3 as type
                                      FROM mod_objetivos.dat_elementos_dat_elementos ee 
                                             WHERE ee.origen > 5
                                             
                                 and ( (ee.idelementohijo in (SELECT e.idelemento
                                    FROM mod_objetivos.dat_elementos e
                                    
                                        INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee1
                                           ON e.idelemento = ee1.idelementohijo

                                             inner JOIN mod_objetivos.dat_elementos e1
                                                    ON (e1.idelemento = ee1.idelementopadre)

                                                    left JOIN mod_objetivos.dat_elementos_dat_elementos ee2
                                                    ON e1.idelemento = ee2.idelementohijo

                                                    left JOIN mod_objetivos.dat_elementos e2
                                                    ON (e2.idelemento = ee2.idelementopadre)
                                                    
                                                    
                                                    left join mod_planifproyecto.dat_tarea tt
                                                    on (tt.idtarea = e.idelemento)
                                                    
                                                    left join mod_planifproyecto.dat_hito tt1
                                                    on (tt1.idhito = e.idelemento)

                                                    WHERE (e2.idelemento = $parametros->idproyecto or e1.idelemento = $parametros->idproyecto)
                                                    AND (--e.idtipoelemento = 9 or 
                                                    e.idtipoelemento = 10) 
                                                   )) 
                         or (ee.idelementopadre in (SELECT e.idelemento
                                    FROM mod_objetivos.dat_elementos e
                                    
                                        INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee1
                                           ON e.idelemento = ee1.idelementohijo

                                             inner JOIN mod_objetivos.dat_elementos e1
                                                    ON (e1.idelemento = ee1.idelementopadre)

                                                    left JOIN mod_objetivos.dat_elementos_dat_elementos ee2
                                                    ON e1.idelemento = ee2.idelementohijo


                                                    left JOIN mod_objetivos.dat_elementos e2
                                                    ON (e2.idelemento = ee2.idelementopadre)
                                                    
                                                    
                                                    left join mod_planifproyecto.dat_tarea tt
                                                    on (tt.idtarea = e.idelemento)
                                                    
                                                    left join mod_planifproyecto.dat_hito tt1
                                                    on (tt1.idhito = e.idelemento)

                                                    WHERE (e2.idelemento = $parametros->idproyecto or e1.idelemento = $parametros->idproyecto)
                                                    AND (--e.idtipoelemento = 9 or 
                                                    e.idtipoelemento = 10) 
                                                   ))
                                             ) " . $cadenaWhere;

        /*$cadenaQuery .= " and ((coalesce (tt.fechainicio,tt1.fechainicio) >= '$parametros->fechainicio' and coalesce (tt.fechainicio,tt1.fechainicio) <= '$parametros->fechafin') OR 
                                   (coalesce (tt.fechafin,tt1.fechafin) >= '$parametros->fechainicio' and coalesce (tt.fechafin,tt1.fechafin) <= '$parametros->fechafin') OR 
                                   (coalesce (tt.fechainicio,tt1.fechainicio) <= '$parametros->fechainicio' and coalesce (tt.fechafin,tt1.fechafin) >= '$parametros->fechafin'))  ";*/

        //print_r($cadenaQuery);die;
        $connA = Doctrine_Manager:: connection();
        $resultado = $connA->execute($cadenaQuery)->fetchAll(PDO::FETCH_ASSOC);

        return $resultado;
    }
    public function obtenerTareasCalendarioDadaEstructura($parametros) {

        $cadenaQuery = "  SELECT  e.idelemento,case when e2.idelemento is null then null else e1.idelemento end as idhito,
                                    case when e2.idelemento is null then '-' else e1.denelemento end as denomhito,
                                    coalesce (e2.idelemento,e1.idelemento) as idproyecto,
                                    coalesce (e2.denelemento,e1.denelemento) as denomproyecto,
                                     e.idtipoelemento, e.denelemento,
                                                  e.descelemento, e.idusuariocrea,  e.gradocumplimiento,
                                                  t.fechafin, t.fechainicio, t.horafin, t.horainicio

                                                        FROM mod_objetivos.dat_elementos e

                                                        INNER JOIN mod_planifproyecto.dat_tarea t
                                                          ON(e.idelemento = t.idtarea)

                                                        INNER JOIN  mod_objetivos.dat_elementoestructuracrea eec
                                                          ON(e.idelemento = eec.idelemento)

                                                        INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee1
                                                          ON e.idelemento = ee1.idelementohijo

                                                        inner JOIN mod_objetivos.dat_elementos e1
                                                        ON (e1.idelemento = ee1.idelementopadre)

                                                        left JOIN mod_objetivos.dat_elementos_dat_elementos ee2
                                                        ON e1.idelemento = ee2.idelementohijo

                                                        left JOIN mod_objetivos.dat_elementos e2
                                                        ON (e2.idelemento = ee2.idelementopadre)

                                                        WHERE
                                                           eec.idestructuracrea = $parametros->idEstructura and e.idtipoelemento = 10 ";

        if (isset($parametros->arrayautores[0]) && $parametros->arrayautores != '') {
            $cadenaQuery .= " and e.idusuariocrea IN ({$parametros->arrayautores})";
        } else if (isset($parametros->arrayinvolucrados[0]) && $parametros->arrayinvolucrados != '') {
            $cadenaQuery
                .= " and e.idelemento IN (SELECT ei.idelemento
                            FROM mod_objetivos.dat_elementos_dat_involucrados ei
                             LEFT JOIN mod_objetivos.dat_involucrados i
                               ON (ei.idinvolucrado = i.idinvolucrado)
                                  WHERE i.idusuario IN ({$parametros->arrayinvolucrados}))";
        } else {
            $cadenaQuery .= " and  (e.idusuariocrea = $parametros->idusuariosession 
                                  OR e.idelemento IN (SELECT ei.idelemento
                                                        FROM mod_objetivos.dat_elementos_dat_involucrados ei
                                                         LEFT JOIN mod_objetivos.dat_involucrados i
                                                           ON (ei.idinvolucrado = i.idinvolucrado)
                                                              WHERE i.idusuario = $parametros->idusuariosession )) ";
        }

        $cadenaQuery .= " and ((t.fechainicio >= '$parametros->fechainicio' and t.fechainicio <= '$parametros->fechafin') OR 
                                   (t.fechafin >= '$parametros->fechainicio' and t.fechafin <= '$parametros->fechafin') OR 
                                   (t.fechainicio <= '$parametros->fechainicio' and t.fechafin >= '$parametros->fechafin')) 

                                                            ORDER BY t.fechainicio, t.horainicio, t.fechafin ";
        //print_r($cadenaQuery);die;
        $connA = Doctrine_Manager:: connection();
        $resultado = $connA->execute($cadenaQuery)->fetchAll(PDO::FETCH_ASSOC);

        return $resultado;
    }

    public function obtenerTareasCalendarioDadoProyecto($parametros) {

        $cadenaQuery = " SELECT e.idelemento,case when e2.idelemento is null then null else e1.idelemento end as idhito,
                                case when e2.idelemento is null then '' else e1.denelemento end as denomhito,
                                coalesce (e2.idelemento,e1.idelemento) as idproyecto,
                                coalesce (e2.denelemento,e1.denelemento) as denomproyecto,
                                 e.idtipoelemento, e.denelemento,
                                              e.descelemento, e.idusuariocrea,  e.gradocumplimiento,
                                              t.fechafin, t.fechainicio, t.horafin, t.horainicio

                                                    FROM mod_objetivos.dat_elementos e

                                                    INNER JOIN mod_planifproyecto.dat_tarea t
                                                    ON(e.idelemento = t.idtarea)

                                                    INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee1
                                                    ON e.idelemento = ee1.idelementohijo


                                                    inner JOIN mod_objetivos.dat_elementos e1
                                                    ON (e1.idelemento = ee1.idelementopadre)

                                                    left JOIN mod_objetivos.dat_elementos_dat_elementos ee2
                                                    ON e1.idelemento = ee2.idelementohijo


                                                    left JOIN mod_objetivos.dat_elementos e2
                                                    ON (e2.idelemento = ee2.idelementopadre)

                                                    WHERE (e2.idelemento = $parametros->idproyecto or e1.idelemento = $parametros->idproyecto)
                                                    and e.idtipoelemento = 10 ";

        if (isset($parametros->arrayautores[0]) && $parametros->arrayautores != '') {
            $cadenaQuery .= " and e.idusuariocrea IN ({$parametros->arrayautores})";
        } else if (isset($parametros->arrayinvolucrados[0]) && $parametros->arrayinvolucrados != '') {
            $cadenaQuery
                .= " and e.idelemento IN (SELECT ei.idelemento
                            FROM mod_objetivos.dat_elementos_dat_involucrados ei
                             LEFT JOIN mod_objetivos.dat_involucrados i
                               ON (ei.idinvolucrado = i.idinvolucrado)
                                  WHERE i.idusuario IN ({$parametros->arrayinvolucrados}))";
        } else {
            $cadenaQuery .= " and  (e.idusuariocrea = $parametros->idusuariosession 
                                  OR e.idelemento IN (SELECT ei.idelemento
                                                        FROM mod_objetivos.dat_elementos_dat_involucrados ei
                                                         LEFT JOIN mod_objetivos.dat_involucrados i
                                                           ON (ei.idinvolucrado = i.idinvolucrado)
                                                              WHERE i.idusuario = $parametros->idusuariosession )) ";
        }

        $cadenaQuery .= " and ((t.fechainicio >= '$parametros->fechainicio' and t.fechainicio <= '$parametros->fechafin') OR 
                                   (t.fechafin >= '$parametros->fechainicio' and t.fechafin <= '$parametros->fechafin') OR 
                                   (t.fechainicio <= '$parametros->fechainicio' and t.fechafin >= '$parametros->fechafin')) 

                                                            ORDER BY t.fechainicio, t.horainicio, t.fechafin ";
        //print_r($cadenaQuery);die;
        $connA = Doctrine_Manager:: connection();
        $resultado = $connA->execute($cadenaQuery)->fetchAll(PDO::FETCH_ASSOC);

        return $resultado;
    }

    public function obtenerTareasCalendarioDadoHito($parametros) {

        $cadenaQuery = " SELECT   e.idelemento, e.idtipoelemento, e.denelemento,
              e.descelemento, e.idusuariocrea,  e.gradocumplimiento, 
              t.fechafin, t.fechainicio, t.horafin, t.horainicio 

                FROM  mod_objetivos.dat_elementos e 

                   INNER JOIN  mod_planifproyecto.dat_tarea t
                    ON(e.idelemento = t.idtarea)

                    INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
                    ON (e.idelemento = ee.idelementohijo
                    AND ee.idelementopadre = $parametros->idhito
                    AND ee.origen IN (0,1,2,3))   

                    WHERE  e.idtipoelemento = 10 ";

        if (isset($parametros->arrayautores[0]) && $parametros->arrayautores != '') {
            $cadenaQuery .= " and e.idusuariocrea IN ({$parametros->arrayautores})";
        } else if (isset($parametros->arrayinvolucrados[0]) && $parametros->arrayinvolucrados != '') {
            $cadenaQuery
                .= " and e.idelemento IN (SELECT ei.idelemento
                            FROM mod_objetivos.dat_elementos_dat_involucrados ei
                             LEFT JOIN mod_objetivos.dat_involucrados i
                               ON (ei.idinvolucrado = i.idinvolucrado)
                                  WHERE i.idusuario IN ({$parametros->arrayinvolucrados}))";
        } else {
            $cadenaQuery .= " and  (e.idusuariocrea = $parametros->idusuariosession 
                                  OR e.idelemento IN (SELECT ei.idelemento
                                                        FROM mod_objetivos.dat_elementos_dat_involucrados ei
                                                         LEFT JOIN mod_objetivos.dat_involucrados i
                                                           ON (ei.idinvolucrado = i.idinvolucrado)
                                                              WHERE i.idusuario = $parametros->idusuariosession )) ";
        }

        $cadenaQuery .= " and ((t.fechainicio >= '$parametros->fechainicio' and t.fechainicio <= '$parametros->fechafin') OR 
                                   (t.fechafin >= '$parametros->fechainicio' and t.fechafin <= '$parametros->fechafin') OR 
                                   (t.fechainicio <= '$parametros->fechainicio' and t.fechafin >= '$parametros->fechafin')) 

                                                            ORDER BY t.fechainicio, t.horainicio, t.fechafin ";
        //print_r($cadenaQuery);die;
        $connA = Doctrine_Manager:: connection();
        $resultado = $connA->execute($cadenaQuery)->fetchAll(PDO::FETCH_ASSOC);

        return $resultado;
    }

    public function ObtenerCamposVersionReporteParaRecuperaciones($idversionreporte) {
        $connA = Doctrine_Manager:: connection();
        $cadena
            = "SELECT * FROM mod_objetivos.nom_versionreportes_nom_camporeporte nvcp
                INNER JOIN mod_objetivos.nom_versionreportes vr 
                ON vr.idversionreporte = nvcp.idversionreporte 
                INNER JOIN mod_objetivos.nom_camporeporte cr 
                ON cr.idcamporeporte = nvcp.idcamporeporte 
                WHERE nvcp.idversionreporte = '$idversionreporte'";
        $resnopag = $connA->execute($cadena);
        $result = $resnopag->fetchAll();
        return $result;
    }

    public function ObtenerPartesVersionReporteParaRecuperaciones($idversionreporte) {
        $connA = Doctrine_Manager:: connection();
        $cadena
            = "SELECT * FROM mod_objetivos.nom_versionreportes_nom_partesreporte nvnp
                INNER JOIN mod_objetivos.nom_versionreportes vr 
                ON vr.idversionreporte = nvnp.idversionreporte 
                INNER JOIN mod_objetivos.nom_partesreporte pr 
                ON pr.idpartereporte = nvnp.idpartereporte 
                WHERE nvnp.idversionreporte = '$idversionreporte' 
                ORDER BY nvnp.orden ASC";
        $resnopag = $connA->execute($cadena);
        $result = $resnopag->fetchAll();
        return $result;
    }

}

//fin clase