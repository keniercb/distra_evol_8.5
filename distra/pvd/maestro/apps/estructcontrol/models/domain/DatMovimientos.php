<?php
class DatMovimientos extends BaseDatMovimientos
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatControlador', array('local'=>'idcontrolador','foreign'=>'idcontrolador'));
    }

    public function getById($idmovimiento)
    {
        return Doctrine::getTable('DatMovimientos')->find($idmovimiento);
    }

    public function getMovimientosByIdcontrolador($idcontrolador, $accion)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('DatMovimientos m')
            ->where("m.idcontrolador = '$idcontrolador' and m.accion = '$accion'");
        return $queryObj->fetchArray();
    }

    public function getMovByIdcontroladorpersonaaccion($idcontrolador, $idpersona, $accion, $idcargo)
    {
        if(!empty($idcargo))
            $ifCargo = " and c.idcargo = ".$idcargo."";
        else
            $ifCargo = "";
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('DatMovimientos c')
            ->where("c.idcontrolador = '$idcontrolador' and c.idpersona = '$idpersona' ".$ifCargo);
        if (!empty($accion)) {
            $queryObj->addWhere("c.accion = '$accion'");
        }
        return $queryObj->fetchArray();
    }

    public function deleteByEstControlypersona($idcontrolador, $idpersona,$idcargo)
    {
       try{
           $queryObj = Doctrine_Query::create()
               ->delete()
               ->from('DatMovimientos c')
               ->where("c.idcontrolador = ".$idcontrolador." and c.idpersona = ".$idpersona."")
               ->execute();
           $sql = "DELETE FROM mod_rrhhmaestro.dat_movimientos WHERE idmovimiento = (SELECT idmovimiento 
                                      FROM mod_rrhhmaestro.dat_movimientos 
                                      WHERE (idpersona = ".$idpersona."
                                      AND accion = 0) 
                                      limit 1)";
           $mg = Doctrine_Manager::getInstance();
           $conn = $mg->getCurrentConnection();
           $result = $conn->fetchAll($sql);
       }
       catch(Exception $e){
           print_r($e->getMessage());die;
       }

    }
}