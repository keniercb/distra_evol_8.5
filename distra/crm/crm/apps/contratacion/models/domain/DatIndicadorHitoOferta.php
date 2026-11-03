<?php

class DatIndicadorHitoOferta extends BaseDatIndicadorHitoOferta
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
                Doctrine::getTable('DatIndicadorHitoOferta')->find($params->idindicadorcontrato)
                : new DatIndicadorHitoOferta();
            $indicador->idindicador = $params->idindicador ? $params->idindicador : null;
            $indicador->idactividad = $params->idactividad ? $params->idactividad : null;
            $indicador->idhitooferta = $idhito;
            $indicador->denominacion = $params->denominacion;
            $indicador->tipo = $params->tipo;
            $indicador->cantidad = $params->cantidad;
            $indicador->save();
            DatMonedaIndicadorHitoOferta::guardarMonedaIndicador($params, $indicador->idindicadorhitooferta);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->errorMessage(), 'success' => false);
        }

    }

    static function eliminarIndicadoresHitos($array)
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatIndicadorHitoOferta')
            ->whereIn('idindicadorhitooferta', $array)
            ->execute();
    }

    public function cargarIndicadoresHito($post)
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
//        $querycount = "SELECT count(ih.idmonedahito)
//                  FROM mod_crmcontratacion.dat_indicadorhito ih
//                  WHERE ih.idhito=".$post['idhito'];
//        $count=$conexionActual->fetchAll($querycount)[0]['count'];
        $query
            = "SELECT ih.idindicadorhitooferta as idindicadorcontrato, ih.idindicador,
            ih.idactividad, ih.cantidad, COALESCE(ih.denominacion, i.denominacion) as denominacion, 
            ih.tipo, COALESCE(i.precio, 0) as precio, ip.preciodivisa,
            COALESCE(um.denominacionunidadmedida, 'Unidad') as unidadmedida
            FROM mod_crmcontratacion.dat_indicadorhitooferta ih
            LEFT JOIN mod_datosmaestros.nom_indicador i on ih.idindicador = i.idindicador
            LEFT JOIN mod_datosmaestros.nom_indicadorplanif ip on i.idindicador = ip.idindicador
            LEFT JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida
            WHERE ih.idhitooferta=" . $post['idhito'];
        return $conexionActual->fetchAll($query);
    }
}
