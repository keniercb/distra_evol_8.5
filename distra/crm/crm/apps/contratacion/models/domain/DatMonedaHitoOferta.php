<?php

class DatMonedaHitoOferta extends BaseDatMonedaHitoOferta
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
//            print('/*llegaaaa*/');
//            print_r($params);die;
            $moneda = $params->idmonedahito ? Doctrine::getTable('DatMonedaHitoOferta')->find($params->idmonedahito)
                : new DatMonedaHitoOferta();
            $moneda->idmoneda = $params->idmoneda;
            $moneda->idhitooferta = $idhito;
            $moneda->valor = $params->monto?$params->monto:0;
            $moneda->save();
        } catch (Doctrine_Exception $e) {
//            print('Error monedahito');
//            print_r('|'.$e->getCode().'|');
//            print_r('|'.$e->errorMessage().'|');
//            print_r('|'.$e->getMessage().'|');
            return array('code' => $e->getCode(), 'msg' => $e->errorMessage(), 'success' => false);
        }
    }

    public function cargarMonedasHito($post){
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
//        print_r($post);die;
        $querycount = "SELECT count(mh.idmonedahitooferta) 
                  FROM mod_crmcontratacion.dat_monedahitooferta mh
                  WHERE mh.idhitooferta=".$post['idhito'];
        $count=$conexionActual->fetchAll($querycount)[0]['count'];
        if($count==0) {
            $query = "SELECT 0 as monto, 
                me.idmonedaentidad,m.idmoneda, m.codigoiso as moneda
                FROM mod_datosmaestros.dat_monedaentidad me
                LEFT JOIN mod_datosmaestros.nom_moneda m
                ON m.idmoneda=me.idmoneda WHERE me.idestructuracomun=".$post['idestructura'];
            return $conexionActual->fetchAll($query);
        }else {
            $query = "SELECT mh.idmonedahitooferta as idmonedahito, mh.valor as monto, 
                me.idmonedaentidad,m.idmoneda, m.codigoiso as moneda
                FROM mod_crmcontratacion.dat_monedahitooferta mh
                LEFT JOIN mod_datosmaestros.dat_monedaentidad me
                ON me.idmoneda=mh.idmoneda
                LEFT JOIN mod_datosmaestros.nom_moneda m
                ON m.idmoneda=mh.idmoneda
                WHERE mh.idhitooferta=" . $post['idhito']." AND me.idestructuracomun=".$post['idestructura'];
            return $conexionActual->fetchAll($query);
        }
    }
}
