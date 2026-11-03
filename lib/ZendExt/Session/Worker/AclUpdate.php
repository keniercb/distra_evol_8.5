<?php
/**
 * Class ZendExt_Session_Worker_AclUpdate
 * Tarea que actualiza los permisos (ACL) de los usuarios en las sessiones abiertas.
 *
 * @author     : Yoandry Morejon Borbon
 * @copyright  XETID
 * @package    : Quarseg
 * @subpackage Usuario
 * @version    1.0-0
 */
class ZendExt_Session_Worker_AclUpdate
{
//extends Rabbit_AMQP_Abstract

    /**
     * Tarea que actualiza la ACL de los usuarios en las sesiones abiertas.
     *
     * @param array $args Parametros de entrada (1: idrol, 2:idusuario, 3:identidad).
     */
    public function work($args)
    {
        $class = 'ZendExt_Session_SaveHandler_Doctrine_Entity';
        $_sessionTable = new Doctrine_Table($class, $this->getDatabaseConnection(), true);
        $_expired = new DateTime('- ' . Zend_Session::getOptions('gc_maxlifetime') . ' seconds');
        $_sessionFilterSql = 'eliminar = false AND fechahora < ? AND idrol = ?';
        $_sessionFilterParamsArray = array($_expired->format(ZendExt_GlobalConcept::getInstance()->Formato->fechaHora),
                                           $args[1]);
        if (isset($args[2]) && !is_null($args[2])) {
            $_sessionFilterSql .= ' AND idusuario = ?';
            $_sessionFilterParamsArray[] = $args[2];
        }
        if (isset($args[3]) && !is_null($args[3])) {
            $_sessionFilterSql .= ' AND identidad = ?';
            $_sessionFilterParamsArray[] = $args[3];
        }
        $openedSessionsDataCollection = $_sessionTable->findBySql($_sessionFilterSql, $_sessionFilterParamsArray);
        foreach ($openedSessionsDataCollection as $sessionDataRecord) {
            $unSerializedDataSession = unserialize($sessionDataRecord->session);
            echo '<pre>';
            print_r($unSerializedDataSession);
            die;
        }
    }


    protected function getDatabaseConnection()
    {
        //Inicializacion de la conexion a la base de datos.
        try {
            return Doctrine_Manager::getInstance()->getConnection('session');
        } catch (Doctrine_Manager_Exception $e) {
            $configApp = new ZendExt_App_Config();
            $configApp->addBdToConfig('session');
            $_conn = ZendExt_Aspect_TransactionManager::getInstance()->openConections('session');
            $_conn->rollback();
            return $_conn;
        }
    }
}