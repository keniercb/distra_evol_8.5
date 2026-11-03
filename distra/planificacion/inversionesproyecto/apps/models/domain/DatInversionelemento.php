<?php

class DatInversionelemento extends BaseDatInversionelemento {

    public function setUp() {
        parent :: setUp();
    }
	
	public function insertar($parametros){
		$cadenaInsert
            = "INSERT INTO mod_planifintegracion.dat_inversionelemento(
		    idinversion,idelemento";
        $cadenaValues
            = ") VALUES ( $parametros->idinversion, '$parametros->idelemento')";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenaInsert . $cadenaValues);
        $result = $res->fetchAll();
        return $result;
	}

    public function findByIds($parametros){
        $cadenaSelect = "";
        $cadenaJoin = "";
        $cadenaWhere = "";
        $cadenaQuery = "";

        $cadenaSelect = " SELECT COUNT(die.idinversionelemento) ";
        $cadenaJoin = " FROM  mod_planifintegracion.dat_inversionelemento die ";
        $cadenaWhere = " WHERE die.idinversion =  {$parametros->idinversion}";
        $cadenaQuery = $cadenaSelect.$cadenaJoin.$cadenaWhere;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenaQuery);
        $result = $res->fetchAll();
        return $result[0]['count'];

    }

    public function deleteByIds($parametros){
        $cadenaSelect = "";
        $cadenaJoin = "";
        $cadenaWhere = "";
        $cadenaQuery = "";

        $cadenaSelect = " DELETE ";
        $cadenaJoin = " FROM  mod_planifintegracion.dat_inversionelemento die ";
        $cadenaWhere = " WHERE die.idinversion =  {$parametros->idinversion}";
        $cadenaQuery = $cadenaSelect.$cadenaJoin.$cadenaWhere;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenaQuery);
        $result = $res->fetchAll();
        return $result;

    }

    public function findByIdsElemento($parametros){
        $cadenaSelect = "";
        $cadenaJoin = "";
        $cadenaWhere = "";
        $cadenaQuery = "";

        $cadenaSelect = " SELECT die.idelemento ";
        $cadenaJoin = " FROM  mod_planifintegracion.dat_inversionelemento die ";
        $cadenaWhere = " WHERE die.idinversion =  {$parametros->idinversion}";
        $cadenaQuery = $cadenaSelect.$cadenaJoin.$cadenaWhere;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenaQuery);
        $result = $res->fetchAll();
        return $result[0];

    }

}

