<?php

class NomViaadquisicionModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function listarViaAdq()
    {
        return NomViaadquisicion::Obtener_via_adquisicion();
    }

    public function insertarnom_viaadquisicion(NomViaadquisicion $nomViaadquisicion
    )
    {
        $nomViaadquisicion->save();
        return $nomViaadquisicion->idviaadquisicion;
    }

    public function modificarnom_viaadquisicion($nomViaadquisicion)
    {
        $nomViaadquisicion->save();
    }

    public function eliminarnom_viaadquisicion($nomViaadquisicion)
    {
        $nomViaadquisicion->delete();
    }
    public function guardarviayplanparacontingencia($data,$idejercio)
    {
      foreach($data as $value) {
if($value->idmodelo!=null||$value->idmodelo!=''){

   $idcont= NomViaadquisicion::verificarplanyviaparacontingencia(true,$value->idmodelo,$idejercio);
   if($idcont!=null||$idcont!=''){
       NomViaadquisicion::actualizate($idcont,$value->porciento);
   }else{
       NomViaadquisicion::guardarplanparacontingencia($idejercio,$value->idmodelo,$value->porciento);
   }

}else{

    $idcont= NomViaadquisicion::verificarplanyviaparacontingencia(false,$value->idviaadquisicion,$idejercio);
    if($idcont!=null||$idcont!=''){

        NomViaadquisicion::actualizate($idcont,$value->porciento);
    }else{

        NomViaadquisicion::guardarviaparacontingencia($idejercio,$value->idviaadquisicion,$value->porciento);
    }


}
    } return 1;
    }
    public function eliminarViaadquisicion($id, $rolledback)
    {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $query = Doctrine_Query::create();
        try {
            $query->delete()->from('NomViaadquisicion')->where(
                'idviaadquisicion = ?', array($id)
            )
                ->execute();
            if (!$rolledback) {
                $conn->commit();
            }
            $conn->beginTransaction();
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == '23503') {
                $conn->rollback();
                return false;
            }
        }
        return true;
    }

    public function eliminarViaadquisicions($arrayToDelete)
    {
        $arrayInUse = array();
        //$conn = null;
        $rolledback = false;
        for ($i = 0; $i < count($arrayToDelete); $i++) {
            if (!self::eliminarViaadquisicion(
                $arrayToDelete[$i], $rolledback
            )
            ) {
                array_push($arrayInUse, $arrayToDelete[$i]);
                $rolledback = true;
            } else {
                $rolledback = false;
            }
        }
        return $arrayInUse;
    }

}

