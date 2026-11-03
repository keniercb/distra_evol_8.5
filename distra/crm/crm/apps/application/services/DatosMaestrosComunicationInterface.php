<?php

/**
 * DatosMaestrosComunicationInterface
 *
 * Esta clase sirve como capa de abstracción
 * para la comunicación con el subsistema datos maestros.
 *
 * @package       ERP-PCRM
 * @category      Model
 * @author        Ing. Alberto Mesa martínez
 * @copyright (c) 2015, XETID
 * @version       1.0
 */
class DatosMaestrosComunicationInterface extends ZendExt_Model
{
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    public function getMonedas($filtro = "", $start = 0, $limit = 25)
    {
        try {
            return $this->integrator->datosmaestros->getNomencladorMoneda(
                array('codigoiso' => $filtro), $start, $limit
            );
        } catch (Exception $e) {
            return array();
        }
    }

    public function getMonedaById($idmoneda)
    {
        try {
            return $this->integrator->datosmaestros->buscarNomMoneda($idmoneda);
        } catch (Exception $e) {
            return array();
        }
    }

    public function getClientes($filtro = "", $start = 0, $limit = 25)
    {
        try {
            $idestructura = $this->global->Estructura->idestructura;
            return $this->integrator->datosmaestros->getClientesProveedorByParams(
                null, $idestructura, true, false, $filtro, $start, $limit
            );
        } catch (Exception $e) {
            return array();
        }

    }

    public function getClientesProveedores($filtro = "", $start = 0, $limit = 25){
        try {
            $idestructura = $this->global->Estructura->idestructura;
            return $this->integrator->datosmaestros->getClientesProveedorByParams(
                null, $idestructura, null, null, $filtro, $start, $limit
            );
        } catch (Exception $e) {
            return array();
        }
    }

    public function getClienteById($idcliente)
    {
        try {
            return $this->integrator->datosmaestros->getClientesProveedorByParams($idcliente);
        } catch (Exception $e) {
            throw $e;
        } catch (Exception $e) {
            return array();
        }
    }

    public function getTasasByMoneda($idnommonedaentidad)
    {
        try {
            $result = $this->integrator->datosmaestros->obtenerAllTasasByMoneda($idnommonedaentidad);
            if ($result[0] == new stdClass()) {
                return array();
            }
            return $result;
        } catch (Exception $e) {
            return array();
        }
    }

    public function getCodicionesPago($params)
    {
        try {
            return $this->integrator->datosmaestros->obtenerCondicionesPago($params);
        } catch (Exception $e) {
            return array();
        }
    }

    public function getDocumentosPrimarios($params)
    {
        try {
            return $this->integrator->datosmaestros->documentosPorSubsistemaEntidad(
                $params['idsubsistema'], $params['idestructura'], $params
            );
        } catch (Exception $e) {
            return array();
        }
    }

    public function getEspacioTrabajoCliente($params){
        try {
            return $this->integrator->datosmaestros->obtenerEspacioTrabajo($params);
        } catch (Exception $e) {
            return array();
        }
    }

    public function getMonedasEntidad($identidad){
        try{
            return $this->integrator->datosmaestros->obtenerMonedasPorEntidad($identidad)['datos'];
        }catch (Exception $e){
            return array();
        }
    }
}