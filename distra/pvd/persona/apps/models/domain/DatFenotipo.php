<?php

class DatFenotipo extends BaseDatFenotipo
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('NomColorpiel', array('local' => 'idcolorpiel', 'foreign' => 'idcolorpiel'));
        $this->hasOne('NomColorpelo', array('local' => 'idcolorpelo', 'foreign' => 'idcolorpelo'));
        $this->hasOne('NomColorojos', array('local' => 'idcolorojos', 'foreign' => 'idcolorojos'));
        $this->hasOne('NomGruposanguineo', array('local' => 'idgruposanguineo', 'foreign' => 'idgruposanguineo'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idfenotipo
     *
     * @return Doctrine_Record
     */
    public function getById($idfenotipo)
    {
        return Doctrine::getTable('DatFenotipo')->find($idfenotipo);
    }

    public function getDatosFenotipicosByPersona(array $idpersona, $filtro, $limit, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'df.*, no.denominacion as ojos, npiel.denominacion as piel, ' .
                'npelo.denominacion as pelo,nsang.denominacion as gruposanguineo'
            )->from('DatFenotipo df')->leftJoin('df.NomColorojos no')->leftJoin('df.NomColorpiel npiel')->leftJoin(
                'df.NomColorpelo npelo'
            )->leftJoin('df.NomGruposanguineo nsang')->whereIn('df.idpersona', $idpersona);
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            if ($filtro) {
                $query->andWhere(
                    "no.denominacion ilike '?' OR npiel.denominacion ilike '?' OR npelo.denominacion ilike '?'", $filtro
                );
            }
            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCantDatosFenotipicosByPersona(array $idpersona, $filtro)
    {
        try {
            $query = Doctrine_Query::create()->from('DatFenotipo df')->leftJoin('df.NomColorojos no')->leftJoin(
                'df.NomColorpiel npiel'
            )->leftJoin('df.NomColorpelo npelo')->whereIn('df.idpersona', $idpersona);
            if ($filtro) {
                $query->andWhere(
                    "no.denominacion ilike '?' OR npiel.denominacion ilike '?' OR npelo.denominacion ilike '?'", $filtro
                );
            }

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}

