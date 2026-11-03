<?php

class DatRegistro extends BaseDatRegistro
{
    public function setUp()
    {
        parent::setUp();
    }

    public function UpdateRegistro($horainicio, $horafin, $idpersona, $idcargo, $fecha)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "UPDATE mod_regimentrabajo.dat_registro
                      SET fechahoraentrada = CASE idpersona " . $horainicio . " END,
                          fechahorasalida = CASE idpersona " . $horafin . " END
                  WHERE idpersona = " . $idpersona . " AND idcargo = " . $idcargo . " AND fecharegistro = CAST('" . $fecha . "' AS date);";
        $resultado = $conn->prepare($sql);
        $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'], $resultado->getConnection()->getOptions()['username'], $resultado->getConnection()->getOptions()['password']);
        $res = $DBC->prepare($sql);
        return $res->execute();
    }

    public function InsertRegistro($arrDatos)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "INSERT INTO mod_regimentrabajo.dat_registro
                      (idpersona,
                      idcargo,
                      fechahoraentrada,
                      fechahorasalida,
                      fecharegistro)
                  VALUES " . implode(',', $arrDatos) . ";";
        $resultado = $conn->prepare($sql);
        $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'], $resultado->getConnection()->getOptions()['username'], $resultado->getConnection()->getOptions()['password']);
        $res = $DBC->prepare($sql);
        return $res->execute();
    }

}//fin clase 
?>


