<?php

/**
 * @author
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpgestionartareaModel extends ZendExt_Model
{

    public function CmpgestionartareaModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para adicionar las tareas
     */
    public function adicionarTarea($parametros)
    {
        //****** Hay que hacer lo de flujo de trabajo ******
        //Verificar conflictos entre la fecha fin y el fondo de tiempo planificado
        // comentariado pq da problemas en el dupplicar Tarea
        /* $arrayInvolFondoTiempo = $this->verificarFondoTiempo(
          $parametros
          );
          if ($parametros->verificartiempoinvol) {
          if (isset($arrayInvolFondoTiempo['involucradosConflicto'][0])) {
          $arrayInvolFondoTiempo['mensaje'] = 5;
          $arrayInvolFondoTiempo['fechafinact']
          = $parametros->fechafin;
          return $arrayInvolFondoTiempo;
          }
          } else {
          $arrayInvolPresupuesto = $arrayInvolFondoTiempo['involucrados'];
          $presupuesto = $this->presupuestoTarea($arrayInvolPresupuesto);
          } */
        $dm = Doctrine_Manager::getInstance();
        $con = $dm->getCurrentConnection();
        $objDatProyecto = new DatProyecto();
        $parametros->tipo = 10;
        $obj = new CmpgestionarplantillaModel();
        $parametros->denelemento = $obj->Mayus($parametros->denelemento);
        //procedo a insertar el elemento
        $elemen = $objDatProyecto->adicionarElemento($parametros);

        $parametros->idElemen = $elemen[0]['idelemento'];

        //add en DatTarea
        $objDatTarea = new DatTarea();
        $objDatTarea->idtarea = $parametros->idElemen;
        $objDatTarea->duracionreal = $parametros->duracionR;
        $objDatTarea->plantilla = $parametros->plantilla;
        $objDatTarea->lugar = $parametros->lugar;
        $objDatTarea->evento = $parametros->evento;
        $objDatTarea->esprincipal = $parametros->principal;

        if ($parametros->porcientocump == 100) {
            $objDatTarea->fechacumplimiento = date('d/m/Y', time());
            $objDatTarea->horacumplimiento = date('H:i:s', time());
        }

        if ($parametros->fechainicio != '') {
            $objDatTarea->fechainicio = $parametros->fechainicio;
            $objDatTarea->fechafin = $parametros->fechafin;
        }

        if ($parametros->criterioeval != '') {
            $objDatTarea->idevaluacion = $parametros->criterioeval;
        } else {
            $idnomenclador = $objDatProyecto->buscaridNoEvaluado();
            $objDatTarea->idevaluacion = $idnomenclador[0]['idnomenclador'];
        }

        if ($parametros->horainicio != '') {
            $objDatTarea->horainicio = $parametros->horainicio;
            $objDatTarea->horafin = $parametros->horafin;
        }
        $objDatTarea->idtareadepende = $parametros->idtareadepende;
        $objDatTarea->dependencias = $parametros->dependencias;

        $parametros->duracionestimada = 0;
        if ($parametros->duracionEstimadaDias) {
            $parametros->duracionestimada = ($parametros->duracionEstimadaDias * 24) * 60;
        }
        if ($parametros->duracionEstimadaHoras) {
            $parametros->duracionestimada += ($parametros->duracionEstimadaHoras * 60);
        }
        if ($parametros->duracionEstimadaMinutos) {
            $parametros->duracionestimada += $parametros->duracionEstimadaMinutos;
        }
        $objDatTarea->duracionestimada = round($parametros->duracionestimada);

        if (!isset($parametros->tiempooptimista)) {
            $parametros->tiempooptimista = 0;
            if ($parametros->tiempooptimistaDias) {
                $parametros->tiempooptimista = ($parametros->tiempooptimistaDias * 24) * 60;
            }
            if ($parametros->tiempooptimistaHoras) {
                $parametros->tiempooptimista += ($parametros->tiempooptimistaHoras * 60);
            }
            if ($parametros->tiempooptimistaMinutos) {
                $parametros->tiempooptimista += $parametros->tiempooptimistaMinutos;
            }
        }
        $objDatTarea->tiempooptimista = round($parametros->tiempooptimista);

        if (!isset($parametros->tiempomedio)) {
            $parametros->tiempomedio = 0;
            if ($parametros->tiempomedioDias) {
                $parametros->tiempomedio = ($parametros->tiempomedioDias * 24) * 60;
            }
            if ($parametros->tiempomedioHoras) {
                $parametros->tiempomedio += ($parametros->tiempomedioHoras * 60);
            }
            if ($parametros->tiempomedioMinutos) {
                $parametros->tiempomedio += $parametros->tiempomedioMinutos;
            }
        }
        $objDatTarea->tiempomedio = round($parametros->tiempomedio);

        if (!isset($parametros->tiempopesimista)) {
            $parametros->tiempopesimista = 0;
            if ($parametros->tiempopesimistaDias) {
                $parametros->tiempopesimista = ($parametros->tiempopesimistaDias * 24) * 60;
            }
            if ($parametros->tiempopesimistaHoras) {
                $parametros->tiempopesimista += ($parametros->tiempopesimistaHoras * 60);
            }
            if ($parametros->tiempopesimistaMinutos) {
                $parametros->tiempopesimista += $parametros->tiempopesimistaMinutos;
            }
        }
        $objDatTarea->tiempopesimista = round($parametros->tiempopesimista);

        $objDatTarea->unidadmedida = $parametros->unidadmedida;
        $objDatTarea->valorreal = $parametros->valorreal;
        $objDatTarea->valormeta = $parametros->valormeta;
        $objDatTarea->costo = $parametros->costo;
        $objDatTarea->clave = $obj->Mayus($parametros->clave);

        $objDatTarea->save();
        $con->commit();
        $con->beginTransaction();
        //Add categoria de la tarea
        if ($parametros->idcategoria != '') {
            $parametros->tiponomenclador = 16;
            $objDatProyecto->adicionarNomenclador($parametros);
        }
        if ($parametros->generaproyecto) {
            $nomenclador = $objDatProyecto->buscarNomencladoridGenertarProyecto(
                $parametros->idtareadepende
            );
            foreach ($nomenclador as $key => $n) {
                $parametros->tiponomenclador = $n['tiponomenclador'];
                $parametros->idcategoria = $n['idnomenclador'];
                if ($parametros->tiponomenclador != 5) {
                    $parametros->cantidad = $n['cantidad'];
                    $objDatProyecto->adicionarNomenclador($parametros);
                }
            }
        }
        //Add criterio de evaluacion de la tarea
        if ($parametros->criterioeval != '') {
            $parametros->tiponomenclador = 18;
            $idcategoria = $parametros->idcategoria;
            $parametros->idcategoria = $parametros->criterioeval;
            $objDatProyecto->adicionarNomenclador($parametros);
            $parametros->idcategoria = $idcategoria;
        }
        //Add tipo de tarea
        if ($parametros->idtipotarea) {
            $parametros->tiponomenclador = 17;
            $idcategoria = $parametros->idcategoria;
            $parametros->idcategoria = $parametros->idtipotarea;
            $objDatProyecto->adicionarNomenclador($parametros);
            $parametros->idcategoria = $idcategoria;
        }
        //Add recursos
        if (isset($parametros->recursoasociado[0]) || $parametros->recursoasociado[0] == '') {
            $parametros->tiponomenclador = 5;
            foreach ($parametros->recursoasociado as $recurso) {
                $parametros->idcategoria = $recurso->idcategoria;
                $parametros->cantidad = ($recurso->cantidad) ? $recurso->cantidad : 1;
                if ($recurso->indicador == 0) {
                    $objDatProyecto->adicionarRecurso($parametros);
                } else {
                    $objDatProyecto->adicionarIndicador($parametros);
                }
            }
        }
        //Add relacion dat-elemen-dat-elemen
        $objDatProyecto->adicionarElemenElemen($parametros);
        //Adicionar Dependencias
        if (isset($parametros->arrayelementosrelacionados[0])) {
            foreach ($parametros->arrayelementosrelacionados as $relacion) {
                if ($relacion->tipoelemento == 10) {
                    $objDatProyecto->adicionarDependencias(
                        $parametros, $relacion
                    );
                }
            }
        }
        //procedo a crear las repeticiones de tarea
        if (isset($parametros->arrayrepeticiones[0])) {
            $this->adicionarRepeticiones($parametros);
        }
        //procedo a insertar los involucrados en la tarea
        if (isset($parametros->arrayinvolucrados[0])) {
            $this->pIntegrator->planpdo->insertarInvolucradosTarea(
                $parametros->arrayinvolucrados, $parametros->idElemen, $parametros->tipo
            );
        }
        $p['action'] = 'ins';
        $p['modfila'] = false;
        $p['addfila'] = true;
        $p['array'] = $parametros->arrayinvolucrados;
        $p['idelemento'] = $parametros->idElemen;
        $p['denelemento'] = $parametros->denelemento;
//        $this->actualizarDatosMatriz($p);
        //procedo a insertar la estructura que crea
        if ($parametros->idEstructura) {
            $elemenEstrucCrea = new DatElementoEstructuraCrea();
            $elemenEstrucCrea->addElementoEstructuraCrea(
                $parametros->idElemen, $parametros->idEstructura
            );
        }
        $procede = $parametros->idElemen;
        ///***...ACTUALIZAR PORCIENTO DE LOS PADRES...***///
        self::actualizarPorcientoPadre($parametros);
        //$this->actualizarFechaDuracionHito($parametros->idpadre);
        return $procede;
    }

    public function actualizarFechaDuracionHito($idhito)
    {
        $objPlantilla = new CmpgestionarplantillaModel();
        $obj = new DatTarea();
        $tareashito = array();
        $objPlantilla::buscarInferiores($idhito, $tareashito, '<=', 3, 10);
        //print_r($tareashito);die;
        $fecha = $obj->buscarFechaHito($tareashito);
        $hito = Doctrine::getTable('DatHito')->find($idhito);
        $hito->fechafin = $fecha[0]['max'];
        $hito->fechainicio = $fecha[0]['min'];
        $hito->duracionestimada = $fecha[0]['sum'];
        $hito->save();
    }

    public function actualizarTiempoEstimadoTarea($params)
    {
        $obj = new DatTarea();
        $obj->updateTiempoEstimadoTarea($params);
    }

    /**
     * Funcion para Actualizar el porcentaje de cumplimiento de los padres
     */
    public function actualizarMiPorciento($params)
    {
        $objDatProyecto = new DatProyecto();
        $suma = 0;
        $cant = 0;
        $hijos = $objDatProyecto->getHijosInmediatos($params->idElemen);
        foreach ($hijos as $hijo) {
            $gradoCumpHijo = $objDatProyecto->buscarElementoPorId(
                $hijo['idelemento']
            );
            $suma += $gradoCumpHijo[0]['gradocumplimiento'];
            $cant++;
        }
        //calcular el grado de cumplimiento del padre
        $gradoCump = $suma / $cant;
        if ($cant == 0) {
            $gradoCump = 0;
        }
        //Actualizar el estado de cumplimiento del padre
        $estadoCump = $objDatProyecto->actualizarEstadoCumplimiento(
            $gradoCump
        );
        //Actualizar padre
        $objDatProyecto->actualizarGradoCump(
            $gradoCump, $estadoCump, $params->idElemen
        );
        ///***...ACTUALIZAR PORCIENTO DE LOS PADRES...***///
        self::actualizarPorcientoPadre($params);
    }

    /**
     * Funcion para Actualizar el porcentaje de cumplimiento de los padres
     */
    public function actualizarPorcientoPadre($params)
    {
        $objPlantilla = new CmpgestionarplantillaModel();
        $objDatProyecto = new DatProyecto();
        $elemenPadres = array();
        //busco los padres recursivamente
        $objPlantilla->getSuperiores(
            $params->idElemen, $elemenPadres, '<', 4, $params->tipo
        );
        //por cada padre actualizo sus valores
        for ($i = count($elemenPadres) - 1; $i >= 0; $i--) {
            $suma = 0;
            $cant = 0;
            $hijos = $objDatProyecto->getHijosInmediatos($elemenPadres[$i]);
            foreach ($hijos as $hijo) {
                $gradoCumpHijo = $objDatProyecto->buscarElementoPorId(
                    $hijo['idelemento']
                );
                $suma += $gradoCumpHijo[0]['gradocumplimiento'];
                $cant++;
            }
            //calcular el grado de cumplimiento del padre
            $gradoCumpPadre = $suma / $cant;
            //Actualizar el estado de cumplimiento del padre
            $estadoCumpPadre = $objDatProyecto->actualizarEstadoCumplimiento(
                $gradoCumpPadre
            );
            //Actualizar padre
            $objDatProyecto->actualizarGradoCump(
                $gradoCumpPadre, $estadoCumpPadre, $elemenPadres[$i]
            );
        }
    }

    /**
     * Funcion para modificar las tareas
     */
    public function modificarTarea($parametros)
    {
        //Verificar conflictos entre la fecha fin y el fondo de tiempo planificado
        // comentariado pq da problemas en el dupplicar Tarea
        /* $arrayInvolFondoTiempo = $this->verificarFondoTiempo(
          $parametros
          );
          if ($parametros->verificartiempoinvol) {
          if (isset($arrayInvolFondoTiempo['involucradosConflicto'][0])) {
          $arrayInvolFondoTiempo['mensaje'] = 5;
          $arrayInvolFondoTiempo['fechafinact']
          = $parametros->fechafin;
          return $arrayInvolFondoTiempo;
          }
          } else {
          $arrayInvolPresupuesto = $arrayInvolFondoTiempo['involucrados'];
          $presupuesto = $this->presupuestoTarea($arrayInvolPresupuesto);
          } */
        $respuesta = 0;
        $datproy = new DatProyecto();
        $objelemento = Doctrine::getTable('DatTarea')
            ->find(
                $parametros->idelemento
            );
        if ($parametros->evento != $objelemento->evento) {
            $objelemento->evento = $parametros->evento;
        }

        $objE = DatTarea::obtenerElemento($parametros->idelemento);
        $p['modfila'] = true;
        $p['idelemento'] = $parametros->idelemento;
        $p['denelemento'] = $parametros->denelemento;
        $p['obj'] = $objE;
        $p['herramienta'] = 'Matrizrecursos';
//        $this->actualizarDatosMatriz($p);

        $porcumplimiento = self::getGradoCumplimiento($parametros->idelemento);
        if ($parametros->porcientocump == 100)
            if ($porcumplimiento < 100) {
                $objelemento->fechacumplimiento = date('d/m/Y', time());
                $objelemento->horacumplimiento = date('H:i:s', time());
            }
        if ($parametros->porcientocump < 100) {
            $objelemento->fechacumplimiento = null;
            $objelemento->horacumplimiento = null;
        }

        $obj = new CmpgestionarplantillaModel();
        $parametros->denelemento = $obj->Mayus($parametros->denelemento);
        $respuesta = $datproy->modificarElemento($parametros);
        if ($parametros->plantilla == 0) {
            $objelemento->fechainicio = $parametros->fechainicio;
            $objelemento->fechafin = $parametros->fechafin;
            $objelemento->duracionreal = $parametros->duracionR;
        }
        $parametros->idElemen = $parametros->idelemento;
        if ($parametros->idcategoria != '') { //categoria tarea
            $parametros->tiponomenclador = 16;
            $datproy->modificarNomenclador($parametros);
        }
        if ($parametros->idtipotarea != '') { //tipo tarea
            $parametros->tiponomenclador = 17;
            $parametros->idcategoria = $parametros->idtipotarea;
            $datproy->modificarNomenclador($parametros);
        }
        //if (!isset($parametros->ideval))
        if ($parametros->ideval != '') { //criterio evaluacion
            $parametros->tiponomenclador = 18;
            $parametros->idcategoria = $parametros->ideval;
            $datproy->modificarNomenclador($parametros);
        }

        $parametros->duracionestimada = 0;
        if ($parametros->duracionEstimadaDias) {
            $parametros->duracionestimada = ($parametros->duracionEstimadaDias * 24) * 60;
        }
        if ($parametros->duracionEstimadaHoras) {
            $parametros->duracionestimada += ($parametros->duracionEstimadaHoras * 60);
        }
        if ($parametros->duracionEstimadaMinutos) {
            $parametros->duracionestimada += $parametros->duracionEstimadaMinutos;
        }
        $objelemento->duracionestimada = round($parametros->duracionestimada);

        $parametros->tiempooptimista = 0;
        if ($parametros->tiempooptimistaDias) {
            $parametros->tiempooptimista = ($parametros->tiempooptimistaDias * 24) * 60;
        }
        if ($parametros->tiempooptimistaHoras) {
            $parametros->tiempooptimista += ($parametros->tiempooptimistaHoras * 60);
        }
        if ($parametros->tiempooptimistaMinutos) {
            $parametros->tiempooptimista += $parametros->tiempooptimistaMinutos;
        }
        $objelemento->tiempooptimista = round($parametros->tiempooptimista);

        $parametros->tiempomedio = 0;
        if ($parametros->tiempomedioDias) {
            $parametros->tiempomedio = ($parametros->tiempomedioDias * 24) * 60;
        }
        if ($parametros->tiempomedioHoras) {
            $parametros->tiempomedio += ($parametros->tiempomedioHoras * 60);
        }
        if ($parametros->tiempomedioMinutos) {
            $parametros->tiempomedio += $parametros->tiempomedioMinutos;
        }
        $objelemento->tiempomedio = round($parametros->tiempomedio);

        $parametros->tiempopesimista = 0;
        if ($parametros->tiempopesimistaDias) {
            $parametros->tiempopesimista = ($parametros->tiempopesimistaDias * 24) * 60;
        }
        if ($parametros->tiempopesimistaHoras) {
            $parametros->tiempopesimista += ($parametros->tiempopesimistaHoras * 60);
        }
        if ($parametros->tiempopesimistaMinutos) {
            $parametros->tiempopesimista += $parametros->tiempopesimistaMinutos;
        }
        $objelemento->tiempopesimista = round($parametros->tiempopesimista);

        $objelemento->unidadmedida = $parametros->unidadmedida;
        $objelemento->valorreal = $parametros->valorreal;
        $objelemento->valormeta = $parametros->valormeta;
        $objelemento->costo = $parametros->costo;
        $objelemento->clave = $obj->Mayus($parametros->clave);

        $objelemento->lugar = $parametros->lugar;
        $objelemento->esprincipal = $parametros->principal;
        $objelemento->horainicio = $parametros->horainicio;
        $objelemento->horafin = $parametros->horafin;

        //Add recursos
        if (isset($parametros->recursoasociado[0]) || $parametros->recursoasociado[0] == '') {
            //print_r($parametros->recursoasociado[0]);die;
            $parametros->tiponomenclador = 5;
            $datproy->eliminarNomenclador($parametros);
            $datproy->eliminarIndicador($parametros);
            foreach ($parametros->recursoasociado as $recurso) {
                $parametros->idcategoria = $recurso->idcategoria;
                $parametros->cantidad = ($recurso->cantidad) ? $recurso->cantidad : 1;
                if ($recurso->indicador == 0) {
                    $datproy->adicionarRecurso($parametros);
                } else {
                    $datproy->adicionarIndicador($parametros);
                }
            }
        }
        //se relacionan los involucrados al elemento o actividad
        if (isset($parametros->arrayinvolucrados)) {
            $this->pIntegrator->planpdo->insertarInvolucradosTarea(
                $parametros->arrayinvolucrados, $parametros->idelemento, 10
            );
            $p['action'] = 'ins';
            $p['modfila'] = false;
            $p['array'] = $parametros->arrayinvolucrados;
            $p['idelemento'] = $parametros->idelemento;
            $p['denelemento'] = $parametros->denelemento;
            $p['herramienta'] = 'Matrizrecursos';
//            $this->actualizarDatosMatriz($p);
        }
        //se eliminan los involucrados al elemento o actividad
        if (isset($parametros->arrayinvolucradoseliminar)) {
            $this->pIntegrator->planpdo->eliminarUsuariosAElemento(
                $parametros->arrayinvolucradoseliminar, $parametros->idelemento, 10
            );
            $p['action'] = 'del';
            $p['modfila'] = false;
            $p['array'] = $parametros->arrayinvolucradoseliminar;
            $p['idelemento'] = $parametros->idelemento;
            $p['denelemento'] = $parametros->denelemento;
            $p['herramienta'] = 'Matrizrecursos';
//            $this->actualizarDatosMatriz($p);
        }
        $objelemento->save();
        ///***...ACTUALIZAR PORCIENTO DE LOS PADRES...***///     
        self::actualizarPorcientoPadre($parametros);
//        $this->actualizarFechaDuracionHito($parametros->idpadre);
        //Calculo del presupuesto de la tarea
        return 1;
    }

    public function getGradoCumplimiento($idelemento)
    {
        $cadenaA
            = "  SELECT e.gradocumplimiento
                  FROM mod_planifproyecto.dat_tarea t
                   INNER JOIN mod_objetivos.dat_elementos e
                  ON(t.idtarea=e.idelemento)
                  WHERE idtarea = $idelemento";

        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC);
        return $result[0]['gradocumplimiento'];
    }

    public function actMatrizHibrida($p)
    {
        $modelPlantilla = new CmpgestionarplantillaModel();
        $objdatelementos = new DatElementos();
        $cmpPert = new CmpDiagramaPertModel();

        $arrayTareas = array();
        $columnas = array('Antecesores', 'Sucesores');
        $arrayResultanteAlgoritmoPert = array();
        $proyecto = array();
        $datos = array();
        $denomTarea = $modelPlantilla->Mayus($p['denelemento']);
        $modelPlantilla->returnIdProyecto($p['idelemento'], $proyecto);
        $idproyecto = $proyecto[0];
        if ($this->pIntegrator->integracion->existeMatrizRecursoXproyecto(
            $idproyecto, $p['herramienta']
        )
        ) {
            $params->idproyecto = $idproyecto;
            $modelPlantilla->obtenerDatosPert(
                $params, $arrayResultanteAlgoritmoPert
            );
            //Antecedentes.
            $antecedentes = '';
            $cantRelacionA = 0;
            foreach (
                $arrayResultanteAlgoritmoPert['arrayRelacionesPert'] as $key1 => $relacion
            ) {
                if ($p['idelemento'] == $relacion['to']) {
                    if ($cantRelacionA >= 1) {
                        $antecedentes .= ", " . $relacion['from'];
                        $cantRelacionA++;
                    } else {
                        $antecedentes .= $relacion['from'];
                        $cantRelacionA++;
                    }
                }
            }

            //Sucesores
            $secuencia = '';
            $cantRelacion = 0;
            foreach (
                $arrayResultanteAlgoritmoPert['arrayRelacionesPert'] as $key2 => $relacion
            ) {
                if ($p['idelemento'] == $relacion['from']) {
                    if ($cantRelacion >= 1) {
                        $secuencia .= ", " . $relacion['to'];
                        $cantRelacion++;
                    } else {
                        $secuencia .= $relacion['to'];
                        $cantRelacion++;
                    }
                }
            }
            $antearray = implode(',', $p['array']);
            $antecedentes = ($antecedentes !== '') ? $antecedentes : '-';
            $antecedentes .= ', ' . $antearray;
            $secuencia = ($secuencia !== '') ? $secuencia : '-';
            //Retornar filas
            $filas[] = array(
                "denominacion" => $modelPlantilla->Mayus($p['denelemento']),
                "codigo" => $p['idelemento']
            );

            $datos[] = array(
                "column" => $columnas[0]['denominacion'],
                "row" => $modelPlantilla->Mayus($p['denelemento']),
                "value" => $antecedentes,
                "hibrida" => true
            );

            $datos[] = array(
                "column" => $columnas[1]['denominacion'],
                "row" => $modelPlantilla->Mayus($p['denelemento']),
                "value" => $secuencia,
                "hibrida" => true
            );

            $datos = json_encode($datos);
            $this->pIntegrator->integracion->insertUpdateDatosMatriz(
                $idproyecto, $datos, $p['herramienta']
            );
        }
    }

    public function actualizarDatosMatriz($p)
    {
        //$datos = '[{"column":"Involucrado1","row":"Actividad2","value":"X"},{"column":"Involucrado3","row":"Actividad2","value":"X"}]';
        $modelPlantilla = new CmpgestionarplantillaModel();
        $arrayTareas = array();
        $proyecto = array();
        $datos = array();
        $denomTarea = $modelPlantilla->Mayus($p['denelemento']);
        $modelPlantilla->returnIdProyecto($p['idelemento'], $proyecto);
        $idproyecto = $proyecto[0];
        if ($this->pIntegrator->integracion->existeMatrizRecursoXproyecto(
            $idproyecto, $p['herramienta']
        )
        ) {
            if ($p['modfila'] == true) {
                $p['action'] = 'upd';
                $objFila['denomold'] = $p['obj'][0]['denelemento'];
                $objFila['denominacion'] = $denomTarea;
                $objFila['descripcion'] = $denomTarea;
                $objFila['fila'] = true; //porque es una fila
                $fila = json_encode($objFila);
                $this->pIntegrator->integracion->insertUpdateDeleteColumnsRowsMatriz(
                    $idproyecto, $fila, $p['action'], $p['herramienta']
                );
            }
            if ($p['addfila'] == true) {
                $p['action'] = 'ins';
                $objFila['denominacion'] = $denomTarea;
                $objFila['descripcion'] = $denomTarea;
                $objFila['fila'] = true; //porque es una fila
                $fila = json_encode($objFila);
                $this->pIntegrator->integracion->insertUpdateDeleteColumnsRowsMatriz(
                    $idproyecto, $fila, $p['action'], $p['herramienta']
                );

                $modelPlantilla->getTareasProyecto($idproyecto, $arrayTareas);
                $involucradosXTarea = array();
                foreach ($arrayTareas as $tarea) {
                    //Obtenemos los involucrados de las tareas por ese proyecto
                    $involucradosTarea = DatProyecto::getInvolMatriz(
                        $tarea['idelemento']
                    );
                    if (!empty($involucradosTarea)) {
                        foreach ($involucradosTarea as $value) {
                            array_push($involucradosXTarea, $value);
                        }
                    }
                }

                $involucradosT = DatProyecto::getInvolMatriz(
                    $p['idelemento']
                );
                if ($p['action'] == 'ins') {
                    //Modificamos la accion
                    foreach ($p['array'] as $value) {
                        //Si no esta en el array de involucrados significa que es una columna nueva y por tanto la adicionamos.
                        $existeP = false;
                        $existeT = false;
                        foreach ($involucradosXTarea as $valor) {
                            if ($value->idinvolucrado == $valor['idusuario']) {
                                $existeP = true;
                                break;
                            }
                        }
                        foreach ($involucradosT as $valor1) {
                            if ($value->idinvolucrado == $valor1['idusuario']) {
                                $existeT = true;
                                break;
                            }
                        }
                        if (!$existeP) {
                            $objColumna['denominacion'] = $value->denominacion;
                            $objColumna['descripcion'] = $value->denominacion;
                            $objColumna['fila'] = false; //porque es una columna
                            $columna = json_encode($objColumna);
                            $this->pIntegrator->integracion->insertUpdateDeleteColumnsRowsMatriz(
                                $idproyecto, $columna, $p['action'], $p['herramienta']
                            );

                            $datos[] = array(
                                "column" => $value->denominacion,
                                "row" => $denomTarea,
                                "value" => 'X'
                            );
                        } else {
                            if (!$existeT) {
                                $datos[] = array(
                                    "column" => $value->denominacion,
                                    "row" => $denomTarea,
                                    "value" => 'X'
                                );
                            }
                        }
                    }
                    $datos = json_encode($datos);
                    $this->pIntegrator->integracion->insertUpdateDatosMatriz(
                        $idproyecto, $datos, $p['herramienta']
                    );
                }
            } else {
                //Buscamos todas las tareas de ese proyecto.
                $modelPlantilla->getTareasProyecto($idproyecto, $arrayTareas);
                $involucradosXTarea = array();
                foreach ($arrayTareas as $tarea) {
                    //Obtenemos los involucrados de las tareas por ese proyecto
                    $involucradosTarea = DatProyecto::getInvolMatriz(
                        $tarea['idelemento']
                    );
                    if (!empty($involucradosTarea)) {
                        foreach ($involucradosTarea as $value) {
                            array_push($involucradosXTarea, $value);
                        }
                    }
                }

                $involucradosT = DatProyecto::getInvolMatriz(
                    $p['idelemento']
                );
                if ($p['action'] == 'ins') {
                    //Modificamos la accion
                    foreach ($p['array'] as $value) {
                        //Si no esta en el array de involucrados significa que es una columna nueva y por tanto la adicionamos.
                        $existeP = false;
                        $existeT = false;
                        foreach ($involucradosXTarea as $valor) {
                            if ($value->idinvolucrado == $valor['idusuario']) {
                                $existeP = true;
                                break;
                            }
                        }
                        foreach ($involucradosT as $valor1) {
                            if ($value->idinvolucrado == $valor1['idusuario']) {
                                $existeT = true;
                                break;
                            }
                        }
                        if (!$existeP) {
                            $objColumna['denominacion'] = $value->denominacion;
                            $objColumna['descripcion'] = $value->denominacion;
                            $objColumna['fila'] = false; //porque es una columna
                            $columna = json_encode($objColumna);
                            $this->pIntegrator->integracion->insertUpdateDeleteColumnsRowsMatriz(
                                $idproyecto, $columna, $p['action'], $p['herramienta']
                            );

                            $datos[] = array(
                                "column" => $value->denominacion,
                                "row" => $denomTarea,
                                "value" => 'X'
                            );
                        } else {
                            if (!$existeT) {
                                $datos[] = array(
                                    "column" => $value->denominacion,
                                    "row" => $denomTarea,
                                    "value" => 'X'
                                );
                            }
                        }
                    }
                    $datos = json_encode($datos);
                    $this->pIntegrator->integracion->insertUpdateDatosMatriz(
                        $idproyecto, $datos, $p['herramienta']
                    );
                } elseif ($p['action'] == 'del') {
                    foreach ($p['array'] as $value) {
                        $datos[] = array(
                            "column" => $value->denominacion,
                            "row" => $denomTarea,
                            "value" => ''
                        );
                    }
                    $datos = json_encode($datos);
                    $this->pIntegrator->integracion->insertUpdateDatosMatriz(
                        $idproyecto, $datos, $p['herramienta']
                    );
                }
            }
        }
    }

    public function duplicarTarea($params)
    {
        $plantilla = $params->plantilla;
        $params->porcientocump = '0';
        $insertadas = array();
        $idtarea = self::adicionarTarea($params);

        if ($params->_is_leaf == 'false') {
            CmpgestionarplantillaModel::adicionarestructuraaproyecto(
                $params->idelemento, $idtarea, $insertadas, $plantilla, null, $params
            );
            $tareasind = implode(',', $insertadas);
            foreach ($insertadas as $pos => $tarea) {
                $objTarea = Doctrine::getTable('DatTarea')->find($tarea);
                if ($objTarea->dependencias != 0) {
                    $dependencias = explode(',', $objTarea->dependencias);
                    foreach ($dependencias as $depend) {
                        $dm = Doctrine_Manager::getInstance();
                        $con = $dm->getCurrentConnection();
                        $elemDep = Doctrine::getTable('DatTarea')->findByDql(
                            "idtareadepende = {$depend} AND idtarea IN({$tareasind})"
                        );
                        $objGuardar = new DatElementosDatElementos();
                        $objGuardar->idelementopadre = $elemDep[0]->idtarea;
                        $objGuardar->idelementohijo = $tarea;
                        $objGuardar->idautor = $params->idautor;
                        $objGuardar->origen = 6;
                        $objGuardar->save();
                        $con->commit();
                        $con->beginTransaction();
                    }
                }
            }
        }
        $result['tareas'] = $insertadas;
        $result['idtarea'] = $idtarea;
        return $result;
    }

    /* Reorganizar SubElementos
     * */

    public function reorganizarSubElementos($parametros)
    {
        $datTarea = new DatTarea();
        $reordenado = 0;
        if (isset($parametros->arraysubElementos[0])) {
            foreach ($parametros->arraysubElementos as $key => $subelemento) {
                $origen = null;
                //creados por el mismo usuario
                if ($parametros->elementoPadre->idautor == $subelemento->idautor
                ) {
                    if ($parametros->elementoPadre->tipoelemento == $subelemento->tipoelemento
                    ) {
                        $origen = 0; //mismo tipo
                    } else {
                        $origen = 1; //diferente tipo
                    }
                } else {//creados por diferentes usuarios
                    if ($parametros->elementoPadre->tipoelemento == $subelemento->tipoelemento
                    ) {
                        $origen = 2; //mismo tipo
                    } else {
                        $origen = 3; //diferente tipo
                    }
                }
                $parametros->idhijo = $subelemento->idelemento;
                $parametros->padreold = $subelemento->_parent;
                $parametros->idpadre = $parametros->elementoPadre->idelemento;
                $parametros->origen = $origen;
                if ($subelemento->plantilla == $parametros->elementoPadre->plantilla
                ) {//del mismo tipo plantilla
                    if ($subelemento->tipoelemento == 10) {
                        $datTarea->deleteRelacion($parametros);
                        ///***...ACTUALIZAR PORCIENTO DE LOS PADRES...***///
                        $parametros->idElemen = $parametros->padreold;
                        self::actualizarMiPorciento($parametros);
                        $datTarea->insertRelacion($parametros);
                        $reordenado = 1;
                    } elseif ($subelemento->tipoelemento == 9) {
                        //no puede ser hijo de una tarea
                        if ($parametros->elementoPadre->tipoelemento != 10) {
                            $datTarea->deleteRelacion($parametros);
                            ///***...ACTUALIZAR PORCIENTO DE LOS PADRES...***///
                            $parametros->idElemen = $parametros->padreold;
                            self::actualizarMiPorciento($parametros);
                            $datTarea->insertRelacion($parametros);
                            $reordenado = 1;
                        }
                    }
                }
                ///***...ACTUALIZAR PORCIENTO DE LOS PADRES...***///
                $parametros->idElemen = $subelemento->idelemento;
                self::actualizarPorcientoPadre($parametros);
            }
        }
        if ($reordenado == 0) {
            $respuesta = 0;
        } else {
            $respuesta = 1;
        }
        return $respuesta;
    }

    public function adicionarRepeticiones($parametros)
    {
        $arrayrepeticiones = $parametros->arrayrepeticiones;

        if (isset($arrayrepeticiones[0])) {
            foreach ($arrayrepeticiones as $repeticion) {
                $objDatProyecto = new DatProyecto();
                $parametros->tipo = 10;
                $parametros->origen = 4;
                $elemen = $objDatProyecto->adicionarElemento($parametros);
                $parametros->idElemen = $elemen[0]['idelemento'];
                //add en DatTarea
                $objDatTarea = new DatTarea();
                $objDatTarea->idtarea = $parametros->idElemen;
                $objDatTarea->duracionestimada = $parametros->duracionE;
                $objDatTarea->duracionreal = $parametros->duracionR;
                $objDatTarea->plantilla = $parametros->plantilla;
                $objDatTarea->idevaluacion = $parametros->criterioeval;
                $objDatTarea->lugar = $repeticion->lugar;
                $objDatTarea->esprincipal = $parametros->principal;
                $objDatTarea->tiporepeticion = $repeticion->tiporepeticion;
                $objDatTarea->fechainicio = $repeticion->fechainicio;
                $objDatTarea->fechafin = $repeticion->fechafin;
                $objDatTarea->save();

                //Add categoria de la tarea
                if ($parametros->idcategoria != '') {
                    $parametros->tiponomenclador = 16;
                    $objDatProyecto->adicionarNomenclador($parametros);
                }
                //Add criterio de evaluacion de la tarea
                if ($parametros->criterioeval != '') {
                    $parametros->tiponomenclador = 18;
                    $idcategoria = $parametros->idcategoria;
                    $parametros->idcategoria = $parametros->criterioeval;
                    $objDatProyecto->adicionarNomenclador($parametros);
                    $parametros->idcategoria = $idcategoria;
                }
                //Add tipo de tarea
                if ($parametros->idtipotarea != '') {
                    $parametros->tiponomenclador = 17;
                    $idcategoria = $parametros->idcategoria;
                    $parametros->idcategoria = $parametros->idtipotarea;
                    $objDatProyecto->adicionarNomenclador($parametros);
                    $parametros->idcategoria = $idcategoria;
                }
                //Add relacion dat-elemen-dat-elemen
                $objDatProyecto->adicionarElemenElemen($parametros);
            }
        }
    }

    public function ObtenerRepeticionesTareaPaginado(
        $parametros
    )
    {
        $idusuariosession = $parametros->idusuariosession;
        $arrayestadosverdoc = $this->pIntegrator->workflow->EstadosVerDoc(
            $idsubsistema = 15, $idusuariosession, $idtipodoc = 3
        );
        $arrayestados = array();
        if (isset($arrayestadosverdoc['data'][0])) {
            foreach ($arrayestadosverdoc['data'] as $key => $estado) {
                $arrayestados[] = $estado['idestado'];
            }
            $arrayestados = implode(',', $arrayestados);
        }
        $parametros->arrayestados = $arrayestados;
        $objDatProyecto = new DatProyecto();
        $arraytareas = $objDatProyecto->obtenerRepeticionesTareasPaginado(
            $parametros
        );
        if ($arraytareas['total'] > 0) {
            foreach ($arraytareas['resultado'] as $key => $tarea) {
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                $entrada = 1;
                if ($tarea['idusuariocrea'] != $idusuariosession) {
                    $superior = 1;
                    $objelemmodel = new DatElementosModel();
                    $estadoaprobpordefcto
                        = $objelemmodel->ObtenerEstadoAprobPorDefecto(
                        $idsubsistema = 15, $idusuariosession, $idtipodocumento = 3
                    );
                    if ($estadoaprobpordefcto == $tarea['idestadoaprob']) {
                        $entrada = 0;
                    }
                    $permisomodificacion
                        = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                        $idusuariosession, $tarea['idusuariocrea']
                    );
                    if ($permisomodificacion) {
                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                        $subordinado = $permisomodificacion[4];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                        $subordinado = 0;
                    }
                }
                if ($entrada == 1) {
                    //verificando que el estado de aprobacion no sea el estado por
                    //defecto para las tareas de otras personas
                    $arraytareas['resultado'][$key]['identificador']
                        = $tarea['identificador'];
                    $arraytareas['resultado'][$key]['idtarea']
                        = $tarea['identificador'];
                    $arraytareas['resultado'][$key]['estadocumplimiento']
                        = $tarea['estadocumplimiento'] . '('
                        . $tarea['gradocumplimiento'] . '%)';
                    $arraytareas['resultado'][$key]['nombreautor']
                        = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                        $tarea['idusuariocrea'], 'usuario', null
                    );

                    $arraytareas['resultado'][$key]['idautor']
                        = $tarea['idusuariocrea'];
                    $separador = '-';
                    $arraytareas['resultado'][$key]['fechainicio']
                        = $tarea['fechai'];
                    $arraytareas['resultado'][$key]['fechafin']
                        = $tarea['fechaf'];
                    $arraytareas['resultado'][$key]['lugar']
                        = $tarea['lugar'];
                    $arraytareas['resultado'][$key]['superior']
                        = $superior;
                    $arraytareas['resultado'][$key]['subordinado']
                        = $subordinado;
                    $arraytareas['resultado'][$key]['modificar']
                        = $modificar;
                    $arraytareas['resultado'][$key]['eliminar']
                        = $eliminar;
                    $arraytareas['resultado'][$key]['tiporepeticion']
                        = $tarea['tiporepeticion'];

//                    $objclasificadorinvolmodel = new ClasificadorinvolModel();
//                    $arraytareas['resultado'][$key]['involucrados']
//                        = $objclasificadorinvolmodel->MostrarInvolucrados(
//                        $tarea['identificador'], $idtipoelemento = 3
//                    );

                    $arraydatosmes = $this->ObtenerDatosMes(
                        $tarea['fechai']
                    );
                    $arraytareas['resultado'][$key]['mes']
                        = $arraydatosmes['nombremes'];
                    $arraytareas['resultado'][$key]['numeroMes']
                        = $arraydatosmes['numeromes'];
                }
            }
        }

        return $arraytareas;
    }

    public function modificarRepeticion($parametros)
    {
        $mensaje = 1;
        $objTarea = Doctrine::getTable('DatTarea')
            ->find(
                $parametros->idelemento
            );
        if (isset($objTarea->idtarea)) {
            $objTareaRep = Doctrine::getTable('DatTarea')
                ->find(
                    $parametros->idtarearepeticion
                );
            if (isset($objTareaRep->idtarea)) {
                $objTareaRep->fechainicio = $parametros->fechainicio;
                $objTareaRep->fechafin = $parametros->fechafin;
                $objTareaRep->lugar = $parametros->lugar;
                $objTareaRep->tiporepeticion = $parametros->tiporepeticion;
                $objTareaRep->save();
//                $objElementoModel = new CmpgestionarelementoModel();
//                //se relacionan los involucrados al elemento o tarea
//                if (isset($parametros->arrayinvolucrados[0])) {
//                    $objElementoModel->InvolucrarUsuariosAElementos(
//                        $parametros->arrayinvolucrados, $objTareaRep->idtarea,
//                        $idtipoelemento = 3
//                    );
//                }
//                //se eliminan los involucrados al elemento o tarea
//                if (isset($parametros->arrayinvolucradoseliminar[0])) {
//                    $objElementoModel->EliminarUsuariosAElementos(
//                        $parametros->arrayinvolucradoseliminar,
//                        $objTareaRep->idtarea,
//                        $idtipoelemento = 3
//                    );
//                }
            } else {
                $mensaje = 3;
            }
        } else {
            $mensaje = 0;
        }
        return $mensaje;
    }

    public function EliminarRepeticion($parametros)
    {
        $mensaje = 1;
        $objTarea = Doctrine::getTable('DatTarea')
            ->find(
                $parametros->idtarea
            );
        if (isset($objTarea->idtarea)) {
            $arrayrepeticiones = $parametros->arrayrepeticiones;
            if (isset($arrayrepeticiones[0])) {
                $contrepnoexistentes = 0;
                foreach ($arrayrepeticiones as $key => $repeticion) {

                    $objProyecto = new DatProyecto();
                    $eliminar = $objProyecto->eliminarElemento(
                        $repeticion->idtarea
                    );
                    //print_r($eliminar);die;
                    if (!$eliminar) {
                        $contrepnoexistentes++;
                    }
                }
                $totalrepeticiones = $key + 1;
                $mensaje = 1; //relaciones eliminadas correctamentes
                if ($contrepnoexistentes > 0) {
                    if ($totalrepeticiones == 1) {
                        $mensaje = 3;
                    }//no existe la repeticion
                }
            }
        } else {
            $mensaje = 0;
        }
        return $mensaje;
    }

    public function ConvertirFecha($fecha, $tiposeparador)
    {
        switch ($tiposeparador) {
            case 'T':
                $fecha = explode('T', $fecha);
                list($annoinicio, $mesinicio, $diainicio) = explode(
                    '-', $fecha[0]
                );
                $numfecha = mktime(
                    0, 0, 0, $mesinicio, $diainicio, $annoinicio
                );
                $fechainstancia = date('d-m-Y', $numfecha);
                break;
            case '-':
                list($annoinicio, $mesinicio, $diainicio) = explode(
                    '-', $fecha
                );
                $numfecha = mktime(
                    0, 0, 0, $mesinicio, $diainicio, $annoinicio
                );
                $fechainstancia = date('d / m / Y', $numfecha);
                break;
        }
        return $fechainstancia;
    }

    public function ObtenerDatosMes($fecha)
    {
        $fecha = explode('/', $fecha);
        $numeromes = $fecha[1] * 1;
        $arraydatosmes['numeromes'] = $numeromes;
        switch ($numeromes) {
            case 1:
                $nombremes = 'Enero';
                break;
            case 2:
                $nombremes = 'Febrero';
                break;
            case 3:
                $nombremes = 'Marzo';
                break;
            case 4:
                $nombremes = 'Abril';
                break;
            case 5:
                $nombremes = 'Mayo';
                break;
            case 6:
                $nombremes = 'Junio';
                break;
            case 7:
                $nombremes = 'Julio';
                break;
            case 8:
                $nombremes = 'Agosto';
                break;
            case 9:
                $nombremes = 'Septiembre';
                break;
            case 10:
                $nombremes = 'Octubre';
                break;
            case 11:
                $nombremes = 'Noviembre';
                break;
            case 12:
                $nombremes = 'Diciembre';
                break;
        }
        $arraydatosmes['nombremes'] = $nombremes;
        return $arraydatosmes;
    }

    public function actualizarCumplimiento($parametros)
    {
        $respuesta = 3;
        $params->gradocumplimiento = $parametros->cumplimiento;
        /* if ($parametros->metodo == 2) {
          $params->gradocumplimiento = $parametros->cumplimiento;
          } */
        foreach ($parametros->arrayidelementos as $key => $elemento) {
            $params->estadocump = DatProyecto::actualizarEstadoCumplimiento(
                $params->gradocumplimiento
            );
            $params->idElemen = $elemento->id;
            $parametros->arrayidelementos[$key]->gradocumplimiento
                = $params->gradocumplimiento;
            $respuesta = DatTarea::actualizarCumplimiento($params);

            ///***...ACTUALIZAR PORCIENTO DE LOS PADRES...***///
            self::actualizarPorcientoPadre($params);


            /****************
             * Actualizar fecha y hora de cumplimiento al poner 100 % a la actividad
             ******************/

            $objelemento = Doctrine::getTable('DatTarea')
                ->find(
                    $elemento->id
                );
            $objelemento->fechacumplimiento = date('d/m/Y', time());
            $objelemento->horacumplimiento = date('H:i:s', time());

            $objelemento->save();

        }
        return $respuesta;
    }

    public function verificarCumplimientoTareas($array)
    {
        $cumplir = '';
        for ($i = 0; $i < count($array); $i++) {
            if ($array[$i][gradocumplimiento] > 100 || $array[$i][gradocumplimiento] == 100
            ) {
                $cumplir = 'si';
            } else {
                return $cumplir = 'no';
            }
        }
        return $cumplir;
    }

    public function verificarFondoTiempo($parametros)
    {
        $fechainicio = $parametros->fechainicio;
        $anno = explode('/', $fechainicio);
        $involucrados = array();
        $arrayInvol = $parametros->arrayinvolucrados;
        $idSubsistema = $parametros->idSubsistema;
        foreach ($arrayInvol as $involucrado) {
            if ($involucrado->tipo == 1) {
                $involucrados[] = $involucrado->idusuario;
            }
        }
        $arrayInvol = $this->pIntegrator->configuracionpdo->getFechaFin(
            $involucrados, $fechainicio, $parametros->duracionR, $anno[2], $idSubsistema
        );
        if (isset($arrayInvol[0])) {
            $result['involucrados'] = $arrayInvol;
            foreach ($arrayInvol as $value => $key) {
                $fechaUser = strtotime(
                    str_replace('/', '-', $key['fechafin'])
                );
                $fechaAct = strtotime(
                    str_replace('/', '-', $parametros->fechafin)
                );
                if ($fechaUser <= $fechaAct) {
                    unset($arrayInvol[$value]);
                }
            }
            if (isset($arrayInvol[0])) {
                $result['involucradosConflicto'] = $arrayInvol;
            }
            return $result;
        } else {
            return false;
        }
    }

    public function presupuestoTarea($arrayInvolPresupuesto)
    {
        $presupuesto = 0;
        if (isset($arrayInvolPresupuesto[0])) {
            foreach ($arrayInvolPresupuesto as $invol) {
                $presupuesto += $invol['horasreal'];
                /** $salarioXHora($invol['idpersona']); */
            }
        }
        return $presupuesto;
    }

    public function obtenerIdUsuario($usuario)
    {
        $obj = new DatTarea();
        $id = $obj->obtenerIdUsuario($usuario);
        return $id;
    }

    public function asociarRecursos($parametros)
    {
        $result = 0;
        $datproy = new DatProyecto();

        foreach ($parametros->arrayidelementos as $elemento) {
            //print_r($elemento->id);die;
            $parametros->tiponomenclador = 5;
            $parametros->idElemen = $elemento->id;

            $datproy->eliminarNomenclador($parametros);
            $datproy->eliminarIndicador($parametros);

            foreach ($parametros->arrayidrecursos as $recurso) {
                $parametros->idcategoria = $recurso->idcategoria;
                $parametros->cantidad = ($recurso->cantidad) ? $recurso->cantidad : 1;

                if ($recurso->indicador == 0) {
                    $datproy->adicionarRecurso($parametros);
                } else {
                    $datproy->adicionarIndicador($parametros);
                }
            }
        }
        return 1;
    }

}
