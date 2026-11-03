<?php

/**
 * @class      OrdenTalleresService
 * @package    talleres
 * @author     Daniel Arias Epinosa
 * @copyright  XETID
 */
class ProduccionService extends ZendExt_Model
{
    private $model;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->model = new OrdenProduccionModel(array('alias' => 'produccionLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_PRODUCCION));
    }

    /**
     * devuelve ademas las actividades y materiales asociados.
     *
     * @param $parametrosz
     *
     * @return array
     */
    public function getOrdenesCerradas($parametros)
    {
        return $this->model->cargarOrdenesCerradas($parametros);
    }

    /**
     * @param $ides
     *
     * @return array
     */
    public function getOrdenesCerradasEspecificas($ides)
    {
        return $this->model->cargarOrdenesCerradasEspecificadas($ides);
    }

    /**
     * devuelve  las ordenes de trabajo y filtra por estado, cliente, fechainicio, fechaentrega, idproducto
     *
     * @param      $params
     * @param bool $dqlResult
     *
     * @return array|Doctrine_Query
     */
    public function devolverOrdenes($params, $dqlResult)
    {
        $params['idejercicio'] = ServiciosConfiguracionGeneralHelper::__init()->getEjercicioActualSubsistema(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_TALLERES
        );
        return $this->model->cargarOrdenes($params, $dqlResult);
    }

    /**
     * @param      $idordentrabajo
     * @param bool $dqlResult
     *
     * @return array|Doctrine_Query
     */
    public function devolverMaterialesOrden($params = array())
    {
        return $this->model->obtenerMateriales($params);
    }


}
