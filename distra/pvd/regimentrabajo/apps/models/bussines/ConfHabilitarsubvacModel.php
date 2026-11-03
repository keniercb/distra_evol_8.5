<?php
class ConfHabilitarsubvacModel extends ZendExt_Model 
 {

    public function setUp()
    { 
        parent::ZendExt_Model();
    } 

    public function getHabilitarSubVac()
    {
        $result = ConfHabilitarsubvac::getHabilitarSubVac();
        foreach ($result as $v){
            if($v['habilitado'] == 1){
                $result[$v]['habilitado'] = true;
            }
        }
      return $result;
    }

    public function setHabilitarsubvac($habilitado)
    {
        try {

            $obj = ConfHabilitarsubvac::getById(1);

            if($habilitado == 'true')
                $obj->habilitado = 1;
            else
                $obj->habilitado = 0;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
       }
    }

 }
