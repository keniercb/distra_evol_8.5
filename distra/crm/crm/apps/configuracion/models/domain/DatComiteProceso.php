<?php

/**
 * @package       ERP-PCRM
 * @category      Model
 * @author        Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @copyright (c) 2015, XETID
 */
class DatComiteProceso extends BaseDatComiteProceso
{

    public function setUp()
    {
        // Aqui se reflejan las relaciones con las demas tablas hasMany para (*-*) y hasOne(1-*)
        parent::setUp();
    }

    public function guardarComiteProceso($idproceso, $idcomite){
        try{
            $comiteproceso=new DatComiteProceso();
            $comiteproceso->idcomite=$idcomite;
            $comiteproceso->idproceso=$idproceso;
            $comiteproceso->save();
            return array('code' => 1, 'success' => true, 'idcomiteproceso'=>$comiteproceso->idcomiteproceso);
        } catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }


}
