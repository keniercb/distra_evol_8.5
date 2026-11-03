<?php

class DatMatrizimpactocruzado extends BaseDatMatrizimpactocruzado
{
    public function setUp() {
        parent:: setUp();
        $this->hasOne('DatVariableimpactocruzado', array('local' => 'idvariablefila', 'foreign' => 'idvariable'));
        $this->hasOne('DatVariableimpactocruzado', array('local' => 'idvariablecolumna', 'foreign' => 'idvariable'));
        $this->hasOne('NomImpactoflujos', array('local' => 'idimpacto', 'foreign' => 'idimpacto'));
    }

    public function getByid($idvariablefila) {
        return Doctrine::getTable('DatMatrizimpactocruzado')->find($idvariablefila)->toArray();
    }

    static function getByidFila($idvariablefila) {
        try {
            $q = Doctrine_Query::create();
            $q->select('v.*')->from('DatMatrizimpactocruzado v')
                ->where('v.idvariablefila =?', $idvariablefila)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            $res = $q->execute();
            return $res;
        } catch (Exception $exc) {
            print_r($exc->getMessage());
            die;
        }
    }

    static function getVariableImpactoByidFila($idvariablefila) {
        try {
            $q = Doctrine_Query::create();
            $q->select('v.idvariablefila, i.denominacion as impacto, vi.denominacion as variable')
                ->from('DatMatrizimpactocruzado v')
                ->innerJoin('v.NomImpactoflujos i')
                ->innerJoin('v.DatVariableimpactocruzado vi')
                ->where('v.idvariablefila =?', $idvariablefila)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            $res = $q->execute();
            return $res;
        } catch (Exception $exc) {
            print_r($exc->getMessage());
            die;
        }
    }

    static function getByFilaColumna($idvariablefila, $idvariablecolumna) {
        $q = Doctrine_Query::create();
        $q->select('v.*')->from('DatMatrizimpactocruzado v')
            ->where('v.idvariablefila = ?', $idvariablefila)
            ->addWhere('v.idvariablecolumna = ?', $idvariablecolumna);
        return $q->execute();
    }

    static function getMatrizByFilaColumna($idVariableFila, $idVariableColumna) {
        $q = Doctrine_Query::create();
        $q->from('DatMatrizimpactocruzado v')
            ->where('v.idvariablefila = ?', $idVariableFila)
            ->andWhere('v.idvariablecolumna = ?', $idVariableColumna);
        return $q->fetchArray();
    }

    static function getByidFilaconPesoImpacto($idvariablefila) {
        try {
            $q = Doctrine_Query::create();
            $q->select('v.*, i.peso')->from('DatMatrizimpactocruzado v')
                ->innerJoin('v.NomImpactoflujos i')
                ->where('v.idvariablefila =?', $idvariablefila)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            $res = $q->execute();
            return $res;
        } catch (Exception $exc) {
            print_r($exc->getMessage());
            die;
        }
    }

    static function getByidFilaasEdges($idvariables) {
        try {
            $q = Doctrine_Query::create();
            $q->select('v.idvariablefila, v.idvariablefila as from, v.idvariablecolumna as to , i.peso as label ')
                ->from('DatMatrizimpactocruzado v')
                ->innerJoin('v.NomImpactoflujos i')
                ->whereIn('v.idvariablefila ', $idvariables)
                ->andWhereIn('v.idvariablecolumna ', $idvariables)
                ->addWhere('i.peso !=?', 0)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            $res = $q->execute();
            return $res;
        } catch (Exception $exc) {
            print_r($exc->getMessage());
            die;
        }
    }
}