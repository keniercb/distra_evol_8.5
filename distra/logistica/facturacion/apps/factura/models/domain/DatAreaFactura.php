<?php

class DatAreaFactura extends BaseDatAreaFactura
{

    public function setUp()
    {
        $this->hasOne(
            'DatDocfactura', array('local' => 'idfactura', 'foreign' => 'idfactura')
        );
        parent::setUp();
    }

    public function getAreasByIdfactura($idfactura)
    {
        return Doctrine_Query::create()
            ->select('idarea')
            ->from('DatAreaFactura')
            ->where('idfactura = ?', array($idfactura))
            ->fetchArray();
    }

    public function getAreasByIdfacturaSql($idfactura)
    {
        $conn = Zend_Registry::get('conexion');
        return $conn->execute(
            "select idarea from mod_logfacturacion.dat_areafactura where idfactura = {$idfactura}"
        )
            ->fetchAll(PDO::FETCH_COLUMN);
    }

    public function getAreasByIdsFactura($idsfactura)
    {
        $conn = Zend_Registry::get('conexion');
        return $conn->execute(
            "select distinct daf.idarea from mod_logfacturacion.dat_areafactura daf where daf.idfactura in (" .
            implode(',', $idsfactura) . ")"
        )
            ->fetchAll(PDO::FETCH_COLUMN);
    }

    public function addSelectIdarea(Doctrine_Query $dql, $aliasExterno = 'df', $aliasLocal = 'daf')
    {
        $dql->addSelect("{$aliasExterno}.idfactura, {$aliasLocal}.idarea")
            ->leftJoin("{$aliasExterno}.DatAreaFactura {$aliasLocal}");
        return $dql;
    }

    public function deleteAreasFacturas($idsFacturas)
    {
        return Doctrine_Query::create()
            ->delete()
            ->from('DatAreaFactura')
            ->whereIn(
                'idfactura', $idsFacturas
            )
            ->execute();
    }
}
