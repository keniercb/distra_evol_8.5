<?php

class DatIntensidadconflicto extends BaseDatIntensidadconflicto {

    public function setUp() {
        parent:: setUp();
        $this->hasOne('DatEstudiocurvaconflicto', array('local' => 'idestudiocurvaconflicto', 'foreign' => 'idestudiocurvaconflicto'));
    }

    public function getByid($idintensidadconflicto) {
        return Doctrine::getTable('DatIntensidadconflicto')
                        ->find($idintensidadconflicto)
                        ->toArray();
    }

    public function existe($terminologia, $idestudio) {
        try {
            $select = ' select *';
            $from = ' from mod_planifintegracion.dat_intensidadconflicto den';
            $where = " where den.terminologia = '{$terminologia}' and den.idestudiocurvaconflicto = {$idestudio} ";
            $sql = $select . $from . $where;
            $result = Doctrine_Manager::getInstance()->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC); //¿o_0? 
            return $result;
        } catch (Exception $exc) {
            echo($exc->getMessage());
        }
    }

    static function getIntensidadconflicto($idestudiocurvaconflicto, $native) {
        try {
            $orderBy = ($native) ? 'ic.nivelintensidad asc' : 'ic.nivelintensidad desc';
            $q = Doctrine_Query::create();
            $q->select('ic.*')
                    ->from('DatIntensidadconflicto ic')
                    ->where('ic.idestudiocurvaconflicto = ?', $idestudiocurvaconflicto)
                    ->orderBy($orderBy)
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            $res = $q->execute();
            return $res;
        } catch (Exception $exc) {
            print_r($exc->getMessage());
            die;
        }
    }

}
