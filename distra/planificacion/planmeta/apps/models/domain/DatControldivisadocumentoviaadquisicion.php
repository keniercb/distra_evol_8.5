<?php

class DatControldivisadocumentoviaadquisicion extends BaseDatControldivisadocumentoviaadquisicion {

    public function setUp() {
        parent::setUp();
    }

    public function Guardardatosdelavia($doc, $via) {

        $dm = Doctrine_Manager::getInstance();
        $con = $dm->getCurrentConnection();
        $ed = "select last_value from mod_planificacion.sec_controldivisadocumentoviaadquisicion_seq";
        $sql = "INSERT INTO
  mod_planificacion.dat_controldivisadocumentoviaadquisicion
( idcontroldivisadocumentoaprobacion,  idviaadquisicion)
VALUES ( $doc,   $via)";
        $con->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $con->commit();
        $con->beginTransaction();
        $arrayResult = $con->execute($ed)->fetchAll(PDO::FETCH_ASSOC);
        $con->commit();
        return $arrayResult[0]['last_value'];
    }

}
