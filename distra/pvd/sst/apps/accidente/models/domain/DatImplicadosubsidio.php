<?php
class DatImplicadosubsidio extends BaseDatImplicadosubsidio
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idimplicadosubsidio)
    {
        return Doctrine::getTable('DatImplicadosubsidio')->find($idimplicadosubsidio);
    }
    
    public function getSubsidios($idaccidenteimplicado, $inicio, $limite)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('DatImplicadosubsidio m')
            ->where("m.idaccidenteimplicado = '$idaccidenteimplicado'")
            ->orderBy('m.fregistro DESC');
        if (!empty($inicio) && !empty($limite)) {
            $queryObj->start($inicio)->limit($limite);
        }
        return $queryObj->fetchArray();
    }

    public function cantSubsidios($idaccidenteimplicado)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('DatImplicadosubsidio m')
            ->where("m.idaccidenteimplicado = '$idaccidenteimplicado'");
        return count($queryObj->fetchArray());
    }
    
}