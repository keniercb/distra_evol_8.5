<?php

class DatIdioma extends BaseDatIdioma
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne(
            'NomFormaadquiriridioma', array('local' => 'idformaadquiriridioma', 'foreign' => 'idformaadquiriridioma')
        );
        $this->hasOne('NomIdioma', array('local' => 'ididioma', 'foreign' => 'ididioma'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idpersona
     *
     * @return Doctrine_Record
     */
    public function getById($ididiomap)
    {
        // return Doctrine::getTable('DatIdioma')->find($idpersona);
        try {
            if (count($ididiomap) > 0) {
                $query = Doctrine_Query::create()->from('DatIdioma')->whereIn('ididiomap', $ididiomap);

                return $query->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getLanguageByIdperson($idpersona)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'dido.*, nidio.denominacion as denomidioma, nomfor.denominacion as denomformaadquirir,
                nidio.bandera as bandera'
            )->from('DatIdioma dido')->innerJoin('dido.NomIdioma nidio')
                ->innerJoin('dido.NomFormaadquiriridioma nomfor')
                ->where('dido.idpersona = ?', $idpersona);

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function removeLanguages(array $ididiomap, $idpersona = null)
    {
        try {
            if (count($ididiomap) > 0) {
                $query = Doctrine_Query::create()->delete('DatIdioma')->whereIn('ididiomap', $ididiomap);
                if ($idpersona) {
                    $query->andWhere('idpersona = ?', $idpersona);
                }
                $query->execute();
            }
        } catch (Exception $e) {
            throw $e;
        }
    }
    public function getIdiomasByIdperson($idpersona)
    {
        try {
            $sql
                = "SELECT ni.denominacion, di.observacion, fa.denominacion as denomformaadquirir
				 FROM mod_personaext.dat_idioma AS di 
				 INNER JOIN mod_personaext.nom_idioma AS ni ON (ni.ididioma = di.ididioma)
				 INNER JOIN mod_personaext.nom_formaadquiriridioma AS fa ON (fa.idformaadquiriridioma = di.idformaadquiriridioma)
				 WHERE di.idpersona = $idpersona";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $result = $conn->fetchAll($sql);

            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}

