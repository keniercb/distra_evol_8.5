<?php

class DatMonedaIndicadorFacturaArribo extends BaseDatMonedaIndicadorFacturaArribo
{

    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        parent::setUp();
    }

    public function guardarMonedaIndicador($params, $idindicadorfacturaarribo){
        try {
//            print('/*lllaaa*/');
//            print('/*$params->precio:'.$params->precio.'*/');
//            print_r($params);
            if($params['precio']){
                $objDoctrine = Doctrine_Manager::getInstance();
                $conexionActual = $objDoctrine->getCurrentConnection();
                $moneda=$conexionActual->fetchAll(
                    "SELECT m.idmoneda  FROM mod_datosmaestros.dat_monedaentidad me
                LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=me.idmoneda WHERE m.codigoiso='CUP'" );

                $monedacup = Doctrine_Query::create()->select()->from('DatMonedaIndicadorFacturaArribo mi')
                    ->where('mi.idindicadorfacturaarribo = ?', $idindicadorfacturaarribo)
                    ->andWhere('mi.idmoneda = ?', $moneda[0]['idmoneda'])->execute()->getFirst();
                if(!$monedacup){
                    $monedacup=new DatMonedaIndicadorFacturaArribo();
                    $monedacup->idmoneda = $moneda[0]['idmoneda'];
                    $monedacup->idindicadorfacturaarribo = $idindicadorfacturaarribo;
                }
                $monedacup->valor = $params['precio'];
                $monedacup->save();
            }
            if($params['preciodivisa']){
                $objDoctrine = Doctrine_Manager::getInstance();
                $conexionActual = $objDoctrine->getCurrentConnection();
                $moneda=$conexionActual->fetchAll(
                    "SELECT me.idmoneda FROM mod_datosmaestros.dat_monedaentidad me
                LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=me.idmoneda WHERE m.codigoiso='CUC'" );
                $monedacuc=Doctrine_Query::create()->select()->from('DatMonedaIndicadorFacturaArribo mi')
                    ->where('idindicadorcontrato = ?', $idindicadorfacturaarribo)
                    ->andWhere('idmoneda = ?', $moneda[0]['idmoneda'])->execute()->getFirst();
                if(!$monedacuc){
                    $monedacuc=new DatMonedaIndicadorFacturaArribo();
                    $monedacuc->idmoneda = $moneda[0]['idmoneda'];
                    $monedacuc->idindicadorfacturaarribo = $idindicadorfacturaarribo;
                }
                $monedacuc->valor = $params['preciodivisa'];
                $monedacuc->save();
            }
        } catch (Exception $e) {
            throw $e;
//            return array('code' => $e->getCode(), 'msg' => $e->errorMessage(), 'success' => false);
        }
    }

    public function cargarMonedasIndicador($post){
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $querycount = "SELECT count(mh.idmonedaindicador)
                  FROM mod_crmcontratacion.dat_monedaindicadorfacturaarribo mh
                  WHERE mh.idindicadorfacturaarribo=".$post['idindicador'];
        $monedas=$conexionActual->fetchAll(
            "SELECT me.idmonedaentidad  FROM mod_datosmaestros.dat_monedaentidad me 
                LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=me.idmoneda WHERE m.codigoiso='CUP'" );
        $count=$conexionActual->fetchAll($querycount)[0]['count'];
        if($count==0) {
            $query = "SELECT 0 as monto,
                    mi.idmonedaentidad,mi.idmoneda, m.codigoiso as moneda
                    FROM mod_datosmaestros.dat_monedaentidad mi
                    LEFT JOIN mod_datosmaestros.nom_moneda m
                    ON m.idmoneda=mi.idmoneda";
            return $conexionActual->fetchAll($query);
        }else{
            $query = "SELECT mh.idmonedaindicador, mh.idmoneda, mh.valor as monto,
                me.idmonedaentidad,me.idmoneda, m.codigoiso as moneda
                FROM mod_crmcontratacion.dat_monedaindicadorfacturaarribo mh
                LEFT JOIN mod_datosmaestros.dat_monedaentidad me
                ON me.idmoneda=mh.idmoneda
                LEFT JOIN mod_datosmaestros.nom_moneda m
                ON m.idmoneda=mh.idmoneda
                WHERE mh.idindicadorfacturaarribo=" . $post['idindicador'];
            return $conexionActual->fetchAll($query);
        }
    }

    public function guardarMonedaEntidadIndicador($params, $idindicadorfacturaarribo){
//        print_r($idindicadorfacturaarribo);
//        print_r($params);
        try {
            $monedas = new Doctrine_Collection('DatMonedaIndicadorFacturaArribo');

            foreach ($params as $k => $v) {
                if (preg_match('/montomoneda_/i', $k)) {
                    $temp = explode('_', $k);
                    $moneda = Doctrine::getTable('DatMonedaIndicadorFacturaArribo')
                        ->findByDql(
                            'idindicadorfacturaarribo=? and idmoneda=?',
                            array($idindicadorfacturaarribo, $v)
                        );
                    if (!$moneda->count()) {
                        $moneda = new DatMonedaIndicadorFacturaArribo();
                        $moneda->idindicadorfacturaarribo = $idindicadorfacturaarribo;
                        $moneda->idmoneda = $temp[2];
                    } else {
                        $moneda = $moneda->getFirst();
                    }
                    $moneda->valor = $v ? $this->formatearNumero($v) : 0;
//                    $moneda->valor = $params['montomoneda_' . $temp[1].'_'.$temp[2]]
//                        ? $this->formatearNumero(
//                            $params['montomoneda_' . $temp[1] . '_' . $temp[2]]
//                        ) : 0;
                    $monedas->add($moneda);
                }
            }
            $monedas->save();
        } catch (Exception $e) {
//            print_r($e->getMessage());die;
            throw $e;
        }
    }

    private function formatearNumero($numero){
        return str_replace(',', '.', $numero);
    }
}
