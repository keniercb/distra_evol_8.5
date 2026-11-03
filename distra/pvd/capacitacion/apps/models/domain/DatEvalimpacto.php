<?php
class DatEvalimpacto extends BaseDatEvalimpacto
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatAccionparticipante',
            array('local' => 'idaccionparticipante', 'foreign' => 'idaccionparticipante')
        );
        $this->hasOne(
            'NomPeriodo',
            array('local' => 'idperiodo', 'foreign' => 'idperiodo')
        );
        $this->hasOne(
            'NomIndicadoramedir',
            array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
    }

    public function getById($idevalimpacto)
    {
        return Doctrine::getTable('DatEvalimpacto')->find($idevalimpacto);
    }

    public function getEvalImpactoByAccionParticipante($idaccionparticipante)
    {
        try {
            $select = "dd.*, dd.idvalorescala as idvalor, np.denominacion as periodo, 
                ni.denominacion as indicador, ni.idescala as idescala";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatEvalimpacto dd')
                ->innerJoin('dd.NomPeriodo np')
                ->innerJoin('dd.NomIndicadoramedir ni');
            if (!empty($idaccionparticipante)) {
                $query->addWhere("dd.idaccionparticipante = $idaccionparticipante");
            }
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getEvalImpactoByAccionParticipantePer($idaccionparticipante, $idperiodo)
    {
        try {
            $select
                = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatEvalimpacto dd');
            if (!empty($idaccionparticipante)) {
                $query->addWhere("dd.idaccionparticipante = $idaccionparticipante");
            }
            if (!empty($idperiodo)) {
                $query->addWhere("dd.idperiodo = $idperiodo");
            }
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}