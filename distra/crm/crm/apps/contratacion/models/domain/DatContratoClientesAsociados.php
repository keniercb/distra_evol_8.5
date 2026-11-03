<?php

class DatContratoClientesAsociados extends BaseDatContratoClientesAsociados
{
    public function setUp()
    {
        parent::setUp();
    }

    static function listarPorCondicion($conditions){
        $where='';
        if($conditions)$where=' WHERE '.$conditions;
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
        $resultado=$conexionActual->fetchAll(
            "SELECT dcca.*,
            COALESCE (clpr.nombre,per.nombre||' '||per.papel||' '||per.sapel,estru.denominacion,estruop.denominacion) as nombre
            FROM mod_crmcontratacion.dat_contratoclienteasociado dcca
            LEFT JOIN mod_datosmaestros.nom_clientesproveedor clpr ON clpr.idclientesproveedores=dcca.idclienteproveedor
            LEFT JOIN mod_persona.dat_persona per ON (clpr.idpersona = per.idpersona)
            LEFT JOIN mod_estructuracomp.dat_estructura estru ON (clpr.idestructura = estru.idestructura and estru.idproyecto=0)
              LEFT JOIN mod_estructuracomp.dat_estructuraop estruop ON (clpr.idestructura = estruop.idestructuraop and estruop.idproyecto=0)
            $where"
        );
        return $resultado;
    }

    static function guardar($datos)
    {
        $instance=new DatContratoClientesAsociados();
        if($datos['idcontratoclienteasociado'] && $datos['idcontratoclienteasociado']!=''){
            $instance=Doctrine::getTable('DatContratoClientesAsociados')
                ->find($datos['idcontratoclienteasociado']);
        }
//        print_r($datos);die;
        $instance->idcontrato=$datos['idcontrato'];
        $instance->idclienteproveedor=$datos['idclienteproveedor'];
        $instance->save();
        return $instance->idcontratoclienteasociado;
    }

    static function eliminarLista($array)
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatContratoClientesAsociados')
            ->whereIn('idcontratoclienteasociado', $array)
            ->execute();
    }

    static function eliminarPorCondicion($conditions, $params)
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatContratoClientesAsociados')
            ->where($conditions)
            ->execute();
    }


}