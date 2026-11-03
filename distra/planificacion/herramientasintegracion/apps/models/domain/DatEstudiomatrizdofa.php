<?php

class DatEstudiomatrizdofa extends BaseDatEstudiomatrizdofa
{

    public function setUp()
    {
        parent :: setUp ();
        $this->hasMany ('DatMatrizdofa', array ('local' => 'idestudiomatrizdofa', 'foreign' => 'idestudiomatrizdofa'));
    }

    public function getByid($idestudiomatrizdofa)
    {
        return Doctrine::getTable('DatEstudiomatrizdofa')->find($idestudiomatrizdofa)->toArray();
    }


    public function getMatrizDofa($idproyecto)
    {
        try {
            $q = Doctrine_Query::create();
            $q->select('emd.*')
                ->from('DatEstudiomatrizdofa emd')
                ->where('emd.idproyecto = ?', $idproyecto)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            $res = $q->execute();
            return $res;
        }
        catch (Exception $exc) {
            return $exc->getMessage();
        }
    }
}

