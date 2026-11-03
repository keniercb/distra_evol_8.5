<?php

/**
 * @class      GestplanesconteoModel
 * Modelo de Gesti�n de Planes de Conteo
 *
 * @package    Inventario
 * @subpackage Inventario
 * @author     Alien Fern�ndez Fuentes
 * @copyright  UCID-ERP Cuba
 * @version    1.0
 */
class GestPlanConteoModel extends BaseModel
{
    private $planconteo;
    private $planconteomes;

    public function __construct()
    {
        parent::__construct();
        $this->planconteo = new DatPlanconteo();
        $this->planconteomes = new DatPlanconteom();
    }

    public function cargarPlanesConteo($arrDatos = array())
    {
        $arrDatos['idestructuraop'] = $arrDatos['idestructura'];
        $estructura = 'Estructura';
        $idestructura = $this->global->$estructura->idestructura;
        $arrDatos['idejerciciosubsistema'] = $this->configuracionHelper
        ->getEjercicioActualSubsistema($idestructura, $arrDatos['subsistema']);
        $arrPlanes = DatPlanconteo::ObtenerPlanesConteo($arrDatos);
        foreach ($arrPlanes as $index => $plan) {
            $datejercicio = $this->configuracionHelper->obtenerEjercicio($plan['idejercicio']);
            $arrPlanes[$index]['nombreplan'] = "Plan de conteo ".$datejercicio[0]->nombre;
            $arrPlanes[$index]['nbejercicio'] = $datejercicio[0]->nombre;
            $usuario = $this->seguridadHelper->getUsersNameById($plan['idusuario']);
            $arrPlanes[$index]['usuario'] = $usuario[0]['nombreusuario'];
            if ($plan['idusuarioaprobado']) {
                $aprobar = $this->seguridadHelper->getUsersNameById($plan['idusuarioaprobado']);
                $arrPlanes[$index]['usuarioaprobado'] = $aprobar[0]['nombreusuario'];
            } else {
                $arrPlanes[$index]['idusuarioaprobado'] = '-';
            }
            $arrPlanes[$index]['estado'] = $this->obtenerDenominacionEstado($plan['estado']);
        }
        return $arrPlanes;
    }

    function crearPlanConteo($objCrearPlan)
    {
        $bandera = false;
        $estructura = 'Estructura';
        $idestructura = $this->global->$estructura->idestructura;
        $obj = $objCrearPlan['subsistema'];
        $idEjercactual = $this->configuracionHelper->getEjercicioActualSubsistema($idestructura, $obj);
        $verificarPlanAnual = DatPlanconteo::verificarExistePlanAnual($idEjercactual, $objCrearPlan['idestructura']);
        if ($verificarPlanAnual == 0) {
            $objNuevoPlan = new DatPlanconteo();
            $objNuevoPlan->estado = 1;
            $objNuevoPlan->idejercicio = $idEjercactual;
            $objNuevoPlan->idestructuraop = $objCrearPlan['idestructura'];
            $objNuevoPlan->idusuario = $this->global->Perfil->idusuario;
            $objNuevoPlan->save();
            $planConteom = new Doctrine_Collection('DatPlanconteom');
            $mes = LogisticaGlobal::MES_ENERO;
            while ($mes != LogisticaGlobal::SIN_MES) {
                $objNuevoPlanMensual = new DatPlanconteom();
                $objNuevoPlanMensual->idperiodo = $mes;
                $objNuevoPlanMensual->porciento = ($objCrearPlan['adicionarporciento']) ?
                    $objCrearPlan['adicionarporciento'] : 0;
                $objNuevoPlanMensual->estado = 1;
                $objNuevoPlanMensual->idplan = $objNuevoPlan->idplan;
                $planConteom[] = $objNuevoPlanMensual;
                $mes = LogisticaGlobal::__init()->getMesSiguiente($mes);
            }
            if ($planConteom->count()) {
                $planConteom->save();
                $bandera = true;
            }
        }
        return $bandera;
    }

    /**
     * Funcion para modificar un mes de un plan de conteo
     *
     * @param object $objCrearPlan - objeto que contiene los datos del plan
     *
     * @return bool
     */
    function modificarPlanConteo($objModPlan)
    {
        foreach ($objModPlan['idplanconteom'] as $index => $idplanconteom) {
            DatPlanconteom::actualizaPorcientoDadoIdplanconteom($idplanconteom, $objModPlan['porciento'][$index]);
        }
        return true;
    }

    /**
     * Funcion para eliminar un plan de conteo
     *
     * @param integer $idplanconteo - contiene el idplan de conteo anual
     *
     * @return bool
     */
    function eliminarPlanConteo($idplanconteo)
    {
        $eliminar = false;
        $cantAprobConfirmados = DatPlanconteom::cantidadMesesAprobadosConfirmados($idplanconteo);

        if ($cantAprobConfirmados[0]['cantidad'] == 0) {
            DatPlanconteom::eliminarPlanConteoMensual($idplanconteo);
            DatPlanconteo::eliminarPlanConteo($idplanconteo);
            $eliminar = true;
        }
        return $eliminar;
    }

