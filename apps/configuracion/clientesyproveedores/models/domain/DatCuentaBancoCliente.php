<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 10/03/2015
 * Time: 9:42
 */

class DatCuentaBancoCliente extends BaseDatCuentaBancoCliente{

    /**
     * Inicializa el padre
     */
    public function setUp() {
        $this->hasOne('NomClasificacioncontable', array('local' => 'idclasificacioncontable', 'foreign' => 'idclasificacioncontable'));
        $this->hasMany('DatCuentaBancoCliente', array('local' => 'idclienteproveedores', 'foreign' => 'idclienteproveedores'));
        parent::setUp();
    }

    static function deleteFromArray($array){
        $query = Doctrine_Query::create();
        $query->delete()->from('DatCuentaBancoCliente')
            ->whereIn('idcuentabancliente',$array)
            ->execute();
    }

    static function desactiveCuentaBanco($array){
        foreach($array as $a){
            $temp=Doctrine::getTable(
                'DatCuentaBancoCliente'
            )->find($a);
            if($temp){
                $temp->fechafin=date('d-m-Y');
                $temp->save();
            }
        }
    }

    static function getCuentaBancoByIdCliente($idcliente){
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $result = $conexionActual->fetchAll(
            "SELECT c.*,nb.nombre as nombrebanco,ns.numero as numerosucursal,ns.direccion as direccionsucursal,nm.codigoiso,
                (CASE WHEN c.predeterminado = 1 THEN TRUE else FALSE END) as predeterminado
                FROM mod_datosmaestros.dat_cuentabanccliente c
                LEFT JOIN mod_datosmaestros.nom_banco nb ON (c.idbanco = nb.idbanco)
                LEFT JOIN mod_datosmaestros.nom_sucursal ns ON (c.idsucursal = ns.idsucursal)
                LEFT JOIN mod_datosmaestros.nom_moneda nm ON (c.idmoneda = nm.idmoneda)
                WHERE c.idclienteproveedores=$idcliente AND c.fechafin IS NULL ORDER BY c.predeterminado DESC ;"
        );
        return $result;
    }

    static function getParametros($params){
        $query = Doctrine_Query::create();
        $query->from('DatCuentaBancoCliente');
//        print_r($params);die;
        if($params['idclienteproveedor']){
            $query->where('idclienteproveedores=?', $params['idclienteproveedor']);
        }
        $result=$query->execute()->toArray();
        $respuesta=count($result)>0?$result[0][$params['campo']]:'';
        return  $respuesta;
    }

} 