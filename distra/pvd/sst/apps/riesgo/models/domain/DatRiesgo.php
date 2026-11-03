<?php
class DatRiesgo extends BaseDatRiesgo
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomRiesgo',
            array('local' => 'idnriesgo', 'foreign' => 'idnriesgo')
        );
        $this->hasOne(
            'NomFrecuencia',
            array('local' => 'idfrecuencia', 'foreign' => 'idfrecuencia')
        );
        $this->hasOne(
            'NomProbabilidad',
            array('local' => 'idprobabilidad', 'foreign' => 'idprobabilidad')
        );
        $this->hasOne(
            'NomNivelriesgo',
            array('local' => 'idnivelriesgo', 'foreign' => 'idnivelriesgo')
        );
        $this->hasOne(
            'NomSistema', array('local' => 'idsistema', 'foreign' => 'idsistema')
        );
        $this->hasOne(
            'NomPartesistema', array('local' => 'idpartesistema', 'foreign' => 'idpartesistema')
        );
    }

    public function getById($idriesgo)
    {
        return Doctrine::getTable('DatRiesgo')->find($idriesgo);
    }
    
    public function getRiesgos($estructuras, $denom, $start, $limit)
    {
        try {
            $select
                = "dr.*, nr.denominacion as denomriesgo, er.denominacion as frecuencia, er.valor as vfrecuencia,
                    np.denominacion as probabilidad, np.valor as vprobabilidad, nir.denominacion as nivelriesgo,
                    s.denominacion as sistema, ps.denominacion as partesistema";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatRiesgo dr')
                ->innerJoin('dr.NomRiesgo nr')
                ->innerJoin('dr.NomFrecuencia er')
                ->innerJoin('dr.NomProbabilidad np')
                ->innerJoin('dr.NomNivelriesgo nir')
                ->leftJoin('dr.NomSistema s')
                ->leftJoin('dr.NomPartesistema ps')
                ->whereIn("dr.idestructura", $estructuras);
            if (!empty($denom)) {
                $query->addWhere("nr.denominacion ILIKE '%$denom%'");
            }
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function cantRiesgos($estructuras, $denom)
    {
        try {
            $select
                = "dr.idriesgo";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatRiesgo dr')
                ->innerJoin('dr.NomRiesgo nr')
                ->innerJoin('dr.NomFrecuencia er')
                ->innerJoin('dr.NomProbabilidad np')
                ->innerJoin('dr.NomNivelriesgo nir')
                ->whereIn("dr.idestructura", $estructuras);
            if (!empty($denom)) {
                $query->addWhere("nr.denominacion ILIKE '%$denom%'");
            }
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
    
    /**
     * @param int $idnriesgo
     * @param int $idestructura
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function existe($idnriesgo, $idestructura)
    {
        try {
            $select
                = "dr.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatRiesgo dr')
                ->where("dr.idnriesgo = '$idnriesgo' AND dr.idestructura = '$idestructura'");
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }


}