<?php

/**
 * @autor Adrian Fernández Martínez
 */
class ViewConfigModel extends BaseModel
{
    /**
     *
     */
    public function __construct()
    {
        parent::__construct();        
    }

    public function cargarConfiguracionByUsuario($idusuario){
        $sql = "
            select vc.data as data
            from mod_logactivofijotangible.conf_viewconfig vc
            where vc.idusuario = $idusuario
        ";
        $conn = Zend_Registry::get('conexion');
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        if($datos && $datos[0]){
            return $datos[0];
        }else {
            return [];
        }
    }

    public function salvarConfiguracionVistaByUsuario($idusuario, $datos){
        //$jsonData = json_encode($datos);
       // print_r($datos);die;
        $sql = "
            INSERT INTO mod_logactivofijotangible.conf_viewconfig
            ( idusuario, data ) VALUES ( $idusuario, '$datos' )
            ON CONFLICT ON CONSTRAINT conf_viewconfig_pkey
            DO 
                UPDATE SET data = '$datos'
        ";

        $conn = Zend_Registry::get('conexion');
        $query = $conn->prepare($sql);
        $query->execute();
        return true;
    }
}
