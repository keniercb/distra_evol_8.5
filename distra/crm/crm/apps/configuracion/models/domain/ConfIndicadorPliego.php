<?php

class ConfIndicadorPliego extends BaseConfIndicadorPliego
{

    public function setUp()
    {
        parent::setUp();
    }

    public function getIndicadoresPliego($params){
        try{
            $result = Doctrine_Query::create()
                ->from('ConfIndicadorPliego')
                ->fetchArray();
            return $result;
        }catch(Exception $e){
            throw $e;
        }
    }

    public function guardarIndicadorPliego($values){
        try{
            $instance=new ConfIndicadorPliego();
            if($values['idindicadorpliego'] && $values['idindicadorpliego']!=''){
                $instance=Doctrine::getTable('ConfIndicadorPliego')->find($values['idindicadorpliego']);
            }
			//print_r($values);die;
            //$values=array_filter($values);
			
            $instance->synchronizeWithArray($values);
//            $instance->nombre=$values['nombre'];
//            $instance->descripcion=$values['descripcion']?:null;
//            $instance->calcularrelevancia=$values['calcularrelevancia'];
//            $instance->atributorelevancia=$values['atributorelevancia']?:null;
//            $instance->configgrafica=$values['configgrafica']?:null;
//            $instance->configgrid=$values['configgrid']?:null;
//            $instance->idusuario=$values['idusuario']?:null;
//            $instance->idestructuracomun=$values['idestructuracomun']?:null;
            $instance->save();
            return array('success'=>true);
        }catch(Exception $e){
            throw $e;
        }
    }

    static function eliminarIndicadorPliego($array)
    {
        try{
            $query = Doctrine_Query::create();
            $query->delete()->from('ConfIndicadorPliego')
                ->whereIn('idindicadorpliego', $array)
                ->execute();
        }catch(Exception $e){
            throw $e;
        }
    }

}
