<?php

class DatMonedaIndicadorOferta extends BaseDatMonedaIndicadorOferta
{

    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        parent::setUp();
    }

    public function guardarMonedaIndicador($params, $idindicadorhito){
        try {
//            print_r($params);
            if($params->precio){
                $objDoctrine = Doctrine_Manager::getInstance();
                $conexionActual = $objDoctrine->getCurrentConnection();
                $moneda=$conexionActual->fetchAll(
                    "SELECT m.idmoneda  FROM mod_datosmaestros.dat_monedaentidad me
                LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=me.idmoneda WHERE m.codigoiso='CUP'" );

                $monedacup = Doctrine_Query::create()->select()->from('DatMonedaIndicadorOferta mi')
                    ->where('mi.idindicadoroferta = ?', $idindicadorhito)
                    ->andWhere('mi.idmoneda = ?', $moneda[0]['idmoneda'])->execute()->getFirst();
                if(!$monedacup){
                    $monedacup=new DatMonedaIndicadorOferta();
                    $monedacup->idmoneda = $moneda[0]['idmoneda'];
                    $monedacup->idindicadoroferta = $idindicadorhito;
                }
                $monedacup->valor = $params->precio;
                $monedacup->save();
            }
            if($params->preciodivisa){
                $objDoctrine = Doctrine_Manager::getInstance();
                $conexionActual = $objDoctrine->getCurrentConnection();
                $moneda=$conexionActual->fetchAll(
                    "SELECT me.idmoneda FROM mod_datosmaestros.dat_monedaentidad me
                LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=me.idmoneda WHERE m.codigoiso='CUC'" );
                $monedacuc=Doctrine_Query::create()->select()->from('DatMonedaIndicadorOferta mi')
                    ->where('idindicadoroferta = ?', $idindicadorhito)
                    ->where('idmoneda = ?', $moneda[0]['idmoneda'])->execute()->getFirst();
                if(!$monedacuc){
                    $monedacuc=new DatMonedaIndicadorOferta();
                    $monedacuc->idmoneda = $moneda[0]['idmoneda'];
                    $monedacuc->idindicadoroferta = $idindicadorhito;
                }
                $monedacuc->valor = $params->preciodivisa;
                $monedacuc->save();
            }
        } catch (Exception $e) {
            throw $e;
            //print('Error monedindi');
//            print_r('|'.$e->getCode().'|');
//            print_r('|'.$e->errorMessage().'|');
//            print_r('|'.$e->getMessage().'|');
            return array('code' => $e->getCode(), 'msg' => $e->errorMessage(), 'success' => false);
        }
    }

    public function cargarMonedasIndicador($post){
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $querycount = "SELECT count(mh.idmonedaindicadoroferta)
                  FROM mod_crmcontratacion.dat_monedaindicadoroferta mh
                  WHERE mh.idindicadoroferta=".$post['idindicador'];
//        $monedas=$conexionActual->fetchAll(
//            "SELECT me.idmonedaentidad  FROM mod_datosmaestros.dat_monedaentidad me
//                LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=me.idmoneda WHERE m.codigoiso='CUP'" );
        $count=$conexionActual->fetchAll($querycount)[0]['count'];
        if($count==0) {
            $query = "SELECT 0 as monto,
                    mi.idmonedaentidad,mi.idmoneda, m.codigoiso as moneda
                    FROM mod_datosmaestros.dat_monedaentidad mi
                    LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=mi.idmoneda
                    LEFT JOIN mod_datosmaestros.dat_monedaentidad me ON me.idmoneda=m.idmoneda
                    WHERE me.idestructuracomun=".$post['idestructura'] ;
            return $conexionActual->fetchAll($query);
        }else{
            $query = "SELECT DISTINCT mh.idmonedaindicadoroferta, mh.idmoneda, mh.valor as monto,
                me.idmonedaentidad,me.idmoneda, m.codigoiso as moneda
                FROM mod_crmcontratacion.dat_monedaindicadoroferta mh
                LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=mh.idmoneda
                LEFT JOIN mod_datosmaestros.dat_monedaentidad me ON me.idmoneda=m.idmoneda
                WHERE mh.idindicadoroferta=" . $post['idindicador']." AND me.idestructuracomun=".$post['idestructura'] ;
//            print($query);die;
            return $conexionActual->fetchAll($query);
        }
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
    public function guardarMonedaEntidadIndicador($params, $idindicadorhito){
        try {
            $monedas = new Doctrine_Collection('DatMonedaIndicadorOferta');
            foreach ($params as $k => $v) {
                if (preg_match('/montomoneda_/i', $k)) {
                    $temp = explode('_', $k);
                    $moneda = Doctrine::getTable('DatMonedaIndicadorOferta')
                        ->findByDql(
                            'idindicadoroferta=? and idmoneda=?',
                            array($idindicadorhito, $v)
                        );
                    if (!$moneda->count()) {
                        $moneda = new DatMonedaIndicadorOferta();
                        $moneda->idindicadoroferta = $idindicadorhito;
                        $moneda->idmoneda = $temp[2];
                    } else {
                        $moneda = $moneda->getFirst();
                    }
                    $moneda->valor = $params['montomoneda_' . $temp[1].'_'.$temp[2]]
                        ? $this->formatearNumero(
                            $params['montomoneda_' . $temp[1] . '_' . $temp[2]]
                        ) : 0;
                    $monedas->add($moneda);
                }
            }
            $monedas->save();
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function formatearNumero($numero)
    {
        return str_replace(',', '.', $numero);
    }
}
