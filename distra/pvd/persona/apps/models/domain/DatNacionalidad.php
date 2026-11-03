<?php

class DatNacionalidad extends BaseDatNacionalidad
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('NomNacionalidad', array('local' => 'idnacionalidad', 'foreign' => 'idnacionalidad'));
        $this->hasMany('DatDatosnacimiento', array('local' => 'idnacionalidadp', 'foreign' => 'idnacionalidadp'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idnacionalidadp
     *
     * @return Doctrine_Record
     */
    public function getById(array $idnacionalidadp)
    {
        try {
            if (count($idnacionalidadp) > 0) {
                $query = Doctrine_Query::create()->from('DatNacionalidad')->whereIn('idnacionalidadp', $idnacionalidadp);

                return $query->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtener todas la nacionalidades asociadas a la persona
     *
     * @param $idpersona
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getNationalityByIdperson($idpersona)
    {
        try {
            $query = Doctrine_Query::create()->select('dna.*, nna.denominacion as denomnacionalidad,nna.bandera as bandera')
                ->from('DatNacionalidad dna')->innerJoin('dna.NomNacionalidad nna')->where(
                    'dna.idpersona = ?', $idpersona
                );

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Eliminar la(s) nacionalidad(es) de la persona
     *
     * @param array $idNacionalidadp
     * @param null $idpersona
     *
     * @throws Exception
     */
    public function removeNationalitys(array $idNacionalidadp, $idpersona = null)
    {
        try {
            if (count($idNacionalidadp) > 0) {
                $query = Doctrine_Query::create()->delete('DatNacionalidad')->whereIn('idnacionalidadp', $idNacionalidadp);
                if ($idpersona) {
                    $query->andWhere('idpersona = ?', $idpersona);
                }
                $query->execute();
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtener la el idnacionaldiadp deado el idpersona
     *
     * @param $idpersona
     * @param $idnacionalidad
     *
     * @return array
     * @throws Exception
     */
    public function getIdNationalityPro($idpersona, $idnacionalidad)
    {
        try {
            $query = Doctrine_Query::create()->select()->from('DatNacionalidad')->where(
                'idpersona=? and idnacionalidad=?', array($idpersona, $idnacionalidad)
            );

            return $query->execute()->toArray();

        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para obenter la denominacion de la nacionalidad dado el idnacionalidadp
     *
     * @param $idnacionalidadp
     *
     * @return array
     */
    public function getDenomByIdNationalityP($idnacionalidadp)
    {
        try {
            $query = Doctrine_Query::create()->select('dna.idnacionalidadp,nna.denominacion as nacionalidad')->from(
                'DatNacionalidad dna'
            )->innerJoin('dna.NomNacionalidad nna')->where('dna.idnacionalidadp=?', $idnacionalidadp);

            return $query->execute()->toArray();
        } catch (Exception $e) {

        }
    }

}

