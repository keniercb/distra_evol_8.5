<?php
class ConfHorasextrasModel extends ZendExt_Model 
 {

    public function setUp()
    { 
        parent::ZendExt_Model();
    } 

    public function getLimites()
    {
      return ConfHorasextras::getLimites();
    }

    public function setLimites($id, $horas)
    {
        try {
            $obj = ConfHorasextras::getById($id);
            $obj->limite = $horas;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
       }
    }

    public function setLimiteshoras($idlimitediario,$limitediario,$idlimitemensual,$limitemensual)
    {
        try {
            $limitediarioobj = ConfHorasextras::getById($idlimitediario);
            $limitediarioobj->limite = $limitediario;
            $limitediarioobj->save();

            $limitemensualobj = ConfHorasextras::getById($idlimitemensual);
            $limitemensualobj->limite = $limitemensual;
            $limitemensualobj->save();

            return true;
        } catch (Exception $e) {
            return false;
        }
    }

 }
