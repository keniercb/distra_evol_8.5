<?php
class DatAccioncurso extends BaseDatAccioncurso
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatAccionn',
            array('local' => 'idaccion', 'foreign' => 'idaccion')
        );
        $this->hasOne(
            'NomCurso',
            array('local' => 'idcurso', 'foreign' => 'idcurso')
        );
        $this->hasMany(
            'DatParticipantecurso',
            array('local' => 'idaccioncurso', 'foreign' => 'idaccioncurso')
        );
    }

    public function getById($idaccioncurso)
    {
        return Doctrine::getTable('DatAccioncurso')->find($idaccioncurso);
    }

    public function getCursosByAccion($idaccion, $start, $limit)
    {
        try {
            $select
                = "dd.*,  nc.denominacion as denominacion";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatAccioncurso dd')
                ->innerJoin('dd.NomCurso nc');
            if (!empty($idaccion)) {
                $query->addWhere("dd.idaccion = $idaccion");
            }
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function cantAccionescurso($idaccion)
    {
        try {
            $select
                = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatAccioncurso dd');
            if (!empty($idaccion)) {
                $query->addWhere("dd.idaccion = $idaccion");
            }
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getAccionesCursosPart($idaccion, $idaccionparticipante)
    {
        try {
            $select = "dd.*,  nc.denominacion as denominacion, dpc.resultado as resultadocurso, 
                dpc.idparticipantecurso as idparticipantecurso";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatAccioncurso dd')
                ->innerJoin('dd.NomCurso nc');
            if ($idaccionparticipante) {
                $query->leftJoin(
                    "dd.DatParticipantecurso dpc on dpc.idaccioncurso=dd.idaccioncurso 
                    and dpc.idaccionparticipante = '$idaccionparticipante'"
                );
            }
            if (!empty($idaccion)) {
                $query->addWhere("dd.idaccion = $idaccion");
            }
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function existe($idaccion, $idcurso)
    {
        try {
            $select
                = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatAccioncurso dd')
                ->where("dd.idaccion = '$idaccion' AND dd.idcurso = '$idcurso'");
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}