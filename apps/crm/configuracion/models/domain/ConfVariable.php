<?php

class ConfVariable extends BaseConfVariable
{

    public function setUp()
    {
        parent::setUp();
    }

    public function getVariables($params){
        return Doctrine_Query::create()
            ->from('ConfVariable')
            ->fetchArray();
    }

    public function guardarVariable($params){
        try{
            $instance=new ConfVariable();
            if($params['idvariable']){
                $instance=Doctrine::getTable('ConfVariable')->find($params['idvariable']);
            }
            $instance->nombre=$params['nombre'];
            $instance->descripcion=$params['descripcion'];
            $instance->sql=$params['sql'];
            $instance->save();
            return array('success'=>true);
        }catch(Exception $e){
            throw $e;
        }
    }

    public function eliminarVariable($params){
        try {
            $ids = json_decode($params['ids']);
            return Doctrine_Query::create()
                ->delete('ConfVariable')
                ->whereIn('idvariable', is_array($ids) ? $ids : array($ids))
                ->execute();
        }catch(Exception $e){
            throw $e;
        }
    }

}
