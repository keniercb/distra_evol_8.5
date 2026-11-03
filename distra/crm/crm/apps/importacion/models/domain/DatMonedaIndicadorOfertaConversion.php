<?php

class DatMonedaIndicadorOfertaConversion extends BaseDatMonedaIndicadorOfertaConversion
{

    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        parent::setUp();
    }

    public function guardarMonedaEntidadIndicador($params, $idindicadorhito){
        try {
            $monedas = new Doctrine_Collection('DatMonedaIndicadorOfertaConversion');
            foreach ($params as $k => $v) {
                if (preg_match('/montomonedaconversion_/i', $k) && $v!=0) {
                    $temp = explode('_', $k);
                    $moneda = Doctrine::getTable('DatMonedaIndicadorOfertaConversion')
                        ->findByDql(
                            'idindicadoroferta=?',
                            array($idindicadorhito)
                        );
                    if (!$moneda->count()) {
                        $moneda = new DatMonedaIndicadorOfertaConversion();
                        $moneda->idindicadoroferta = $idindicadorhito;

                    } else {
                        $moneda = $moneda->getFirst();
                    }
                    $moneda->idmoneda = $temp[2];
                    $moneda->idtasa = $params['idtasa'];
                    $moneda->venta = $params['venta'];
                    $moneda->fecha = $params['fechaconversion'];
                    $moneda->idmonedaoriginal = $params['idmonedaoriginal'];
                    $moneda->valor = $v ? $this->formatearNumero($v) : 0;
                    $monedas->add($moneda);
                }
            }
            $monedas->save();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function cargarMonedasIndicador($post){
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $querycount = "SELECT count(mh.idmonedaindicadorofertaconversion)
                  FROM mod_crmcontratacion.dat_monedaindicadorofertaconversion mh
                  WHERE mh.idindicadoroferta=".$post['idindicador'];
//        $monedas=$conexionActual->fetchAll(
//            "SELECT me.idmonedaentidad  FROM mod_datosmaestros.dat_monedaentidad me
//                LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=me.idmoneda WHERE m.codigoiso='CUP'" );
        $count=$conexionActual->fetchAll($querycount)[0]['count'];
//        if($count==0) {
//            $query = "SELECT 0 as valor,
//                    mi.idmonedaentidad, mi.idmoneda, m.codigoiso
//                    FROM mod_datosmaestros.dat_monedaentidad mi
//                    LEFT JOIN mod_datosmaestros.nom_moneda m
//                    ON m.idmoneda=mi.idmoneda";
//            return $conexionActual->fetchAll($query);
//        }else{
            $query = "SELECT DISTINCT mh.*, mh.fecha as fechaconversion,
                me.idmonedaentidad, me.idmoneda, m.codigoiso
                FROM mod_crmcontratacion.dat_monedaindicadorofertaconversion mh
                LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=mh.idmoneda
                LEFT JOIN mod_datosmaestros.dat_monedaentidad me ON me.idmoneda=m.idmoneda
                WHERE mh.idindicadoroferta=" . $post['idindicador']." AND me.idestructuracomun=".$post['idestructura'] ;
            return $conexionActual->fetchAll($query);
//        }
    }

    private function formatearNumero($numero)
    {
        return str_replace(',', '.', $numero);
    }

//    public function cargarMonedasHito($post){
//        $objDoctrine = Doctrine_Manager::getInstance();
//        $conexionActual = $objDoctrine->getCurrentConnection();
//        $querycount = "SELECT count(mh.idmonedahito)
//                  FROM mod_crmcontratacion.dat_monedahito mh
//                  WHERE mh.idhito=".$post['idhito'];
//        $count=$conexionActual->fetchAll($querycount)[0]['count'];
//        if($count==0) {
//            $query = "SELECT 0 as monto,
//                me.idmonedaentidad,me.idmoneda, m.codigoiso as moneda
//                FROM mod_datosmaestros.dat_monedaentidad me
//                LEFT JOIN mod_datosmaestros.nom_moneda m
//                ON m.idmoneda=me.idmoneda";
//            return $conexionActual->fetchAll($query);
//        }else {
//            $query = "SELECT mh.idmonedahito, mh.idmoneda, mh.valor as monto,
//                me.idmonedaentidad,me.idmoneda, m.codigoiso as moneda
//                FROM mod_crmcontratacion.dat_monedahito mh
//                LEFT JOIN mod_datosmaestros.dat_monedaentidad me
//                ON me.idmonedaentidad=mh.idmoneda
//                LEFT JOIN mod_datosmaestros.nom_moneda m
//                ON m.idmoneda=me.idmoneda
//                WHERE mh.idhito=" . $post['idhito'];
//            return $conexionActual->fetchAll($query);
//        }
//    }
}
