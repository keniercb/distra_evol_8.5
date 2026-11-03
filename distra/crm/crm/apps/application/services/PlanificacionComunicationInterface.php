<?php

/**
 * LogisticaComunicationInterface
 *
 * Esta clase sirve como capa de abstracción
 * para la comunicación con el subsistema logistica.
 *
 * @package       ERP-PCRM
 * @category      Model
 * @author        Ing. Alberto Mesa martínez
 * @copyright (c) 2015, XETID
 * @version       1.0
 */
class PlanificacionComunicationInterface extends ZendExt_Model
{
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    public function getActividadesNormadas($params)
    {
        try {
            $filtro[] = ($params['denominacion']) ? array('valor' => $params['denominacion']) : array();
            $idpadre = ($params['idservicio']) ? $params['idservicio'] : null;
            $nivel = $params['nivel'] ? $params['nivel'] : 4;

            $result = $this->integrator->planificacion->obtenerActividadyNorma($nivel, $idpadre, $filtro, 0, null, 1);
            return $result;

        } catch (Exception $e) {
            return array();
        }
    }

    public function getPlantillasProyectos($params)
    {
        try {
            $result = $this->integrator->proyecto->listadoPlantillaProyecto($params);
            return $result;
        } catch (Exception $e) {
            return array();
        }
    }

    public function crearProyecto($params)
    {
        try {
            $result = $this->integrator->proyecto->generarProyectoDePlantilla($params);
            return $result;
        } catch (Exception $e) {
            return array();
        }
    }
}