<?php
/**
 * @name ConfImportarcamposexcel - Clase del dominio para la configuracion de importar campos excel.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ConfImportarcamposexcel extends BaseConfImportarcamposexcel
{
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('ConfImportarexcel', array('local' => 'idimportarexcel', 'foreign' => 'idimportarexcel'));
    }
	
    public function obtenerPorId($idimportarcampoexcel)
    {
        return Doctrine::getTable('ConfImportarcamposexcel')->find($idimportarcampoexcel);
    }

  public function existeConfImportarCamposExcel($idimportarexcel,$idcampo)
  {
    $queryObj = Doctrine_Query::create()
      ->select('i.*')
      ->from('ConfImportarcamposexcel i')
      ->where("i.idimportarexcel = '$idimportarexcel' AND i.idcampo = '$idcampo'");

    return $queryObj->fetchArray();
  }
}
