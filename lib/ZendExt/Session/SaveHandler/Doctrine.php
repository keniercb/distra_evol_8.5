<?php

/**
 * ZendExt_Session_SaveHandler_Doctrine
 *
 * Doctrine ORM Adapter for Zend session save handler.
 *
 * @property int                 $_lifetime
 * @property Doctrine_Connection $_conn
 * @property Doctrine_Table      $_sessionTable
 *
 * @package    Zeolides
 * @subpackage Session
 * @author     Yoandry Morejon Borbon (ymorejonb@xetid.cu)
 * @version    1.0.0
 */
class ZendExt_Session_SaveHandler_Doctrine implements Zend_Session_SaveHandler_Interface
{
    /**
     * Lifetime of your session
     *
     * @var integer
     */
    protected $_lifetime;

    /**
     * Database connection
     *
     * @var Doctrine_Connection
     */
    protected $_conn;

    /**
     * Doctrine session table
     *
     * @var Doctrine_Table
     */
    protected $_sessionTable;

    public function __construct(Doctrine_Connection $conn)
    {
        $this->_lifetime = Zend_Session::getOptions('gc_maxlifetime');
        $this->_conn = $conn;
        $this->_sessionTable = $this->_conn->getTable("ZendExt_Session_SaveHandler_Doctrine_Entity");
        register_shutdown_function('session_write_close');
    }

    /**
     * Open Session - retrieve resources
     *
     * @param string $save_path
     * @param string $name
     *
     * @return bool
     */
    public function open($savePath, $name)
    {
        return true;
    }

    /**
     * Close Session - free resources
     *
     * @return bool
     */
    public function close()
    {
        return true;
    }

    /**
     * Read session data
     *
     * @param string $id
     *
     * @return string
     */
    public function read($id)
    {
        $_sessionData = '';
        try {
            if ($_sessionEntity = $this->_sessionTable->findOneBy('sessionid', $id)) {
                /*if ($_sessionEntity->eliminar)
                    $_sessionEntity->delete($this->_conn);
                else*/
                $_sessionData = $_sessionEntity->session;
            }
        } catch (Exception $e) {
            $exceptionLog = new ZendExt_Exception_Log(new ZendExt_Exception('NOCONTROLLED', $e));
            $exceptionLog->handle();
        }
        return $_sessionData;
    }

    /**
     * Write Session - commit data to resource
     *
     * @param string $id
     * @param mixed  $data
     *
     * @return bool
     */
    public function write($id, $data)
    {
        try {
            $_sessionEntity = Doctrine_Query::create($this->_conn)
                ->select("*")
                ->from('ZendExt_Session_SaveHandler_Doctrine_Entity')
                ->where('sessionid=?', $id)
                ->limit(1)
                ->fetchOne(array(),null);
            if (!$_sessionEntity) {
                $_sessionEntity = new ZendExt_Session_SaveHandler_Doctrine_Entity();
            }
            /*elseif ($_sessionEntity->eliminar) {
                $_sessionEntity->delete($this->_conn);
                return false;
            }*/
            $profile = ZendExt_GlobalConcept::getInstance()->Perfil;
            $_sessionEntity->sessionid = $id;
            $_dateTime = new DateTime();
            $_sessionEntity->fecha = $_dateTime->format(ZendExt_GlobalConcept::getInstance()->Formato->fecha);
            $_sessionEntity->hora = $_dateTime->format(ZendExt_GlobalConcept::getInstance()->Formato->hora);
            $_sessionEntity->session = $data;
            $_sessionEntity->usuario = $profile->usuario;
            $_sessionEntity->ip = ZendExt_App::ipRealPcCliente();
            $_sessionEntity->idusuario = $profile->idusuario;
            $_sessionEntity->idrol = ($profile->idrol) ? $profile->idrol : null;
            $_sessionEntity->identidad = ($profile->identidad) ? $profile->identidad : null;
            $_sessionEntity->save($this->_conn);
        } catch (Exception $e) {
            $exceptionLog = new ZendExt_Exception_Log(new ZendExt_Exception('NOCONTROLLED', $e));
            $exceptionLog->handle();
            return false;
        }
        return true;
    }

    /**
     * Destroy Session - remove data from resource for
     * given session id
     *
     * @param string $id
     *
     * @return bool
     */
    public function destroy($id)
    {
        try {
            if ($_entity = $this->_sessionTable->findOneBy('sessionid', $id)) {
                return $_entity->delete($this->_conn);
            }
        } catch (Exception $e) {
            $exceptionLog = new ZendExt_Exception_Log(new ZendExt_Exception('NOCONTROLLED', $e));
            $exceptionLog->handle();
        }
        return false;
    }

    /**
     * Garbage Collection - remove old session data older
     * than $maxLifetime (in seconds)
     *
     * @param int $maxLifetime
     *
     * @return bool
     */
    public function gc($maxLifetime)
    {
        try {
            $expired = new DateTime('- ' . $maxLifetime . ' seconds');
            $date = $expired->format(ZendExt_GlobalConcept::getInstance()->Formato->fecha);
            $time = $expired->format(ZendExt_GlobalConcept::getInstance()->Formato->hora);
            Doctrine_Query::create($this->_conn)
                ->delete()
                ->from('ZendExt_Session_SaveHandler_Doctrine_Entity')
                ->where('fecha < ?', $date)
                ->orWhere('fecha = ? AND hora < ?', array($date, $time))
                ->execute();            
        } catch (Exception $e) {
            $exceptionLog = new ZendExt_Exception_Log(new ZendExt_Exception('NOCONTROLLED', $e));
            $exceptionLog->handle();
            return false;
        }
    }

    /**
     * Garbage Collection - remove old session data older
     * than $maxLifetime (in seconds)
     *
     * @param string $sessionid
     *
     * @return bool
     */
    public function clear($sessionid)
    {
        try {
            Doctrine_Query::create($this->_conn)
                ->delete()
                ->from('ZendExt_Session_SaveHandler_Doctrine_Entity')
                ->where('sessionid = ?', $sessionid)
                ->execute();
        } catch (Exception $e) {
            $exceptionLog = new ZendExt_Exception_Log(new ZendExt_Exception('NOCONTROLLED', $e));
            $exceptionLog->handle();
            return false;
        }
    }

    /**
     * Garbage Collection - remove old session data older
     * than $maxLifetime (in seconds)
     *
     * @param string $sessionid
     *
     * @return bool
     */
    public function clearAnnonimous()
    {
        try {
            Doctrine_Query::create($this->_conn)
                ->delete()
                ->from('ZendExt_Session_SaveHandler_Doctrine_Entity')
                ->where('usuario = ?', "anonimo")
                ->execute();
        } catch (Exception $e) {
            $exceptionLog = new ZendExt_Exception_Log(new ZendExt_Exception('NOCONTROLLED', $e));
            $exceptionLog->handle();
            return false;
        }
    }
}
