<?php

class DatCantera extends BaseDatCantera
{
    public function setUp()
    {
        parent:: setUp();
      //  $this->hasOne('DatPersonasiac', array('local' => 'idpersona', 'foreign' => 'idpersona'));
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
    public function getById($idcantera, $inArray = true)
    {
        try {
            $query = Doctrine_Query::create()->from('DatCantera')->whereIn(
                'idcantera', Utiles::reflectArray($idcantera)
            )->execute();

            return ($inArray) ? $query->toArray() : $query;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }


    public function getCanteras($idpersona)
    {
        try {
            $query = Doctrine_Query::create()->from('DatCantera')->whereIn(
                'idpersona', Utiles::reflectArray($idpersona)
            );

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
    public function delCantera(array $idRow, $idPersona)
    {
        try {
            if (count($idRow) > 0) {

                $query = Doctrine_Query::create()->delete('DatCantera')->whereIn('idcantera', $idRow);
                if ($idPersona) {
                    $query->andWhere('idpersona = ?', $idPersona);
                }
                $query->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }


}