    /**
     * Funcion para confirmar un mes del plan de conteo
     *
     * @param integer $idplanconteom - contiene el idplan de conteo mensual
     * @param integer $idmes         - contiene el idmes
     *
     * @return bool
     */
    function confirmarPeriodoPlanConteo($idplanconteom, $idplan,$idperiodo,$arrayplanes)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $subsistema = $global->Subsistema->idsubsistema;
        $objDatPlanConteoMes = Doctrine::getTable('DatPlanconteom')->find($idplanconteom);
        if ($objDatPlanConteoMes->estado == 1) {
            if ($subsistema == 11 ) {
                if ($objDatPlanConteoMes->idperiodo == $idperiodo && in_array($objDatPlanConteoMes->idplanconteom,$arrayplanes)) {
                    DatPlanconteom::actualizaEstadoMes($idplanconteom, 2);
                    DatPlanconteo::actualizaEstadoPlan($idplan, 2);
                }else {
                    return true;
                }
            }
            DatPlanconteom::actualizaEstadoMes($idplanconteom, 2);
            DatPlanconteo::actualizaEstadoPlan($idplan, 2);
        }

        return true;
    }

    /**
     * Funcion para cancelar el estado de un mes del plan de conteo
     *
     * @param integer $idplanconteom - contiene el idplan de conteo mensual
     * @param integer $idmes         - contiene el idmes
     *
     * @return bool
     */
    function anularPeriodoPlanConteo($idplanconteom, $idplan,$idperiodo,$arrayplanes)
    {$global = ZendExt_GlobalConcept::getInstance();
        $subsistema = $global->Subsistema->idsubsistema;
        $objDatPlanConteoMes = Doctrine::getTable('DatPlanconteom')->find($idplanconteom);
        if ($objDatPlanConteoMes->estado == 2){
            if ($subsistema == 11 ) {
                if ($objDatPlanConteoMes->estado == 2 && $objDatPlanConteoMes->idperiodo == $idperiodo 
                && in_array($objDatPlanConteoMes->idplanconteom,$arrayplanes) ){


                DatPlanconteom::actualizaEstadoMes($idplanconteom, 1);
                if (DatPlanconteom::verificarTodosPeriodosEstadoELaboracion($idplan)) {
                    DatPlanconteo::actualizaEstadoPlan($idplan, 1);
                }
                return true;

            }}
            else {
                DatPlanconteom::actualizaEstadoMes($idplanconteom, 1);
            if (DatPlanconteom::verificarTodosPeriodosEstadoELaboracion($idplan)) {
                DatPlanconteo::actualizaEstadoPlan($idplan, 1);
            }
        }
        return true;

            }
            
    }

    /**
     * Funcion para modificar todos los meses de un plan de conteo con
     * un porciento especificado
     *
     * @param object $objModTodosMeses - contiene los datos de los meses
     *                                 que se van a modificar
     *
     * @return bool
     */
    function aplicarPorcientoTodosPeridos($idplan, $porciento)
    {
        DatPlanconteom::aplicarPorcientoDadoIdplan($idplan, $porciento);
        return true;
    }

    /**
     * Funcion para aprobar un mes del plan de conteo
     *
     * @param integer $idplanconteom - contiene el idplan de conteo mensual
     *
     * @return bool
     */
    function aprobarPeriodoPlanConteo($idplanconteom, $idplan, $idperiodo,$arrayplanes)
    {   
        $objDatPlanConteoMes = Doctrine::getTable('DatPlanconteom')->find($idplanconteom);
        $global = ZendExt_GlobalConcept::getInstance();
        $subsistema = $global->Subsistema->idsubsistema;
        if ($objDatPlanConteoMes->estado == 2 ){
            if ($subsistema == 11){    
                if ($objDatPlanConteoMes->estado == 2 &&
                 $objDatPlanConteoMes->idperiodo == $idperiodo && in_array($objDatPlanConteoMes->idplanconteom,$arrayplanes)) {
                    $objDatPlanConteoMes->estado = 5;
                    $objDatPlanConteoMes->idusuarioaprobado = $this->global->Perfil->idusuario;
                    $objDatPlanConteoMes->save();
                    DatPlanconteo::actualizaEstadoPlan($idplan, 3);
                }
                return true;
            }
            else {

                $objDatPlanConteoMes->estado = 5;
                $objDatPlanConteoMes->idusuarioaprobado = $this->global->Perfil->idusuario;
                $objDatPlanConteoMes->save();
                DatPlanconteo::actualizaEstadoPlan($idplan, 3);
            }
            return true;
        
        }          
           
    }

    /**
     * Obtiene la denominacion del estado
     *
     * @param type $idestado
     *
     * @return string
     */
    function obtenerDenominacionEstado($idestado)
    {
        switch ($idestado) {
            case '1':
                $destado = 'Elaboración';
                break;
            case '2':
                $destado = 'Preparado';
                break;
            case '4':
                $destado = 'Anulado';
                break;
            case '5':
                $destado = 'Aprobado';
                break;
        }
        return $destado;
    }

}
