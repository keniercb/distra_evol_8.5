<?php
class DatMedida extends BaseDatMedida
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatRiesgo',
            array('local' => 'idriesgo', 'foreign' => 'idriesgo')
        );
    }

    public function getById($idmedida)
    {
        return Doctrine::getTable('DatMedida')->find($idmedida);
    }
    
    /**
     * @param int $idriesgo
     * @param null $limit
     * @param int $start
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getMedidasByRiesgo($idriesgo, $limit = null, $start = 0)
    {
        try {
            $select = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatMedida dd')
                ->where("dd.idriesgo = '$idriesgo'");
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param int $idriesgo
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantMedidasByRiesgo($idriesgo)
    {
        try {
            $query = Doctrine_Query::create()
                ->from('DatMedida dd')
                ->where("dd.idriesgo = '$idriesgo'");
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param int $idriesgo
     * @param string $medida
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function existeMed($idriesgo, $medida)
    {
        try {
            $select
                = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatMedida dd')
                ->where("dd.idriesgo = '$idriesgo' and dd.medida = '$medida'");
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}