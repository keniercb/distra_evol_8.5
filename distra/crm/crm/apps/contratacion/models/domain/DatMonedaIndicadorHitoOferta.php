<?php

class DatMonedaIndicadorHitoOferta extends BaseDatMonedaIndicadorHitoOferta
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

            if($params->precio){
                $objDoctrine = Doctrine_Manager::getInstance();
                $conexionActual = $objDoctrine->getCurrentConnection();
                $moneda=$conexionActual->fetchAll(
                    "SELECT m.idmoneda  FROM  mod_datosmaestros.nom_moneda m WHERE m.codigoiso='CUP'" );
//                $monedacup=Doctrine::getTable('DatMonedaIndicador')
//                    ->findBy('idindicadorhito',$idindicadorhito);
//                    ->findBy(array('idindicadorhito'=>$idindicadorhito, 'idmoneda'=>$moneda[0]['idmonedaentidad']));
//                $aux=$conexionActual->fetchAll('SELECT * FROM mod_crmcontratacion.dat_monedaindicador mi
//                  WHERE mi.idindicadorhito ='.$idindicadorhito.' AND
//                  mi.idmoneda = '.$moneda[0]['idmonedaentidad']);
                $monedacup=Doctrine_Query::create()->select()->from('DatMonedaIndicadorHitoOferta mi')
                    ->where('mi.idmonedaindicadorhitooferta = ?', $idindicadorhito)
                    ->andWhere('mi.idmoneda = ?', $moneda[0]['idmoneda'])->execute()->getFirst();
//                if($monedacup->count()>0){
                if(!$monedacup){
                    $monedacup=new DatMonedaIndicadorHitoOferta();
                    $monedacup->idmoneda = $moneda[0]['idmoneda'];
                    $monedacup->idindicadorhitooferta = $idindicadorhito;
                }
                $monedacup->valor = $params->precio;
                $monedacup->save();
            }
            if($params->preciodivisa){
                $objDoctrine = Doctrine_Manager::getInstance();
                $conexionActual = $objDoctrine->getCurrentConnection();
                $moneda=$conexionActual->fetchAll(
                    "SELECT m.idmoneda  FROM mod_datosmaestros.nom_moneda m WHERE m.codigoiso='CUC'" );
                $monedacuc=Doctrine_Query::create()->select()->from('DatMonedaIndicadorHitoOferta mi')
                    ->where('idmonedaindicadorhitooferta = ?', $idindicadorhito)
                    ->andWhere('idmoneda = ?', $moneda[0]['idmoneda'])->execute()->getFirst();
                if(!$monedacuc){
                    $monedacuc=new DatMonedaIndicadorHitoOferta();
                    $monedacuc->idmoneda = $moneda[0]['idmoneda'];
                    $monedacuc->idindicadorhitooferta = $idindicadorhito;
                }
                $monedacuc->valor = $params->preciodivisa;
                $monedacuc->save();
            }
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->errorMessage(), 'success' => false);
        }
    }

    public function cargarMonedasIndicador($post){
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $querycount = "SELECT count(mh.idmonedaindicadorhitooferta)
                  FROM mod_crmcontratacion.dat_monedaindicadorhitooferta mh
                  WHERE mh.idindicadorhitooferta=".$post['idindicador'];
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
            $query = "SELECT mh.idmonedaindicadorhitooferta, mh.valor as monto,
                me.idmonedaentidad,m.idmoneda, m.codigoiso as moneda
                FROM mod_crmcontratacion.dat_monedaindicadorhitooferta mh
                LEFT JOIN mod_datosmaestros.dat_monedaentidad me
                ON me.idmoneda=mh.idmoneda
                LEFT JOIN mod_datosmaestros.nom_moneda m
                ON m.idmoneda=mh.idmoneda
                WHERE mh.idindicadorhitooferta=" . $post['idindicador']." AND 
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
