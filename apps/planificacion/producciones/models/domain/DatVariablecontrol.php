<?php

class DatVariablecontrol extends BaseDatVariablecontrol {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'NomTipomodelo', array('local' => 'idtipomodelo', 'foreign' => 'idtipomodelo')
        );
    }

    public function getVariables($node, $identidad) {
        $addWhere = "";
        if ($node != 0)
            $addWhere = " AND vc.idpadre=$node AND vc.idvariablecontrol!=$node";
        else
            $addWhere = " AND vc.idvariablecontrol=vc.idpadre";

        $identidad = implode(',', $identidad);
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT 
                        DISTINCT (vc.idvariablecontrol) as id,
                        vc.denominacion as text,
                        vc.descripcion,
                        vc.identidadcrea,
                        vc.enuso,
                        vc.idtipomodelo,
                        vc.idpadre as _parent,
                        vc.idarbol,
                        vc.ordender as _rgt,
                        vc.ordenizq as _lft,
                        vc.variable,
                        case when (vc.ordender - vc.ordenizq) = 1 then true else FALSE end as leaf,
                        vc.idunidadmedida
                      FROM 
                        mod_spouam.dat_variablecontrol vc
                        INNER JOIN  mod_spouam.dat_variablecontrolentidad vce ON(vc.idvariablecontrol=vce.idvariablecontrol)
                        WHERE vce.identidad in($identidad)
                        $addWhere
                            ORDER BY vc.variable, vc.denominacion";
        return $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getVariablesHijos($idvariablecontrol, $idarbol, $denom = false) {
        $conn = Doctrine_Manager::connection();
        $variable = "";
        if ($denom) {
            $variable = ", variable, idtipomodelo";
        }
        $sqlQuery = "SELECT idvariablecontrol $variable
                    FROM mod_spouam.dat_variablecontrol
                    WHERE ordenizq >=
                          (
                            SELECT v1.ordenizq
                            FROM mod_spouam.dat_variablecontrol v1
                            WHERE idvariablecontrol = $idvariablecontrol
                          ) AND
                          ordender <=
                          (
                            SELECT v1.ordender
                            FROM mod_spouam.dat_variablecontrol v1
                            WHERE idvariablecontrol = $idvariablecontrol
                          ) and idarbol = $idarbol";
        if ($denom) {
            $resp = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $resp = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_COLUMN);
        }
        return $resp;
    }

    public function getVariablesPadres($idvariablecontrol, $idarbol) {
        $conn = Doctrine_Manager::connection();

        $sqlQuery = "SELECT idvariablecontrol 
                    FROM mod_spouam.dat_variablecontrol
                    WHERE ordenizq <
                          (
                            SELECT v1.ordenizq
                            FROM mod_spouam.dat_variablecontrol v1
                            WHERE idvariablecontrol = $idvariablecontrol
                          ) AND
                          ordender >
                          (
                            SELECT v1.ordender
                            FROM mod_spouam.dat_variablecontrol v1
                            WHERE idvariablecontrol = $idvariablecontrol
                          ) and idarbol = $idarbol
                ORDER BY idvariablecontrol DESC";
        $resp = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_COLUMN);
        return $resp;
    }

    public function contRelaciones($entidades, $idelemento, $idelementohijo, $idarbol) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT count(v.idvariablecontrol) 
                  FROM mod_spouam.dat_variablecontrol v
                  INNER JOIN mod_spouam.dat_variablecontrolentidad vce ON 
                     (v.idvariablecontrol = vce.idvariablecontrol 
                     AND vce.identidad IN ($entidades))
                  WHERE ordenizq >
                      (
                        SELECT v1.ordenizq
                        FROM mod_spouam.dat_variablecontrol v1
                        WHERE idvariablecontrol = $idelemento
                      ) AND
                      ordender <
                      (
                        SELECT v1.ordender
                        FROM mod_spouam.dat_variablecontrol v1
                        WHERE idvariablecontrol = $idelemento
                      ) AND
                      v.idvariablecontrol <> $idelementohijo  
                      and idarbol = $idarbol";

        $data = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        return $data[0];
    }

    public function eliminarVariables($idelemento) {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "DELETE FROM 
                            mod_spouam.dat_variablecontrol 
                          WHERE 
                            idvariablecontrol = $idelemento";
        $conn->execute($sqlQuery);
    }

    public function cargarVariables($params) {
        if (isset($params->identidad)) {
            if ($params->analisis == 1)
                $SELECT = "vc.denominacion  as denominacion";
            else
                $SELECT = "(um.denominacionunidadmedida || ' - ' || vc.denominacion)  as denominacionvariable";

            $INNER = "INNER JOIN mod_spouam.dat_variablecontrolentidad vcent ON(vc.idvariablecontrol = vcent.idvariablecontrol)
                      INNER JOIN mod_datosmaestros.nom_unidadmedida um ON ( vc.idunidadmedida = um.idunidadmedida)";
            $WHERE = "AND vcent.identidad IN({$params->identidad})";
        } else {
            $SELECT = " vc.denominacion as denominacionvariable";
            $INNER = "";
            $WHERE = "";
        }
        if ($params->analisis == 1)
            $aliasid = "id";
        else
            $aliasid = "idvariable";
        $sql = "SELECT vc.idvariablecontrol as $aliasid, $SELECT
FROM mod_spouam.dat_variablecontrol vc $INNER
WHERE vc.variable = 1 $WHERE";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function cargarAgrupaciones() {
        $sql = " SELECT vc.idvariablecontrol as idvariablecontrolraiz,
                        vc.denominacion as denominacionraiz
                 FROM mod_spouam.dat_variablecontrol vc
                 where vc.idpadre = vc.idvariablecontrol";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function variableEnUso($idvariable) {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT idcartatecnologica
        FROM mod_spouam.dat_cartatecnologica ct
        WHERE ct.idvariablecontrol = $idvariable LIMIT 1;";
        $resp = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        return $resp;
    }

    public function actualizarVariableEnUso($idvariable, $uso) {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "UPDATE mod_spouam.dat_variablecontrol var
        SET enuso = {$uso} WHERE var.idvariablecontrol = {$idvariable};";
        $resp = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        return $resp;
    }

}
