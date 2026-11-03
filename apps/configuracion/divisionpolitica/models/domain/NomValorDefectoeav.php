<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Domain
 * @version    1.0
 */
class NomValorDefectoeav extends BaseNomValorDefectoeav
{
    public function setUp()
    {
        parent::setUp();

        $this->hasOne('NomCamponiveleav', array('local' => 'idcampo', 'foreign' => 'idcampo'));
    }

    /**
     * Para obtener los valores de los campos
     *
     * @param int $idcampo Identificador de campo
     * @param int $limite  Límite superior
     *
     * @author Livan A Capote Valdes
     * @return array
     */
    static function buscarValoresDefecto($idcampo, $limite = 100)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('v.idvalordefecto,v.valorid,v.valor,v.idcampo,v.version')
            ->from('NomValorDefectoeav v')->where("v.idcampo='$idcampo'")
            ->limit($limite)->execute()->toArray();
        return $result;

    }

    /**
     * Para obtener los valores de los campos
     *
     * @param int $idcampo Identificador de campo
     *
     * @author Livan A Capote Valdes
     * @return array
     */
    static function buscarValoresCampo($idcampo)
    {
        $q = Doctrine_Query::create();
        $result = $q->select('t.*')
            ->from('NomValorDefectoeav t')
            ->where("t.idcampo = '$idcampo' ")
            ->orderBy(' t.idcampo ')
            ->execute()
            ->toArray();
        return $result;

    }
}
