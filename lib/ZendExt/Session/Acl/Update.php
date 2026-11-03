<?php

/**
 * Class ZendExt_Session_Acl_Update
 * Clase que implementa la logica de actualizacion de los permisos (ACL) de los usuarios en las sessiones abiertas.
 *
 * @author     : Yoandry Morejon Borbon
 * @copyright  XETID
 * @package    : Quarseg
 * @subpackage Usuario
 * @version    1.0-0
 */
class ZendExt_Session_Acl_Update
{
    /**
     * Actualiza la ACL de los usuarios en las sesiones abiertas.
     *
     * @param array $roleList Listado de roles
     * @param array $userList Listado de usuarios
     * @param Amqp_Worker_Abstract $scope Instancia del worker que executa el metodo
     */
    public function init(array $roleList, array $userList, Amqp_Worker_Abstract $scope = null)
    {
        //Creando la entidad que almacena la session.
        $class = 'ZendExt_Session_SaveHandler_Doctrine_Entity';
        $_sessionTable = new Doctrine_Table($class, $this->getDatabaseConnection(), true);

        //Creando los filtros
        $_sessionFilterParamsArray = $roleList;
        foreach ($userList as $userId) {
            array_push($_sessionFilterParamsArray, $userId);
        }

        $_sessionFilterSql = '';
        if (count($roleList) > 0) {
            $_sessionFilterSql .= 'idrol IN (' . implode(',', array_fill(1, count($roleList), '?')) . ' )';
        }

        if (count($userList) > 0) {
            $implode = implode(',', array_fill(1, count($userList), '?'));
            $_sessionFilterSql .= (($_sessionFilterSql) ? ' AND ' : '') . 'idusuario IN (' . $implode . ')';
        }


        $openedSessionsDataCollection = $_sessionTable->findBySql($_sessionFilterSql, $_sessionFilterParamsArray);
        foreach ($openedSessionsDataCollection as $sessionDataRecord) {

            $unSerializedSessionData = $this->unSerializeSessionData($sessionDataRecord->session);

            if (is_object($unSerializedSessionData['Zeolides']['entidad'])) {

                $unSerializedSessionData['Zeolides']['acl'] = $this->getAcl($roleList);

                if (is_null($scope) && session_id() == $sessionDataRecord->sessionid) {

                    Zend_Registry::get('session')->acl = $unSerializedSessionData['Zeolides']['acl'];

                } else {

                    $sessionDataRecord->session = $this->serializeSessionData($unSerializedSessionData);
                    $sessionDataRecord->save();
                }
            }
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
            $_conn = ZendExt_Aspect_TransactionManager::getInstance()->openConections('session', false, false);
            return $_conn;
        }
    }

    protected function unSerializeSessionData($serializedSessionData)
    {
        $sessionTempList = explode('|', $serializedSessionData);
        $sessionTempListLength = count($sessionTempList);
        $nameSpace = $sessionTempList[0];
        $sessionDataList = array();
        for ($i = 0; $i < $sessionTempListLength; $i++) {
            if ($i > 0 && $i < $sessionTempListLength - 1) {
                if ($sessionTempList[$i][0] != 'a' || $sessionTempList[$i][0] != 'o') {
                    $needle = ';';
                } else {
                    $needle = '}';
                }
                $sessionDataList[$nameSpace] = unserialize(
                    substr($sessionTempList[$i], 0, strrpos($sessionTempList[$i], $needle) + 2)
                );
                $nameSpace = substr(
                    $sessionTempList[$i], strrpos($sessionTempList[$i], $needle) + 2, strlen($sessionTempList[$i])
                );
            } elseif ($i == $sessionTempListLength - 1) {
                $sessionDataList[$nameSpace] = unserialize($sessionTempList[$i]);
            }
        }
        return $sessionDataList;
    }

    protected function serializeSessionData($sessionDataByNameSpace)
    {
        $sessionData = '';
        foreach ($sessionDataByNameSpace as $nameSpace => $sessionDataMixed) {
            $sessionData .= $nameSpace . '|' . serialize($sessionDataMixed);
        }
        return $sessionData;
    }

    protected function getAcl($idrol)
    {
        $publicResource = ZendExt_Aspect_Security::getPublicResourse();
        $acl = $publicResource['Portal'];
        $acl['string'] = $publicResource['String'];
        $acl['access'] = false;
        return array_merge($acl, ZendExt_IoC::getInstance()->seguridad->getUserAclByRol($idrol));
    }
}