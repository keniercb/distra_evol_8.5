<?php

class DatNiveleducacional extends BaseDatNiveleducacional
{
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomNiveleducacional', array('local' => 'idniveleducacional', 'foreign' => 'idniveleducacional'));
        //$this->hasOne('NomTitulo', array('local' => 'idtitulo', 'foreign' => 'idtitulo'));
    }

    /**
     * Devuelve un objeto de la clase
     *
     * @param      $idobservaciongeneral
     * @param bool $inArray
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getById($idniveleducacionalp, $inArray = true)
    {
        try {
            $query = Doctrine_Query::create()->from('DatNiveleducacional')->whereIn(
                'idniveleducacionalp', Utiles::reflectArray($idniveleducacionalp)
            )->execute();

            return ($inArray) ? $query->toArray() : $query;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }


    public function getNiveleducacional($idpersona)
    {
        try {
            $query = Doctrine_Query::create()->from('DatNiveleducacional')->whereIn(
                'idpersona', Utiles::reflectArray($idpersona)
            );

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
    public function delNiveleducacional(array $idRow, $idPersona)
    {
        try {
            if (count($idRow) > 0) {

                $query = Doctrine_Query::create()->delete('DatNiveleducacional')->whereIn('idniveleducacionalp', $idRow);
                if ($idPersona) {
                    $query->andWhere('idpersona = ?', $idPersona);
                }
                $query->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getNivelEduByPersona($idpersona)
    {
        $sql = "SELECT
                  nne.denominacion as niveleducacional, nne.abreviatura as neabr, 
                  nt.denominacion as titulo, nt.abreviatura as tituloabr, ne.*
				FROM mod_personaext.dat_niveleducacional AS ne
				INNER JOIN mod_personaext.nom_niveleducacional AS nne ON (ne.idniveleducacional = nne.idniveleducacional)
				LEFT JOIN mod_personaext.nom_titulo AS nt ON (ne.idtitulo = nt.idtitulo)
				WHERE ne.idpersona = '$idpersona'
				ORDER BY ne.fdesde DESC";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
}