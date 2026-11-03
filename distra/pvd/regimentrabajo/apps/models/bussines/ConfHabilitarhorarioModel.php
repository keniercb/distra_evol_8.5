<?php
class ConfHabilitarhorarioModel extends ZendExt_Model 
 {

    public function setUp()
    { 
        parent::ZendExt_Model();
    } 

    public function getHabilitarhorario()
    {
        $result = ConfHabilitarhorario::getHabilitarhorario();
        foreach ($result as $v){
            if($v['habilitado'] == 1){
                $result[$v]['habilitado'] = true;
            }
        }
      return $result;
    }

    public function setHabilitarhorario($habilitado,$idestructuras)
    {
        try {
            $ConfEstructurahorario = new ConfEstructurahorario();
            $ConfEstructurahorario->DelEstructurahorario();
            foreach ($idestructuras as $v) {
                $objtemp = new ConfEstructurahorario();
                $objtemp->idestructura = $v;
                $objtemp->save();
            }
            $obj = ConfHabilitarhorario::getById(1);
            if($habilitado == 'true'){
                $obj->habilitado = 1;
            }
            else{
                $obj->habilitado = 0;
            }
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
       }
    }
 }
