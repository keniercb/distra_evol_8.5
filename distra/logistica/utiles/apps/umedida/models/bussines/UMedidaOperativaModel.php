<?php

/**
 *  Esta clase gestiona el acceso a datos de los documentos en proceso
 * @copyright XETID
 * @author Divicion de Gestion de Entidades
 * @version 1.0
 */
class UMedidaOperativaModel extends ZendExt_Model
{

    private $serviciosConfiguracion;
    private $idEstructura;

    public function __construct()
    {
        parent::__construct();

        $this->serviciosConfiguracion = ServiciosConfiguracionGeneralHelper::__init();
        $this->idEstructura = $this->global->Estructura->idestructura;
    }

    /**
     * Funcion que permite obtener los documentos en proceso.
     * @params $params (arreglo de parametros a filtrar)
     * @author Daniel Arias Espinosa
     * @return array
     */
    public function getConversionUMedida($params = array())
    {
        return $this->serviciosConfiguracion->obtenerTodosDatosDatConversion($params);
    }

    public function adicionarConversionUM($params = array())
    {
        $datos = Zend_Json::decode($params['data']);
        $datos['idindicador'] = Zend_Json::decode($params['id']);
        $umediaindicador = $this->serviciosConfiguracion->getUMedidaIndicador($datos['idindicador']);
        $datos['idumindicador'] = $umediaindicador[0]['idumedida'];

        $resp = $this->serviciosConfiguracion->salvarDatosDatConversionum($datos);
        if ($resp == 2) {
            $this->success = false;
            $this->respuesta = 2;
        } else if ($resp) {
            return $resp;
        } else if (resp == 3) {
            $this->success = false;
            $this->respuesta = 3;
        }
    }

    public function modificarConversioUM($params = array())
    {
        $datos = Zend_Json::decode($params['data']);
        $datos['idconversionum'] = Zend_Json::decode($params['id']);
        $this->serviciosConfiguracion->salvarDatosDatConversionum($datos);
    }

    public function eliminarConversioUM($params = array())
    {
        $idConversion = Zend_Json::decode($params['id']);
        $this->serviciosConfiguracion->eliminarDatosDatConversion($idConversion[0]);
    }

    public function cargarUMedidaOperativaInicial($param)
    {
        $cantconver = $this->serviciosConfiguracion->existeConversionenDatConversion();

        if ($cantconver == 0) {
            $umediaindicador = $this->serviciosConfiguracion->getUMedidaIndicador($param['idindicador']);

            $um = $this->serviciosConfiguracion->obtenerUnidadMedidaPorId($umediaindicador[0]['idumedida']);
            $datos['idumedidaorigen'] = $um[0]['idunidadmedida'];
            $datos['nombreum'] = $um[0]['abreviaturaunidadmedida'];
        } else {

            $datos = $this->serviciosConfiguracion->obtenerUMedidasConfIndicador($param);
            foreach ($datos as $index => $um) {
                $datos[$index]['idumedidaorigen'] = $um['idumedida'];
            }
        }
        return $datos;
    }

    public function cargarUMedidaOperativaFinal()
    {
        $datos = $this->serviciosConfiguracion->listarUnidadesMedidaTodas();
        $auxDatos = array();
        $i = 0;
        foreach ($datos as $um) {
            $um['idumedidadestino'] = $um['idunidadmedida'];
            $auxDatos[$i] = $um;
            $i++;
        }
        return $auxDatos;
    }

}
