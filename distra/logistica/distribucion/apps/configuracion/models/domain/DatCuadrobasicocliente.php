<?php

/**
 * @class      DatCuadrobasicocliente
 *
 * @package    Inventario
 * @subpackage Configuracion
 * @author     Manuel Yhon Figueroa
 * @copyright  XETID
 * @version    2.0
 */
class DatCuadrobasicocliente extends BaseDatCuadrobasicocliente
{

    public function setUp()
    {
        $this->hasOne('DatCuadrobasico', array('local' => 'idcuadrobasico', 'foreign' => 'idcuadrobasico'));
        parent:: setUp();
    }

    public function existeCuadroBasicoCliente($idcuadrobasico, $idcliente)
    {
        $existe = LogisticaDoctrineHelper::__init()->query(
            "SELECT count(dcbc.idcuadrobasicocliente) as cantidad "
            . "FROM DatCuadrobasicocliente dcbc WHERE dcbc.idcuadrobasico = {$idcuadrobasico} "
            . "AND dcbc.idcliente = {$idcliente}"
        )->toArray();
        return $existe[0]['cantidad'] == 0 ? false : true;
    }

    public function getClientesCuadrobasico($datosDoc, $idcuadrobasico)
    {
        $query = new Doctrine_Query();
        $query->select('dcbc.idcuadrobasicocliente, dcbc.idcuadrobasico, dcbc.idcliente')
            ->from('DatCuadrobasicocliente dcbc')
            ->where('dcbc.idcuadrobasico = ?', array($idcuadrobasico));
        $logisticaDoctrine = LogisticaDoctrineHelper::__init();
        $datos = $logisticaDoctrine->addQueryLimits($query, $datosDoc)->fetchArray();
        return array('cantidad' => $query->count(), 'datos' => $datos);
    }
}