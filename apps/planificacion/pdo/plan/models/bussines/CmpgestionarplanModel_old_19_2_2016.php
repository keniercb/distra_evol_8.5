<?php

/**
 * @author    Nestor Bernal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpgestionarplanModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para cargar los planes
     */
    public function CargarPlanes(
        $nodo, $idusuario, $iddominio, $certificado, $enaprobacion,
        $arrayautores, $categplan, $offset, $limit, $filtros, $parametros
    ) {
        $arrayautplan = array();
        if (!isset($arrayautores[0])) {
            $arrayautplan[]['idusuario'] = $idusuario;
            if ($enaprobacion) {
                //Caso de cargar los planes creados por mi y mis 
                //subordinados(en estado de aprobacion)	
                /*$subordinados =*/
                $this->pIntegrator->configuracionpdo->DameSubordinados(
                    $certificado, $iddominio, $idusuario
                );
                $permisosubordinados
                    = $this->pIntegrator->configuracionpdo->DamePermisoSubordinados(
                    $idusuario
                );
                if (isset($permisosubordinados[0])) {
                    foreach ($permisosubordinados as $subrod) {
                        $arrayautplan[]['idusuario'] = $subrod['idpsobre'];
                    }
                }
            }
        } else {
            if (isset($arrayautores[0])) {
                foreach ($arrayautores as $autor) {
                    $idautor = $autor->idautor;
                    if ($autor->tipo == 0) {
                        $arrayusuarios
                            = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupoGU(
                            $idautor
                        );
                        if (isset($arrayusuarios[0])) {
                            foreach ($arrayusuarios as $usuario) {
                                $arrayautplan[]['idusuario']
                                    = $usuario["idusuario"];
                            }
                        }
                    } else {
                        $arrayautplan[]['idusuario'] = $autor->idautor;
                    }
                }
            }
        }
        $filtroestados = 0;
        $utilizacionFT = 0;
        $arrayestados = array();
        if (isset($filtros[0])) {
            $utilizacionFT = 1;
            foreach ($filtros as $filtro) {
                if ($filtro['field'] == 'nombreestadoaprob') {
                    $filtroestados = 1;
                    $arrayestados[0]['idestado'] = $filtro['data']['value'];
                }
            }
        }
        if ($filtroestados == 0) {
            $arrayestados = $this->pIntegrator->workflow->EstadosVerDoc(
                $idusuario, $idtipodoc = 0
            );
            if (isset($arrayestados[0])) {
                $utilizacionFT = 1;
            }
        }
        $objelemmodel = new CmpgestionarelementoModel();
        $estadoaprobpordefcto = $objelemmodel->ObtenerEstadoAprobPorDefecto(
            $idusuario, $idtipodocumento = 0
        );
        if (isset($arrayautplan[0])) {
            $arrayplaness = DatPlanPdo::CargarPlanes(
                $arrayautplan, $arrayestados, $categplan, $offset, $limit,
                $estadoaprobpordefcto, $idusuario, $filtros, $parametros
            );
            $arrayplanes = $arrayplaness[1];
            if (isset($arrayplanes[0]['idelemento'])) {
                foreach ($arrayplanes as $key => $plan) {
                    $superior = 0;
                    $modificar = 1;
                    $eliminar = 1;
                    $subordinado = 1;
                    /* $entrada = 1;*/
                    if ($plan['idusuariocrea'] != $idusuario) {
                        $superior = 1;
                        $permisomodificacion
                            = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                            $idusuario, $plan['idusuariocrea'], $certificado,
                            $iddominio
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
                        $subordinado
                            = $this->pIntegrator->configuracionpdo->existeSubordinacion(
                            $idusuario, $plan['idusuariocrea']
                        );
                    }
                    //verifico si se esta trabajando con el Flujo de Trabajo
                    if ($utilizacionFT) {
                        $arraypermisos = array();
                        $arraypermisos
                            = $this->pIntegrator->workflow->obtenerPermisosPostAccion(
                            $idusuario, $plan['idestadoaprob'],
                            $idtipoelemento = 0
                        );
                        $modificar = $arraypermisos['modificar'];
                        $eliminar = $arraypermisos['eliminar'];
                    }
                    if ($plan['idestadoaprob'] != null) {
                        $arrayestadosaprob
                            = $this->pIntegrator->workflow->DenomEstado(
                            $plan['idestadoaprob']
                        );
                    }
                    $nombreestadoapro = '';
                    if (isset($arrayestadosaprob[0])) {
                        $nombreestadoapro = $arrayestadosaprob[0]->denominacion;
                    }
                    $arrayplanes[$key]['fechainicio'] = $plan['fechainicio'];
                    $arrayplanes[$key]['fechafin'] = $plan['fechafin'];
                    $arrayplanes[$key]['nombreautor']
                        = $this->integrator->seguridad->nombreUsuario(
                        $plan['idusuariocrea']
                    );
                    $arrayplanes[$key]['textocumplimiento']
                        = $plan['estadocumplimiento'];
                    $arrayplanes[$key]['estadocumplimiento']
                        = $plan['estadocumplimiento'] . "("
                        . $plan['gradocumplimiento'] . "%)";
                    $arrayplanes[$key]['nombreestadoaprob'] = $nombreestadoapro;
                    $arrayplanes[$key]['_is_leaf'] = true;
                    $arrayplanes[$key]['_parent'] = null;
                    $arrayplanes[$key]['superior'] = $superior;
                    $arrayplanes[$key]['subordinado'] = $subordinado;
                    $arrayplanes[$key]['modificar'] = $modificar;
                    $arrayplanes[$key]['eliminar'] = $eliminar;
                }
                $arrayplaness[1] = $arrayplanes;
            }
        } else {
            $arrayplaness = array();
        }
        return $arrayplaness;
    }

    /**
     * Funcion para adicionar los planes
     */
    public function AdicionarPlan(
        $idusuariocrea, $denelemento, $descelemento, $gradocumplimiento,
        $idcategoria, $idestadocump, $fechainicio, $fechafin, $idtipoelemento,
        $documentos, $arraydesvasociadas
    ) {
        /*$temp = DatElementos::ExisteElementoNombreTipo(
            $idusuariocrea, $denelemento, $idtipoelemento
        );
        if (!isset($temp[0])) {*/
        $objelemmodel = new CmpgestionarelementoModel();
        $estadoaprobpordefcto = $objelemmodel->ObtenerEstadoAprobPorDefecto(
            $idusuariocrea, $idtipodocumento = 0
        );
        //validar si retorna null....
        $estadocumplimiento = $objelemmodel->actualizarEstadoCumplimiento(
            $estadocumplimiento, $gradocumplimiento
        );
        //se crea el objeto 'elemento' y se registra
        $objCmpgestionarelementomodel = new Cmpgestionarelementomodel();
        $datelemento = $objCmpgestionarelementomodel->AdicionarElemento(
            $denelemento, $descelemento, $gradocumplimiento,
            $idtipoelemento, $activo = 1, $estadocumplimiento,
            $estadoaprobpordefcto, $idusuariocrea, $dirigente = null,
            $participante = null
        );
        //se crea el objeto 'nomenclador-elemento' y se registra
        $objelemnom = new DatElementosNomNomencladorModel();
        /*$elemnom = */
        $objelemnom->AdicionarRelacionNomElem(
            $datelemento, $idcategoria, $tiponomenclador = 0
        );
        //se crea el objeto 'plan' y se registra
        $datplanpdo = new DatPlanPdo();
        $datplanpdo->idplan = $datelemento->idelemento;
        $datplanpdo->fechainicio
            = $fechainicio; //adddate($fechainicio);
        $datplanpdo->fechafin
            = $fechafin; //$this->adddate($fechafin);
        $datplanpdo->save();
        if (isset($documentos[0])) {
            foreach (
                $documentos as /*$key =>*/
                $iddocumento
            ) {
                $objAsociarDoc = new DatElementosDocumento();
                $objAsociarDoc->idelemento = $datelemento->idelemento;
                $objAsociarDoc->iddocumento = $iddocumento->id;
                $objAsociarDoc->save();
            }
        }
        if (isset($arraydesvasociadas[0])) {
            foreach ($arraydesvasociadas as $iddesviacion) {
                $objDatElementosDatElementos = new DatElementosDatElementos();
                $objDatElementosDatElementos->idelementopadre
                    = $iddesviacion;
                $objDatElementosDatElementos->idelementohijo
                    = $datelemento->idelemento;
                $objDatElementosDatElementos->idautor = $idusuariocrea;
                $datelementoplan = Doctrine::getTable('DatElementos')
                    ->findByDql(
                        "idelemento = '$iddesviacion'
                                AND idusuariocrea = '$idusuariocrea'"
                    );
                if (($datelementoplan[0]->idelemento)) {
                    $objDatElementosDatElementos->origen = 1;
                } else {
                    $objDatElementosDatElementos->origen = 3;
                }
                $objDatElementosDatElementos->save();
            }
        }

        //***historial***
        $idplan = $datplanpdo->idplan;
        $objhisto->denelemento = $denelemento;
        $objhisto->descelemento = $descelemento;
        $objhisto->dirigente = '';
        $objhisto->gradocumplimiento = $gradocumplimiento;
        $objhisto->participante = '';
        //***
        $objcmpgestionarplanmodel = new CmpgestionarplanModel();
        $objcambiohorario = $objcmpgestionarplanmodel->CambioHorario(
            $idplan, $fechainicio, $fechafin
        );
        $objNotificacion = new CmpnotificacionesModel();
        $accion = 1;
        $idelemento = $idplan;
        $idtipoelemento = 0;
        $idautor = $idusuariocrea;
        $fecha = date('d/m/Y H:i:s');
        $objNotificacion->generarNotificacion(
            $accion, $idelemento, $idtipoelemento, $idautor, $fecha,
            $objcambiohorario, $objhisto, ''
        );

        return false;
        //} else {
        //En caso de que exista un elemento de igual nombre para el mismo usuario.
        //  return true;
        // }
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

    /**
     * Funcion para determinar si hubo cambio de fecha u horario (Ariadna RA)
     */
    public function CambioHorario($idplan, $fechainicio, $fechafin)
    {
        $objhorario = new stdClass();
        if (isset($fechainicio) || isset($fechafin)) {
            $obj = Doctrine::getTable('DatPlanPdo')->find($idplan);
            $fini = $this->ConvertirFecha($obj->fechainicio, '-');
            $ffin = $this->ConvertirFecha($obj->fechafin, '-');
            if (isset($fechainicio) && $fini != $fechainicio) {
                $objhorario->fechainicioanterior = $fini;
                $objhorario->fechainicio = $fechainicio;
            }
            if (isset($fechafin) && $ffin != $fechafin) {
                $objhorario->fechafinanterior = $ffin;
                $objhorario->fechafin = $fechafin;
            }
        }
        return $objhorario;
    }

    /**
     * Funcion para modificar los planes
     */
    public function ModificarPlan(
        $idplan, $idusuariocrea, $denelemento, $descelemento,
        $gradocumplimiento, $idcategplan, $fechainicio, $fechafin,
        $documentos, $arraydesvasociadas, $idtipoelemento = 0
    ) {
        $temp = DatElementos::ExisteElementoNombreTipoMod(
            $idusuariocrea, $denelemento, $idtipoelemento, $idplan
        );
        if (!isset($temp[0])) {
            //se modifica el objeto 'elemento' y se registra
            $objCmpgestionarelementomodel = new CmpgestionarelementoModel();
            $datelemento = $objCmpgestionarelementomodel->ModificarElemento(
                $idplan, $denelemento, $descelemento, $gradocumplimiento, null,
                null
            );
            if ($datelemento == 3) {
                return 2;
            } else {
                //se modifica el objeto 'nomenclador-elemento' y se registra
                if ($idcategplan) {
                    $objelemnom = new DatElementosNomNomencladorModel();
                    /*$elemnom =*/
                    $objelemnom->ModificarRelacionNomElem(
                        $datelemento, $idcategplan, $tiponomenclador = 0
                    );
                }
                //se crea el objeto 'plan' y se registra
                $datplanpdo = Doctrine::getTable('DatPlanPdo')->find($idplan);
                $datplanpdo->fechainicio
                    = $fechainicio; //adddate($fechainicio);
                $datplanpdo->fechafin
                    = $fechafin; //$this->adddate($fechafin);
                $datplanpdo->save();
                if (isset($documentos[0])) {
                    foreach (
                        $documentos as /*$key =>*/
                        $iddocumento
                    ) {
                        $docElem = Doctrine::getTable('DatElementosDocumento')
                            ->findByDql(
                                "idelemento = $idplan 
                                    AND iddocumento = '$iddocumento->id'"
                            )->toArray();
                        if (count($docElem) == 0) {
                            $objAsociarDoc = new DatElementosDocumento();
                            $objAsociarDoc->idelemento = $idplan;
                            $objAsociarDoc->iddocumento = $iddocumento->id;
                            $objAsociarDoc->save();
                        }
                    }
                }
                if (isset($arraydesvasociadas[0])) {
                    DatElementosDatElementos::DesasociarDesviacionElementos(
                        $datelemento->idelemento
                    );
                    foreach ($arraydesvasociadas as $iddesviacion) {
                        $objDatElementosDatElementos
                            = new DatElementosDatElementos();
                        $objDatElementosDatElementos->idelementopadre
                            = $iddesviacion;
                        $objDatElementosDatElementos->idelementohijo
                            = $datelemento->idelemento;
                        $objDatElementosDatElementos->idautor = $idusuariocrea;
                        $datelementoplan = Doctrine::getTable('DatElementos')
                            ->findByDql(
                                "idelemento = '$iddesviacion' 
                                    AND idusuariocrea = '$idusuariocrea'"
                            );
                        if (($datelementoplan[0]->idelemento)) {
                            $objDatElementosDatElementos->origen = 1;
                        } else {
                            $objDatElementosDatElementos->origen = 3;
                        }
                        $objDatElementosDatElementos->save();
                    }
                }
                return 1;
            }
        } else {
            //En caso de que exista un elemento de igual nombre para el mismo 
            //usuario y sea diferente al que estamos modificando.
            return 0;
        }
    }

    /**
     * Funcion para eliminar los planes
     */
    public function EliminarPlan($arrayidplan)
    {
        $objcmpelementosmodel = new CmpgestionarelementoModel();
        $mensaje = $objcmpelementosmodel->EliminarElementos($arrayidplan);
        DatElementosDocumentoModel::EliminarDocumentoByIdElemento($arrayidplan);
        return $mensaje;
    }

    /**
     * Funcion para activar o desactivar los planes
     */
    public function ActivarDesactivarPlan($arrayidplan, $estado)
    {
        $noexiste = 0;
        foreach ($arrayidplan as $idplan) {
            $objplan = Doctrine::getTable('DatElementos')->find($idplan);
            if (isset($objplan)) {
                $objelementosmodel = new CmpgestionarelementoModel();
                $objplan = $objelementosmodel->ActivarDesactivarElemento(
                    $objplan, $estado
                );
            } else {
                $noexiste = 1;
            }
        }
        if ($noexiste == 1 && count($arrayidplan) == 1) {
            $mensaje = 0; //mensaje :el plan no existe en el registro
        }
        if (count($arrayidplan) > 1) {
            $mensaje = 2; // mensaje :planes act/desact correctamente
        }
        if ($noexiste == 0 && count($arrayidplan) == 1) {
            $mensaje = 1; //mensaje :plan act/desact correctamente
        }
        return $mensaje;
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

    /**
     * Obtener los estados de aprobacion a los cuales puedo modificar
     */
    public function obtenerEstadosAprobacion(
        $idsubsistema, $idusuario, $idtipodocumento, $idelemento,
        $idestadoinicial
    ) {
        $objelemento = Doctrine::getTable('DatElementos')->find($idelemento);
        if ($idestadoinicial == $objelemento->idestadoaprob) {
            $objcmpelemetmodel = new CmpgestionarelementoModel();
            $estados = $objcmpelemetmodel->ObtenerEstadosAModificarDoc(
                $idsubsistema, $idusuario, $idtipodocumento, $idestadoinicial
            );
        } else {
            $estados = array('codigo'  => 3,
                             'mensaje' => 'El estado de este plan ha sido 
                                 cambiado y no es el mismo que se le muestra 
                                 en el registro. Por favor actualice el 
                                 registro de planes.');
        }
        return $estados;
    }

    public function RelacionarPlan(
        $idusuariocrea, $idelementopadre, $tipoelementopadre, $arrayidplan
    ) {
        if (isset($arrayidplan[0])) {
            foreach ($arrayidplan as $idplan) {
                $objplan = Doctrine::getTable('DatElementos')->find($idplan);
                if (isset($objplan)) {
                    switch ($tipoelementopadre) {
                        case 0:
                            break;
                        case 1:
                            break;
                        case 2:
                            break;
                        case 3:
                            break;
                        case 4:
                            break;
                    }
                    return 1;
                }
                if (!isset($objplan) && !$arrayidplan[1]) {
                    return 3;
                }
            }
        }
    }

    /**
     * Funcion para obtener el desgloce de un determinado plan
     */
    public function DesglozarPlan($idelemento, $idtipoelemento, $idplangeneral)
    {
        $arrayresp = array();
        $objplangeneral = Doctrine::getTable('DatElementos')->find(
            $idplangeneral
        );
        if (isset($objplangeneral)) {
            switch ($idtipoelemento) {
                case 0://plan
                    $objelemento = Doctrine::getTable('DatElementos')->find(
                        $idelemento
                    );
                    if (isset($objelemento)) {
                        $cont = 0;
                        $objelementomodel = new CmpgestionarelementoModel();
                        $arregloelementos
                            = $objelementomodel->ObtenerArregloDeDependenciasParaDesgloce(
                            $objelemento, $arregloelementos, $idtipoelemento,
                            $objelemento
                        );
                        if (isset($arregloelementos['plan_arc'][0])) {
                            foreach ($arregloelementos['plan_arc'] as $arc) {
                                $objarc = Doctrine::getTable('DatArc')->find(
                                    $arc['idarc']
                                );
                                if (isset($objarc)) {
                                    $arrayresp[$cont]['id']
                                        = $idelemento . $objarc->idarc;
                                    $arrayresp[$cont]['text'] = $objarc->denarc;
                                    $arrayresp[$cont]['idelemento']
                                        = $objarc->idarc;
                                    $fechainicio = $objarc->fechainicio;
                                    if ($fechainicio == null) {
                                        $fechainicio = 'No tiene';
                                    }
                                    $fechafin = $objarc->fechafin;
                                    if ($fechafin == null) {
                                        $fechafin = 'No tiene';
                                    }
                                    $arrayresp[$cont]['fechainicio']
                                        = $fechainicio;
                                    $arrayresp[$cont]['fechafin'] = $fechafin;
                                    $arrayresp[$cont]['usuario']
                                        = $this->integrator->seguridad->nombreUsuario(
                                        $objarc->idusuariocrea
                                    );
                                    $arrayresp[$cont]['iconCls'] = 'arc';
                                    $arrayresp[$cont]['draggable'] = false;
                                    $arrayresp[$cont]['idtipoelemento'] = 4;
                                    $arrayresp[$cont]['tipoelemento']
                                        = 'Area de resultados claves';
                                    $caduca = 'Si';
                                    if ($objarc->caduca == 0) {
                                        $caduca = 'No';
                                    }
                                    $arrayresp[$cont]['caduca'] = caduca;
                                    $leaf = true;
                                    $arrayhijos
                                        = $objelementomodel->ObtenerArregloDeDependenciasParaDesgloce(
                                        $objarc, $arrayhijos,
                                        $idtipoelemento = 4, $objelemento
                                    );
                                    if (isset($arrayhijos['actividades'][0])
                                        || isset($arrayhijos['objetivos'][0])
                                    ) {
                                        $leaf = false;
                                    }
                                    $arrayresp[$cont]['leaf'] = $leaf;
                                    $cont++;
                                }
                            }
                        }
                        if (isset($arregloelementos['plan_activ'][0])) {
                            foreach (
                                $arregloelementos['plan_activ'] as $actividad
                            ) {
                                $objelementoact = Doctrine::getTable(
                                    'DatElementos'
                                )->find($actividad['idelemento']);
                                $objact = Doctrine::getTable('DatActividades')
                                    ->find($actividad['idelemento']);
                                if (isset($objelementoact)) {
                                    $arrayresp[$cont]['id'] = $idelemento
                                        . $objelementoact->idelemento;
                                    $arrayresp[$cont]['text']
                                        = $objelementoact->denelemento;
                                    $arrayresp[$cont]['idelemento']
                                        = $objelementoact->idelemento;
                                    $fechainicio = $objact->fechainicio;
                                    if ($fechainicio == null) {
                                        $fechainicio = 'No tiene';
                                    }
                                    $fechafin = $objact->fechafin;
                                    if ($fechafin == null) {
                                        $fechafin = 'No tiene';
                                    }
                                    $arrayresp[$cont]['fechainicio']
                                        = $fechainicio;
                                    $arrayresp[$cont]['fechafin'] = $fechafin;
                                    $arrayresp[$cont]['usuario']
                                        = $this->integrator->seguridad->nombreUsuario(
                                        $objelementoact->idusuariocrea
                                    );
                                    $arrayresp[$cont]['iconCls'] = 'actividad';
                                    $arrayresp[$cont]['draggable'] = false;
                                    $arrayresp[$cont]['idtipoelemento'] = 3;
                                    $arrayresp[$cont]['tipoelemento']
                                        = 'Actividad';
                                    $arrayresp[$cont]['estadocump']
                                        = $objelementoact->estadocumplimiento;
                                    $arrayresp[$cont]['categoria']
                                        = $this->ObtenerDenominacionNomencladorElemento(
                                        $objelementoact->idelemento,
                                        $tiponom = 2, $base = 'E'
                                    );
                                    $arrayresp[$cont]['tipoact']
                                        = $this->ObtenerDenominacionNomencladorElemento(
                                        $objelementoact->idelemento,
                                        $tiponom = 3, $base = 'E'
                                    );
                                    $arrayresp[$cont]['lugar'] = $objact->lugar;
                                    $arrayresp[$cont]['horainicio']
                                        = $objact->horainicio;
                                    $arrayresp[$cont]['horafin']
                                        = $objact->horafin;
                                    $arrayresp[$cont]['porciento']
                                        = $objelementoact->gradocumplimiento
                                        . '%';
                                    $arrayresp[$cont]['leaf'] = true;
                                    $cont++;
                                }
                            }
                        }
                    }
                    break;
                case 4://arc
                    $objarc = Doctrine::getTable('DatArc')->find($idelemento);
                    if (isset($objarc)) {
                        $cont = 0;
                        $objelementomodel = new CmpgestionarelementoModel();
                        $arregloelementos
                            = $objelementomodel->ObtenerArregloDeDependenciasParaDesgloce(
                            $objarc, $arregloelementos, $idtipoelemento,
                            $objplangeneral
                        );
                        if (isset($arregloelementos['objetivos'][0])) {
                            foreach (
                                $arregloelementos['objetivos'] as $objetivo
                            ) {
                                $objelemento = Doctrine::getTable(
                                    'DatElementos'
                                )->find($objetivo['idelemento']);
                                $objobjetivo = Doctrine::getTable('DatObjetivo')
                                    ->find($objetivo['idelemento']);
                                if (isset($objelemento)) {
                                    $arrayresp[$cont]['id']
                                        = $idelemento
                                        . $objelemento->idelemento;
                                    $arrayresp[$cont]['text']
                                        = $objelemento->denelemento;
                                    $arrayresp[$cont]['idelemento']
                                        = $objelemento->idelemento;
                                    $fechainicio = $objobjetivo->fechainicio;
                                    if ($fechainicio == null) {
                                        $fechainicio = 'No tiene';
                                    }
                                    $fechafin = $objobjetivo->fechafin;
                                    if ($fechafin == null) {
                                        $fechafin = 'No tiene';
                                    }
                                    $arrayresp[$cont]['fechainicio']
                                        = $fechainicio;
                                    $arrayresp[$cont]['fechafin'] = $fechafin;
                                    $arrayresp[$cont]['usuario']
                                        = $this->integrator->seguridad->nombreUsuario(
                                        $objelemento->idusuariocrea
                                    );
                                    $arrayresp[$cont]['iconCls'] = 'objetivo';
                                    $arrayresp[$cont]['draggable'] = false;
                                    $arrayresp[$cont]['idtipoelemento'] = 1;
                                    $arrayresp[$cont]['tipoelemento']
                                        = 'Objetivo';
                                    $arrayresp[$cont]['estadocump']
                                        = $objelemento->estadocumplimiento;
                                    $arrayresp[$cont]['porciento']
                                        = $objelemento->gradocumplimiento . '%';
                                    $leaf = true;
                                    $arrayhijos
                                        = $objelementomodel->ObtenerArregloDeDependenciasParaDesgloce(
                                        $objelemento, $arrayhijos,
                                        $idtipoelemento = 1, $objelemento
                                    );
                                    if (isset($arrayhijos['criterios'][0])
                                        || isset($arrayhijos['actividades'][0])
                                    ) {
                                        $leaf = false;
                                    }
                                    $arrayresp[$cont]['leaf'] = $leaf;
                                    $cont++;
                                }
                            }
                        }
                        if (isset($arregloelementos['actividades'][0])) {
                            foreach (
                                $arregloelementos['actividades'] as $actividad
                            ) {
                                $objelementoact = Doctrine::getTable(
                                    'DatElementos'
                                )->find($actividad['idelemento']);
                                $objact = Doctrine::getTable('DatActividades')
                                    ->find($actividad['idelemento']);
                                if (isset($objelementoact)) {
                                    $arrayresp[$cont]['id'] = $idelemento
                                        . $objelementoact->idelemento;
                                    $arrayresp[$cont]['text']
                                        = $objelementoact->denelemento;
                                    $arrayresp[$cont]['idelemento']
                                        = $objelementoact->idelemento;
                                    $fechainicio = $objact->fechainicio;
                                    if ($fechainicio == null) {
                                        $fechainicio = 'No tiene';
                                    }
                                    $fechafin = $objact->fechafin;
                                    if ($fechafin == null) {
                                        $fechafin = 'No tiene';
                                    }
                                    $arrayresp[$cont]['fechainicio']
                                        = $fechainicio;
                                    $arrayresp[$cont]['fechafin'] = $fechafin;
                                    $arrayresp[$cont]['usuario']
                                        = $this->integrator->seguridad->nombreUsuario(
                                        $objelementoact->idusuariocrea
                                    );
                                    $arrayresp[$cont]['iconCls'] = 'actividad';
                                    $arrayresp[$cont]['draggable'] = false;
                                    $arrayresp[$cont]['idtipoelemento'] = 3;
                                    $arrayresp[$cont]['tipoelemento']
                                        = 'Actividad';
                                    $arrayresp[$cont]['estadocump']
                                        = $objelementoact->estadocumplimiento;
                                    $arrayresp[$cont]['categoria']
                                        = $this->ObtenerDenominacionNomencladorElemento(
                                        $objelementoact->idelemento,
                                        $tiponom = 2, 'E'
                                    );
                                    $arrayresp[$cont]['tipoact']
                                        = $this->ObtenerDenominacionNomencladorElemento(
                                        $objelementoact->idelemento,
                                        $tiponom = 3, 'E'
                                    );
                                    $arrayresp[$cont]['lugar'] = $objact->lugar;
                                    $arrayresp[$cont]['horainicio']
                                        = $objact->horainicio;
                                    $arrayresp[$cont]['horafin']
                                        = $objact->horafin;
                                    $arrayresp[$cont]['porciento']
                                        = $objelementoact->gradocumplimiento
                                        . '%';
                                    $arrayresp[$cont]['leaf'] = true;
                                    $cont++;
                                }
                            }
                        }
                    }
                    break;
                case 1://objetivo
                    $objelemento = Doctrine::getTable('DatElementos')->find(
                        $idelemento
                    );
                    if (isset($objelemento)) {
                        $cont = 0;
                        $objelementomodel = new CmpgestionarelementoModel();
                        $arregloelementos
                            = $objelementomodel->ObtenerArregloDeDependenciasParaDesgloce(
                            $objelemento, $arregloelementos, $idtipoelemento,
                            $objelemento
                        );
                        if (isset($arregloelementos['criterios'])) {
                            foreach (
                                $arregloelementos['criterios'] as $criterio
                            ) {
                                $objcriterio = Doctrine::getTable(
                                    'DatCriteriomedida'
                                )->find($criterio['idcriteriomedida']);
                                if (isset($objcriterio)) {
                                    $arrayresp[$cont]['id'] = $idelemento
                                        . $objcriterio->idcriteriomedida;
                                    $arrayresp[$cont]['text']
                                        = $objcriterio->dencriterio;
                                    $arrayresp[$cont]['idelemento']
                                        = $objcriterio->idcriteriomedida;
                                    $fechainicio = $objcriterio->fechainicio;
                                    if ($fechainicio == null) {
                                        $fechainicio = 'No tiene';
                                    }
                                    $fechafin = $objcriterio->fechafin;
                                    if ($fechafin == null) {
                                        $fechafin = 'No tiene';
                                    }
                                    $arrayresp[$cont]['fechainicio']
                                        = $fechainicio;
                                    $arrayresp[$cont]['fechafin'] = $fechafin;
                                    $arrayresp[$cont]['usuario'] = '';
                                    $arrayresp[$cont]['iconCls'] = 'criterio';
                                    $arrayresp[$cont]['draggable'] = false;
                                    $arrayresp[$cont]['idtipoelemento'] = 5;
                                    $arrayresp[$cont]['tipoelemento']
                                        = 'Criterio de medida';
                                    $arrayresp[$cont]['umedida']
                                        = $this->ObtenerDenominacionNomencladorElemento(
                                        $objcriterio->idcriteriomedida,
                                        $tiponom = 1, 'C'
                                    );
                                    $arrayresp[$cont]['valormeta']
                                        = $objcriterio->valormeta;
                                    $arrayresp[$cont]['valoreal']
                                        = $objcriterio->valoreal;
                                    $arrayresp[$cont]['estadocump']
                                        = $objcriterio->estadocumplimiento;
                                    $arrayresp[$cont]['porciento']
                                        = $objcriterio->gradocumplimiento . '%';
                                    $arrayresp[$cont]['leaf'] = true;
                                    $cont++;
                                }
                            }
                        }
                        if (isset($arregloelementos['actividades'][0])) {
                            foreach (
                                $arregloelementos['actividades'] as $actividad
                            ) {
                                $objelementoact = Doctrine::getTable(
                                    'DatElementos'
                                )->find($actividad['idelemento']);
                                $objact = Doctrine::getTable('DatActividades')
                                    ->find($actividad['idelemento']);
                                if (isset($objelementoact)) {
                                    $arrayresp[$cont]['id'] = $idelemento
                                        . $objelementoact->idelemento;
                                    $arrayresp[$cont]['text']
                                        = $objelementoact->denelemento;
                                    $arrayresp[$cont]['idelemento']
                                        = $objelementoact->idelemento;
                                    $fechainicio = $objact->fechainicio;
                                    if ($fechainicio == null) {
                                        $fechainicio = 'No tiene';
                                    }
                                    $fechafin = $objact->fechafin;
                                    if ($fechafin == null) {
                                        $fechafin = 'No tiene';
                                    }
                                    $arrayresp[$cont]['fechainicio']
                                        = $fechainicio;
                                    $arrayresp[$cont]['fechafin'] = $fechafin;
                                    $arrayresp[$cont]['usuario']
                                        = $this->integrator->seguridad->nombreUsuario(
                                        $objelementoact->idusuariocrea
                                    );
                                    $arrayresp[$cont]['iconCls'] = 'actividad';
                                    $arrayresp[$cont]['draggable'] = false;
                                    $arrayresp[$cont]['idtipoelemento'] = 3;
                                    $arrayresp[$cont]['tipoelemento']
                                        = 'Actividad';
                                    $arrayresp[$cont]['estadocump']
                                        = $objelementoact->estadocumplimiento;
                                    $arrayresp[$cont]['categoria']
                                        = $this->ObtenerDenominacionNomencladorElemento(
                                        $objelementoact->idelemento,
                                        $tiponom = 2, 'E'
                                    );
                                    $arrayresp[$cont]['tipoact']
                                        = $this->ObtenerDenominacionNomencladorElemento(
                                        $objelementoact->idelemento,
                                        $tiponom = 3, 'E'
                                    );
                                    $arrayresp[$cont]['lugar'] = $objact->lugar;
                                    $arrayresp[$cont]['horainicio']
                                        = $objact->horainicio;
                                    $arrayresp[$cont]['horafin']
                                        = $objact->horafin;
                                    $arrayresp[$cont]['porciento']
                                        = $objelementoact->gradocumplimiento
                                        . '%';
                                    $arrayresp[$cont]['leaf'] = true;
                                    $cont++;
                                }
                            }
                        }
                    }
                    break;
                case 2:
                    $objelemento = Doctrine::getTable('DatElementos')->find(
                        $idelemento
                    );
                    if (isset($objelemento)) {
                        $cont = 0;
                        $objelementomodel = new CmpgestionarelementoModel();
                        $arregloelementos
                            = $objelementomodel->ObtenerArregloDeDependenciasParaDesgloce(
                            $objelemento, $arregloelementos, $idtipoelemento,
                            $objelemento
                        );
                        if (isset($arregloelementos['fip_obj'][0])) {
                            foreach ($arregloelementos['fip_obj'] as $fip) {
                                $objelementoact = Doctrine::getTable(
                                    'DatElementos'
                                )->find($fip['idelemento']);
                                $obj = Doctrine::getTable('DatObjetivo')->find(
                                    $fip['idelemento']
                                );
                                if (isset($objelementoact)) {
                                    $arregloelementos
                                        = $objelementomodel->ObtenerArregloDeDependenciasParaDesgloce(
                                        $objelementoact, $arregloelementos, 1,
                                        $objelementoact
                                    );
                                    $leaf = true;
                                    if (isset($arregloelementos['criterios'])
                                        || isset($arregloelementos['actividades'][0])
                                    ) {
                                        $leaf = false;
                                    }
                                    $arrayresp[$cont]['id'] = $idelemento
                                        . $objelementoact->idelemento;
                                    $arrayresp[$cont]['text']
                                        = $objelementoact->denelemento;
                                    $arrayresp[$cont]['idelemento']
                                        = $objelementoact->idelemento;
                                    $fechainicio = $obj->fechainicio;
                                    if ($fechainicio == null) {
                                        $fechainicio = 'No tiene';
                                    }
                                    $fechafin = $obj->fechafin;
                                    if ($fechafin == null) {
                                        $fechafin = 'No tiene';
                                    }
                                    $arrayresp[$cont]['fechainicio']
                                        = $fechainicio;
                                    $arrayresp[$cont]['fechafin'] = $fechafin;
                                    $arrayresp[$cont]['usuario']
                                        = $this->integrator->seguridad->nombreUsuario(
                                        $objelementoact->idusuariocrea
                                    );
                                    $arrayresp[$cont]['iconCls'] = 'objetivo';
                                    $arrayresp[$cont]['draggable'] = false;
                                    $arrayresp[$cont]['idtipoelemento'] = 1;
                                    $arrayresp[$cont]['tipoelemento']
                                        = 'Objetivo';
                                    $arrayresp[$cont]['estadocump']
                                        = $objelementoact->estadocumplimiento;
                                    $arrayresp[$cont]['porciento']
                                        = $objelementoact->gradocumplimiento
                                        . '%';
                                    $arrayresp[$cont]['leaf'] = $leaf;
                                    $cont++;
                                }
                            }
                        }
                        if (isset($arregloelementos['fip_activ'][0])) {
                            foreach ($arregloelementos['fip_activ'] as $fip) {
                                $objelementoact = Doctrine::getTable(
                                    'DatElementos'
                                )->find($fip['idelemento']);
                                $objact = Doctrine::getTable('DatActividades')
                                    ->find($fip['idelemento']);
                                if (isset($objelementoact)) {
                                    $arrayresp[$cont]['id'] = $idelemento
                                        . $objelementoact->idelemento;
                                    $arrayresp[$cont]['text']
                                        = $objelementoact->denelemento;
                                    $arrayresp[$cont]['idelemento']
                                        = $objelementoact->idelemento;
                                    $fechainicio = $objact->fechainicio;
                                    if ($fechainicio == null) {
                                        $fechainicio = 'No tiene';
                                    }
                                    $fechafin = $objact->fechafin;
                                    if ($fechafin == null) {
                                        $fechafin = 'No tiene';
                                    }
                                    $arrayresp[$cont]['fechainicio']
                                        = $fechainicio;
                                    $arrayresp[$cont]['fechafin'] = $fechafin;
                                    $arrayresp[$cont]['usuario']
                                        = $this->integrator->seguridad->nombreUsuario(
                                        $objelementoact->idusuariocrea
                                    );
                                    $arrayresp[$cont]['iconCls'] = 'actividad';
                                    $arrayresp[$cont]['draggable'] = false;
                                    $arrayresp[$cont]['idtipoelemento'] = 3;
                                    $arrayresp[$cont]['tipoelemento']
                                        = 'Actividad';
                                    $arrayresp[$cont]['estadocump']
                                        = $objelementoact->estadocumplimiento;
                                    $arrayresp[$cont]['categoria']
                                        = $this->ObtenerDenominacionNomencladorElemento(
                                        $objelementoact->idelemento,
                                        $tiponom = 2, $base = 'E'
                                    );
                                    $arrayresp[$cont]['tipoact']
                                        = $this->ObtenerDenominacionNomencladorElemento(
                                        $objelementoact->idelemento,
                                        $tiponom = 3, $base = 'E'
                                    );
                                    $arrayresp[$cont]['lugar'] = $objact->lugar;
                                    $arrayresp[$cont]['horainicio']
                                        = $objact->horainicio;
                                    $arrayresp[$cont]['horafin']
                                        = $objact->horafin;
                                    $arrayresp[$cont]['porciento']
                                        = $objelementoact->gradocumplimiento
                                        . '%';
                                    $arrayresp[$cont]['leaf'] = true;
                                    $cont++;
                                }
                            }
                        }
                    }
                    break;
            }
        }
        return $arrayresp;
    }

    public function ObtenerDenominacionNomencladorElemento(
        $idelemento, $tiponom, $base
    ) {
        $dennomenclador = '';
        if ($base == 'E') {
            $nomenclador
                = DatElementosNomNomenclador::DameIdNomencladorDadoTipoNom(
                $idelemento, $tiponom
            );
            $idnomenclador = $nomenclador[0]['idnomenclador'];
        } else {
            $idnomenclador = Doctrine::getTable('DatCriteriomedida')->find(
                $idelemento
            )->idumedida;
            $nomenclador = 1;
        }
        if ($nomenclador) {
            $datosnomenclador
                = $this->pIntegrator->configuracionpdo->DameDatosNomenclador(
                $idnomenclador
            );
            $dennomenclador = $datosnomenclador->dennomenclador;
        }
        return $dennomenclador;
    }

    /**
     * Funcion para actualizar el % de cumplimiento de un plan
     */
    public function actualizarPorcientoPlan($arrayPlanes)
    {
        foreach ($arrayPlanes as $plan) {
            $suma = 0;
            $cant = 0;
            $objElemElem = new DatElementosDatElementos();
            //obtengo el gradocumplimiento de los hijos(act y obj) por Dat-Elem
            $hijosE = $objElemElem->obtenerGradoCumpHijosE($plan);
            //obtengo el gradocumplimiento de los obj hijos por Dat-ARC
            $hijosO = $objElemElem->obtenerGradoCumpObj($plan);
            //obtengo el gradocumplimiento de las act hijas por Dat-ARC
            $hijosA = $objElemElem->obtenerGradoCumpAct($plan);
            //Junto los arreglos de hijos
            $hijosOA = array_merge($hijosO, $hijosA);
            $hijos = array_merge($hijosE, $hijosOA);
            foreach ($hijos as $hijo) {
                $suma += $hijo;
                $cant++;
            }
            //el grado de cumplimiento
            $objElemento = Doctrine::getTable('DatElementos')->find($plan);
            $objElemento->gradocumplimiento = $suma / $cant;
            //Actualizar el estado de cumplimiento del padre
            $objelemmodel = new CmpgestionarelementoModel();
            $estadocumplimiento
                = $objelemmodel->actualizarEstadoCumplimiento(
                $estadocumplimiento, $objElemento->gradocumplimiento
            );
            $objElemento->estadocumplimiento = $estadocumplimiento;
            $objElemento->save();
        }
    }

    /*
     * Carga la eficiencia por plan(tardanzas en cumplimiento de sus acts asociadas)
     * */
    public function cargarEficienciaPlan($parametros)
    {
        //estados de los planes (idtipodoc = 0)
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 0
        );
        if (isset($arrayestadosver[0])) {
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        $arrayPlanes = DatPlanPdo::obtenerPlanes($parametros);
        $objElemElem = new DatElementosDatElementos();
        foreach ($arrayPlanes as $key => $value) {
            $tardanza = array();
            $diferencia = 0;//la diferencia es la Sumatoria de las trardanzas
            //estados de las actividades (idtipodoc = 3)
            $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
                $parametros->idusuario, $idtipodoc = 3
            );
            if (isset($arrayestadosver[0])) {
                foreach ($arrayestadosver as $estado) {
                    $arrayestados[] = $estado['idestado'];
                }
            }
            $parametros->arregloestados = $arrayestados;
            $parametros->arrayestados = implode(',', $arrayestados);
            //Por cada plan obtengo todas sus actividades relacionadas directamente
            // con 100% de cumplimiento
            $arrayActHijas = $objElemElem->obtenerActHijasDePlan(
                $parametros, $value['idplan']
            );
            //estados de los objetivos (idtipodoc = 1)
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
            //Por cada plan obtengo todos sus objetivos relacionadas directamente
            $arrayObjHijos = $objElemElem->obtenerObjHijosDePlan(
                $parametros, $value['idplan']
            );
            //busco si a traves de los objs hay acts hijas recursivamente
            foreach ($arrayObjHijos as $obj) {
                //busco todos los objs hijos hijos y nietos etc para ver si tienen acts
                $resultado[]
                    = CmpgestionaractividadesModel::buscarInferioresMismo(
                    $obj['idelemento'], $resultado
                );
                foreach ($resultado as $re) {
                    //estados de las actividades (idtipodoc = 3)
                    $arrayestadosver
                        = $this->pIntegrator->workflow->EstadosVerDoc(
                        $parametros->idusuario, $idtipodoc = 3
                    );
                    if (isset($arrayestadosver[0])) {
                        foreach ($arrayestadosver as $estado) {
                            $arrayestados[] = $estado['idestado'];
                        }
                    }
                    $parametros->arregloestados = $arrayestados;
                    $parametros->arrayestados = implode(',', $arrayestados);
                    //busco las acts hijas imediatas por cada obj
                    $actsHijas = $objElemElem->obtenerActsHijasDeObj(
                        $parametros, $re
                    );
                    $arrayActHijas = array_merge($arrayActHijas, $actsHijas);
                }
            }
            //Recorro todas las acts hijas del plan para calculares sus valores
            foreach ($arrayActHijas as $k => $act) {
                if ($act['gradocumplimiento'] < 100) {
                    $tardanza[$k]
                        = CmpgestionaractividadesModel::dias_transcurridos(
                        date('d/m/Y'), $act['fechafin']
                    );
                    $diferencia += $tardanza[$k];
                } else {
                    $fechaHisto = DatHistorial::historialCumplida(
                        $act['idelemento']
                    );
                    $tardanza[$k]
                        = CmpgestionaractividadesModel::dias_transcurridos(
                        $fechaHisto[0]['fecha'], $act['fechafin']
                    );
                    $diferencia += $tardanza[$k];
                }
            }
            $cont = count($arrayActHijas);
            $tardanzaPromedio = round($diferencia / $cont, 2);
            $tardanzaMax = max($tardanza);
            if ($tardanzaMax == '') {
                $tardanzaMax = 0;
            }
            $arraydata[0] = $tardanzaMax;
            $arraydata[1] = $tardanzaPromedio;
            $arraydata[2] = $diferencia;
            $data[$key]['name'] = $value['denelemento'];
            $data[$key]['data'] = $arraydata;
        }
        return $data;
    }

    /*
     * Carga la eficiencia por plan(tardanzas en cumplimiento de sus acts asociadas)
     * */
    public function cargarDesviaciones($parametros)
    {
        //estados de los planes (idtipodoc = 0)
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 0
        );
        if (isset($arrayestadosver[0])) {
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        $objDatPlan = new DatPlanPdo();
        $arrayPlanes = $objDatPlan->obtenerPlanes($parametros);
        $desviacionesPlan = 0;
        foreach ($arrayPlanes as $key => $value) {
            $desviaciones = $objDatPlan->cantDesviaciones($value['idplan']);
            if ($desviaciones[0] > 0) {
                $desviacionesPlan += $desviaciones[0];
            }
        }
        //estados de los objetivos (idtipodoc = 1)
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
        $arrayObj = DatObjetivo::obtenerObjs($parametros);
        $desviacionesObj = 0;
        foreach ($arrayObj as $key => $value) {
            $desviaciones = $objDatPlan->cantDesviaciones($value['idobjetivo']);
            if ($desviaciones[0] > 0) {
                $desviacionesObj += $desviaciones[0];
            }
        }
        //estados de las actividades (idtipodoc = 3)
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 3
        );
        if (isset($arrayestadosver[0])) {
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        $arrayAct = DatActividades::obtenerActs($parametros);
        $desviacionesAct = 0;
        foreach ($arrayAct as $key => $value) {
            $desviaciones = $objDatPlan->cantDesviaciones(
                $value['idactividad']
            );
            if ($desviaciones[0] > 0) {
                $desviacionesAct += $desviaciones[0];
            }
        }
        $totalDesviaciones = $desviacionesPlan + $desviacionesObj
            + $desviacionesAct;
        if ($parametros->cant == 1) {
            $porcientoPlan = $desviacionesPlan * 100 / count($arrayPlanes);
            $porcientoObj = $desviacionesObj * 100 / count($arrayObj);
            $porcientoAct = $desviacionesAct * 100 / count($arrayAct);
        } else {
            $porcientoPlan = $desviacionesPlan * 100 / $totalDesviaciones;
            $porcientoObj = $desviacionesObj * 100 / $totalDesviaciones;
            $porcientoAct = $desviacionesAct * 100 / $totalDesviaciones;
        }
        $data = Array(
            array(
                "name"  => 'Planes',
                "deno"  => 'Plan(es)',
                "y"     => round($porcientoPlan, 2),
                "color" => '#77C2F8',
                "cant"  => count($arrayPlanes),
                "desv"  => $desviacionesPlan
            ), array(
                "name"  => 'Objetivos',
                "deno"  => 'Objetivo(s)',
                "y"     => round($porcientoObj, 2),
                "color" => '#FF5261',
                "cant"  => count($arrayObj),
                "desv"  => $desviacionesObj
            ), array(
                "name"  => 'Actividades',
                "deno"  => 'Actividad(es)',
                "y"     => round($porcientoAct, 2),
                "color" => '#72D572',
                "cant"  => count($arrayAct),
                "desv"  => $desviacionesAct
            )
        );
        return $data;
    }


    /*
     * Carga el comportamiento de las actividades
     * (Adicionadas, eliminadas o cambiadas de fecha) de los planes despues que
     * estos estan en un estado determinado(puede ser Aporobacion)
     * */
    public function cargarComportamiento($parametros)
    {
        //estados de los planes (idtipodoc = 0)
        if (isset($parametros->idplan)) {
            $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
                $parametros->idusuario, $idtipodoc = 0
            );
            if (isset($arrayestadosver[0])) {
                foreach ($arrayestadosver as $estado) {
                    $arrayestados[] = $estado['idestado'];
                }
            }
            $parametros->arregloestados = $arrayestados;
            $parametros->arrayestados = implode(',', $arrayestados);
            $objDatPlan = new DatPlanPdo();
            $objHisto = new DatHistorial();
            $parametros->comportamiento = 1;
            $arrayPlanes = $objDatPlan->obtenerPlanes($parametros);
            if ($arrayPlanes == null) {
                $data = 2;//El plan seleccionado no esta aprobado
                $categories = 2;
            } else {
                foreach ($arrayPlanes as $key => $value) {
                    $categories[$key] = $value['denelemento'];
                    //Por cada plan obtengo todas sus actividades relacionadas directamente
                    $arrayActHijas = $objHisto->obtenerHijos(
                        $value['idplan'], 3
                    );
                    //Por cada plan obtengo todos sus objetivos relacionadas directamente
                    $arrayObjHijos = $objHisto->obtenerHijos(
                        $value['idplan'], 1
                    );
                    //busco si a traves de los objs hay acts hijas recursivamente
                    foreach ($arrayObjHijos as $obj) {
                        //busco si tiene act relacionadas
                        $arrayActHijas = array_merge(
                            $arrayActHijas,
                            $objHisto->obtenerHijos($obj['idelemento'], 3)
                        );
                        //busco todos los objs hijos hijos y nietos etc para ver si tienen acts
                        $objhijos = $objHisto->obtenerHijos(
                            $obj['idelemento'], 1
                        );
                        foreach ($objhijos as $re) {
                            //busco las acts hijas imediatas por cada obj
                            $arrayActHijas = array_merge(
                                $arrayActHijas,
                                $objHisto->obtenerHijos($re['idelemento'], 3)
                            );
                        }
                    }
                    $adicionadas = 0;
                    $eliminadas = 0;
                    $modifFecha = 0;
                    foreach ($arrayActHijas as $act) {
                        $adicionadas += $objHisto->obtenerComportamiento($act['idelemento'], 1, $value['fechacontrolcambio']);
                        $eliminadas += $objHisto->obtenerComportamiento($act['idelemento'], 3, $value['fechacontrolcambio']);
                        if ($objHisto->obtenerComportamiento($act['idelemento'], 2,$value['fechacontrolcambio'],1) > 0) {
                            $modifFecha++;
                        }
                    }
                    $arrayAdicicionadas[$key] = $adicionadas;
                    $arrayEliminadas[$key] = $eliminadas;
                    $arrayModifFecha[$key] = $modifFecha;
                }
                $data = Array(
                    array(
                        "name"  => 'Adicionadas',
                        "color" => '#72D572',
                        "data"  => $arrayAdicicionadas
                    ), array(
                        "name"  => 'Eliminadas',
                        "color" => '#F6915C',
                        "data"  => $arrayEliminadas
                    ), array(
                        "name"  => 'Modificadas de fecha',
                        "color" => '#77C2F8',
                        "data"  => $arrayModifFecha
                    )
                );
            }
        } else {
            $data = 1;//Debe seleccionar un plan
            $categories = 1;
        }
        return Array($data, $categories);
    }


    /*
     * Carga la ejecucion(planificadas, cumplidas) de las actividades
     * de los planes despues que estos estan
     * en un estado determinado(puede ser Aporobacion)
     * */
    public function cargarEjecucion($parametros)
    {
        //estados de los planes (idtipodoc = 0)
        if (isset($parametros->idplan)) {
            $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
                $parametros->idusuario, $idtipodoc = 0
            );
            if (isset($arrayestadosver[0])) {
                foreach ($arrayestadosver as $estado) {
                    $arrayestados[] = $estado['idestado'];
                }
            }
            $parametros->arregloestados = $arrayestados;
            $parametros->arrayestados = implode(',', $arrayestados);
            $objDatPlan = new DatPlanPdo();
            $parametros->comportamiento = 1;
            $plan = $objDatPlan->obtenerPlanes($parametros);
            if ($plan == null) {
                $data = 2;//El plan seleccionado no esta aprobado
            } else {
                $objElemElem = new DatElementosDatElementos();
                //estados de las actividades (idtipodoc = 3)
                $arrayestadosver
                    = $this->pIntegrator->workflow->EstadosVerDoc(
                    $parametros->idusuario, $idtipodoc = 3
                );
                if (isset($arrayestadosver[0])) {
                    foreach ($arrayestadosver as $estado) {
                        $arrayestados[] = $estado['idestado'];
                    }
                }
                $parametros->arregloestados = $arrayestados;
                $parametros->arrayestados = implode(',', $arrayestados);
                //Por cada plan obtengo todas sus actividades relacionadas directamente
                $arrayActHijas = $objElemElem->actHijasDePlan(
                    $parametros, $plan[0]['idplan']
                );
                //estados de los objetivos (idtipodoc = 1)
                $arrayestadosver
                    = $this->pIntegrator->workflow->EstadosVerDoc(
                    $parametros->idusuario, $idtipodoc = 1
                );
                if (isset($arrayestadosver[0])) {
                    foreach ($arrayestadosver as $estado) {
                        $arrayestados[] = $estado['idestado'];
                    }
                }
                $parametros->arregloestados = $arrayestados;
                $parametros->arrayestados = implode(',', $arrayestados);
                //Por cada plan obtengo todos sus objetivos relacionadas directamente
                $arrayObjHijos = $objElemElem->obtenerObjHijosDePlan(
                    $parametros, $plan[0]['idplan']
                );
                //busco si a traves de los objs hay acts hijas recursivamente
                foreach ($arrayObjHijos as $obj) {
                    //busco todos los objs hijos hijos y nietos etc para ver si tienen acts
                    $resultado[]
                        = CmpgestionaractividadesModel::buscarInferioresMismo(
                        $obj['idelemento'], $resultado
                    );
                    foreach ($resultado as $re) {
                        //estados de las actividades (idtipodoc = 3)
                        $arrayestadosver
                            = $this->pIntegrator->workflow->EstadosVerDoc(
                            $parametros->idusuario, $idtipodoc = 3
                        );
                        if (isset($arrayestadosver[0])) {
                            foreach ($arrayestadosver as $estado) {
                                $arrayestados[] = $estado['idestado'];
                            }
                        }
                        $parametros->arregloestados = $arrayestados;
                        $parametros->arrayestados = implode(
                            ',', $arrayestados
                        );
                        //busco las acts hijas imediatas por cada obj
                        $actsHijas = $objElemElem->actsHijasDeObj(
                            $parametros, $re
                        );
                        $arrayActHijas = array_merge(
                            $arrayActHijas, $actsHijas
                        );
                    }
                }
                if ($parametros->trimestre == 1) {
                    $data = self::evolucionTrimestres($arrayActHijas);
                } elseif ($parametros->ejecucion == 1) {
                    $data = self::ejecucion($arrayActHijas);
                } else {
                    $data = self::evolucionMeses($arrayActHijas);
                }
            }
        } else {
            $data = 1;//Debe seleccionar un plan
        }
        return $data;
    }

    public function evolucionMeses($arrayActHijas)
    {
        $planiEne = 0;
        $cumplidasEne = 0;
        $planiFeb = 0;
        $cumplidasFeb = 0;
        $planiMar = 0;
        $cumplidasMar = 0;
        $planiAbr = 0;
        $cumplidasAbr = 0;
        $planiMay = 0;
        $cumplidasMay = 0;
        $planiJun = 0;
        $cumplidasJun = 0;
        $planiJul = 0;
        $cumplidasJul = 0;
        $planiAgo = 0;
        $cumplidasAgo = 0;
        $planiSep = 0;
        $cumplidasSep = 0;
        $planiOct = 0;
        $cumplidasOct = 0;
        $planiNov = 0;
        $cumplidasNov = 0;
        $planiDic = 0;
        $cumplidasDic = 0;
        $actModel = new CmpgestionaractividadesModel();
        //Recorro todas las acts hijas del plan para calculares sus valores
        foreach ($arrayActHijas as $k => $act) {
            $tiempo1 = $actModel->dias_transcurridos(
                $act['fechainicio'], date('01/01/Y')
            );
            $tiempo2 = $actModel->dias_transcurridos(
                date('31/01/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $planiEne++;
                if ($act['gradocumplimiento'] == 100) {
                    $cumplidasEne++;
                }
            }
            $tiempo1 = $actModel->dias_transcurridos(
                $act['fechainicio'], date('01/02/Y')
            );
            $tiempo2 = $actModel->dias_transcurridos(
                date('29/02/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $planiFeb++;
                if ($act['gradocumplimiento'] == 100) {
                    $cumplidasFeb++;
                }
            }
            $tiempo1 = $actModel->dias_transcurridos(
                $act['fechainicio'], date('01/03/Y')
            );
            $tiempo2 = $actModel->dias_transcurridos(
                date('31/03/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $planiMar++;
                if ($act['gradocumplimiento'] == 100) {
                    $cumplidasMar++;
                }
            }
            $tiempo1 = $actModel->dias_transcurridos(
                $act['fechainicio'], date('01/04/Y')
            );
            $tiempo2 = $actModel->dias_transcurridos(
                date('30/04/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $planiAbr++;
                if ($act['gradocumplimiento'] == 100) {
                    $cumplidasAbr++;
                }
            }
            $tiempo1 = $actModel->dias_transcurridos(
                $act['fechainicio'], date('01/05/Y')
            );
            $tiempo2 = $actModel->dias_transcurridos(
                date('31/05/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $planiMay++;
                if ($act['gradocumplimiento'] == 100) {
                    $cumplidasMay++;
                }
            }
            $tiempo1 = $actModel->dias_transcurridos(
                $act['fechainicio'], date('01/06/Y')
            );
            $tiempo2 = $actModel->dias_transcurridos(
                date('30/06/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $planiJun++;
                if ($act['gradocumplimiento'] == 100) {
                    $cumplidasJun++;
                }
            }
            $tiempo1 = $actModel->dias_transcurridos(
                $act['fechainicio'], date('01/07/Y')
            );
            $tiempo2 = $actModel->dias_transcurridos(
                date('31/07/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $planiJul++;
                if ($act['gradocumplimiento'] == 100) {
                    $cumplidasJul++;
                }
            }
            $tiempo1 = $actModel->dias_transcurridos(
                $act['fechainicio'], date('01/08/Y')
            );
            $tiempo2 = $actModel->dias_transcurridos(
                date('31/08/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $planiAgo++;
                if ($act['gradocumplimiento'] == 100) {
                    $cumplidasAgo++;
                }
            }
            $tiempo1 = $actModel->dias_transcurridos(
                $act['fechainicio'], date('01/09/Y')
            );
            $tiempo2 = $actModel->dias_transcurridos(
                date('30/09/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $planiSep++;
                if ($act['gradocumplimiento'] == 100) {
                    $cumplidasSep++;
                }
            }
            $tiempo1 = $actModel->dias_transcurridos(
                $act['fechainicio'], date('01/10/Y')
            );
            $tiempo2 = $actModel->dias_transcurridos(
                date('31/10/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $planiOct++;
                if ($act['gradocumplimiento'] == 100) {
                    $cumplidasOct++;
                }
            }
            $tiempo1 = $actModel->dias_transcurridos(
                $act['fechainicio'], date('01/11/Y')
            );
            $tiempo2 = $actModel->dias_transcurridos(
                date('30/11/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $planiNov++;
                if ($act['gradocumplimiento'] == 100) {
                    $cumplidasNov++;
                }
            }
            $tiempo1 = $actModel->dias_transcurridos(
                $act['fechainicio'], date('01/12/Y')
            );
            $tiempo2 = $actModel->dias_transcurridos(
                date('31/12/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $planiDic++;
                if ($act['gradocumplimiento'] == 100) {
                    $cumplidasDic++;
                }
            }
        }
        $arrayPlanificadas[0] = $planiEne;
        $arrayPlanificadas[1] = $planiFeb;
        $arrayPlanificadas[2] = $planiMar;
        $arrayPlanificadas[3] = $planiAbr;
        $arrayPlanificadas[4] = $planiMay;
        $arrayPlanificadas[5] = $planiJun;
        $arrayPlanificadas[6] = $planiJul;
        $arrayPlanificadas[7] = $planiAgo;
        $arrayPlanificadas[8] = $planiSep;
        $arrayPlanificadas[9] = $planiOct;
        $arrayPlanificadas[10] = $planiNov;
        $arrayPlanificadas[11] = $planiDic;
        //Cumplidas
        $arrayCumplidas[0] = $cumplidasEne;
        $arrayCumplidas[1] = $cumplidasFeb;
        $arrayCumplidas[2] = $cumplidasMar;
        $arrayCumplidas[3] = $cumplidasAbr;
        $arrayCumplidas[4] = $cumplidasMay;
        $arrayCumplidas[5] = $cumplidasJun;
        $arrayCumplidas[6] = $cumplidasJul;
        $arrayCumplidas[7] = $cumplidasAgo;
        $arrayCumplidas[8] = $cumplidasSep;
        $arrayCumplidas[9] = $cumplidasOct;
        $arrayCumplidas[10] = $cumplidasNov;
        $arrayCumplidas[11] = $cumplidasDic;
        //Acumulado de planificadas
        $arrayAcumuladoP[0] = $planiEne;
        $arrayAcumuladoP[1] = $arrayAcumuladoP[0] + $planiFeb;
        $arrayAcumuladoP[2] = $arrayAcumuladoP[1] + $planiMar;
        $arrayAcumuladoP[3] = $arrayAcumuladoP[2] + $planiAbr;
        $arrayAcumuladoP[4] = $arrayAcumuladoP[3] + $planiMay;
        $arrayAcumuladoP[5] = $arrayAcumuladoP[4] + $planiJun;
        $arrayAcumuladoP[6] = $arrayAcumuladoP[5] + $planiJul;
        $arrayAcumuladoP[7] = $arrayAcumuladoP[6] + $planiAgo;
        $arrayAcumuladoP[8] = $arrayAcumuladoP[7] + $planiSep;
        $arrayAcumuladoP[9] = $arrayAcumuladoP[8] + $planiOct;
        $arrayAcumuladoP[10] = $arrayAcumuladoP[9] + $planiNov;
        $arrayAcumuladoP[11] = $arrayAcumuladoP[10] + $planiDic;
        //Acumulado de Cumplidas
        $arrayAcumuladoE[0] = $cumplidasEne;
        $arrayAcumuladoE[1] = $arrayAcumuladoE[0] + $cumplidasEne;
        $arrayAcumuladoE[2] = $arrayAcumuladoE[1] + $cumplidasFeb;
        $arrayAcumuladoE[3] = $arrayAcumuladoE[2] + $cumplidasAbr;
        $arrayAcumuladoE[4] = $arrayAcumuladoE[3] + $cumplidasMay;
        $arrayAcumuladoE[5] = $arrayAcumuladoE[4] + $cumplidasJun;
        $arrayAcumuladoE[6] = $arrayAcumuladoE[5] + $cumplidasJul;
        $arrayAcumuladoE[7] = $arrayAcumuladoE[6] + $cumplidasAgo;
        $arrayAcumuladoE[8] = $arrayAcumuladoE[7] + $cumplidasSep;
        $arrayAcumuladoE[9] = $arrayAcumuladoE[8] + $cumplidasOct;
        $arrayAcumuladoE[10] = $arrayAcumuladoE[9] + $cumplidasNov;
        $arrayAcumuladoE[11] = $arrayAcumuladoE[10] + $cumplidasDic;
        $data = Array(
            array(
                "name"  => 'Planificadas',
                "color" => '#F6915C',
                "data"  => $arrayPlanificadas
            ), array(
                "name"  => 'Cumplidas',
                "color" => '#77C2F8',
                "data"  => $arrayCumplidas
            ), array(
                "name"  => 'Acumulado de planificadas',
                "color" => '#FF5261',
                "data"  => $arrayAcumuladoP
            ), array(
                "name"  => 'Acumulado de cumplidas',
                "color" => '#72D572',
                "data"  => $arrayAcumuladoE
            )
        );
        return $data;
    }

    public function evolucionTrimestres($arrayActHijas)
    {
        $planiEne = 0;
        $cumplidasEne = 0;
        $planiAbr = 0;
        $cumplidasAbr = 0;
        $planiJul = 0;
        $cumplidasJul = 0;
        $planiOct = 0;
        $cumplidasOct = 0;
        $actModel = new CmpgestionaractividadesModel();
        //Recorro todas las acts hijas del plan para calculares sus valores
        foreach ($arrayActHijas as $k => $act) {
            $tiempo1 = $actModel->dias_transcurridos(
                $act['fechainicio'], date('01/01/Y')
            );
            $tiempo2 = $actModel->dias_transcurridos(
                date('31/03/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $planiEne++;
                if ($act['gradocumplimiento'] == 100) {
                    $cumplidasEne++;
                }
            }
            $tiempo1 = $actModel->dias_transcurridos(
                $act['fechainicio'], date('01/04/Y')
            );
            $tiempo2 = $actModel->dias_transcurridos(
                date('30/06/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $planiAbr++;
                if ($act['gradocumplimiento'] == 100) {
                    $cumplidasAbr++;
                }
            }
            $tiempo1 = $actModel->dias_transcurridos(
                $act['fechainicio'], date('01/07/Y')
            );
            $tiempo2 = $actModel->dias_transcurridos(
                date('31/09/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $planiJul++;
                if ($act['gradocumplimiento'] == 100) {
                    $cumplidasJul++;
                }
            }
            $tiempo1 = $actModel->dias_transcurridos(
                $act['fechainicio'], date('01/10/Y')
            );
            $tiempo2 = $actModel->dias_transcurridos(
                date('31/12/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $planiOct++;
                if ($act['gradocumplimiento'] == 100) {
                    $cumplidasOct++;
                }
            }
        }
        $arrayPlanificadas[0] = $planiEne;
        $arrayPlanificadas[1] = $planiAbr;
        $arrayPlanificadas[2] = $planiJul;
        $arrayPlanificadas[3] = $planiOct;
        //Cumplidas
        $arrayCumplidas[0] = $cumplidasEne;
        $arrayCumplidas[1] = $cumplidasAbr;
        $arrayCumplidas[2] = $cumplidasJul;
        $arrayCumplidas[3] = $cumplidasOct;
        //Acumulado de planificadas
        $arrayAcumuladoP[0] = $planiEne;
        $arrayAcumuladoP[1] = $arrayAcumuladoP[0] + $planiAbr;
        $arrayAcumuladoP[2] = $arrayAcumuladoP[1] + $planiJul;
        $arrayAcumuladoP[3] = $arrayAcumuladoP[2] + $planiOct;
        //Acumulado de Cumplidas
        $arrayAcumuladoE[0] = $cumplidasEne;
        $arrayAcumuladoE[1] = $arrayAcumuladoE[0] + $cumplidasAbr;
        $arrayAcumuladoE[2] = $arrayAcumuladoE[1] + $cumplidasJul;
        $arrayAcumuladoE[3] = $arrayAcumuladoE[2] + $cumplidasOct;
        $data = Array(
            array(
                "name"  => 'Planificadas',
                "color" => '#F6915C',
                "data"  => $arrayPlanificadas
            ), array(
                "name"  => 'Cumplidas',
                "color" => '#77C2F8',
                "data"  => $arrayCumplidas
            ), array(
                "name"  => 'Acumulado de planificadas',
                "color" => '#FF5261',
                "data"  => $arrayAcumuladoP
            ), array(
                "name"  => 'Acumulado de cumplidas',
                "color" => '#72D572',
                "data"  => $arrayAcumuladoE
            )
        );
        return $data;
    }


    public function ejecucion($arrayActHijas)
    {
        //Recorro todas las acts hijas del plan para calculares sus valores
        $cumplidas = 0;
        $planifiUMes = 0;
        $planifiUSem = 0;
        $cumplidasUMes = 0;
        $cumplidasUSem = 0;
        $actModel = new CmpgestionaractividadesModel();
        foreach ($arrayActHijas as $k => $act) {
            if ($act['gradocumplimiento'] == 100) {
                $cumplidas++;
            }
            //Ultimo mes
            $tiempo1 = $actModel->dias_transcurridos(
                $act['fechainicio'], date('01/m/Y')
            );
            $tiempo2 = $actModel->dias_transcurridos(
                $act['fechainicio'], date('31/m/Y')
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $planifiUMes++;
                if ($act['gradocumplimiento'] == 100) {
                    $cumplidasUMes++;
                }
            }
            //ultima semana
            if (date('D') == 'Mon') {
                $esteL = date('Y-m-d');
            } else {
                $esteL = date('Y-m-d', strtotime('last monday'));
            }
            $esteD = date(
                'Y-m-d', strtotime('+6 day', strtotime($esteL))
            );
            $esteLunes = date('d/m/Y', strtotime($esteL));
            $esteDomingo = date('d/m/Y', strtotime($esteD));

            $tiempo1 = $actModel->dias_transcurridos(
                $act['fechainicio'], $esteLunes
            );
            $tiempo2 = $actModel->dias_transcurridos(
                $esteDomingo, $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                $planifiUSem++;
                if ($act['gradocumplimiento'] == 100) {
                    $cumplidasUSem++;
                }
            }
        }
        $arrayPlanificadas[0] = count($arrayActHijas);//total
        $arrayPlanificadas[1] = $planifiUMes;//ultimo mes
        $arrayPlanificadas[2] = $planifiUSem;//ultima semana
        $arrayCumplidas[0] = $cumplidas;
        $arrayCumplidas[1] = $cumplidasUMes;
        $arrayCumplidas[2] = $cumplidasUSem;
        $data = Array(
            array(
                "name"  => 'Planificadas',
                "color" => '#72D572',
                "data"  => $arrayPlanificadas
            ), array(
                "name"  => 'Cumplidas',
                "color" => '#FF5261',
                "data"  => $arrayCumplidas
            )
        );
        return $data;
    }


}
