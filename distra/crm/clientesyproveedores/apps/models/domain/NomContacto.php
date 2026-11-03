<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 17/03/2015
 * Time: 3:39
 */

class NomContacto extends BaseNomContacto{
    public function setUp() {
        $this->hasOne('NomClienteproveedor', array('local' => 'idclienteproveedores', 'foreign' => 'idclienteproveedores'));
        parent::setUp();
    }

    static function deleteFromArray($array){
        $query = Doctrine_Query::create();
        $query->delete()->from('NomContacto')
            ->whereIn('idcontacto',$array)
            ->execute();
    }

    static function getContactoByIdCliente($idcliente){
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $result = $conexionActual->fetchAll(
            "SELECT c.*, encode(c.foto,'escape') as foto,
                dpt.denominacion as descripciondpa,su.nombreusuario
                FROM mod_datosmaestros.nom_contacto c 
                LEFT JOIN mod_datosmaestros.nom_dpt dpt ON (c.dpa = dpt.iddpt)
                LEFT JOIN mod_seguridad.seg_usuario su ON (c.idusuario = su.idusuario)
                WHERE c.idclientesproveedores=$idcliente ORDER BY c.idcontacto;"
        );

        foreach($result as $index=>$valor){
            $facultades=$conexionActual->fetchAll(
                "SELECT tf.denominacion, tf.idtipofacultad
                FROM mod_crmclienteproveedor.dat_facultad f
                INNER JOIN mod_crmclienteproveedor.nom_tipofacultad tf 
                ON f.idtipofacultad = tf.idtipofacultad
                WHERE idcontacto=".$valor['idcontacto']
            );
//            print_r($result[$index]);
            $result[$index]['totalfacultades']=count($facultades);
            $result[$index]['facultades']=$facultades;
        }

        return $result;
//        LEFT JOIN mod_crmclienteproveedor.dat_facultad f ON (f.idcontacto = c.idcontacto)
//        ,
//        json_agg(json_build_object('idfacultad',f.idtipofacultad)) as tiposfacultades
    }

    public function getByCondition($condition,$params){
        $query = Doctrine_Query::create();
        $result=$query->from('NomContacto')
            ->where($condition,$params)
            ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }
} 