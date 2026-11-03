<?php

/**
 * Description of MaestroProductoValidator
 *
 * @author Administrador
 */
class MaestroProductoValidator extends ZendExt_Model
{
    const SELECT_QUERY = 'SELECT count(i.idindicador) as existe FROM NomIndicador i WHERE ';
    private $uiParams;

    public function __construct()
    {
        $this->uiParams = $_REQUEST;
    }

    private function validarExistenciaCodigo($campo = 'codigo', $codigo, $id = null)
    {
        
        $dql = MaestroProductoValidator::SELECT_QUERY . "i.{$campo} ilike '{$codigo}'";
        if (!is_null($id)) {
            $dql .= ' AND i.idindicador <> ' . $id;
        }
        $result = LogisticaDoctrineHelper::__init()->query($dql)->toArray();
        
        if (intval($result[0]['existe']) >= 1) {
            throw new ZendExt_Exception('LOG_MP_001');
        }
        return true;
    }

    private function validarExistenciaDenominacion($denom, $id = null)
    {
//        $dql = MaestroProductoValidator::SELECT_QUERY . "lower(i.denominacion) = lower('{$denom}')";
//        if (!is_null($id)) {
//            $dql .= ' AND i.idindicador <> ' . $id;
//        }
//        $result = LogisticaDoctrineHelper::__init()->query($dql)->toArray();
//        if ($result[0]['existe'] != 0) {
//            throw new ZendExt_Exception('LOG_MP_002');
//        }
        return true;
    }

    public function validarSalvarIndicador($params)
    {
        $id = $params['idindicador'];
        if ($params['numeropieza']) {
            $this->validarExistenciaCodigo('numeropieza', $params['numeropieza'], $id);
        }
        if($params['codigo']) {
            $this->validarExistenciaCodigo('codigo', $params['codigo'], $id);
        }
            
        
        
        //$this->validarExistenciaDenominacion($params['denominacion'], $id);
    }

}
