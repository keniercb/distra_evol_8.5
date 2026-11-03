<?php

class DatMonedaHito extends BaseDatMonedaHito
{

    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        parent::setUp();
//        $this->hasOne(
//            'DatMonedaEntidad',
//            array('local' => 'idmoneda', 'foreign' => 'idmonedaentidad')
//        );
    }

    public function guardarMonedaHito($params, $idhito){
        try {
            $moneda = $params->idmonedahito ? Doctrine::getTable('DatMonedaHito')->find($params->idmonedahito)
                : new DatMonedaHito();
            $moneda->idmoneda = $params->idmoneda;
            $moneda->idhito = $idhito;
            $moneda->valor = $params->monto?$params->monto:0;
            $moneda->save();
        } catch (Doctrine_Exception $e) {
            throw $e;
//            print('Error monedahito');
//            print_r('|'.$e->getCode().'|');
//            print_r('|'.$e->errorMessage().'|');
//            print_r('|'.$e->getMessage().'|');
//            return array('code' => $e->getCode(), 'msg' => $e->errorMessage(), 'success' => false);
        }
    }

    public function cargarMonedasHito($post){
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $querycount = "SELECT count(mh.idmonedahito) 
                  FROM mod_crmcontratacion.dat_monedahito mh
                  WHERE mh.idhito=".$post['idhito'];
        $count=$conexionActual->fetchAll($querycount)[0]['count'];
        if($count==0) {
            $query = "SELECT 0 as monto, 
                me.idmonedaentidad,m.idmoneda, m.codigoiso as moneda
                FROM mod_datosmaestros.dat_monedaentidad me
                LEFT JOIN mod_datosmaestros.nom_moneda m
                ON m.idmoneda=me.idmoneda WHERE me.idestructuracomun=".$post['idestructura'];
            return $conexionActual->fetchAll($query);
        }else {
            $query = "SELECT mh.idmonedahito, mh.valor as monto, 
                me.idmonedaentidad,m.idmoneda, m.codigoiso as moneda
                FROM mod_crmcontratacion.dat_monedahito mh
                LEFT JOIN mod_datosmaestros.dat_monedaentidad me
                ON me.idmoneda=mh.idmoneda
                LEFT JOIN mod_datosmaestros.nom_moneda m
                ON m.idmoneda=mh.idmoneda
                WHERE mh.idhito=" . $post['idhito']." AND me.idestructuracomun=".$post['idestructura'];
            return $conexionActual->fetchAll($query);
        }
    }
}
