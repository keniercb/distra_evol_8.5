<?php

class DatIndicadorHito extends BaseDatIndicadorHito
{

    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        parent::setUp();
    }

    public function guardarIndicadorHito($params, $idhito)
    {
        try {
            $indicador = $params->idindicadorcontrato ?
                Doctrine::getTable('DatIndicadorHito')->find($params->idindicadorcontrato)
                : new DatIndicadorHito();
            $indicador->idindicador = $params->idindicador ? $params->idindicador : null;
            $indicador->idactividad = $params->idactividad ? $params->idactividad : null;
            $indicador->idhito = $idhito;
            $indicador->denominacion = $params->denominacion;
            $indicador->tipo = $params->tipo;
            $indicador->cantidad = $params->cantidad;
//            $indicador->idproductoasociado = $params->idproductoasociado?$params->idproductoasociado:null;
            $indicador->save();
            DatMonedaIndicador::guardarMonedaIndicador($params, $indicador->idindicadorhito);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function guardarIndicadorHitoDatosAdicionales($params, $idhito)
    {
        try {
            $indicador = $params->idindicadorcontrato ?
                Doctrine::getTable('DatIndicadorHito')->find($params->idindicadorcontrato)
                : new DatIndicadorHito();
            $indicador->idproductoasociado = $params->idproductoasociado?$params->idproductoasociado:null;
            $indicador->save();
        } catch (Exception $e) {
            throw $e;
        }
    }

    static function eliminarIndicadoresHitos($array)
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatIndicadorHito')
            ->whereIn('idindicadorhito', $array)
            ->execute();
    }

    public function cargarIndicadoresHito($post)
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $query
            = "SELECT ih.idindicadorhito as idindicadorcontrato, ih.idindicador,
            ih.idactividad, ih.cantidad, COALESCE(ih.denominacion, i.denominacion) as denominacion, 
            ih.tipo, COALESCE(i.precio, 0) as precio, ip.preciodivisa, 
            ih.idproductoasociado, i2.denominacion as productoasociado,
            COALESCE(um.denominacionunidadmedida, 'Unidad') as unidadmedida
            FROM mod_crmcontratacion.dat_indicadorhito ih
            LEFT JOIN mod_datosmaestros.nom_indicador i on ih.idindicador = i.idindicador
            LEFT JOIN mod_datosmaestros.nom_indicadorplanif ip on i.idindicador = ip.idindicador
            LEFT JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida
            LEFT JOIN mod_datosmaestros.nom_indicador i2 on ih.idproductoasociado = i2.idindicador
            WHERE ih.idhito=" . $post['idhito'];
        return $conexionActual->fetchAll($query);
    }
}
