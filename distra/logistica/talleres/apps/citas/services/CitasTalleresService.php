<?php

/**
 * @class      OrdenTrabajoTalleresService
 * @package    talleres
 * @author     Daniel Arias Epinosa
 * @copyright  XETID
 */
class CitasTalleresService extends ZendExt_Model
{
    private $_model;

    public function __construct()
    {
        parent::ZendExt_Model();
        $aperturaAFT = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_AFT);
        $this->_model = new CitasTalleresModel(
            array('alias' => 'citasLOG', 'subsistema' => LogisticaGlobal::SUBSISTEMA_TALLERES), $aperturaAFT
        );
    }

    /**
     * devuelve ademas las actividades y materiales asociados.
     *
     * @param $parametrosz
     *
     * @return array
     */
    public function getOrdenesTrabajoCerradas($parametros)
    {
        return $this->_model->cargarOrdenesTrabajoCerradas($parametros);
    }

    /**
     * @param $ides
     *
     * @return array
     */
    public function getOrdenesTrabajoCerradasEspecificas($ides)
    {
        return $this->_model->cargarOrdenesTrabajoCerradasEspecificadas($ides);
    }

    /**
     * devuelve  las ordenes de trabajo y filtra por estado, cliente, fechainicio, fechaentrega, idproducto
     *
     * @param      $params
     * @param bool $dqlResult
     *
     * @return array|Doctrine_Query
     */
    public function devolverOrdenesTrabajo($params, $dqlResult)
    {
        $params['idejercicio'] = ServiciosConfiguracionGeneralHelper::__init()->getEjercicioActualSubsistema(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_TALLERES
        );
        return $this->_model->cargarOrdenesTrabajo($params, $dqlResult);
    }

    /**
     * @param      $idordentrabajo
     * @param bool $dqlResult
     *
     * @return array|Doctrine_Query
     */
    public function devolverMaterialesOrden($idordentrabajo, $dqlResult = false, $params = array())
    {
        return $this->_model->devolverMaterialesOrden(
            $idordentrabajo, $dqlResult, $params
        );
    }

    public function devolverServiciosDeLasOrdenesCerradas($alias, $params)
    {
        return $this->_model->devolverServiciosDeLasOrdenesCerradas(
            $alias, $params
        );
    }

    public function cargarTecnicos($params)
    {
        $params['criterio'] = ($params['denominaciontecn']) ? $params['denominaciontecn'] : '';
        $result = $this->_model->cargarPersonas(null, $params);
        return $result;
    }

    public function cargarServicios($params)
    {
        $result = $this->_model->cargarActividadesExistentes($params);
        return array('datos' => $result['datos'], 'cantidad' => count($result['datos']));
    }

    public function cargarActividades($params)
    {
        $result = $this->_model->cargarActividades($params);
        $materiales = $this->_model->cargarPiezasDisp($params);
        return array('actividades' => $result['datos'], 'materiales' => $materiales['datos']);
    }

    /**
     * @param $params
     *
     * @return array
     */
    public function cargarReclamacionesOrden($params)
    {
        return $this->_model->cargarReclamacionesOrden($params);
    }

    /**
     * @param $params
     *
     * @return array
     */
    public function cargarPiezasRetiradas($params)
    {
        return $this->_model->cargarPiezasRetiradas($params);
    }

    /**
     * @param $params
     *
     * @return array
     */
    public function cargarIndicadoresPiezasRetiradas($params)
    {
        return $this->_model->cargarIndicadoresPiezasRetiradas($params);
    }

    /**
     * @param $dql
     * @param $aliasMed
     * @param $aliasMarc
     * @param $aliasMod
     *
     * @return mixed
     */
    public function getJoinMedioOrdenConMarcaModelo($dql, $aliasMed, $aliasMarc, $aliasMod)
    {
        return $this->_model->getJoinMedioOrdenConMarcaModelo($dql, $aliasMed, $aliasMarc, $aliasMod);
    }

    /**
     * @param $dql
     * @param $aliasMed
     * @param $aliasMarc
     * @param $aliasMod
     *
     * @return mixed
     */
    public function getJoinOrdenTrabajoConPedido($dql, $aliasPedido, $aliasDocOrigen)
    {
        return $this->_model->getJoinOrdenTrabajoConPedido($dql, $aliasPedido, $aliasDocOrigen);
    }

    public function cargarPiezasFaltantesEnLasOrdenes($params, $dql)
    {
        return $this->_model->cargarPiezasFaltantesEnLasOrdenes($params, $dql);
    }

    public function existePlanfMantenimiento($params)
    {
        return $this->_model->existePlanfMantenimiento($params);
    }

    public function getIdRegNumEnOrdenAbierta($params)
    {
        return $this->_model->getIdRegNumEnOrdenAbierta($params);
    }

    public function devolverEnviadosATallerConEstado($params)
    {
        return $this->_model->devolverEnviadosATallerConEstado($params);
    }

    public function cargarCantidaPiezasRetiradasPorIndicador($params)
    {
        return $this->_model->cargarCantidaPiezasRetiradasPorIndicador($params);
    }

    public function cargarTecnicosDeActividadesEnOrdenes($params)
    {
        return $this->_model->cargarTecnicosDeActividadesEnOrdenes($params);
    }

    /**
     * @descripcion Actualiza los números de vale por los que salieron los materiales del taller.
     * @param $params
     *
     */
    public function actulizarNrosVale($params, $cancelar = false)
    {
        return $this->_model->actulizarNrosVale($params, $cancelar);
    }

    public function cargarCitas($params, $dqlResult = false)
    {
        return $this->_model->devolverCitas($params, $dqlResult);
    }

}
