<?php

class DatAccidente extends BaseDatAccidente
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomAgente', array('local' => 'idagente', 'foreign' => 'idagente'));
        $this->hasOne('NomTipoaccidente', array('local' => 'idtipoaccidente', 'foreign' => 'idtipoaccidente'));
        $this->hasOne('NomFormaaccidente', array('local' => 'idformaaccidente', 'foreign' => 'idformaaccidente'));
    }

    public function getById($idagente)
    {
        return Doctrine::getTable('DatAccidente')->find($idagente);
    }

    public function getAccidentes($estructuras, $filtro, $finicio, $ffin, $inicio, $limite)
    {
        $queryObj = Doctrine_Query::create()
            ->select(
                'm.*, a.denominacion as agente, a.idtipoagente as idtipoagente, tacc.denominacion as tipoaccidente,
                    fa.denominacion as formaaccidente, ta.denominacion as tipoagente'
            )
            ->from('DatAccidente m')
            ->innerJoin('m.NomAgente a')
            ->innerJoin('a.NomTipoagente ta')
            ->innerJoin('m.NomTipoaccidente tacc')
            ->innerJoin('m.NomFormaaccidente fa')
            ->orderBy('m.fecha DESC');
        if (count($estructuras) > 0) {
            $queryObj->whereIn("m.identidad", $estructuras);
        }
        if (!empty($filtro)) {
            $queryObj->addWhere(
                "a.denominacion ilike '%$filtro%' OR tacc.denominacion ilike '%$filtro%' 
                OR fa.denominacion ilike '%$filtro%'"
            );
        }
        if (!empty($finicio)) {
            $queryObj->addWhere("m.fecha >= '$finicio'");
        }
        if (!empty($ffin)) {
            $queryObj->addWhere("m.fecha <= '$ffin'");
        }
        if (!empty($inicio) && !empty($limite)) {
            $queryObj->start($inicio)->limit($limite);
        }
        return $queryObj->fetchArray();
    }

    public function cantAccidentes($estructuras, $filtro, $finicio, $ffin)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.idaccidente')
            ->from('DatAccidente m')
            ->innerJoin('m.NomAgente a')
            ->innerJoin('m.NomTipoaccidente tacc')
            ->innerJoin('m.NomFormaaccidente fa');
        if (count($estructuras) > 0) {
            $queryObj->whereIn("m.identidad", $estructuras);
        }
        if (!empty($filtro)) {
            $queryObj->addWhere(
                "a.denominacion ilike '%$filtro%' OR tacc.denominacion ilike '%$filtro%' 
                OR fa.denominacion ilike '%$filtro%'"
            );
        }
        if (!empty($finicio)) {
            $queryObj->addWhere("m.fecha >= '$finicio'");
        }
        if (!empty($ffin)) {
            $queryObj->addWhere("m.fecha <= '$ffin'");
        }
        return count($queryObj->fetchArray());
    }

    public function getAccidentesAnno($anno, $equip, $identidad)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.idaccidente')
            ->from('DatAccidente m')
            ->where("m.equiparado = '$equip' AND  date_part('year', m.fecha) = $anno AND m.identidad = '$identidad'")
            ->orderBy('m.fecha DESC');
        return $queryObj->fetchArray();
    }

    public function getAccidenteById($idaccidente)
    {
        $queryObj = Doctrine_Query::create()
            ->select(
                'm.*, a.denominacion as agente, a.idtipoagente as idtipoagente, tacc.denominacion as tipoaccidente,
                    fa.denominacion as formaaccidente, ta.denominacion as tipoagente'
            )
            ->from('DatAccidente m')
            ->innerJoin('m.NomAgente a')
            ->innerJoin('a.NomTipoagente ta')
            ->innerJoin('m.NomTipoaccidente tacc')
            ->innerJoin('m.NomFormaaccidente fa')
            ->where("m.idaccidente = '$idaccidente'");
        return $queryObj->fetchArray()[0];
    }

    public function getdatosAcidente($idestructura, $trimestre,$tipoacc,$categoria)
    {
        $idestructura = -1;
        if ($idestructura == '') {
            $idestructura = $idestructura;
        } else {
            $idestructura = $_SESSION['Zeolides']['entidad']->idestructura;
        }
        $fecha = date('d/m/Y');
        $anno = explode('/', $fecha)[2];
        $fechaini = '';
        $fechafin = '';
        switch ($trimestre) {
            case 1:
                {
                    $fechaini = '1/1/' . $anno;
                    $fechafin = '31/3/' . $anno;
                    break;
                }
            case 2:
                {
                    $fechaini = '1/4/' . $anno;
                    $fechafin = '30/6/' . $anno;
                    break;
                }
            case 3:
                {
                    $fechaini = '1/7/' . $anno;
                    $fechafin = '30/9/' . $anno;
                    break;
                }
            case 4:
                {
                    $fechaini = '1/10/' . $anno;
                    $fechafin = '31/12/' . $anno;
                    break;
                }

        }


        $sql = "Select * from mod_sstaccidente.f_indicadores_anexo2($tipoacc, $categoria, '".$fechaini."', '".$fechafin."',$idestructura)"; //(tioacci, categoriapersona,fechaini,fechafin,entidad)

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);


        return $r;
    }


    public function obtenerTotalTipoAccidente($idestructura)
    {
        $sql = "SELECT
	              CASE WHEN nta.denominacion IS NULL THEN 'No conocido' ELSE nta.denominacion END AS denominacion,
	              count(idaccidente) AS cantidad
                FROM mod_sstaccidente.dat_accidente AS da
                INNER JOIN mod_sstaccidente.nom_tipoaccidente AS nta ON (da.idtipoaccidente = nta.idtipoaccidente)";
        $sql = $sql." GROUP BY  nta.denominacion";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function obtenerTotalFormaAccidente($idestructura)
    {
        $sql = "SELECT
	              CASE WHEN nfa.denominacion IS NULL THEN 'No conocido' ELSE nfa.denominacion END AS denominacion,
	              count(idaccidente) AS cantidad
                FROM mod_sstaccidente.dat_accidente AS da
                INNER JOIN mod_sstaccidente.nom_formaaccidente AS nfa ON (da.idformaaccidente = nfa.idformaaccidente)";
        $sql = $sql." GROUP BY  nfa.denominacion";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function obtenerCantAccidentePorYear($arrEstructura)
    {
        $sql = "SELECT
                    substring(da.fecha::VARCHAR, 7, 4) AS denominacion,
                    count(da.idaccidente) AS cantidad
                FROM mod_sstaccidente.dat_accidente AS da";
        $sql = $sql." GROUP BY denominacion";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }


    public function getCantTipoAccidente($idestructura)
    {
        $idestructura = -1;
        if ($idestructura == '') {
            $idestructura = $idestructura;
        } else {
            $idestructura = $_SESSION['Zeolides']['entidad']->idestructura;
        }
        $sql = "  SELECT count(acci.idformaaccidente) as cantidad,fa.denominacion 
              FROM mod_sstaccidente.dat_accidente acci
               LEFT JOIN mod_sstaccidente.nom_formaaccidente fa on(acci.idformaaccidente=fa.idformaaccidente)
                WHERE acci.identidad=$idestructura
                GROUP BY fa.denominacion ";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

}