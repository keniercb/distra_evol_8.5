<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 31/05/16
 * Time: 14:55
 */
class NomConceptosalarial extends BaseNomConceptosalarial
{
    public function setUp()
    {
        parent :: setUp();
    }

    public function getById($idcsalarial)
    {
        return Doctrine::getTable('NomConceptosalarial')->find($idcsalarial);
    }

    public function getConceptosSalarialesFijos($rt)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.idconceptosalarial, m.denominacion, m.reporte_registro_trabajadores as rt')
            ->from('NomConceptosalarial m')
            ->orderby('m.idconceptosalarial');
        if ($rt == 1) {
            $queryObj->where("m.reporte_registro_trabajadores = 1");
        }
        return $queryObj->fetchArray();
    }

    public function update($idconceptosalarial, $denominacion){
        $obj = $this->getById($idconceptosalarial);
        $obj->denominacion = $denominacion;
        $obj->save();
        return true;
    }
}