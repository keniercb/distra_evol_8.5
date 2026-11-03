<?php
class ConfHabilitarsesionesModel extends ZendExt_Model 
 {
    protected $Confhabilitarsesiones;

    function __construct()
    {
        $this->Confhabilitarsesiones = new ConfHabilitarsesiones();
    }

    public function setUp()
    {
        parent::ZendExt_Model();

    } 

    public function gethabilitarsesiones()
    {
        $result =  $this->Confhabilitarsesiones->gethabilitarsesiones();
        foreach ($result as $v){
            if($v['habsesion'] == 1){
                $result[$v]['habsesion'] = true;
            }
        }
      return $result;
    }

    public function sethabilitarsesiones($habsesion)
    {
        try {

            $obj = $this->Confhabilitarsesiones->getById(1);

            if($habsesion == 'true')
                $obj->habsesion = 1;
            else
                $obj->habsesion = 0;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
       }
    }
 }
