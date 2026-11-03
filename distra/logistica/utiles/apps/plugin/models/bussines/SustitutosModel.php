<?php

/**
 * @class         ProductoModel
 * Extension
 *
 * @package       Utiles
 * @subpackage    Plugin
 * @author        Maricet Estevez
 * @copyright (c) 2014, XETID
 * @version       1.0
 */
class SustitutosModel extends BaseModel  //SuministradorModel
{

    private $logisticaDoctrine;

    public function __construct()
    {
        parent::__construct();
        $this->logisticaDoctrine = LogisticaDoctrineHelper::__init();
    }

    public function getSustitutos($parametros)
    {
        $sql = "select * from mod_datosmaestros.fn_sustitutos({$parametros['idindicador']})";
        $datos = $this->logisticaDoctrine->getConnection()->fetchAll($sql);
        $idSustitutosArray = $this->objectHelper->extractValueFromArrayColumn($datos, 'idsustituto');
        return array('datos'=>$datos, 'total'=>count($datos), 'directo' => $datos[0]['directo'], 'sustitutos' =>$idSustitutosArray);
    }

    public function adicionarSustituto($parametros) {
        $obj = new DatIndicadorsustituto();
        $obj->synchronizeWithArray($parametros);
        return $obj->save();
    }

    public function eliminarSustituto($parametros) {
        return Doctrine_Query::create()
            ->delete()
            ->from('DatIndicadorsustituto')
            ->whereIn(
                'idindicador', json_decode($parametros['datos'])
            )
            ->execute();
    }

}
