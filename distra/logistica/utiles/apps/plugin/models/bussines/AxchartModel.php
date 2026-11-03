<?php
/**
 * @class         AxchartModel
 * Extension
 *
 * @package       Utiles
 * @subpackage    Plugin
 * @author        Division GE
 * @copyright (c) 2016, XETID
 * @version       1.0
 */
class AxchartModel extends ZendExt_Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function executeSqlQuery($sql)
    {
        $conn = Zend_Registry::get('conexion');
        return $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }
}