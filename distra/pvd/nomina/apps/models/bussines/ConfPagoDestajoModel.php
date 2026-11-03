<?php

/**
 * Modelo de negocio para gestionar los tipos de nómina.
 *
 * @author Ing. Aroldo L. Hechavarría Hechavarría.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomTipoNomina, Entidad tipo de nómina (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class ConfPagoDestajoModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function ConfPagoDestajoModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de los tipos de nómina.
     *
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de tipos de nómina.
     */
    
    public function obtenerListadoConfPagoDestajo($identidad, $start, $limit)
    {
        $arrayfinal = array();
        $cont = 0;
        $resultado = ConfPagoDestajo::obtenerListadoConfPagoDestajo($identidad, $start, $limit);

        return $resultado;
    }

    public function eliminandoCamposConfiguracion($idconfpagodestajo)
    {
        $objModel = new ConfPagoDestajo();
        $r = $objModel->eliminandoCamposConfiguracion($idconfpagodestajo);
        return $r;
    }

    public function obtenerDenominacionReporte($limite, $inicio)
    {
        $arrayreporte = ConfReportesCertificaciones::obtenerListadoReportesCertificaciones($inicio = 0, $limite = 1000, $criterio = null);
        $arrayDatos = array();
        $cont = 0;

        foreach ($arrayreporte as $i => $valor)
        {
            $arrayDatos[$cont]['idconfreportescertificaciones'] = $valor['idconfreportescertificaciones'];
            $arrayDatos[$cont]['denominacion'] = $valor['denominacion'];
            $cont++;
        }
        return $arrayDatos;
    }

    public function obtenerDenominacionTipoPago($limite, $inicio)
    {
        $arrayreporte = NomTipoPagoModel::obtenerListadoTiposPago($inicio = 0, $limite = 1000);
        $arrayDatos = array();
        $cont = 0;

        foreach ($arrayreporte as $i => $valor)
        {
            $arrayDatos[$cont]['idtipopago'] = $valor['idtipopago'];
            $arrayDatos[$cont]['denominacion'] = $valor['denominacion'];
            $cont++;
        }
        return $arrayDatos;
    }

    public function obtenerListadoObraEntidad($identidad, $limite, $inicio)
    {
        $objModel = new ConfPagoDestajo();
        $r = $objModel->obtenerListadoObraEntidad($identidad, $limite, $inicio);
        return $r;
    }
}
