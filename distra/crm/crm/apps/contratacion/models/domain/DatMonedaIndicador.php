<?php

class DatMonedaIndicador extends BaseDatMonedaIndicador
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
            if(isset($params->precio)){
//                print('/*entro cup*/');
                $objDoctrine = Doctrine_Manager::getInstance();
                $conexionActual = $objDoctrine->getCurrentConnection();
                $moneda=$conexionActual->fetchAll(
                    "SELECT m.idmoneda  FROM mod_datosmaestros.nom_moneda m
                            WHERE m.codigoiso='CUP'" );
//                $monedacup=Doctrine::getTable('DatMonedaIndicador')
//                    ->findBy('idindicadorhito',$idindicadorhito);
//                    ->findBy(array('idindicadorhito'=>$idindicadorhito, 'idmoneda'=>$moneda[0]['idmonedaentidad']));
//                $aux=$conexionActual->fetchAll('SELECT * FROM mod_crmcontratacion.dat_monedaindicador mi
//                  WHERE mi.idindicadorhito ='.$idindicadorhito.' AND
//                  mi.idmoneda = '.$moneda[0]['idmonedaentidad']);
                $monedacup=Doctrine_Query::create()->select()->from('DatMonedaIndicador mi')
                    ->where('mi.idindicadorhito = ?', $idindicadorhito)
                    ->andWhere('mi.idmoneda = ?', $moneda[0]['idmoneda'])->execute()->getFirst();
//                if($monedacup->count()>0){
                if(!$monedacup){
                    $monedacup=new DatMonedaIndicador();
                    $monedacup->idmoneda = $moneda[0]['idmoneda'];
                    $monedacup->idindicadorhito = $idindicadorhito;
                }
                $monedacup->valor = $params->precio;
                $monedacup->save();
//                print('/*salgo cup*/');
            }
            if(isset($params->preciodivisa)){
//                print('/*entro*/');
//                print('/*'.$idindicadorhito.'*/');
                $objDoctrine = Doctrine_Manager::getInstance();
                $conexionActual = $objDoctrine->getCurrentConnection();
                $moneda=$conexionActual->fetchAll(
                    "SELECT m.idmoneda  FROM  mod_datosmaestros.nom_moneda m 
                              WHERE m.codigoiso='CUC'" );
                $monedacuc=Doctrine_Query::create()->select()->from('DatMonedaIndicador mi')
                    ->where('idindicadorhito = ?', $idindicadorhito)
                    ->andWhere('idmoneda = ?', $moneda[0]['idmoneda'])->execute()->getFirst();
                if(!$monedacuc){
//                    print('/*entro tambien*/');
                    $monedacuc=new DatMonedaIndicador();
                    $monedacuc->idmoneda = $moneda[0]['idmoneda'];
                    $monedacuc->idindicadorhito = $idindicadorhito;
                }
//                print('/*entro incluso*/');
                $monedacuc->valor = $params->preciodivisa;
                $monedacuc->save();
//                print('/*entro aaaa*/');
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
                  FROM mod_crmcontratacion.dat_monedaindicador mh
                  WHERE mh.idindicadorhito=".$post['idindicador'];
        $monedas=$conexionActual->fetchAll(
            "SELECT me.idmonedaentidad  FROM mod_datosmaestros.dat_monedaentidad me 
                LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=me.idmoneda 
                WHERE m.codigoiso='CUP' AND me.idestructuracomun=".$post['idestructura'] );
        $count=$conexionActual->fetchAll($querycount)[0]['count'];
        if($count==0) {
            $query = "SELECT 0 as monto,
                    mi.idmonedaentidad,m.idmoneda, m.codigoiso as moneda
                    FROM mod_datosmaestros.dat_monedaentidad mi
                    LEFT JOIN mod_datosmaestros.nom_moneda m
                    ON m.idmoneda=mi.idmoneda WHERE mi.idestructuracomun=".$post['idestructura'];
            return $conexionActual->fetchAll($query);
        }else{
            $query = "SELECT mh.idmonedaindicador, mh.valor as monto,
                me.idmonedaentidad,m.idmoneda, m.codigoiso as moneda
                FROM mod_crmcontratacion.dat_monedaindicador mh
                LEFT JOIN mod_datosmaestros.dat_monedaentidad me
                ON me.idmoneda=mh.idmoneda
                LEFT JOIN mod_datosmaestros.nom_moneda m
                ON m.idmoneda=mh.idmoneda
                WHERE mh.idindicadorhito=" . $post['idindicador']." AND 
                me.idestructuracomun=".$post['idestructura'];
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
}
