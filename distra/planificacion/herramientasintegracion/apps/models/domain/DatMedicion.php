<?php

class DatMedicion extends BaseDatMedicion
{
    public function setUp() {
        parent:: setUp();
        $this->hasOne('DatEstudiocurvaconflicto', array('local' => 'idestudiocurvaconflicto', 'foreign' => 'idestudiocurvaconflicto'));
    }

    public function getByid($idmedicion) {
        return Doctrine::getTable('DatMedicion')
            ->find($idmedicion)
            ->toArray();
    }

    static function getMedicion($idestudiocurvaconflicto) {
        try {
            $q = Doctrine_Query::create();
            $q->select('m.*')
                ->from('DatMedicion m')
                ->where('m.idestudiocurvaconflicto = ?', $idestudiocurvaconflicto)
                ->orderBy('m.fechamedicion asc')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            $res = $q->execute();
            return $res;
        } catch (Exception $exc) {
            print_r($exc->getMessage());
            die;
        }
    }
}