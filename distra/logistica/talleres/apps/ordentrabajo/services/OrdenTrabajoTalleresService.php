<?php

/**
 * @class      OrdenTrabajoTalleresService
 * @package    talleres
 * @author     Daniel Arias Epinosa
 * @copyright  XETID
 */
class OrdenTrabajoTalleresService extends ZendExt_Model
{
    private $_model;

    public function __construct()
    {
        parent::ZendExt_Model();
        $aperturaAFT = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_AFT);
        $this->_model = new OrdenTrabajoTalleresModel(
            array('alias' => 'ordenServicioLOG', 'subsistema' => LogisticaGlobal::SUBSISTEMA_TALLERES), $aperturaAFT
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

    public function updateDatosMateriasles($idPadres)
    {
        return $this->_model->updateDatosMateriasles($idPadres);
    }

    public function actualizarCumplimiento($parametros) {
        if (!class_exists('TrabajoOperariosModel')) {
            $dirBase = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/talleres/trabajooperarios/';
            include_once $dirBase . 'models/bussines/TrabajoOperariosModel.php';
            include_once $dirBase . 'models/domain/generated/BaseDatTrabajoOperarios.php';
            include_once $dirBase . 'models/domain/generated/BaseDatTrabajoOperariosDetallado.php';
            include_once $dirBase . 'models/domain/DatTrabajoOperarios.php';
            include_once $dirBase . 'models/domain/DatTrabajoOperariosDetallado.php';
        }
        return $this->_model->actualizarCumplimiento($parametros);
    }


}
