<?php
class DatMedios extends BaseDatMedios
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomMedios',
            array('local' => 'idmedio', 'foreign' => 'idmedio')
        );

    }

    public function getById($iddmedio)
    {
        return Doctrine::getTable('DatMedios')->find($iddmedio);
    }

    public function getMedios($estructuras, $denom, $start, $limit)
    {
        try {
            $select
                = "dr.*,dr.cantidad as cantidad,nr.denominacion as denominacion";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatMedios dr')
                ->leftJoin('dr.NomMedios nr')
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

    public function cantMedios($estructuras, $denom)
    {
        try {
            $select
                = "dr.iddmedio";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatMedios dr')
                ->innerJoin('dr.NomMedios nr')
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
    public function existe($iddmedio, $idestructura)
    {
        try {
            $select
                = "dr.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatMedios dr')
                ->where("dr.iddmedio = '$iddmedio' AND dr.idestructura = '$idestructura'");
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }


}