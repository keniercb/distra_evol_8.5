<?php

class DatHuella extends BaseDatHuella
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('NomDedo', array('local' => 'iddedo', 'foreign' => 'iddedo'));
    }

    /**
     * Devuelve un objeto de la clase
     *
     * @param $idhuella
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getById(array $idhuella)
    {
        try {
            if (count($idhuella) > 0) {
                $query = Doctrine_Query::create()->from('DatHuella')->whereIn('idhuella', $idhuella);

                return $query->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idpersona
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getFingersByIdperson($idpersona)
    {
        try {
            $query = Doctrine_Query::create()->select(
                "dido.*,encode(dido.imagen,'escape') as imagen,encode(dido.minutia,'escape') as minutia,nidio.denominacion as denomdedo, nidio.numdedo as numdedo"
            )->from('DatHuella dido')->innerJoin('dido.NomDedo nidio')->where('dido.idpersona = ?', $idpersona);

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function deleteFingers($iddedo, $idpersona)
    {
        try {
            Doctrine_Query::create()->delete('DatHuella')->where('iddedo = ? AND idpersona = ?', array($iddedo, $idpersona))
                ->execute();

            return true;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }

    }

    public function getDataHuella($idpersona, $iddedo)
    {
        try {
            $query = Doctrine_Query::create()->select(
                "dido.*,encode(dido.imagen,'escape') as imagen,encode(dido.minutia,'escape') as minutia,nidio.denominacion as denomdedo, nidio.numdedo as numdedo"
            )->from('DatHuella dido')->innerJoin('dido.NomDedo nidio')->where(
                'dido.idpersona = ? AND dido.iddedo = ?', array($idpersona, $iddedo)
            );

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}

