<?php

class ConfExportacionBancoFicheroEntidad extends BaseConfExportacionBancoFicheroEntidad
{
    public function findIdConfByIdentidad($identidad)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT idconfexportaciondbfbancoficheroentidad
                FROM mod_nomina.conf_exportacionbancoficheroentidad WHERE identidad = ?";
        $result = $conn->fetchOne($sql, array($identidad));
        return $result;
    }
}
