<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatPlanPdoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatPlanPdo $datPlan)
    {
        $datPlan->save();
    }

    public function Actualizar(DatPlanPdo $datPlan)
    {
        $datPlan->save();
    }

    public function Eliminar($datPlan)
    {
        $datPlan->delete();
    }

    public function CargarPlanes(
        $nodo, $idusuario, $iddominio, $certificado, $denominacion,
        $fechainicio, $fechafin,
        $enaprobacion, $estadoaprob, $arrayautores, $categplan, $car, $offset,
        $limit
    ) {
        if (!isset($arrayautores[0]->idusuario)) {
            $arrayaut[]['idusuario'] = $idusuario;
            if ($enaprobacion) {
                //Caso de cargar los planes creados por mi y mis 
                //subordinados(en estado de aprobacion)
                $subordinados
                    = $this->pIntegrator->configuracionpdo->DameSubordinados(
                    $certificado, $iddominio, $idusuario
                );
                if (isset($subordinados[0])) {
                    foreach ($subordinados as $subrod) {
                        $arrayaut[]['idusuario'] = $subrod['idusuario'];
                    }
                }
            }
        } else {
            if (isset($arrayautores[0]->idusuario)) {
                foreach ($arrayautores as $autor) {
                    $arrayaut[]['idusuario'] = $autor->idusuario;
                }
            }
        }
        if ($estadoaprob != null) {
            $arrayestados['data'][0]['idestado'] = $estadoaprob;
        } else {
            $arrayestados = $this->pIntegrator->workflow->EstadosVerDoc(
                $idsubsistema = 15, $idusuario, $idtipodoc = 0
            );
        }
        $objelemmodel = new DatElementosModel();
        $estadoaprobpordefcto = $objelemmodel->ObtenerEstadoAprobPorDefecto(
            $idsubsistema = 15, $idusuario, $idtipodocumento = 0
        );
        $arrayplaness = DatPlanPdo::GetTodosXCriterio(
            $arrayaut, $denominacion, $fechainicio, $fechafin,
            $arrayestados, $categplan, $car, $offset, $limit,
            $estadoaprobpordefcto, $idusuario
        );
        $arrayplanes = $arrayplaness[1];
        if (isset($arrayplanes[0]['idelemento'])) {
            foreach ($arrayplanes as $key => $plan) {
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                $entrada = 1;
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
                }
                $idcategplan = null;
                $categplan = '';
                $nomencladorcategplan
                    = DatElementosNomNomenclador::DameIdNomencladorDadoTipoNom(
                    $plan['idplan'], $tiponomenclador = 0
                );
                if ($nomencladorcategplan) {
                    $idcategplan = $nomencladorcategplan[0]['idnomenclador'];
                    $objnom
                        = $this->pIntegrator->configuracionpdo->DameDatosNomenclador(
                        $idcategplan
                    );
                    $categplan = $objnom->dennomenclador;
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
                $arrayplanes[$key]['nombreautor']
                    = $this->integrator->seguridad->nombreUsuario(
                    $plan['idusuariocrea']
                );
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
        return $arrayplaness;
    }

    public function adicionarPlan(
        $idusuariocrea, $denelemento, $descelemento, $gradocumplimiento,
        $idcategoria, /*$idestadocump,*/
        $fechainicio, $fechafin
    ) {
        $temp = DatElementos::ExisteNombreElemento(
            $idusuariocrea, $denelemento
        );
        if ($temp == null) {
            $objelemmodel = new DatElementosModel();
            $estadoaprobpordefcto = $objelemmodel->ObtenerEstadoAprobPorDefecto(
                $idsubsistema = 15, $idusuariocrea, $idtipodocumento = 0
            );
            //validar si retorna null....
            $estadocumplimiento = $objelemmodel->actualizarEstadoCumplimiento(
                $estadocumplimiento, $gradocumplimiento
            );
            $datelemento = new DatElementos();
            $datelemento->idusuariocrea = $idusuariocrea;
            $datelemento->denelemento = $denelemento;
            $datelemento->descelemento = $descelemento;
            $datelemento->gradocumplimiento = $gradocumplimiento;
            $datelemento->idtipoelemento = 0;
            $datelemento->idestadoaprob = $estadoaprobpordefcto;
            $datelemento->activo = 1;
            $datelemento->estadocumplimiento = $estadocumplimiento;
            $datelemento->save();
            $this->conn->commit();
            $this->conn->beginTransaction();
            $elemnom = new DatElementosNomNomenclador();
            $elemnom->idelemento = $datelemento->idelemento;
            $elemnom->idnomenclador = $idcategoria;
            $elemnom->tiponomenclador = 0;
            $elemnom->save();
            $this->conn->commit();
            $this->conn->beginTransaction();
            /*Adicionar plan*/
            $datplanpdo = new DatPlanPdo();
            $fechainicio = $this->adddate($fechainicio);
            $datplanpdo->idplan = $datelemento->idelemento;
            $datplanpdo->fechainicio = $fechainicio;
            $datplanpdo->fechafin = $this->adddate($fechafin);
            $datplanpdo->save();
            $this->conn->commit();
            return false;
        } else {
            //Exista un elemento de igual nombre para el mismo usuario.
            return true;
        }
    }

    function adddate($fecha)
    {
        $data = explode("/", $fecha);
        $date = new DateTime();
        $date->setDate($data[2], $data[1], $data[0]);
        $format = $this->global->Formato->fecha;
        $day = $date->format("$format");
        return $day;
    }

    public function obtenerEstadosAprobacion(
        $idsubsistema, $idusuario, $idtipodocumento, $idelemento,
        $idestadoinicial
    ) {
        $objelemento = Doctrine::getTable('DatElementos')->find($idelemento);
        if ($idestadoinicial == $objelemento->idestadoaprob) {
            $objelementosmodel = new DatElementosModel();
            $estados = $objelementosmodel->ObtenerEstadosAModificarDoc(
                $idsubsistema, $idusuario, $idtipodocumento, $idestadoinicial
            );
        } else {
            $estados = array('codigo'  => 3,
                             'mensaje' => 'El estado de este plan ha sido 
                                 cambiado y no es el mismo que se le muestra en
                                 el registro.Por favor actualice el registro 
                                 de planes.');
        }
        return $estados;
    }

    public function CambiarEstadoAprob(
        $idelem, $idusuariosession, $idestadoinicial, $idestadofinal,
        $idtipodoc, $obj, $idsubsistema
    ) {
        $objelementosmodel = new DatElementosModel();
        $respuesta = $objelementosmodel->CambiarEstadoAprobacion(
            $idelem, $idusuariosession, $idestadoinicial, $idestadofinal,
            $idtipodoc, $obj, $idsubsistema
        );
        return $respuesta;
    }

    public function cambiarFormatoFechaAction($fecha)
    {
        list($anno, $mes, $dia) = explode("-", $fecha);
        return $dia . "/" . $mes . "/" . $anno;
    }

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
                        $objelementomodel = new DatElementosModel();
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
                        $objelementomodel = new DatElementosModel();
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
                        $objelementomodel = new DatElementosModel();
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

}

