<?php

/**
 * @author    Nestor Bernal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpgestionarobjetivosModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function CargarObjetivos(
        $idobjetivo, $idusuario, $iddominio, $certificado, $idelementotributa,
        $enaprobacion, $arrayautores, $arrayinvolucrados, $start, $limit,
        $idtipoelementotributa, $idtipoelementotributasuperior, $busqueda,
        $arrayelementosrelacionados, $filtros, $parametros
    ) {
        /*$parametross->limit = 100;
        $parametross->start = 0;
        $parametross->arrayidcriteriomedida = [9000000001,9000000002];
        $array = $this->pIntegrator->planpdo->obtenerDatosCriteriosMedidasDadoArrayIdObjetivos($parametross);  
        print_r($array);die;*/
        $filtroestados = 0;
        $utilizacionFT = 0;
        $arrayestados = array();
        if (isset($filtros[0])) {
            $utilizacionFT = 1;
            foreach ($filtros as $filtro) {
                if ($filtro['field'] == 'nombreestadoaprob') {
                    $filtroestados = 1;
                    $arrayestados[] = $filtro['data']['value'];
                }
            }
            $arrayestados = implode(',', $arrayestados);
        }
        if ($filtroestados == 0) {
            $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
                $idusuario, $idtipodoc = 1
            );            
            //print_r('entrooo');die;
            if (isset($arrayestadosver[0])) {
                $utilizacionFT = 1;
                foreach ($arrayestadosver as $estado) {
                    $arrayestados[] = $estado['idestado'];
                }
            }
            $arrayestados = implode(',', $arrayestados);
        }
        $arrayautoresact = array();
        $cero = 0;
        $uno = 1;
        if (isset($arrayinvolucrados[0])) {
            foreach ($arrayinvolucrados as $involucrado) {
                $id = $involucrado->idusuario;
                if ($involucrado->tipo == 0) {
                    $id = $involucrado->idgrupo;
                }
                $arrayinvolact[] = $id . $cero;
                $arrayinvolact[] = $id . $uno;
                if ($involucrado->tipo == 1) {
                    $arraygrupos
                        = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                        $id
                    );
                    if (isset($arraygrupos[0])) {
                        foreach ($arraygrupos as $grupo) {
                            $arrayinvolact[] = $grupo['idgrupo'] . $cero;
                            $arrayinvolact[] = $grupo['idgrupo'] . $uno;
                        }
                    }
                }
            }
        }
        if (isset($arrayautores[0])) {
            foreach ($arrayautores as $autor) {
                $idautor = $autor->idautor;
                if ($autor->tipo == 0) {
                    $arrayusuarios
                        = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
                        $idautor
                    );
                    if (isset($arrayusuarios[0])) {
                        foreach ($arrayusuarios as $usuario) {
                            $arrayautoresact[] = $usuario["idusuario"];
                        }
                    }
                } else {
                    $arrayautoresact[] = $idautor;
                }
            }
        }
        //aqui empiezo a definir los posibles cmbinaciones para obtener 
        //arreglo de inv y autores cuanod estos no vienen del client
        if (!isset($arrayautores[0]) && !isset($arrayinvolucrados[0])) {
            if ($enaprobacion == 0) {
                $arrayautoresact[] = $idusuario;
                $arrayinvolact[] = $idusuario . $cero;
                $arrayinvolact[] = $idusuario . $uno;
                $arraygrupos
                    = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                    $idusuario
                );
                if (isset($arraygrupos[0])) {
                    foreach ($arraygrupos as $grupo) {
                        $arrayinvolact[] = $grupo['idgrupo'] . $cero;
                        $arrayinvolact[] = $grupo['idgrupo'] . $uno;
                    }
                }
            } else {
                $arrayautoresact[] = $idusuario;
                $permisosubordinados
                    = $this->pIntegrator->configuracionpdo->DamePermisoSubordinados(
                    $idusuario
                );
                if (isset($permisosubordinados[0])) {
                    foreach ($permisosubordinados as $subordinado) {
                        $arrayautoresact[] = $subordinado['idpsobre'];
                    }
                }
            }
        }
        $objdatelementos = new DatElementos();
        /*$obj = new DatObjetivo();
        $r = $obj->obtenerObjConCriteriosDeMedidas();
        print_r($r);die;*/
        $arrayobjetivos = $objdatelementos->CargarObjetivos(
            $idobjetivo, $idusuario, $idelementotributa, $enaprobacion,
            $arrayautoresact, $arrayinvolact, $start, $limit,
            $idtipoelementotributa, $idtipoelementotributasuperior,
            $arrayestados, $busqueda, $arrayelementosrelacionados, $filtros,
            $parametros
        );
        if (isset($arrayobjetivos['resultado'])) {
            foreach ($arrayobjetivos['resultado'] as $key => $objetivo) {
                $parent = null;
                if ($idobjetivo) {
                    $parent = $idobjetivo;
                }
                $leaf = true;
                if ($objetivo['cantrelacdescorigen0'] > 0
                    || $objetivo['cantrelacdescorigen2'] > 0
                ) {
                    $tienehijos = $objdatelementos->CargarObjetivos(
                        $objetivo['idelemento'], $idusuario, $idelementotributa,
                        $enaprobacion, $arrayautoresact, $arrayinvolact, $start,
                        $limit, $idtipoelementotributa,
                        $idtipoelementotributasuperior, $arrayestados,
                        $busqueda, $arrayelementosrelacionados, $filtros,
                        $parametros
                    );
                    if ($tienehijos['total'] > 0) {
                        $leaf = false;
                    }
                }
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                if ($objetivo['idautor'] != $idusuario) {
                    $superior = 1;
                    $permisomodificacion
                        = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                        $idusuario, $objetivo['idautor']
                    );
                    if ($permisomodificacion) {
                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                        //$subordinado = $permisomodificacion[4];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                        //$subordinado = 0;
                    }
                    $subordinado
                        = $this->pIntegrator->configuracionpdo->existeSubordinacion(
                        $idusuario, $objetivo['idautor']
                    );
                }
                //verifico si se esta trabajando con el Flujo de Trabajo
                if ($utilizacionFT) {
                    $arraypermisos = array();
                    $arraypermisos
                        = $this->pIntegrator->workflow->obtenerPermisosPostAccion(
                        $idusuario, $objetivo['idestadoaprob'],
                        $idtipoelemento = 1
                    );
                    $modificar = $arraypermisos['modificar'];
                    $eliminar = $arraypermisos['eliminar'];
                }
                if ($objetivo['idestadoaprob'] != null) {
                    $arrayestadosaprob
                        = $this->pIntegrator->workflow->DenomEstado(
                        $objetivo['idestadoaprob']
                    );
                }
                $nombreestadoapro = '';
                if (isset($arrayestadosaprob[0])) {
                    $nombreestadoapro = $arrayestadosaprob[0]->denominacion;
                }
                $arrayobjetivos['resultado'][$key]['fechainicio']
                    = $objetivo['fechainicio'];
                $arrayobjetivos['resultado'][$key]['fechafin']
                    = $objetivo['fechafin'];
                /*$arrayobjetivos['resultado'][$key]['nombreautor']
                    = $this->integrator->seguridad->nombreUsuario(
                    $objetivo['idautor']
                );*/
                $arrayobjetivos['resultado'][$key]['nombreautor']
                    = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                    $objetivo['idautor'], 'usuario', null
                );

                $arrayobjetivos['resultado'][$key]['_parent'] = $parent;
                $arrayobjetivos['resultado'][$key]['_is_leaf'] = $leaf;
                $arrayobjetivos['resultado'][$key]['superior'] = $superior;
                $arrayobjetivos['resultado'][$key]['subordinado']
                    = $subordinado;
                $arrayobjetivos['resultado'][$key]['modificar']
                    = $modificar;
                $arrayobjetivos['resultado'][$key]['eliminar'] = $eliminar;
                $arrayobjetivos['resultado'][$key]['textocumplimiento']
                    = $objetivo['estadocumplimiento'];
                $arrayobjetivos['resultado'][$key]['estadocumplimiento']
                    = $objetivo['estadocumplimiento'] .
                    "(" . $objetivo['gradocumplimiento'] . "%)";
                $arrayobjetivos['resultado'][$key]['nombreestadoaprob']
                    = $nombreestadoapro;
                $arrayobjetivos['resultado'][$key]['observaciones']
                    = $objetivo['observaciones'];
                $arrayobjetivos['resultado'][$key]['criterios']
                    = $objetivo['criteriomedida'];

            }
        }
        return $arrayobjetivos;
    }

    public
    function buscarIdInArray($id, $array
    ) {
        foreach ($array as $value => $key) {
            if ($key['idelemento'] == $id) {
                return true;
            }
        }
        return false;
    }

    /**
     * Funcion para adicionar los objetivos
     */
    public
    function AdicionarObjetivo($parametros
    ) {
        $procede = 1;
        if ($parametros->eshija == 1) {
            $elementopadre = Doctrine::getTable('DatElementos')->find(
                $parametros->idobjetivopadre
            );
            if (!isset($elementopadre->idelemento)) {
                $procede = 0;
            }
        }
        if ($procede == 1) {
            /* $existeelemento = Doctrine::getTable('DatElementos')->findByDql(
              "denelemento = '$parametros->denelemento' AND idtipoelemento = 1"
              );
              if ($existeelemento[0]->idelemento) {
              $procede = 2;
              } else { */
            $objelemmodel = new CmpgestionarelementoModel();
            if ($parametros->retornar == 1) {
                $estadoaprobpordefcto = $parametros->idestadoaprob;
            } else {
                $estadoaprobpordefcto
                    = $objelemmodel->ObtenerEstadoAprobPorDefecto(
                    $parametros->idusuariocrea, $idtipodocumento = 1
                );
            }
            //validar si retorna null....
            $estadocumplimiento
                = $objelemmodel->actualizarEstadoCumplimiento(
                $estadocumplimiento, $parametros->gradocumplimiento
            );
            //se crea el objeto 'elemento' y se registra
            $objCmpgestionarelementomodel = new Cmpgestionarelementomodel();
            $datelemento = $objCmpgestionarelementomodel->AdicionarElemento(
                $parametros->denelemento, $parametros->descelemento,
                $parametros->gradocumplimiento, $parametros->idtipoelemento,
                $activo = 1, $estadocumplimiento, $estadoaprobpordefcto,
                $parametros->idusuariocrea, $parametros->dirigentes,
                $parametros->participantes
            );
            //se procede a crear la relacion padre-hijo
            if ($parametros->eshija == 1) {
                $idautorelemento = $elementopadre->idusuariocrea;
                if ($parametros->idusuariocrea == $idautorelemento) {
                    $origen = 0;
                } else {
                    $origen = 2;
                }
                $objelemelem = new DatElementosDatElementos();
                $objelemelem->idelementopadre
                    = $parametros->idobjetivopadre;
                $objelemelem->idelementohijo = $datelemento->idelemento;
                $objelemelem->origen = $origen;
                $objelemelem->idautor = $parametros->idusuariocrea;
                $objelemelem->save();
            }
            //se crea el objeto 'nomenclador-elemento' y se registra
            $idcategoriaobj = $parametros->idcategoriaobj;
            if ($idcategoriaobj) {
                $objelemnom = new DatElementosNomNomencladorModel();
                $objelemnom->AdicionarRelacionNomElem(
                    $datelemento, $idcategoriaobj, $tiponomenclador = 11
                );
            }
            //se crea el objeto 'objetivo' y se registra
            $datobjetivo = new DatObjetivo();
            $datobjetivo->idobjetivo = $datelemento->idelemento;
            $datobjetivo->fechainicio = $parametros->fechainicio;
            $datobjetivo->fechafin = $parametros->fechafin;
            $datobjetivo->tiempoestimado
                = ($parametros->tiempoestimado == '') ? 0
                : $parametros->tiempoestimado;
            $datobjetivo->save();
            //se crea el objeto 'nomenclador-elemento' y se registra

            if (isset($parametros->documentos[0])) {
                foreach ($parametros->documentos as $iddocumento) {
                    $objAsociarDoc = new DatElementosDocumento();
                    $objAsociarDoc->idelemento = $datelemento->idelemento;
                    $objAsociarDoc->iddocumento = $iddocumento->id;
                    $objAsociarDoc->save();
                }
            }
            //se relacionan los involucrados al elemento o objetivo
            $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
                $parametros->arrayinvolucrados, $datelemento->idelemento,
                $parametros->idtipoelemento
            );
            //se relacionan los elementos relacionados
            $objCmpgestionarelementomodel->RelacionarElementosAElementos(
                $datelemento->idelemento, $parametros->idtipoelemento,
                $parametros->arrayelementosrelacionados,
                $parentrelacidelemento = 'hijo', $parametros->idusuariocrea
            );
            if ($parametros->retornar == 1) {
                return $datobjetivo;
            }
            //Notificacion
            //***historial***
            $arrayinvolucrados = array();
            foreach ($parametros->arrayinvolucrados as $involucrado) {
                $arrayinvolucrados[] = $involucrado->idusuario;
            }
            $involucradoshisto = implode(',', $arrayinvolucrados);
            //***fin historial**
            $parametros->idobjetivo = $datobjetivo->idobjetivo;
            $objcmpgestionarobjetivosmodel = new CmpgestionarobjetivosModel();
            $objcambiohorario
                = $objcmpgestionarobjetivosmodel->CambioHorario(
                $parametros
            );
            $accion = 1;
            $idelemento = $parametros->idobjetivo;
            $idtipoelemento = 1;
            $idautor = $parametros->idusuariocrea;
            $fecha = date('d/m/Y H:i:s');
            $objNotificacion = new CmpnotificacionesModel();
            $objNotificacion->generarNotificacion(
                $accion, $idelemento, $idtipoelemento, $idautor, $fecha,
                $objcambiohorario, $parametros, $involucradoshisto
            );
            /* actualizo los valores de sus padres en dependencia de todos sus hijos */
            if ($parametros->eshija == 1) {
                self::actualizarObjvosPadres($datelemento->idelemento);
            }
            /* actualizo el % de cumplimiento de los planes con los
             * que est� relacionado el objetivo */
            $arrayPlanesE
                = DatElementosDatElementos::obtenerElemenRelacionados(
                $datelemento->idelemento, 0
            );
            $arrayPlanesA
                = DatElementosDatElementos::obtenerPlanRelacionadoObjvoARC(
                $datelemento->idelemento
            );
            $arrayPlanes = array_merge($arrayPlanesE, $arrayPlanesA);
            if (isset($arrayPlanes[0])) {
                CmpgestionarplanModel::actualizarPorcientoPlan(
                    $arrayPlanes
                );
            }
            // }
        }
        return $procede;
    }

    /**
     * Funcion para adicionar los criterios
     */
    public
    function AdicionarCriterio($parametros
    ) {
        $porcientocumplimiento = $this->CalcularPorCientoCumpCriterio(
            $parametros->valormeta, $parametros->valorreal
        );
        //validar si retorna null....
        $objelemmodel = new CmpgestionarelementoModel();
        $estadocumplimiento = $objelemmodel->actualizarEstadoCumplimiento(
            $estadocumplimiento, $porcientocumplimiento,
            $parametros->evaluacion
        );
        //se crea el objeto 'criterio' y se registra
        $datcriterio = new DatCriteriomedida();
        $datcriterio->dencriterio = $parametros->dencriterio;
        $datcriterio->descriterio = $parametros->descriterio;
        $datcriterio->participante = $parametros->participantes;
        $datcriterio->idobjetivo = $parametros->idobjetivo;
        $datcriterio->fechainicio
            = $parametros->fechainicio; //adddate($fechainicio);
        $datcriterio->fechafin
            = $parametros->fechafin; //$this->adddate($fechafin);
        $datcriterio->idusuariocrea = $parametros->idusuariocrea;
        $datcriterio->gradocumplimiento = round($porcientocumplimiento, 2);
        $datcriterio->estadocumplimiento = $estadocumplimiento;
        $datcriterio->valormeta = $parametros->valormeta;
        $datcriterio->valoreal = $parametros->valorreal;
        $datcriterio->idumedida = $parametros->idumedida;
        $datcriterio->evaluacion = $parametros->evaluacion;
        $datcriterio->save();
        $idcriterio = $datcriterio->idcriteriomedida;
        //se relacionan los involucrados al criterio
        $objelemmodel->InvolucrarUsuariosAElementos(
            $parametros->arrayinvolucrados, $idcriterio, 6, 0
        );
        if ($parametros->retornar == 1) {
            return $datcriterio;
        }
        return 1;
    }

    /**
     * Funcion para determinar si hubo cambio de fecha u horario (Ariadna RA)
     */
    public
    function CambioHorario($parametros
    ) {
        $objhorario = new stdClass();
        $idelem = $parametros->idobjetivo;
        $tabla = 'DatObjetivo';
        if ($parametros->idcriterio) {
            $idelem = $parametros->idcriterio;
            $tabla = 'DatCriteriomedida';
        }
        if (isset($parametros->fechainicio)
            || isset($parametros->fechafin)
        ) {
            $obj = Doctrine::getTable($tabla)->find($idelem);
            $fini = self::ConvertirFecha($obj->fechainicio, '-');
            $ffin = self::ConvertirFecha($obj->fechafin, '-');
            if (isset($parametros->fechainicio)
                && $fini != $parametros->fechainicio
            ) {
                $objhorario->fechainicioanterior = $fini;
                $objhorario->fechainicio = $parametros->fechainicio;
            }
            if (isset($parametros->fechafin)
                && $ffin != $parametros->fechafin
            ) {
                $objhorario->fechafinanterior = $ffin;
                $objhorario->fechafin = $parametros->fechafin;
            }
        }
        return $objhorario;
    }

    /**
     * Funcion para modificar la objetivo
     */
    public
    function ModificarObjetivo($parametros
    ) {

        $existeelemento = Doctrine::getTable('DatElementos')->findByDql(
            "idelemento != {$parametros->idobjetivo} AND idtipoelemento = 1
                AND denelemento = '$parametros->denelemento' "
        );

        if ($existeelemento[0]->idelemento) {
            $respuesta = 2;
        } else {
            $objelemento = Doctrine::getTable('DatElementos')->find(
                $parametros->idobjetivo
            );

            if (isset($objelemento->idelemento)) {
                $objelemmodel = new CmpgestionarelementoModel();
                $objelementoo = $objelemmodel->ModificarElemento(
                    $objelemento->idelemento, $parametros->denelemento,
                    $parametros->descelemento,
                    $parametros->gradocumplimiento,
                    $parametros->dirigentes, $parametros->participantes
                );
                $objobjetivo = Doctrine::getTable('DatObjetivo')->find(
                    $parametros->idobjetivo
                );
                $objobjetivo->fechainicio = $parametros->fechainicio;
                $objobjetivo->fechafin = $parametros->fechafin;
                $objobjetivo->tiempoestimado = ($parametros->tiempoestimado
                    == '') ? 0 : $parametros->tiempoestimado;
                $objobjetivo->save();
                //se modifica el objeto 'nomenclador-elemento' y se registra
                $idcategoriaobj = $parametros->idcategoriaobj;
                if ($idcategoriaobj) {
                    $objelemnom = new DatElementosNomNomencladorModel();
                    $objelemnom->ModificarRelacionNomElem(
                        $objelementoo, $idcategoriaobj,
                        $tiponomenclador = 11
                    );
                }
                $objCmpgestionarelementomodel
                    = new Cmpgestionarelementomodel();
                //se relacionan los involucrados al elemento o actividad
                $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
                    $parametros->arrayinvolucrados, $parametros->idobjetivo,
                    $idtipoelemento = 1
                );
                //se eliminan los involucrados al elemento o actividad
                $objCmpgestionarelementomodel->EliminarUsuariosAElementos(
                    $parametros->arrayinvolucradoseliminar,
                    $parametros->idobjetivo, $idtipoelemento = 1
                );
                //actualizo los asignaciones
                $this->ActualizarReasignaciones(
                    $objelementoo, $objobjetivo
                );
                if (isset($parametros->documentos[0])) {
                    foreach (
                        $parametros->documentos as /* $key => */
                        $iddocumento
                    ) {
                        $docElem = Doctrine::getTable(
                            'DatElementosDocumento'
                        )
                            ->findByDql(
                                "idelemento = $parametros->idobjetivo
                                    AND iddocumento = '$iddocumento->id'"
                            )->toArray();
                        if (count($docElem) == 0) {
                            $objAsociarDoc = new DatElementosDocumento();
                            $objAsociarDoc->idelemento
                                = $parametros->idobjetivo;
                            $objAsociarDoc->iddocumento = $iddocumento->id;
                            $objAsociarDoc->save();
                        }
                    }
                }
                $respuesta = 1;
                //actualizo el total ejecutado de mis padres
                self::actualizarObjvosPadres($parametros->idobjetivo);
                /* actualizo el % de cumplimiento de los planes con los
                 * que est� relacionado el objetivo */
                $arrayPlanesE
                    = DatElementosDatElementos::obtenerElemenRelacionados(
                    $parametros->idobjetivo, 0
                );
                $arrayPlanesA
                    = DatElementosDatElementos::obtenerPlanRelacionadoObjvoARC(
                    $parametros->idobjetivo
                );
                $arrayPlanes = array_merge($arrayPlanesE, $arrayPlanesA);
                if (isset($arrayPlanes[0])) {
                    CmpgestionarplanModel::actualizarPorcientoPlan(
                        $arrayPlanes
                    );
                }
            } else {
                $respuesta = 3;
            }
        }
        return $respuesta;
    }

    /**
     * Funcion para adicionar los criterios
     */
    public
    function ModificarCriterio($parametros
    ) {
        $objobjetivo = Doctrine::getTable('DatElementos')->find(
            $parametros->idobjetivo
        );
        if (isset($objobjetivo->idelemento)) {
            $datcriterio = Doctrine::getTable('DatCriteriomedida')->find(
                $parametros->idcriterio
            );
            if (isset($datcriterio->idcriteriomedida)) {

                $porcientocumplimiento
                    = $this->CalcularPorCientoCumpCriterio(
                    $parametros->valormeta, $parametros->valorreal,
                    $datcriterio->evaluacion
                );
                //validar si retorna null....
                $objelemmodel = new CmpgestionarelementoModel();
                $datcriterio->dencriterio = $parametros->dencriterio;
                $datcriterio->descriterio = $parametros->descriterio;
                $datcriterio->idobjetivo = $parametros->idobjetivo;
                $datcriterio->fechainicio
                    = $parametros->fechainicio; //adddate($fechainicio);
                $datcriterio->fechafin
                    = $parametros->fechafin; //$this->adddate($fechafin);
                $datcriterio->gradocumplimiento = round(
                    $porcientocumplimiento, 2
                );
                $datcriterio->valormeta = $parametros->valormeta;
                $datcriterio->valoreal = $parametros->valorreal;
                if (!isset($parametros->accion)) {
                    $datcriterio->evaluacion = $parametros->evaluacion;
                    $datcriterio->descriterio = $parametros->descriterio;
                    $datcriterio->participante = $parametros->participantes;
                    $datcriterio->idumedida = $parametros->idumedida;
                }
                $estadocumplimiento
                    = $objelemmodel->actualizarEstadoCumplimiento(
                    $estadocumplimiento, $porcientocumplimiento,
                    $datcriterio->evaluacion
                );
                $datcriterio->estadocumplimiento = $estadocumplimiento;
                $datcriterio->save();
                $respuesta = 1;
            } else {
                $respuesta = 3;
            }
        } else {
            $respuesta = 0;
        }
        return $respuesta;
    }

    /**
     * Funcion para eliminar los objetivos
     */
    public
    function EliminarObjetivos($arrayidobjetivos, $idusuariosession
    ) {
        foreach ($arrayidobjetivos as $idobjetivo) {
            //antes de eliminar busco su padre para actualizar sus valores
            $objElemElem = new DatElementosDatElementos();
            $objvoPadre = $objElemElem->obtenerPadreInmediato($idobjetivo);
            
            //antes de eliminar busco los planes relacionados al objetivo
            $arrayPlanesE = $objElemElem->obtenerElemenRelacionados(
                $idobjetivo, 0
            );
            
            $arrayPlanesA
                = DatElementosDatElementos::obtenerPlanRelacionadoObjvoARC(
                $idobjetivo
            );
            
            $arrayPlanes = array_merge($arrayPlanesE, $arrayPlanesA);

            $noeliminados = 0;
            $respuesta = 1;
            $objelemento = Doctrine::getTable('DatElementos')->find(
                $idobjetivo
            );
            
            if (isset($objelemento->idelemento)) {
                
                //obtengo y elimino los asignaciones
                $this->EliminarReasignaciones(
                    $objelemento, $idusuariosession
                );
                $objcmpelementosmodel = new CmpgestionarelementoModel();
                $datelementosDatElementos = new DatElementosDatElementos();
                foreach ($arrayidobjetivos as $idobjetivo) {
                    $descendencia
                        = $datelementosDatElementos->BuscarDescendenciaDelElemento(
                        $idobjetivo,
                        array(0 => array('idtipoelemento' => 1)),
                        array(0 => array('origen' => 0)), $idusuariosession
                    );
                    $descendencia[] = $idobjetivo;                    
                    $objcmpelementosmodel->EliminarElementos($descendencia);
                    
                    if (count($descendencia) > 1) {
                        $noeliminados += count($descendencia);
                    }
                }
            } else {
                $noeliminados++;
            }
            //print_r($objvoPadre);die;
            //Despues de eliminar actualizo a los padres de los eliminados
            if (isset($objvoPadre[0])) {
                CmpgestionaractividadesModel::actualizarObjvsRelacionados(
                    $objvoPadre

                );
            }
            /* actualizo el % de cumplimiento de los planes con los
             * que estaba relacionado el objetivo */
            if (isset($arrayPlanes[0])) {
                CmpgestionarplanModel::actualizarPorcientoPlan(
                    $arrayPlanes
                );
            }
        }
        if ($noeliminados > 0
            && $noeliminados == count(
                $arrayidobjetivos
            )
        ) {
            $respuesta = 0;
        }
        DatElementosDocumentoModel::EliminarDocumentoByIdElemento(
            $arrayidobjetivos
        );
        return $respuesta;
    }

    /**
     * Funcion para eliminar los criterios
     */
    public
    function EliminarCriterios($arrayidcriterios
    ) {
        foreach ($arrayidcriterios as $idcriterio) {
            $noeliminados = 0;
            $respuesta = 1;
            $objcriterio = Doctrine::getTable('DatCriteriomedida')->find(
                $idcriterio
            );
            if (isset($objcriterio->idcriteriomedida)) {
                $objcriterio->delete();
            } else {
                $noeliminados++;
            }
        }
        if ($noeliminados > 0
            && $noeliminados == count(
                $arrayidcriterios
            )
        ) {
            $respuesta = 0;
        }
        return $respuesta;
    }

    /**
     * Funcion de trabajo con fecha para el plan
     */
    function adddate($fecha)
    {
        $data = explode("/", $fecha);
        $date = new DateTime();
        $date->setDate($data[2], $data[1], $data[0]);
        $format = $this->global->Formato->fecha;
        $day = $date->format("$format");
        return $day;
    }

    public
    function ConvertirFecha($fecha, $tiposeparador
    ) {
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

    public
    function ObtenerDatosMes($fecha
    ) {
        $fecha = explode('-', $fecha);
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

    public
    function ActualizarReasignaciones($objelemento/* , $objobjetivo */
    )
    {
        $tienereasignaciones = DatElementosDatElementos::
        ObtenerReasignacionesDadoActividad($objelemento->idelemento);
        if (isset($tienereasignaciones[0])) {
            foreach (
                $tienereasignaciones as /* $key => */
                $reasignacion
            ) {
                $existe = 0;
                $objelemreasig = Doctrine::getTable('DatElementos')->find(
                    $reasignacion['idelementohijo']
                );
                if (isset($objelemreasig->idelemento)) {
                    $existe = 1;
                    $objelemreasig->denelemento = $objelemento->denelemento;
                    $objelemreasig->descelemento
                        = $objelemento->descelemento;
                    $objelemreasig->participante
                        = $objelemento->participante;
                    $objelemreasig->dirigente = $objelemento->dirigente;
                    $objelemreasig->save();
                }
                $objobjreasig = Doctrine::getTable('DatObjetivo')->find(
                    $reasignacion['idelementohijo']
                );
                if (isset($objobjreasig->idobjetivo)) {
                    $existe = 1;
                    $objobjreasig->fechainicio = $objact->fechainicio;
                    $objobjreasig->fechafin = $objact->fechafin;
                    $objobjreasig->save();
                }
                if ($existe == 1) {
                    $this->ActualizarReasignaciones(
                        $objelemreasig, $objobjreasig
                    );
                }
            }
        }
    }

    public
    function EliminarReasignaciones($objelemento, $idusuariosession
    ) {
        $tienereasignaciones = DatElementosDatElementos::
        ObtenerReasignacionesDadoActividad($objelemento->idelemento);
        if (isset($tienereasignaciones[0])) {
            foreach (
                $tienereasignaciones as /* $key => */
                $reasignacion
            ) {
                $arrayidobjetivos[] = $reasignacion['idelementohijo'];
            }
            $this->EliminarObjetivos($arrayidobjetivos, $idusuariosession);
        }
    }

    /**
     * Funcion para cargar los criterios
     */
    public
    function CargarCriterios($idobjetivo, $idusuario, $limit, $start
    ) {
        $existeobjetivo = Doctrine::getTable('DatElementos')->find(
            $idobjetivo
        );
        if (isset($existeobjetivo->idelemento)) {
            $objdatobjetivo = new DatObjetivo();
            $arraycriterios = $objdatobjetivo->CargarCriterios(
                $idobjetivo, $idusuario, $limit, $start
            );
            if (isset($arraycriterios['resultado'])) {
                foreach ($arraycriterios['resultado'] as $key => $criterio) {
                    $superior = 0;
                    $modificar = 1;
                    $eliminar = 1;
                    $subordinado = 1;
                    if ($criterio['idautor'] != $idusuario) {
                        $superior = 1;
                        $permisomodificacion
                            = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                            $idusuario, $criterio['idautor']
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

                    $arraycriterios['resultado'][$key]['nombreautor']
                        = $this->integrator->seguridad->nombreUsuario(
                        $criterio['idautor']
                    );
                    $arraycriterios['resultado'][$key]['evaluacion']
                        = $this->CalcularEvaluacion(
                        $arraycriterios['resultado'][$key]
                    );
                    $arraycriterios['resultado'][$key]['superior']
                        = $superior;
                    $arraycriterios['resultado'][$key]['subordinado']
                        = $subordinado;
                    $arraycriterios['resultado'][$key]['modificar']
                        = $modificar;
                    $arraycriterios['resultado'][$key]['eliminar']
                        = $eliminar;
                    $arraycriterios['resultado'][$key]['estadocumplimiento']
                        = $criterio['estadocumplimiento'] .
                        "(" . $criterio['gradocumplimiento'] . "%)";
                    $arraycriterios['resultado'][$key]['nombreestadoaprob']
                        = $nombreestadoapro;
                }
            }
        }
        return $arraycriterios;
    }

  /**
   * Funcion para cargar los criterios
   */
  public
  function CargarCriteriosIndicadores($idobjetivo,$idindicadorobjcrit,$relacionado_indicador, $idusuario, $limit, $start
  ) {
    $existeobjetivo = Doctrine::getTable('DatElementos')->find(
      $idobjetivo
    );
    if (isset($existeobjetivo->idelemento)) {
      $objdatobjetivo = new DatObjetivo();
      $arraycriterios = $objdatobjetivo->CargarCriteriosIndicadores(
        $idobjetivo, $idindicadorobjcrit, $relacionado_indicador, $idusuario, $limit, $start
      );
      if (isset($arraycriterios['resultado'])) {
        foreach ($arraycriterios['resultado'] as $key => $criterio) {
          $superior = 0;
          $modificar = 1;
          $eliminar = 1;
          $subordinado = 1;
          if ($criterio['idautor'] != $idusuario) {
            $superior = 1;
            $permisomodificacion
                      = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
              $idusuario, $criterio['idautor']
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

          $arraycriterios['resultado'][$key]['nombreautor']
            = $this->integrator->seguridad->nombreUsuario(
            $criterio['idautor']
          );
          $arraycriterios['resultado'][$key]['evaluacion']
            = $this->CalcularEvaluacion(
            $arraycriterios['resultado'][$key]
          );
          $arraycriterios['resultado'][$key]['superior']
            = $superior;
          $arraycriterios['resultado'][$key]['subordinado']
            = $subordinado;
          $arraycriterios['resultado'][$key]['modificar']
            = $modificar;
          $arraycriterios['resultado'][$key]['eliminar']
            = $eliminar;
          $arraycriterios['resultado'][$key]['estadocumplimiento']
            = $criterio['estadocumplimiento'] .
            "(" . $criterio['gradocumplimiento'] . "%)";
          $arraycriterios['resultado'][$key]['nombreestadoaprob']
            = $nombreestadoapro;
        }
      }
    }
    return $arraycriterios;
  }

    public
    function CalcularEvaluacion($array
    ) {
        if ($array['evaluacion'] == '1') {
            return $array['valormeta'] <= $array['valoreal'] ? 1 : 0;
        } else {
            return $array['valormeta'] >= $array['valoreal'] ? 1 : 0;
        }
    }

    public
    function CalcularPorCientoCumpCriterio($valormeta, $valorreal,
        $evaluacion
    ) {
        if (isset($evaluacion) && $evaluacion == '0') {
            if ($valorreal < 0) {
                $porcientocump = (-1) * (((($valorreal - $valormeta) * 100)
                        / $valormeta));
            } else {
                $porcientocump = (-1) * (($valorreal * 100) / $valormeta);
            }
        } else {
            $porcientocump = ($valorreal * 100) / $valormeta;
        }
        return $porcientocump;
    }

    public
    function ReorganizarSubObjetivos($datos
    ) {
        $reordenado = 0;
        if (isset($datos->arraysubobjetivos[0])) {
            foreach (
                $datos->arraysubobjetivos as /* $key => */
                $subobjetivo
            ) {
                $objelemento = Doctrine::getTable('DatElementos')->find(
                    $subobjetivo->idelemento
                );
                if (isset($objelemento->idelemento)) {
                    if (isset($subobjetivo->_parent)) {
                        $idelementopadre = $subobjetivo->_parent;
                        $idelementohijo = $subobjetivo->idelemento;
                        $origen = 0;
                        $arrayobjrelacion = Doctrine::getTable(
                            'DatElementosDatElementos'
                        )->findByDql(
                            "idelementopadre = '$idelementopadre'
                                AND idelementohijo = '$idelementohijo' 
                                    AND origen = '$origen' "
                        );
                        if (isset($arrayobjrelacion[0]->idelementopadre)
                            && $arrayobjrelacion[0]->idelementopadre != ''
                        ) {
                            $arrayobjrelacion->delete();
                        }
                    } else {
                        $idelementohijo = $subobjetivo->idelemento;
                        $origen = 0;
                    }
                    $objrelacion = new DatElementosDatElementos();
                    $objrelacion->idelementopadre
                        = $datos->arrayobjetivospadres[0]->idelemento;
                    $objrelacion->idelementohijo = $idelementohijo;
                    $objrelacion->origen = $origen;
                    $objrelacion->idautor = $datos->idusuariosession;
                    $objrelacion->save();
                    $reordenado++;
                }
                //actualiza el % de los viejos objs padres
                $arrayobjvs[0] = $subobjetivo->_parent;
                if (isset($subobjetivo->_parent)) {
                    CmpgestionaractividadesModel::actualizarObjvsRelacionados(
                        $arrayobjvs
                    );
                }
            }
        }
        //actualiza el % de los nuevos objs padres
        $arrayobjvs[0] = $datos->arrayobjetivospadres[0]->idelemento;
        CmpgestionaractividadesModel::actualizarObjvsRelacionados(
            $arrayobjvs
        );
        if ($reordenado == 0) {
            $respuesta = 0;
        } else {
            $respuesta = 1;
        }
        return $respuesta;
    }

    /*
     * Devuelve los criterios de medida para las graficas
     * */

    public
    function cargarCriterioM($parametros
    ) {
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 1
        );
        if (isset($arrayestadosver[0])) {
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        $objDatObj = new DatObjetivo();
        $arrayObj = $objDatObj->objConCriterio($parametros);
        foreach ($arrayObj as $key => $value) {
            $categories[$key] = $value['denelemento'];
            $meta = $objDatObj->objValorMeta(
                $value['idobjetivo'], 0, $parametros
            );
            $arrayMeta[$key] = (float)$meta[0];
            $real = $objDatObj->objValorMeta(
                $value['idobjetivo'], 1, $parametros
            );
            $arrayReal[$key] = (float)$real[0];
            $arrayEficiencia[$key] = round($real[0] * 100 / $meta[0], 2);
        }
        $data = Array(
            array(
                "name"  => 'Valor meta',
                "data"  => $arrayMeta,
                "color" => '#72D572',
            ), array(
                "name"  => 'Valor real',
                "data"  => $arrayReal,
                "color" => '#F6915C',
            )
        );
        if (isset($parametros->eficiencia)
            && $parametros->eficiencia == 1
        ) {
            $data = Array(
                array(
                    "name"  => 'Eficiencia',
                    "data"  => $arrayEficiencia,
                    "color" => '#77C2F8',
                )
            );
        }
        $result = Array($data, $categories);
        return $result;
    }

    /**
     * Funcion para Actualizar el porcentaje de cumplimiento del padre
     */
    public
    function actualizarObjvosPadres($objv
    ) {
        $objvosPadres = array();
        CmpgestionaractividadesModel::BuscarSuperiores(
            $objv, $objvosPadres, '=', 0
        );
        //por cada padre actualizo sus valores el % es elpromedio de los de sus hijos.
        for ($i = count($objvosPadres) - 1; $i >= 0; $i--) {
            $suma = 0;
            $cant = 0;
            $objElemElem = new DatElementosDatElementos();
            $objvosHijos = $objElemElem->obtenerHijosInmediatos(
                $objvosPadres[$i]
            );
            //Sumo los gradocumplimiento de todos sus objs hijos
            if (isset($objvosHijos[0])) {
                foreach ($objvosHijos as $objvoHijo) {
                    $objObjvoHijo = Doctrine::getTable('DatElementos')
                        ->find($objvoHijo);
                    $suma += $objObjvoHijo->gradocumplimiento;
                    $cant++;
                }
            }
            //obtengo todas las actividades relacionadas al objetivo
            $arrayactividades = $objElemElem->ObtenerActsRelacionadas(
                $objvosPadres[$i]
            );
            //Sumo los gradocumplimiento de todas las acts hijas
            if (isset($arrayactividades[0])) {
                foreach ($arrayactividades as $acts) {
                    $objActividad = Doctrine::getTable('DatElementos')
                        ->find(
                            $acts
                        );
                    $suma += $objActividad->gradocumplimiento;
                    $cant++;
                }
            }

            //el grado de cumplimiento del padre (%)
            $objelementopadre = Doctrine::getTable('DatElementos')->find(
                $objvosPadres[$i]
            );
            //calcular el % de cumplimiento del objvo
            $objelementopadre->gradocumplimiento = $suma / $cant;
            //Actualizar el estatus de cumplimiento del objvo
            $objelemmodel = new CmpgestionarelementoModel();
            $estadocumplimiento
                = $objelemmodel->actualizarEstadoCumplimiento(
                $estadocumplimiento, $objelementopadre->gradocumplimiento
            );
            $objelementopadre->estadocumplimiento = $estadocumplimiento;
            $objelementopadre->save();
        }
    }

    public
    function hacerRaizObjetivo($arraysubobjetivos
    ) {
        $origen = 0;
        foreach ($arraysubobjetivos as $subobjetivo) {
            $arrayobjrelacion = Doctrine::getTable(
                'DatElementosDatElementos'
            )->findByDql(
                "idelementohijo = '$subobjetivo'
                                    AND origen = '$origen' "
            );
            if (isset($arrayobjrelacion[0]->idelementopadre)
                && $arrayobjrelacion[0]->idelementopadre != ''
            ) {
                $arrayobjrelacion->delete();
                $respuesta = 1;
            } else {
                $respuesta = 0;
            }
        }
        return $respuesta;
    }

    public
    function AdicionarObjetivoImportar($parametros
    ) {
        $procede = 1;
        if ($parametros->eshija == 1) {
            $elementopadre = Doctrine::getTable('DatElementos')->find(
                $parametros->idobjetivopadre
            );
            if (!isset($elementopadre->idelemento)) {
                $procede = 0;
            }
        }
        if ($procede == 1) {
            /* $existeelemento = Doctrine::getTable('DatElementos')->findByDql(
              "denelemento = '$parametros->denelemento' AND idtipoelemento = 1"
              );
              if ($existeelemento[0]->idelemento) {
              $procede = 2;
              } else { */
            $objelemmodel = new CmpgestionarelementoModel();
            if ($parametros->retornar == 1) {
                $estadoaprobpordefcto = $parametros->idestadoaprob;
            } else {
                $estadoaprobpordefcto
                    = $objelemmodel->ObtenerEstadoAprobPorDefecto(
                    $parametros->idusuariocrea, $idtipodocumento = 1
                );
            }
            //validar si retorna null....
            $estadocumplimiento
                = $objelemmodel->actualizarEstadoCumplimiento(
                $estadocumplimiento, $parametros->gradocumplimiento
            );
            //se crea el objeto 'elemento' y se registra
            $objCmpgestionarelementomodel = new Cmpgestionarelementomodel();
            $datelemento = $objCmpgestionarelementomodel->AdicionarElemento(
                $parametros->denelemento, $parametros->descelemento,
                $parametros->gradocumplimiento, $parametros->idtipoelemento,
                $activo = 1, $estadocumplimiento, $estadoaprobpordefcto,
                $parametros->idusuariocrea, $parametros->dirigentes,
                $parametros->participantes
            );
            //se procede a crear la relacion padre-hijo
            if ($parametros->eshija == 1) {
                $idautorelemento = $elementopadre->idusuariocrea;
                if ($parametros->idusuariocrea == $idautorelemento) {
                    $origen = 0;
                } else {
                    $origen = 2;
                }
                $objelemelem = new DatElementosDatElementos();
                $objelemelem->idelementopadre
                    = $parametros->idobjetivopadre;
                $objelemelem->idelementohijo = $datelemento->idelemento;
                $objelemelem->origen = $origen;
                $objelemelem->idautor = $parametros->idusuariocrea;
                $objelemelem->save();
            }
            //se crea el objeto 'nomenclador-elemento' y se registra
            $idcategoriaobj = $parametros->idcategoriaobj;
            if ($idcategoriaobj) {
                $objelemnom = new DatElementosNomNomencladorModel();
                $objelemnom->AdicionarRelacionNomElem(
                    $datelemento, $idcategoriaobj, $tiponomenclador = 11
                );
            }
            //se crea el objeto 'objetivo' y se registra
            $datobjetivo = new DatObjetivo();
            $datobjetivo->idobjetivo = $datelemento->idelemento;
            $datobjetivo->fechainicio = $parametros->fechainicio;
            $datobjetivo->fechafin = $parametros->fechafin;
            $datobjetivo->tiempoestimado
                = ($parametros->tiempoestimado == '') ? 0
                : $parametros->tiempoestimado;
            $datobjetivo->save();
            //se crea el objeto 'nomenclador-elemento' y se registra

            if (isset($parametros->documentos[0])) {
                foreach ($parametros->documentos as $iddocumento) {
                    $objAsociarDoc = new DatElementosDocumento();
                    $objAsociarDoc->idelemento = $datelemento->idelemento;
                    $objAsociarDoc->iddocumento = $iddocumento->id;
                    $objAsociarDoc->save();
                }
            }
            //se relacionan los involucrados al elemento o objetivo
            $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
                $parametros->arrayinvolucrados, $datelemento->idelemento,
                $parametros->idtipoelemento
            );
            //se relacionan los elementos relacionados
            $objCmpgestionarelementomodel->RelacionarElementosAElementos(
                $datelemento->idelemento, $parametros->idtipoelemento,
                $parametros->arrayelementosrelacionados,
                $parentrelacidelemento = 'hijo', $parametros->idusuariocrea
            );
            if ($parametros->retornar == 1) {
                return $datobjetivo;
            }
            //Notificacion
            //***historial***
            $arrayinvolucrados = array();
            foreach ($parametros->arrayinvolucrados as $involucrado) {
                $arrayinvolucrados[] = $involucrado->idusuario;
            }
            $involucradoshisto = implode(',', $arrayinvolucrados);
            //***fin historial**
            $parametros->idobjetivo = $datobjetivo->idobjetivo;
            $objcmpgestionarobjetivosmodel = new CmpgestionarobjetivosModel();
            $objcambiohorario
                = $objcmpgestionarobjetivosmodel->CambioHorario(
                $parametros
            );
            $accion = 1;
            $idelemento = $parametros->idobjetivo;
            $idtipoelemento = 1;
            $idautor = $parametros->idusuariocrea;
            $fecha = date('d/m/Y H:i:s');
            $objNotificacion = new CmpnotificacionesModel();
            $objNotificacion->generarNotificacion(
                $accion, $idelemento, $idtipoelemento, $idautor, $fecha,
                $objcambiohorario, $parametros, $involucradoshisto
            );
            /* actualizo los valores de sus padres en dependencia de todos sus hijos */
            if ($parametros->eshija == 1) {
                self::actualizarObjvosPadres($datelemento->idelemento);
            }
            /* actualizo el % de cumplimiento de los planes con los
             * que est� relacionado el objetivo */
            $arrayPlanesE
                = DatElementosDatElementos::obtenerElemenRelacionados(
                $datelemento->idelemento, 0
            );
            $arrayPlanesA
                = DatElementosDatElementos::obtenerPlanRelacionadoObjvoARC(
                $datelemento->idelemento
            );
            $arrayPlanes = array_merge($arrayPlanesE, $arrayPlanesA);
            if (isset($arrayPlanes[0])) {
                CmpgestionarplanModel::actualizarPorcientoPlan(
                    $arrayPlanes
                );
            }
            // }
        }
        return $idelemento;
    }
	
	/**
     * @param array $listadoId Arreglo de objetivos o de criterios de medida
     * @param text $campo Nombre del campo por el que se filtra (idobjetivo o idcriteriomedida)
     * @param int $porciento Porciento de cumplimiento del criterio de medida (0 - 100)
     * @return Doctrine_Collection
     * @author Drisis Silvia Diaz Rodriguez
     * @created 28/05/2018
     */
    public function actualizarPorcientoCM($listadoId, $campo, $porciento){
        //$parametros->idusuariocrea = $this->global->Perfil->idusuario;
        //para generar notificaciones (Ariadna RA)
        switch($porciento){
            case 0: $estado = 'Sin cumplir';
                break;
            case 100: $estado = 'Cumplido';
                break;
            default: $estado = 'Parcialmente cumplido';
        }
       return DatCriteriomedida::actualizarPorcientoCM($listadoId, $campo, $porciento, $estado);

       /*if ($respuesta) {
            $accion = 2;
            $idelemento = $parametros->idcriterio;
            $idtipoelemento = 4;
            $idautor = $parametros->idusuariocrea;
            $fecha = date('d/m/Y H:i:s');
            $objNotificacion = new CmpnotificacionesModel();
            $objNotificacion->generarNotificacion(
                $accion, $idelemento, $idtipoelemento, $idautor, $fecha,
                $objcambiohorario, $parametros, ''
            );
            return true;
        }

        return false;*/
    }

}
